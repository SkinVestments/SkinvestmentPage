import { supabase } from '@/utils/supabaseClient';
import type { MarketMoverCategory } from '@/utils/itemDisplayName';

export type MarketMoverDirection = 'gainers' | 'losers';
export type MarketMoverPeriod = '7d' | '30d' | '90d';

export const MARKET_MOVER_PERIODS: Array<{ id: MarketMoverPeriod; label: string }> = [
  { id: '7d', label: '7D' },
  { id: '30d', label: '30D' },
  { id: '90d', label: '90D' },
];

export interface MarketMoverRow {
  period: MarketMoverPeriod | string | null;
  item_id: string;
  market_hash_name: string;
  icon_url: string | null;
  category: string | null;
  rarity: string | null;
  exterior: string | null;
  price: number;
  price_start: number;
  change_pct: number;
  avg_daily_volume: number | null;
  computed_at: string | null;
}

type CacheEntry = {
  rows: MarketMoverRow[];
  fetchedAt: number;
};

export type FetchMarketMoversResult =
  | { ok: true; rows: MarketMoverRow[]; fromCache: boolean }
  | { ok: false; error: unknown };

const CACHE_TTL_MS = 10 * 60 * 1000;
const PERIOD_LS_KEY = 'skinvestments.market_movers.period';
const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<FetchMarketMoversResult>>();

function cacheKey(
  direction: MarketMoverDirection,
  limit: number,
  category: string | null,
  period: MarketMoverPeriod,
): string {
  return `${direction}|${limit}|${category ?? ''}|${period}`;
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

export function parseMarketMoverPeriod(raw: string | null | undefined): MarketMoverPeriod {
  if (raw === '30d' || raw === '90d' || raw === '7d') return raw;
  return '7d';
}

export function loadStoredMarketMoverPeriod(): MarketMoverPeriod {
  try {
    return parseMarketMoverPeriod(localStorage.getItem(PERIOD_LS_KEY));
  } catch {
    return '7d';
  }
}

export function storeMarketMoverPeriod(period: MarketMoverPeriod): void {
  try {
    localStorage.setItem(PERIOD_LS_KEY, period);
  } catch {
    /* ignore quota / private mode */
  }
}

export function periodFooterLabel(period: MarketMoverPeriod): string {
  if (period === '30d') return '30D';
  if (period === '90d') return '90D';
  return '7D';
}

function mapRow(row: Record<string, unknown>): MarketMoverRow | null {
  const item_id = String(row.item_id ?? '').trim();
  const market_hash_name = String(row.market_hash_name ?? '').trim();
  if (!item_id || !market_hash_name) return null;

  const periodRaw = row.period == null || row.period === '' ? null : String(row.period);
  // Prefer price_start; ignore legacy price_7d_ago if present.
  const priceStart =
    row.price_start != null && row.price_start !== ''
      ? num(row.price_start)
      : 0;

  return {
    period: periodRaw,
    item_id,
    market_hash_name,
    icon_url: resolveIconUrl(
      row.icon_url == null || row.icon_url === '' ? null : String(row.icon_url),
    ),
    category: row.category == null || row.category === '' ? null : String(row.category),
    rarity: row.rarity == null || row.rarity === '' ? null : String(row.rarity),
    exterior: row.exterior == null || row.exterior === '' ? null : String(row.exterior),
    price: num(row.price),
    price_start: priceStart,
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

export async function fetchMarketMovers(options: {
  direction: MarketMoverDirection;
  limit?: number;
  category?: MarketMoverCategory | string | null;
  period?: MarketMoverPeriod;
  /** Bypass in-memory cache (e.g. manual refresh). */
  force?: boolean;
}): Promise<FetchMarketMoversResult> {
  const direction = options.direction;
  const limit = Math.max(1, Math.min(Math.trunc(options.limit ?? 10) || 10, 50));
  const category = options.category ?? null;
  const period = options.period ?? '7d';
  const key = cacheKey(direction, limit, category, period);

  if (!options.force) {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.fetchedAt < CACHE_TTL_MS) {
      return { ok: true, rows: hit.rows, fromCache: true };
    }
    const pending = inflight.get(key);
    if (pending) return pending;
  }

  const promise = (async (): Promise<FetchMarketMoversResult> => {
    try {
      const { data, error } = await supabase.rpc('get_market_movers', {
        p_direction: direction,
        p_limit: limit,
        p_category: category,
        p_period: period,
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
  })();

  inflight.set(key, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(key);
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
