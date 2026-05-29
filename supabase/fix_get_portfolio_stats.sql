-- get_portfolio_stats — signature must match frontend RPC:
--   supabase.rpc('get_portfolio_stats', { p_user_id: user.id })
--
-- RETURNS TABLE column names must match SELECT aliases exactly.

/*
CREATE OR REPLACE FUNCTION public.get_portfolio_stats(p_user_id uuid)
RETURNS TABLE (
  total_invested numeric,
  total_transactions bigint,
  total_earned numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(SUM(quantity * price) FILTER (WHERE type::text = 'BUY'), 0) AS total_invested,
    COUNT(*)::bigint AS total_transactions,
    COALESCE(SUM(realized_profit), 0) AS total_earned
  FROM public.transactions
  WHERE user_id = p_user_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_portfolio_stats(uuid) TO authenticated;
*/

-- If type is an enum, use type::text = 'BUY' in FILTER (see example above).
-- Optional hardening: only allow reading own rows:
--   WHERE user_id = p_user_id AND p_user_id = auth.uid();
