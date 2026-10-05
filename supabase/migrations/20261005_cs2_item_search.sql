-- =====================================================================
-- Wyszukiwanie itemów odporne na zapis, kolejność słów, skróty stanów i literówki.
-- Wersja poprawiona względem propozycji mobile:
--   1. nowa nazwa RPC: search_cs2_catalog (stare search_cs2_items zostaje nietknięte)
--   2. kotwica kandydatów pomija słowa stanów i częste słowa kategorii (wydajność)
--   3. tokeny z cyframi dopasowywane także w nazwie bez spacji (2014 katowice, 18 glock)
--   4. ranking uwzględnia popularność (volume_24h)
-- Addytywna: nie dodaje tabel ani kolumn, nie zmienia istniejących funkcji.
-- =====================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA extensions;

-- ---------------------------------------------------------------------
-- Normalizacja (używana też przez indeks: po każdej zmianie tej funkcji
-- trzeba zrobić REINDEX INDEX public.cs2_items_search_trgm_idx)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.normalize_item_search(p_text text)
RETURNS text LANGUAGE plpgsql IMMUTABLE PARALLEL SAFE
SET search_path = pg_catalog
AS $$
DECLARE v text;
BEGIN
  v := lower(coalesce(p_text, ''));
  -- Zapis broni: AK-47 / ak 47, M4 A1-S / m4a1s, USP-S / usps
  v := regexp_replace(v, '([a-z])[ -]+([0-9])', '\1\2', 'g');
  v := regexp_replace(v, '\mm4[ -]+a1', 'm4a1', 'g');
  v := regexp_replace(v, '\m(m4a1|usp)[ -]*s\M', '\1s', 'g');
  v := regexp_replace(v, '[^a-z0-9]+', ' ', 'g');
  v := trim(v);
  -- Skróty stanów tylko na granicach słów
  v := regexp_replace(v, '\mfn\M', 'factory new', 'g');
  v := regexp_replace(v, '\mmw\M', 'minimal wear', 'g');
  v := regexp_replace(v, '\mft\M', 'field tested', 'g');
  v := regexp_replace(v, '\mww\M', 'well worn', 'g');
  v := regexp_replace(v, '\mbs\M', 'battle scarred', 'g');
  v := regexp_replace(v, '\mstat trak\M', 'stattrak', 'g');
  RETURN v;
END;
$$;

