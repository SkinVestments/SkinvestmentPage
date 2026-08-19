--
-- PostgreSQL database dump
--

\restrict s6ggUkL9rhhZdsRJtcPAf6nx2EffmlTJmxTsAqBz9b2LXyAy18S4HscXQ4h046W

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: pg_cron; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION pg_cron; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL';


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: item_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.item_category AS ENUM (
    'Case',
    'Sticker',
    'Skin',
    'Agent',
    'Patch',
    'Other'
);


ALTER TYPE public.item_category OWNER TO postgres;

--
-- Name: transaction_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transaction_type AS ENUM (
    'BUY',
    'SELL',
    'DROP'
);


ALTER TYPE public.transaction_type OWNER TO postgres;

--
-- Name: user_plan; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_plan AS ENUM (
    'free',
    'pro',
    'pro_max'
);


ALTER TYPE public.user_plan OWNER TO postgres;

--
-- Name: wishlist_alert_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.wishlist_alert_type AS ENUM (
    'target_price_hit',
    'price_drop_percent',
    'volume_spike',
    'spread_improvement'
);


ALTER TYPE public.wishlist_alert_type OWNER TO postgres;

--
-- Name: wishlist_horizon; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.wishlist_horizon AS ENUM (
    'short',
    'mid',
    'long'
);


ALTER TYPE public.wishlist_horizon OWNER TO postgres;

--
-- Name: wishlist_item_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.wishlist_item_status AS ENUM (
    'active',
    'paused',
    'archived',
    'bought'
);


ALTER TYPE public.wishlist_item_status OWNER TO postgres;

--
-- Name: wishlist_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.wishlist_priority AS ENUM (
    'low',
    'medium',
    'high'
);


ALTER TYPE public.wishlist_priority OWNER TO postgres;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_realtime_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in',
    'like',
    'ilike',
    'is',
    'match',
    'imatch',
    'isdistinct'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_realtime_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text,
	negate boolean
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_realtime_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_realtime_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_realtime_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: graphql(text, text, jsonb, jsonb); Type: FUNCTION; Schema: graphql_public; Owner: supabase_admin
--

CREATE FUNCTION graphql_public.graphql("operationName" text DEFAULT NULL::text, query text DEFAULT NULL::text, variables jsonb DEFAULT NULL::jsonb, extensions jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;


ALTER FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) OWNER TO supabase_admin;

