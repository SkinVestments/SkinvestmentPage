-- get_portfolio_current_values — align signature with jsonb body
--
-- Your function body ends with:
--   RETURN jsonb_build_object(
--     'total_portfolio_value', ...,
--     'investments_value', ...,
--     'inventory_value', ...,
--     'deposited', ...,
--     'withdrawn', ...,
--     'period_gain_value', ...,
--     'period_roi_percentage', ...
--   );
--
-- The function MUST declare RETURNS jsonb (not RETURNS TABLE).
-- Wrong TABLE column names/types cause PostgREST / 42804 errors.
--
-- Frontend RPC: supabase.rpc('get_portfolio_current_values', { period_text: '1M' })
-- Parameter name: period_text (not p_time_range, not p_user_id — uses auth.uid()).
--
-- Drop old overloads if you changed the signature:
-- DROP FUNCTION IF EXISTS public.get_portfolio_current_values(uuid, text);
-- DROP FUNCTION IF EXISTS public.get_portfolio_current_values(text);

/*
CREATE OR REPLACE FUNCTION public.get_portfolio_current_values(period_text text DEFAULT '1M')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid := auth.uid();
    -- ... paste your DECLARE / BEGIN / END body ...
BEGIN
    -- your full function body
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_portfolio_current_values(text) TO authenticated;
*/
