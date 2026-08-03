-- Flexible skin search: match all query tokens in any order (ignores "|", "-", order).
-- Speeds up with pg_trgm GIN on market_hash_name.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_cs2_items_market_hash_name_trgm
  ON public.cs2_items
  USING gin (market_hash_name gin_trgm_ops);

CREATE OR REPLACE FUNCTION public.normalize_cs2_search_text(p_text text)
RETURNS text
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT lower(regexp_replace(COALESCE(p_text, ''), '[^a-zA-Z0-9]+', '', 'g'));
$$;

CREATE OR REPLACE FUNCTION public.search_cs2_items_flexible(
  p_query text,
  p_limit integer DEFAULT 25
)
RETURNS TABLE (
  id text,
  market_hash_name text,
  icon_url text,
  price numeric,
  rarity text,
  type text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tokens text[];
  lim integer := GREATEST(1, LEAST(COALESCE(p_limit, 25), 50));
BEGIN
  SELECT COALESCE(array_agg(DISTINCT t), ARRAY[]::text[])
  INTO tokens
  FROM (
    SELECT unnest(regexp_split_to_array(lower(trim(COALESCE(p_query, ''))), '[^a-z0-9]+')) AS t
  ) s
  WHERE length(t) >= 2;

  IF cardinality(tokens) = 0 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    ci.id::text,
    ci.market_hash_name,
    ci.icon_url,
    ci.price::numeric,
    ci.rarity,
    ci.type
  FROM public.cs2_items ci
  WHERE (
    SELECT bool_and(
      public.normalize_cs2_search_text(ci.market_hash_name)
        LIKE '%' || public.normalize_cs2_search_text(tok) || '%'
    )
    FROM unnest(tokens) AS tok
  )
  ORDER BY
    CASE
      WHEN public.normalize_cs2_search_text(ci.market_hash_name)
        LIKE public.normalize_cs2_search_text(tokens[1]) || '%'
      THEN 0
      ELSE 1
    END,
    CASE
      WHEN ci.market_hash_name ILIKE '%' || p_query || '%' THEN 0
      ELSE 1
    END,
    ci.market_hash_name ASC
  LIMIT lim;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_cs2_items_flexible(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_cs2_items_flexible(text, integer) TO anon;

-- Existing Log Drop RPC: same token matching, keep name/photo/category aliases.
DROP FUNCTION IF EXISTS public.search_cs2_items(text);

CREATE OR REPLACE FUNCTION public.search_cs2_items(search_query text)
RETURNS TABLE (
  id uuid,
  name text,
  photo text,
  price numeric,
  category text,
  rarity text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    f.id::uuid,
    f.market_hash_name AS name,
    f.icon_url AS photo,
    COALESCE(f.price, 0) AS price,
    f.type AS category,
    f.rarity
  FROM public.search_cs2_items_flexible(search_query, 20) f;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_cs2_items(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_cs2_items(text) TO anon;