--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: add_transactions_bulk(uuid, jsonb[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_transactions_bulk(p_user_id uuid, p_transactions jsonb[]) RETURNS void
    LANGUAGE plpgsql
    AS $$DECLARE
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
BEGIN
    FOREACH txn IN ARRAY p_transactions
    LOOP
        -- 1. Ekstrakcja i czyszczenie danych
        v_item_id := (txn->>'item_id')::UUID;
        v_qty := (txn->>'quantity')::INT;
        v_price := (txn->>'price')::NUMERIC;
        v_type := (txn->>'type')::public.transaction_type;
        v_is_investment := COALESCE((txn->>'is_investment')::BOOLEAN, FALSE);
        v_date := (txn->>'transaction_date')::TIMESTAMP;
        
        -- Krytyczne: NULLIF zapobiega błędom pustego stringa w UUID
        v_collection_id := NULLIF(txn->>'collection_id', '')::UUID;
        
        v_fee := COALESCE((txn->>'fee_deducted')::NUMERIC, 0);
        v_realized_profit := COALESCE((txn->>'realized_profit')::NUMERIC, 0);

        -- 2. Zapisz w Historii Transakcji (Zawsze)
        INSERT INTO transactions (
            user_id, item_id, type, quantity, price, fee_deducted, 
            transaction_date, is_investment, realized_profit, collection_id, created_at
        ) VALUES (
            p_user_id, v_item_id, v_type, v_qty, v_price, v_fee, 
            v_date, v_is_investment, v_realized_profit, v_collection_id, NOW()
        );

        -- 3. Logika Portfolio (Wpuszczamy WSZYSTKO)
        IF v_type IN ('BUY', 'DROP') THEN
            INSERT INTO portfolio_items (
                user_id, item_id, collection_id, quantity, 
                investment_quantity, buy_price, updated_at, acquired_at
            ) VALUES (
                p_user_id, v_item_id, v_collection_id, v_qty, 
                -- Tuta jest magia: inwestycja rośnie tylko gdy flaga to TRUE
                CASE WHEN v_is_investment THEN v_qty ELSE 0 END, 
                v_price, NOW(), v_date
            )
            ON CONFLICT (user_id, item_id, collection_id) 
            DO UPDATE SET
                -- Przeliczanie średniej ceny uwzględnia teraz wszystkie sztuki
                buy_price = CASE 
                    WHEN (portfolio_items.quantity + EXCLUDED.quantity) <= 0 THEN EXCLUDED.buy_price
                    ELSE ((portfolio_items.quantity * portfolio_items.buy_price) + (EXCLUDED.quantity * EXCLUDED.buy_price)) / (portfolio_items.quantity + EXCLUDED.quantity)
                END,
                quantity = portfolio_items.quantity + EXCLUDED.quantity,
                investment_quantity = portfolio_items.investment_quantity + EXCLUDED.investment_quantity,
                acquired_at = LEAST(portfolio_items.acquired_at, EXCLUDED.acquired_at),
                updated_at = NOW();

        -- B. PRZYPADEK: SPRZEDAŻ (SELL)
        ELSIF v_type = 'SELL' THEN
            UPDATE portfolio_items
            SET 
                quantity = GREATEST(0, quantity - v_qty),
                -- Odejmowanie od inwestycji tylko jeśli sprzedawany przedmiot był inwestycją
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
END;$$;


ALTER FUNCTION public.add_transactions_bulk(p_user_id uuid, p_transactions jsonb[]) OWNER TO postgres;

--
-- Name: catalog_get_collections(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.catalog_get_collections() RETURNS TABLE(id uuid, name text, items_count bigint)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select
    c.id,
    c.name,
    count(i.id)::bigint as items_count
  from public.cs2_item_collections c
  left join public.cs2_items i
    on i.game_collection_id = c.id
  group by c.id, c.name
  having count(i.id) > 0
  order by c.name asc;
$$;


ALTER FUNCTION public.catalog_get_collections() OWNER TO postgres;

--
-- Name: catalog_search_items(text, uuid, text, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.catalog_search_items(p_search text DEFAULT NULL::text, p_collection_id uuid DEFAULT NULL::uuid, p_sort text DEFAULT 'name_asc'::text, p_limit integer DEFAULT 24, p_offset integer DEFAULT 0) RETURNS TABLE(id uuid, market_hash_name text, icon_url text, rarity text, exterior text, price numeric, game_collection_id uuid, collection_name text, total_count bigint)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  with filtered as (
    select
      i.id,
      i.market_hash_name,
      i.icon_url,
      i.rarity,
      i.exterior,
      i.price,
      i.game_collection_id,
      c.name as collection_name
    from public.cs2_items i
    left join public.cs2_item_collections c
      on c.id = i.game_collection_id
    where
      (p_collection_id is null or i.game_collection_id = p_collection_id)
      and (
        p_search is null
        or p_search = ''
        or i.market_hash_name ilike '%' || p_search || '%'
      )
  )
  select
    f.id,
    f.market_hash_name,
    f.icon_url,
    f.rarity,
    f.exterior,
    f.price,
    f.game_collection_id,
    f.collection_name,
    count(*) over()::bigint as total_count
  from filtered f
  order by
    case when p_sort = 'name_asc' then f.market_hash_name end asc,
    case when p_sort = 'name_desc' then f.market_hash_name end desc,
    case when p_sort = 'price_asc' then f.price end asc,
    case when p_sort = 'price_desc' then f.price end desc,
    f.market_hash_name asc
  limit greatest(p_limit, 1)
  offset greatest(p_offset, 0);
$$;


ALTER FUNCTION public.catalog_search_items(p_search text, p_collection_id uuid, p_sort text, p_limit integer, p_offset integer) OWNER TO postgres;

--
-- Name: cleanup_old_notifications(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cleanup_old_notifications() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Usuwamy powiadomienia, które zostały PRZECZYTANE i mają więcej niż 7 dni
    DELETE FROM public.notifications
    WHERE is_read = true AND created_at < now() - INTERVAL '7 days';

    -- Usuwamy powiadomienia, które są NIEPRZECZYTANE, ale wiszą już od ponad 30 dni (martwe konta)
    DELETE FROM public.notifications
    WHERE is_read = false AND created_at < now() - INTERVAL '30 days';
END;
$$;


ALTER FUNCTION public.cleanup_old_notifications() OWNER TO postgres;

--
-- Name: create_collection(uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_collection(p_user_id uuid, p_name text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_new_id uuid;
begin
  -- Sprawdzenie bezpieczeństwa (opcjonalne, jeśli ufasz RLS, ale w RPC warto mieć)
  if auth.uid() != p_user_id then
    raise exception 'You do not have permission to create collections for this user.';
  end if;

  insert into collections (user_id, name)
  values (p_user_id, p_name)
  returning id into v_new_id;

  return jsonb_build_object(
    'success', true,
    'id', v_new_id,
    'message', 'Collection created'
  );
end;
$$;


ALTER FUNCTION public.create_collection(p_user_id uuid, p_name text) OWNER TO postgres;

--
-- Name: delete_collection(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_collection(p_collection_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_deleted_count int;
begin
  -- Usuwamy tylko jeśli ID kolekcji pasuje ORAZ należy ona do aktualnie zalogowanego użytkownika
  delete from collections
  where id = p_collection_id 
  and user_id = auth.uid(); -- To gwarantuje, że usuwasz tylko swoje!

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  if v_deleted_count > 0 then
    return jsonb_build_object('success', true, 'message', 'Collection deleted');
  else
    return jsonb_build_object('success', false, 'message', 'Collection not found or permission denied');
  end if;
end;
$$;


ALTER FUNCTION public.delete_collection(p_collection_id uuid) OWNER TO postgres;

--
-- Name: delete_my_account(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_my_account() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_user_id uuid;
BEGIN
    -- 1. Pobieramy ID aktualnie zalogowanego użytkownika z tokena
    v_user_id := auth.uid();

    -- 2. Zabezpieczenie przed wywołaniem bez autoryzacji
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated. Cannot delete account.';
    END IF;

    -- 3. Usunięcie z auth.users
    -- (Kaskada zniszczy profile, transakcje, portfele, kolekcje i połączenia Steam)
    DELETE FROM auth.users WHERE id = v_user_id;

END;
$$;


ALTER FUNCTION public.delete_my_account() OWNER TO postgres;

--
-- Name: delete_transaction(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_transaction(p_transaction_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_user_id uuid := auth.uid();
    v_item_id uuid;
    v_collection_id uuid;
    
    -- Nowe zmienne potrzebne do aktualizacji portfela
    v_type text;
    v_qty integer;
    v_is_inv boolean;
    v_new_balance integer;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 1. Pobieramy PEŁNE dane transakcji, żeby wiedzieć, co dokładnie odkręcamy
    SELECT item_id, collection_id, type::text, quantity, COALESCE(is_investment, false)
    INTO v_item_id, v_collection_id, v_type, v_qty, v_is_inv
    FROM public.transactions
    WHERE id = p_transaction_id AND user_id = v_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Transaction not found or access denied';
    END IF;

    -- 2. Usuwamy transakcję
    DELETE FROM public.transactions 
    WHERE id = p_transaction_id;

    -- 3. Sprawdzamy stan magazynowy PO usunięciu (Twój genialny warunek)
    -- Używamy IS NOT DISTINCT FROM, aby poprawnie obsługiwać przedmioty bez kolekcji (NULL)
    SELECT COALESCE(SUM(CASE WHEN type::text IN ('BUY', 'DROP') THEN quantity WHEN type::text = 'SELL' THEN -quantity ELSE 0 END), 0)
    INTO v_new_balance
    FROM public.transactions
    WHERE item_id = v_item_id 
      AND collection_id IS NOT DISTINCT FROM v_collection_id 
      AND user_id = v_user_id;

    -- 4. Jeśli stan spadł poniżej zera, rzucamy błąd (cofa DELETE)
    IF v_new_balance < 0 THEN
        RAISE EXCEPTION 'Cannot delete transaction: Inventory balance would fall below zero (%).', v_new_balance;
    END IF;

    -- 5. NOWY KROK: Synchronizacja tabeli portfolio_items
    IF v_new_balance = 0 THEN
        -- Jeśli usunęliśmy ostatnią transakcję i nie mamy już skina, 
        -- całkowicie usuwamy go z portfela, żeby nie zajmował miejsca
        DELETE FROM public.portfolio_items 
        WHERE user_id = v_user_id 
          AND item_id = v_item_id 
          AND collection_id IS NOT DISTINCT FROM v_collection_id;
    ELSE
        -- Jeśli skiny jeszcze zostały, aktualizujemy ich ilość (i flagę inwestycji)
        UPDATE public.portfolio_items
        SET 
            quantity = v_new_balance,
            -- Odkręcamy inwestycje w zależności od tego, co usunęliśmy
            investment_quantity = CASE 
                WHEN v_type IN ('BUY', 'DROP') THEN GREATEST(0, investment_quantity - (CASE WHEN v_is_inv THEN v_qty ELSE 0 END))
                WHEN v_type = 'SELL' THEN investment_quantity + (CASE WHEN v_is_inv THEN v_qty ELSE 0 END)
                ELSE investment_quantity
            END,
            updated_at = NOW()
        WHERE user_id = v_user_id 
          AND item_id = v_item_id 
          AND collection_id IS NOT DISTINCT FROM v_collection_id;
    END IF;

END;
$$;


ALTER FUNCTION public.delete_transaction(p_transaction_id uuid) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: portfolio_shares; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolio_shares (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token text NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    show_summary boolean DEFAULT true NOT NULL,
    show_chart boolean DEFAULT true NOT NULL,
    show_categories boolean DEFAULT true NOT NULL,
    show_items boolean DEFAULT true NOT NULL,
    show_history boolean DEFAULT true NOT NULL,
    show_collections boolean DEFAULT false NOT NULL,
    CONSTRAINT portfolio_shares_token_format CHECK ((char_length(token) >= 16))
);


ALTER TABLE public.portfolio_shares OWNER TO postgres;

--
-- Name: disable_portfolio_share(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.disable_portfolio_share() RETURNS public.portfolio_shares
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


ALTER FUNCTION public.disable_portfolio_share() OWNER TO postgres;

--
-- Name: edit_transaction(uuid, integer, numeric, timestamp with time zone, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.edit_transaction(p_transaction_id uuid, p_new_quantity integer, p_new_price numeric, p_new_date timestamp with time zone, p_new_is_investment boolean) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_user_id uuid;
    v_item_id uuid;
    v_collection_id uuid;
    v_new_balance integer;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 1. Aktualizujemy transakcję i od razu wyciągamy z niej item_id oraz collection_id
    UPDATE public.transactions
    SET 
        quantity = p_new_quantity,
        price = p_new_price,
        transaction_date = p_new_date,
        is_investment = p_new_is_investment
    WHERE id = p_transaction_id AND user_id = v_user_id
    RETURNING item_id, collection_id INTO v_item_id, v_collection_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Transaction not found or access denied';
    END IF;

    -- 2. Sprawdzamy stan magazynowy PO edycji (bo może ktoś zmienił quantity z 10 na 2, a wcześniej sprzedał 5)
    SELECT COALESCE(SUM(CASE WHEN type IN ('BUY', 'DROP') THEN quantity WHEN type = 'SELL' THEN -quantity ELSE 0 END), 0)
    INTO v_new_balance
    FROM public.transactions
    WHERE item_id = v_item_id 
      AND collection_id = v_collection_id 
      AND user_id = v_user_id;

    -- 3. Zabezpieczenie integralności (cofa UPDATE w razie wpadki)
    IF v_new_balance < 0 THEN
        RAISE EXCEPTION 'Cannot edit transaction: New quantity causes negative inventory balance.';
    END IF;

END;
$$;


ALTER FUNCTION public.edit_transaction(p_transaction_id uuid, p_new_quantity integer, p_new_price numeric, p_new_date timestamp with time zone, p_new_is_investment boolean) OWNER TO postgres;

--
-- Name: enable_portfolio_share(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.enable_portfolio_share() RETURNS public.portfolio_shares
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


ALTER FUNCTION public.enable_portfolio_share() OWNER TO postgres;

--
-- Name: export_my_data(boolean, boolean, boolean, boolean, boolean, boolean, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.export_my_data(include_account_details boolean DEFAULT true, include_profile boolean DEFAULT true, include_steam_connections boolean DEFAULT true, include_collections boolean DEFAULT true, include_portfolio_items boolean DEFAULT true, include_transactions boolean DEFAULT true, include_portfolio_snapshots boolean DEFAULT true) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_user_id uuid := auth.uid();
    export_data JSONB := '{}'::jsonb;
BEGIN
    -- Bezpieczeństwo
    IF v_user_id IS NULL THEN 
        RAISE EXCEPTION 'Not authenticated'; 
    END IF;

    -- 1. Account Details
    IF include_account_details THEN
        export_data := export_data || jsonb_build_object(
            'account_details', (
                SELECT jsonb_build_object(
                    'user_id', au.id, 
                    'email', au.email,
                    'phone', au.phone,
                    'created_at', au.created_at,
                    'last_sign_in_at', au.last_sign_in_at,
                    'providers', au.raw_app_meta_data->'providers',
                    'is_banned', au.banned_until IS NOT NULL AND au.banned_until > now()
                )
                FROM auth.users au
                WHERE au.id = v_user_id
            )
        );
    END IF;

    -- 2. Profile
    IF include_profile THEN
        export_data := export_data || jsonb_build_object(
            'profile', (
                SELECT to_jsonb(p) - 'id'
                FROM public.profiles p 
                WHERE p.id = v_user_id
            )
        );
    END IF;

    -- 3. Steam Connections (NAPRAWIONE NAZWY KOLUMN)
    IF include_steam_connections THEN
        export_data := export_data || jsonb_build_object(
            'steam_connections', COALESCE((
                SELECT jsonb_agg(jsonb_build_object(
                    'steam_id', sc.steam_id_64,
                    'persona_name', sc.steam_username,
                    'avatar', sc.steam_avatar_url,
                    'connected_at', sc.linked_at,
                    'inventory_status', sc.inventory_status
                )) 
                FROM public.steam_connections sc 
                WHERE sc.user_id = v_user_id
            ), '[]'::jsonb)
        );
    END IF;

    -- 4. Collections
    IF include_collections THEN
        export_data := export_data || jsonb_build_object(
            'collections', COALESCE((
                SELECT jsonb_agg(jsonb_build_object(
                    'name', c.name,
                    'created_at', c.created_at
                )) 
                FROM public.collections c 
                WHERE c.user_id = v_user_id
            ), '[]'::jsonb)
        );
    END IF;

    -- 5. Portfolio Items
    IF include_portfolio_items THEN
        export_data := export_data || jsonb_build_object(
            'portfolio_items', COALESCE((
                SELECT jsonb_agg(jsonb_build_object(
                    'item_name', i.market_hash_name, 
                    'quantity', pi.quantity,
                    'buy_price', pi.buy_price,
                    'acquired_at', pi.acquired_at
                ))
                FROM public.portfolio_items pi
                LEFT JOIN public.cs2_items i ON pi.item_id = i.id
                WHERE pi.user_id = v_user_id
            ), '[]'::jsonb)
        );
    END IF;

    -- 6. Transactions
    IF include_transactions THEN
        export_data := export_data || jsonb_build_object(
            'transactions', COALESCE((
                SELECT jsonb_agg(jsonb_build_object(
                    'item_name', i.market_hash_name, 
                    'type', t.type,
                    'quantity', t.quantity,
                    'price', t.price,
                    'fee_deducted', t.fee_deducted,
                    'transaction_date', t.transaction_date,
                    'is_investment', t.is_investment,
                    'realized_profit', t.realized_profit
                ))
                FROM public.transactions t
                LEFT JOIN public.cs2_items i ON t.item_id = i.id
                WHERE t.user_id = v_user_id
            ), '[]'::jsonb)
        );
    END IF;

    -- 7. Portfolio Snapshots (USUNIĘTO NIEISTNIEJĄCE KOLUMNY)
    IF include_portfolio_snapshots THEN
        export_data := export_data || jsonb_build_object(
            'portfolio_snapshots', COALESCE((
                SELECT jsonb_agg(jsonb_build_object(
                    'total_value', ps.total_value,
                    'recorded_at', ps.recorded_at
                )) 
                FROM public.portfolio_snapshots ps 
                WHERE ps.user_id = v_user_id
            ), '[]'::jsonb)
        );
    END IF;

    RETURN export_data;
END;
$$;


ALTER FUNCTION public.export_my_data(include_account_details boolean, include_profile boolean, include_steam_connections boolean, include_collections boolean, include_portfolio_items boolean, include_transactions boolean, include_portfolio_snapshots boolean) OWNER TO postgres;

--
-- Name: export_portfolio(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.export_portfolio(target_user_id uuid) RETURNS TABLE(item_name text, collection_name text, quantity integer, investment_quantity integer, avg_buy_price numeric, current_unit_price numeric, total_invested numeric, current_total_value numeric, unrealized_profit numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.market_hash_name::text AS item_name,
        COALESCE(c.name, 'Unassigned')::text AS collection_name,
        pi.quantity,
        pi.investment_quantity,
        pi.buy_price AS avg_buy_price,
        COALESCE(i.price, 0) AS current_unit_price,
        
        -- Obliczenia wartości
        (pi.quantity * COALESCE(pi.buy_price, 0)) AS total_invested,
        (pi.quantity * COALESCE(i.price, 0)) AS current_total_value,
        
        -- Zysk/Strata dla danej pozycji
        ((pi.quantity * COALESCE(i.price, 0)) - (pi.quantity * COALESCE(pi.buy_price, 0))) AS unrealized_profit

    FROM 
        public.portfolio_items pi
    LEFT JOIN 
        public.cs2_items i ON pi.item_id = i.id
    LEFT JOIN 
        public.collections c ON pi.collection_id = c.id
    WHERE 
        pi.user_id = target_user_id
        AND pi.quantity > 0 -- Tylko to, co fizycznie jest w ekwipunku
    ORDER BY 
        current_total_value DESC; -- Najdroższe pozycje na górze
END;
$$;


ALTER FUNCTION public.export_portfolio(target_user_id uuid) OWNER TO postgres;

--
-- Name: export_transactions(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.export_transactions(target_user_id uuid) RETURNS TABLE(transaction_date timestamp with time zone, type public.transaction_type, item_name text, quantity integer, price numeric, fee_deducted numeric, is_investment boolean, realized_profit numeric, collection_name text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.transaction_date,
        t.type,
        i.market_hash_name::text AS item_name, -- Nazwa skina zamiast UUID
        t.quantity,
        t.price,
        t.fee_deducted,
        t.is_investment,
        t.realized_profit,
        COALESCE(c.name, 'Unassigned')::text AS collection_name -- Nazwa kolekcji
    FROM 
        public.transactions t
    LEFT JOIN 
        public.cs2_items i ON t.item_id = i.id
    LEFT JOIN 
        public.collections c ON t.collection_id = c.id
    WHERE 
        t.user_id = target_user_id
    ORDER BY 
        t.transaction_date DESC;
END;
$$;


ALTER FUNCTION public.export_transactions(target_user_id uuid) OWNER TO postgres;

--
-- Name: generate_portfolio_share_token(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_portfolio_share_token() RETURNS text
    LANGUAGE sql
    AS $$
  SELECT replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
$$;


ALTER FUNCTION public.generate_portfolio_share_token() OWNER TO postgres;

--
-- Name: get_active_pool(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_active_pool() RETURNS TABLE(name text, "currentPrice" numeric, icon text)
    LANGUAGE sql SECURITY DEFINER
    AS $$
  select 
    i.market_hash_name as name,
    i.price as "currentPrice",
    i.icon_url as icon
  from public.active_drop_pool p
  join public.cs2_items i on p.item_id = i.id
  where p.is_active = true
  order by p.sort_order asc;
$$;


ALTER FUNCTION public.get_active_pool() OWNER TO postgres;

--
-- Name: get_active_pool_drop_items(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_active_pool_drop_items() RETURNS jsonb
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$WITH combined AS (
    -- Skrzynki z active_drop_pool
    SELECT
        i.id,
        i.market_hash_name AS name,
        ROUND(COALESCE(i.price, 0), 2) AS price,
        i.icon_url,
        p.sort_order
    FROM public.active_drop_pool p
    JOIN public.cs2_items i
        ON i.id = p.item_id
    WHERE p.is_active = true

    UNION ALL

    -- Itemy z kolekcji w active_drop_pool_collections
    SELECT
        i.id,
        i.market_hash_name AS name,
        ROUND(COALESCE(i.price, 0), 2) AS price,
        i.icon_url,
        p.sort_order
    FROM public.active_drop_pool_collections p
    JOIN public.cs2_items i
        ON i.game_collection_id = p.collection_id
    WHERE p.is_active = true

    UNION ALL

    -- Itemy z kategorii graffiti (tylko te, które NIE należą do żadnej kolekcji)
    SELECT
        i.id,
        i.market_hash_name AS name,
        ROUND(COALESCE(i.price, 0), 2) AS price,
        i.icon_url,
        999 AS sort_order
    FROM public.cs2_items i
    WHERE i.category = 'graffiti'
      AND i.game_collection_id IS NULL -- Wykluczenie przedmiotów mających ustawioną kolekcję

    UNION ALL

    -- Konkretny wymuszony przedmiot po ID
    SELECT
        i.id,
        i.market_hash_name AS name,
        ROUND(COALESCE(i.price, 0), 2) AS price,
        i.icon_url,
        0 AS sort_order -- Nadany priorytet 0, aby ten konkretny item był na początku (możesz zmienić)
    FROM public.cs2_items i
    WHERE i.id = 'a50f81d7-63c2-4858-aeca-53e7bc88dc5f'
),
deduped AS (
    -- Ten sam item może wpaść z obu źródeł — zostawiamy jeden wiersz.
    SELECT DISTINCT ON (id)
        id,
        name,
        price,
        icon_url,
        sort_order
    FROM combined
    ORDER BY id, sort_order ASC
)
SELECT COALESCE(
    jsonb_agg(
        jsonb_build_object(
            'name', name,
            'price', price,
            'icon_url', icon_url
        )
        ORDER BY sort_order ASC, name ASC
    ),
    '[]'::jsonb
)
FROM deduped;$$;


ALTER FUNCTION public.get_active_pool_drop_items() OWNER TO postgres;

--
-- Name: get_all_steam_exchange_rates(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_all_steam_exchange_rates() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_result jsonb;
BEGIN
    -- Agregujemy wszystkie wiersze z tabeli do jednej dużej tablicy JSON
    SELECT jsonb_agg(
        jsonb_build_object(
            'currency_code', currency_code,
            'rate_to_usd', rate_to_usd,
            'updated_at', updated_at
        ) ORDER BY currency_code ASC -- Sortujemy alfabetycznie dla wygody UI
    )
    INTO v_result
    FROM public.steam_exchange_rates;

    -- Jeśli tabela jest pusta, zwracamy pustą tablicę zamiast NULL
    RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;


ALTER FUNCTION public.get_all_steam_exchange_rates() OWNER TO postgres;

--
-- Name: get_analytics(uuid, timestamp with time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_analytics(p_user_id uuid, p_period_start timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS TABLE("totalValues" numeric, deposited numeric, withdrawn numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  v_deposited numeric;
  v_withdrawn numeric;
BEGIN
  -- 1. Obliczamy DEPOSITED (Suma wydana na BUY)
  SELECT COALESCE(SUM(quantity * price), 0)
  INTO v_deposited
  FROM transactions
  WHERE user_id = p_user_id
    AND type = 'BUY'
    AND (p_period_start IS NULL OR transaction_date >= p_period_start);

  -- 2. Obliczamy WITHDRAWN (Suma uzyskana ze SELL minus prowizje)
  SELECT COALESCE(SUM((quantity * price) - COALESCE(fee_deducted, 0)), 0)
  INTO v_withdrawn
  FROM transactions
  WHERE user_id = p_user_id
    AND type = 'SELL'
    AND (p_period_start IS NULL OR transaction_date >= p_period_start);

  -- 3. Zwracamy wynik
  RETURN QUERY SELECT 
    (v_deposited - v_withdrawn) as "totalValues", -- Net Investment (Ile kasy 'siedzi' w systemie)
    v_deposited as deposited,
    v_withdrawn as withdrawn;
END;
$$;


ALTER FUNCTION public.get_analytics(p_user_id uuid, p_period_start timestamp with time zone) OWNER TO postgres;

--
-- Name: get_chart_data(uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_chart_data(input_item_id uuid, period_text text) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_start_date timestamp;
    v_is_weekly boolean;
    v_min_date date;
    v_available_periods text[];
    v_chart_data jsonb;
BEGIN
    -- 1. Znajdź datę PIERWSZEJ REALNEJ CENY (cena > 0)
    -- To jest kluczowa poprawka: ignorujemy wpisy z ceną 0 lub NULL
    SELECT MIN(
        (make_date(ph.year, 1, 1) + ((elem->>0)::int - 1) * INTERVAL '1 day')::date
    ) INTO v_min_date
    FROM public.price_history ph,
         jsonb_array_elements(ph.history_data) elem
    WHERE ph.item_id = input_item_id
      AND (elem->>1)::numeric > 0; -- <--- FILTR: Ignoruj ceny 0.0

    -- Jeśli brak danych, zwróć pusty wynik (tylko 7D jako domyślne)
    IF v_min_date IS NULL THEN
        RETURN jsonb_build_object(
            'available_periods', ARRAY['7D'],
            'data', '[]'::jsonb
        );
    END IF;

    -- 2. Budujemy listę dostępnych okresów DYNAMICZNIE
    v_available_periods := ARRAY['7D']; -- 7D zawsze dostępne

    -- Dodajemy okresy tylko jeśli historia na to pozwala
    -- Używamy "mniejsze lub równe" (<=), co oznacza "starsze niż"
    
    IF v_min_date <= (CURRENT_DATE - INTERVAL '1 month') THEN
        v_available_periods := array_append(v_available_periods, '1M');
    END IF;

    IF v_min_date <= (CURRENT_DATE - INTERVAL '3 months') THEN
        v_available_periods := array_append(v_available_periods, '3M');
    END IF;
    
    IF v_min_date <= (CURRENT_DATE - INTERVAL '6 months') THEN
        v_available_periods := array_append(v_available_periods, '6M');
    END IF;
    
    IF v_min_date <= (CURRENT_DATE - INTERVAL '1 year') THEN
        v_available_periods := array_append(v_available_periods, '1Y');
    END IF;
    
    IF v_min_date <= (CURRENT_DATE - INTERVAL '5 years') THEN
        v_available_periods := array_append(v_available_periods, '5Y');
    END IF;
    
    -- ALL dodajemy zawsze (chyba że chcesz ukrywać dla bardzo nowych itemów, ale standard to pokazywać)
    v_available_periods := array_append(v_available_periods, 'ALL');

    -- 3. Konfiguracja wybranego okresu
    CASE period_text
        WHEN '7D' THEN v_start_date := (CURRENT_DATE - INTERVAL '6 days'); v_is_weekly := false;
        WHEN '1W' THEN v_start_date := (CURRENT_DATE - INTERVAL '6 days'); v_is_weekly := false;
        WHEN '1M' THEN v_start_date := (CURRENT_DATE - INTERVAL '1 month'); v_is_weekly := false;
        WHEN '3M' THEN v_start_date := (CURRENT_DATE - INTERVAL '3 months'); v_is_weekly := true;
        WHEN '6M' THEN v_start_date := (CURRENT_DATE - INTERVAL '6 months'); v_is_weekly := true;
        WHEN '1Y' THEN v_start_date := (CURRENT_DATE - INTERVAL '1 year'); v_is_weekly := true;
        WHEN '5Y' THEN v_start_date := (CURRENT_DATE - INTERVAL '5 years'); v_is_weekly := true;
        WHEN 'ALL' THEN v_start_date := '2013-01-01'::timestamp; v_is_weekly := true;
        ELSE v_start_date := (CURRENT_DATE - INTERVAL '1 month'); v_is_weekly := false;
    END CASE;

    -- 4. Generowanie danych wykresu
    WITH 
    raw_history AS (
        SELECT 
            ph.year,
            (NULLIF(elem->>0, '')::NUMERIC)::INT as day_of_year,
            (NULLIF(elem->>1, '')::NUMERIC) as item_price,
            (NULLIF(elem->>2, '')::NUMERIC)::INT as item_volume
        FROM public.price_history ph,
             jsonb_array_elements(ph.history_data) elem
        WHERE ph.item_id = input_item_id
    ),
    real_data AS (
        SELECT
            (make_date(year, 1, 1) + (day_of_year - 1) * INTERVAL '1 day')::date as exact_date,
            item_price,
            item_volume
        FROM raw_history
        WHERE day_of_year BETWEEN 1 AND 366 
          AND item_price > 0 -- <--- Tutaj też filtrujemy zera dla pewności
    ),
    -- Ustal start generowania: bierzemy późniejszą datę (zakres vs realny start)
    adjusted_start AS (
        SELECT CASE WHEN v_start_date < v_min_date THEN v_min_date ELSE v_start_date END as start_ts
    ),
    date_skeleton AS (
        SELECT generate_series(
            (SELECT start_ts::timestamp FROM adjusted_start), 
            CURRENT_DATE::timestamp, 
            CASE WHEN v_is_weekly THEN '1 week'::interval ELSE '1 day'::interval END
        )::timestamp as series_date
    ),
    chart_points AS (
        SELECT 
            ds.series_date as chart_date,
            COALESCE(
                -- a) Średnia cena z okresu
                (SELECT AVG(rd.item_price) FROM real_data rd 
                 WHERE CASE WHEN v_is_weekly THEN date_trunc('week', rd.exact_date) = date_trunc('week', ds.series_date) 
                            ELSE rd.exact_date = ds.series_date::date END),
                -- b) Ostatnia znana cena (LOCF)
                (SELECT rd.item_price FROM real_data rd 
                 WHERE rd.exact_date < ds.series_date::date 
                 ORDER BY rd.exact_date DESC LIMIT 1)
            )::numeric(10,2) as price,
            COALESCE(
                -- c) Suma wolumenu
                (SELECT SUM(rd.item_volume) FROM real_data rd 
                 WHERE CASE WHEN v_is_weekly THEN date_trunc('week', rd.exact_date) = date_trunc('week', ds.series_date) 
                            ELSE rd.exact_date = ds.series_date::date END),
                0
            )::bigint as volume
        FROM date_skeleton ds
        WHERE ds.series_date IS NOT NULL 
        ORDER BY ds.series_date ASC
    )
    SELECT jsonb_agg(chart_points) INTO v_chart_data FROM chart_points;

    -- 5. Zwracamy wynik
    RETURN jsonb_build_object(
        'available_periods', v_available_periods,
        'data', COALESCE(v_chart_data, '[]'::jsonb)
    );
END;
$$;


ALTER FUNCTION public.get_chart_data(input_item_id uuid, period_text text) OWNER TO postgres;

--
-- Name: get_collection_items(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_collection_items(p_collection_id uuid, p_user_id uuid DEFAULT auth.uid()) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$DECLARE
    v_result jsonb;
BEGIN
    -- 1. Zabezpieczenie autoryzacyjne
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated / User ID is missing';
    END IF;

    -- Upewniamy się, że kolekcja należy do użytkownika
    IF NOT EXISTS (SELECT 1 FROM public.collections WHERE id = p_collection_id AND user_id = p_user_id) THEN
        RAISE EXCEPTION 'Collection not found or access denied';
    END IF;

    -- 2. Główne zapytanie budujące zagnieżdżony JSON
    WITH item_totals AS (
        -- A. Najpierw wyliczamy, ile sztuk danego przedmiotu faktycznie posiadamy w kolekcji
        SELECT 
            item_id,
            SUM(CASE WHEN type IN ('BUY', 'DROP') THEN quantity WHEN type = 'SELL' THEN -quantity ELSE 0 END) AS total_quantity
        FROM public.transactions
        WHERE collection_id = p_collection_id
          AND user_id = p_user_id
        GROUP BY item_id
        -- Odrzucamy przedmioty, które zostały wyprzedane do zera
        HAVING SUM(CASE WHEN type IN ('BUY', 'DROP') THEN quantity WHEN type = 'SELL' THEN -quantity ELSE 0 END) > 0
    ),
    sell_deductions AS (
        -- B. NOWOŚĆ: Zliczamy wszystkie sprzedane sztuki dla każdego konkretnego zakupu
        SELECT 
            source_transaction_id, 
            SUM(quantity) AS sold_quantity
        FROM public.transactions
        WHERE collection_id = p_collection_id
          AND user_id = p_user_id
          AND type = 'SELL'
          AND source_transaction_id IS NOT NULL
        GROUP BY source_transaction_id
    ),
    item_batches AS (
        -- C. Grupujemy historie nabycia (BUY/DROP) pomniejszone o sprzedaż
        SELECT 
            t.item_id,
            jsonb_agg(
                jsonb_build_object(
                    'transaction_id', t.id,
                    'type', t.type,
                    'is_investment', COALESCE(t.is_investment, false),
                    -- NOWOŚĆ: Odejmujemy sprzedane sztuki (jeśli brak sprzedaży, odejmujemy 0)
                    'quantity', t.quantity - COALESCE(sd.sold_quantity, 0), 
                    'buy_price', t.price,
                    'date', to_char(t.transaction_date, 'YYYY-MM-DD')
                ) ORDER BY t.transaction_date DESC
            ) as batches
        FROM public.transactions t
        JOIN item_totals it ON t.item_id = it.item_id
        LEFT JOIN sell_deductions sd ON t.id = sd.source_transaction_id
        WHERE t.collection_id = p_collection_id
          AND t.user_id = p_user_id
          AND t.type IN ('BUY', 'DROP')
          -- NOWOŚĆ: Jeśli batch został całkowicie wyprzedany, nie dodajemy go do JSON-a!
          AND (t.quantity - COALESCE(sd.sold_quantity, 0)) > 0 
        GROUP BY t.item_id
    )
    -- D. Składamy wszystko w ostateczny, płaski model z zagnieżdżonymi "batches"
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'item_id', it.item_id,
            'name', c.market_hash_name,
            'quantity', it.total_quantity,
            'item_price', ROUND(COALESCE(c.price, 0), 2),
            'rarity', c.rarity,
            'category', COALESCE(c.category, 'other'),
            'icon_url', c.icon_url,
            'batches', COALESCE(ib.batches, '[]'::jsonb)
        )
        ORDER BY (it.total_quantity * COALESCE(c.price, 0)) DESC
    ), '[]'::jsonb)
    INTO v_result
    FROM item_totals it
    JOIN public.cs2_items c ON it.item_id = c.id
    LEFT JOIN item_batches ib ON it.item_id = ib.item_id;

    RETURN v_result;
END;$$;


ALTER FUNCTION public.get_collection_items(p_collection_id uuid, p_user_id uuid) OWNER TO postgres;

--
-- Name: get_collection_performance_chart(uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_collection_performance_chart(p_collection_id uuid, period_text text DEFAULT 'ALL'::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    first_transaction_date date;
    v_start_date date;
    v_interval interval;
    generation_start_date date;
    v_available_periods text[];
    v_chart_data jsonb;
BEGIN
    -- 1. Znajdź datę pierwszej transakcji w TEJ KONKRETNEJ KOLEKCJI
    SELECT MIN(transaction_date)::date INTO first_transaction_date
    FROM transactions
    WHERE collection_id = p_collection_id;

    -- Jeśli brak transakcji, zwróć pusty wynik (zgodny format)
    IF first_transaction_date IS NULL THEN
        RETURN jsonb_build_object('available_periods', ARRAY['7D'], 'data', '[]'::jsonb);
    END IF;

    -- 2. Dostępne okresy
    v_available_periods := ARRAY['7D']; 
    IF first_transaction_date <= (CURRENT_DATE - INTERVAL '1 month') THEN v_available_periods := array_append(v_available_periods, '1M'); END IF;
    IF first_transaction_date <= (CURRENT_DATE - INTERVAL '3 months') THEN v_available_periods := array_append(v_available_periods, '3M'); END IF;
    IF first_transaction_date <= (CURRENT_DATE - INTERVAL '6 months') THEN v_available_periods := array_append(v_available_periods, '6M'); END IF;
    IF first_transaction_date <= (CURRENT_DATE - INTERVAL '1 year') THEN v_available_periods := array_append(v_available_periods, '1Y'); END IF;
    IF first_transaction_date <= (CURRENT_DATE - INTERVAL '5 years') THEN v_available_periods := array_append(v_available_periods, '5Y'); END IF;
    v_available_periods := array_append(v_available_periods, 'ALL');

    -- 3. Konfiguracja wybranego okresu (Ze zoptymalizowanym Smart Interval)
    CASE period_text
        WHEN '7D' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '6 days'); v_interval := '1 day';
        WHEN '1M' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '1 month'); v_interval := '1 day';
        WHEN '3M' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '3 months'); v_interval := '1 week';
        WHEN '6M' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '6 months'); v_interval := '1 week';
        WHEN '1Y' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '1 year'); v_interval := '1 week';
        WHEN '5Y' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '5 years'); v_interval := '1 month';
        WHEN 'ALL' THEN 
            v_start_date := first_transaction_date;
            -- LOGIKA DYNAMICZNA: Jeśli historia kolekcji to mniej niż miesiąc, rysuj codziennie
            IF (CURRENT_DATE - first_transaction_date) <= 31 THEN
                v_interval := '1 day';
            ELSIF (CURRENT_DATE - first_transaction_date) <= 180 THEN
                v_interval := '1 week';
            ELSE
                v_interval := '1 month';
            END IF;
        ELSE 
            v_start_date := (CURRENT_DATE - INTERVAL '1 month'); v_interval := '1 day';
    END CASE;
    generation_start_date := v_start_date;

    -- 4. GŁÓWNA KALKULACJA
    WITH 
    date_series AS (
        SELECT generate_series(generation_start_date, CURRENT_DATE, v_interval)::date as day
    ),
    -- Pobieramy TYLKO transakcje z tej jednej kolekcji
    raw_txns AS (
        SELECT 
            transaction_date, 
            item_id,
            type,
            quantity,
            price
        FROM transactions
        WHERE collection_id = p_collection_id
        -- UWAGA: Usunąłem stąd problematyczne AND transaction_date <= NOW() 
        -- Filtrowanie daty odbywa się niżej w LATERAL.
    ),
    relevant_prices AS (
        SELECT 
            ph.item_id,
            (make_date(ph.year, 1, 1) + ((elem->>0)::int - 1) * INTERVAL '1 day')::date as price_date,
            (elem->>1)::numeric as price
        FROM price_history ph,
             jsonb_array_elements(ph.history_data) elem
        WHERE ph.item_id IN (SELECT DISTINCT item_id FROM raw_txns)
          AND ph.year >= EXTRACT(YEAR FROM generation_start_date) - 1
    ),
    
    chart_points AS (
        SELECT
            to_char(ds.day, 'YYYY-MM-DD') as chart_date,
            SUM(
                CASE WHEN held > 0 THEN 
                    held * COALESCE(
                        (SELECT price FROM relevant_prices rp WHERE rp.item_id = sub.item_id AND rp.price_date = ds.day),
                        (SELECT price FROM relevant_prices rp WHERE rp.item_id = sub.item_id AND rp.price_date < ds.day ORDER BY price_date DESC LIMIT 1),
                        0
                    )
                ELSE 0 END
            ) as portfolio_value,
            SUM(
                CASE WHEN held > 0 THEN 
                    held * (total_c / NULLIF(total_b, 0))
                ELSE 0 END
            ) as invested_value
        FROM date_series ds
        CROSS JOIN LATERAL (
            SELECT 
                item_id,
                -- Ilość Kupiona/Wydropona minus Sprzedana wewnątrz TEJ kolekcji
                SUM(CASE WHEN type IN ('BUY', 'DROP') THEN quantity WHEN type = 'SELL' THEN -quantity ELSE 0 END) as held,
                -- Suma wydatków wewnątrz kolekcji
                SUM(CASE WHEN type IN ('BUY', 'DROP') THEN quantity * price ELSE 0 END) as total_c,
                -- Całkowita ilość dodana (do uśredniania kosztów)
                SUM(CASE WHEN type IN ('BUY', 'DROP') THEN quantity ELSE 0 END) as total_b
            FROM raw_txns t
            WHERE t.transaction_date::date <= ds.day 
            GROUP BY item_id
        ) sub
        GROUP BY ds.day
        ORDER BY ds.day ASC
    )
    SELECT jsonb_agg(jsonb_build_object(
        'chart_date', chart_date, 
        'portfolio_value', ROUND(COALESCE(portfolio_value, 0), 2), 
        'invested_value', ROUND(COALESCE(invested_value, 0), 2)
    )) 
    INTO v_chart_data FROM chart_points;

    RETURN jsonb_build_object('available_periods', v_available_periods, 'data', COALESCE(v_chart_data, '[]'::jsonb));
END;
$$;


ALTER FUNCTION public.get_collection_performance_chart(p_collection_id uuid, period_text text) OWNER TO postgres;

--
-- Name: get_collection_stats(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_collection_stats(p_collection_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_total_invested numeric := 0;
    v_current_worth numeric := 0;
    v_investment_worth numeric := 0;
    v_equipment_worth numeric := 0;
    v_total_gain numeric := 0;
    v_roi numeric := 0;
    v_total_items_count integer := 0;
BEGIN
    -- Obliczenia opieramy na tabeli transactions, z uwzględnieniem podziału na inwestycje i equipment
    WITH item_batches AS (
        SELECT 
            t.item_id,
            COALESCE(t.is_investment, false) as is_investment_flag,
            -- Obliczamy aktualnie posiadaną ilość w danym "batchu" (Kupno/Drop minus Sprzedaż)
            SUM(CASE WHEN t.type IN ('BUY', 'DROP') THEN t.quantity WHEN t.type = 'SELL' THEN -t.quantity ELSE 0 END) AS held_qty,
            -- Sumujemy kupione sztuki i ich koszt, aby wyliczyć średnią cenę zakupu (Średni Koszt Bazowy)
            SUM(CASE WHEN t.type = 'BUY' THEN t.quantity ELSE 0 END) AS total_bought_qty,
            SUM(CASE WHEN t.type = 'BUY' THEN t.quantity * t.price ELSE 0 END) AS total_spent
        FROM 
            public.transactions t
        WHERE 
            t.collection_id = p_collection_id
        GROUP BY 
            t.item_id, 
            COALESCE(t.is_investment, false)
    ),
    batch_values AS (
        SELECT 
            ib.item_id,
            ib.is_investment_flag,
            ib.held_qty,
            -- Wartość zainwestowana dla aktualnie posiadanych sztuk (Ilość * Średnia Cena Zakupu)
            -- Jest to bezpieczniejsze i dużo wydajniejsze rozwiązanie bazodanowe niż ścisłe FIFO
            CASE 
                WHEN ib.total_bought_qty > 0 THEN (ib.total_spent / ib.total_bought_qty) * ib.held_qty
                ELSE 0 
            END AS invested_cost,
            -- Aktualna wartość rynkowa tych sztuk
            ib.held_qty * COALESCE(i.price, 0) AS current_worth
        FROM 
            item_batches ib
        JOIN 
            public.cs2_items i ON ib.item_id = i.id
        WHERE 
            ib.held_qty > 0 -- Interesują nas tylko przedmioty, które nadal są w tej kolekcji
    )
    -- Agregacja wyników do głównych zmiennych
    SELECT 
        COALESCE(SUM(invested_cost), 0),
        COALESCE(SUM(current_worth), 0),
        COALESCE(SUM(CASE WHEN is_investment_flag = true THEN current_worth ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN is_investment_flag = false THEN current_worth ELSE 0 END), 0),
        COALESCE(SUM(held_qty), 0)
    INTO 
        v_total_invested,
        v_current_worth,
        v_investment_worth,
        v_equipment_worth,
        v_total_items_count
    FROM 
        batch_values;

    -- Obliczenia pochodne (Zysk i ROI)
    v_total_gain := v_current_worth - v_total_invested;
    
    IF v_total_invested > 0 THEN
        v_roi := (v_total_gain / v_total_invested) * 100;
    ELSE
        v_roi := 0;
    END IF;

    -- Zwracamy sformatowany obiekt JSON
    RETURN jsonb_build_object(
        'total_invested', ROUND(v_total_invested, 2),
        'current_worth', ROUND(v_current_worth, 2),
        'investment_worth', ROUND(v_investment_worth, 2),
        'equipment_worth', ROUND(v_equipment_worth, 2),
        'total_gain', ROUND(v_total_gain, 2),
        'roi_percentage', ROUND(v_roi, 2),
        'total_items_count', v_total_items_count
    );
END;
$$;


ALTER FUNCTION public.get_collection_stats(p_collection_id uuid) OWNER TO postgres;

--
-- Name: get_collections(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_collections(p_user_id uuid) RETURNS TABLE(id uuid, user_id uuid, name text, created_at timestamp with time zone, unique_items_count integer, total_items_quantity integer, total_value numeric)
    LANGUAGE sql SECURITY DEFINER
    AS $$
    SELECT 
        c.id,
        c.user_id,
        c.name,
        c.created_at,
        COUNT(pi.id)::integer AS unique_items_count,
        COALESCE(SUM(pi.quantity), 0)::integer AS total_items_quantity,
        COALESCE(SUM(pi.quantity * i.price), 0)::numeric AS total_value
    FROM public.collections c
    LEFT JOIN public.portfolio_items pi 
        ON c.id = pi.collection_id 
        AND pi.quantity > 0
    LEFT JOIN public.cs2_items i 
        ON pi.item_id = i.id
    WHERE c.user_id = p_user_id
    GROUP BY c.id
    ORDER BY c.created_at ASC;
$$;


ALTER FUNCTION public.get_collections(p_user_id uuid) OWNER TO postgres;

--
-- Name: get_item_history_start_date(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_item_history_start_date(p_item_id uuid) RETURNS date
    LANGUAGE sql STABLE
    AS $$
    SELECT 
        (make_date(year, 1, 1) + ((history_data->0->>0)::int - 1) * interval '1 day')::date
    FROM public.price_history
    WHERE item_id = p_item_id
    ORDER BY year ASC
    LIMIT 1;
$$;


ALTER FUNCTION public.get_item_history_start_date(p_item_id uuid) OWNER TO postgres;

--
-- Name: get_item_lots(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_item_lots(p_user_id uuid, p_item_id uuid) RETURNS TABLE(portfolio_item_id uuid, quantity integer, buy_price numeric, acquired_at timestamp with time zone, current_price numeric, total_value numeric, roi_percent numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.quantity,
    p.buy_price,
    p.acquired_at,
    COALESCE(i.price, 0) as current_price,
    (p.quantity * COALESCE(i.price, 0)) as total_value,
    CASE 
        WHEN p.buy_price > 0 THEN 
            ROUND(((COALESCE(i.price, 0) - p.buy_price) / p.buy_price) * 100, 2)
        ELSE 0 
    END as roi_percent
  FROM portfolio_items p
  JOIN cs2_items i ON p.item_id = i.id
  WHERE p.user_id = p_user_id 
    AND p.item_id = p_item_id
  ORDER BY p.acquired_at DESC; -- Najnowsze zakupy na górze
END;
$$;


ALTER FUNCTION public.get_item_lots(p_user_id uuid, p_item_id uuid) OWNER TO postgres;

--
-- Name: get_paginated_transactions(uuid, integer, integer, text, boolean, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_paginated_transactions(p_user_id uuid, p_page integer DEFAULT 1, p_page_size integer DEFAULT 20, p_type_filter text DEFAULT NULL::text, p_is_investment boolean DEFAULT NULL::boolean, p_search_query text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_offset int;
    v_total_count int;
    v_has_more boolean;
    v_transactions jsonb;
BEGIN
    -- 1. Obliczanie przesunięcia (offset)
    v_offset := (p_page - 1) * p_page_size;

    -- 2. Pobieranie całkowitej liczby pasujących rekordów (potrzebne do paginacji)
    SELECT COUNT(*)
    INTO v_total_count
    FROM public.transactions t
    LEFT JOIN public.cs2_items i ON t.item_id = i.id
    WHERE t.user_id = p_user_id
      AND (
          (p_type_filter IS NOT NULL AND t.type::text = p_type_filter)
          OR 
          (p_type_filter IS NULL AND t.type::text != 'REMOVE')
      )
      AND (p_is_investment IS NULL OR t.is_investment = p_is_investment)
      AND (p_search_query IS NULL OR p_search_query = '' OR i.market_hash_name ILIKE '%' || p_search_query || '%');

    -- 3. Ustalenie, czy jest więcej stron
    v_has_more := (v_offset + p_page_size) < v_total_count;

    -- 4. Pobieranie spaginowanych danych i budowa płaskich obiektów JSON
    SELECT COALESCE(jsonb_agg(row_to_json), '[]'::jsonb)
    INTO v_transactions
    FROM (
        SELECT 
            t.id,
            t.type,
            t.quantity,
            t.price,
            t.fee_deducted,
            t.realized_profit,
            t.is_investment,
            t.transaction_date,
            t.created_at,
            t.item_id,
            t.collection_id,
            i.market_hash_name AS item_name, -- Spłaszczone dane z cs2_items
            i.icon_url                       -- Spłaszczone dane z cs2_items
        FROM public.transactions t
        LEFT JOIN public.cs2_items i ON t.item_id = i.id
        WHERE t.user_id = p_user_id
          AND (
              (p_type_filter IS NOT NULL AND t.type::text = p_type_filter)
              OR 
              (p_type_filter IS NULL AND t.type::text != 'REMOVE')
          )
          AND (p_is_investment IS NULL OR t.is_investment = p_is_investment)
          AND (p_search_query IS NULL OR p_search_query = '' OR i.market_hash_name ILIKE '%' || p_search_query || '%')
        ORDER BY t.transaction_date DESC
        LIMIT p_page_size
        OFFSET v_offset
    ) row_to_json;

    -- 5. Zwracanie finalnego obiektu
    RETURN jsonb_build_object(
        'transactions', v_transactions,
        'total_count', v_total_count,
        'has_more', v_has_more
    );
END;
$$;


ALTER FUNCTION public.get_paginated_transactions(p_user_id uuid, p_page integer, p_page_size integer, p_type_filter text, p_is_investment boolean, p_search_query text) OWNER TO postgres;

--
-- Name: get_portfolio_allocation(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_portfolio_allocation() RETURNS TABLE(category text, total_value numeric, percentage numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$DECLARE
    v_user_id uuid := auth.uid();
BEGIN
    -- 1. Bezpieczeństwo
    IF v_user_id IS NULL THEN 
        RAISE EXCEPTION 'Not authenticated'; 
    END IF;

    RETURN QUERY
    WITH calculated_items AS (
        SELECT
            -- Używamy nowej kolumny 'category' (z fallbackiem na 'other')
            COALESCE(i.category, 'other') AS cat_name,
            
            -- Obliczanie wartości pozycji (Aktualna Cena * Ilość)
            (p.quantity * COALESCE(i.price, 0)) AS item_value
        FROM public.portfolio_items p
        JOIN public.cs2_items i ON p.item_id = i.id
        WHERE p.user_id = v_user_id 
          AND p.quantity > 0 -- Pomijamy przedmioty wyzerowane
    ),
    category_sums AS (
        SELECT
            cat_name,
            SUM(item_value) AS cat_value
        FROM calculated_items
        GROUP BY cat_name
    ),
    total_sum AS (
        SELECT SUM(cat_value) as grand_total FROM category_sums
    )
    SELECT
        cs.cat_name::text,
        -- Zaokrąglamy samą wartość dla czystego widoku w UI
        ROUND(cs.cat_value::numeric, 2) AS total_value,
        
        -- Obliczanie procentu (Zabezpieczenie przed dzieleniem przez 0)
        CASE 
            WHEN ts.grand_total > 0 THEN ROUND((cs.cat_value / ts.grand_total) * 100, 2)
            ELSE 0 
        END AS percentage
    FROM category_sums cs
    CROSS JOIN total_sum ts
    ORDER BY cs.cat_value DESC; -- Najdroższe kategorie na górze
END;$$;


ALTER FUNCTION public.get_portfolio_allocation() OWNER TO postgres;

--
-- Name: get_portfolio_ath(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_portfolio_ath() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_user_id uuid := auth.uid();
    v_current_value NUMERIC := 0;
    v_ath_value NUMERIC := 0;
    v_ath_date TIMESTAMPTZ;
    v_percent_down NUMERIC := 0;
BEGIN
    -- 1. Bezpieczeństwo
    IF v_user_id IS NULL THEN 
        RAISE EXCEPTION 'Not authenticated'; 
    END IF;

    -- 2. Pobieranie AKTUALNEJ wartości (z zabezpieczeniem cen COALESCE)
    SELECT COALESCE(SUM(pi.quantity * COALESCE(i.price, 0)), 0) 
    INTO v_current_value
    FROM public.portfolio_items pi
    JOIN public.cs2_items i ON pi.item_id = i.id
    WHERE pi.user_id = v_user_id AND pi.quantity > 0;

    -- 3. Pobieranie NAJWYŻSZEJ historycznej wartości ze snapshotów
    SELECT total_value, recorded_at 
    INTO v_ath_value, v_ath_date
    FROM public.portfolio_snapshots
    WHERE user_id = v_user_id
    ORDER BY total_value DESC, recorded_at ASC
    LIMIT 1;

    -- 4. Logika ATH: Nadpisujemy, jeśli rekord został właśnie pobity (lub nie ma historii)
    IF v_ath_value IS NULL OR v_current_value > v_ath_value THEN
        v_ath_value := v_current_value;
        v_ath_date := now();
    END IF;

    -- 5. Obliczanie spadku w procentach (tylko jeśli jesteśmy pod ATH)
    IF v_ath_value > 0 AND v_current_value < v_ath_value THEN
        v_percent_down := ((v_ath_value - v_current_value) / v_ath_value) * 100;
    END IF;

    -- 6. Budowanie bezpiecznego JSON-a z zaokrągleniami
    RETURN jsonb_build_object(
        'current_value', ROUND(v_current_value, 2),
        'ath_value', ROUND(v_ath_value, 2),
        'ath_date', v_ath_date,
        'percent_down_from_ath', ROUND(v_percent_down, 2)
    );
END;
$$;


ALTER FUNCTION public.get_portfolio_ath() OWNER TO postgres;

--
-- Name: get_portfolio_ath_stats(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_portfolio_ath_stats(target_user_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_current_value NUMERIC := 0;
    v_ath_value NUMERIC := 0;
    v_ath_date TIMESTAMPTZ;
    v_percent_down NUMERIC := 0;
BEGIN
    -- 1. Obliczamy aktualną wartość portfela "na ten moment"
    SELECT COALESCE(SUM(pi.quantity * i.price), 0) INTO v_current_value
    FROM public.portfolio_items pi
    JOIN public.cs2_items i ON pi.item_id = i.id
    WHERE pi.user_id = target_user_id AND pi.quantity > 0;

    -- 2. Szukamy historycznego rekordu w snapshotach
    SELECT total_value, recorded_at INTO v_ath_value, v_ath_date
    FROM public.portfolio_snapshots
    WHERE user_id = target_user_id
    ORDER BY total_value DESC, recorded_at ASC
    LIMIT 1;

    -- Zabezpieczenie: Jeśli to pierwszy dzień apki (brak snapshotów) 
    -- lub dzisiejsza wartość pobiła stary rekord z wczoraj
    IF v_ath_value IS NULL OR v_current_value > v_ath_value THEN
        v_ath_value := v_current_value;
        v_ath_date := now();
    END IF;

    -- 3. Wyliczamy spadek od szczytu (w procentach)
    IF v_ath_value > 0 AND v_current_value < v_ath_value THEN
        v_percent_down := ROUND(((v_ath_value - v_current_value) / v_ath_value) * 100, 2);
    END IF;

    -- 4. Pakujemy wszystko i wysyłamy do aplikacji
    RETURN jsonb_build_object(
        'current_value', v_current_value,
        'ath_value', v_ath_value,
        'ath_date', v_ath_date,
        'percent_down_from_ath', v_percent_down
    );
END;
$$;


ALTER FUNCTION public.get_portfolio_ath_stats(target_user_id uuid) OWNER TO postgres;

--
-- Name: get_portfolio_chart(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_portfolio_chart(p_period text) RETURNS TABLE(chart_date text, total_value numeric, invested_value numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
DECLARE
    v_start_date date;
    v_interval_type text;
    v_user_id uuid := auth.uid();
    v_first_tx_date date;
BEGIN
    -- Zabezpieczenie: Jeśli ktoś wywoła to bez logowania, zwróć błąd
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Znajdź datę pierwszej transakcji do wyliczeń Smart Interval
    SELECT MIN(transaction_date)::date INTO v_first_tx_date
    FROM public.transactions 
    WHERE user_id = v_user_id;

    IF v_first_tx_date IS NULL THEN
        v_first_tx_date := CURRENT_DATE;
    END IF;

    -- Konfiguracja okresu
    CASE p_period
        WHEN '1W' THEN v_start_date := (CURRENT_DATE - INTERVAL '7 days'); v_interval_type := 'day';
        WHEN '1M' THEN v_start_date := (CURRENT_DATE - INTERVAL '1 month'); v_interval_type := 'day';
        WHEN '3M' THEN v_start_date := (CURRENT_DATE - INTERVAL '3 months'); v_interval_type := 'week';
        WHEN '6M' THEN v_start_date := (CURRENT_DATE - INTERVAL '6 months'); v_interval_type := 'week';
        WHEN '1Y' THEN v_start_date := (CURRENT_DATE - INTERVAL '1 year'); v_interval_type := 'week';
        WHEN '5Y' THEN v_start_date := (CURRENT_DATE - INTERVAL '5 years'); v_interval_type := 'month';
        WHEN 'ALL' THEN 
            v_start_date := v_first_tx_date;
            IF (CURRENT_DATE - v_first_tx_date) <= 31 THEN v_interval_type := 'day';
            ELSIF (CURRENT_DATE - v_first_tx_date) <= 180 THEN v_interval_type := 'week';
            ELSE v_interval_type := 'month'; END IF;
        ELSE 
            v_start_date := (CURRENT_DATE - INTERVAL '1 month'); v_interval_type := 'day';
    END CASE;

    RETURN QUERY
    WITH 
    -- 1. Zbieramy dzienne sumy transakcji (zmiany ilości i kosztów)
    daily_tx AS (
        SELECT 
            item_id,
            transaction_date::date AS tx_date,
            SUM(CASE WHEN type IN ('BUY', 'DROP') THEN quantity WHEN type = 'SELL' THEN -quantity ELSE 0 END) AS net_qty_change,
            SUM(CASE WHEN type IN ('BUY', 'DROP') THEN quantity ELSE 0 END) AS buy_qty,
            SUM(CASE WHEN type IN ('BUY', 'DROP') THEN quantity * price ELSE 0 END) AS buy_spend
        FROM public.transactions
        WHERE user_id = v_user_id
        GROUP BY item_id, transaction_date::date
    ),
    
    -- 2. LICZENIE KROCZĄCE: Sumujemy stany z dnia na dzień (Bardzo wydajne!)
    running_tx AS (
        SELECT 
            item_id,
            tx_date,
            SUM(net_qty_change) OVER (PARTITION BY item_id ORDER BY tx_date ASC) AS cumulative_held_qty,
            SUM(buy_qty) OVER (PARTITION BY item_id ORDER BY tx_date ASC) AS cumulative_buy_qty,
            SUM(buy_spend) OVER (PARTITION BY item_id ORDER BY tx_date ASC) AS cumulative_buy_spend
        FROM daily_tx
    ),

    -- 3. Rozpakowujemy JSON-y z historią cen dla posiadanych przedmiotów
    daily_prices AS (
        SELECT 
            ph.item_id,
            (make_date(ph.year, 1, 1) + ((point->>0)::int - 1) * INTERVAL '1 day')::date AS price_date,
            (point->>1)::numeric AS price
        FROM public.price_history ph
        CROSS JOIN LATERAL jsonb_array_elements(ph.history_data) AS point
        WHERE ph.item_id IN (SELECT DISTINCT item_id FROM running_tx)
          AND ph.year >= EXTRACT(YEAR FROM v_start_date)
          AND (point->>0) ~ '^\d+$'
    ),

    -- 4. Parujemy każdą cenę rynkową z aktualnym na ten dzień stanem portfela
    daily_portfolio AS (
        SELECT 
            dp.price_date,
            dp.item_id,
            rt.cumulative_held_qty,
            (rt.cumulative_buy_spend / NULLIF(rt.cumulative_buy_qty, 0)) AS avg_cost,
            dp.price
        FROM daily_prices dp
        LEFT JOIN LATERAL (
            -- Pobieramy OSTATNI stan przedmiotu z dnia równocześnego lub wcześniejszego
            SELECT cumulative_held_qty, cumulative_buy_qty, cumulative_buy_spend
            FROM running_tx rt
            WHERE rt.item_id = dp.item_id 
              AND rt.tx_date <= dp.price_date
            ORDER BY rt.tx_date DESC
            LIMIT 1
        ) rt ON true
        WHERE rt.cumulative_held_qty > 0 -- Interesują nas tylko te dni, w których fizycznie mieliśmy skina
    ),

    -- 5. Podsumowanie całego portfela na każdy dzień
    daily_totals AS (
        SELECT 
            price_date AS date_point,
            SUM(cumulative_held_qty * price) AS day_portfolio_value,
            SUM(cumulative_held_qty * COALESCE(avg_cost, 0)) AS day_invested_value
        FROM daily_portfolio
        WHERE price_date >= v_start_date
        GROUP BY price_date
    ),

    -- 6. MAGIA GIEŁDY: Grupowanie po okresach (Pobieramy wartość z zamknięcia interwału)
    period_closing AS (
        SELECT DISTINCT ON (
            CASE 
                WHEN v_interval_type = 'week' THEN date_trunc('week', date_point)
                WHEN v_interval_type = 'month' THEN date_trunc('month', date_point)
                ELSE date_trunc('day', date_point)
            END
        )
            CASE 
                WHEN v_interval_type = 'week' THEN to_char(date_trunc('week', date_point), 'YYYY-MM-DD')
                WHEN v_interval_type = 'month' THEN to_char(date_trunc('month', date_point), 'YYYY-MM-01')
                ELSE to_char(date_point, 'YYYY-MM-DD')
            END AS formatted_date,
            day_portfolio_value,
            day_invested_value,
            date_point
        FROM daily_totals
        ORDER BY 
            1 ASC,              -- Najpierw sortujemy po naszych 'paczkach' (np. konkretny tydzień)
            date_point DESC     -- Wewnątrz paczki bierzemy najnowszą dostępną datę
    )

    -- 7. Zwracamy finalne zaokrąglone wyniki
    SELECT 
        formatted_date AS chart_date,
        ROUND(day_portfolio_value, 2) AS total_value,
        ROUND(day_invested_value, 2) AS invested_value
    FROM period_closing;

END;
$_$;


ALTER FUNCTION public.get_portfolio_chart(p_period text) OWNER TO postgres;

--
-- Name: get_portfolio_current_values(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_portfolio_current_values(period_text text DEFAULT 'ALL'::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_user_id uuid := auth.uid();
    
    v_total_value numeric := 0;
    v_investments_value numeric := 0;
    v_inventory_value numeric := 0;
    
    v_deposited numeric := 0;
    v_withdrawn numeric := 0;
    
    v_total_invested_all_time numeric := 0;
    v_reference_value numeric := 0;
    v_period_gain numeric := 0;
    v_period_roi numeric := 0;
    
    v_start_date timestamp;
BEGIN
    -- Bezpieczeństwo
    IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

    -- 1. USTALANIE ZAKRESU CZASU
    CASE period_text
        WHEN '7D' THEN v_start_date := NOW() - INTERVAL '7 days';
        WHEN '1M' THEN v_start_date := NOW() - INTERVAL '1 month';
        WHEN '3M' THEN v_start_date := NOW() - INTERVAL '3 months';
        WHEN '6M' THEN v_start_date := NOW() - INTERVAL '6 months';
        WHEN '1Y' THEN v_start_date := NOW() - INTERVAL '1 year';
        WHEN '5Y' THEN v_start_date := NOW() - INTERVAL '5 years';
        ELSE v_start_date := '1970-01-01'::timestamp; 
    END CASE;

    -- 2. ASSETS VALUE 
    SELECT
        COALESCE(SUM(pi.quantity * COALESCE(i.price, 0)), 0),
        COALESCE(SUM(LEAST(pi.investment_quantity, pi.quantity) * COALESCE(i.price, 0)), 0),
        COALESCE(SUM((pi.quantity - LEAST(pi.investment_quantity, pi.quantity)) * COALESCE(i.price, 0)), 0),
        COALESCE(SUM(pi.quantity * COALESCE(pi.buy_price, 0)), 0)
    INTO
        v_total_value,
        v_investments_value,
        v_inventory_value,
        v_total_invested_all_time
    FROM public.portfolio_items pi
    JOIN public.cs2_items i ON pi.item_id = i.id
    WHERE pi.user_id = v_user_id AND pi.quantity > 0;

    -- 3. CASH FLOW (Rzutowanie typu ENUM i usunięcie pułapki NOW())
    SELECT
        COALESCE(SUM(CASE WHEN type::text = 'BUY' THEN quantity * price ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN type::text = 'SELL' THEN (quantity * price) - COALESCE(fee_deducted, 0) ELSE 0 END), 0)
    INTO
        v_deposited,
        v_withdrawn
    FROM public.transactions
    WHERE user_id = v_user_id
      AND transaction_date >= v_start_date;

    -- 4. LOGIKA GAIN / ROI
    IF period_text = 'ALL' THEN
        v_reference_value := v_total_invested_all_time;
        v_period_gain := v_total_value - v_reference_value;
    ELSE
        SELECT COALESCE(total_value, 0) INTO v_reference_value
        FROM public.portfolio_snapshots
        WHERE user_id = v_user_id AND recorded_at <= v_start_date
        ORDER BY recorded_at DESC
        LIMIT 1;

        IF v_reference_value IS NULL THEN 
            v_reference_value := 0; 
        END IF;

        v_period_gain := v_total_value - (v_reference_value + v_deposited - v_withdrawn);
        v_reference_value := v_reference_value + v_deposited;
    END IF;

    -- 5. OBLICZANIE PROCENTÓW (ROI)
    IF v_reference_value > 0 THEN
        v_period_roi := (v_period_gain / v_reference_value) * 100;
    ELSE
        v_period_roi := 0;
    END IF;

    -- 6. ZWRACANIE WYNIKU
    RETURN jsonb_build_object(
        'total_portfolio_value', ROUND(v_total_value, 2),
        'investments_value', ROUND(v_investments_value, 2),
        'inventory_value', ROUND(v_inventory_value, 2),
        'deposited', ROUND(v_deposited, 2),
        'withdrawn', ROUND(v_withdrawn, 2),
        'period_gain_value', ROUND(v_period_gain, 2),
        'period_roi_percentage', ROUND(v_period_roi, 2)
    );
END;
$$;


ALTER FUNCTION public.get_portfolio_current_values(period_text text) OWNER TO postgres;

--
-- Name: get_portfolio_history(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_portfolio_history(target_year integer) RETURNS TABLE(day_of_year integer, total_value numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- Zmienna na datę startową roku (np. 2026-01-01)
    start_date timestamp;
BEGIN
    start_date := make_timestamp(target_year, 1, 1, 0, 0, 0);

    RETURN QUERY
    WITH 
    -- 1. Pobieramy ID wszystkich przedmiotów, którymi użytkownik kiedykolwiek handlował
    my_items AS (
        SELECT DISTINCT item_id 
        FROM transactions 
        WHERE user_id = auth.uid()
    ),

    -- 2. Rozpakowujemy ceny TYLKO dla tych przedmiotów (zoptymalizowany JSONB)
    daily_prices AS (
        SELECT 
            ph.item_id,
            (point->>0)::int as doy,     -- Dzień roku
            (point->>1)::numeric as price -- Cena
        FROM price_history ph
        -- Magia: Rozwijamy tablicę tablic [[1, 10.5, 5], ...]
        CROSS JOIN LATERAL jsonb_array_elements(ph.history_data) as point
        WHERE ph.year = target_year
          AND ph.item_id IN (SELECT item_id FROM my_items)
    ),

    -- 3. Obliczamy stan magazynowy dla każdego przedmiotu na każdy dzień
    -- To jest najtrudniejsza część: "Ile miałem sztuk w dniu X?"
    item_quantities AS (
        SELECT
            dp.item_id,
            dp.doy,
            dp.price,
            (
                -- Podzapytanie skorelowane:
                -- Sumuj wszystkie transakcje do końca danego dnia (doy)
                SELECT COALESCE(SUM(
                    CASE 
                        WHEN t.type IN ('BUY', 'DROP') THEN t.quantity 
                        WHEN t.type = 'SELL' THEN -t.quantity
                        ELSE 0 
                    END
                ), 0)
                FROM transactions t
                WHERE t.user_id = auth.uid()
                  AND t.item_id = dp.item_id
                  -- Data transakcji musi być mniejsza lub równa bieżącemu dniu analizy
                  AND t.transaction_date < (start_date + (dp.doy || ' days')::interval)
            ) as quantity
        FROM daily_prices dp
    )

    -- 4. Agregacja końcowa: Sumujemy wartość wszystkich przedmiotów per dzień
    SELECT
        iq.doy as day_of_year,
        SUM(iq.quantity * iq.price) as total_value
    FROM item_quantities iq
    WHERE iq.quantity > 0 -- Liczymy tylko to, co użytkownik faktycznie miał
    GROUP BY iq.doy
    ORDER BY iq.doy;

END;
$$;


ALTER FUNCTION public.get_portfolio_history(target_year integer) OWNER TO postgres;

--
-- Name: get_portfolio_item_detail(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_portfolio_item_detail(p_item_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
    v_user_id uuid := auth.uid();
    v_result jsonb;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    WITH item_info AS (
        SELECT id, market_hash_name, icon_url, price
        FROM public.cs2_items
        WHERE id = p_item_id
    ),
    portfolio_agg AS (
        SELECT
            COALESCE(SUM(quantity), 0)::integer AS total_qty,
            CASE WHEN SUM(quantity) > 0 THEN SUM(quantity * buy_price) / SUM(quantity) ELSE 0 END AS avg_buy,
            COALESCE(SUM(quantity * buy_price), 0)::numeric AS total_invested
        FROM public.portfolio_items
        WHERE user_id = v_user_id AND item_id = p_item_id
    ),
    sales_agg AS (
        SELECT
            COALESCE(SUM(quantity), 0)::integer AS sold_qty,
            COALESCE(SUM(realized_profit), 0)::numeric AS total_realized_profit
        FROM public.transactions
        WHERE user_id = v_user_id AND item_id = p_item_id AND type::text = 'SELL'
    )
    SELECT jsonb_build_object(
        'item_id', i.id,
        'market_hash_name', i.market_hash_name,
        'icon_url', i.icon_url,
        'current_market_price', COALESCE(i.price, 0),
        'last_price_update', NULL,
        'owned_quantity', p.total_qty,
        'avg_buy_price', ROUND(p.avg_buy, 2),
        'total_invested', ROUND(p.total_invested, 2),
        'current_value', ROUND(p.total_qty * COALESCE(i.price, 0), 2),
        'unrealized_profit', ROUND((p.total_qty * COALESCE(i.price, 0)) - p.total_invested, 2),
        'roi_percentage', CASE
            WHEN p.total_invested > 0 THEN ROUND(
                (((p.total_qty * COALESCE(i.price, 0)) - p.total_invested) / p.total_invested) * 100, 2
            )
            ELSE 0
        END,
        'history_sold_quantity', s.sold_qty,
        'history_realized_profit', ROUND(s.total_realized_profit, 2)
    ) INTO v_result
    FROM item_info i
    CROSS JOIN portfolio_agg p
    CROSS JOIN sales_agg s;

    RETURN v_result;
END;
$$;


ALTER FUNCTION public.get_portfolio_item_detail(p_item_id uuid) OWNER TO postgres;

--
-- Name: get_portfolio_quality_structure(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_portfolio_quality_structure(p_user_id uuid) RETURNS TABLE(quality_name text, total_value numeric, item_count bigint)
    LANGUAGE plpgsql
    AS $$
begin
  return query
  select
    coalesce(i.rarity, 'Base Grade') as quality_name,
    sum(p.quantity * coalesce(i.price, 0)) as total_value,
    sum(p.quantity) as item_count
  from public.portfolio_items p
  join public.cs2_items i on p.item_id = i.id
  where p.user_id = p_user_id and p.quantity > 0
  group by coalesce(i.rarity, 'Base Grade')
  order by total_value desc;
end;
$$;


ALTER FUNCTION public.get_portfolio_quality_structure(p_user_id uuid) OWNER TO postgres;

--
-- Name: get_portfolio_stats(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_portfolio_stats(p_user_id uuid) RETURNS TABLE(total_invested numeric, total_transactions bigint, total_earned numeric)
    LANGUAGE sql SECURITY DEFINER
    AS $$
  SELECT 
    -- 1. Total Invested: Suma (ilość * cena) tylko dla transakcji BUY
    COALESCE(
      SUM(quantity * price) FILTER (WHERE type = 'BUY'), 
      0
    ) as total_invested,

    -- 2. Total Transactions: Liczba wszystkich wierszy
    COUNT(*) as total_transactions,

    -- 3. Total Earned: Suma zrealizowanego zysku (kolumna, którą dodaliśmy wcześniej)
    COALESCE(
      SUM(realized_profit), 
      0
    ) as total_earned

  FROM public.transactions
  WHERE user_id = p_user_id;
$$;


ALTER FUNCTION public.get_portfolio_stats(p_user_id uuid) OWNER TO postgres;

--
-- Name: get_portfolio_treemap_data(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_portfolio_treemap_data() RETURNS TABLE(category text, item_name text, total_value numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Zabezpieczenie przed brakiem logowania
    IF auth.uid() IS NULL THEN 
        RAISE EXCEPTION 'Not authenticated'; 
    END IF;

    RETURN QUERY
    SELECT 
        -- Używamy Twojej kolumny, w razie braku wpisujemy 'Inne'
        COALESCE(c.category, 'Inne') AS category,
        c.market_hash_name AS item_name,
        SUM(pi.quantity * COALESCE(c.price, 0))::numeric AS total_value
    FROM public.portfolio_items pi
    JOIN public.cs2_items c ON pi.item_id = c.id
    WHERE pi.user_id = auth.uid() AND pi.quantity > 0
    GROUP BY c.category, c.market_hash_name
    -- Odrzucamy śmieciowe przedmioty o zerowej wartości, żeby nie psuły mapy drzewa
    HAVING SUM(pi.quantity * COALESCE(c.price, 0)) > 0
    ORDER BY total_value DESC;
END;
$$;


ALTER FUNCTION public.get_portfolio_treemap_data() OWNER TO postgres;

--
-- Name: get_portfolio_value_chart(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_portfolio_value_chart(p_period text DEFAULT '1M'::text) RETURNS TABLE(chart_date text, total_value numeric, invested_value numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
DECLARE
    v_start_date date;
    v_interval_type text; -- Obsługuje 'day', 'week', 'month'
    v_user_id uuid;
    v_first_tx_date date;
BEGIN
    -- 1. Pobieramy ID zalogowanego użytkownika
    v_user_id := auth.uid();

    -- Zabezpieczenie: Jeśli ktoś wywoła to bez logowania, zwróć błąd
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Znajdź datę pierwszej transakcji do wyliczeń Smart Interval
    SELECT MIN(transaction_date)::date INTO v_first_tx_date
    FROM transactions 
    WHERE user_id = v_user_id;

    IF v_first_tx_date IS NULL THEN
        v_first_tx_date := CURRENT_DATE;
    END IF;

    -- 2. Konfiguracja okresu (Ile danych wstecz i jak grupować)
    CASE p_period
        WHEN '1W' THEN
            v_start_date := (CURRENT_DATE - INTERVAL '7 days');
            v_interval_type := 'day';
        WHEN '1M' THEN
            v_start_date := (CURRENT_DATE - INTERVAL '1 month');
            v_interval_type := 'day';
        WHEN '3M' THEN
            v_start_date := (CURRENT_DATE - INTERVAL '3 months');
            v_interval_type := 'week';
        WHEN '6M' THEN
            v_start_date := (CURRENT_DATE - INTERVAL '6 months');
            v_interval_type := 'week'; 
        WHEN '1Y' THEN
            v_start_date := (CURRENT_DATE - INTERVAL '1 year');
            v_interval_type := 'week'; 
        WHEN '5Y' THEN
            v_start_date := (CURRENT_DATE - INTERVAL '5 years');
            v_interval_type := 'month';  -- Włączamy grupowanie miesięczne
        WHEN 'ALL' THEN
            v_start_date := v_first_tx_date;
            -- LOGIKA DYNAMICZNA:
            IF (CURRENT_DATE - v_first_tx_date) <= 31 THEN
                v_interval_type := 'day';
            ELSIF (CURRENT_DATE - v_first_tx_date) <= 180 THEN
                v_interval_type := 'week';
            ELSE
                v_interval_type := 'month';
            END IF;
        ELSE
            -- Domyślnie 1 miesiąc
            v_start_date := (CURRENT_DATE - INTERVAL '1 month');
            v_interval_type := 'day';
    END CASE;

    RETURN QUERY
    WITH 
    -- A. Pobieramy listę przedmiotów, które użytkownik kiedykolwiek posiadał
    my_items AS (
        SELECT DISTINCT item_id 
        FROM transactions 
        WHERE user_id = v_user_id
    ),

    -- B. Rozpakowujemy historię cen (z formatu JSONB: [day, price, vol])
    daily_prices AS (
        SELECT 
            ph.item_id,
            -- Konwersja: Rok + DzieńRoku -> Data (YYYY-MM-DD)
            (make_date(ph.year, 1, 1) + ((point->>0)::int - 1) * INTERVAL '1 day')::date as price_date,
            (point->>1)::numeric as price
        FROM price_history ph
        CROSS JOIN LATERAL jsonb_array_elements(ph.history_data) as point
        WHERE ph.item_id IN (SELECT item_id FROM my_items)
          AND ph.year >= EXTRACT(YEAR FROM v_start_date)
          -- ZABEZPIECZENIE: Ignoruj rekordy, gdzie dzień nie jest liczbą całkowitą
          AND (point->>0) ~ '^\d+$'
    ),

    -- C. Obliczamy stan magazynowy i koszty dla każdego punktu w czasie
    item_quantities AS (
        SELECT
            dp.price_date,
            dp.price,
            tx.held_quantity,
            tx.avg_buy_price
        FROM daily_prices dp
        CROSS JOIN LATERAL (
            SELECT 
                -- 1. Ile sztuk faktycznie posiadamy tego dnia (Kupione + Dropy - Sprzedane)
                COALESCE(SUM(CASE WHEN t.type IN ('BUY', 'DROP') THEN t.quantity WHEN t.type = 'SELL' THEN -t.quantity ELSE 0 END), 0) as held_quantity,
                
                -- 2. Średnia cena zakupu tego przedmiotu do tego dnia
                CASE 
                    WHEN COALESCE(SUM(CASE WHEN t.type IN ('BUY', 'DROP') THEN t.quantity ELSE 0 END), 0) > 0 
                    THEN SUM(CASE WHEN t.type IN ('BUY', 'DROP') THEN t.quantity * t.price ELSE 0 END) / SUM(CASE WHEN t.type IN ('BUY', 'DROP') THEN t.quantity ELSE 0 END)
                    ELSE 0 
                END as avg_buy_price
            FROM transactions t
            WHERE t.user_id = v_user_id
              AND t.item_id = dp.item_id
              -- Bierzemy pod uwagę tylko historię do tego konkretnego dnia!
              AND t.transaction_date::date <= dp.price_date
        ) tx
        WHERE dp.price_date >= v_start_date
    ),

    -- D. Sumujemy wartość portfolio i inwestycji dla każdego dnia
    daily_totals AS (
        SELECT
            iq.price_date as date_point,
            -- Wartość Rynkowa: Posiadane sztuki * dzisiejsza cena rynkowa
            SUM(iq.held_quantity * iq.price) as day_portfolio_value,
            
            -- Wartość Inwestycji: Posiadane sztuki * historyczny średni koszt zakupu
            SUM(iq.held_quantity * iq.avg_buy_price) as day_invested_value
        FROM item_quantities iq
        WHERE iq.held_quantity > 0
        GROUP BY iq.price_date
    )

    -- E. Finalna agregacja (Dzienna, Tygodniowa lub Miesięczna)
    SELECT
        CASE 
            WHEN v_interval_type = 'week' THEN to_char(date_trunc('week', date_point), 'YYYY-MM-DD')
            WHEN v_interval_type = 'month' THEN to_char(date_trunc('month', date_point), 'YYYY-MM-01')
            ELSE to_char(date_point, 'YYYY-MM-DD')
        END as chart_date,
        
        ROUND(AVG(day_portfolio_value), 2) as total_value,
        ROUND(AVG(day_invested_value), 2) as invested_value
    FROM daily_totals
    GROUP BY 1
    ORDER BY 1 ASC;

END;
$_$;


ALTER FUNCTION public.get_portfolio_value_chart(p_period text) OWNER TO postgres;

--
-- Name: get_profit_heatmap(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_profit_heatmap() RETURNS TABLE(time_unit text, unit_value integer, total_revenue numeric, total_profit numeric, trades_count integer)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Zabezpieczenie przed niezalogowanymi
    IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

    RETURN QUERY
    -- 1. Agregacja po Dniach Tygodnia (używamy ISODOW: 1 = Poniedziałek, 7 = Niedziela)
    SELECT 
        'DOW'::text AS time_unit,
        EXTRACT(ISODOW FROM transaction_date)::integer AS unit_value,
        SUM(quantity * price)::numeric AS total_revenue,
        SUM(COALESCE(realized_profit, 0))::numeric AS total_profit,
        COUNT(*)::integer AS trades_count
    FROM public.transactions
    WHERE user_id = auth.uid() AND type::text = 'SELL'
    GROUP BY EXTRACT(ISODOW FROM transaction_date)
    
    UNION ALL
    
    -- 2. Agregacja po Miesiącach (1 = Styczeń, 12 = Grudzień)
    SELECT 
        'MONTH'::text AS time_unit,
        EXTRACT(MONTH FROM transaction_date)::integer AS unit_value,
        SUM(quantity * price)::numeric AS total_revenue,
        SUM(COALESCE(realized_profit, 0))::numeric AS total_profit,
        COUNT(*)::integer AS trades_count
    FROM public.transactions
    WHERE user_id = auth.uid() AND type::text = 'SELL'
    GROUP BY EXTRACT(MONTH FROM transaction_date);
END;
$$;


ALTER FUNCTION public.get_profit_heatmap() OWNER TO postgres;

--
-- Name: get_public_portfolio(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_public_portfolio(p_token text) RETURNS jsonb
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
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


ALTER FUNCTION public.get_public_portfolio(p_token text) OWNER TO postgres;

--
-- Name: get_public_portfolio_history(text, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_public_portfolio_history(p_token text, p_page integer DEFAULT 1, p_page_size integer DEFAULT 15) RETURNS jsonb
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
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


ALTER FUNCTION public.get_public_portfolio_history(p_token text, p_page integer, p_page_size integer) OWNER TO postgres;

--
-- Name: get_sales_chart_data(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_sales_chart_data(target_user_id uuid) RETURNS TABLE(sale_date date, total_sales_value numeric, items_sold bigint, total_realized_profit numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('day', t.transaction_date)::DATE AS sale_date,
        SUM(t.price * t.quantity) AS total_sales_value,
        SUM(t.quantity) AS items_sold,
        SUM(t.realized_profit) AS total_realized_profit
    FROM public.transactions t
    WHERE t.user_id = target_user_id
      AND t.type = 'SELL'
    GROUP BY DATE_TRUNC('day', t.transaction_date)::DATE
    ORDER BY sale_date ASC;
END;
$$;


ALTER FUNCTION public.get_sales_chart_data(target_user_id uuid) OWNER TO postgres;

--
-- Name: get_sales_pnl_chart(uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_sales_pnl_chart(target_user_id uuid, period_text text DEFAULT '1M'::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    first_transaction_date DATE;
    v_available_periods TEXT[] := ARRAY['7D'];
    v_start_date DATE;
    v_interval TEXT;
    v_trunc_unit TEXT;
    v_initial_profit NUMERIC := 0;
    result_json JSONB;
BEGIN
    -- 1. Pobranie daty pierwszej transakcji sprzedażowej użytkownika
    SELECT MIN(transaction_date)::DATE INTO first_transaction_date
    FROM public.transactions
    WHERE user_id = target_user_id AND type = 'SELL';

    -- Jeśli user nic nie sprzedał, zabezpieczamy datę
    IF first_transaction_date IS NULL THEN
        first_transaction_date := CURRENT_DATE;
    END IF;

    -- 2. Generowanie dostępnych okresów (Twój kod)
    IF first_transaction_date <= (CURRENT_DATE - INTERVAL '1 month')::DATE THEN v_available_periods := array_append(v_available_periods, '1M'); END IF;
    IF first_transaction_date <= (CURRENT_DATE - INTERVAL '3 months')::DATE THEN v_available_periods := array_append(v_available_periods, '3M'); END IF;
    IF first_transaction_date <= (CURRENT_DATE - INTERVAL '6 months')::DATE THEN v_available_periods := array_append(v_available_periods, '6M'); END IF;
    IF first_transaction_date <= (CURRENT_DATE - INTERVAL '1 year')::DATE THEN v_available_periods := array_append(v_available_periods, '1Y'); END IF;
    IF first_transaction_date <= (CURRENT_DATE - INTERVAL '5 years')::DATE THEN v_available_periods := array_append(v_available_periods, '5Y'); END IF;
    v_available_periods := array_append(v_available_periods, 'ALL');

    -- 3. Konfiguracja wybranego okresu (Smart Interval)
    CASE period_text
        WHEN '7D' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '6 days')::DATE; v_trunc_unit := 'day';
        WHEN '1M' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '1 month')::DATE; v_trunc_unit := 'day';
        WHEN '3M' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '3 months')::DATE; v_trunc_unit := 'week';
        WHEN '6M' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '6 months')::DATE; v_trunc_unit := 'week';
        WHEN '1Y' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '1 year')::DATE; v_trunc_unit := 'week';
        WHEN '5Y' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '5 years')::DATE; v_trunc_unit := 'month';
        WHEN 'ALL' THEN 
            v_start_date := first_transaction_date;
            IF (CURRENT_DATE - first_transaction_date) <= 31 THEN
                v_trunc_unit := 'day';
            ELSIF (CURRENT_DATE - first_transaction_date) <= 180 THEN
                v_trunc_unit := 'week';
            ELSE
                v_trunc_unit := 'month';
            END IF;
        ELSE 
            v_start_date := (CURRENT_DATE - INTERVAL '1 month')::DATE; v_trunc_unit := 'day';
    END CASE;

    -- 4. Kapitał początkowy (Zysk wypracowany PRZED v_start_date)
    SELECT COALESCE(SUM(realized_profit), 0) INTO v_initial_profit
    FROM public.transactions
    WHERE user_id = target_user_id
      AND type = 'SELL'
      AND transaction_date < v_start_date;

    -- 5. Magia Wykresu: Grupowanie i liczenie narastające
    WITH GroupedTrades AS (
        -- Grupowanie transakcji w paczki (dni/tygodnie/miesiące)
        SELECT 
            DATE_TRUNC(v_trunc_unit, transaction_date)::DATE AS trade_date,
            SUM(realized_profit) AS period_profit,
            SUM(quantity) AS items_sold
        FROM public.transactions
        WHERE user_id = target_user_id
          AND type = 'SELL'
          AND transaction_date >= v_start_date
        GROUP BY 1
    ),
    CalculatedTotal AS (
        -- Wyliczanie zysku skumulowanego z uwzględnieniem kapitału początkowego
        SELECT 
            trade_date AS date,
            period_profit,
            items_sold,
            SUM(period_profit) OVER (ORDER BY trade_date ASC) + v_initial_profit AS cumulative_profit
        FROM GroupedTrades
    ),
    FinalChartData AS (
        -- WSTAWIANIE PUNKTU STARTOWEGO (Zabezpieczenie przed pustym wykresem)
        SELECT 
            v_start_date AS date,
            0::NUMERIC AS period_profit,
            0::BIGINT AS items_sold,
            v_initial_profit AS cumulative_profit
        WHERE NOT EXISTS (SELECT 1 FROM CalculatedTotal WHERE date = v_start_date)
        
        UNION ALL
        
        SELECT * FROM CalculatedTotal
    )
    -- 6. Budowanie i zwracanie JSONa
    SELECT jsonb_build_object(
        'available_periods', to_jsonb(v_available_periods),
        'selected_period', period_text,
        'interval_unit', v_trunc_unit,
        'chart_data', COALESCE(jsonb_agg(to_jsonb(fcd.*) ORDER BY fcd.date ASC), '[]'::jsonb)
    ) INTO result_json
    FROM FinalChartData fcd;

    RETURN result_json;
END;
$$;


ALTER FUNCTION public.get_sales_pnl_chart(target_user_id uuid, period_text text) OWNER TO postgres;

--
-- Name: get_stagnant_items(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_stagnant_items(p_days_threshold integer DEFAULT 180) RETURNS TABLE(skin_id uuid, market_hash_name text, icon_url text, folder_id uuid, quantity integer, avg_buy_price numeric, total_invested numeric, current_total_value numeric, last_activity timestamp with time zone, days_stagnant integer)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

    RETURN QUERY
    SELECT
        pi.item_id,
        c.market_hash_name,
        c.icon_url,
        pi.collection_id,
        pi.quantity,
        pi.buy_price,
        (pi.quantity * pi.buy_price) AS total_invested,
        (pi.quantity * COALESCE(c.price, 0)) AS current_total_value,
        MAX(t.transaction_date) AS last_activity,
        (CURRENT_DATE - MAX(t.transaction_date)::date) AS days_stagnant
    FROM public.portfolio_items pi
    JOIN public.transactions t 
        ON pi.user_id = t.user_id 
        AND pi.item_id = t.item_id 
        AND pi.collection_id IS NOT DISTINCT FROM t.collection_id
    JOIN public.cs2_items c 
        ON pi.item_id = c.id
    WHERE pi.user_id = auth.uid() 
      AND pi.quantity > 0
    GROUP BY 
        pi.item_id, 
        c.market_hash_name,
        c.icon_url,
        pi.collection_id, 
        pi.quantity, 
        pi.buy_price,
        c.price
    HAVING (CURRENT_DATE - MAX(t.transaction_date)::date) >= p_days_threshold
    ORDER BY current_total_value DESC, days_stagnant DESC;
END;
$$;


ALTER FUNCTION public.get_stagnant_items(p_days_threshold integer) OWNER TO postgres;

--
-- Name: get_user_drop_history(uuid, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_drop_history(p_user_id uuid, p_page integer, p_page_size integer) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_result jsonb;
    v_offset integer;
BEGIN
    v_offset := (p_page - 1) * p_page_size;

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', sub.id,
            'item_id', sub.item_id,
            'market_hash_name', sub.market_hash_name, -- Tylko jeden, konkretny klucz
            'icon_url', sub.icon_url,
            'current_price', COALESCE(sub.price, 0),
            'quantity', sub.quantity,
            'transaction_date', sub.transaction_date,
            'type', sub.type
        )
    ), '[]'::jsonb)
    INTO v_result
    FROM (
        SELECT 
            t.id, 
            t.item_id, 
            i.market_hash_name, 
            i.icon_url, 
            i.price, 
            t.quantity, 
            t.transaction_date, 
            t.type
        FROM public.transactions t
        JOIN public.cs2_items i ON t.item_id = i.id
        WHERE t.user_id = p_user_id 
          AND t.type = 'DROP'
        ORDER BY t.transaction_date DESC
        LIMIT p_page_size 
        OFFSET v_offset
    ) sub;

    RETURN v_result;
END;
$$;


ALTER FUNCTION public.get_user_drop_history(p_user_id uuid, p_page integer, p_page_size integer) OWNER TO postgres;

--
-- Name: get_user_drops_analytics(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_drops_analytics() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_user_id uuid := auth.uid();
    
    v_total_value numeric := 0;
    v_total_drops integer := 0;
    v_weekly_average numeric := 0;
    v_projected_yearly numeric := 0;
    v_first_drop_date date;
    v_weeks_active numeric := 1;
    v_current_streak integer := 0;
    v_next_milestone numeric := 0;
    
    v_best_drop jsonb;
    v_active_drops jsonb;
    v_monthly_values jsonb;
    v_top_assets jsonb;
    v_cumulative_history jsonb;
    v_weekly_history jsonb;
    v_recent_drops jsonb;
    
    v_check_week date;
    v_has_drop boolean;
BEGIN
    -- Bezpieczeństwo
    IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

    -- 1. TWORZENIE TABELI TYMCZASOWEJ
    CREATE TEMP TABLE tmp_user_drops ON COMMIT DROP AS
    SELECT 
        t.id, 
        t.transaction_date, 
        t.quantity, 
        (t.quantity * COALESCE(i.price, 0)) AS total_value,
        i.market_hash_name AS name, 
        i.icon_url,
        (date_trunc('week', t.transaction_date - INTERVAL '2 days') + INTERVAL '2 days')::date AS cs_week,
        t.transaction_date::date AS day
    FROM public.transactions t
    JOIN public.cs2_items i ON t.item_id = i.id
    WHERE t.user_id = v_user_id AND t.type = 'DROP';

    -- 2. BAZOWE STATYSTYKI
    SELECT 
        COALESCE(SUM(total_value), 0),
        COALESCE(SUM(quantity), 0),
        MIN(day)
    INTO v_total_value, v_total_drops, v_first_drop_date
    FROM tmp_user_drops;

    -- 3. ZAAWANSOWANA MATEMATYKA
    IF v_total_drops > 0 THEN
        v_weeks_active := GREATEST(1, (CURRENT_DATE - v_first_drop_date) / 7.0);
        v_weekly_average := v_total_value / v_weeks_active;
        v_projected_yearly := v_weekly_average * 52;
        
        v_next_milestone := (FLOOR(v_total_value / 50.0) + 1) * 50;
        
        SELECT jsonb_build_object('value', ROUND(total_value, 2), 'name', name, 'image_url', icon_url)
        INTO v_best_drop
        FROM tmp_user_drops ORDER BY total_value DESC LIMIT 1;
    ELSE
        v_next_milestone := 50;
        v_best_drop := null;
    END IF;

    -- 4. LOGIKA STREAKA (Środa do Środy)
    v_check_week := (date_trunc('week', CURRENT_DATE - INTERVAL '2 days') + INTERVAL '2 days')::date;
    LOOP
        SELECT EXISTS(SELECT 1 FROM tmp_user_drops WHERE cs_week = v_check_week) INTO v_has_drop;
        IF v_has_drop THEN
            v_current_streak := v_current_streak + 1;
            v_check_week := v_check_week - INTERVAL '1 week';
        ELSE
            IF v_current_streak = 0 AND v_check_week = (date_trunc('week', CURRENT_DATE - INTERVAL '2 days') + INTERVAL '2 days')::date THEN
                v_check_week := v_check_week - INTERVAL '1 week';
            ELSE
                EXIT;
            END IF;
        END IF;
    END LOOP;

    -- 5. AKTYWNE DROPY
    SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'count', sum_qty, 'value', ROUND(sum_val, 2), 'image_url', icon_url)), '[]'::jsonb)
    INTO v_active_drops
    FROM (
        SELECT name, icon_url, SUM(quantity) as sum_qty, SUM(total_value) as sum_val 
        FROM tmp_user_drops GROUP BY name, icon_url ORDER BY sum_qty DESC LIMIT 10
    ) sub;

    -- 6. TOP ASSETS
    SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'value', ROUND(sum_val, 2), 'quantity', sum_qty)), '[]'::jsonb)
    INTO v_top_assets
    FROM (
        SELECT name, SUM(quantity) as sum_qty, SUM(total_value) as sum_val 
        FROM tmp_user_drops GROUP BY name ORDER BY sum_val DESC LIMIT 3
    ) sub;

    -- 7. RECENT DROPS
    SELECT COALESCE(jsonb_agg(jsonb_build_object('name', name, 'image_url', icon_url, 'date', transaction_date, 'value', ROUND(total_value, 2), 'quantity', quantity)), '[]'::jsonb)
    INTO v_recent_drops
    FROM (
        SELECT name, icon_url, transaction_date, total_value, quantity 
        FROM tmp_user_drops ORDER BY transaction_date DESC LIMIT 20
    ) sub;

    -- 8. WARTOSCI MIESIECZNE (NAPRAWIONA AGREGACJA)
    WITH months AS (
        SELECT 
            to_char(date_trunc('month', CURRENT_DATE - (n || ' months')::interval), 'MM-YYYY') as month_label,
            date_trunc('month', CURRENT_DATE - (n || ' months')::interval) as month_start
        FROM generate_series(5, 0, -1) n
    ),
    monthly_sums AS (
        -- Najpierw bezpiecznie grupujemy i sumujemy...
        SELECT 
            m.month_start, 
            m.month_label, 
            COALESCE(SUM(ud.total_value), 0) as total_val
        FROM months m
        LEFT JOIN tmp_user_drops ud ON date_trunc('month', ud.transaction_date) = m.month_start
        GROUP BY m.month_start, m.month_label
        ORDER BY m.month_start
    )
    -- ...a dopiero potem pakujemy gotowe sumy do jsonb_agg
    SELECT COALESCE(jsonb_agg(jsonb_build_object('month', month_label, 'value', ROUND(total_val, 2))), '[]'::jsonb)
    INTO v_monthly_values
    FROM monthly_sums;

    -- 9. WEEKLY DROP HISTORY
    WITH weeks AS (
        SELECT (date_trunc('week', CURRENT_DATE - INTERVAL '2 days' - (n || ' weeks')::interval) + INTERVAL '2 days')::date as week_start
        FROM generate_series(9, 0, -1) n
    )
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'week_label', to_char(w.week_start, 'DD.MM'),
        'claimed', EXISTS(SELECT 1 FROM tmp_user_drops ud WHERE ud.cs_week = w.week_start)
    )), '[]'::jsonb)
    INTO v_weekly_history
    FROM weeks w;

    -- 10. HISTORIA KRYTYCZNA
    WITH daily AS (
        SELECT day, SUM(total_value) as daily_val FROM tmp_user_drops GROUP BY day
    ),
    cumulative AS (
        SELECT day, SUM(daily_val) OVER (ORDER BY day ASC) as cum_val FROM daily
    )
    SELECT COALESCE(jsonb_agg(jsonb_build_object('date', day, 'cumulative_value', ROUND(cum_val, 2))), '[]'::jsonb)
    INTO v_cumulative_history
    FROM cumulative;

    -- Sprzątanie
    DROP TABLE tmp_user_drops;

    -- SKŁADANIE FINALNEGO JSONA
    RETURN jsonb_build_object(
        'total_value', ROUND(v_total_value, 2),
        'weekly_average', ROUND(v_weekly_average, 2),
        'projected_yearly_income', ROUND(v_projected_yearly, 2),
        'total_drops', v_total_drops,
        'current_streak', v_current_streak,
        'next_milestone', v_next_milestone,
        'best_drop', v_best_drop,
        'active_drops', v_active_drops,
        'monthly_values', v_monthly_values,
        'top_assets', v_top_assets,
        'cumulative_history', v_cumulative_history,
        'weekly_drop_history', v_weekly_history,
        'recent_drops', v_recent_drops
    );
END;
$$;


ALTER FUNCTION public.get_user_drops_analytics() OWNER TO postgres;

--
-- Name: get_user_drops_chart(uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_drops_chart(target_user_id uuid, period_text text DEFAULT 'ALL'::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    first_transaction_date date;
    v_start_date date;
    v_interval interval;
    generation_start_date date;
    v_available_periods text[];
    v_chart_data jsonb;
BEGIN
    -- 1. Znajdź datę pierwszego DROPU
    SELECT MIN(transaction_date)::date INTO first_transaction_date
    FROM transactions
    WHERE user_id = target_user_id AND type = 'DROP';

    -- Jeśli brak dropów, zwróć pusty wynik (zgodny format)
    IF first_transaction_date IS NULL THEN
        RETURN jsonb_build_object('available_periods', ARRAY['7D'], 'data', '[]'::jsonb);
    END IF;

    -- 2. Dostępne okresy
    v_available_periods := ARRAY['7D']; 
    IF first_transaction_date <= (CURRENT_DATE - INTERVAL '1 month') THEN v_available_periods := array_append(v_available_periods, '1M'); END IF;
    IF first_transaction_date <= (CURRENT_DATE - INTERVAL '3 months') THEN v_available_periods := array_append(v_available_periods, '3M'); END IF;
    IF first_transaction_date <= (CURRENT_DATE - INTERVAL '6 months') THEN v_available_periods := array_append(v_available_periods, '6M'); END IF;
    IF first_transaction_date <= (CURRENT_DATE - INTERVAL '1 year') THEN v_available_periods := array_append(v_available_periods, '1Y'); END IF;
    IF first_transaction_date <= (CURRENT_DATE - INTERVAL '5 years') THEN v_available_periods := array_append(v_available_periods, '5Y'); END IF;
    v_available_periods := array_append(v_available_periods, 'ALL');

    -- 3. Konfiguracja wybranego okresu (SMART INTERVAL)
    CASE period_text
        WHEN '7D' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '6 days'); v_interval := '1 day';
        WHEN '1M' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '1 month'); v_interval := '1 day';
        WHEN '3M' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '3 months'); v_interval := '1 week';
        WHEN '6M' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '6 months'); v_interval := '1 week';
        WHEN '1Y' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '1 year'); v_interval := '1 week';
        WHEN '5Y' THEN 
            v_start_date := (CURRENT_DATE - INTERVAL '5 years'); v_interval := '1 month';
        WHEN 'ALL' THEN 
            v_start_date := first_transaction_date;
            -- LOGIKA DYNAMICZNA:
            -- Do 31 dni -> rysuj co 1 dzień
            -- Od 1 do 6 miesięcy -> rysuj co tydzień
            -- Powyżej 6 miesięcy -> rysuj co miesiąc
            IF (CURRENT_DATE - first_transaction_date) <= 31 THEN
                v_interval := '1 day';
            ELSIF (CURRENT_DATE - first_transaction_date) <= 180 THEN
                v_interval := '1 week';
            ELSE
                v_interval := '1 month';
            END IF;
        ELSE 
            v_start_date := (CURRENT_DATE - INTERVAL '1 month'); v_interval := '1 day';
    END CASE;
    generation_start_date := v_start_date;

    -- 4. GŁÓWNA KALKULACJA
    WITH 
    date_series AS (
        SELECT generate_series(generation_start_date, CURRENT_DATE, v_interval)::date as day
    ),
    -- Pobieramy TYLKO transakcje typu DROP
    raw_txns AS (
        SELECT 
            transaction_date, 
            item_id,
            type,
            quantity,
            price
        FROM transactions
        WHERE user_id = target_user_id
          AND type = 'DROP'
    ),
    relevant_prices AS (
        SELECT 
            ph.item_id,
            (make_date(ph.year, 1, 1) + ((elem->>0)::int - 1) * INTERVAL '1 day')::date as price_date,
            (elem->>1)::numeric as price
        FROM price_history ph,
             jsonb_array_elements(ph.history_data) elem
        WHERE ph.item_id IN (SELECT DISTINCT item_id FROM raw_txns)
          AND ph.year >= EXTRACT(YEAR FROM generation_start_date) - 1
    ),
    
    chart_points AS (
        SELECT
            to_char(ds.day, 'YYYY-MM-DD') as chart_date,
            SUM(
                CASE WHEN held > 0 THEN 
                    held * COALESCE(
                        (SELECT price FROM relevant_prices rp WHERE rp.item_id = sub.item_id AND rp.price_date = ds.day),
                        (SELECT price FROM relevant_prices rp WHERE rp.item_id = sub.item_id AND rp.price_date < ds.day ORDER BY price_date DESC LIMIT 1),
                        0
                    )
                ELSE 0 END
            ) as portfolio_value,
            SUM(
                CASE WHEN held > 0 THEN 
                    held * (total_c / NULLIF(total_b, 0))
                ELSE 0 END
            ) as invested_value
        FROM date_series ds
        CROSS JOIN LATERAL (
            SELECT 
                item_id,
                -- Dodajemy skumulowaną ilość wszystkich zdobytych dropów do danego dnia
                SUM(quantity) as held,
                SUM(quantity * price) as total_c,
                SUM(quantity) as total_b
            FROM raw_txns t
            WHERE t.transaction_date::date <= ds.day 
            GROUP BY item_id
        ) sub
        GROUP BY ds.day
        ORDER BY ds.day ASC
    )
    SELECT jsonb_agg(jsonb_build_object(
        'chart_date', chart_date, 
        'portfolio_value', COALESCE(portfolio_value, 0), 
        'invested_value', COALESCE(invested_value, 0)
    )) 
    INTO v_chart_data FROM chart_points;

    RETURN jsonb_build_object('available_periods', v_available_periods, 'data', COALESCE(v_chart_data, '[]'::jsonb));
END;
$$;


ALTER FUNCTION public.get_user_drops_chart(target_user_id uuid, period_text text) OWNER TO postgres;

--
-- Name: get_user_item_transactions(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_item_transactions(p_item_id uuid) RETURNS TABLE(transaction_date timestamp without time zone, transaction_type text, price numeric, quantity integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    created_at as transaction_date,
    type::text as transaction_type,
    price_per_unit as price,
    quantity
  FROM public.transactions
  WHERE item_id = p_item_id
  AND user_id = auth.uid() -- Automatycznie bierze ID zalogowanego usera
  ORDER BY created_at ASC;
END;
$$;


ALTER FUNCTION public.get_user_item_transactions(p_item_id uuid) OWNER TO postgres;

--
-- Name: get_user_luck_score(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_luck_score(period_text text DEFAULT 'ALL'::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_start_date timestamptz;

  v_user_median numeric := 0;
  v_global_median numeric := 0;
  v_drop_count integer := 0;

  v_ratio numeric := 1;
  v_raw numeric := 0;
  v_weight numeric := 0;
  v_score numeric := 50;
  v_label text := 'Average';
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Period window (same convention as other RPCs)
  CASE period_text
    WHEN '7D' THEN v_start_date := NOW() - INTERVAL '7 days';
    WHEN '1M' THEN v_start_date := NOW() - INTERVAL '1 month';
    WHEN '3M' THEN v_start_date := NOW() - INTERVAL '3 months';
    WHEN '6M' THEN v_start_date := NOW() - INTERVAL '6 months';
    WHEN '1Y' THEN v_start_date := NOW() - INTERVAL '1 year';
    WHEN '5Y' THEN v_start_date := NOW() - INTERVAL '5 years';
    ELSE v_start_date := '1970-01-01'::timestamptz;
  END CASE;

  WITH user_drops AS (
    SELECT (t.quantity * COALESCE(i.price, 0))::numeric AS drop_value
    FROM public.transactions t
    JOIN public.cs2_items i ON t.item_id = i.id
    WHERE t.user_id = v_user_id
      AND t.transaction_date >= v_start_date
      AND t.type::text = 'DROP'
      AND t.quantity > 0
  )
  SELECT
    COALESCE((SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY drop_value) FROM user_drops), 0),
    COALESCE((SELECT COUNT(*) FROM user_drops), 0)
  INTO v_user_median, v_drop_count;

  WITH global_drops AS (
    SELECT (t.quantity * COALESCE(i.price, 0))::numeric AS drop_value
    FROM public.transactions t
    JOIN public.cs2_items i ON t.item_id = i.id
    WHERE t.transaction_date >= v_start_date
      AND t.type::text = 'DROP'
      AND t.quantity > 0
  )
  SELECT
    COALESCE(percentile_cont(0.5) WITHIN GROUP (ORDER BY drop_value), 0)
  INTO v_global_median
  FROM global_drops;

  -- Ratio + transform. Add +1 to be safe with zeros.
  v_ratio := (v_user_median + 1) / (v_global_median + 1);
  -- Raw in [-inf, inf], centered at 0 for "average luck"
  v_raw := LN(v_ratio);
  -- Small-sample penalty: quickly ramps up, saturates near 1
  v_weight := 1 - EXP(- (v_drop_count::numeric / 15));
  -- Squash to [-1, 1] using tanh then map to [0, 100]
  v_score := 50 + (50 * TANH(v_raw) * v_weight);
  v_score := GREATEST(0, LEAST(100, v_score));

  IF v_drop_count < 3 THEN
    v_label := 'Too early';
  ELSIF v_score >= 85 THEN
    v_label := 'Blessed';
  ELSIF v_score >= 70 THEN
    v_label := 'Lucky';
  ELSIF v_score >= 55 THEN
    v_label := 'Above average';
  ELSIF v_score >= 45 THEN
    v_label := 'Average';
  ELSIF v_score >= 30 THEN
    v_label := 'Unlucky';
  ELSE
    v_label := 'Cursed';
  END IF;

  RETURN jsonb_build_object(
    'period_text', period_text,
    'luck_score', ROUND(v_score, 1),
    'label', v_label,
    'drops_count', v_drop_count,
    'user_median_drop_value', ROUND(v_user_median, 2),
    'global_median_drop_value', ROUND(v_global_median, 2)
  );
END;
$$;


ALTER FUNCTION public.get_user_luck_score(period_text text) OWNER TO postgres;

--
-- Name: get_user_performance_chart(text, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_performance_chart(period_text text DEFAULT 'ALL'::text, p_only_investments boolean DEFAULT false) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$DECLARE
    v_user_id uuid := auth.uid();
    first_transaction_date date;
    v_start_date date;
    v_interval text;
    generation_start_date date;
    v_available_periods text[];
    v_chart_data jsonb;
    v_history_days integer;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT MIN(transaction_date)::date
    INTO first_transaction_date
    FROM public.transactions
    WHERE user_id = v_user_id
      AND type::text IN ('BUY', 'DROP')
      AND (p_only_investments = false OR is_investment = true);

    IF first_transaction_date IS NULL THEN
        RETURN jsonb_build_object(
            'available_periods', ARRAY['7D', '1M', 'ALL'],
            'data', '[]'::jsonb
        );
    END IF;

    v_history_days := CURRENT_DATE - first_transaction_date;

    v_available_periods := ARRAY['7D', '1M'];
    IF v_history_days >= 90 THEN
        v_available_periods := array_append(v_available_periods, '3M');
    END IF;
    IF v_history_days >= 180 THEN
        v_available_periods := array_append(v_available_periods, '6M');
    END IF;
    IF v_history_days >= 365 THEN
        v_available_periods := array_append(v_available_periods, '1Y');
    END IF;
    IF v_history_days >= 1825 THEN
        v_available_periods := array_append(v_available_periods, '5Y');
    END IF;
    v_available_periods := array_append(v_available_periods, 'ALL');

    CASE period_text
        WHEN '7D' THEN
            v_start_date := (CURRENT_DATE - INTERVAL '6 days');
            v_interval := '1 day';
        WHEN '1M' THEN
            v_start_date := (CURRENT_DATE - INTERVAL '30 days');
            v_interval := '1 day';
        WHEN '3M' THEN
            v_start_date := (CURRENT_DATE - INTERVAL '3 months');
            v_interval := '1 week';
        WHEN '6M' THEN
            v_start_date := (CURRENT_DATE - INTERVAL '6 months');
            v_interval := '1 week';
        WHEN '1Y' THEN
            v_start_date := (CURRENT_DATE - INTERVAL '1 year');
            v_interval := '1 week';
        WHEN '5Y' THEN
            v_start_date := (CURRENT_DATE - INTERVAL '5 years');
            v_interval := '1 month';
        WHEN 'ALL' THEN
            v_start_date := first_transaction_date;
            IF v_history_days <= 31 THEN
                v_interval := '1 day';
            ELSIF v_history_days <= 180 THEN
                v_interval := '1 week';
            ELSE
                v_interval := '1 month';
            END IF;
        ELSE
            v_start_date := first_transaction_date;
            v_interval := '1 day';
    END CASE;

    IF v_start_date < first_transaction_date THEN
        generation_start_date := first_transaction_date;
    ELSE
        generation_start_date := v_start_date;
    END IF;

    WITH filtered_tx AS (
        SELECT
            t.item_id,
            t.transaction_date::date AS tx_date,
            t.type::text AS tx_type,
            t.quantity,
            t.price
        FROM public.transactions t
        WHERE t.user_id = v_user_id
          AND t.transaction_date::date <= CURRENT_DATE
          AND (p_only_investments = false OR t.is_investment = true)
          AND t.type::text IN ('BUY', 'DROP', 'SELL')
    ),
    daily_item_changes AS (
        SELECT
            item_id,
            tx_date,
            SUM(
                CASE
                    WHEN tx_type IN ('BUY', 'DROP') THEN quantity
                    WHEN tx_type = 'SELL' THEN -quantity
                    ELSE 0
                END
            ) AS delta_qty,
            SUM(CASE WHEN tx_type = 'BUY' THEN quantity ELSE 0 END) AS delta_buy_qty,
            SUM(CASE WHEN tx_type = 'BUY' THEN quantity * price ELSE 0 END) AS delta_buy_spend
        FROM filtered_tx
        GROUP BY item_id, tx_date
    ),
    running_state AS (
        SELECT
            item_id,
            tx_date,
            SUM(delta_qty) OVER (
                PARTITION BY item_id
                ORDER BY tx_date ASC
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ) AS qty,
            SUM(delta_buy_qty) OVER (
                PARTITION BY item_id
                ORDER BY tx_date ASC
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ) AS buy_qty,
            SUM(delta_buy_spend) OVER (
                PARTITION BY item_id
                ORDER BY tx_date ASC
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ) AS buy_spend
        FROM daily_item_changes
    ),
    state_intervals AS (
        SELECT
            item_id,
            tx_date AS start_date,
            LEAD(tx_date, 1, CURRENT_DATE + 1) OVER (
                PARTITION BY item_id
                ORDER BY tx_date ASC
            ) AS end_date,
            qty,
            buy_qty,
            buy_spend
        FROM running_state
        WHERE qty > 0
    ),
    chart_dates AS (
        SELECT generate_series(
            generation_start_date,
            CURRENT_DATE,
            v_interval::interval
        )::date AS c_date
        UNION
        SELECT CURRENT_DATE
    ),
    distinct_chart_dates AS (
        SELECT DISTINCT c_date
        FROM chart_dates
    ),
    active_points AS (
        SELECT
            cd.c_date,
            si.item_id,
            si.qty,
            si.buy_qty,
            si.buy_spend
        FROM distinct_chart_dates cd
        JOIN state_intervals si
          ON cd.c_date >= si.start_date
         AND cd.c_date < si.end_date
    ),
    relevant_prices AS (
        SELECT
            ph.item_id,
            (make_date(ph.year, 1, 1) + ((elem->>0)::int - 1) * INTERVAL '1 day')::date AS p_date,
            (elem->>1)::numeric AS price
        FROM public.price_history ph
        CROSS JOIN LATERAL jsonb_array_elements(ph.history_data) elem
        WHERE ph.item_id IN (SELECT DISTINCT item_id FROM active_points)
          AND ph.year >= EXTRACT(YEAR FROM generation_start_date)::int - 1
          AND ph.year <= EXTRACT(YEAR FROM CURRENT_DATE)::int
          AND (elem->>0) ~ '^\d+$'
          AND NULLIF(elem->>1, '') IS NOT NULL
    ),
    daily_last_price AS (
        -- If multiple points exist for same item/day, keep one.
        SELECT DISTINCT ON (rp.item_id, rp.p_date)
            rp.item_id,
            rp.p_date,
            rp.price
        FROM relevant_prices rp
        ORDER BY rp.item_id, rp.p_date, rp.price DESC
    ),
    price_intervals AS (
        -- Build price validity ranges to avoid per-point LATERAL lookups.
        SELECT
            dlp.item_id,
            dlp.p_date AS start_date,
            LEAD(dlp.p_date, 1, CURRENT_DATE + 1) OVER (
                PARTITION BY dlp.item_id
                ORDER BY dlp.p_date ASC
            ) AS end_date,
            dlp.price
        FROM daily_last_price dlp
    ),
    point_values AS (
        SELECT
            ap.c_date,
            ap.qty,
            ap.buy_qty,
            ap.buy_spend,
            CASE
                WHEN ap.c_date = CURRENT_DATE THEN COALESCE(ci.price, 0)
                ELSE COALESCE(pi.price, ci.price, 0)
            END AS final_price
        FROM active_points ap
        LEFT JOIN public.cs2_items ci
               ON ci.id = ap.item_id
        LEFT JOIN price_intervals pi
               ON pi.item_id = ap.item_id
              AND ap.c_date >= pi.start_date
              AND ap.c_date < pi.end_date
    ),
    aggregated_points AS (
        SELECT
            c_date,
            to_char(c_date, 'YYYY-MM-DD') AS chart_date,
            ROUND(SUM(qty * final_price), 2) AS portfolio_value,
            ROUND(SUM(qty * (buy_spend / NULLIF(buy_qty, 0))), 2) AS invested_value
        FROM point_values
        GROUP BY c_date
        ORDER BY c_date ASC
    )
    SELECT jsonb_agg(
        jsonb_build_object(
            'chart_date', chart_date,
            'portfolio_value', COALESCE(portfolio_value, 0),
            'invested_value', COALESCE(invested_value, 0)
        )
        ORDER BY c_date
    )
    INTO v_chart_data
    FROM aggregated_points;

    RETURN jsonb_build_object(
        'available_periods', v_available_periods,
        'data', COALESCE(v_chart_data, '[]'::jsonb)
    );
END;$_$;


ALTER FUNCTION public.get_user_performance_chart(period_text text, p_only_investments boolean) OWNER TO postgres;

--
-- Name: get_user_portfolio_with_metrics(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_portfolio_with_metrics() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_user_id uuid := auth.uid();
    v_result jsonb;
BEGIN
    -- Bezpieczeństwo: sprawdzamy, czy żądanie pochodzi z autoryzowanej sesji
    IF v_user_id IS NULL THEN 
        RAISE EXCEPTION 'Not authenticated'; 
    END IF;

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'item_id', pi.item_id,
            'name', i.market_hash_name,
            -- Daję to samo dla name i hash_name (zgodnie z Twoim formatem), 
            -- możesz usunąć jedno z nich na froncie dla optymalizacji wagi JSON-a
            'hash_name', i.market_hash_name,
            'icon_url', i.icon_url,
            'current_price', ROUND(COALESCE(i.price, 0)::numeric, 2),
            'avg_buy_price', ROUND(COALESCE(pi.buy_price, 0)::numeric, 2),
            'quantity', pi.quantity,
            'total_value', ROUND((pi.quantity * COALESCE(i.price, 0))::numeric, 2),
            
            -- Wyliczamy ROI (Zysk z inwestycji w procentach)
            'roi_percentage', CASE 
                WHEN COALESCE(pi.buy_price, 0) > 0 
                THEN ROUND((((COALESCE(i.price, 0) - pi.buy_price) / pi.buy_price) * 100)::numeric, 2)
                ELSE 0 
            END,
            
            'collection_id', pi.collection_id,
            
            -- Kategoria: jeśli masz kolumnę 'category' w cs2_items, podmień i.rarity na i.category
            'category', COALESCE(i.rarity, 'Unknown'), 
            
            -- Jeśli gracz ma chociaż 1 sztukę inwestycyjną, oznaczamy to flagą
            'is_investment', (pi.investment_quantity > 0),
            
            'latest_transaction_type', latest_tx.type
        )
        -- Sortujemy od najdroższych do najtańszych (Total Value) dla ładnego widoku w apce
        ORDER BY (pi.quantity * COALESCE(i.price, 0)) DESC
    ), '[]'::jsonb)
    INTO v_result
    FROM public.portfolio_items pi
    JOIN public.cs2_items i ON pi.item_id = i.id
    -- Pobieramy typ OSTATNIEJ transakcji dla tego konkretnego przedmiotu w tej kolekcji
    LEFT JOIN LATERAL (
        SELECT type 
        FROM public.transactions t 
        WHERE t.user_id = v_user_id 
          AND t.item_id = pi.item_id 
          AND t.collection_id IS NOT DISTINCT FROM pi.collection_id
        ORDER BY transaction_date DESC 
        LIMIT 1
    ) latest_tx ON true
    WHERE pi.user_id = v_user_id 
      AND pi.quantity > 0;

    RETURN v_result;
END;
$$;


ALTER FUNCTION public.get_user_portfolio_with_metrics() OWNER TO postgres;

--
-- Name: get_user_profile(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_profile(p_user_id uuid) RETURNS TABLE(nickname text, email text, avatar text, steam_profile_url text, year_joined text, plan_subscription public.user_plan, notify_accept boolean)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.nickname,
    p.email,
    p.avatar,
    p.steam_profile_url,
    TO_CHAR(p.created_at, 'YYYY') as year_joined, -- Ekstrakcja tylko roku
    p.plan_subscription,
    p.notify_accept
  FROM public.profiles p
  WHERE p.id = p_user_id;
END;
$$;


ALTER FUNCTION public.get_user_profile(p_user_id uuid) OWNER TO postgres;

--
-- Name: get_user_transaction_stats(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_transaction_stats(p_user_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_total_invested numeric := 0;
    v_total_transactions integer := 0;
    v_total_earned numeric := 0;
    v_total_profit numeric := 0;
BEGIN
    SELECT 
        -- 1. Total Transactions (Łączna liczba operacji)
        COUNT(*),
        
        -- 2. Total Invested (Suma wydana na zakupy)
        COALESCE(SUM(CASE WHEN type = 'BUY' THEN quantity * price ELSE 0 END), 0),
        
        -- 3. Total Earned (Suma przychodów ze sprzedaży po odliczeniu prowizji)
        COALESCE(SUM(CASE WHEN type = 'SELL' THEN (quantity * price) - COALESCE(fee_deducted, 0) ELSE 0 END), 0),

        -- 4. Total Realized Profit (Suma czystego zysku z zamkniętych transakcji)
        COALESCE(SUM(COALESCE(realized_profit, 0)), 0)
    INTO 
        v_total_transactions,
        v_total_invested,
        v_total_earned,
        v_total_profit
    FROM 
        public.transactions
    WHERE 
        user_id = p_user_id;

    -- Zwracamy ładnie sformatowany obiekt JSON
    RETURN jsonb_build_object(
        'total_invested', ROUND(v_total_invested, 2),
        'total_transactions', v_total_transactions,
        'total_earned', ROUND(v_total_earned, 2),
        'total_realized_profit', ROUND(v_total_profit, 2)
    );
END;
$$;


ALTER FUNCTION public.get_user_transaction_stats(p_user_id uuid) OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$BEGIN
  INSERT INTO public.profiles (id, nickname, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.collections (user_id, name)
  VALUES (NEW.id, 'Main Vault');

  RETURN NEW;

END;$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: handle_price_history_yearly(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_price_history_yearly() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$DECLARE
    curr_year int := extract(year from NOW());
    curr_doy int := extract(doy from NOW());
    new_data_point jsonb;
BEGIN
    -- Budujemy tablicę [dzień, cena, wolumen]
    new_data_point := jsonb_build_array(
        curr_doy,
        NEW.price,
        NEW.volume_24h
    );

    INSERT INTO public.price_history (item_id, year, history_data)
    VALUES (NEW.id, curr_year, jsonb_build_array(new_data_point))
    ON CONFLICT (item_id, year) DO UPDATE
    SET history_data = 
        CASE
            -- Używamy rzutowania z zabezpieczeniem, aby uniknąć 22P02
            WHEN (price_history.history_data->-1->>0) ~ '^[0-9]+$' AND (price_history.history_data->-1->>0)::int = curr_doy THEN
                jsonb_set(
                    price_history.history_data, 
                    '{-1}', 
                    new_data_point
                )
            ELSE
                price_history.history_data || jsonb_build_array(new_data_point)
        END;

    RETURN NEW;
END;$_$;


ALTER FUNCTION public.handle_price_history_yearly() OWNER TO postgres;

--
-- Name: import_transactions_bulk(uuid, jsonb[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.import_transactions_bulk(p_user_id uuid, p_transactions jsonb[]) RETURNS void
    LANGUAGE plpgsql
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
BEGIN
    FOREACH txn IN ARRAY p_transactions
    LOOP
        v_item_id := (txn->>'item_id')::UUID;
        v_qty := (txn->>'quantity')::INT;
        v_price := (txn->>'price')::NUMERIC;
        v_type := (txn->>'type')::public.transaction_type;
        v_is_investment := COALESCE((txn->>'is_investment')::BOOLEAN, FALSE);
        v_date := (txn->>'transaction_date')::TIMESTAMP;
        v_collection_id := NULLIF(txn->>'collection_id', '')::UUID;

        -- 1. Zawsze dodaj do historii
        INSERT INTO transactions (
            user_id, item_id, type, quantity, price, 
            transaction_date, is_investment, collection_id, created_at
        ) VALUES (
            p_user_id, v_item_id, v_type, v_qty, v_price, 
            v_date, v_is_investment, v_collection_id, NOW()
        );

        -- 2. Aktualizuj portfolio (Tylko dla inwestycji BUY/DROP)
        IF v_type IN ('BUY', 'DROP') AND v_is_investment = TRUE THEN
            INSERT INTO portfolio_items (
                user_id, item_id, collection_id, quantity, 
                investment_quantity, buy_price, updated_at, acquired_at
            ) VALUES (
                p_user_id, v_item_id, v_collection_id, v_qty, 
                v_qty, v_price, NOW(), v_date
            )
            ON CONFLICT (user_id, item_id, collection_id) 
            DO UPDATE SET
                buy_price = CASE 
                    WHEN (portfolio_items.quantity + EXCLUDED.quantity) <= 0 THEN EXCLUDED.buy_price
                    ELSE ((portfolio_items.quantity * portfolio_items.buy_price) + (EXCLUDED.quantity * EXCLUDED.buy_price)) / (portfolio_items.quantity + EXCLUDED.quantity)
                END,
                quantity = portfolio_items.quantity + EXCLUDED.quantity,
                investment_quantity = portfolio_items.investment_quantity + EXCLUDED.investment_quantity,
                updated_at = NOW();
        END IF;
    END LOOP;
END;
$$;


ALTER FUNCTION public.import_transactions_bulk(p_user_id uuid, p_transactions jsonb[]) OWNER TO postgres;

--
-- Name: link_steam_account(bigint, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.link_steam_account(p_steam_id_64 bigint, p_steam_username text, p_steam_avatar_url text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_plan text;
  v_current_count integer;
  v_max_allowed integer;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT plan_subscription INTO v_plan FROM profiles WHERE id = v_user_id;
  SELECT count(*) INTO v_current_count FROM steam_connections WHERE user_id = v_user_id;

  IF v_plan = 'pro_max' THEN
    v_max_allowed := 15;
  ELSIF v_plan = 'pro' THEN
    v_max_allowed := 3;
  ELSE
    v_max_allowed := 1;
  END IF;

  -- Jeśli dany user ma już to konto, zaktualizuj jego awatar i nick (ważne: AND user_id = v_user_id)
  IF EXISTS (SELECT 1 FROM steam_connections WHERE steam_id_64 = p_steam_id_64 AND user_id = v_user_id) THEN
    UPDATE steam_connections 
    SET steam_username = p_steam_username, steam_avatar_url = p_steam_avatar_url
    WHERE steam_id_64 = p_steam_id_64 AND user_id = v_user_id;
    RETURN;
  END IF;

  IF v_current_count >= v_max_allowed THEN
    RAISE EXCEPTION 'Steam accounts limit reached for current plan';
  END IF;

  INSERT INTO steam_connections (user_id, steam_id_64, steam_username, steam_avatar_url, inventory_status)
  VALUES (v_user_id, p_steam_id_64, p_steam_username, p_steam_avatar_url, 'ACTIVE');

END;
$$;


ALTER FUNCTION public.link_steam_account(p_steam_id_64 bigint, p_steam_username text, p_steam_avatar_url text) OWNER TO postgres;

--
-- Name: move_transaction_batch(uuid, uuid, integer, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.move_transaction_batch(p_transaction_id uuid, p_target_collection_id uuid, p_quantity_to_move integer, p_user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_tx record;
    v_source_col_id uuid;
    v_is_investment int;
    v_new_avg_price numeric;
    v_target_item record;
BEGIN
    -- 1. Pobierz transakcję źródłową
    SELECT * INTO v_tx 
    FROM public.transactions 
    WHERE id = p_transaction_id AND user_id = p_user_id;

    -- POPRAWKA: Używamy FOUND zamiast sprawdzania NULL na rekordzie
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Transaction not found or access denied';
    END IF;

    IF v_tx.quantity < p_quantity_to_move THEN
        RAISE EXCEPTION 'Not enough quantity in this batch to move';
    END IF;

    v_source_col_id := v_tx.collection_id;
    v_is_investment := CASE WHEN v_tx.is_investment THEN 1 ELSE 0 END;

    -- =================================================================
    -- A. AKTUALIZACJA TABELI TRANSAKCJI
    -- =================================================================
    
    IF v_tx.quantity = p_quantity_to_move THEN
        -- Przenosimy CAŁY batch
        UPDATE public.transactions
        SET collection_id = p_target_collection_id
        WHERE id = p_transaction_id;
    ELSE
        -- Przenosimy CZĘŚĆ (Split)
        UPDATE public.transactions
        SET quantity = quantity - p_quantity_to_move
        WHERE id = p_transaction_id;

        INSERT INTO public.transactions (
            user_id, item_id, collection_id, type, quantity, price, 
            fee_deducted, transaction_date, is_investment, source_transaction_id
        ) VALUES (
            v_tx.user_id, v_tx.item_id, p_target_collection_id, v_tx.type, 
            p_quantity_to_move, v_tx.price, v_tx.fee_deducted, v_tx.transaction_date, 
            v_tx.is_investment, v_tx.source_transaction_id
        );
    END IF;

    -- =================================================================
    -- B. AKTUALIZACJA PORTFOLIO_ITEMS (ŹRÓDŁO)
    -- =================================================================

    UPDATE public.portfolio_items
    SET quantity = quantity - p_quantity_to_move,
        investment_quantity = investment_quantity - (p_quantity_to_move * v_is_investment),
        updated_at = NOW()
    WHERE item_id = v_tx.item_id 
      AND collection_id = v_source_col_id;

    DELETE FROM public.portfolio_items
    WHERE item_id = v_tx.item_id 
      AND collection_id = v_source_col_id
      AND quantity <= 0;

    -- =================================================================
    -- C. AKTUALIZACJA PORTFOLIO_ITEMS (CEL)
    -- =================================================================

    SELECT * INTO v_target_item
    FROM public.portfolio_items
    WHERE item_id = v_tx.item_id 
      AND collection_id = p_target_collection_id;

    -- POPRAWKA: Tutaj był błąd. Teraz jest poprawnie:
    IF FOUND THEN
        -- Merge (Przedmiot istnieje)
        v_new_avg_price := (
            (v_target_item.quantity * v_target_item.buy_price) + 
            (p_quantity_to_move * v_tx.price)
        ) / (v_target_item.quantity + p_quantity_to_move);

        UPDATE public.portfolio_items
        SET quantity = quantity + p_quantity_to_move,
            investment_quantity = investment_quantity + (p_quantity_to_move * v_is_investment),
            buy_price = v_new_avg_price,
            updated_at = NOW()
        WHERE id = v_target_item.id;
    ELSE
        -- Insert (Przedmiot nie istnieje)
        INSERT INTO public.portfolio_items (
            user_id, item_id, collection_id, quantity, investment_quantity, buy_price, updated_at
        ) VALUES (
            p_user_id, 
            v_tx.item_id, 
            p_target_collection_id, 
            p_quantity_to_move, 
            (p_quantity_to_move * v_is_investment), 
            v_tx.price, 
            NOW()
        );
    END IF;

END;
$$;


ALTER FUNCTION public.move_transaction_batch(p_transaction_id uuid, p_target_collection_id uuid, p_quantity_to_move integer, p_user_id uuid) OWNER TO postgres;

--
-- Name: notify_all_users_about_weekly_drop(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.notify_all_users_about_weekly_drop() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- 1. "Refresh" the notification for existing players
    UPDATE public.notifications
    SET is_read = false, 
        created_at = now()
    WHERE title = '🎁 Weekly CS2 Drop!';

    -- 2. Create the notification ONLY for players who don't have it yet
    INSERT INTO public.notifications (user_id, type, title, message)
    SELECT p.id, 'SYSTEM', '🎁 Weekly CS2 Drop!', 'The drop pool has been reset. Play a match, earn XP, and claim your free items!'
    FROM public.profiles p
    WHERE NOT EXISTS (
        SELECT 1 FROM public.notifications n 
        WHERE n.user_id = p.id AND n.title = '🎁 Weekly CS2 Drop!'
    );
END;
$$;


ALTER FUNCTION public.notify_all_users_about_weekly_drop() OWNER TO postgres;

--
-- Name: regenerate_portfolio_share_token(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.regenerate_portfolio_share_token() RETURNS public.portfolio_shares
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


ALTER FUNCTION public.regenerate_portfolio_share_token() OWNER TO postgres;

--
-- Name: search_cs2_items(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.search_cs2_items(search_query text) RETURNS TABLE(id uuid, name text, photo text, price numeric, category text, rarity text)
    LANGUAGE plpgsql
    AS $$
begin
  return query
  select
    i.id,
    i.market_hash_name as name,  -- POPRAWKA: Bierzemy market_hash_name i nazywamy go name
    i.icon_url as photo,
    coalesce(i.price, 0) as price,
    i.type as category,
    i.rarity
  from
    public.cs2_items i
  where
    -- POPRAWKA: Szukamy tylko w market_hash_name (bo kolumna "name" nie istnieje)
    i.market_hash_name ilike '%' || search_query || '%'
  limit 20;
end;
$$;


ALTER FUNCTION public.search_cs2_items(search_query text) OWNER TO postgres;

--
-- Name: search_drop_items(text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.search_drop_items(p_search_query text, p_limit integer DEFAULT 20) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_result jsonb;
BEGIN
    -- Zabezpieczenie: jeśli wpisano mniej niż 2 znaki, zwracamy pustą tablicę 
    -- (oszczędza to zasoby bazy i zapobiega ładowaniu tysięcy itemów przy jednej literce)
    IF p_search_query IS NULL OR length(trim(p_search_query)) < 2 THEN
        RETURN '[]'::jsonb;
    END IF;

    -- Budujemy leciutki obiekt JSON tylko z wymaganymi danymi
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', sub.id,
            'market_hash_name', sub.market_hash_name,
            'icon_url', sub.icon_url,
            'price', sub.price,
            'type', sub.type,
            'rarity', sub.rarity,
            'exterior', sub.exterior
        )
    ), '[]'::jsonb)
    INTO v_result
    FROM (
        SELECT 
            id, 
            market_hash_name, 
            icon_url, 
            ROUND(COALESCE(price, 0), 2) as price,
            type,
            rarity,
            exterior
        FROM public.cs2_items
        -- Korzystamy z indeksu GIN pg_trgm, który stworzyliśmy w fazie optymalizacji!
        WHERE market_hash_name ILIKE '%' || trim(p_search_query) || '%'
        -- Sortowanie: najpierw te najczęściej sprzedawane, potem alfabetycznie
        ORDER BY volume_24h DESC NULLS LAST, market_hash_name ASC
        LIMIT p_limit
    ) sub;

    RETURN v_result;
END;
$$;


ALTER FUNCTION public.search_drop_items(p_search_query text, p_limit integer) OWNER TO postgres;

--
-- Name: sell_transactions_bulk(uuid, jsonb[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sell_transactions_bulk(p_user_id uuid, p_transactions jsonb[]) RETURNS void
    LANGUAGE plpgsql
    AS $$
declare
    txn jsonb;
    v_item_id uuid;
    v_qty integer;
    v_price numeric;
    v_type public.transaction_type;
    v_is_investment boolean;
    v_date timestamptz;
    v_collection_id uuid;
    v_fee numeric;
    v_realized_profit numeric;
    v_source_transaction_id uuid;
    v_portfolio_id uuid;
    v_current_quantity integer;
    v_current_investment_quantity integer;
begin
    foreach txn in array p_transactions
    loop
        v_item_id := (txn->>'item_id')::uuid;
        v_qty := (txn->>'quantity')::integer;
        v_price := (txn->>'price')::numeric;
        v_type := (txn->>'type')::public.transaction_type;
        v_is_investment := coalesce((txn->>'is_investment')::boolean, false);
        v_date := coalesce((txn->>'transaction_date')::timestamptz, now());
        v_collection_id := nullif(txn->>'collection_id', '')::uuid;
        v_fee := coalesce((txn->>'fee_deducted')::numeric, 0);
        v_realized_profit := coalesce((txn->>'realized_profit')::numeric, 0);
        v_source_transaction_id := nullif(txn->>'source_transaction_id', '')::uuid;

        if v_type <> 'SELL' then
            raise exception 'sell_transactions_bulk accepts only SELL transactions, got %', v_type;
        end if;

        if v_qty is null or v_qty <= 0 then
            raise exception 'Invalid sell quantity for item %: %', v_item_id, v_qty;
        end if;

        select
            p.id,
            p.quantity,
            coalesce(p.investment_quantity, 0)
        into v_portfolio_id, v_current_quantity, v_current_investment_quantity
        from public.portfolio_items p
        where p.user_id = p_user_id
          and p.item_id = v_item_id
          and p.collection_id is not distinct from v_collection_id
        for update;

        if not found then
            raise exception
                'Missing portfolio row for item % in collection %',
                v_item_id,
                coalesce(v_collection_id::text, 'null');
        end if;

        if v_current_quantity < v_qty then
            raise exception
                'Insufficient quantity for item % in collection %: trying to sell %, available %',
                v_item_id,
                coalesce(v_collection_id::text, 'null'),
                v_qty,
                v_current_quantity;
        end if;

        if v_is_investment and v_current_investment_quantity < v_qty then
            raise exception
                'Insufficient investment quantity for item % in collection %: trying to sell %, available %',
                v_item_id,
                coalesce(v_collection_id::text, 'null'),
                v_qty,
                v_current_investment_quantity;
        end if;

        insert into public.transactions (
            user_id,
            item_id,
            type,
            quantity,
            price,
            fee_deducted,
            transaction_date,
            is_investment,
            realized_profit,
            source_transaction_id,
            collection_id,
            created_at
        ) values (
            p_user_id,
            v_item_id,
            v_type,
            v_qty,
            v_price,
            v_fee,
            v_date,
            v_is_investment,
            v_realized_profit,
            v_source_transaction_id,
            v_collection_id,
            now()
        );

        if v_current_quantity = v_qty then
            delete from public.portfolio_items
            where id = v_portfolio_id;
        else
            update public.portfolio_items
            set
                quantity = v_current_quantity - v_qty,
                investment_quantity = case
                    when v_is_investment then v_current_investment_quantity - v_qty
                    else v_current_investment_quantity
                end,
                updated_at = now()
            where id = v_portfolio_id;
        end if;
    end loop;
end;
$$;


ALTER FUNCTION public.sell_transactions_bulk(p_user_id uuid, p_transactions jsonb[]) OWNER TO postgres;

--
-- Name: set_blog_posts_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_blog_posts_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_blog_posts_updated_at() OWNER TO postgres;

--
-- Name: set_main_steam_account(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_main_steam_account(p_steam_id_64 bigint) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_provider text;
BEGIN
  -- ZMIANA: Szukamy 'provider' w raw_USER_meta_data
  SELECT raw_user_meta_data->>'provider' INTO v_provider FROM auth.users WHERE id = v_user_id;

  IF v_provider = 'steam' THEN
    RAISE EXCEPTION 'Steam login users cannot change their main account.';
  END IF;

  UPDATE steam_connections SET is_main = false WHERE user_id = v_user_id;
  UPDATE steam_connections SET is_main = true WHERE user_id = v_user_id AND steam_id_64 = p_steam_id_64;
END;
$$;


ALTER FUNCTION public.set_main_steam_account(p_steam_id_64 bigint) OWNER TO postgres;

--
-- Name: set_portfolio_shares_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_portfolio_shares_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_portfolio_shares_updated_at() OWNER TO postgres;

--
-- Name: take_daily_portfolio_snapshots(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.take_daily_portfolio_snapshots() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.portfolio_snapshots (user_id, total_value, recorded_at)
    SELECT 
        pi.user_id,
        COALESCE(SUM(pi.quantity * i.price), 0) AS total_value,
        now()
    FROM public.portfolio_items pi
    JOIN public.cs2_items i ON pi.item_id = i.id
    WHERE pi.quantity > 0
    GROUP BY pi.user_id;
END;
$$;


ALTER FUNCTION public.take_daily_portfolio_snapshots() OWNER TO postgres;

--
-- Name: unlink_steam_account(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.unlink_steam_account(p_steam_id_64 bigint) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_provider text;
  v_is_main boolean;
BEGIN
  SELECT is_main INTO v_is_main FROM steam_connections WHERE user_id = v_user_id AND steam_id_64 = p_steam_id_64;
  -- ZMIANA: Szukamy 'provider' w raw_USER_meta_data
  SELECT raw_user_meta_data->>'provider' INTO v_provider FROM auth.users WHERE id = v_user_id;

  IF v_is_main = true AND v_provider = 'steam' THEN
    RAISE EXCEPTION 'Cannot unlink the primary Steam account used for login.';
  END IF;

  DELETE FROM steam_connections WHERE user_id = v_user_id AND steam_id_64 = p_steam_id_64;
END;
$$;


ALTER FUNCTION public.unlink_steam_account(p_steam_id_64 bigint) OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    steam_profile_url text,
    nickname text,
    email text,
    avatar text,
    notify_accept boolean DEFAULT false,
    plan_subscription public.user_plan DEFAULT 'free'::public.user_plan
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: update_own_profile(text, text, text, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_own_profile(p_nickname text DEFAULT NULL::text, p_steam_profile_url text DEFAULT NULL::text, p_avatar text DEFAULT NULL::text, p_notify_accept boolean DEFAULT NULL::boolean) RETURNS public.profiles
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  updated_row public.profiles;
BEGIN
  -- Aktualizujemy tylko te pola, które nie są NULL (COALESCE).
  -- Jeśli parametr jest NULL, zachowujemy starą wartość z bazy.
  UPDATE public.profiles
  SET
    nickname = COALESCE(p_nickname, nickname),
    steam_profile_url = COALESCE(p_steam_profile_url, steam_profile_url),
    avatar = COALESCE(p_avatar, avatar),
    notify_accept = COALESCE(p_notify_accept, notify_accept)
  WHERE id = auth.uid() -- KLUCZOWE: Aktualizuje tylko profil zalogowanego użytkownika
  RETURNING * INTO updated_row;

  RETURN updated_row;
END;
$$;


ALTER FUNCTION public.update_own_profile(p_nickname text, p_steam_profile_url text, p_avatar text, p_notify_accept boolean) OWNER TO postgres;

--
-- Name: update_portfolio_share_visibility(boolean, boolean, boolean, boolean, boolean, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_portfolio_share_visibility(p_show_summary boolean DEFAULT NULL::boolean, p_show_chart boolean DEFAULT NULL::boolean, p_show_categories boolean DEFAULT NULL::boolean, p_show_items boolean DEFAULT NULL::boolean, p_show_history boolean DEFAULT NULL::boolean, p_show_collections boolean DEFAULT NULL::boolean) RETURNS public.portfolio_shares
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


ALTER FUNCTION public.update_portfolio_share_visibility(p_show_summary boolean, p_show_chart boolean, p_show_categories boolean, p_show_items boolean, p_show_history boolean, p_show_collections boolean) OWNER TO postgres;

--
-- Name: wishlist_add_item(uuid, numeric, public.wishlist_priority, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.wishlist_add_item(p_item_id uuid, p_target_buy_price numeric DEFAULT NULL::numeric, p_priority public.wishlist_priority DEFAULT 'medium'::public.wishlist_priority, p_note text DEFAULT NULL::text) RETURNS TABLE(wishlist_item_id uuid, wishlist_id uuid, item_id uuid, status public.wishlist_item_status)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  v_wishlist_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if p_item_id is null then
    raise exception 'p_item_id is required';
  end if;

  v_wishlist_id := public.wishlist_get_or_create_default();

  -- 1) try update existing row
  update public.wishlist_items wi
  set
    target_buy_price = coalesce(p_target_buy_price, wi.target_buy_price),
    priority = coalesce(p_priority, wi.priority),
    note = coalesce(p_note, wi.note),
    status = 'active',
    updated_at = now()
  where wi.wishlist_id = v_wishlist_id
    and wi.item_id = p_item_id;

  -- 2) if no existing row, insert new
  if not found then
    insert into public.wishlist_items (
      wishlist_id,
      item_id,
      target_buy_price,
      priority,
      note,
      status
    )
    values (
      v_wishlist_id,
      p_item_id,
      p_target_buy_price,
      coalesce(p_priority, 'medium'),
      p_note,
      'active'
    );
  end if;

  return query
  select
    wi.id as wishlist_item_id,
    wi.wishlist_id,
    wi.item_id,
    wi.status
  from public.wishlist_items wi
  where wi.wishlist_id = v_wishlist_id
    and wi.item_id = p_item_id
  limit 1;
end;
$$;


ALTER FUNCTION public.wishlist_add_item(p_item_id uuid, p_target_buy_price numeric, p_priority public.wishlist_priority, p_note text) OWNER TO postgres;

--
-- Name: wishlist_get_or_create_default(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.wishlist_get_or_create_default() RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  v_user_id uuid;
  v_wishlist_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select id into v_wishlist_id
  from public.wishlists
  where user_id = v_user_id
    and is_default = true
  limit 1;

  if v_wishlist_id is null then
    insert into public.wishlists (user_id, name, is_default)
    values (v_user_id, 'My Wishlist', true)
    returning id into v_wishlist_id;
  end if;

  return v_wishlist_id;
end;
$$;


ALTER FUNCTION public.wishlist_get_or_create_default() OWNER TO postgres;

--
-- Name: wishlist_list_items(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.wishlist_list_items() RETURNS TABLE(wishlist_item_id uuid, item_id uuid, market_hash_name text, icon_url text, rarity text, exterior text, current_price numeric, skinport_price numeric, target_buy_price numeric, priority public.wishlist_priority, status public.wishlist_item_status, note text, created_at timestamp with time zone)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  with my_default as (
    select id
    from public.wishlists
    where user_id = auth.uid()
      and is_default = true
    limit 1
  )
  select
    wi.id as wishlist_item_id,
    wi.item_id,
    ci.market_hash_name,
    ci.icon_url,
    ci.rarity,
    ci.exterior,
    ci.price as current_price,
    ci.skinport_price,
    wi.target_buy_price,
    wi.priority,
    wi.status,
    wi.note,
    wi.created_at
  from public.wishlist_items wi
  join my_default d on d.id = wi.wishlist_id
  join public.cs2_items ci on ci.id = wi.item_id
  order by
    case wi.priority when 'high' then 1 when 'medium' then 2 else 3 end,
    wi.created_at desc;
$$;


ALTER FUNCTION public.wishlist_list_items() OWNER TO postgres;

--
-- Name: wishlist_remove_item(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.wishlist_remove_item(p_item_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  v_user_id uuid;
  v_wishlist_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select id into v_wishlist_id
  from public.wishlists
  where user_id = v_user_id
    and is_default = true
  limit 1;

  if v_wishlist_id is null then
    return false;
  end if;

  delete from public.wishlist_items
  where wishlist_id = v_wishlist_id
    and item_id = p_item_id;

  return found;
end;
$$;


ALTER FUNCTION public.wishlist_remove_item(p_item_id uuid) OWNER TO postgres;

--
-- Name: wishlist_summary(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.wishlist_summary() RETURNS TABLE(items_count bigint, est_cost_now numeric, est_cost_target numeric)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  with my_default as (
    select id
    from public.wishlists
    where user_id = auth.uid()
      and is_default = true
    limit 1
  )
  select
    count(*)::bigint as items_count,
    coalesce(sum(ci.price), 0)::numeric as est_cost_now,
    coalesce(sum(coalesce(wi.target_buy_price, ci.price)), 0)::numeric as est_cost_target
  from public.wishlist_items wi
  join my_default d on d.id = wi.wishlist_id
  join public.cs2_items ci on ci.id = wi.item_id
  where wi.status = 'active';
$$;


ALTER FUNCTION public.wishlist_summary() OWNER TO postgres;

--
-- Name: wishlist_touch_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.wishlist_touch_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION public.wishlist_touch_updated_at() OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
    -- Regclass of the table e.g. public.notes
    entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

    -- I, U, D, T: insert, update ...
    action realtime.action = (
        case wal ->> 'action'
            when 'I' then 'INSERT'
            when 'U' then 'UPDATE'
            when 'D' then 'DELETE'
            else 'ERROR'
        end
    );

    -- Is row level security enabled for the table
    is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

    subscriptions realtime.subscription[] = array_agg(subs)
        from
            realtime.subscription subs
        where
            subs.entity = entity_
            -- Filter by action early - only get subscriptions interested in this action
            -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
            and (subs.action_filter = '*' or subs.action_filter = action::text);

    -- Subscription vars
    working_role regrole;
    working_selected_columns text[];
    claimed_role regrole;
    claims jsonb;

    subscription_id uuid;
    subscription_has_access bool;
    visible_to_subscription_ids uuid[] = '{}';

    -- structured info for wal's columns
    columns realtime.wal_column[];
    -- previous identity values for update/delete
    old_columns realtime.wal_column[];

    error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

    -- Primary jsonb output for record
    output jsonb;

    -- Loop record for iterating unique roles (outer loop)
    role_record record;
    -- Loop record for iterating unique selected_columns within a role (inner loop)
    cols_record record;
    -- Subscription ids visible at the role level (before fanning out by selected_columns)
    visible_role_sub_ids uuid[] = '{}';

begin
    perform set_config('role', null, true);

    columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'columns') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    old_columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'identity') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    for role_record in
        select claims_role
        from (select distinct claims_role from unnest(subscriptions)) t
        order by claims_role::text
    loop
        working_role := role_record.claims_role;

        -- Update `is_selectable` for columns and old_columns (once per role)
        columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(columns) c;

        old_columns =
                array_agg(
                    (
                        c.name,
                        c.type_name,
                        c.type_oid,
                        c.value,
                        c.is_pkey,
                        pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                    )::realtime.wal_column
                )
                from
                    unnest(old_columns) c;

        if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
            -- Fan out 400 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 400: Bad Request, no primary key']
                )::realtime.wal_rls;
            end loop;

        -- The claims role does not have SELECT permission to the primary key of entity
        elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
            -- Fan out 401 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 401: Unauthorized']
                )::realtime.wal_rls;
            end loop;

        else
            -- Create the prepared statement (once per role)
            if is_rls_enabled and action <> 'DELETE' then
                if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                    deallocate walrus_rls_stmt;
                end if;
                execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
            end if;

            -- Collect all visible subscription IDs for this role (filter check + RLS check)
            visible_role_sub_ids = '{}';

            for subscription_id, claims in (
                    select
                        subs.subscription_id,
                        subs.claims
                    from
                        unnest(subscriptions) subs
                    where
                        subs.entity = entity_
                        and subs.claims_role = working_role
                        and (
                            realtime.is_visible_through_filters(columns, subs.filters)
                            or (
                              action = 'DELETE'
                              and realtime.is_visible_through_filters(old_columns, subs.filters)
                            )
                        )
            ) loop

                if not is_rls_enabled or action = 'DELETE' then
                    visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                else
                    -- Check if RLS allows the role to see the record
                    perform
                        -- Trim leading and trailing quotes from working_role because set_config
                        -- doesn't recognize the role as valid if they are included
                        set_config('role', trim(both '"' from working_role::text), true),
                        set_config('request.jwt.claims', claims::text, true);

                    execute 'execute walrus_rls_stmt' into subscription_has_access;

                    -- Reset the role on every FOR..LOOP batch execution.
                    -- The first batch of 10 rows is pre-fetched using the current connection role (PG internal behaviour)
                    -- then we have to reset it again otherwise it would use the role defined in the `set_config` above
                    -- to fetch the remaining rows when rows>10, which could be a user-defined role that lacks execution grants.
                    -- The flow is:
                    --   1. run batch with conn role
                    --   2. set_config working_role
                    --   3. execute walrus
                    --   4. reset role (revert)
                    --   5. repeat
                    perform set_config('role', null, true);

                    if subscription_has_access then
                        visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                    end if;
                end if;
            end loop;

            perform set_config('role', null, true);

            -- Inner loop: per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;

                output = jsonb_build_object(
                    'schema', wal ->> 'schema',
                    'table', wal ->> 'table',
                    'type', action,
                    'commit_timestamp', to_char(
                        ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                        'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
                    ),
                    'columns', (
                        select
                            jsonb_agg(
                                jsonb_build_object(
                                    'name', pa.attname,
                                    'type', pt.typname
                                )
                                order by pa.attnum asc
                            )
                        from
                            pg_attribute pa
                            join pg_type pt
                                on pa.atttypid = pt.oid
                            left join (
                                select unnest(conkey) as pkey_attnum
                                from pg_constraint
                                where conrelid = entity_ and contype = 'p'
                            ) pk on pk.pkey_attnum = pa.attnum
                        where
                            attrelid = entity_
                            and attnum > 0
                            and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
                            and (working_selected_columns is null or pa.attname = any(working_selected_columns) or pk.pkey_attnum is not null)
                    )
                )
                -- Add "record" key for insert and update
                || case
                    when action in ('INSERT', 'UPDATE') then
                        jsonb_build_object(
                            'record',
                            (
                                select
                                    jsonb_object_agg(
                                        -- if unchanged toast, get column name and value from old record
                                        coalesce((c).name, (oc).name),
                                        case
                                            when (c).name is null then (oc).value
                                            else (c).value
                                        end
                                    )
                                from
                                    unnest(columns) c
                                    full outer join unnest(old_columns) oc
                                        on (c).name = (oc).name
                                where
                                    coalesce((c).is_selectable, (oc).is_selectable)
                                    and (working_selected_columns is null or coalesce((c).name, (oc).name) = any(working_selected_columns) or coalesce((c).is_pkey, (oc).is_pkey))
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            )
                        )
                    else '{}'::jsonb
                end
                -- Add "old_record" key for update and delete
                || case
                    when action = 'UPDATE' then
                        jsonb_build_object(
                                'old_record',
                                (
                                    select jsonb_object_agg((c).name, (c).value)
                                    from unnest(old_columns) c
                                    where
                                        (c).is_selectable
                                        and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                        and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                )
                            )
                    when action = 'DELETE' then
                        jsonb_build_object(
                            'old_record',
                            (
                                select jsonb_object_agg((c).name, (c).value)
                                from unnest(old_columns) c
                                where
                                    (c).is_selectable
                                    and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                    and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                            )
                        )
                    else '{}'::jsonb
                end;

                -- Filter visible_role_sub_ids to those matching the current selected_columns group
                visible_to_subscription_ids = coalesce(
                    (
                        select array_agg(s.subscription_id)
                        from unnest(subscriptions) s
                        where s.claims_role = working_role
                          and (s.selected_columns is not distinct from working_selected_columns)
                          and s.subscription_id = any(visible_role_sub_ids)
                    ),
                    '{}'::uuid[]
                );

                return next (
                    output,
                    is_rls_enabled,
                    visible_to_subscription_ids,
                    case
                        when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                        else '{}'
                    end
                )::realtime.wal_rls;
            end loop;

        end if;
    end loop;

    perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_realtime_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_realtime_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_realtime_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_realtime_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
/*
Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
*/
declare
    op_symbol text = (
        case
            when op = 'eq' then '='
            when op = 'neq' then '!='
            when op = 'lt' then '<'
            when op = 'lte' then '<='
            when op = 'gt' then '>'
            when op = 'gte' then '>='
            when op = 'in' then '= any'
            else 'UNKNOWN OP'
        end
    );
    res boolean;
begin
    execute format(
        'select %L::'|| type_::text || ' ' || op_symbol
        || ' ( %L::'
        || (
            case
                when op = 'in' then type_::text || '[]'
                else type_::text end
        )
        || ')', val_1, val_2) into res;
    return res;
end;
$$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_realtime_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) RETURNS boolean
    LANGUAGE plpgsql STABLE
    AS $$
declare
    op_symbol text;
    res boolean;
begin
    -- IS DISTINCT FROM / IS NOT DISTINCT FROM: infix, both sides typed literals
    if op = 'isdistinct' then
        execute format(
            'select %L::%s %s %L::%s',
            val_1,
            type_::text,
            case when negate then 'IS NOT DISTINCT FROM' else 'IS DISTINCT FROM' end,
            val_2,
            type_::text
        ) into res;
        return res;
    end if;

    -- IS requires a keyword RHS (NULL, TRUE, FALSE, UNKNOWN), not a typed literal
    if op = 'is' then
        if val_2 not in ('null', 'true', 'false', 'unknown') then
            raise exception 'invalid value for is filter: must be null, true, false, or unknown';
        end if;
        execute format(
            'select %L::%s %s %s',
            val_1,
            type_::text,
            case when negate then 'IS NOT' else 'IS' end,
            upper(val_2)
        ) into res;
        return res;
    end if;

    op_symbol = case
        when op = 'eq'    then '='
        when op = 'neq'   then '!='
        when op = 'lt'    then '<'
        when op = 'lte'   then '<='
        when op = 'gt'    then '>'
        when op = 'gte'   then '>='
        when op = 'in'    then '= any'
        when op = 'like'   then 'LIKE'
        when op = 'ilike'  then 'ILIKE'
        when op = 'match'  then '~'
        when op = 'imatch' then '~*'
        else null
    end;

    if op_symbol is null then
        raise exception 'unsupported equality operator: %', op::text;
    end if;

    execute format(
        'select %L::%s %s (%L::%s)',
        val_1,
        type_::text,
        op_symbol,
        val_2,
        case when op = 'in' then type_::text || '[]' else type_::text end
    ) into res;

    return case when negate then not res else res end;
end;
$$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) OWNER TO supabase_realtime_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
    select
        filters is null
        or array_length(filters, 1) is null
        or coalesce(
            count(col.name) = count(1)
            and sum(
                realtime.check_equality_op(
                    op:=f.op,
                    type_:=coalesce(col.type_oid::regtype, col.type_name::regtype),
                    val_1:=col.value #>> '{}',
                    val_2:=f.value,
                    negate:=coalesce(f.negate, false)
                )::int
            ) filter (where col.name is not null) = count(col.name),
            false
        )
    from
        unnest(filters) f
        left join unnest(columns) col
            on f.column_name = col.name;
$$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_realtime_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS TABLE(wal jsonb, is_rls_enabled boolean, subscription_ids uuid[], errors text[], slot_changes_count bigint)
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
         pg_logical_slot_get_changes(
           slot_name, null, max_changes,
           'include-pk', 'true',
           'include-transaction', 'false',
           'include-timestamp', 'true',
           'include-type-oids', 'true',
           'format-version', '2',
           'actions', pub.w2j_actions,
           'add-tables', pub.w2j_add_tables
         ) x
  ),
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_realtime_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  SELECT
    realtime.wal2json_escape_identifier(nsp.nspname::text)
    || '.'
    || realtime.wal2json_escape_identifier(pc.relname::text)
  FROM pg_class pc
  JOIN pg_namespace nsp ON pc.relnamespace = nsp.oid
  WHERE pc.oid = entity
$$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_realtime_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_realtime_admin;

--
-- Name: send_binary(bytea, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, binary_payload, event, topic, private, extension)
    VALUES (generated_id, payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) OWNER TO supabase_realtime_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
    col_names text[] = coalesce(
            array_agg(a.attname order by a.attnum),
            '{}'::text[]
        )
        from
            pg_catalog.pg_attribute a
        where
            a.attrelid = new.entity
            and a.attnum > 0
            and not a.attisdropped
            and pg_catalog.has_column_privilege(
                (new.claims ->> 'role'),
                a.attrelid,
                a.attnum,
                'SELECT'
            );
    filter realtime.user_defined_filter;
    col_type regtype;
    in_val jsonb;
    selected_col text;
begin
    for filter in select * from unnest(new.filters) loop
        if not filter.column_name = any(col_names) then
            raise exception 'invalid column for filter %', filter.column_name;
        end if;

        col_type = (
            select atttypid::regtype
            from pg_catalog.pg_attribute
            where attrelid = new.entity
                  and attname = filter.column_name
        );
        if col_type is null then
            raise exception 'failed to lookup type for column %', filter.column_name;
        end if;

        if filter.op = 'in'::realtime.equality_op then
            in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
            if coalesce(jsonb_array_length(in_val), 0) > 100 then
                raise exception 'too many values for `in` filter. Maximum 100';
            end if;
        elsif filter.op = 'is'::realtime.equality_op then
            -- `is` requires a keyword RHS rather than a typed literal
            if filter.value not in ('null', 'true', 'false', 'unknown') then
                raise exception 'invalid value for is filter: must be null, true, false, or unknown';
            end if;
            -- IS NULL works for any type, but IS TRUE/FALSE/UNKNOWN require a boolean
            -- operand. Reject the non-null keywords on non-boolean columns here so they
            -- don't abort apply_rls at WAL time.
            if filter.value <> 'null' and col_type <> 'boolean'::regtype then
                raise exception 'is % filter requires a boolean column, got %', filter.value, col_type::text;
            end if;
        elsif filter.op in ('like'::realtime.equality_op, 'ilike'::realtime.equality_op) then
            -- like/ilike apply the text pattern operator (~~); reject column types that
            -- have no such operator instead of failing at WAL time
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = '~~' and oprleft = col_type
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
        elsif filter.op in ('match'::realtime.equality_op, 'imatch'::realtime.equality_op) then
            -- match/imatch apply the regex operators ~ / ~*; reject column types that have
            -- no such operator (e.g. integer) instead of failing at WAL time, mirroring the
            -- like/ilike guard above.
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = case when filter.op = 'imatch'::realtime.equality_op then '~*' else '~' end
                  and oprleft = col_type
                  and oprright = col_type
                  and oprresult = 'boolean'::regtype
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
            -- validate the regex eagerly so a bad pattern is rejected here, not inside
            -- apply_rls where it would abort the WAL stream for the entity
            begin
                perform '' ~ filter.value;
            exception when others then
                raise exception 'invalid regular expression for % filter: %', filter.op::text, sqlerrm;
            end;
        else
            -- eq/neq/lt/lte/gt/gte: value must be coercable to the type
            perform realtime.cast(filter.value, col_type);
        end if;
    end loop;

    if new.selected_columns is not null then
        for selected_col in select * from unnest(new.selected_columns) loop
            if not selected_col = any(col_names) then
                raise exception 'invalid column for select %', selected_col;
            end if;
        end loop;
    end if;

    -- Apply consistent order to filters so the unique constraint can't be tricked by a
    -- different filter order. negate is part of the sort key.
    new.filters = coalesce(
        array_agg(f order by f.column_name, f.op, f.value, f.negate),
        '{}'
    ) from unnest(new.filters) f;

    new.selected_columns = (
        select array_agg(c order by c)
        from unnest(new.selected_columns) c
    );

    return new;
end;
$$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_realtime_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_realtime_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: wal2json_escape_identifier(text); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.wal2json_escape_identifier(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Prefix `\`, `,`, `.`, and any whitespace with `\`
  SELECT regexp_replace(name, '([\\,.[:space:]])', '\\\1', 'g')
$$;


ALTER FUNCTION realtime.wal2json_escape_identifier(name text) OWNER TO supabase_realtime_admin;

--
-- Name: allow_any_operation(text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_any_operation(expected_operations text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


ALTER FUNCTION storage.allow_any_operation(expected_operations text[]) OWNER TO supabase_storage_admin;

--
-- Name: allow_only_operation(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_only_operation(expected_operation text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


ALTER FUNCTION storage.allow_only_operation(expected_operation text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Get the last path segment (the actual filename)
    SELECT _parts[array_length(_parts, 1)] INTO _filename;
    -- Extract extension: reverse, split on '.', then reverse again
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint)::bigint as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.protect_delete() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    custom_claims_allowlist text[] DEFAULT '{}'::text[] NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


ALTER TABLE auth.webauthn_challenges OWNER TO supabase_auth_admin;

--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


ALTER TABLE auth.webauthn_credentials OWNER TO supabase_auth_admin;

--
-- Name: active_drop_pool; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.active_drop_pool (
    id bigint NOT NULL,
    item_id uuid NOT NULL,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true
);


ALTER TABLE public.active_drop_pool OWNER TO postgres;

--
-- Name: active_drop_pool_collections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.active_drop_pool_collections (
    id bigint NOT NULL,
    collection_id uuid NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.active_drop_pool_collections OWNER TO postgres;

--
-- Name: TABLE active_drop_pool_collections; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.active_drop_pool_collections IS 'CS2 game collections included in the current weekly drop pool (mobile scanner).';


--
-- Name: active_drop_pool_collections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.active_drop_pool_collections ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.active_drop_pool_collections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: active_drop_pool_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.active_drop_pool ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.active_drop_pool_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: app_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.app_settings (
    id integer DEFAULT 1 NOT NULL,
    min_build_number_ios integer DEFAULT 1 NOT NULL,
    min_build_number_android integer DEFAULT 1 NOT NULL,
    latest_build_number_ios integer DEFAULT 1 NOT NULL,
    latest_build_number_android integer DEFAULT 1 NOT NULL,
    is_maintenance_mode boolean DEFAULT false NOT NULL,
    maintenance_message text DEFAULT '''Technical break, we will be back soon!''::text'::text,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT app_settings_single_row CHECK ((id = 1))
);


ALTER TABLE public.app_settings OWNER TO postgres;

--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    excerpt text DEFAULT ''::text NOT NULL,
    body_md text DEFAULT ''::text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    published_at timestamp with time zone,
    scheduled_for timestamp with time zone,
    feature_image_path text,
    feature_image_alt text,
    meta_title text,
    meta_description text,
    canonical_path text,
    og_image_path text,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    author_name text DEFAULT 'Skinvestments'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT blog_posts_slug_format CHECK ((slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'::text)),
    CONSTRAINT blog_posts_status_check CHECK ((status = ANY (ARRAY['idea'::text, 'draft'::text, 'scheduled'::text, 'published'::text, 'archived'::text])))
);


ALTER TABLE public.blog_posts OWNER TO postgres;

--
-- Name: TABLE blog_posts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.blog_posts IS 'Marketing blog. Publish → trigger Vercel Deploy Hook to refresh prerendered SEO shells + sitemap.';


--
-- Name: collections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.collections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    flag_color text
);


ALTER TABLE public.collections OWNER TO postgres;

--
-- Name: cs2_item_collections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cs2_item_collections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    type text,
    icon_url text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.cs2_item_collections OWNER TO postgres;

--
-- Name: cs2_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cs2_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    market_hash_name text NOT NULL,
    icon_url text,
    type text,
    rarity text,
    exterior text,
    is_stattrak boolean DEFAULT false,
    is_souvenir boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    price numeric DEFAULT 0,
    price_updated_at timestamp with time zone,
    volume_24h integer DEFAULT 0,
    buy_order_price numeric DEFAULT 0,
    is_discontinued boolean DEFAULT false,
    price_gap numeric GENERATED ALWAYS AS ((price - buy_order_price)) STORED,
    skinport_price numeric DEFAULT 0,
    skinport_updated_at timestamp with time zone,
    steam_item_id text,
    category text,
    game_collection_id uuid
);


ALTER TABLE public.cs2_items OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    reference_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notifications_type_check CHECK ((type = ANY (ARRAY['PRICE_ALERT'::text, 'DAILY_SUMMARY'::text, 'SYSTEM'::text, 'ACHIEVEMENT'::text])))
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: portfolio_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolio_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    quantity integer DEFAULT 0,
    buy_price numeric DEFAULT 0,
    updated_at timestamp with time zone DEFAULT now(),
    collection_id uuid,
    item_id uuid NOT NULL,
    acquired_at timestamp with time zone DEFAULT now(),
    original_quantity integer DEFAULT 0,
    investment_quantity integer DEFAULT 0,
    CONSTRAINT chk_portfolio_inv_quantity_positive CHECK ((investment_quantity >= 0)),
    CONSTRAINT chk_portfolio_quantity_positive CHECK ((quantity >= 0))
);


ALTER TABLE public.portfolio_items OWNER TO postgres;

--
-- Name: portfolio_snapshots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolio_snapshots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    total_value numeric NOT NULL,
    recorded_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.portfolio_snapshots OWNER TO postgres;

--
-- Name: price_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_history (
    id bigint NOT NULL,
    item_id uuid NOT NULL,
    year integer NOT NULL,
    history_data jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.price_history OWNER TO postgres;

--
-- Name: price_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.price_history ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.price_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: steam_connections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.steam_connections (
    user_id uuid NOT NULL,
    steam_id_64 bigint NOT NULL,
    steam_username text,
    steam_avatar_url text,
    linked_at timestamp with time zone DEFAULT now() NOT NULL,
    inventory_status text DEFAULT 'ACTIVE'::text NOT NULL,
    last_profile_sync timestamp with time zone,
    last_inventory_sync timestamp with time zone,
    is_main boolean DEFAULT false NOT NULL,
    CONSTRAINT steam_connections_inventory_status_check CHECK ((inventory_status = ANY (ARRAY['ACTIVE'::text, 'PRIVATE'::text, 'ERROR'::text])))
);


ALTER TABLE public.steam_connections OWNER TO postgres;

--
-- Name: steam_exchange_rates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.steam_exchange_rates (
    currency_code text NOT NULL,
    rate_to_usd numeric NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.steam_exchange_rates OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type public.transaction_type NOT NULL,
    quantity integer NOT NULL,
    price numeric NOT NULL,
    fee_deducted numeric DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    item_id uuid NOT NULL,
    transaction_date timestamp with time zone DEFAULT now(),
    is_investment boolean DEFAULT false,
    realized_profit numeric DEFAULT 0,
    source_transaction_id uuid,
    collection_id uuid,
    CONSTRAINT chk_tx_price_positive CHECK ((price >= (0)::numeric)),
    CONSTRAINT chk_tx_quantity_positive CHECK ((quantity > 0)),
    CONSTRAINT transactions_type_check CHECK ((type = ANY (ARRAY['BUY'::public.transaction_type, 'SELL'::public.transaction_type, 'DROP'::public.transaction_type])))
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: view_portfolio_performance; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.view_portfolio_performance WITH (security_invoker='on') AS
 SELECT p.user_id,
    p.item_id,
    i.market_hash_name,
    sum(p.quantity) AS total_quantity,
    sum(((p.quantity)::numeric * p.buy_price)) AS total_invested,
    sum(((p.quantity)::numeric * COALESCE(i.price, (0)::numeric))) AS current_value,
    (sum(((p.quantity)::numeric * COALESCE(i.price, (0)::numeric))) - sum(((p.quantity)::numeric * p.buy_price))) AS profit_loss,
        CASE
            WHEN (sum(((p.quantity)::numeric * p.buy_price)) > (0)::numeric) THEN round((((sum(((p.quantity)::numeric * COALESCE(i.price, (0)::numeric))) - sum(((p.quantity)::numeric * p.buy_price))) / sum(((p.quantity)::numeric * p.buy_price))) * (100)::numeric), 2)
            ELSE (0)::numeric
        END AS roi_percentage
   FROM (public.portfolio_items p
     JOIN public.cs2_items i ON ((p.item_id = i.id)))
  GROUP BY p.user_id, p.item_id, i.market_hash_name, i.price;


ALTER VIEW public.view_portfolio_performance OWNER TO postgres;

--
-- Name: wishlist_alert_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist_alert_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    wishlist_item_id uuid NOT NULL,
    alert_rule_id uuid,
    alert_type public.wishlist_alert_type NOT NULL,
    payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    triggered_at timestamp with time zone DEFAULT now() NOT NULL,
    is_read boolean DEFAULT false NOT NULL
);


ALTER TABLE public.wishlist_alert_events OWNER TO postgres;

--
-- Name: wishlist_alert_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist_alert_rules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    wishlist_item_id uuid NOT NULL,
    alert_type public.wishlist_alert_type NOT NULL,
    threshold_value numeric(12,4),
    is_enabled boolean DEFAULT true NOT NULL,
    cooldown_minutes integer DEFAULT 60 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT wishlist_alert_rules_cooldown_minutes_check CHECK ((cooldown_minutes >= 0))
);


ALTER TABLE public.wishlist_alert_rules OWNER TO postgres;

--
-- Name: wishlist_item_ladders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist_item_ladders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    wishlist_item_id uuid NOT NULL,
    step_no integer NOT NULL,
    target_price numeric(12,2) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT wishlist_item_ladders_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT wishlist_item_ladders_step_no_check CHECK ((step_no > 0))
);


ALTER TABLE public.wishlist_item_ladders OWNER TO postgres;

--
-- Name: wishlist_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    wishlist_id uuid NOT NULL,
    item_id uuid NOT NULL,
    target_buy_price numeric(12,2),
    max_budget numeric(12,2),
    desired_quantity integer DEFAULT 1 NOT NULL,
    priority public.wishlist_priority DEFAULT 'medium'::public.wishlist_priority NOT NULL,
    status public.wishlist_item_status DEFAULT 'active'::public.wishlist_item_status NOT NULL,
    horizon public.wishlist_horizon,
    thesis text,
    note text,
    opportunity_score numeric(5,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT wishlist_items_desired_quantity_check CHECK ((desired_quantity > 0)),
    CONSTRAINT wishlist_items_opportunity_score_check CHECK (((opportunity_score >= (0)::numeric) AND (opportunity_score <= (100)::numeric)))
);


ALTER TABLE public.wishlist_items OWNER TO postgres;

--
-- Name: wishlists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlists (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text DEFAULT 'My Wishlist'::text NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.wishlists OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_07_21; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages_2026_07_21 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_07_21 OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_07_22; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages_2026_07_22 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_07_22 OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_07_23; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages_2026_07_23 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_07_23 OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_07_24; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages_2026_07_24 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_07_24 OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_07_25; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages_2026_07_25 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_07_25 OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_07_26; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages_2026_07_26 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_07_26 OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_07_27; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages_2026_07_27 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea,
    CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL)))
);


ALTER TABLE realtime.messages_2026_07_27 OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    selected_columns text[],
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE realtime.subscription OWNER TO supabase_realtime_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb,
    metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: messages_2026_07_21; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_07_21 FOR VALUES FROM ('2026-07-21 00:00:00') TO ('2026-07-22 00:00:00');


--
-- Name: messages_2026_07_22; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_07_22 FOR VALUES FROM ('2026-07-22 00:00:00') TO ('2026-07-23 00:00:00');


--
-- Name: messages_2026_07_23; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_07_23 FOR VALUES FROM ('2026-07-23 00:00:00') TO ('2026-07-24 00:00:00');


--
-- Name: messages_2026_07_24; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_07_24 FOR VALUES FROM ('2026-07-24 00:00:00') TO ('2026-07-25 00:00:00');


--
-- Name: messages_2026_07_25; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_07_25 FOR VALUES FROM ('2026-07-25 00:00:00') TO ('2026-07-26 00:00:00');


--
-- Name: messages_2026_07_26; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_07_26 FOR VALUES FROM ('2026-07-26 00:00:00') TO ('2026-07-27 00:00:00');


--
-- Name: messages_2026_07_27; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_07_27 FOR VALUES FROM ('2026-07-27 00:00:00') TO ('2026-07-28 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: active_drop_pool_collections active_drop_pool_collections_collection_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.active_drop_pool_collections
    ADD CONSTRAINT active_drop_pool_collections_collection_id_key UNIQUE (collection_id);


--
-- Name: active_drop_pool_collections active_drop_pool_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.active_drop_pool_collections
    ADD CONSTRAINT active_drop_pool_collections_pkey PRIMARY KEY (id);


--
-- Name: active_drop_pool active_drop_pool_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.active_drop_pool
    ADD CONSTRAINT active_drop_pool_pkey PRIMARY KEY (id);


--
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);


--
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);


--
-- Name: cs2_item_collections cs2_item_collections_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cs2_item_collections
    ADD CONSTRAINT cs2_item_collections_name_key UNIQUE (name);


--
-- Name: cs2_item_collections cs2_item_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cs2_item_collections
    ADD CONSTRAINT cs2_item_collections_pkey PRIMARY KEY (id);


--
-- Name: cs2_items cs2_items_market_hash_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cs2_items
    ADD CONSTRAINT cs2_items_market_hash_name_key UNIQUE (market_hash_name);


--
-- Name: cs2_items cs2_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cs2_items
    ADD CONSTRAINT cs2_items_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: portfolio_items portfolio_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_items
    ADD CONSTRAINT portfolio_items_pkey PRIMARY KEY (id);


--
-- Name: portfolio_shares portfolio_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_shares
    ADD CONSTRAINT portfolio_shares_pkey PRIMARY KEY (id);


--
-- Name: portfolio_shares portfolio_shares_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_shares
    ADD CONSTRAINT portfolio_shares_token_key UNIQUE (token);


--
-- Name: portfolio_shares portfolio_shares_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_shares
    ADD CONSTRAINT portfolio_shares_user_id_unique UNIQUE (user_id);


--
-- Name: portfolio_snapshots portfolio_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_snapshots
    ADD CONSTRAINT portfolio_snapshots_pkey PRIMARY KEY (id);


--
-- Name: price_history price_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_pkey PRIMARY KEY (id);


--
-- Name: price_history price_history_unique_item_year; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_unique_item_year UNIQUE (item_id, year);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_steam_profile_url_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_steam_profile_url_key UNIQUE (steam_profile_url);


--
-- Name: steam_connections steam_connections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.steam_connections
    ADD CONSTRAINT steam_connections_pkey PRIMARY KEY (user_id, steam_id_64);


--
-- Name: steam_exchange_rates steam_exchange_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.steam_exchange_rates
    ADD CONSTRAINT steam_exchange_rates_pkey PRIMARY KEY (currency_code);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: portfolio_items unique_item_in_collection; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_items
    ADD CONSTRAINT unique_item_in_collection UNIQUE NULLS NOT DISTINCT (user_id, item_id, collection_id);


--
-- Name: wishlist_alert_events wishlist_alert_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_alert_events
    ADD CONSTRAINT wishlist_alert_events_pkey PRIMARY KEY (id);


--
-- Name: wishlist_alert_rules wishlist_alert_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_alert_rules
    ADD CONSTRAINT wishlist_alert_rules_pkey PRIMARY KEY (id);


--
-- Name: wishlist_item_ladders wishlist_item_ladders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_item_ladders
    ADD CONSTRAINT wishlist_item_ladders_pkey PRIMARY KEY (id);


--
-- Name: wishlist_items wishlist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_pkey PRIMARY KEY (id);


--
-- Name: wishlists wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_07_21 messages_2026_07_21_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages_2026_07_21
    ADD CONSTRAINT messages_2026_07_21_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_07_22 messages_2026_07_22_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages_2026_07_22
    ADD CONSTRAINT messages_2026_07_22_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_07_23 messages_2026_07_23_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages_2026_07_23
    ADD CONSTRAINT messages_2026_07_23_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_07_24 messages_2026_07_24_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages_2026_07_24
    ADD CONSTRAINT messages_2026_07_24_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_07_25 messages_2026_07_25_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages_2026_07_25
    ADD CONSTRAINT messages_2026_07_25_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_07_26 messages_2026_07_26_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages_2026_07_26
    ADD CONSTRAINT messages_2026_07_26_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_07_27 messages_2026_07_27_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages_2026_07_27
    ADD CONSTRAINT messages_2026_07_27_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages messages_payload_exclusive; Type: CHECK CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages
    ADD CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL))) NOT VALID;


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: blog_posts_status_published_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX blog_posts_status_published_at_idx ON public.blog_posts USING btree (status, published_at DESC NULLS LAST);


--
-- Name: idx_active_drop_pool_collections_active_sort; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_active_drop_pool_collections_active_sort ON public.active_drop_pool_collections USING btree (sort_order) WHERE (is_active = true);


--
-- Name: idx_active_drop_pool_collections_collection_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_active_drop_pool_collections_collection_id ON public.active_drop_pool_collections USING btree (collection_id);


--
-- Name: idx_cs2_items_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cs2_items_category ON public.cs2_items USING btree (category);


--
-- Name: idx_cs2_items_game_collection; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cs2_items_game_collection ON public.cs2_items USING btree (game_collection_id);


--
-- Name: idx_cs2_items_hash_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cs2_items_hash_name ON public.cs2_items USING btree (market_hash_name);


--
-- Name: idx_cs2_items_name_trgm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cs2_items_name_trgm ON public.cs2_items USING gin (market_hash_name public.gin_trgm_ops);


--
-- Name: idx_notifications_user_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user_read ON public.notifications USING btree (user_id, is_read);


--
-- Name: idx_portfolio_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_portfolio_item_id ON public.portfolio_items USING btree (item_id);


--
-- Name: idx_portfolio_items_acquired_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_portfolio_items_acquired_at ON public.portfolio_items USING btree (acquired_at);


--
-- Name: idx_portfolio_items_user_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_portfolio_items_user_item ON public.portfolio_items USING btree (user_id, item_id);


--
-- Name: idx_portfolio_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_portfolio_user_id ON public.portfolio_items USING btree (user_id);


--
-- Name: idx_price_history_fetch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_price_history_fetch ON public.price_history USING btree (item_id, year);


--
-- Name: idx_price_history_item_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_price_history_item_year ON public.price_history USING btree (item_id, year);


--
-- Name: idx_profiles_nickname; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_profiles_nickname ON public.profiles USING btree (nickname);


--
-- Name: idx_snapshots_user_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_snapshots_user_date ON public.portfolio_snapshots USING btree (user_id, recorded_at DESC);


--
-- Name: idx_steam_connections_steam_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_steam_connections_steam_id ON public.steam_connections USING btree (steam_id_64);


--
-- Name: idx_transactions_collection_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_collection_id ON public.transactions USING btree (collection_id);


--
-- Name: idx_transactions_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_date ON public.transactions USING btree (transaction_date DESC);


--
-- Name: idx_transactions_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_item_id ON public.transactions USING btree (item_id);


--
-- Name: idx_transactions_transaction_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_transaction_date ON public.transactions USING btree (transaction_date DESC);


--
-- Name: idx_transactions_user_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_user_date ON public.transactions USING btree (user_id, transaction_date);


--
-- Name: idx_transactions_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_user_id ON public.transactions USING btree (user_id);


--
-- Name: idx_wishlist_alert_events_item_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wishlist_alert_events_item_time ON public.wishlist_alert_events USING btree (wishlist_item_id, triggered_at DESC);


--
-- Name: idx_wishlist_alert_events_unread; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wishlist_alert_events_unread ON public.wishlist_alert_events USING btree (is_read, triggered_at DESC);


--
-- Name: idx_wishlist_alert_rules_item_enabled; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wishlist_alert_rules_item_enabled ON public.wishlist_alert_rules USING btree (wishlist_item_id, is_enabled);


--
-- Name: idx_wishlist_items_status_priority; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wishlist_items_status_priority ON public.wishlist_items USING btree (status, priority);


--
-- Name: idx_wishlist_items_wishlist_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wishlist_items_wishlist_id ON public.wishlist_items USING btree (wishlist_id);


--
-- Name: idx_wishlists_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wishlists_user_id ON public.wishlists USING btree (user_id);


--
-- Name: one_main_account_per_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX one_main_account_per_user ON public.steam_connections USING btree (user_id) WHERE (is_main = true);


--
-- Name: portfolio_shares_token_enabled_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX portfolio_shares_token_enabled_idx ON public.portfolio_shares USING btree (token) WHERE (enabled = true);


--
-- Name: uq_wishlist_item_ladders_step; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_wishlist_item_ladders_step ON public.wishlist_item_ladders USING btree (wishlist_item_id, step_no);


--
-- Name: uq_wishlist_items_unique_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_wishlist_items_unique_item ON public.wishlist_items USING btree (wishlist_id, item_id);


--
-- Name: uq_wishlists_user_default; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_wishlists_user_default ON public.wishlists USING btree (user_id) WHERE (is_default = true);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_07_21_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_2026_07_21_inserted_at_topic_idx ON realtime.messages_2026_07_21 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_07_22_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_2026_07_22_inserted_at_topic_idx ON realtime.messages_2026_07_22 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_07_23_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_2026_07_23_inserted_at_topic_idx ON realtime.messages_2026_07_23 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_07_24_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_2026_07_24_inserted_at_topic_idx ON realtime.messages_2026_07_24 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_07_25_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_2026_07_25_inserted_at_topic_idx ON realtime.messages_2026_07_25 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_07_26_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_2026_07_26_inserted_at_topic_idx ON realtime.messages_2026_07_26 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_07_27_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_2026_07_27_inserted_at_topic_idx ON realtime.messages_2026_07_27 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_selec; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_selec ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter, COALESCE(selected_columns, '{}'::text[]));


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: messages_2026_07_21_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_07_21_inserted_at_topic_idx;


--
-- Name: messages_2026_07_21_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_07_21_pkey;


--
-- Name: messages_2026_07_22_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_07_22_inserted_at_topic_idx;


--
-- Name: messages_2026_07_22_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_07_22_pkey;


--
-- Name: messages_2026_07_23_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_07_23_inserted_at_topic_idx;


--
-- Name: messages_2026_07_23_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_07_23_pkey;


--
-- Name: messages_2026_07_24_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_07_24_inserted_at_topic_idx;


--
-- Name: messages_2026_07_24_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_07_24_pkey;


--
-- Name: messages_2026_07_25_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_07_25_inserted_at_topic_idx;


--
-- Name: messages_2026_07_25_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_07_25_pkey;


--
-- Name: messages_2026_07_26_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_07_26_inserted_at_topic_idx;


--
-- Name: messages_2026_07_26_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_07_26_pkey;


--
-- Name: messages_2026_07_27_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_07_27_inserted_at_topic_idx;


--
-- Name: messages_2026_07_27_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_07_27_pkey;


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: blog_posts blog_posts_set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER blog_posts_set_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.set_blog_posts_updated_at();


--
-- Name: cs2_items on_price_change_yearly; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_price_change_yearly AFTER INSERT OR UPDATE ON public.cs2_items FOR EACH ROW EXECUTE FUNCTION public.handle_price_history_yearly();


--
-- Name: portfolio_shares portfolio_shares_set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER portfolio_shares_set_updated_at BEFORE UPDATE ON public.portfolio_shares FOR EACH ROW EXECUTE FUNCTION public.set_portfolio_shares_updated_at();


--
-- Name: wishlist_alert_rules trg_wishlist_alert_rules_touch_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_wishlist_alert_rules_touch_updated_at BEFORE UPDATE ON public.wishlist_alert_rules FOR EACH ROW EXECUTE FUNCTION public.wishlist_touch_updated_at();


--
-- Name: wishlist_items trg_wishlist_items_touch_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_wishlist_items_touch_updated_at BEFORE UPDATE ON public.wishlist_items FOR EACH ROW EXECUTE FUNCTION public.wishlist_touch_updated_at();


--
-- Name: wishlists trg_wishlists_touch_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_wishlists_touch_updated_at BEFORE UPDATE ON public.wishlists FOR EACH ROW EXECUTE FUNCTION public.wishlist_touch_updated_at();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: active_drop_pool_collections active_drop_pool_collections_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.active_drop_pool_collections
    ADD CONSTRAINT active_drop_pool_collections_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.cs2_item_collections(id) ON DELETE CASCADE;


--
-- Name: active_drop_pool active_drop_pool_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.active_drop_pool
    ADD CONSTRAINT active_drop_pool_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.cs2_items(id);


--
-- Name: collections collections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: cs2_items cs2_items_game_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cs2_items
    ADD CONSTRAINT cs2_items_game_collection_id_fkey FOREIGN KEY (game_collection_id) REFERENCES public.cs2_item_collections(id) ON DELETE SET NULL;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: portfolio_items portfolio_items_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_items
    ADD CONSTRAINT portfolio_items_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE SET NULL;


--
-- Name: portfolio_items portfolio_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_items
    ADD CONSTRAINT portfolio_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.cs2_items(id);


--
-- Name: portfolio_items portfolio_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_items
    ADD CONSTRAINT portfolio_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: portfolio_shares portfolio_shares_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_shares
    ADD CONSTRAINT portfolio_shares_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: portfolio_snapshots portfolio_snapshots_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_snapshots
    ADD CONSTRAINT portfolio_snapshots_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: price_history price_history_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.cs2_items(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: steam_connections steam_connections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.steam_connections
    ADD CONSTRAINT steam_connections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(id);


--
-- Name: transactions transactions_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.cs2_items(id);


--
-- Name: transactions transactions_source_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_source_transaction_id_fkey FOREIGN KEY (source_transaction_id) REFERENCES public.transactions(id);


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: wishlist_alert_events wishlist_alert_events_alert_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_alert_events
    ADD CONSTRAINT wishlist_alert_events_alert_rule_id_fkey FOREIGN KEY (alert_rule_id) REFERENCES public.wishlist_alert_rules(id) ON DELETE SET NULL;


--
-- Name: wishlist_alert_events wishlist_alert_events_wishlist_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_alert_events
    ADD CONSTRAINT wishlist_alert_events_wishlist_item_id_fkey FOREIGN KEY (wishlist_item_id) REFERENCES public.wishlist_items(id) ON DELETE CASCADE;


--
-- Name: wishlist_alert_rules wishlist_alert_rules_wishlist_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_alert_rules
    ADD CONSTRAINT wishlist_alert_rules_wishlist_item_id_fkey FOREIGN KEY (wishlist_item_id) REFERENCES public.wishlist_items(id) ON DELETE CASCADE;


--
-- Name: wishlist_item_ladders wishlist_item_ladders_wishlist_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_item_ladders
    ADD CONSTRAINT wishlist_item_ladders_wishlist_item_id_fkey FOREIGN KEY (wishlist_item_id) REFERENCES public.wishlist_items(id) ON DELETE CASCADE;


--
-- Name: wishlist_items wishlist_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.cs2_items(id) ON DELETE CASCADE;


--
-- Name: wishlist_items wishlist_items_wishlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_wishlist_id_fkey FOREIGN KEY (wishlist_id) REFERENCES public.wishlists(id) ON DELETE CASCADE;


--
-- Name: wishlists wishlists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: portfolio_items Enable all for users based on user_id; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable all for users based on user_id" ON public.portfolio_items TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: transactions Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public.transactions FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: active_drop_pool Enable read access for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for authenticated users only" ON public.active_drop_pool FOR SELECT TO authenticated USING (true);


--
-- Name: active_drop_pool_collections Enable read access for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for authenticated users only" ON public.active_drop_pool_collections FOR SELECT TO authenticated USING (true);


--
-- Name: cs2_items Enable read access for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for authenticated users only" ON public.cs2_items FOR SELECT TO authenticated USING (true);


--
-- Name: portfolio_shares Owners insert own portfolio share; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Owners insert own portfolio share" ON public.portfolio_shares FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: portfolio_shares Owners read own portfolio share; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Owners read own portfolio share" ON public.portfolio_shares FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: portfolio_shares Owners update own portfolio share; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Owners update own portfolio share" ON public.portfolio_shares FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: price_history Public prices are visible to everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public prices are visible to everyone" ON public.price_history FOR SELECT USING (true);


--
-- Name: blog_posts Public read published blog posts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read published blog posts" ON public.blog_posts FOR SELECT TO authenticated, anon USING (((status = 'published'::text) AND ((published_at IS NULL) OR (published_at <= now()))));


--
-- Name: profiles Service role can insert profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Service role can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);


--
-- Name: steam_connections Service role can insert steam connections; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Service role can insert steam connections" ON public.steam_connections FOR INSERT WITH CHECK (true);


--
-- Name: steam_connections Service role can manage steam connections; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Service role can manage steam connections" ON public.steam_connections USING (true);


--
-- Name: profiles System can create profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can create profiles" ON public.profiles FOR INSERT WITH CHECK (true);


--
-- Name: portfolio_items Users can CRUD own items; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can CRUD own items" ON public.portfolio_items USING ((auth.uid() = user_id));


--
-- Name: portfolio_snapshots Users can CRUD own snapshots; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can CRUD own snapshots" ON public.portfolio_snapshots USING ((auth.uid() = user_id));


--
-- Name: transactions Users can CRUD own transactions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can CRUD own transactions" ON public.transactions USING ((auth.uid() = user_id));


--
-- Name: collections Users can delete own collections; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own collections" ON public.collections FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: portfolio_items Users can delete own items; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own items" ON public.portfolio_items FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: collections Users can insert own collections; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own collections" ON public.collections FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: portfolio_items Users can insert own items; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own items" ON public.portfolio_items FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can insert own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: portfolio_snapshots Users can insert own snapshots; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own snapshots" ON public.portfolio_snapshots FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: transactions Users can insert own transactions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: collections Users can update own collections; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own collections" ON public.collections FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: portfolio_items Users can update own items; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own items" ON public.portfolio_items FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: steam_connections Users can update their own steam connection; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own steam connection" ON public.steam_connections FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: collections Users can view own collections; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own collections" ON public.collections FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: portfolio_items Users can view own items; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own items" ON public.portfolio_items FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: portfolio_snapshots Users can view own snapshots; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own snapshots" ON public.portfolio_snapshots FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: transactions Users can view own transactions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: steam_connections Users can view their own steam connection; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own steam connection" ON public.steam_connections FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: active_drop_pool; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.active_drop_pool ENABLE ROW LEVEL SECURITY;

--
-- Name: active_drop_pool_collections; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.active_drop_pool_collections ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_posts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

--
-- Name: collections; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

--
-- Name: cs2_item_collections; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.cs2_item_collections ENABLE ROW LEVEL SECURITY;

--
-- Name: cs2_items; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.cs2_items ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: portfolio_items; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

--
-- Name: portfolio_shares; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.portfolio_shares ENABLE ROW LEVEL SECURITY;

--
-- Name: portfolio_snapshots; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.portfolio_snapshots ENABLE ROW LEVEL SECURITY;

--
-- Name: price_history; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: steam_connections; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.steam_connections ENABLE ROW LEVEL SECURITY;

--
-- Name: steam_exchange_rates; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.steam_exchange_rates ENABLE ROW LEVEL SECURITY;

--
-- Name: transactions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

--
-- Name: wishlist_alert_events; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.wishlist_alert_events ENABLE ROW LEVEL SECURITY;

--
-- Name: wishlist_alert_events wishlist_alert_events_own_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY wishlist_alert_events_own_all ON public.wishlist_alert_events USING ((EXISTS ( SELECT 1
   FROM (public.wishlist_items wi
     JOIN public.wishlists w ON ((w.id = wi.wishlist_id)))
  WHERE ((wi.id = wishlist_alert_events.wishlist_item_id) AND (w.user_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM (public.wishlist_items wi
     JOIN public.wishlists w ON ((w.id = wi.wishlist_id)))
  WHERE ((wi.id = wishlist_alert_events.wishlist_item_id) AND (w.user_id = auth.uid())))));


--
-- Name: wishlist_alert_rules; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.wishlist_alert_rules ENABLE ROW LEVEL SECURITY;

--
-- Name: wishlist_alert_rules wishlist_alert_rules_own_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY wishlist_alert_rules_own_all ON public.wishlist_alert_rules USING ((EXISTS ( SELECT 1
   FROM (public.wishlist_items wi
     JOIN public.wishlists w ON ((w.id = wi.wishlist_id)))
  WHERE ((wi.id = wishlist_alert_rules.wishlist_item_id) AND (w.user_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM (public.wishlist_items wi
     JOIN public.wishlists w ON ((w.id = wi.wishlist_id)))
  WHERE ((wi.id = wishlist_alert_rules.wishlist_item_id) AND (w.user_id = auth.uid())))));


--
-- Name: wishlist_item_ladders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.wishlist_item_ladders ENABLE ROW LEVEL SECURITY;

--
-- Name: wishlist_item_ladders wishlist_item_ladders_own_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY wishlist_item_ladders_own_all ON public.wishlist_item_ladders USING ((EXISTS ( SELECT 1
   FROM (public.wishlist_items wi
     JOIN public.wishlists w ON ((w.id = wi.wishlist_id)))
  WHERE ((wi.id = wishlist_item_ladders.wishlist_item_id) AND (w.user_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM (public.wishlist_items wi
     JOIN public.wishlists w ON ((w.id = wi.wishlist_id)))
  WHERE ((wi.id = wishlist_item_ladders.wishlist_item_id) AND (w.user_id = auth.uid())))));


--
-- Name: wishlist_items; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

--
-- Name: wishlist_items wishlist_items_delete_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY wishlist_items_delete_own ON public.wishlist_items FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.wishlists w
  WHERE ((w.id = wishlist_items.wishlist_id) AND (w.user_id = auth.uid())))));


--
-- Name: wishlist_items wishlist_items_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY wishlist_items_insert_own ON public.wishlist_items FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.wishlists w
  WHERE ((w.id = wishlist_items.wishlist_id) AND (w.user_id = auth.uid())))));


--
-- Name: wishlist_items wishlist_items_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY wishlist_items_select_own ON public.wishlist_items FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.wishlists w
  WHERE ((w.id = wishlist_items.wishlist_id) AND (w.user_id = auth.uid())))));


--
-- Name: wishlist_items wishlist_items_update_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY wishlist_items_update_own ON public.wishlist_items FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.wishlists w
  WHERE ((w.id = wishlist_items.wishlist_id) AND (w.user_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.wishlists w
  WHERE ((w.id = wishlist_items.wishlist_id) AND (w.user_id = auth.uid())))));


--
-- Name: wishlists; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

--
-- Name: wishlists wishlists_delete_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY wishlists_delete_own ON public.wishlists FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: wishlists wishlists_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY wishlists_insert_own ON public.wishlists FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: wishlists wishlists_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY wishlists_select_own ON public.wishlists FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: wishlists wishlists_update_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY wishlists_update_own ON public.wishlists FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: objects Give users access to own folder lhe90e_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give users access to own folder lhe90e_0" ON storage.objects FOR UPDATE TO authenticated USING (((bucket_id = 'user_uploads'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Give users access to own folder lhe90e_1; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give users access to own folder lhe90e_1" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'user_uploads'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Give users access to own folder lhe90e_2; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give users access to own folder lhe90e_2" ON storage.objects FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'user_uploads'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Give users access to own folder lhe90e_3; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give users access to own folder lhe90e_3" ON storage.objects FOR DELETE TO authenticated USING (((bucket_id = 'user_uploads'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Public read blog images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public read blog images" ON storage.objects FOR SELECT USING ((bucket_id = 'blog-images'::text));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: supabase_admin
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime_messages_publication OWNER TO supabase_admin;

--
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: supabase_admin
--

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;


--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA cron; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA cron TO postgres WITH GRANT OPTION;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA public TO agent_inspector;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION gtrgm_in(cstring); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_in(cstring) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_in(cstring) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_in(cstring) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_in(cstring) TO service_role;


--
-- Name: FUNCTION gtrgm_out(public.gtrgm); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_out(public.gtrgm) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_out(public.gtrgm) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_out(public.gtrgm) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_out(public.gtrgm) TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION alter_job(job_id bigint, schedule text, command text, database text, username text, active boolean); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.alter_job(job_id bigint, schedule text, command text, database text, username text, active boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION job_cache_invalidate(); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.job_cache_invalidate() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule(schedule text, command text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule(schedule text, command text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule(job_name text, schedule text, command text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule(job_name text, schedule text, command text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule_in_database(job_name text, schedule text, command text, database text, username text, active boolean); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule_in_database(job_name text, schedule text, command text, database text, username text, active boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION unschedule(job_id bigint); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.unschedule(job_id bigint) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION unschedule(job_name text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.unschedule(job_name text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_reload_conf() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION add_transactions_bulk(p_user_id uuid, p_transactions jsonb[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.add_transactions_bulk(p_user_id uuid, p_transactions jsonb[]) TO anon;
GRANT ALL ON FUNCTION public.add_transactions_bulk(p_user_id uuid, p_transactions jsonb[]) TO authenticated;
GRANT ALL ON FUNCTION public.add_transactions_bulk(p_user_id uuid, p_transactions jsonb[]) TO service_role;


--
-- Name: FUNCTION catalog_get_collections(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.catalog_get_collections() TO anon;
GRANT ALL ON FUNCTION public.catalog_get_collections() TO authenticated;
GRANT ALL ON FUNCTION public.catalog_get_collections() TO service_role;


--
-- Name: FUNCTION catalog_search_items(p_search text, p_collection_id uuid, p_sort text, p_limit integer, p_offset integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.catalog_search_items(p_search text, p_collection_id uuid, p_sort text, p_limit integer, p_offset integer) TO anon;
GRANT ALL ON FUNCTION public.catalog_search_items(p_search text, p_collection_id uuid, p_sort text, p_limit integer, p_offset integer) TO authenticated;
GRANT ALL ON FUNCTION public.catalog_search_items(p_search text, p_collection_id uuid, p_sort text, p_limit integer, p_offset integer) TO service_role;


--
-- Name: FUNCTION cleanup_old_notifications(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.cleanup_old_notifications() TO anon;
GRANT ALL ON FUNCTION public.cleanup_old_notifications() TO authenticated;
GRANT ALL ON FUNCTION public.cleanup_old_notifications() TO service_role;


--
-- Name: FUNCTION create_collection(p_user_id uuid, p_name text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_collection(p_user_id uuid, p_name text) TO anon;
GRANT ALL ON FUNCTION public.create_collection(p_user_id uuid, p_name text) TO authenticated;
GRANT ALL ON FUNCTION public.create_collection(p_user_id uuid, p_name text) TO service_role;


--
-- Name: FUNCTION delete_collection(p_collection_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.delete_collection(p_collection_id uuid) TO anon;
GRANT ALL ON FUNCTION public.delete_collection(p_collection_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.delete_collection(p_collection_id uuid) TO service_role;


--
-- Name: FUNCTION delete_my_account(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.delete_my_account() TO anon;
GRANT ALL ON FUNCTION public.delete_my_account() TO authenticated;
GRANT ALL ON FUNCTION public.delete_my_account() TO service_role;


--
-- Name: FUNCTION delete_transaction(p_transaction_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.delete_transaction(p_transaction_id uuid) TO anon;
GRANT ALL ON FUNCTION public.delete_transaction(p_transaction_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.delete_transaction(p_transaction_id uuid) TO service_role;


--
-- Name: TABLE portfolio_shares; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.portfolio_shares TO authenticated;
GRANT ALL ON TABLE public.portfolio_shares TO service_role;
GRANT SELECT ON TABLE public.portfolio_shares TO agent_inspector;


--
-- Name: FUNCTION disable_portfolio_share(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.disable_portfolio_share() TO anon;
GRANT ALL ON FUNCTION public.disable_portfolio_share() TO authenticated;
GRANT ALL ON FUNCTION public.disable_portfolio_share() TO service_role;


--
-- Name: FUNCTION edit_transaction(p_transaction_id uuid, p_new_quantity integer, p_new_price numeric, p_new_date timestamp with time zone, p_new_is_investment boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.edit_transaction(p_transaction_id uuid, p_new_quantity integer, p_new_price numeric, p_new_date timestamp with time zone, p_new_is_investment boolean) TO anon;
GRANT ALL ON FUNCTION public.edit_transaction(p_transaction_id uuid, p_new_quantity integer, p_new_price numeric, p_new_date timestamp with time zone, p_new_is_investment boolean) TO authenticated;
GRANT ALL ON FUNCTION public.edit_transaction(p_transaction_id uuid, p_new_quantity integer, p_new_price numeric, p_new_date timestamp with time zone, p_new_is_investment boolean) TO service_role;


--
-- Name: FUNCTION enable_portfolio_share(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.enable_portfolio_share() TO anon;
GRANT ALL ON FUNCTION public.enable_portfolio_share() TO authenticated;
GRANT ALL ON FUNCTION public.enable_portfolio_share() TO service_role;


--
-- Name: FUNCTION export_my_data(include_account_details boolean, include_profile boolean, include_steam_connections boolean, include_collections boolean, include_portfolio_items boolean, include_transactions boolean, include_portfolio_snapshots boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.export_my_data(include_account_details boolean, include_profile boolean, include_steam_connections boolean, include_collections boolean, include_portfolio_items boolean, include_transactions boolean, include_portfolio_snapshots boolean) TO anon;
GRANT ALL ON FUNCTION public.export_my_data(include_account_details boolean, include_profile boolean, include_steam_connections boolean, include_collections boolean, include_portfolio_items boolean, include_transactions boolean, include_portfolio_snapshots boolean) TO authenticated;
GRANT ALL ON FUNCTION public.export_my_data(include_account_details boolean, include_profile boolean, include_steam_connections boolean, include_collections boolean, include_portfolio_items boolean, include_transactions boolean, include_portfolio_snapshots boolean) TO service_role;


--
-- Name: FUNCTION export_portfolio(target_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.export_portfolio(target_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.export_portfolio(target_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.export_portfolio(target_user_id uuid) TO service_role;


--
-- Name: FUNCTION export_transactions(target_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.export_transactions(target_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.export_transactions(target_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.export_transactions(target_user_id uuid) TO service_role;


--
-- Name: FUNCTION generate_portfolio_share_token(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_portfolio_share_token() TO anon;
GRANT ALL ON FUNCTION public.generate_portfolio_share_token() TO authenticated;
GRANT ALL ON FUNCTION public.generate_portfolio_share_token() TO service_role;


--
-- Name: FUNCTION get_active_pool(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_active_pool() TO anon;
GRANT ALL ON FUNCTION public.get_active_pool() TO authenticated;
GRANT ALL ON FUNCTION public.get_active_pool() TO service_role;


--
-- Name: FUNCTION get_active_pool_drop_items(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_active_pool_drop_items() TO anon;
GRANT ALL ON FUNCTION public.get_active_pool_drop_items() TO authenticated;
GRANT ALL ON FUNCTION public.get_active_pool_drop_items() TO service_role;


--
-- Name: FUNCTION get_all_steam_exchange_rates(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_all_steam_exchange_rates() TO anon;
GRANT ALL ON FUNCTION public.get_all_steam_exchange_rates() TO authenticated;
GRANT ALL ON FUNCTION public.get_all_steam_exchange_rates() TO service_role;


--
-- Name: FUNCTION get_analytics(p_user_id uuid, p_period_start timestamp with time zone); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_analytics(p_user_id uuid, p_period_start timestamp with time zone) TO anon;
GRANT ALL ON FUNCTION public.get_analytics(p_user_id uuid, p_period_start timestamp with time zone) TO authenticated;
GRANT ALL ON FUNCTION public.get_analytics(p_user_id uuid, p_period_start timestamp with time zone) TO service_role;


--
-- Name: FUNCTION get_chart_data(input_item_id uuid, period_text text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_chart_data(input_item_id uuid, period_text text) TO anon;
GRANT ALL ON FUNCTION public.get_chart_data(input_item_id uuid, period_text text) TO authenticated;
GRANT ALL ON FUNCTION public.get_chart_data(input_item_id uuid, period_text text) TO service_role;


--
-- Name: FUNCTION get_collection_items(p_collection_id uuid, p_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_collection_items(p_collection_id uuid, p_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_collection_items(p_collection_id uuid, p_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_collection_items(p_collection_id uuid, p_user_id uuid) TO service_role;


--
-- Name: FUNCTION get_collection_performance_chart(p_collection_id uuid, period_text text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_collection_performance_chart(p_collection_id uuid, period_text text) TO anon;
GRANT ALL ON FUNCTION public.get_collection_performance_chart(p_collection_id uuid, period_text text) TO authenticated;
GRANT ALL ON FUNCTION public.get_collection_performance_chart(p_collection_id uuid, period_text text) TO service_role;


--
-- Name: FUNCTION get_collection_stats(p_collection_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_collection_stats(p_collection_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_collection_stats(p_collection_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_collection_stats(p_collection_id uuid) TO service_role;


--
-- Name: FUNCTION get_collections(p_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_collections(p_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_collections(p_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_collections(p_user_id uuid) TO service_role;


--
-- Name: FUNCTION get_item_history_start_date(p_item_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_item_history_start_date(p_item_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_item_history_start_date(p_item_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_item_history_start_date(p_item_id uuid) TO service_role;


--
-- Name: FUNCTION get_item_lots(p_user_id uuid, p_item_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_item_lots(p_user_id uuid, p_item_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_item_lots(p_user_id uuid, p_item_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_item_lots(p_user_id uuid, p_item_id uuid) TO service_role;


--
-- Name: FUNCTION get_paginated_transactions(p_user_id uuid, p_page integer, p_page_size integer, p_type_filter text, p_is_investment boolean, p_search_query text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_paginated_transactions(p_user_id uuid, p_page integer, p_page_size integer, p_type_filter text, p_is_investment boolean, p_search_query text) TO anon;
GRANT ALL ON FUNCTION public.get_paginated_transactions(p_user_id uuid, p_page integer, p_page_size integer, p_type_filter text, p_is_investment boolean, p_search_query text) TO authenticated;
GRANT ALL ON FUNCTION public.get_paginated_transactions(p_user_id uuid, p_page integer, p_page_size integer, p_type_filter text, p_is_investment boolean, p_search_query text) TO service_role;


--
-- Name: FUNCTION get_portfolio_allocation(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_portfolio_allocation() TO anon;
GRANT ALL ON FUNCTION public.get_portfolio_allocation() TO authenticated;
GRANT ALL ON FUNCTION public.get_portfolio_allocation() TO service_role;


--
-- Name: FUNCTION get_portfolio_ath(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_portfolio_ath() TO anon;
GRANT ALL ON FUNCTION public.get_portfolio_ath() TO authenticated;
GRANT ALL ON FUNCTION public.get_portfolio_ath() TO service_role;


--
-- Name: FUNCTION get_portfolio_ath_stats(target_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_portfolio_ath_stats(target_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_portfolio_ath_stats(target_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_portfolio_ath_stats(target_user_id uuid) TO service_role;


--
-- Name: FUNCTION get_portfolio_chart(p_period text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_portfolio_chart(p_period text) TO anon;
GRANT ALL ON FUNCTION public.get_portfolio_chart(p_period text) TO authenticated;
GRANT ALL ON FUNCTION public.get_portfolio_chart(p_period text) TO service_role;


--
-- Name: FUNCTION get_portfolio_current_values(period_text text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_portfolio_current_values(period_text text) TO anon;
GRANT ALL ON FUNCTION public.get_portfolio_current_values(period_text text) TO authenticated;
GRANT ALL ON FUNCTION public.get_portfolio_current_values(period_text text) TO service_role;


--
-- Name: FUNCTION get_portfolio_history(target_year integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_portfolio_history(target_year integer) TO anon;
GRANT ALL ON FUNCTION public.get_portfolio_history(target_year integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_portfolio_history(target_year integer) TO service_role;


--
-- Name: FUNCTION get_portfolio_item_detail(p_item_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_portfolio_item_detail(p_item_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_portfolio_item_detail(p_item_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_portfolio_item_detail(p_item_id uuid) TO service_role;


--
-- Name: FUNCTION get_portfolio_quality_structure(p_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_portfolio_quality_structure(p_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_portfolio_quality_structure(p_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_portfolio_quality_structure(p_user_id uuid) TO service_role;


--
-- Name: FUNCTION get_portfolio_stats(p_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_portfolio_stats(p_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_portfolio_stats(p_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_portfolio_stats(p_user_id uuid) TO service_role;


--
-- Name: FUNCTION get_portfolio_treemap_data(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_portfolio_treemap_data() TO anon;
GRANT ALL ON FUNCTION public.get_portfolio_treemap_data() TO authenticated;
GRANT ALL ON FUNCTION public.get_portfolio_treemap_data() TO service_role;


--
-- Name: FUNCTION get_portfolio_value_chart(p_period text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_portfolio_value_chart(p_period text) TO anon;
GRANT ALL ON FUNCTION public.get_portfolio_value_chart(p_period text) TO authenticated;
GRANT ALL ON FUNCTION public.get_portfolio_value_chart(p_period text) TO service_role;


--
-- Name: FUNCTION get_profit_heatmap(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_profit_heatmap() TO anon;
GRANT ALL ON FUNCTION public.get_profit_heatmap() TO authenticated;
GRANT ALL ON FUNCTION public.get_profit_heatmap() TO service_role;


--
-- Name: FUNCTION get_public_portfolio(p_token text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_public_portfolio(p_token text) TO anon;
GRANT ALL ON FUNCTION public.get_public_portfolio(p_token text) TO authenticated;
GRANT ALL ON FUNCTION public.get_public_portfolio(p_token text) TO service_role;


--
-- Name: FUNCTION get_public_portfolio_history(p_token text, p_page integer, p_page_size integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_public_portfolio_history(p_token text, p_page integer, p_page_size integer) TO anon;
GRANT ALL ON FUNCTION public.get_public_portfolio_history(p_token text, p_page integer, p_page_size integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_public_portfolio_history(p_token text, p_page integer, p_page_size integer) TO service_role;


--
-- Name: FUNCTION get_sales_chart_data(target_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_sales_chart_data(target_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_sales_chart_data(target_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_sales_chart_data(target_user_id uuid) TO service_role;


--
-- Name: FUNCTION get_sales_pnl_chart(target_user_id uuid, period_text text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_sales_pnl_chart(target_user_id uuid, period_text text) TO anon;
GRANT ALL ON FUNCTION public.get_sales_pnl_chart(target_user_id uuid, period_text text) TO authenticated;
GRANT ALL ON FUNCTION public.get_sales_pnl_chart(target_user_id uuid, period_text text) TO service_role;


--
-- Name: FUNCTION get_stagnant_items(p_days_threshold integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_stagnant_items(p_days_threshold integer) TO anon;
GRANT ALL ON FUNCTION public.get_stagnant_items(p_days_threshold integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_stagnant_items(p_days_threshold integer) TO service_role;


--
-- Name: FUNCTION get_user_drop_history(p_user_id uuid, p_page integer, p_page_size integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_drop_history(p_user_id uuid, p_page integer, p_page_size integer) TO anon;
GRANT ALL ON FUNCTION public.get_user_drop_history(p_user_id uuid, p_page integer, p_page_size integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_user_drop_history(p_user_id uuid, p_page integer, p_page_size integer) TO service_role;


--
-- Name: FUNCTION get_user_drops_analytics(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_drops_analytics() TO anon;
GRANT ALL ON FUNCTION public.get_user_drops_analytics() TO authenticated;
GRANT ALL ON FUNCTION public.get_user_drops_analytics() TO service_role;


--
-- Name: FUNCTION get_user_drops_chart(target_user_id uuid, period_text text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_drops_chart(target_user_id uuid, period_text text) TO anon;
GRANT ALL ON FUNCTION public.get_user_drops_chart(target_user_id uuid, period_text text) TO authenticated;
GRANT ALL ON FUNCTION public.get_user_drops_chart(target_user_id uuid, period_text text) TO service_role;


--
-- Name: FUNCTION get_user_item_transactions(p_item_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_item_transactions(p_item_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_user_item_transactions(p_item_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_user_item_transactions(p_item_id uuid) TO service_role;


--
-- Name: FUNCTION get_user_luck_score(period_text text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_luck_score(period_text text) TO anon;
GRANT ALL ON FUNCTION public.get_user_luck_score(period_text text) TO authenticated;
GRANT ALL ON FUNCTION public.get_user_luck_score(period_text text) TO service_role;


--
-- Name: FUNCTION get_user_performance_chart(period_text text, p_only_investments boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_performance_chart(period_text text, p_only_investments boolean) TO anon;
GRANT ALL ON FUNCTION public.get_user_performance_chart(period_text text, p_only_investments boolean) TO authenticated;
GRANT ALL ON FUNCTION public.get_user_performance_chart(period_text text, p_only_investments boolean) TO service_role;


--
-- Name: FUNCTION get_user_portfolio_with_metrics(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_portfolio_with_metrics() TO anon;
GRANT ALL ON FUNCTION public.get_user_portfolio_with_metrics() TO authenticated;
GRANT ALL ON FUNCTION public.get_user_portfolio_with_metrics() TO service_role;


--
-- Name: FUNCTION get_user_profile(p_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_profile(p_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_user_profile(p_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_user_profile(p_user_id uuid) TO service_role;


--
-- Name: FUNCTION get_user_transaction_stats(p_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_transaction_stats(p_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_user_transaction_stats(p_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_user_transaction_stats(p_user_id uuid) TO service_role;


--
-- Name: FUNCTION gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal) TO service_role;


--
-- Name: FUNCTION gin_extract_value_trgm(text, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gin_extract_value_trgm(text, internal) TO postgres;
GRANT ALL ON FUNCTION public.gin_extract_value_trgm(text, internal) TO anon;
GRANT ALL ON FUNCTION public.gin_extract_value_trgm(text, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gin_extract_value_trgm(text, internal) TO service_role;


--
-- Name: FUNCTION gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal) TO service_role;


--
-- Name: FUNCTION gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_compress(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_compress(internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_compress(internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_compress(internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_compress(internal) TO service_role;


--
-- Name: FUNCTION gtrgm_consistent(internal, text, smallint, oid, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_consistent(internal, text, smallint, oid, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_consistent(internal, text, smallint, oid, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_consistent(internal, text, smallint, oid, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_consistent(internal, text, smallint, oid, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_decompress(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_decompress(internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_decompress(internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_decompress(internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_decompress(internal) TO service_role;


--
-- Name: FUNCTION gtrgm_distance(internal, text, smallint, oid, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_distance(internal, text, smallint, oid, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_distance(internal, text, smallint, oid, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_distance(internal, text, smallint, oid, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_distance(internal, text, smallint, oid, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_options(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_options(internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_options(internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_options(internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_options(internal) TO service_role;


--
-- Name: FUNCTION gtrgm_penalty(internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_penalty(internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_penalty(internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_penalty(internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_penalty(internal, internal, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_picksplit(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_picksplit(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_picksplit(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_picksplit(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_picksplit(internal, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_same(public.gtrgm, public.gtrgm, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_same(public.gtrgm, public.gtrgm, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_same(public.gtrgm, public.gtrgm, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_same(public.gtrgm, public.gtrgm, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_same(public.gtrgm, public.gtrgm, internal) TO service_role;


--
-- Name: FUNCTION gtrgm_union(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gtrgm_union(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.gtrgm_union(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.gtrgm_union(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.gtrgm_union(internal, internal) TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION handle_price_history_yearly(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_price_history_yearly() TO anon;
GRANT ALL ON FUNCTION public.handle_price_history_yearly() TO authenticated;
GRANT ALL ON FUNCTION public.handle_price_history_yearly() TO service_role;


--
-- Name: FUNCTION import_transactions_bulk(p_user_id uuid, p_transactions jsonb[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.import_transactions_bulk(p_user_id uuid, p_transactions jsonb[]) TO anon;
GRANT ALL ON FUNCTION public.import_transactions_bulk(p_user_id uuid, p_transactions jsonb[]) TO authenticated;
GRANT ALL ON FUNCTION public.import_transactions_bulk(p_user_id uuid, p_transactions jsonb[]) TO service_role;


--
-- Name: FUNCTION link_steam_account(p_steam_id_64 bigint, p_steam_username text, p_steam_avatar_url text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.link_steam_account(p_steam_id_64 bigint, p_steam_username text, p_steam_avatar_url text) TO anon;
GRANT ALL ON FUNCTION public.link_steam_account(p_steam_id_64 bigint, p_steam_username text, p_steam_avatar_url text) TO authenticated;
GRANT ALL ON FUNCTION public.link_steam_account(p_steam_id_64 bigint, p_steam_username text, p_steam_avatar_url text) TO service_role;


--
-- Name: FUNCTION move_transaction_batch(p_transaction_id uuid, p_target_collection_id uuid, p_quantity_to_move integer, p_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.move_transaction_batch(p_transaction_id uuid, p_target_collection_id uuid, p_quantity_to_move integer, p_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.move_transaction_batch(p_transaction_id uuid, p_target_collection_id uuid, p_quantity_to_move integer, p_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.move_transaction_batch(p_transaction_id uuid, p_target_collection_id uuid, p_quantity_to_move integer, p_user_id uuid) TO service_role;


--
-- Name: FUNCTION notify_all_users_about_weekly_drop(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.notify_all_users_about_weekly_drop() TO anon;
GRANT ALL ON FUNCTION public.notify_all_users_about_weekly_drop() TO authenticated;
GRANT ALL ON FUNCTION public.notify_all_users_about_weekly_drop() TO service_role;


--
-- Name: FUNCTION regenerate_portfolio_share_token(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.regenerate_portfolio_share_token() TO anon;
GRANT ALL ON FUNCTION public.regenerate_portfolio_share_token() TO authenticated;
GRANT ALL ON FUNCTION public.regenerate_portfolio_share_token() TO service_role;


--
-- Name: FUNCTION search_cs2_items(search_query text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.search_cs2_items(search_query text) TO anon;
GRANT ALL ON FUNCTION public.search_cs2_items(search_query text) TO authenticated;
GRANT ALL ON FUNCTION public.search_cs2_items(search_query text) TO service_role;


--
-- Name: FUNCTION search_drop_items(p_search_query text, p_limit integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.search_drop_items(p_search_query text, p_limit integer) TO anon;
GRANT ALL ON FUNCTION public.search_drop_items(p_search_query text, p_limit integer) TO authenticated;
GRANT ALL ON FUNCTION public.search_drop_items(p_search_query text, p_limit integer) TO service_role;


--
-- Name: FUNCTION sell_transactions_bulk(p_user_id uuid, p_transactions jsonb[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.sell_transactions_bulk(p_user_id uuid, p_transactions jsonb[]) TO anon;
GRANT ALL ON FUNCTION public.sell_transactions_bulk(p_user_id uuid, p_transactions jsonb[]) TO authenticated;
GRANT ALL ON FUNCTION public.sell_transactions_bulk(p_user_id uuid, p_transactions jsonb[]) TO service_role;


--
-- Name: FUNCTION set_blog_posts_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.set_blog_posts_updated_at() TO anon;
GRANT ALL ON FUNCTION public.set_blog_posts_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.set_blog_posts_updated_at() TO service_role;


--
-- Name: FUNCTION set_limit(real); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.set_limit(real) TO postgres;
GRANT ALL ON FUNCTION public.set_limit(real) TO anon;
GRANT ALL ON FUNCTION public.set_limit(real) TO authenticated;
GRANT ALL ON FUNCTION public.set_limit(real) TO service_role;


--
-- Name: FUNCTION set_main_steam_account(p_steam_id_64 bigint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.set_main_steam_account(p_steam_id_64 bigint) TO anon;
GRANT ALL ON FUNCTION public.set_main_steam_account(p_steam_id_64 bigint) TO authenticated;
GRANT ALL ON FUNCTION public.set_main_steam_account(p_steam_id_64 bigint) TO service_role;


--
-- Name: FUNCTION set_portfolio_shares_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.set_portfolio_shares_updated_at() TO anon;
GRANT ALL ON FUNCTION public.set_portfolio_shares_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.set_portfolio_shares_updated_at() TO service_role;


--
-- Name: FUNCTION show_limit(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.show_limit() TO postgres;
GRANT ALL ON FUNCTION public.show_limit() TO anon;
GRANT ALL ON FUNCTION public.show_limit() TO authenticated;
GRANT ALL ON FUNCTION public.show_limit() TO service_role;


--
-- Name: FUNCTION show_trgm(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.show_trgm(text) TO postgres;
GRANT ALL ON FUNCTION public.show_trgm(text) TO anon;
GRANT ALL ON FUNCTION public.show_trgm(text) TO authenticated;
GRANT ALL ON FUNCTION public.show_trgm(text) TO service_role;


--
-- Name: FUNCTION similarity(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.similarity(text, text) TO postgres;
GRANT ALL ON FUNCTION public.similarity(text, text) TO anon;
GRANT ALL ON FUNCTION public.similarity(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.similarity(text, text) TO service_role;


--
-- Name: FUNCTION similarity_dist(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.similarity_dist(text, text) TO postgres;
GRANT ALL ON FUNCTION public.similarity_dist(text, text) TO anon;
GRANT ALL ON FUNCTION public.similarity_dist(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.similarity_dist(text, text) TO service_role;


--
-- Name: FUNCTION similarity_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.similarity_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.similarity_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.similarity_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.similarity_op(text, text) TO service_role;


--
-- Name: FUNCTION strict_word_similarity(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strict_word_similarity(text, text) TO postgres;
GRANT ALL ON FUNCTION public.strict_word_similarity(text, text) TO anon;
GRANT ALL ON FUNCTION public.strict_word_similarity(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.strict_word_similarity(text, text) TO service_role;


--
-- Name: FUNCTION strict_word_similarity_commutator_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strict_word_similarity_commutator_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.strict_word_similarity_commutator_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.strict_word_similarity_commutator_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.strict_word_similarity_commutator_op(text, text) TO service_role;


--
-- Name: FUNCTION strict_word_similarity_dist_commutator_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strict_word_similarity_dist_commutator_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_commutator_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_commutator_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_commutator_op(text, text) TO service_role;


--
-- Name: FUNCTION strict_word_similarity_dist_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strict_word_similarity_dist_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.strict_word_similarity_dist_op(text, text) TO service_role;


--
-- Name: FUNCTION strict_word_similarity_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.strict_word_similarity_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.strict_word_similarity_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.strict_word_similarity_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.strict_word_similarity_op(text, text) TO service_role;


--
-- Name: FUNCTION take_daily_portfolio_snapshots(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.take_daily_portfolio_snapshots() TO anon;
GRANT ALL ON FUNCTION public.take_daily_portfolio_snapshots() TO authenticated;
GRANT ALL ON FUNCTION public.take_daily_portfolio_snapshots() TO service_role;


--
-- Name: FUNCTION unlink_steam_account(p_steam_id_64 bigint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.unlink_steam_account(p_steam_id_64 bigint) TO anon;
GRANT ALL ON FUNCTION public.unlink_steam_account(p_steam_id_64 bigint) TO authenticated;
GRANT ALL ON FUNCTION public.unlink_steam_account(p_steam_id_64 bigint) TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT SELECT ON TABLE public.profiles TO agent_inspector;


--
-- Name: FUNCTION update_own_profile(p_nickname text, p_steam_profile_url text, p_avatar text, p_notify_accept boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_own_profile(p_nickname text, p_steam_profile_url text, p_avatar text, p_notify_accept boolean) TO anon;
GRANT ALL ON FUNCTION public.update_own_profile(p_nickname text, p_steam_profile_url text, p_avatar text, p_notify_accept boolean) TO authenticated;
GRANT ALL ON FUNCTION public.update_own_profile(p_nickname text, p_steam_profile_url text, p_avatar text, p_notify_accept boolean) TO service_role;


--
-- Name: FUNCTION update_portfolio_share_visibility(p_show_summary boolean, p_show_chart boolean, p_show_categories boolean, p_show_items boolean, p_show_history boolean, p_show_collections boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_portfolio_share_visibility(p_show_summary boolean, p_show_chart boolean, p_show_categories boolean, p_show_items boolean, p_show_history boolean, p_show_collections boolean) TO anon;
GRANT ALL ON FUNCTION public.update_portfolio_share_visibility(p_show_summary boolean, p_show_chart boolean, p_show_categories boolean, p_show_items boolean, p_show_history boolean, p_show_collections boolean) TO authenticated;
GRANT ALL ON FUNCTION public.update_portfolio_share_visibility(p_show_summary boolean, p_show_chart boolean, p_show_categories boolean, p_show_items boolean, p_show_history boolean, p_show_collections boolean) TO service_role;


--
-- Name: FUNCTION wishlist_add_item(p_item_id uuid, p_target_buy_price numeric, p_priority public.wishlist_priority, p_note text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.wishlist_add_item(p_item_id uuid, p_target_buy_price numeric, p_priority public.wishlist_priority, p_note text) TO anon;
GRANT ALL ON FUNCTION public.wishlist_add_item(p_item_id uuid, p_target_buy_price numeric, p_priority public.wishlist_priority, p_note text) TO authenticated;
GRANT ALL ON FUNCTION public.wishlist_add_item(p_item_id uuid, p_target_buy_price numeric, p_priority public.wishlist_priority, p_note text) TO service_role;


--
-- Name: FUNCTION wishlist_get_or_create_default(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.wishlist_get_or_create_default() TO anon;
GRANT ALL ON FUNCTION public.wishlist_get_or_create_default() TO authenticated;
GRANT ALL ON FUNCTION public.wishlist_get_or_create_default() TO service_role;


--
-- Name: FUNCTION wishlist_list_items(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.wishlist_list_items() TO anon;
GRANT ALL ON FUNCTION public.wishlist_list_items() TO authenticated;
GRANT ALL ON FUNCTION public.wishlist_list_items() TO service_role;


--
-- Name: FUNCTION wishlist_remove_item(p_item_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.wishlist_remove_item(p_item_id uuid) TO anon;
GRANT ALL ON FUNCTION public.wishlist_remove_item(p_item_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.wishlist_remove_item(p_item_id uuid) TO service_role;


--
-- Name: FUNCTION wishlist_summary(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.wishlist_summary() TO anon;
GRANT ALL ON FUNCTION public.wishlist_summary() TO authenticated;
GRANT ALL ON FUNCTION public.wishlist_summary() TO service_role;


--
-- Name: FUNCTION wishlist_touch_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.wishlist_touch_updated_at() TO anon;
GRANT ALL ON FUNCTION public.wishlist_touch_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.wishlist_touch_updated_at() TO service_role;


--
-- Name: FUNCTION word_similarity(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.word_similarity(text, text) TO postgres;
GRANT ALL ON FUNCTION public.word_similarity(text, text) TO anon;
GRANT ALL ON FUNCTION public.word_similarity(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.word_similarity(text, text) TO service_role;


--
-- Name: FUNCTION word_similarity_commutator_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.word_similarity_commutator_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.word_similarity_commutator_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.word_similarity_commutator_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.word_similarity_commutator_op(text, text) TO service_role;


--
-- Name: FUNCTION word_similarity_dist_commutator_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.word_similarity_dist_commutator_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.word_similarity_dist_commutator_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.word_similarity_dist_commutator_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.word_similarity_dist_commutator_op(text, text) TO service_role;


--
-- Name: FUNCTION word_similarity_dist_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.word_similarity_dist_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.word_similarity_dist_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.word_similarity_dist_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.word_similarity_dist_op(text, text) TO service_role;


--
-- Name: FUNCTION word_similarity_op(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.word_similarity_op(text, text) TO postgres;
GRANT ALL ON FUNCTION public.word_similarity_op(text, text) TO anon;
GRANT ALL ON FUNCTION public.word_similarity_op(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.word_similarity_op(text, text) TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO service_role;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION send_binary(payload bytea, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION wal2json_escape_identifier(name text); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.wal2json_escape_identifier(name text) TO postgres;
GRANT ALL ON FUNCTION realtime.wal2json_escape_identifier(name text) TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE webauthn_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_challenges TO postgres;
GRANT ALL ON TABLE auth.webauthn_challenges TO dashboard_user;


--
-- Name: TABLE webauthn_credentials; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_credentials TO postgres;
GRANT ALL ON TABLE auth.webauthn_credentials TO dashboard_user;


--
-- Name: TABLE job; Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT SELECT ON TABLE cron.job TO postgres WITH GRANT OPTION;


--
-- Name: TABLE job_run_details; Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON TABLE cron.job_run_details TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE active_drop_pool; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.active_drop_pool TO anon;
GRANT ALL ON TABLE public.active_drop_pool TO authenticated;
GRANT ALL ON TABLE public.active_drop_pool TO service_role;
GRANT SELECT ON TABLE public.active_drop_pool TO agent_inspector;


--
-- Name: TABLE active_drop_pool_collections; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.active_drop_pool_collections TO anon;
GRANT ALL ON TABLE public.active_drop_pool_collections TO authenticated;
GRANT ALL ON TABLE public.active_drop_pool_collections TO service_role;
GRANT SELECT ON TABLE public.active_drop_pool_collections TO agent_inspector;


--
-- Name: SEQUENCE active_drop_pool_collections_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.active_drop_pool_collections_id_seq TO anon;
GRANT ALL ON SEQUENCE public.active_drop_pool_collections_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.active_drop_pool_collections_id_seq TO service_role;


--
-- Name: SEQUENCE active_drop_pool_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.active_drop_pool_id_seq TO anon;
GRANT ALL ON SEQUENCE public.active_drop_pool_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.active_drop_pool_id_seq TO service_role;


--
-- Name: TABLE app_settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.app_settings TO anon;
GRANT ALL ON TABLE public.app_settings TO authenticated;
GRANT ALL ON TABLE public.app_settings TO service_role;
GRANT SELECT ON TABLE public.app_settings TO agent_inspector;


--
-- Name: TABLE blog_posts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.blog_posts TO anon;
GRANT ALL ON TABLE public.blog_posts TO authenticated;
GRANT ALL ON TABLE public.blog_posts TO service_role;
GRANT SELECT ON TABLE public.blog_posts TO agent_inspector;


--
-- Name: TABLE collections; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.collections TO anon;
GRANT ALL ON TABLE public.collections TO authenticated;
GRANT ALL ON TABLE public.collections TO service_role;
GRANT SELECT ON TABLE public.collections TO agent_inspector;


--
-- Name: TABLE cs2_item_collections; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cs2_item_collections TO anon;
GRANT ALL ON TABLE public.cs2_item_collections TO authenticated;
GRANT ALL ON TABLE public.cs2_item_collections TO service_role;
GRANT SELECT ON TABLE public.cs2_item_collections TO agent_inspector;


--
-- Name: TABLE cs2_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cs2_items TO anon;
GRANT ALL ON TABLE public.cs2_items TO authenticated;
GRANT ALL ON TABLE public.cs2_items TO service_role;
GRANT SELECT ON TABLE public.cs2_items TO agent_inspector;


--
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notifications TO anon;
GRANT ALL ON TABLE public.notifications TO authenticated;
GRANT ALL ON TABLE public.notifications TO service_role;
GRANT SELECT ON TABLE public.notifications TO agent_inspector;


--
-- Name: TABLE portfolio_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.portfolio_items TO anon;
GRANT ALL ON TABLE public.portfolio_items TO authenticated;
GRANT ALL ON TABLE public.portfolio_items TO service_role;
GRANT SELECT ON TABLE public.portfolio_items TO agent_inspector;


--
-- Name: TABLE portfolio_snapshots; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.portfolio_snapshots TO anon;
GRANT ALL ON TABLE public.portfolio_snapshots TO authenticated;
GRANT ALL ON TABLE public.portfolio_snapshots TO service_role;
GRANT SELECT ON TABLE public.portfolio_snapshots TO agent_inspector;


--
-- Name: TABLE price_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.price_history TO anon;
GRANT ALL ON TABLE public.price_history TO authenticated;
GRANT ALL ON TABLE public.price_history TO service_role;
GRANT SELECT ON TABLE public.price_history TO agent_inspector;


--
-- Name: SEQUENCE price_history_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.price_history_id_seq TO anon;
GRANT ALL ON SEQUENCE public.price_history_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.price_history_id_seq TO service_role;


--
-- Name: TABLE steam_connections; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.steam_connections TO anon;
GRANT ALL ON TABLE public.steam_connections TO authenticated;
GRANT ALL ON TABLE public.steam_connections TO service_role;
GRANT SELECT ON TABLE public.steam_connections TO agent_inspector;


--
-- Name: TABLE steam_exchange_rates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.steam_exchange_rates TO anon;
GRANT ALL ON TABLE public.steam_exchange_rates TO authenticated;
GRANT ALL ON TABLE public.steam_exchange_rates TO service_role;
GRANT SELECT ON TABLE public.steam_exchange_rates TO agent_inspector;


--
-- Name: TABLE transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transactions TO anon;
GRANT ALL ON TABLE public.transactions TO authenticated;
GRANT ALL ON TABLE public.transactions TO service_role;
GRANT SELECT ON TABLE public.transactions TO agent_inspector;


--
-- Name: TABLE view_portfolio_performance; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.view_portfolio_performance TO anon;
GRANT ALL ON TABLE public.view_portfolio_performance TO authenticated;
GRANT ALL ON TABLE public.view_portfolio_performance TO service_role;
GRANT SELECT ON TABLE public.view_portfolio_performance TO agent_inspector;


--
-- Name: TABLE wishlist_alert_events; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.wishlist_alert_events TO anon;
GRANT ALL ON TABLE public.wishlist_alert_events TO authenticated;
GRANT ALL ON TABLE public.wishlist_alert_events TO service_role;
GRANT SELECT ON TABLE public.wishlist_alert_events TO agent_inspector;


--
-- Name: TABLE wishlist_alert_rules; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.wishlist_alert_rules TO anon;
GRANT ALL ON TABLE public.wishlist_alert_rules TO authenticated;
GRANT ALL ON TABLE public.wishlist_alert_rules TO service_role;
GRANT SELECT ON TABLE public.wishlist_alert_rules TO agent_inspector;


--
-- Name: TABLE wishlist_item_ladders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.wishlist_item_ladders TO anon;
GRANT ALL ON TABLE public.wishlist_item_ladders TO authenticated;
GRANT ALL ON TABLE public.wishlist_item_ladders TO service_role;
GRANT SELECT ON TABLE public.wishlist_item_ladders TO agent_inspector;


--
-- Name: TABLE wishlist_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.wishlist_items TO anon;
GRANT ALL ON TABLE public.wishlist_items TO authenticated;
GRANT ALL ON TABLE public.wishlist_items TO service_role;
GRANT SELECT ON TABLE public.wishlist_items TO agent_inspector;


--
-- Name: TABLE wishlists; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.wishlists TO anon;
GRANT ALL ON TABLE public.wishlists TO authenticated;
GRANT ALL ON TABLE public.wishlists TO service_role;
GRANT SELECT ON TABLE public.wishlists TO agent_inspector;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE messages_2026_07_21; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages_2026_07_21 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_07_21 TO dashboard_user;


--
-- Name: TABLE messages_2026_07_22; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages_2026_07_22 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_07_22 TO dashboard_user;


--
-- Name: TABLE messages_2026_07_23; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages_2026_07_23 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_07_23 TO dashboard_user;


--
-- Name: TABLE messages_2026_07_24; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages_2026_07_24 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_07_24 TO dashboard_user;


--
-- Name: TABLE messages_2026_07_25; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages_2026_07_25 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_07_25 TO dashboard_user;


--
-- Name: TABLE messages_2026_07_26; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages_2026_07_26 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_07_26 TO dashboard_user;


--
-- Name: TABLE messages_2026_07_27; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages_2026_07_27 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_07_27 TO dashboard_user;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT ON TABLES TO agent_inspector;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict s6ggUkL9rhhZdsRJtcPAf6nx2EffmlTJmxTsAqBz9b2LXyAy18S4HscXQ4h046W

