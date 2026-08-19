-- Enforce per-collection item quantity limits (matches subscription copy):
-- free: 1000, pro: 10000, pro_max: unlimited
-- Counted as SUM(portfolio_items.quantity) per collection (null collection = unassigned).

CREATE OR REPLACE FUNCTION public.collection_item_limit_for_plan(p_plan public.user_plan)
RETURNS integer
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE p_plan
    WHEN 'pro_max'::public.user_plan THEN NULL
    WHEN 'pro'::public.user_plan THEN 10000
    ELSE 1000
  END;
$$;

CREATE OR REPLACE FUNCTION public.collection_item_quantity(
  p_user_id uuid,
  p_collection_id uuid
)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(SUM(quantity), 0)::integer
  FROM portfolio_items
  WHERE user_id = p_user_id
    AND collection_id IS NOT DISTINCT FROM p_collection_id
    AND quantity > 0;
$$;

CREATE OR REPLACE FUNCTION public.assert_collection_item_capacity(
  p_user_id uuid,
  p_collection_id uuid,
  p_additional_qty integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_plan public.user_plan;
  v_max integer;
  v_current integer;
BEGIN
  IF p_additional_qty IS NULL OR p_additional_qty <= 0 THEN
    RETURN;
  END IF;

  SELECT COALESCE(plan_subscription, 'free'::public.user_plan)
  INTO v_plan
  FROM profiles
  WHERE id = p_user_id;

  v_max := public.collection_item_limit_for_plan(v_plan);
  IF v_max IS NULL THEN
    RETURN;
  END IF;

  v_current := public.collection_item_quantity(p_user_id, p_collection_id);

  IF v_current + p_additional_qty > v_max THEN
    RAISE EXCEPTION
      'Collection item limit reached for current plan (%). Upgrade or remove items.',
      v_max
      USING ERRCODE = 'check_violation';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_portfolio_collection_item_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_plan public.user_plan;
  v_max integer;
  v_others integer;
  v_new_qty integer;
BEGIN
  v_new_qty := COALESCE(NEW.quantity, 0);
  IF v_new_qty <= 0 THEN
    RETURN NEW;
  END IF;

  -- Decreasing quantity never blocks
  IF TG_OP = 'UPDATE' AND v_new_qty <= COALESCE(OLD.quantity, 0) THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(plan_subscription, 'free'::public.user_plan)
  INTO v_plan
  FROM profiles
  WHERE id = NEW.user_id;

  v_max := public.collection_item_limit_for_plan(v_plan);
  IF v_max IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(SUM(quantity), 0)::integer INTO v_others
  FROM portfolio_items
  WHERE user_id = NEW.user_id
    AND collection_id IS NOT DISTINCT FROM NEW.collection_id
    AND quantity > 0
    AND id IS DISTINCT FROM NEW.id;

  IF v_others + v_new_qty > v_max THEN
    RAISE EXCEPTION
      'Collection item limit reached for current plan (%). Upgrade or remove items.',
      v_max
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_portfolio_collection_item_limit ON public.portfolio_items;
CREATE TRIGGER trg_portfolio_collection_item_limit
  BEFORE INSERT OR UPDATE OF quantity, collection_id ON public.portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_portfolio_collection_item_limit();

-- Pre-check bulk adds so the whole batch fails cleanly before partial writes.
CREATE OR REPLACE FUNCTION public.add_transactions_bulk(p_user_id uuid, p_transactions jsonb[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  txn JSONB;
  v_item_id UUID;
  v_qty INT;
  v_price NUMERIC;
  v_type public.transaction_type;
  v_is_investment BOOLEAN;
  v_date TIMESTAMP;
  v_collection_id UUID;
  v_fee NUMERIC;
  v_realized_profit NUMERIC;
  r RECORD;
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Aggregate incoming BUY/DROP quantities per collection
  FOR r IN
    SELECT
      NULLIF(t.txn->>'collection_id', '')::uuid AS collection_id,
      SUM((t.txn->>'quantity')::int)::int AS add_qty
    FROM unnest(p_transactions) AS t(txn)
    WHERE (t.txn->>'type') IN ('BUY', 'DROP')
      AND COALESCE((t.txn->>'quantity')::int, 0) > 0
    GROUP BY 1
  LOOP
    PERFORM public.assert_collection_item_capacity(
      p_user_id,
      r.collection_id,
      r.add_qty
    );
  END LOOP;

  FOREACH txn IN ARRAY p_transactions
  LOOP
    v_item_id := (txn->>'item_id')::UUID;
    v_qty := (txn->>'quantity')::INT;
    v_price := (txn->>'price')::NUMERIC;
    v_type := (txn->>'type')::public.transaction_type;
    v_is_investment := COALESCE((txn->>'is_investment')::BOOLEAN, FALSE);
    v_date := (txn->>'transaction_date')::TIMESTAMP;
    v_collection_id := NULLIF(txn->>'collection_id', '')::UUID;
    v_fee := COALESCE((txn->>'fee_deducted')::NUMERIC, 0);
    v_realized_profit := COALESCE((txn->>'realized_profit')::NUMERIC, 0);

    INSERT INTO transactions (
      user_id, item_id, type, quantity, price, fee_deducted,
      transaction_date, is_investment, realized_profit, collection_id, created_at
    ) VALUES (
      p_user_id, v_item_id, v_type, v_qty, v_price, v_fee,
      v_date, v_is_investment, v_realized_profit, v_collection_id, NOW()
    );

    IF v_type IN ('BUY', 'DROP') THEN
      INSERT INTO portfolio_items (
        user_id, item_id, collection_id, quantity,
        investment_quantity, buy_price, updated_at, acquired_at
      ) VALUES (
        p_user_id, v_item_id, v_collection_id, v_qty,
        CASE WHEN v_is_investment THEN v_qty ELSE 0 END,
        v_price, NOW(), v_date
      )
      ON CONFLICT (user_id, item_id, collection_id)
      DO UPDATE SET
        buy_price = CASE
          WHEN (portfolio_items.quantity + EXCLUDED.quantity) <= 0 THEN EXCLUDED.buy_price
          ELSE ((portfolio_items.quantity * portfolio_items.buy_price) + (EXCLUDED.quantity * EXCLUDED.buy_price))
               / (portfolio_items.quantity + EXCLUDED.quantity)
        END,
        quantity = portfolio_items.quantity + EXCLUDED.quantity,
        investment_quantity = portfolio_items.investment_quantity + EXCLUDED.investment_quantity,
        acquired_at = LEAST(portfolio_items.acquired_at, EXCLUDED.acquired_at),
        updated_at = NOW();

    ELSIF v_type = 'SELL' THEN
      UPDATE portfolio_items
      SET
        quantity = GREATEST(0, quantity - v_qty),
        investment_quantity = CASE
          WHEN v_is_investment THEN GREATEST(0, investment_quantity - v_qty)
          ELSE investment_quantity
        END,
        updated_at = NOW()
      WHERE user_id = p_user_id
        AND item_id = v_item_id
        AND collection_id IS NOT DISTINCT FROM v_collection_id;
    END IF;
  END LOOP;
END;
$$;

GRANT ALL ON FUNCTION public.collection_item_limit_for_plan(public.user_plan) TO anon, authenticated, service_role;
GRANT ALL ON FUNCTION public.collection_item_quantity(uuid, uuid) TO anon, authenticated, service_role;
GRANT ALL ON FUNCTION public.assert_collection_item_capacity(uuid, uuid, integer) TO anon, authenticated, service_role;
GRANT ALL ON FUNCTION public.enforce_portfolio_collection_item_limit() TO anon, authenticated, service_role;
GRANT ALL ON FUNCTION public.add_transactions_bulk(uuid, jsonb[]) TO anon, authenticated, service_role;
