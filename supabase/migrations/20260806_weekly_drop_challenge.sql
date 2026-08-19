-- Weekly Drop Challenge: 52-week streak of logging CS2 weekly drops.
-- Stats are derived from existing public.transactions (type = DROP).

CREATE TABLE IF NOT EXISTS public.weekly_drop_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  duration_weeks integer NOT NULL DEFAULT 52,
  status text NOT NULL DEFAULT 'active',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT weekly_drop_challenges_duration_check CHECK (duration_weeks > 0 AND duration_weeks <= 104),
  CONSTRAINT weekly_drop_challenges_status_check CHECK (status = ANY (ARRAY['active'::text, 'completed'::text, 'abandoned'::text]))
);

CREATE UNIQUE INDEX IF NOT EXISTS weekly_drop_challenges_one_active_per_user
  ON public.weekly_drop_challenges (user_id)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS weekly_drop_challenges_user_id_idx
  ON public.weekly_drop_challenges (user_id);

CREATE OR REPLACE FUNCTION public.set_weekly_drop_challenges_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS weekly_drop_challenges_set_updated_at ON public.weekly_drop_challenges;
CREATE TRIGGER weekly_drop_challenges_set_updated_at
  BEFORE UPDATE ON public.weekly_drop_challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.set_weekly_drop_challenges_updated_at();

ALTER TABLE public.weekly_drop_challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners read own weekly drop challenges" ON public.weekly_drop_challenges;
CREATE POLICY "Owners read own weekly drop challenges"
  ON public.weekly_drop_challenges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Writes go through SECURITY DEFINER RPCs only
GRANT SELECT ON TABLE public.weekly_drop_challenges TO authenticated;

-- CS week start (Wednesday) helper, mirrors get_user_drops_analytics
CREATE OR REPLACE FUNCTION public.cs_week_start(p_ts timestamptz)
RETURNS date
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT (date_trunc('week', p_ts - INTERVAL '2 days') + INTERVAL '2 days')::date;
$$;

CREATE OR REPLACE FUNCTION public.start_weekly_drop_challenge(p_duration_weeks integer DEFAULT 52)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  v_existing public.weekly_drop_challenges;
  v_row public.weekly_drop_challenges;
  v_duration integer := COALESCE(NULLIF(p_duration_weeks, 0), 52);
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF v_duration < 1 OR v_duration > 104 THEN
    RAISE EXCEPTION 'duration_weeks must be between 1 and 104';
  END IF;

  SELECT * INTO v_existing
  FROM public.weekly_drop_challenges
  WHERE user_id = uid AND status = 'active'
  LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'You already have an active challenge',
      'challenge_id', v_existing.id
    );
  END IF;

  INSERT INTO public.weekly_drop_challenges (user_id, started_at, duration_weeks, status)
  VALUES (uid, now(), v_duration, 'active')
  RETURNING * INTO v_row;

  RETURN jsonb_build_object(
    'success', true,
    'challenge', jsonb_build_object(
      'id', v_row.id,
      'started_at', v_row.started_at,
      'duration_weeks', v_row.duration_weeks,
      'status', v_row.status
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.abandon_weekly_drop_challenge()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  v_row public.weekly_drop_challenges;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.weekly_drop_challenges
  SET status = 'abandoned', updated_at = now()
  WHERE user_id = uid AND status = 'active'
  RETURNING * INTO v_row;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'No active challenge');
  END IF;

  RETURN jsonb_build_object('success', true, 'challenge_id', v_row.id);
END;
$$;

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

  -- Fallback: latest completed challenge for read-only recap
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

  -- Auto-complete when window ends
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

  -- Free drops (price 0): ROI is pure profit → treat as null / infinite on client
  -- If any DROP rows ever store a positive cost basis, use that.
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

  -- Build 52-week (or duration) timeline from challenge start (with per-week drop items)
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

  -- Current week number within challenge (1-based, clamped)
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

GRANT EXECUTE ON FUNCTION public.cs_week_start(timestamptz) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.start_weekly_drop_challenge(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.abandon_weekly_drop_challenge() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_weekly_drop_challenge() TO authenticated;
