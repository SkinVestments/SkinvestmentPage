import { supabase } from '@/utils/supabaseClient';

/** Raw row from search_cs2_catalog RPC. */
export interface Cs2CatalogSearchRow {
  id: string;
  market_hash_name: string;
  price: number | string | null;
  icon_url: string | null;
  type: string | null;
}

/** Normalized catalog hit used by free-text item pickers. */
export interface Cs2CatalogSearchItem {
  id: string;
  market_hash_name: string;
  /** Alias of market_hash_name */
  name: string;
  icon_url: string | null;
  /** Alias of icon_url */
  image: string | null;
  price: number;
  type: string | null;
  /** Alias of type */
  category: string | null;
}

export function mapCs2CatalogRow(row: Cs2CatalogSearchRow | Record<string, unknown>): Cs2CatalogSearchItem {
  const market_hash_name = String(row.market_hash_name ?? '');
  const icon_url =
    row.icon_url == null || row.icon_url === '' ? null : String(row.icon_url);
  const type = row.type == null || row.type === '' ? null : String(row.type);
  const price = Number(row.price ?? 0);

  return {
    id: String(row.id ?? ''),
    market_hash_name,
    name: market_hash_name,
    icon_url,
    image: icon_url,
    price: Number.isFinite(price) ? price : 0,
    type,
    category: type,
  };
}

/**
 * Free-text CS2 catalog search via search_cs2_catalog.
 * Caller should trim and skip queries shorter than 2 characters.
 * Result order is preserved from the RPC (do not re-sort).
 */
export async function searchCs2Catalog(
  query: string,
  limit = 25,
): Promise<Cs2CatalogSearchItem[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const capped = Math.max(1, Math.min(Math.trunc(limit) || 25, 50));
  const { data, error } = await supabase.rpc('search_cs2_catalog', {
    p_search_query: trimmed,
    p_limit: capped,
  });

  if (error) throw error;

  const rows = (data as Cs2CatalogSearchRow[] | null) ?? [];
  return rows.map((row) => mapCs2CatalogRow(row)).filter((item) => Boolean(item.id));
}
