-- RPC for Steam vs CS.MONEY price comparison on /inventory.
-- Frontend passes item_ids from the loaded list; returns prices, daily change, spread.
-- Max 2000 ids per call (enforced by cardinality check).

CREATE OR REPLACE FUNCTION public.get_market_prices_for_items(p_item_ids uuid[])
RETURNS TABLE(
    item_id            uuid,
    steam_price        numeric,
    csmoney_price      numeric,
    csmoney_listings   integer,
    csmoney_updated_at timestamptz,
    csmoney_prev_price numeric,
    csmoney_change_pct numeric,
    spread_pct         numeric
)
LANGUAGE sql STABLE
SET search_path TO ''
AS $$
  SELECT
    i.id,
    i.price,
    mp.price,
    mp.listings_count,
    mp.updated_at,
    prev.price,
    CASE WHEN prev.price > 0 AND mp.price IS NOT NULL
         THEN ROUND((mp.price / prev.price - 1) * 100, 2) END,
    CASE WHEN i.price > 0 AND mp.price IS NOT NULL
         THEN ROUND((mp.price / i.price - 1) * 100, 2) END
  FROM public.cs2_items i
  LEFT JOIN public.cs2_item_market_prices mp
         ON mp.item_id = i.id AND mp.source = 'csmoney'
  LEFT JOIN LATERAL (
    SELECT h.price
    FROM public.cs2_item_market_price_history h
    WHERE h.item_id = i.id
      AND h.source = 'csmoney'
      AND h.day < (now() AT TIME ZONE 'UTC')::date
    ORDER BY h.day DESC
    LIMIT 1
  ) prev ON true
  WHERE i.id = ANY(p_item_ids)
    AND cardinality(p_item_ids) <= 2000;
$$;

REVOKE ALL ON FUNCTION public.get_market_prices_for_items(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_market_prices_for_items(uuid[]) TO authenticated;
