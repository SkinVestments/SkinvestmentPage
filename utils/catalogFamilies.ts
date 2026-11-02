import { supabase } from '@/utils/supabaseClient';
import { categoryLabel } from '@/utils/itemDisplayName';

export type CatalogFamilySort = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc';
export type CatalogWeaponGroup = 'rifles' | 'pistols' | 'smgs' | 'heavy';

export interface CatalogFamily {
  family_key: string;
  item_id: string;
  market_hash_name: string;
  display_name: string;
  category: string;
  weapon: string | null;
  icon_url: string | null;
  rarity: string | null;
  collection_name: string | null;
  price: number | null;
  variant_count: number;
}

export interface CatalogFamiliesResult {
  items: CatalogFamily[];
  total_count: number;
  computed_at: string | null;
}

export interface CatalogBrowseFacets {
  groups: Array<{ id: string; label: string; icon_url: string | null }>;
  weapons: string[];
  rarities: string[];
}

export interface CatalogCollectionOption {
  id: string;
  name: string;
  items_count: number | null;
  icon_url: string | null;
}

export interface CatalogFamiliesQuery {
  search: string | null;
  category: string | null;
  weaponGroup: CatalogWeaponGroup | null;
  weapon: string | null;
  collectionId: string | null;
  rarity: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  sort: CatalogFamilySort;
  limit: number;
  offset: number;
}

const FAMILIES_TTL_MS = 10 * 60 * 1000;
const FACETS_TTL_MS = 24 * 60 * 60 * 1000;

type CacheEntry<T> = { value: T; fetchedAt: number };
const familiesCache = new Map<string, CacheEntry<CatalogFamiliesResult>>();
const familiesInflight = new Map<string, Promise<CatalogFamiliesResult>>();
let facetsCache: CacheEntry<CatalogBrowseFacets> | null = null;
let facetsInflight: Promise<CatalogBrowseFacets> | null = null;
let collectionsCache: CacheEntry<CatalogCollectionOption[]> | null = null;
let categoriesCache: CacheEntry<string[]> | null = null;

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

export function validatePriceRange(
  minPrice: number | null,
  maxPrice: number | null,
): { ok: true } | { ok: false; message: string } {
  if (minPrice != null && (minPrice < 0 || !Number.isFinite(minPrice))) {
    return { ok: false, message: 'Min price must be 0 or greater.' };
  }
  if (maxPrice != null && (maxPrice < 0 || !Number.isFinite(maxPrice))) {
    return { ok: false, message: 'Max price must be 0 or greater.' };
  }
  if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
    return { ok: false, message: 'Min price cannot be greater than max price.' };
  }
  return { ok: true };
}

export function familiesCacheKey(q: CatalogFamiliesQuery): string {
  return JSON.stringify({
    s: q.search,
    c: q.category,
    g: q.weaponGroup,
    w: q.weapon,
    col: q.collectionId,
    r: q.rarity,
    min: q.minPrice,
    max: q.maxPrice,
    sort: q.sort,
    limit: q.limit,
    offset: q.offset,
  });
}

function mapFamily(row: Record<string, unknown>): CatalogFamily | null {
  const family_key = String(row.family_key ?? '').trim();
  const item_id = String(row.item_id ?? '').trim();
  const display_name = String(row.display_name ?? row.market_hash_name ?? '').trim();
  if (!family_key || !item_id || !display_name) return null;
  const variant_count = Math.max(1, Math.trunc(numOrNull(row.variant_count) ?? 1));
  return {
    family_key,
    item_id,
    market_hash_name: String(row.market_hash_name ?? display_name).trim(),
    display_name,
    category: String(row.category ?? 'other'),
    weapon: row.weapon == null || row.weapon === '' ? null : String(row.weapon),
    icon_url: resolveIconUrl(
      row.icon_url == null || row.icon_url === '' ? null : String(row.icon_url),
    ),
    rarity: row.rarity == null || row.rarity === '' ? null : String(row.rarity),
    collection_name:
      row.collection_name == null || row.collection_name === ''
        ? null
        : String(row.collection_name).trim(),
    price: numOrNull(row.price),
    variant_count,
  };
}

export async function fetchCatalogFamilies(
  query: CatalogFamiliesQuery,
): Promise<CatalogFamiliesResult> {
  const priceCheck = validatePriceRange(query.minPrice, query.maxPrice);
  if (priceCheck.ok === false) throw new Error(priceCheck.message);

  const limit = Math.max(1, Math.min(Math.trunc(query.limit) || 24, 50));
  const offset = Math.max(0, Math.trunc(query.offset) || 0);
  const normalized: CatalogFamiliesQuery = { ...query, limit, offset };
  const key = familiesCacheKey(normalized);

  const hit = familiesCache.get(key);
  if (hit && Date.now() - hit.fetchedAt < FAMILIES_TTL_MS) return hit.value;

  const pending = familiesInflight.get(key);
  if (pending) return pending;

  const promise = (async () => {
    const { data, error } = await supabase.rpc('catalog_search_families', {
      p_search: normalized.search,
      p_category: normalized.category,
      p_weapon_group: normalized.weaponGroup,
      p_weapon: normalized.weapon,
      p_collection_id: normalized.collectionId,
      p_rarity: normalized.rarity,
      p_min_price: normalized.minPrice,
      p_max_price: normalized.maxPrice,
      p_sort: normalized.sort,
      p_limit: normalized.limit,
      p_offset: normalized.offset,
    });

    if (error) throw error;

    const raw = (data ?? {}) as Record<string, unknown>;
    const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
    const items = itemsRaw
      .map((row) => mapFamily(row as Record<string, unknown>))
      .filter((r): r is CatalogFamily => r != null);

    const result: CatalogFamiliesResult = {
      items,
      total_count: Math.max(0, Math.trunc(numOrNull(raw.total_count) ?? items.length)),
      computed_at:
        raw.computed_at == null || raw.computed_at === '' ? null : String(raw.computed_at),
    };

    familiesCache.set(key, { value: result, fetchedAt: Date.now() });
    return result;
  })();

  familiesInflight.set(key, promise);
  try {
    return await promise;
  } finally {
    familiesInflight.delete(key);
  }
}

