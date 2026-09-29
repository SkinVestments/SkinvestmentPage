-- Expand admin_get_user_portfolio: collections + transaction history (read-only).
-- Safe to re-run. Does not touch share-portfolio RPCs/RLS.

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
  v_tx_count int;
  v_collection_count int;
  v_rc_status text;
  v_rc_converted boolean;
  v_rc_trial_started timestamptz;
  v_rc_trial_ended timestamptz;
  v_items jsonb;
  v_collections jsonb;
  v_history jsonb;
  v_history_limit int := 100;
BEGIN
  v_admin := public.admin_assert_caller();

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid user id'
      USING ERRCODE = '22P02';
  END IF;

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

  SELECT count(*)::int
  INTO v_tx_count
  FROM public.transactions t
  WHERE t.user_id = target_user_id;

  SELECT count(*)::int
  INTO v_collection_count
  FROM public.collections c
  WHERE c.user_id = target_user_id;

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

  -- Holdings (with collection name when assigned)
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
        'acquired_at', pi.acquired_at,
        'collection_id', pi.collection_id,
        'collection_name', c.name
      )
      ORDER BY (pi.quantity * coalesce(ci.price, 0)) DESC
    ),
    '[]'::jsonb
  )
  INTO v_items
  FROM public.portfolio_items pi
  LEFT JOIN public.cs2_items ci ON ci.id = pi.item_id
  LEFT JOIN public.collections c ON c.id = pi.collection_id
  WHERE pi.user_id = target_user_id
    AND pi.quantity > 0;

  -- Collections with item counts / value
  SELECT coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', x.id,
        'name', x.name,
        'created_at', x.created_at,
        'unique_items', x.unique_items,
        'total_quantity', x.total_quantity,
        'total_value', x.total_value
      )
      ORDER BY x.total_value DESC, x.name ASC
    ),
    '[]'::jsonb
  )
  INTO v_collections
  FROM (
    SELECT
      c.id,
      c.name,
      c.created_at,
      count(pi.id) FILTER (WHERE pi.quantity > 0)::int AS unique_items,
      coalesce(sum(pi.quantity) FILTER (WHERE pi.quantity > 0), 0)::int AS total_quantity,
      coalesce(
        sum(pi.quantity * coalesce(ci.price, 0)) FILTER (WHERE pi.quantity > 0),
        0
      ) AS total_value
    FROM public.collections c
    LEFT JOIN public.portfolio_items pi
      ON pi.collection_id = c.id
     AND pi.user_id = target_user_id
    LEFT JOIN public.cs2_items ci ON ci.id = pi.item_id
    WHERE c.user_id = target_user_id
    GROUP BY c.id, c.name, c.created_at
  ) x;

  -- Recent transaction history (capped)
  SELECT coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', x.id,
        'type', x.type,
        'quantity', x.quantity,
        'price', x.price,
        'fee_deducted', x.fee_deducted,
        'realized_profit', x.realized_profit,
        'is_investment', x.is_investment,
        'transaction_date', x.transaction_date,
        'created_at', x.created_at,
        'market_hash_name', x.market_hash_name,
        'icon_url', x.icon_url,
        'rarity', x.rarity,
        'collection_name', x.collection_name
      )
      ORDER BY x.sort_date DESC
    ),
    '[]'::jsonb
  )
  INTO v_history
  FROM (
    SELECT
      t.id,
      t.type::text AS type,
      t.quantity,
      t.price,
      coalesce(t.fee_deducted, 0) AS fee_deducted,
      coalesce(t.realized_profit, 0) AS realized_profit,
      coalesce(t.is_investment, false) AS is_investment,
      coalesce(t.transaction_date, t.created_at) AS transaction_date,
      t.created_at,
      coalesce(t.transaction_date, t.created_at) AS sort_date,
      coalesce(ci.market_hash_name, 'Unknown') AS market_hash_name,
      ci.icon_url,
      ci.rarity,
      c.name AS collection_name
    FROM public.transactions t
    LEFT JOIN public.cs2_items ci ON ci.id = t.item_id
    LEFT JOIN public.collections c ON c.id = t.collection_id
    WHERE t.user_id = target_user_id
    ORDER BY coalesce(t.transaction_date, t.created_at) DESC
    LIMIT v_history_limit
  ) x;

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
      'portfolio_value', coalesce(v_portfolio_value, 0),
      'transaction_count', coalesce(v_tx_count, 0),
      'collection_count', coalesce(v_collection_count, 0),
      'history_returned', least(coalesce(v_tx_count, 0), v_history_limit),
      'history_limit', v_history_limit
    ),
    'items', coalesce(v_items, '[]'::jsonb),
    'collections', coalesce(v_collections, '[]'::jsonb),
    'history', coalesce(v_history, '[]'::jsonb)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_get_user_portfolio(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_user_portfolio(uuid) TO authenticated, service_role;
