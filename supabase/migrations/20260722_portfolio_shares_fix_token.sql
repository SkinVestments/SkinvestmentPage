-- Hotfix: re-apply token generator if enable_portfolio_share failed with
-- "function gen_random_bytes(integer) does not exist"

CREATE OR REPLACE FUNCTION public.generate_portfolio_share_token()
RETURNS text
LANGUAGE sql
VOLATILE
AS $$
  SELECT replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
$$;
