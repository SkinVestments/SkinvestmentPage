-- Enforce collection count limits by plan (matches marketing):
-- free/starter: 5, pro: 15, pro_max: unlimited

CREATE OR REPLACE FUNCTION public.collection_count_limit_for_plan(p_plan public.user_plan)
RETURNS integer
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE p_plan
    WHEN 'pro_max'::public.user_plan THEN NULL
    WHEN 'pro'::public.user_plan THEN 15
    ELSE 5
  END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_collection_count_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_plan public.user_plan;
  v_max integer;
  v_count integer;
BEGIN
  SELECT COALESCE(plan_subscription, 'free'::public.user_plan)
  INTO v_plan
  FROM profiles
  WHERE id = NEW.user_id;

  v_max := public.collection_count_limit_for_plan(v_plan);

  IF v_max IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT count(*)::integer INTO v_count
  FROM collections
  WHERE user_id = NEW.user_id;

  IF v_count >= v_max THEN
    RAISE EXCEPTION 'Collections limit reached for current plan (%). Upgrade to create more.', v_max
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_collections_count_limit ON public.collections;
CREATE TRIGGER trg_collections_count_limit
  BEFORE INSERT ON public.collections
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_collection_count_limit();

CREATE OR REPLACE FUNCTION public.create_collection(p_user_id uuid, p_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_new_id uuid;
  v_plan public.user_plan;
  v_max integer;
  v_count integer;
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'You do not have permission to create collections for this user.';
  END IF;

  IF p_name IS NULL OR length(trim(p_name)) = 0 THEN
    RAISE EXCEPTION 'Collection name is required';
  END IF;

  SELECT COALESCE(plan_subscription, 'free'::public.user_plan)
  INTO v_plan
  FROM profiles
  WHERE id = p_user_id;

  v_max := public.collection_count_limit_for_plan(v_plan);

  SELECT count(*)::integer INTO v_count
  FROM collections
  WHERE user_id = p_user_id;

  IF v_max IS NOT NULL AND v_count >= v_max THEN
    RAISE EXCEPTION 'Collections limit reached for current plan (%). Upgrade to create more.', v_max;
  END IF;

  INSERT INTO collections (user_id, name)
  VALUES (p_user_id, trim(p_name))
  RETURNING id INTO v_new_id;

  RETURN jsonb_build_object(
    'success', true,
    'id', v_new_id,
    'message', 'Collection created'
  );
END;
$$;

GRANT ALL ON FUNCTION public.collection_count_limit_for_plan(public.user_plan) TO anon, authenticated, service_role;
GRANT ALL ON FUNCTION public.enforce_collection_count_limit() TO anon, authenticated, service_role;
GRANT ALL ON FUNCTION public.create_collection(uuid, text) TO anon, authenticated, service_role;