DO $migration$
DECLARE trgm_schema text; fuzzy_schema text;
BEGIN
  -- Używamy schematów, w których rozszerzenia faktycznie są (pg_trgm jest dziś w public)
  SELECT n.nspname INTO trgm_schema FROM pg_extension e
    JOIN pg_namespace n ON n.oid = e.extnamespace WHERE e.extname = 'pg_trgm';
  SELECT n.nspname INTO fuzzy_schema FROM pg_extension e
    JOIN pg_namespace n ON n.oid = e.extnamespace WHERE e.extname = 'fuzzystrmatch';

  EXECUTE format('GRANT USAGE ON SCHEMA %I TO anon, authenticated, service_role', trgm_schema);
  EXECUTE format('GRANT USAGE ON SCHEMA %I TO anon, authenticated, service_role', fuzzy_schema);

  -- -------------------------------------------------------------------
  -- Ocena dopasowania jednego tokenu do znormalizowanej nazwy
  -- -------------------------------------------------------------------
  EXECUTE format($ddl$
    CREATE OR REPLACE FUNCTION public.item_search_token_score(p_token text, p_name text)
    RETURNS integer LANGUAGE plpgsql IMMUTABLE PARALLEL SAFE
    SET search_path = pg_catalog
    AS $body$
    DECLARE w text; best integer := 0; distance integer; budget integer;
    BEGIN
      budget := CASE WHEN length(p_token) >= 6 THEN 2 ELSE 1 END;

      -- Tokeny z cyframi: dopasowanie w nazwie bez spacji
      -- (np. "2014" w "katowice2014", "glock18" w "glock 18")
      IF length(p_token) >= 2 AND p_token ~ '[0-9]'
         AND position(p_token IN replace(p_name, ' ', '')) > 0 THEN
        best := 80;
      END IF;

      FOREACH w IN ARRAY string_to_array(p_name, ' ') LOOP
        IF w = p_token THEN RETURN 100; END IF;
        IF length(p_token) >= 2 AND starts_with(w, p_token) THEN
          best := greatest(best, 85);
        -- Stany, wersje, krótkie słowa i nazwy z cyframi bez literówek
        ELSIF length(p_token) >= 4 AND p_token !~ '[0-9]'
          AND p_token <> ALL(ARRAY['factory','new','minimal','wear','field','tested',
            'well','worn','battle','scarred','stattrak','souvenir'])
          AND length(w) <= 255 AND abs(length(w) - length(p_token)) <= budget THEN
          distance := %1$I.levenshtein_less_equal(p_token, w, budget);
          IF distance <= budget THEN best := greatest(best, 60 - 5 * distance); END IF;
        END IF;
      END LOOP;
      RETURN best;
    END;
    $body$;
  $ddl$, fuzzy_schema);

  -- -------------------------------------------------------------------
  -- Indeks trigramowy na znormalizowanej nazwie
  -- -------------------------------------------------------------------
  EXECUTE format('CREATE INDEX IF NOT EXISTS cs2_items_search_trgm_idx
    ON public.cs2_items USING gin
    (public.normalize_item_search(market_hash_name) %I.gin_trgm_ops)', trgm_schema);

  -- -------------------------------------------------------------------
  -- RPC: search_cs2_catalog
  -- -------------------------------------------------------------------
  EXECUTE format($ddl$
    CREATE OR REPLACE FUNCTION public.search_cs2_catalog(
      p_search_query text, p_limit integer DEFAULT 25
    )
    RETURNS TABLE(id text, market_hash_name text, price numeric, icon_url text, type text)
    LANGUAGE plpgsql STABLE SECURITY INVOKER
    SET search_path = pg_catalog
    SET pg_trgm.word_similarity_threshold = '0.25'
    AS $body$
    DECLARE q text; tokens text[]; anchor text;
    BEGIN
      IF p_search_query IS NULL OR length(p_search_query) > 160 THEN RETURN; END IF;
      q := public.normalize_item_search(p_search_query);
      IF length(q) < 2 THEN RETURN; END IF;
      tokens := string_to_array(q, ' ');
      IF cardinality(tokens) > 12 OR EXISTS (
        SELECT 1 FROM unnest(tokens) t WHERE length(t) > 64
      ) THEN RETURN; END IF;

      -- Kotwica = najdłuższy token, ale słowa stanów i częste słowa kategorii
      -- tylko wtedy, gdy nie ma nic innego (inaczej tysiące kandydatów)
      SELECT t INTO anchor FROM unnest(tokens) t
      ORDER BY (t = ANY(ARRAY['factory','new','minimal','wear','field','tested',
                              'well','worn','battle','scarred','stattrak','souvenir',
                              'sticker','case','capsule','package','sealed','graffiti',
                              'patch','charm','holo','foil','gold','glitter'])),
               length(t) DESC, t
      LIMIT 1;

      RETURN QUERY
      WITH candidates AS (
        SELECT i.*, public.normalize_item_search(i.market_hash_name) AS search_name
        FROM public.cs2_items i
        WHERE public.normalize_item_search(i.market_hash_name) LIKE '%%' || anchor || '%%'
          OR public.normalize_item_search(i.market_hash_name) OPERATOR(%1$I.%%>) anchor
      ), ranked AS (
        SELECT c.*, scores.min_score, scores.total_score
        FROM candidates c
        CROSS JOIN LATERAL (
          SELECT min(public.item_search_token_score(t, c.search_name)) AS min_score,
                 sum(public.item_search_token_score(t, c.search_name)) AS total_score
          FROM unnest(tokens) t
        ) scores
        WHERE scores.min_score > 0
      )
      SELECT r.id::text, r.market_hash_name::text, r.price::numeric,
             r.icon_url::text, r.type::text
      FROM ranked r
      ORDER BY (r.search_name = q) DESC,
               -- Bez "stattrak"/"souvenir" w zapytaniu zwykłe warianty mają pierwszeństwo
               ((r.search_name ~ '\mstattrak\M') AND NOT ('stattrak' = ANY(tokens))) ASC,
               ((r.search_name ~ '\msouvenir\M') AND NOT ('souvenir' = ANY(tokens))) ASC,
               r.min_score DESC,
               r.total_score DESC,
               r.volume_24h DESC NULLS LAST,
               r.market_hash_name,
               r.id
      LIMIT greatest(1, least(coalesce(p_limit, 25), 50));
    END;
    $body$;
  $ddl$, trgm_schema);
END;
$migration$;

-- Invoker: obowiązują uprawnienia SELECT i RLS tabeli cs2_items
REVOKE ALL ON FUNCTION public.normalize_item_search(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.item_search_token_score(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.search_cs2_catalog(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.normalize_item_search(text),
  public.item_search_token_score(text, text),
  public.search_cs2_catalog(text, integer)
  TO anon, authenticated, service_role;

ANALYZE public.cs2_items;
NOTIFY pgrst, 'reload schema';

COMMIT;
