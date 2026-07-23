-- Share visibility toggles + collections in public payload.

ALTER TABLE public.portfolio_shares
  ADD COLUMN IF NOT EXISTS show_summary boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_chart boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_categories boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_items boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_history boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_collections boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.update_portfolio_share_visibility(
  p_show_summary boolean DEFAULT NULL,
  p_show_chart boolean DEFAULT NULL,
  p_show_categories boolean DEFAULT NULL,
  p_show_items boolean DEFAULT NULL,
  p_show_history boolean DEFAULT NULL,
  p_show_collections boolean DEFAULT NULL
)
RETURNS public.portfolio_shares
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  row public.portfolio_shares;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.portfolio_shares
  SET
    show_summary = COALESCE(p_show_summary, show_summary),
    show_chart = COALESCE(p_show_chart, show_chart),
    show_categories = COALESCE(p_show_categories, show_categories),
    show_items = COALESCE(p_show_items, show_items),
    show_history = COALESCE(p_show_history, show_history),
    show_collections = COALESCE(p_show_collections, show_collections),
    updated_at = now()
  WHERE user_id = uid
  RETURNING * INTO row;

  IF row IS NULL THEN
    RAISE EXCEPTION 'Portfolio share not found. Enable sharing first.';
  END IF;

  RETURN row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_portfolio_share_visibility(
  boolean, boolean, boolean, boolean, boolean, boolean
) TO authenticated;

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
  collections_json jsonb := '[]'::jsonb;
  chart_response jsonb;
  alloc_rows jsonb;
  v_show_summary boolean := true;
  v_show_chart boolean := true;
  v_show_categories boolean := true;
  v_show_items boolean := true;
  v_show_history boolean := true;
  v_show_collections boolean := false;
