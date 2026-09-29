import React, { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import { CSMONEY_LINK_REL, CSMONEY_MARKET_URL } from '@/constants/csmoney';
import { formatCurrency } from '@/utils/display';
import type { MarketPriceMap } from '@/types/marketPrices';

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

export const MarketCompareSummary: React.FC<MarketCompareSummaryProps> = ({
  lines,
  prices,
  loading,
  error = null,
}) => {
  const stats = useMemo(() => {
    let steamTotal = 0;
    let csmoneyTotal = 0;
    let compared = 0;

    for (const line of lines) {
      const row = prices.get(line.item_id);
      const steam =
        row?.steam_price != null && Number.isFinite(row.steam_price)
          ? row.steam_price
          : line.steamUnitPrice;
      const cm = row?.csmoney_price;
      if (cm == null || !Number.isFinite(cm) || !Number.isFinite(steam) || steam <= 0) {
        continue;
      }
      steamTotal += steam * line.quantity;
      csmoneyTotal += cm * line.quantity;
      compared += 1;
    }

    const totalItems = lines.length;
    const diffPct =
      steamTotal > 0 ? ((csmoneyTotal / steamTotal - 1) * 100) : null;

    return { steamTotal, csmoneyTotal, compared, totalItems, diffPct };
  }, [lines, prices]);

  const empty = !loading && !error && stats.compared === 0 && stats.totalItems > 0;
  const noItems = !loading && stats.totalItems === 0;

  return (
    <div className="mb-6 dashboard-card p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="dashboard-label mb-1">
            Market comparison
          </p>
          {loading && stats.compared === 0 ? (
            <p className="text-sm text-steam-secondary">Loading CS.MONEY prices...</p>
          ) : error ? (
            <p className="text-sm text-steam-loss">
              Could not load CS.MONEY prices. Open an item for details later, or try again.
            </p>
          ) : empty || noItems ? (
            <p className="text-sm text-steam-secondary">
              No CS.MONEY listings for your items yet. Spread sort stays available when prices appear.
            </p>
          ) : (
            <p className="text-sm text-steam-secondary">
              Based on{' '}
              <span className="font-bold text-steam-text">{stats.compared}</span> of{' '}
              <span className="font-bold text-steam-text">{stats.totalItems}</span>{' '}
              items
            </p>
          )}
        </div>
        <a
          href={CSMONEY_MARKET_URL}
          target="_blank"
          rel={CSMONEY_LINK_REL}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-steam-secondary hover:text-steam-text border border-steam-border rounded-lg px-2.5 py-1.5 hover:bg-steam-hover transition-colors shrink-0"
        >
          Browse CS.MONEY
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {stats.compared > 0 && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-lg border border-steam-border bg-steam-elevated/40 px-3 py-2">
            <p className="dashboard-label">
              Steam total
            </p>
            <p className="text-base font-bold font-mono text-steam-text mt-0.5">
              {formatCurrency(stats.steamTotal)}
            </p>
          </div>
          <div className="rounded-lg border border-steam-border bg-steam-elevated/40 px-3 py-2">
            <p className="dashboard-label">
              CS.MONEY total
            </p>
            <p className="text-base font-bold font-mono text-steam-text mt-0.5">
              {formatCurrency(stats.csmoneyTotal)}
            </p>
          </div>
          <div className="rounded-lg border border-steam-border bg-steam-elevated/40 px-3 py-2">
            <p className="dashboard-label">
              Difference
            </p>
            <p
              className={`text-base font-bold font-mono mt-0.5 ${
                stats.diffPct == null
                  ? 'text-steam-tertiary'
                  : stats.diffPct < -0.1
                    ? 'text-steam-profit'
                    : stats.diffPct > 0.1
                      ? 'text-steam-loss'
                      : 'text-steam-text'
              }`}
            >
              {stats.diffPct == null
                ? '-'
                : `${stats.diffPct > 0 ? '+' : ''}${stats.diffPct.toFixed(1)}%`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
