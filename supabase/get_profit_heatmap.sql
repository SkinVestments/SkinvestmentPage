-- Profit heatmap: aggregates SELL transactions by day-of-week and month.
-- Frontend: supabase.rpc('get_profit_heatmap') — no parameters (uses auth.uid()).
--
-- ISODOW: 1 = Monday … 7 = Sunday
-- MONTH: 1 = January … 12 = December

/*
CREATE OR REPLACE FUNCTION public.get_profit_heatmap()
RETURNS TABLE (
  time_unit text,
  unit_value integer,
  total_revenue numeric,
  total_profit numeric,
  trades_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  RETURN QUERY
  SELECT
    'DOW'::text,
    EXTRACT(ISODOW FROM transaction_date)::integer,
    SUM(quantity * price)::numeric,
    SUM(COALESCE(realized_profit, 0))::numeric,
    COUNT(*)::integer
  FROM public.transactions
  WHERE user_id = auth.uid() AND type::text = 'SELL'
  GROUP BY EXTRACT(ISODOW FROM transaction_date)

  UNION ALL

  SELECT
    'MONTH'::text,
    EXTRACT(MONTH FROM transaction_date)::integer,
    SUM(quantity * price)::numeric,
    SUM(COALESCE(realized_profit, 0))::numeric,
    COUNT(*)::integer
  FROM public.transactions
  WHERE user_id = auth.uid() AND type::text = 'SELL'
  GROUP BY EXTRACT(MONTH FROM transaction_date);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_profit_heatmap() TO authenticated;
*/
