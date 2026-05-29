-- Price-based "Luck Score" (0-100) for logged drops.
-- Compares user's median drop value vs global median drop value in the same period.
-- Includes small-sample penalty so a few drops won't spike to 100.
--
-- Frontend call:
--   supabase.rpc('get_user_luck_score', { period_text: 'ALL' })
--
-- Notes:
-- - Uses auth.uid() (no p_user_id).
-- - Assumes drops are transactions where type = 'DROP' and item_id joins cs2_items.
-- - If "type" is an enum, we use type::text = 'DROP'.

/*
CREATE OR REPLACE FUNCTION public.get_user_luck_score(period_text text DEFAULT 'ALL')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_start_date timestamptz;

  v_user_median numeric := 0;
  v_global_median numeric := 0;
  v_drop_count integer := 0;

  v_ratio numeric := 1;
  v_raw numeric := 0;
  v_weight numeric := 0;
  v_score numeric := 50;
  v_label text := 'Average';
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Period window (same convention as other RPCs)
  CASE period_text
    WHEN '7D' THEN v_start_date := NOW() - INTERVAL '7 days';
    WHEN '1M' THEN v_start_date := NOW() - INTERVAL '1 month';
    WHEN '3M' THEN v_start_date := NOW() - INTERVAL '3 months';
    WHEN '6M' THEN v_start_date := NOW() - INTERVAL '6 months';
    WHEN '1Y' THEN v_start_date := NOW() - INTERVAL '1 year';
    WHEN '5Y' THEN v_start_date := NOW() - INTERVAL '5 years';
    ELSE v_start_date := '1970-01-01'::timestamptz;
  END CASE;

  WITH user_drops AS (
    SELECT (t.quantity * COALESCE(i.price, 0))::numeric AS drop_value
    FROM public.transactions t
    JOIN public.cs2_items i ON t.item_id = i.id
    WHERE t.user_id = v_user_id
      AND t.transaction_date >= v_start_date
      AND t.type::text = 'DROP'
      AND t.quantity > 0
  )
  SELECT
    COALESCE((SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY drop_value) FROM user_drops), 0),
    COALESCE((SELECT COUNT(*) FROM user_drops), 0)
  INTO v_user_median, v_drop_count;

  WITH global_drops AS (
    SELECT (t.quantity * COALESCE(i.price, 0))::numeric AS drop_value
    FROM public.transactions t
    JOIN public.cs2_items i ON t.item_id = i.id
    WHERE t.transaction_date >= v_start_date
      AND t.type::text = 'DROP'
      AND t.quantity > 0
  )
  SELECT
    COALESCE(percentile_cont(0.5) WITHIN GROUP (ORDER BY drop_value), 0)
  INTO v_global_median
  FROM global_drops;

  -- Ratio + transform. Add +1 to be safe with zeros.
  v_ratio := (v_user_median + 1) / (v_global_median + 1);
  -- Raw in [-inf, inf], centered at 0 for "average luck"
  v_raw := LN(v_ratio);
  -- Small-sample penalty: quickly ramps up, saturates near 1
  v_weight := 1 - EXP(- (v_drop_count::numeric / 15));
  -- Squash to [-1, 1] using tanh then map to [0, 100]
  v_score := 50 + (50 * TANH(v_raw) * v_weight);
  v_score := GREATEST(0, LEAST(100, v_score));

  IF v_drop_count < 3 THEN
    v_label := 'Too early';
  ELSIF v_score >= 85 THEN
    v_label := 'Blessed';
  ELSIF v_score >= 70 THEN
    v_label := 'Lucky';
  ELSIF v_score >= 55 THEN
    v_label := 'Above average';
  ELSIF v_score >= 45 THEN
    v_label := 'Average';
  ELSIF v_score >= 30 THEN
    v_label := 'Unlucky';
  ELSE
    v_label := 'Cursed';
  END IF;

  RETURN jsonb_build_object(
    'period_text', period_text,
    'luck_score', ROUND(v_score, 1),
    'label', v_label,
    'drops_count', v_drop_count,
    'user_median_drop_value', ROUND(v_user_median, 2),
    'global_median_drop_value', ROUND(v_global_median, 2)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_luck_score(text) TO authenticated;
*/

