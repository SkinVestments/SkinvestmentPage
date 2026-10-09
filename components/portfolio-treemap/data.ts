import { supabase } from '@/utils/supabaseClient';
import {
  categoryOrderIndex,
  displayNameForItem,
  makeItemKey,
  mapCategoryGroup,
  shadeItemFill,
  TREEMAP_CATEGORY_COLORS,
  type TreemapCategory,
  type TreemapCategoryGroup,
  type TreemapItem,
  type TreemapPortfolio,
} from './model';

export type TreemapRpcRow = {
  category: string;
  item_name: string;
  total_value: number | string;
};

export type TreemapDataResult =
  | { status: 'ok'; portfolio: TreemapPortfolio }
  | { status: 'empty' }
  | { status: 'contract_error'; message: string };

type CacheEntry = {
  userId: string;
  portfolio: TreemapPortfolio;
  fetchedAt: number;
};

let memoryCache: CacheEntry | null = null;
const iconCache = new Map<string, string | null>();

function parseValue(raw: unknown): number | null {
  if (raw == null || raw === '') return null;
  const n = typeof raw === 'number' ? raw : Number(String(raw).trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function resolveSteamIconUrl(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  if (/^https:\/\//i.test(trimmed)) return trimmed;
  if (/^http:\/\//i.test(trimmed)) return null;
  // Steam economy image token
  if (/^[A-Za-z0-9_\-/]+$/.test(trimmed) && trimmed.length > 8) {
    return `https://community.cloudflare.steamstatic.com/economy/image/${trimmed}`;
  }
  return null;
}

/** Normalize RPC payload into a stable portfolio model (no icons yet). */
export function normalizeTreemapRpc(data: unknown): TreemapDataResult {
  if (data == null) return { status: 'empty' };
  if (!Array.isArray(data)) {
    return { status: 'contract_error', message: 'Unexpected portfolio map response.' };
  }
  if (data.length === 0) return { status: 'empty' };

  const merged = new Map<string, { rawCategory: string; fullName: string; value: number }>();

  for (const row of data) {
    if (!row || typeof row !== 'object') {
      return { status: 'contract_error', message: 'Unexpected portfolio map row.' };
    }
    const r = row as Record<string, unknown>;
    if (!('item_name' in r) || !('total_value' in r || 'category' in r)) {
      return { status: 'contract_error', message: 'Unexpected portfolio map contract.' };
    }

    const rawCategory = String(r.category ?? '').trim();
    const fullName = String(r.item_name ?? '').trim();
    const value = parseValue(r.total_value);
    if (value == null) continue;

    const key = makeItemKey(rawCategory, fullName);
    const prev = merged.get(key);
    if (prev) prev.value += value;
    else merged.set(key, { rawCategory, fullName, value });
  }

  if (merged.size === 0) return { status: 'empty' };

  const byCategory = new Map<
    TreemapCategoryGroup,
    Array<{ rawCategory: string; fullName: string; value: number }>
  >();

  for (const entry of merged.values()) {
    const group = mapCategoryGroup(entry.rawCategory || entry.fullName);
    const list = byCategory.get(group) ?? [];
    list.push(entry);
    byCategory.set(group, list);
  }

  const totalValue = [...merged.values()].reduce((s, e) => s + e.value, 0);
  const categories: TreemapCategory[] = [];

  for (const [groupName, entries] of byCategory.entries()) {
    entries.sort((a, b) => {
      if (b.value !== a.value) return b.value - a.value;
      return a.fullName.localeCompare(b.fullName);
    });

    const categoryValue = entries.reduce((s, e) => s + e.value, 0);
    const fill = TREEMAP_CATEGORY_COLORS[groupName];
    const items: TreemapItem[] = entries.map((entry, index) => {
      const { displayName, wearSuffix } = displayNameForItem(entry.fullName, groupName);
      return {
        key: makeItemKey(entry.rawCategory, entry.fullName),
        rawCategory: entry.rawCategory,
        category: groupName,
        fullName: entry.fullName || 'Untitled item',
        displayName,
        wearSuffix,
        value: entry.value,
        portfolioPct: totalValue > 0 ? (entry.value / totalValue) * 100 : 0,
        categoryPct: categoryValue > 0 ? (entry.value / categoryValue) * 100 : 0,
        iconUrl: null,
        fill: shadeItemFill(fill, index, entries.length),
      };
    });

    categories.push({
      key: groupName,
      name: groupName,
      value: categoryValue,
      portfolioPct: totalValue > 0 ? (categoryValue / totalValue) * 100 : 0,
      fill,
      items,
    });
  }

  categories.sort((a, b) => {
    if (b.value !== a.value) return b.value - a.value;
    return categoryOrderIndex(a.name) - categoryOrderIndex(b.name);
  });

  const itemsByKey = new Map<string, TreemapItem>();
  const categoriesByKey = new Map<string, TreemapCategory>();
  for (const cat of categories) {
    categoriesByKey.set(cat.key, cat);
    for (const item of cat.items) itemsByKey.set(item.key, item);
  }

  return {
    status: 'ok',
    portfolio: {
      totalValue,
      positionCount: itemsByKey.size,
      categoryCount: categories.length,
      categories,
      itemsByKey,
      categoriesByKey,
    },
  };
}

let inflightRaw: Promise<unknown> | null = null;

export async function fetchPortfolioTreemapRaw(): Promise<unknown> {
  if (!inflightRaw) {
    inflightRaw = (async () => {
      const { data, error } = await supabase.rpc('get_portfolio_treemap_data');
      if (error) throw error;
      return data;
    })().finally(() => {
      inflightRaw = null;
    });
  }
  return inflightRaw;
}

/** Exact market_hash_name match; batches of 50. Never queries cs2_items.name. */
export async function fetchTreemapIcons(fullNames: string[]): Promise<Map<string, string | null>> {
  const unique = [...new Set(fullNames.map((n) => n.trim()).filter(Boolean))];
  const result = new Map<string, string | null>();
  const missing: string[] = [];

  for (const name of unique) {
    if (iconCache.has(name)) result.set(name, iconCache.get(name) ?? null);
    else missing.push(name);
  }

  const BATCH = 50;
  for (let i = 0; i < missing.length; i += BATCH) {
    const batch = missing.slice(i, i + BATCH);
    try {
      const { data, error } = await supabase
        .from('cs2_items')
        .select('market_hash_name, icon_url')
        .in('market_hash_name', batch);

      if (error) throw error;

      const urlsByName = new Map<string, Set<string>>();
      for (const row of data ?? []) {
        const name = String((row as { market_hash_name?: string }).market_hash_name ?? '').trim();
        const url = resolveSteamIconUrl((row as { icon_url?: string | null }).icon_url);
        if (!name || !url) continue;
        const set = urlsByName.get(name) ?? new Set();
        set.add(url);
        urlsByName.set(name, set);
      }

      for (const name of batch) {
        const urls = urlsByName.get(name);
        const resolved = urls && urls.size === 1 ? [...urls][0] : null;
        iconCache.set(name, resolved);
        result.set(name, resolved);
      }
    } catch (err) {
      console.warn('[portfolio-treemap] icon batch failed', err);
      for (const name of batch) {
        if (!result.has(name)) {
          iconCache.set(name, null);
          result.set(name, null);
        }
      }
    }
  }

  return result;
}

export function applyIconsToPortfolio(
  portfolio: TreemapPortfolio,
  icons: Map<string, string | null>,
): TreemapPortfolio {
  const categories = portfolio.categories.map((cat) => ({
    ...cat,
    items: cat.items.map((item) => ({
      ...item,
      iconUrl: icons.get(item.fullName) ?? item.iconUrl,
    })),
  }));

  const itemsByKey = new Map<string, TreemapItem>();
  const categoriesByKey = new Map<string, TreemapCategory>();
  for (const cat of categories) {
    categoriesByKey.set(cat.key, cat);
    for (const item of cat.items) itemsByKey.set(item.key, item);
  }

  return { ...portfolio, categories, itemsByKey, categoriesByKey };
}

export function getCachedPortfolio(userId: string): TreemapPortfolio | null {
  if (!memoryCache || memoryCache.userId !== userId) return null;
  return memoryCache.portfolio;
}

export function setCachedPortfolio(userId: string, portfolio: TreemapPortfolio): void {
  memoryCache = { userId, portfolio, fetchedAt: Date.now() };
}

export function clearTreemapCache(userId?: string): void {
  if (!userId || memoryCache?.userId === userId) memoryCache = null;
}

/** Static demo for locked Free preview — never from real RPC. */
export function buildDemoPortfolio(): TreemapPortfolio {
  const demoRows: TreemapRpcRow[] = [
    { category: 'Cases', item_name: 'Kilowatt Case', total_value: 420 },
    { category: 'Cases', item_name: 'Revolution Case', total_value: 210 },
    { category: 'Skins', item_name: 'AK-47 | Redline (Field-Tested)', total_value: 380 },
    { category: 'Skins', item_name: 'AWP | Asiimov (Field-Tested)', total_value: 290 },
    { category: 'Stickers', item_name: 'Sticker | mONESY (Foil) | Austin 2025', total_value: 95 },
    { category: 'Capsules', item_name: 'Austin 2025 Challengers Sticker Capsule', total_value: 70 },
    { category: 'Graffiti', item_name: 'Sealed Graffiti | X-Axes', total_value: 35 },
    { category: 'Other', item_name: 'Demo Position', total_value: 40 },
  ];
  const result = normalizeTreemapRpc(demoRows);
  if (result.status !== 'ok') {
    return {
      totalValue: 0,
      positionCount: 0,
      categoryCount: 0,
      categories: [],
      itemsByKey: new Map(),
      categoriesByKey: new Map(),
    };
  }
  return result.portfolio;
}
