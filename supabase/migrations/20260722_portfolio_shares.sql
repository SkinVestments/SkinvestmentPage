-- Private portfolio share links (apply in Supabase SQL editor or via CLI)
-- Public guests read via get_public_portfolio(token) only — no direct table access for anon.

-- Token without pgcrypto (gen_random_bytes may be unavailable / not on search_path).
CREATE OR REPLACE FUNCTION public.generate_portfolio_share_token()
RETURNS text
LANGUAGE sql
VOLATILE
AS $$
  SELECT replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
$$;

CREATE TABLE IF NOT EXISTS public.portfolio_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  CONSTRAINT portfolio_shares_user_id_unique UNIQUE (user_id),
  CONSTRAINT portfolio_shares_token_format CHECK (char_length(token) >= 16)
);

CREATE INDEX IF NOT EXISTS portfolio_shares_token_enabled_idx
  ON public.portfolio_shares (token)
  WHERE enabled = true;

CREATE OR REPLACE FUNCTION public.set_portfolio_shares_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS portfolio_shares_set_updated_at ON public.portfolio_shares;
CREATE TRIGGER portfolio_shares_set_updated_at
  BEFORE UPDATE ON public.portfolio_shares
  FOR EACH ROW
  EXECUTE FUNCTION public.set_portfolio_shares_updated_at();

ALTER TABLE public.portfolio_shares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners read own portfolio share" ON public.portfolio_shares;
CREATE POLICY "Owners read own portfolio share"
  ON public.portfolio_shares
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners insert own portfolio share" ON public.portfolio_shares;
CREATE POLICY "Owners insert own portfolio share"
  ON public.portfolio_shares
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners update own portfolio share" ON public.portfolio_shares;
CREATE POLICY "Owners update own portfolio share"
  ON public.portfolio_shares
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Owner: create or re-enable share (keeps existing token when re-enabling)
CREATE OR REPLACE FUNCTION public.enable_portfolio_share()
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

  INSERT INTO public.portfolio_shares (user_id, token, enabled, revoked_at)
  VALUES (uid, public.generate_portfolio_share_token(), true, NULL)
  ON CONFLICT (user_id) DO UPDATE
    SET enabled = true,
        revoked_at = NULL,
        updated_at = now()
  RETURNING * INTO row;

  RETURN row;
END;
$$;

CREATE OR REPLACE FUNCTION public.disable_portfolio_share()
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
  SET enabled = false,
      revoked_at = now(),
      updated_at = now()
  WHERE user_id = uid
  RETURNING * INTO row;

  IF row IS NULL THEN
    RAISE EXCEPTION 'Portfolio share not found';
  END IF;

  RETURN row;
END;
$$;

CREATE OR REPLACE FUNCTION public.regenerate_portfolio_share_token()
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
  SET token = public.generate_portfolio_share_token(),
      enabled = true,
      revoked_at = NULL,
      updated_at = now()
  WHERE user_id = uid
  RETURNING * INTO row;

  IF row IS NULL THEN
    INSERT INTO public.portfolio_shares (user_id, token, enabled, revoked_at)
    VALUES (uid, public.generate_portfolio_share_token(), true, NULL)
    RETURNING * INTO row;
  END IF;

  RETURN row;
END;
$$;

-- Public read (anon + authenticated) — no PII beyond display name / avatar
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

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'market_hash_name', x.market_hash_name,
        'icon_url', x.icon_url,
        'rarity', x.rarity,
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
      SUM(pi.quantity)::int AS quantity,
      COALESCE(ci.price, 0)::numeric AS unit_price,
      (COALESCE(ci.price, 0) * SUM(pi.quantity))::numeric AS position_value
    FROM public.portfolio_items pi
    INNER JOIN public.cs2_items ci ON ci.id = pi.item_id
    WHERE pi.user_id = share_user
      AND pi.quantity > 0
    GROUP BY ci.id, ci.market_hash_name, ci.icon_url, ci.rarity, ci.price
  ) x;

  SELECT
    COALESCE(SUM((elem->>'position_value')::numeric), 0),
    COALESCE(COUNT(*), 0)::int
  INTO inv_value, item_cnt
  FROM jsonb_array_elements(items_json) AS elem;

  RETURN jsonb_build_object(
    'display_name', display_name,
    'avatar', avatar_url,
    'summary', jsonb_build_object(
      'total_portfolio_value', inv_value,
      'inventory_value', inv_value,
      'item_count', item_cnt
    ),
    'items', items_json
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.generate_portfolio_share_token() TO authenticated;
GRANT EXECUTE ON FUNCTION public.enable_portfolio_share() TO authenticated;
GRANT EXECUTE ON FUNCTION public.disable_portfolio_share() TO authenticated;
GRANT EXECUTE ON FUNCTION public.regenerate_portfolio_share_token() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_portfolio(text) TO anon, authenticated;

REVOKE ALL ON TABLE public.portfolio_shares FROM anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public.portfolio_shares TO authenticated;
