import { supabase } from '@/utils/supabaseClient';
import type { MarketMoverCategory } from '@/utils/itemDisplayName';

export type MarketMoverDirection = 'gainers' | 'losers';

export interface MarketMoverRow {
  item_id: string;
  market_hash_name: string;
  icon_url: string | null;
  category: string | null;
  rarity: string | null;
  exterior: string | null;
  price: number;
  price_7d_ago: number;
  change_pct: number;
  avg_daily_volume: number | null;
  computed_at: string | null;
}

type CacheEntry = {
  rows: MarketMoverRow[];
  fetchedAt: number;
};

const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, CacheEntry>();

function cacheKey(
  direction: MarketMoverDirection,
  limit: number,
  category: string | null,
): string {
  return `${direction}|${limit}|${category ?? ''}`;
}

function num(raw: unknown): number {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : 0;
  const n = Number(String(raw ?? '').replace(/[^0-9.\-]+/g, ''));
  return Number.isFinite(n) ? n : 0;
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

function mapRow(row: Record<string, unknown>): MarketMoverRow | null {
  const item_id = String(row.item_id ?? '').trim();
  const market_hash_name = String(row.market_hash_name ?? '').trim();
  if (!item_id || !market_hash_name) return null;

  return {
    item_id,
    market_hash_name,
    icon_url: resolveIconUrl(
      row.icon_url == null || row.icon_url === '' ? null : String(row.icon_url),
    ),
    category: row.category == null || row.category === '' ? null : String(row.category),
    rarity: row.rarity == null || row.rarity === '' ? null : String(row.rarity),
    exterior: row.exterior == null || row.exterior === '' ? null : String(row.exterior),
    price: num(row.price),
    price_7d_ago: num(row.price_7d_ago),
    change_pct: num(row.change_pct),
    avg_daily_volume:
      row.avg_daily_volume == null || row.avg_daily_volume === ''
        ? null
        : num(row.avg_daily_volume),
    computed_at:
      row.computed_at == null || row.computed_at === ''
        ? null
        : String(row.computed_at),
  };
}

export type FetchMarketMoversResult =
  | { ok: true; rows: MarketMoverRow[]; fromCache: boolean }
  | { ok: false; error: unknown };

export async function fetchMarketMovers(options: {
  direction: MarketMoverDirection;
  limit?: number;
  category?: MarketMoverCategory | null;
  /** Bypass in-memory cache (e.g. manual refresh). */
  force?: boolean;
}): Promise<FetchMarketMoversResult> {
  const direction = options.direction;
  const limit = Math.max(1, Math.min(Math.trunc(options.limit ?? 10) || 10, 50));
  const category = options.category ?? null;
  const key = cacheKey(direction, limit, category);

  if (!options.force) {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.fetchedAt < CACHE_TTL_MS) {
      return { ok: true, rows: hit.rows, fromCache: true };
    }
  }

  try {
    const { data, error } = await supabase.rpc('get_market_movers', {
      p_direction: direction,
      p_limit: limit,
      p_category: category,
    });

    if (error) return { ok: false, error };

    const rows = ((data as Record<string, unknown>[] | null) ?? [])
      .map(mapRow)
      .filter((r): r is MarketMoverRow => r != null);

    cache.set(key, { rows, fetchedAt: Date.now() });
    return { ok: true, rows, fromCache: false };
  } catch (error) {
    return { ok: false, error };
  }
}

/** Relative "Updated Xm ago" from computed_at. No em dash. */
export function formatMoversUpdatedAt(computedAt: string | null | undefined): string | null {
  if (!computedAt) return null;
  const t = new Date(computedAt).getTime();
  if (!Number.isFinite(t)) return null;
  const mins = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (mins <= 0) return 'Updated just now';
  if (mins === 1) return 'Updated 1m ago';
  if (mins < 60) return `Updated ${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours === 1) return 'Updated 1h ago';
  return `Updated ${hours}h ago`;
}

export function formatSignedChangePct(changePct: number): string {
  const n = Number.isFinite(changePct) ? changePct : 0;
  const abs = Math.abs(n).toFixed(2);
  if (n > 0) return `+${abs}%`;
  if (n < 0) return `-${abs}%`;
  return `${abs}%`;
}
