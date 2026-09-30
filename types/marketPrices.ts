/** Row from public.get_market_prices_for_items_v2(uuid[]) */

export interface MarketListing {
  source: string;
  price: number | null;
  listings: number | null;
  updated_at: string | null;
  prev_price: number | null;
  change_pct: number | null;
  spread_pct: number | null;
}

export interface MarketPriceRow {
  item_id: string;
  steam_price: number | null;
  markets: MarketListing[];
}

export type MarketPriceMap = Map<string, MarketPriceRow>;

/** Largest |spread_pct| among markets (for sort / compact badge). */
export function getBestAbsoluteSpread(
  row: MarketPriceRow | undefined,
): { spread: number; source: string } | null {
  if (!row?.markets?.length) return null;
  let best: { spread: number; source: string } | null = null;
  for (const m of row.markets) {
    if (m.spread_pct == null || !Number.isFinite(m.spread_pct)) continue;
    if (!best || Math.abs(m.spread_pct) > Math.abs(best.spread)) {
      best = { spread: m.spread_pct, source: m.source };
    }
  }
  return best;
}

/** Lowest unit price among Steam + markets with a price. */
export function getCheapestUnitPrice(
  steamPrice: number | null | undefined,
  markets: MarketListing[] | undefined,
): number | null {
  const candidates: number[] = [];
  if (steamPrice != null && Number.isFinite(steamPrice) && steamPrice > 0) {
    candidates.push(steamPrice);
  }
  for (const m of markets ?? []) {
    if (m.price != null && Number.isFinite(m.price) && m.price > 0) {
      candidates.push(m.price);
    }
  }
  if (candidates.length === 0) return null;
  return Math.min(...candidates);
}
