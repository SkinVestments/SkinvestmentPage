-- Fix unlink "Steam account not found": compare as text, single-account fallback,
-- and return steam IDs as text to the client (avoid JS Number precision loss).

DROP FUNCTION IF EXISTS public.unlink_steam_account(bigint);
DROP FUNCTION IF EXISTS public.unlink_steam_account(text);

CREATE OR REPLACE FUNCTION public.unlink_steam_account(p_steam_id_64 text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_provider text;
  v_is_main boolean;
  v_deleted int;
  v_count int;
  v_id_trim text := trim(both FROM coalesce(p_steam_id_64, ''));
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF v_id_trim = '' OR v_id_trim !~ '^\d+$' THEN
    RAISE EXCEPTION 'Invalid Steam ID';
  END IF;

  SELECT is_main INTO v_is_main
  FROM steam_connections
  WHERE user_id = v_user_id
    AND steam_id_64::text = v_id_trim;

  IF NOT FOUND THEN
    -- Client may send a JS-rounded Steam ID; if user has exactly one link, unlink that.
    SELECT count(*) INTO v_count
    FROM steam_connections
    WHERE user_id = v_user_id;

    IF v_count = 1 THEN
      SELECT is_main INTO v_is_main
      FROM steam_connections
      WHERE user_id = v_user_id;
    ELSE
      RAISE EXCEPTION 'Steam account not found';
    END IF;
  END IF;

  SELECT raw_user_meta_data->>'provider' INTO v_provider
  FROM auth.users
  WHERE id = v_user_id;

  IF v_is_main = true AND v_provider = 'steam' THEN
    RAISE EXCEPTION 'Cannot unlink the primary Steam account used for login.';
  END IF;

  DELETE FROM steam_connections
  WHERE user_id = v_user_id
    AND (
      steam_id_64::text = v_id_trim
      OR (
        SELECT count(*) FROM steam_connections sc2 WHERE sc2.user_id = v_user_id
      ) = 1
    );

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  IF v_deleted < 1 THEN
    RAISE EXCEPTION 'Steam account could not be deleted';
  END IF;
END;
$$;

GRANT ALL ON FUNCTION public.unlink_steam_account(text) TO anon, authenticated, service_role;

DROP FUNCTION IF EXISTS public.set_main_steam_account(bigint);
DROP FUNCTION IF EXISTS public.set_main_steam_account(text);

CREATE OR REPLACE FUNCTION public.set_main_steam_account(p_steam_id_64 text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_id_trim text := trim(both FROM coalesce(p_steam_id_64, ''));
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF v_id_trim = '' OR v_id_trim !~ '^\d+$' THEN
    RAISE EXCEPTION 'Invalid Steam ID';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM steam_connections
    WHERE user_id = v_user_id AND steam_id_64::text = v_id_trim
  ) THEN
    RAISE EXCEPTION 'Steam account not found';
  END IF;

  UPDATE steam_connections SET is_main = false WHERE user_id = v_user_id;
  UPDATE steam_connections SET is_main = true
  WHERE user_id = v_user_id AND steam_id_64::text = v_id_trim;
END;
$$;

GRANT ALL ON FUNCTION public.set_main_steam_account(text) TO anon, authenticated, service_role;

-- Return steam_id_64 as text so the browser never JSON-parses it as Number.
DROP FUNCTION IF EXISTS public.get_my_steam_connections();

CREATE OR REPLACE FUNCTION public.get_my_steam_connections()
RETURNS TABLE (
  user_id uuid,
  steam_id_64 text,
  steam_username text,
  steam_avatar_url text,
  linked_at timestamptz,
  inventory_status text,
  last_profile_sync timestamptz,
  last_inventory_sync timestamptz,
  is_main boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    sc.user_id,
    sc.steam_id_64::text,
    sc.steam_username,
    sc.steam_avatar_url,
    sc.linked_at,
    sc.inventory_status,
    sc.last_profile_sync,
    sc.last_inventory_sync,
    sc.is_main
  FROM steam_connections sc
  WHERE sc.user_id = auth.uid()
  ORDER BY sc.is_main DESC, sc.linked_at ASC;
$$;

GRANT ALL ON FUNCTION public.get_my_steam_connections() TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Users can delete their own steam connection" ON public.steam_connections;
CREATE POLICY "Users can delete their own steam connection"
  ON public.steam_connections
  FOR DELETE
  USING (auth.uid() = user_id);
