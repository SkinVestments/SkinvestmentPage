import { useEffect, useRef, useState } from 'react';
import {
  searchCs2Catalog,
  type Cs2CatalogSearchItem,
} from '@/utils/cs2CatalogSearch';

const DEBOUNCE_MS = 250;
const MIN_QUERY_LEN = 2;

export interface UseCs2CatalogSearchOptions {
  /** When false, clears results and skips requests. Default true. */
  enabled?: boolean;
  /** Passed to search_cs2_catalog (capped at 50). Default 25. */
  limit?: number;
}

export interface UseCs2CatalogSearchResult {
  results: Cs2CatalogSearchItem[];
  isSearching: boolean;
  error: string | null;
  /** Trimmed query currently driving search. */
  trimmedQuery: string;
  /** True when trimmed query is long enough to search. */
  canSearch: boolean;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = String((err as { message?: string }).message);
    if (msg) return msg;
  }
  return fallback;
}

/**
 * Debounced free-text catalog search via search_cs2_catalog.
 * Skips under 2 chars after trim; ignores out-of-order responses.
 */
export function useCs2CatalogSearch(
  query: string,
  options: UseCs2CatalogSearchOptions = {},
): UseCs2CatalogSearchResult {
  const { enabled = true, limit = 25 } = options;
  const trimmedQuery = query.trim();
  const canSearch = enabled && trimmedQuery.length >= MIN_QUERY_LEN;

  const [results, setResults] = useState<Cs2CatalogSearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      requestIdRef.current += 1;
      setResults([]);
      setError(null);
      setIsSearching(false);
      return;
    }

    if (trimmedQuery.length < MIN_QUERY_LEN) {
      requestIdRef.current += 1;
      setResults([]);
      setError(null);
      setIsSearching(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsSearching(true);
    setError(null);

    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const rows = await searchCs2Catalog(trimmedQuery, limit);
          if (requestId !== requestIdRef.current) return;
          setResults(rows);
          setError(null);
        } catch (err) {
          if (requestId !== requestIdRef.current) return;
          setResults([]);
          setError(getErrorMessage(err, 'Search failed. Try again.'));
        } finally {
          if (requestId === requestIdRef.current) {
            setIsSearching(false);
          }
        }
      })();
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [trimmedQuery, enabled, limit]);

  return { results, isSearching, error, trimmedQuery, canSearch };
}
