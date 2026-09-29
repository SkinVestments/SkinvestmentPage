-- Admin portfolio lookup (read-only) + trial activation aggregates.
-- Does NOT modify existing share-portfolio RLS or RPCs.
--
-- MFA: set require_aal2 := true in public.admin_assert_caller() after enabling
-- TOTP in Supabase Dashboard and enrolling admin accounts.
--
-- Bootstrap an admin (SQL editor / service role only):
--   INSERT INTO public.admins (user_id) VALUES ('<auth-user-uuid>');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
-- No policies for anon/authenticated: clients cannot read or write.

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  target_user_id uuid NULL,
  action text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_audit_log_admin_created_idx
  ON public.admin_audit_log (admin_id, created_at DESC);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
-- No client policies.

-- Optional RevenueCat / trial mapping (app_user_id = auth user uuid text in checkout URLs).
-- Fill via webhook/sync later; empty table ⇒ trial stats return available=false.
CREATE TABLE IF NOT EXISTS public.revenuecat_entitlements (
  app_user_id text PRIMARY KEY,
  user_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  entitlement_status text NOT NULL DEFAULT 'unknown',
  trial_started_at timestamptz,
  trial_ended_at timestamptz,
  converted_to_paid boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT revenuecat_entitlements_status_check CHECK (
    entitlement_status = ANY (
      ARRAY[
        'trialing'::text,
        'active'::text,
        'expired'::text,
        'cancelled'::text,
        'unknown'::text
      ]
    )
  )
);

ALTER TABLE public.revenuecat_entitlements ENABLE ROW LEVEL SECURITY;
-- No client policies.

REVOKE ALL ON TABLE public.admins FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.admin_audit_log FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.revenuecat_entitlements FROM PUBLIC, anon, authenticated;

GRANT ALL ON TABLE public.admins TO service_role;
GRANT ALL ON TABLE public.admin_audit_log TO service_role;
GRANT ALL ON TABLE public.revenuecat_entitlements TO service_role;

-- ---------------------------------------------------------------------------
-- Shared access gate (admin + optional MFA + rate limit helper)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.admin_assert_caller()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  -- Flip to true after TOTP MFA is enabled in Auth and admins are enrolled.
  require_aal2 boolean := false;
  v_admin uuid := auth.uid();
  v_aal text;
  v_recent int;
  v_rate_limit int := 30; -- max lookups per admin per rolling minute
BEGIN
  IF v_admin IS NULL THEN
    RAISE EXCEPTION 'Not authenticated'
      USING ERRCODE = '42501';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.admins a WHERE a.user_id = v_admin
  ) THEN
    RAISE EXCEPTION 'Admin access required'
      USING ERRCODE = '42501';
  END IF;

  IF require_aal2 THEN
    v_aal := coalesce(auth.jwt() ->> 'aal', 'aal1');
    IF v_aal IS DISTINCT FROM 'aal2' THEN
      RAISE EXCEPTION 'MFA required (aal2)'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  SELECT count(*)::int
  INTO v_recent
  FROM public.admin_audit_log l
  WHERE l.admin_id = v_admin
    AND l.created_at > (now() - interval '1 minute')
    AND l.action IN (
      'admin_get_user_portfolio',
      'admin_trial_activation_stats'
    );

  IF v_recent >= v_rate_limit THEN
    RAISE EXCEPTION 'Admin rate limit exceeded (max %/min)', v_rate_limit
      USING ERRCODE = '54000';
  END IF;

  RETURN v_admin;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_assert_caller() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_assert_caller() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.admin_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  require_aal2 boolean := false;
  v_admin uuid := auth.uid();
  v_aal text;
BEGIN
  IF v_admin IS NULL THEN
    RETURN false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.admins a WHERE a.user_id = v_admin
  ) THEN
    RETURN false;
  END IF;

  IF require_aal2 THEN
    v_aal := coalesce(auth.jwt() ->> 'aal', 'aal1');
    IF v_aal IS DISTINCT FROM 'aal2' THEN
      RETURN false;
    END IF;
  END IF;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_is_admin() TO authenticated, service_role;

-- Keep require_aal2 flags in sync: edit BOTH admin_assert_caller and admin_is_admin.