export async function fetchCatalogBrowseFacets(): Promise<CatalogBrowseFacets> {
  if (facetsCache && Date.now() - facetsCache.fetchedAt < FACETS_TTL_MS) {
    return facetsCache.value;
  }
  if (facetsInflight) return facetsInflight;

  facetsInflight = (async () => {
    const { data, error } = await supabase.rpc('catalog_get_browse_facets');
    if (error) throw error;
    const raw = (data ?? {}) as Record<string, unknown>;
    const groupsRaw = Array.isArray(raw.groups) ? raw.groups : [];
    const groups = groupsRaw
      .map((g) => {
        const row = g as Record<string, unknown>;
        const id = String(row.id ?? '').trim();
        const label = String(row.label ?? id).trim();
        if (!id) return null;
        return {
          id,
          label,
          icon_url: resolveIconUrl(
            row.icon_url == null || row.icon_url === '' ? null : String(row.icon_url),
          ),
        };
      })
      .filter((g): g is NonNullable<typeof g> => g != null);

    const weapons = (Array.isArray(raw.weapons) ? raw.weapons : [])
      .map((w) => String(w).trim())
      .filter(Boolean);
    const rarities = (Array.isArray(raw.rarities) ? raw.rarities : [])
      .map((r) => String(r).trim())
      .filter(Boolean);

    const value: CatalogBrowseFacets = { groups, weapons, rarities };
    facetsCache = { value, fetchedAt: Date.now() };
    return value;
  })();

  try {
    return await facetsInflight;
  } finally {
    facetsInflight = null;
  }
}

export async function fetchCatalogCollections(): Promise<CatalogCollectionOption[]> {
  if (collectionsCache && Date.now() - collectionsCache.fetchedAt < FACETS_TTL_MS) {
    return collectionsCache.value;
  }

  const { data, error } = await supabase.rpc('catalog_get_collections');
  if (error) throw error;

  const rows = ((data as Array<Record<string, unknown>> | null) ?? [])
    .map((row) => {
      const id = String(row.id ?? '').trim();
      const name = String(row.name ?? '').trim();
      if (!id || !name) return null;
      return {
        id,
        name,
        items_count: numOrNull(row.items_count),
        icon_url: resolveIconUrl(
          row.icon_url == null || row.icon_url === '' ? null : String(row.icon_url),
        ),
      };
    })
    .filter((r): r is CatalogCollectionOption => r != null)
    .sort((a, b) => a.name.localeCompare(b.name));

  collectionsCache = { value: rows, fetchedAt: Date.now() };
  return rows;
}

export async function fetchCatalogCategories(): Promise<string[]> {
  if (categoriesCache && Date.now() - categoriesCache.fetchedAt < FACETS_TTL_MS) {
    return categoriesCache.value;
  }

  const { data, error } = await supabase.rpc('get_catalog_categories');
  if (error) throw error;

  let list: string[] = [];
  if (Array.isArray(data)) {
    list = data
      .map((row) => {
        if (typeof row === 'string') return row.trim();
        if (row && typeof row === 'object') {
          const r = row as Record<string, unknown>;
          return String(r.category ?? r.id ?? r.name ?? '').trim();
        }
        return '';
      })
      .filter(Boolean);
  }

  categoriesCache = { value: list, fetchedAt: Date.now() };
  return list;
}

/** Title/subtitle for a family card (Steam-market style). */
export function splitFamilyDisplayName(
  displayName: string,
  weapon: string | null,
  category: string | null,
): { title: string; subtitle: string } {
  const name = String(displayName ?? '').trim();
  if (!name) return { title: 'Untitled item', subtitle: categoryLabel(category) };

  // Vanilla knives: display_name === weapon
  if (weapon && name === weapon) {
    return { title: name, subtitle: categoryLabel(category) };
  }

  if (weapon && name.startsWith(`${weapon} | `)) {
    return { title: name.slice(weapon.length + 3).trim() || name, subtitle: weapon };
  }

  const pipe = name.indexOf(' | ');
  if (pipe !== -1 && weapon) {
    return {
      title: name.slice(pipe + 3).trim() || name,
      subtitle: weapon,
    };
  }

  if (!weapon) {
    return { title: name, subtitle: categoryLabel(category) };
  }

  return { title: name, subtitle: weapon };
}

export function countActiveFamilyFilters(q: Omit<CatalogFamiliesQuery, 'limit' | 'offset' | 'sort'>): number {
  let n = 0;
  if (q.search) n += 1;
  if (q.category) n += 1;
  if (q.weaponGroup) n += 1;
  if (q.weapon) n += 1;
  if (q.collectionId) n += 1;
  if (q.rarity) n += 1;
  if (q.minPrice != null) n += 1;
  if (q.maxPrice != null) n += 1;
  return n;
}
