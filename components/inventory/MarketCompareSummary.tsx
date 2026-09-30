import React, { useMemo } from 'react';
import { formatCurrency } from '@/utils/display';
import type { MarketPriceMap } from '@/types/marketPrices';
import { getCheapestUnitPrice } from '@/types/marketPrices';
import { getMarketLabel } from '@/constants/marketSources';

interface InventoryLine {
  item_id: string;
  quantity: number;
  steamUnitPrice: number;
}

interface MarketCompareSummaryProps {
  lines: InventoryLine[];
  prices: MarketPriceMap;
  loading: boolean;
  error?: string | null;
}

type MarketTotal = {
  source: string;
  label: string;
  steamTotal: number;
  marketTotal: number;
  compared: number;
  diffPct: number | null;
};

export const MarketCompareSummary: React.FC<MarketCompareSummaryProps> = ({
  lines,
  prices,
  loading,
  error = null,
}) => {
  const stats = useMemo(() => {
    const bySource = new Map<
      string,
      { steamTotal: number; marketTotal: number; compared: number }
    >();
    let cheapestTotal = 0;
    let cheapestCount = 0;

    for (const line of lines) {
      const row = prices.get(line.item_id);
      const steam =
        row?.steam_price != null && Number.isFinite(row.steam_price)
          ? row.steam_price
          : line.steamUnitPrice;

      const cheapest = getCheapestUnitPrice(steam, row?.markets);
      if (cheapest != null) {
        cheapestTotal += cheapest * line.quantity;
        cheapestCount += 1;
      }

      for (const m of row?.markets ?? []) {
        if (m.price == null || !Number.isFinite(m.price) || !Number.isFinite(steam) || steam <= 0) {
          continue;
        }
        const agg = bySource.get(m.source) ?? {
          steamTotal: 0,
          marketTotal: 0,
          compared: 0,
        };
        agg.steamTotal += steam * line.quantity;
        agg.marketTotal += m.price * line.quantity;
        agg.compared += 1;
        bySource.set(m.source, agg);
      }
    }

    const markets: MarketTotal[] = [...bySource.entries()]
      .map(([source, agg]) => ({
        source,
        label: getMarketLabel(source),
        steamTotal: agg.steamTotal,
        marketTotal: agg.marketTotal,
        compared: agg.compared,
        diffPct:
          agg.steamTotal > 0
            ? ((agg.marketTotal / agg.steamTotal - 1) * 100)
            : null,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const anyCompared = markets.reduce((s, m) => s + m.compared, 0);

    return {
      markets,
      cheapestTotal,
      cheapestCount,
      totalItems: lines.length,
      anyCompared,
    };
  }, [lines, prices]);

  const empty =
    !loading && !error && stats.anyCompared === 0 && stats.totalItems > 0;
  const noItems = !loading && stats.totalItems === 0;

  return (
    <div className="mb-6 dashboard-card p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="dashboard-label mb-1">Market comparison</p>
          {loading && stats.anyCompared === 0 ? (
            <p className="text-sm text-steam-secondary">Loading market prices...</p>
          ) : error ? (
            <p className="text-sm text-steam-loss">
              Could not load market prices. Open an item for details later, or try again.
            </p>
          ) : empty || noItems ? (
            <p className="text-sm text-steam-secondary">
              No third-party listings for your items yet. Spread sort stays available when
              prices appear.
            </p>
          ) : (
            <p className="text-sm text-steam-secondary">
              Totals use only items that have both Steam and that market.
            </p>
          )}
        </div>
      </div>

      {stats.markets.length > 0 && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
          {stats.markets.map((m) => (
            <div
              key={m.source}
              className="rounded-lg border border-steam-border bg-steam-elevated/40 px-3 py-2"
            >
              <p className="dashboard-label">{m.label}</p>
              <p className="text-base font-bold font-mono text-steam-text mt-0.5">
                {formatCurrency(m.marketTotal)}
              </p>
              <p className="text-[11px] text-steam-tertiary mt-0.5">
                Steam (same items): {formatCurrency(m.steamTotal)}
                {m.diffPct != null && (
                  <span
                    className={`ml-1.5 font-bold font-mono ${
                      m.diffPct < -0.1
                        ? 'text-steam-profit'
                        : m.diffPct > 0.1
                          ? 'text-steam-loss'
                          : 'text-steam-secondary'
                    }`}
                  >
                    ({m.diffPct > 0 ? '+' : ''}
                    {m.diffPct.toFixed(1)}%)
                  </span>
                )}
              </p>
              <p className="text-[10px] text-steam-tertiary mt-0.5">
                {m.compared} of {stats.totalItems} items
              </p>
            </div>
          ))}

          {stats.cheapestCount > 0 && (
            <div className="rounded-lg border border-steam-accent/40 bg-steam-accent/10 px-3 py-2">
              <p className="dashboard-label">Cheapest overall</p>
              <p className="text-base font-bold font-mono text-steam-text mt-0.5">
                {formatCurrency(stats.cheapestTotal)}
              </p>
              <p className="text-[11px] text-steam-tertiary mt-0.5">
                Sum of the lowest price per item (Steam or markets)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