-- ---------------------------------------------------------------------------
-- admin_get_user_portfolio
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.admin_get_user_portfolio(target_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  v_admin uuid;
  v_exists boolean;
  v_nickname text;
  v_plan text;
  v_profile_created timestamptz;
  v_registered_at timestamptz;
  v_last_sign_in timestamptz;
  v_last_tx timestamptz;
  v_last_portfolio timestamptz;
  v_last_activity timestamptz;
  v_first_skin timestamptz;
  v_last_skin timestamptz;
  v_item_count int;
  v_total_qty int;
  v_portfolio_value numeric;
  v_rc_status text;
  v_rc_converted boolean;
  v_rc_trial_started timestamptz;
  v_rc_trial_ended timestamptz;
  v_items jsonb;
BEGIN
  -- 1) AuthZ first
  v_admin := public.admin_assert_caller();

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid user id'
      USING ERRCODE = '22P02';
  END IF;

  -- 2) Audit before data access
  INSERT INTO public.admin_audit_log (admin_id, target_user_id, action)
  VALUES (v_admin, target_user_id, 'admin_get_user_portfolio');

  SELECT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = target_user_id
  )
  INTO v_exists;

  IF NOT v_exists THEN
    RETURN jsonb_build_object(
      'found', false,
      'user_id', target_user_id
    );
  END IF;

  -- No set_config impersonation needed: SECURITY DEFINER + explicit user_id filters.

  SELECT
    p.nickname,
    p.plan_subscription::text,
    p.created_at
  INTO v_nickname, v_plan, v_profile_created
  FROM public.profiles p
  WHERE p.id = target_user_id;

  SELECT u.created_at, u.last_sign_in_at
  INTO v_registered_at, v_last_sign_in
  FROM auth.users u
  WHERE u.id = target_user_id;

  SELECT max(t.created_at)
  INTO v_last_tx
  FROM public.transactions t
  WHERE t.user_id = target_user_id;

  SELECT max(pi.updated_at)
  INTO v_last_portfolio
  FROM public.portfolio_items pi
  WHERE pi.user_id = target_user_id;

  v_last_activity := greatest(
    v_last_sign_in,
    v_last_tx,
    v_last_portfolio
  );

  SELECT min(pi.acquired_at), max(pi.acquired_at)
  INTO v_first_skin, v_last_skin
  FROM public.portfolio_items pi
  WHERE pi.user_id = target_user_id
    AND pi.quantity > 0;

  SELECT
    count(*)::int,
    coalesce(sum(pi.quantity), 0)::int,
    coalesce(sum(pi.quantity * coalesce(ci.price, 0)), 0)
  INTO v_item_count, v_total_qty, v_portfolio_value
  FROM public.portfolio_items pi
  LEFT JOIN public.cs2_items ci ON ci.id = pi.item_id
  WHERE pi.user_id = target_user_id
    AND pi.quantity > 0;

  SELECT
    re.entitlement_status,
    re.converted_to_paid,
    re.trial_started_at,
    re.trial_ended_at
  INTO v_rc_status, v_rc_converted, v_rc_trial_started, v_rc_trial_ended
  FROM public.revenuecat_entitlements re
  WHERE re.app_user_id = target_user_id::text
     OR re.user_id = target_user_id
  LIMIT 1;

  SELECT coalesce(
    jsonb_agg(
      jsonb_build_object(
        'market_hash_name', coalesce(ci.market_hash_name, 'Unknown'),
        'icon_url', ci.icon_url,
        'rarity', ci.rarity,
        'type', ci.type,
        'quantity', pi.quantity,
        'unit_price', coalesce(ci.price, 0),
        'position_value', pi.quantity * coalesce(ci.price, 0),
        'acquired_at', pi.acquired_at
      )
      ORDER BY (pi.quantity * coalesce(ci.price, 0)) DESC
    ),
    '[]'::jsonb
  )
  INTO v_items
  FROM public.portfolio_items pi
  LEFT JOIN public.cs2_items ci ON ci.id = pi.item_id
  WHERE pi.user_id = target_user_id
    AND pi.quantity > 0;

  RETURN jsonb_build_object(
    'found', true,
    'user_id', target_user_id,
    'nickname', v_nickname,
    'registered_at', coalesce(v_registered_at, v_profile_created),
    'last_activity_at', v_last_activity,
    'first_skin_at', v_first_skin,
    'last_skin_at', v_last_skin,
    'plan_subscription', coalesce(v_plan, 'free'),
    'revenuecat_app_user_id', target_user_id::text,
    'entitlement', CASE
      WHEN v_rc_status IS NULL THEN NULL
      ELSE jsonb_build_object(
        'status', v_rc_status,
        'converted_to_paid', coalesce(v_rc_converted, false),
        'trial_started_at', v_rc_trial_started,
        'trial_ended_at', v_rc_trial_ended
      )
    END,
    'summary', jsonb_build_object(
      'unique_items', coalesce(v_item_count, 0),
      'total_quantity', coalesce(v_total_qty, 0),
      'portfolio_value', coalesce(v_portfolio_value, 0)
    ),
    'items', coalesce(v_items, '[]'::jsonb)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_get_user_portfolio(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_user_portfolio(uuid) TO authenticated, service_role;

-- ---------------------------------------------------------------------------
-- admin_trial_activation_stats (aggregates only)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.admin_trial_activation_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  v_admin uuid;
  v_rc_count int;
  v_cancelled jsonb;
  v_converted jsonb;
BEGIN
  v_admin := public.admin_assert_caller();

  INSERT INTO public.admin_audit_log (admin_id, target_user_id, action)
  VALUES (v_admin, NULL, 'admin_trial_activation_stats');

  SELECT count(*)::int INTO v_rc_count FROM public.revenuecat_entitlements;

  IF v_rc_count = 0 THEN
    RETURN jsonb_build_object(
      'available', false,
      'reason', 'no_revenuecat_entitlements',
      'hint', 'Populate public.revenuecat_entitlements (app_user_id = auth user uuid) via webhook/sync, then retry.',
      'groups', jsonb_build_object(
        'cancelled_trial', NULL,
        'converted', NULL
      )
    );
  END IF;

  WITH cohort AS (
    SELECT
      uid.user_id,
      re.app_user_id,
      re.converted_to_paid,
      re.entitlement_status,
      re.trial_started_at,
      re.trial_ended_at,
      CASE
        WHEN re.trial_started_at IS NOT NULL AND re.trial_ended_at IS NOT NULL
          THEN extract(epoch FROM (re.trial_ended_at - re.trial_started_at)) / 86400.0
        WHEN re.trial_started_at IS NOT NULL
          THEN extract(epoch FROM (now() - re.trial_started_at)) / 86400.0
        ELSE NULL
      END AS trial_days,
      (
        SELECT count(*)::int
        FROM public.portfolio_items pi
        WHERE uid.user_id IS NOT NULL
          AND pi.user_id = uid.user_id
          AND pi.quantity > 0
      ) AS unique_items,
      (
        SELECT coalesce(sum(pi.quantity * coalesce(ci.price, 0)), 0)
        FROM public.portfolio_items pi
        LEFT JOIN public.cs2_items ci ON ci.id = pi.item_id
        WHERE uid.user_id IS NOT NULL
          AND pi.user_id = uid.user_id
          AND pi.quantity > 0
      ) AS portfolio_value,
      (
        SELECT count(DISTINCT (t.created_at::date))::int
        FROM public.transactions t
        WHERE uid.user_id IS NOT NULL
          AND t.user_id = uid.user_id
          AND re.trial_started_at IS NOT NULL
          AND t.created_at >= re.trial_started_at
          AND (re.trial_ended_at IS NULL OR t.created_at <= re.trial_ended_at)
      ) AS active_days_in_trial
    FROM public.revenuecat_entitlements re
    CROSS JOIN LATERAL (
      SELECT coalesce(
        re.user_id,
        CASE
          WHEN re.app_user_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
            THEN re.app_user_id::uuid
          ELSE NULL
        END
      ) AS user_id
    ) uid
  ),
  cancelled AS (
    SELECT *
    FROM cohort c
    WHERE c.converted_to_paid = false
      AND c.entitlement_status IN ('expired', 'cancelled')
  ),
  converted AS (
    SELECT *
    FROM cohort c
    WHERE c.converted_to_paid = true
  )
  SELECT
    jsonb_build_object(
      'user_count', (SELECT count(*)::int FROM cancelled),
      'median_unique_items', (
        SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY unique_items)
        FROM cancelled
      ),
      'median_portfolio_value', (
        SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY portfolio_value)
        FROM cancelled
      ),
      'median_active_days_in_trial', (
        SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY active_days_in_trial)
        FROM cancelled
        WHERE active_days_in_trial IS NOT NULL
      ),
      'median_trial_days', (
        SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY trial_days)
        FROM cancelled
        WHERE trial_days IS NOT NULL
      )
    ),
    jsonb_build_object(
      'user_count', (SELECT count(*)::int FROM converted),
      'median_unique_items', (
        SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY unique_items)
        FROM converted
      ),
      'median_portfolio_value', (
        SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY portfolio_value)
        FROM converted
      ),
      'median_active_days_in_trial', (
        SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY active_days_in_trial)
        FROM converted
        WHERE active_days_in_trial IS NOT NULL
      ),
      'median_trial_days', (
        SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY trial_days)
        FROM converted
        WHERE trial_days IS NOT NULL
      )
    )
  INTO v_cancelled, v_converted;

  RETURN jsonb_build_object(
    'available', true,
    'data_source', 'revenuecat_entitlements',
    'groups', jsonb_build_object(
      'cancelled_trial', v_cancelled,
      'converted', v_converted
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_trial_activation_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_trial_activation_stats() TO authenticated, service_role;
