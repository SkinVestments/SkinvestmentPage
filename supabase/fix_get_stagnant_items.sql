-- Fix for error 42804:
-- "Returned type timestamp with time zone does not match expected type timestamp without time zone in column 9"
-- Column 9 = last_activity
--
-- Run this in Supabase → SQL Editor after pasting YOUR existing query body
-- (from Dashboard → Database → Functions → get_stagnant_items)

-- OPTION A (recommended): change return type to timestamptz
-- In RETURNS TABLE, replace:
--   last_activity timestamp
-- with:
--   last_activity timestamptz

-- OPTION B: keep timestamp in RETURNS, cast in SELECT
-- In your final SELECT, wrap the last_activity expression:
--   your_last_activity_expression::timestamp AS last_activity

-- Example template (replace the inner SELECT with your real query):
/*
DROP FUNCTION IF EXISTS public.get_stagnant_items(integer);

CREATE OR REPLACE FUNCTION public.get_stagnant_items(p_days_threshold integer DEFAULT 180)
RETURNS TABLE (
  skin_id uuid,
  market_hash_name text,
  icon_url text,
  folder_id uuid,
  quantity numeric,
  avg_buy_price numeric,
  total_invested numeric,
  current_total_value numeric,
  last_activity timestamptz,
  days_stagnant integer
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- paste your SELECT here; last_activity must match timestamptz above
  SELECT ...;
$$;
*/
