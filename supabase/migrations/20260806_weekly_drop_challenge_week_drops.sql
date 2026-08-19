-- Adds per-week drop item details to get_weekly_drop_challenge (hover / click UI).
-- Safe to re-run: CREATE OR REPLACE only.

CREATE OR REPLACE FUNCTION public.get_weekly_drop_challenge()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  v_challenge public.weekly_drop_challenges;
  v_start timestamptz;
  v_end timestamptz;
  v_duration integer;
  v_weeks_completed integer := 0;
  v_current_value numeric := 0;
  v_highest numeric := NULL;
  v_lowest numeric := NULL;
  v_average numeric := 0;
  v_roi numeric := NULL;
  v_drop_count integer := 0;
  v_this_week_claimed boolean := false;
  v_current_cs_week date;
  v_week_index integer;
  v_status text;
  v_weeks jsonb := '[]'::jsonb;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_challenge
  FROM public.weekly_drop_challenges
  WHERE user_id = uid AND status = 'active'
  ORDER BY started_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    SELECT * INTO v_challenge
    FROM public.weekly_drop_challenges
    WHERE user_id = uid AND status = 'completed'
    ORDER BY completed_at DESC NULLS LAST, started_at DESC
    LIMIT 1;
  END IF;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'has_challenge', false,
      'challenge', NULL,
      'stats', NULL
    );
  END IF;

  v_start := v_challenge.started_at;
  v_duration := v_challenge.duration_weeks;
  v_end := v_start + make_interval(weeks => v_duration);
  v_status := v_challenge.status;
  v_current_cs_week := public.cs_week_start(now());

  IF v_status = 'active' AND now() >= v_end THEN
    UPDATE public.weekly_drop_challenges
    SET status = 'completed', completed_at = now(), updated_at = now()
    WHERE id = v_challenge.id
    RETURNING * INTO v_challenge;
    v_status := 'completed';
  END IF;

  CREATE TEMP TABLE tmp_challenge_drops ON COMMIT DROP AS
  SELECT
    t.id,
    t.transaction_date,
    t.quantity,
    (t.quantity * COALESCE(i.price, 0)) AS item_value,
    i.market_hash_name AS name,
    i.icon_url,
    public.cs_week_start(t.transaction_date) AS cs_week
  FROM public.transactions t
  JOIN public.cs2_items i ON t.item_id = i.id
  WHERE t.user_id = uid
    AND t.type = 'DROP'
    AND t.transaction_date >= v_start
    AND t.transaction_date < v_end;

  SELECT
    COALESCE(SUM(item_value), 0),
    COALESCE(SUM(quantity), 0),
    MAX(item_value),
    MIN(item_value)
  INTO v_current_value, v_drop_count, v_highest, v_lowest
  FROM tmp_challenge_drops;

  SELECT COUNT(DISTINCT cs_week)::integer
  INTO v_weeks_completed
  FROM tmp_challenge_drops;

  IF v_weeks_completed > 0 THEN
    v_average := v_current_value / v_weeks_completed;
  END IF;

  SELECT
    CASE
      WHEN COALESCE(SUM(t.quantity * t.price), 0) > 0 THEN
        ROUND(
          ((COALESCE(SUM(t.quantity * COALESCE(i.price, 0)), 0) - SUM(t.quantity * t.price))
            / SUM(t.quantity * t.price)) * 100,
          2
        )
      ELSE NULL
    END
  INTO v_roi
  FROM public.transactions t
  JOIN public.cs2_items i ON t.item_id = i.id
  WHERE t.user_id = uid
    AND t.type = 'DROP'
    AND t.transaction_date >= v_start
    AND t.transaction_date < v_end;

  SELECT EXISTS(
    SELECT 1 FROM tmp_challenge_drops WHERE cs_week = v_current_cs_week
  ) INTO v_this_week_claimed;

  WITH series AS (
    SELECT
      n AS week_index,
      public.cs_week_start(v_start + make_interval(weeks => n)) AS week_start
    FROM generate_series(0, GREATEST(v_duration - 1, 0)) n
  ),
  week_drops AS (
    SELECT
      d.cs_week,
      COALESCE(
        jsonb_agg(
          jsonb_build_object(
            'id', d.id,
            'name', d.name,
            'icon_url', d.icon_url,
            'value', ROUND(d.item_value, 2),
            'quantity', d.quantity,
            'transaction_date', d.transaction_date
          )
          ORDER BY d.item_value DESC, d.transaction_date ASC
        ),
        '[]'::jsonb
      ) AS drops,
      COALESCE(SUM(d.item_value), 0) AS week_value
    FROM tmp_challenge_drops d
    GROUP BY d.cs_week
  ),
  week_vals AS (
    SELECT
      s.week_index,
      s.week_start,
      COALESCE(wd.week_value, 0) AS week_value,
      COALESCE(wd.drops, '[]'::jsonb) AS drops,
      (wd.cs_week IS NOT NULL) AS claimed
    FROM series s
    LEFT JOIN week_drops wd ON wd.cs_week = s.week_start
  )
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'week_index', week_index + 1,
      'week_start', week_start,
      'claimed', claimed,
      'value', ROUND(week_value, 2),
      'drops', drops,
      'is_current', week_start = v_current_cs_week,
      'is_future', week_start > v_current_cs_week
    )
    ORDER BY week_index
  ), '[]'::jsonb)
  INTO v_weeks
  FROM week_vals;

  v_week_index := LEAST(
    v_duration,
    GREATEST(
      1,
      (public.cs_week_start(now()) - public.cs_week_start(v_start)) / 7 + 1
    )
  );

  DROP TABLE tmp_challenge_drops;

  RETURN jsonb_build_object(
    'has_challenge', true,
    'challenge', jsonb_build_object(
      'id', v_challenge.id,
      'started_at', v_challenge.started_at,
      'ends_at', v_end,
      'duration_weeks', v_duration,
      'status', v_status,
      'completed_at', v_challenge.completed_at,
      'current_week_index', v_week_index
    ),
    'stats', jsonb_build_object(
      'weeks_completed', v_weeks_completed,
      'duration_weeks', v_duration,
      'current_value', ROUND(v_current_value, 2),
      'highest_drop', CASE WHEN v_highest IS NULL THEN NULL ELSE ROUND(v_highest, 2) END,
      'lowest_drop', CASE WHEN v_lowest IS NULL THEN NULL ELSE ROUND(v_lowest, 2) END,
      'average_per_week', ROUND(v_average, 2),
      'roi_percentage', v_roi,
      'drop_count', v_drop_count,
      'this_week_claimed', v_this_week_claimed,
      'projected_yearly', ROUND(v_average * 52, 2)
    ),
    'weeks', v_weeks
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_weekly_drop_challenge() TO authenticated;