BEGIN
  IF p_token IS NULL OR length(trim(p_token)) < 16 THEN
    RETURN NULL;
  END IF;

  SELECT
    ps.user_id,
    COALESCE(ps.show_summary, true),
    COALESCE(ps.show_chart, true),
    COALESCE(ps.show_categories, true),
    COALESCE(ps.show_items, true),
    COALESCE(ps.show_history, true),
    COALESCE(ps.show_collections, false)
  INTO
    share_user,
    v_show_summary,
    v_show_chart,
    v_show_categories,
    v_show_items,
    v_show_history,
    v_show_collections
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

  PERFORM set_config('request.jwt.claim.sub', share_user::text, true);
  PERFORM set_config(
    'request.jwt.claims',
    json_build_object('sub', share_user::text, 'role', 'authenticated')::text,
    true
  );

  -- Always compute holdings for summary totals (even if items section hidden)
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

  IF v_show_categories THEN
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
        categories_json := '[]'::jsonb;
      END;
    END IF;
  END IF;

  IF v_show_chart THEN
    BEGIN
      chart_response := to_jsonb(public.get_user_performance_chart('ALL'));
      IF chart_response IS NOT NULL AND chart_response ? 'data' THEN
        chart_json := COALESCE(chart_response->'data', '[]'::jsonb);
      ELSIF jsonb_typeof(chart_response) = 'array' THEN
        chart_json := chart_response;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      chart_json := '[]'::jsonb;
    END;
  END IF;

  IF v_show_history THEN
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
          AND t.item_id IN (
            SELECT DISTINCT pi.item_id
            FROM public.portfolio_items pi
            WHERE pi.user_id = share_user AND pi.quantity > 0
          )
        ORDER BY COALESCE(t.transaction_date, t.created_at) DESC
        LIMIT 15
      ) h;
    EXCEPTION WHEN OTHERS THEN
      history_json := '[]'::jsonb;
    END;
  END IF;

  IF v_show_collections THEN
    BEGIN
      SELECT COALESCE(jsonb_agg(to_jsonb(c)), '[]'::jsonb)
      INTO collections_json
      FROM public.get_collections(share_user) AS c;
    EXCEPTION WHEN OTHERS THEN
      BEGIN
        SELECT COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', col.id,
              'name', col.name,
              'total_items_quantity', 0,
              'total_value', 0
            )
            ORDER BY col.name
          ),
          '[]'::jsonb
        )
        INTO collections_json
        FROM public.collections col
        WHERE col.user_id = share_user;
      EXCEPTION WHEN OTHERS THEN
        collections_json := '[]'::jsonb;
      END;
    END;
  END IF;

  RETURN jsonb_build_object(
    'display_name', display_name,
    'avatar', avatar_url,
    'visibility', jsonb_build_object(
      'show_summary', v_show_summary,
      'show_chart', v_show_chart,
      'show_categories', v_show_categories,
      'show_items', v_show_items,
      'show_history', v_show_history,
      'show_collections', v_show_collections
    ),
    'summary', CASE
      WHEN v_show_summary THEN jsonb_build_object(
        'total_portfolio_value', inv_value,
        'inventory_value', inv_value,
        'item_count', item_cnt
      )
      ELSE jsonb_build_object(
        'total_portfolio_value', 0,
        'inventory_value', 0,
        'item_count', 0
      )
    END,
    'items', CASE WHEN v_show_items THEN items_json ELSE '[]'::jsonb END,
    'categories', CASE WHEN v_show_categories THEN categories_json ELSE '[]'::jsonb END,
    'chart', CASE WHEN v_show_chart THEN chart_json ELSE '[]'::jsonb END,
    'history', CASE WHEN v_show_history THEN history_json ELSE '[]'::jsonb END,
    'collections', CASE WHEN v_show_collections THEN collections_json ELSE '[]'::jsonb END
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_portfolio(text) TO anon, authenticated;

-- History pagination respects show_history
CREATE OR REPLACE FUNCTION public.get_public_portfolio_history(
  p_token text,
  p_page integer DEFAULT 1,
  p_page_size integer DEFAULT 15
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  share_user uuid;
  page_num integer := GREATEST(COALESCE(p_page, 1), 1);
  page_size integer := LEAST(GREATEST(COALESCE(p_page_size, 15), 1), 50);
  offset_n integer;
  total_count integer := 0;
  items_json jsonb := '[]'::jsonb;
  allow_history boolean := false;
BEGIN
  IF p_token IS NULL OR length(trim(p_token)) < 16 THEN
    RETURN NULL;
  END IF;

  SELECT ps.user_id, COALESCE(ps.show_history, true)
  INTO share_user, allow_history
  FROM public.portfolio_shares ps
  WHERE ps.token = trim(p_token)
    AND ps.enabled = true
  LIMIT 1;

  IF share_user IS NULL THEN
    RETURN NULL;
  END IF;

  IF NOT allow_history THEN
    RETURN jsonb_build_object(
      'items', '[]'::jsonb,
      'total_count', 0,
      'page', page_num,
      'page_size', page_size
    );
  END IF;

  offset_n := (page_num - 1) * page_size;

  SELECT COUNT(*)::int
  INTO total_count
  FROM public.transactions t
  WHERE t.user_id = share_user
    AND t.item_id IN (
      SELECT DISTINCT pi.item_id
      FROM public.portfolio_items pi
      WHERE pi.user_id = share_user
        AND pi.quantity > 0
    );

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', x.id,
        'type', x.type,
        'quantity', x.quantity,
        'price', x.price,
        'transaction_date', x.transaction_date,
        'market_hash_name', x.market_hash_name,
        'icon_url', x.icon_url,
        'rarity', x.rarity
      )
      ORDER BY x.sort_date DESC
    ),
    '[]'::jsonb
  )
  INTO items_json
  FROM (
    SELECT
      t.id,
      t.type,
      t.quantity,
      t.price,
      COALESCE(t.transaction_date, t.created_at) AS transaction_date,
      COALESCE(t.transaction_date, t.created_at) AS sort_date,
      COALESCE(ci.market_hash_name, 'Unknown item') AS market_hash_name,
      ci.icon_url,
      ci.rarity
    FROM public.transactions t
    LEFT JOIN public.cs2_items ci ON ci.id = t.item_id
    WHERE t.user_id = share_user
      AND t.item_id IN (
        SELECT DISTINCT pi.item_id
        FROM public.portfolio_items pi
        WHERE pi.user_id = share_user
          AND pi.quantity > 0
      )
    ORDER BY COALESCE(t.transaction_date, t.created_at) DESC
    LIMIT page_size
    OFFSET offset_n
  ) x;

  RETURN jsonb_build_object(
    'items', items_json,
    'total_count', total_count,
    'page', page_num,
    'page_size', page_size
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_portfolio_history(text, integer, integer) TO anon, authenticated;
