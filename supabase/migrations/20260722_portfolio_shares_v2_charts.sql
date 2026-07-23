-- Extend public portfolio payload: chart + categories + item transaction history.
-- Also set JWT claim so existing auth.uid()-based RPCs can run as the share owner.

CREATE OR REPLACE FUNCTION public.get_public_portfolio(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  share_user uuid;
  display_name text;
  avatar_url text;
  inv_value numeric := 0;
  item_cnt int := 0;
  items_json jsonb := '[]'::jsonb;
  categories_json jsonb := '[]'::jsonb;
  history_json jsonb := '[]'::jsonb;
  chart_json jsonb := '[]'::jsonb;
  chart_response jsonb;
  alloc_rows jsonb;
BEGIN
  IF p_token IS NULL OR length(trim(p_token)) < 16 THEN
    RETURN NULL;
  END IF;

  SELECT ps.user_id
  INTO share_user
  FROM public.portfolio_shares ps
  WHERE ps.token = trim(p_token)
    AND ps.enabled = true
  LIMIT 1;

  IF share_user IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT
    COALESCE(NULLIF(trim(p.nickname), ''), 'Trader'),
    p.avatar
  INTO display_name, avatar_url
  FROM public.profiles p
  WHERE p.id = share_user;

  IF display_name IS NULL THEN
    display_name := 'Trader';
  END IF;

  -- Impersonate share owner for auth.uid()-scoped RPCs (same transaction only)
  PERFORM set_config('request.jwt.claim.sub', share_user::text, true);
  PERFORM set_config(
    'request.jwt.claims',
    json_build_object('sub', share_user::text, 'role', 'authenticated')::text,
    true
  );

  -- Holdings
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'market_hash_name', x.market_hash_name,
        'icon_url', x.icon_url,
        'rarity', x.rarity,
        'type', x.item_type,
        'quantity', x.quantity,
        'unit_price', x.unit_price,
        'position_value', x.position_value
      )
      ORDER BY x.position_value DESC
    ),
    '[]'::jsonb
  )
  INTO items_json
  FROM (
    SELECT
      ci.market_hash_name,
      ci.icon_url,
      ci.rarity,
      COALESCE(NULLIF(trim(ci.type), ''), 'Other') AS item_type,
      SUM(pi.quantity)::int AS quantity,
      COALESCE(ci.price, 0)::numeric AS unit_price,
      (COALESCE(ci.price, 0) * SUM(pi.quantity))::numeric AS position_value
    FROM public.portfolio_items pi
    INNER JOIN public.cs2_items ci ON ci.id = pi.item_id
    WHERE pi.user_id = share_user
      AND pi.quantity > 0
    GROUP BY ci.id, ci.market_hash_name, ci.icon_url, ci.rarity, ci.type, ci.price
  ) x;

  SELECT
    COALESCE(SUM((elem->>'position_value')::numeric), 0),
    COALESCE(COUNT(*), 0)::int
  INTO inv_value, item_cnt
  FROM jsonb_array_elements(items_json) AS elem;

  -- Category breakdown from holdings
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'name', c.name,
        'value', c.value,
        'percentage', CASE WHEN inv_value > 0 THEN round((c.value / inv_value) * 100, 2) ELSE 0 END
      )
      ORDER BY c.value DESC
    ),
    '[]'::jsonb
  )
  INTO categories_json
  FROM (
    SELECT
      COALESCE(NULLIF(trim(elem->>'type'), ''), 'Other') AS name,
      SUM((elem->>'position_value')::numeric) AS value
    FROM jsonb_array_elements(items_json) AS elem
    GROUP BY 1
  ) c
  WHERE c.value > 0;

  -- Fallback: try official allocation RPC if categories empty
  IF categories_json = '[]'::jsonb THEN
    BEGIN
      SELECT COALESCE(jsonb_agg(to_jsonb(a)), '[]'::jsonb)
      INTO alloc_rows
      FROM public.get_portfolio_allocation() AS a;

      IF alloc_rows IS NOT NULL AND alloc_rows <> '[]'::jsonb THEN
        SELECT COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'name', COALESCE(elem->>'cat_name', elem->>'category', 'Other'),
              'value', COALESCE((elem->>'total_value')::numeric, 0),
              'percentage', COALESCE((elem->>'percentage')::numeric, 0)
            )
          ),
          '[]'::jsonb
        )
        INTO categories_json
        FROM jsonb_array_elements(alloc_rows) AS elem;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      categories_json := COALESCE(categories_json, '[]'::jsonb);
    END;
  END IF;

  -- Performance chart via existing RPC (auth.uid() impersonation)
  BEGIN
    chart_response := to_jsonb(public.get_user_performance_chart('ALL'));
    IF chart_response IS NOT NULL AND chart_response ? 'data' THEN
      chart_json := COALESCE(chart_response->'data', '[]'::jsonb);
    ELSIF jsonb_typeof(chart_response) = 'array' THEN
      chart_json := chart_response;
    ELSIF chart_response ? 'portfolio_value' OR chart_response ? 'chart_date' THEN
      chart_json := jsonb_build_array(chart_response);
    END IF;
  EXCEPTION WHEN OTHERS THEN
    chart_json := '[]'::jsonb;
  END;

  -- Transaction history for currently held item ids (last 40)
  BEGIN
    SELECT COALESCE(
      jsonb_agg(h.obj ORDER BY h.sort_date DESC),
      '[]'::jsonb
    )
    INTO history_json
    FROM (
      SELECT
        jsonb_build_object(
          'id', t.id,
          'type', t.type,
          'quantity', t.quantity,
          'price', t.price,
          'transaction_date', COALESCE(t.transaction_date, t.created_at),
          'market_hash_name', COALESCE(ci.market_hash_name, 'Unknown item'),
          'icon_url', ci.icon_url,
          'rarity', ci.rarity
        ) AS obj,
        COALESCE(t.transaction_date, t.created_at) AS sort_date
      FROM public.transactions t
      LEFT JOIN public.cs2_items ci ON ci.id = t.item_id
      WHERE t.user_id = share_user
        AND (
          t.item_id IN (
            SELECT DISTINCT pi.item_id
            FROM public.portfolio_items pi
            WHERE pi.user_id = share_user
              AND pi.quantity > 0
          )
          OR NOT EXISTS (
            SELECT 1
            FROM public.portfolio_items pi
            WHERE pi.user_id = share_user
              AND pi.quantity > 0
          )
        )
      ORDER BY COALESCE(t.transaction_date, t.created_at) DESC
      LIMIT 40
    ) h;
  EXCEPTION WHEN OTHERS THEN
    history_json := '[]'::jsonb;
  END;

  RETURN jsonb_build_object(
    'display_name', display_name,
    'avatar', avatar_url,
    'summary', jsonb_build_object(
      'total_portfolio_value', inv_value,
      'inventory_value', inv_value,
      'item_count', item_cnt
    ),
    'items', items_json,
    'categories', categories_json,
    'chart', chart_json,
    'history', history_json
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_portfolio(text) TO anon, authenticated;
