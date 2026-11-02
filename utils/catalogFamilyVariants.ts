import { supabase } from '@/utils/supabaseClient';
import { WEAR_MAP, exteriorShortLabel } from '@/utils/itemDisplayName';

export type CatalogVariantEdition = 'standard' | 'stattrak' | 'souvenir';

export interface CatalogFamilyVariant {
  item_id: string;
  market_hash_name: string;
  exterior: string | null;
  edition: CatalogVariantEdition;
  price: number | null;
  icon_url: string | null;
  is_current: boolean;
}

const CACHE_TTL_MS = 10 * 60 * 1000;

type CacheEntry = { rows: CatalogFamilyVariant[]; fetchedAt: number };
const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<CatalogFamilyVariant[] | null>>();

const EDITION_ORDER: CatalogVariantEdition[] = ['standard', 'stattrak', 'souvenir'];

function numOrNull(raw: unknown): number | null {
  if (raw == null || raw === '') return null;
  const n = typeof raw === 'number' ? raw : Number(String(raw).replace(/[^0-9.\-]+/g, ''));
  return Number.isFinite(n) ? n : null;
}

function resolveIconUrl(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  if (/^https:\/\//i.test(trimmed)) return trimmed;
  if (/^http:\/\//i.test(trimmed)) return null;
  if (/^[A-Za-z0-9_\-/]+$/.test(trimmed) && trimmed.length > 8) {
    return `https://community.cloudflare.steamstatic.com/economy/image/${trimmed}`;
  }
  return trimmed;
}

function parseEdition(raw: unknown): CatalogVariantEdition {
  const v = String(raw ?? '')
    .trim()
    .toLowerCase();
  if (v === 'stattrak' || v === 'stat_trak' || v === 'stat trak') return 'stattrak';
  if (v === 'souvenir') return 'souvenir';
  return 'standard';
}

function mapRow(row: Record<string, unknown>): CatalogFamilyVariant | null {
  const item_id = String(row.item_id ?? '').trim();
  const market_hash_name = String(row.market_hash_name ?? '').trim();
  if (!item_id || !market_hash_name) return null;
  const exteriorRaw =
    row.exterior == null || row.exterior === '' ? null : String(row.exterior).trim();
  return {
    item_id,
    market_hash_name,
    exterior: exteriorRaw,
    edition: parseEdition(row.edition),
    price: numOrNull(row.price),
    icon_url: resolveIconUrl(
      row.icon_url == null || row.icon_url === '' ? null : String(row.icon_url),
    ),
    is_current: Boolean(row.is_current),
  };
}

function storeFamilyCache(rows: CatalogFamilyVariant[]): void {
  const entry: CacheEntry = { rows, fetchedAt: Date.now() };
  for (const row of rows) {
    cache.set(row.item_id, entry);
  }
}

export async function fetchCatalogFamilyVariants(
  itemId: string,
): Promise<CatalogFamilyVariant[] | null> {
  const id = String(itemId ?? '').trim();
  if (!id) return null;

  const withCurrent = (rows: CatalogFamilyVariant[]): CatalogFamilyVariant[] =>
    rows.map((r) => ({ ...r, is_current: r.item_id === id }));

  const hit = cache.get(id);
  if (hit && Date.now() - hit.fetchedAt < CACHE_TTL_MS) {
    return withCurrent(hit.rows);
  }

  const pending = inflight.get(id);
  if (pending) {
    const rows = await pending;
    return rows ? withCurrent(rows) : null;
  }

  const promise = (async (): Promise<CatalogFamilyVariant[] | null> => {
    try {
      const { data, error } = await supabase.rpc('catalog_get_family_variants', {
        p_item_id: id,
      });
      if (error) return null;

      const rows = ((data as Record<string, unknown>[] | null) ?? [])
        .map(mapRow)
        .filter((r): r is CatalogFamilyVariant => r != null);

      if (rows.length === 0) return null;

      // Cache the family under every returned item_id (is_current remapped per lookup).
      storeFamilyCache(rows);
      if (!cache.has(id)) {
        cache.set(id, { rows, fetchedAt: Date.now() });
      }
      return rows;
    } catch {
      return null;
    }
  })();

  inflight.set(id, promise);
  try {
    const rows = await promise;
    return rows ? withCurrent(rows) : null;
  } finally {
    inflight.delete(id);
  }
}

export function editionsPresent(rows: CatalogFamilyVariant[]): CatalogVariantEdition[] {
  const set = new Set(rows.map((r) => r.edition));
  return EDITION_ORDER.filter((e) => set.has(e));
}

export function wearsForEdition(
  rows: CatalogFamilyVariant[],
  edition: CatalogVariantEdition,
): CatalogFamilyVariant[] {
  const subset = rows.filter((r) => r.edition === edition);
  const order = new Map(WEAR_MAP.map((w, i) => [w.short, i]));
  return [...subset].sort((a, b) => {
    const as = exteriorShortLabel(a.exterior);
    const bs = exteriorShortLabel(b.exterior);
    const ai = as != null ? (order.get(as) ?? 99) : 99;
    const bi = bs != null ? (order.get(bs) ?? 99) : 99;
    if (ai !== bi) return ai - bi;
    return a.market_hash_name.localeCompare(b.market_hash_name);
  });
}

/** Cheapest priced variant; null prices sort last. */
export function cheapestVariant(rows: CatalogFamilyVariant[]): CatalogFamilyVariant | null {
  if (rows.length === 0) return null;
  return [...rows].sort((a, b) => {
    if (a.price == null && b.price == null) return 0;
    if (a.price == null) return 1;
    if (b.price == null) return -1;
    return a.price - b.price;
  })[0];
}

/**
 * Pick target variant when switching edition: same wear if available, else cheapest.
 */
export function pickVariantForEdition(
  rows: CatalogFamilyVariant[],
  edition: CatalogVariantEdition,
  preferredExterior: string | null,
): CatalogFamilyVariant | null {
  const subset = wearsForEdition(rows, edition);
  if (subset.length === 0) return null;
  if (preferredExterior) {
    const preferredShort = exteriorShortLabel(preferredExterior);
    const match = subset.find((r) => {
      if (r.exterior === preferredExterior) return true;
      const short = exteriorShortLabel(r.exterior);
      return preferredShort != null && short === preferredShort;
    });
    if (match) return match;
  }
  return cheapestVariant(subset);
}

export function editionLabel(edition: CatalogVariantEdition): string {
  if (edition === 'stattrak') return 'StatTrak™';
  if (edition === 'souvenir') return 'Souvenir';
  return 'Standard';
}

/** True when every variant has null exterior (vanilla knives, stickers, etc.). */
export function isVanillaFamily(rows: CatalogFamilyVariant[]): boolean {
  return rows.length > 0 && rows.every((r) => r.exterior == null || r.exterior === '');
}
