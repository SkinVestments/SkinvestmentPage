-- Paginated transaction history for a public portfolio share link.

CREATE OR REPLACE FUNCTION public.get_public_portfolio_history(
  p_token text,
  p_page integer DEFAULT 1,
  p_page_size integer DEFAULT 15
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  share_user uuid;
  page_num integer := GREATEST(COALESCE(p_page, 1), 1);
  page_size integer := LEAST(GREATEST(COALESCE(p_page_size, 15), 1), 50);
  offset_n integer;
  total_count integer := 0;
  items_json jsonb := '[]'::jsonb;
BEGIN
  IF p_token IS NULL OR length(trim(p_token)) < 16 THEN
    RETURN NULL;
  END IF;

  SELECT ps.user_id
  INTO share_user
  FROM public.portfolio_shares ps
  WHERE ps.token = trim(p_token)
    AND ps.enabled = true
  LIMIT 1;

  IF share_user IS NULL THEN
    RETURN NULL;
  END IF;

  offset_n := (page_num - 1) * page_size;

  SELECT COUNT(*)::int
  INTO total_count
  FROM public.transactions t
  WHERE t.user_id = share_user
    AND t.item_id IN (
      SELECT DISTINCT pi.item_id
      FROM public.portfolio_items pi
      WHERE pi.user_id = share_user
        AND pi.quantity > 0
    );

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', x.id,
        'type', x.type,
        'quantity', x.quantity,
        'price', x.price,
        'transaction_date', x.transaction_date,
        'market_hash_name', x.market_hash_name,
        'icon_url', x.icon_url,
        'rarity', x.rarity
      )
      ORDER BY x.sort_date DESC
    ),
    '[]'::jsonb
  )
  INTO items_json
  FROM (
    SELECT
      t.id,
      t.type,
      t.quantity,
      t.price,
      COALESCE(t.transaction_date, t.created_at) AS transaction_date,
      COALESCE(t.transaction_date, t.created_at) AS sort_date,
      COALESCE(ci.market_hash_name, 'Unknown item') AS market_hash_name,
      ci.icon_url,
      ci.rarity
    FROM public.transactions t
    LEFT JOIN public.cs2_items ci ON ci.id = t.item_id
    WHERE t.user_id = share_user
      AND t.item_id IN (
        SELECT DISTINCT pi.item_id
        FROM public.portfolio_items pi
        WHERE pi.user_id = share_user
          AND pi.quantity > 0
      )
    ORDER BY COALESCE(t.transaction_date, t.created_at) DESC
    LIMIT page_size
    OFFSET offset_n
  ) x;

  RETURN jsonb_build_object(
    'items', items_json,
    'total_count', total_count,
    'page', page_num,
    'page_size', page_size
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_portfolio_history(text, integer, integer) TO anon, authenticated;
