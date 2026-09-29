import React from 'react';
import { Clock, ExternalLink, TrendingDown, TrendingUp } from 'lucide-react';
import {
  buildCsMoneyItemUrl,
  CSMONEY_LINK_REL,
  CSMONEY_MARKET_URL,
} from '@/constants/csmoney';
import { formatCurrency } from '@/utils/display';
import type { MarketPriceRow } from '@/types/marketPrices';

const STALE_MS = 6 * 60 * 60 * 1000;
const NEUTRAL_PCT = 0.1;

function formatRelativeUpdated(iso: string | null): string {
  if (!iso) return 'Updated time unknown';
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return 'Updated time unknown';
  const diffMs = Date.now() - then;
  if (diffMs < 0) return 'Updated just now';
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Updated just now';
  if (mins < 60) return `Updated ${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 48) return `Updated ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `Updated ${days}d ago`;
}

interface MarketComparePanelProps {
  marketHashName: string;
  steamFallbackPrice: number;
  market: MarketPriceRow | undefined;
  loading: boolean;
  error?: string | null;
}

export const MarketComparePanel: React.FC<MarketComparePanelProps> = ({
  marketHashName,
  steamFallbackPrice,
  market,
  loading,
  error = null,
}) => {
  const steamPrice =
    market?.steam_price != null && Number.isFinite(market.steam_price)
      ? market.steam_price
      : steamFallbackPrice;

  const cmPrice = market?.csmoney_price ?? null;
  const hasCm = cmPrice != null && Number.isFinite(cmPrice);
  const changePct = market?.csmoney_change_pct ?? null;
  const listings = market?.csmoney_listings ?? null;
  const updatedAt = market?.csmoney_updated_at ?? null;
  const spread = market?.spread_pct ?? null;
  const stale =
    hasCm &&
    updatedAt != null &&
    Date.now() - new Date(updatedAt).getTime() > STALE_MS;

  const changeDir =
    changePct == null || Math.abs(changePct) < NEUTRAL_PCT
      ? 'flat'
      : changePct > 0
        ? 'up'
        : 'down';

  const href = marketHashName
    ? buildCsMoneyItemUrl(marketHashName)
    : CSMONEY_MARKET_URL;

  return (
    <div className="dashboard-card p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="dashboard-label">
            CS.MONEY
          </p>
          <p className="text-xs text-steam-secondary mt-0.5">vs Steam market</p>
        </div>
        {spread != null && Number.isFinite(spread) && (
          <span
            className={`shrink-0 text-xs font-bold font-mono px-2 py-1 rounded-lg border ${
              spread < -NEUTRAL_PCT
                ? 'text-steam-profit border-green-500/30 bg-green-500/10'
                : spread > NEUTRAL_PCT
                  ? 'text-steam-loss border-red-500/30 bg-red-500/10'
                  : 'text-steam-secondary border-steam-border bg-steam-elevated/50'
            }`}
          >
            {spread > 0 ? '+' : ''}
            {spread.toFixed(1)}%
          </span>
        )}
      </div>

      {error && !market ? (
        <p className="text-sm text-steam-loss">
          Could not load CS.MONEY prices. Try again later.
        </p>
      ) : loading && !market ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-10 rounded-lg bg-steam-elevated/60" />
          <div className="h-10 rounded-lg bg-steam-elevated/40" />
          <div className="h-9 rounded-lg bg-steam-elevated/40" />
        </div>
      ) : (
        <>
          <dl className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-xs font-bold text-steam-tertiary uppercase tracking-wide">
                Steam
              </dt>
              <dd className="text-sm font-bold font-mono text-steam-text tabular-nums">
                {formatCurrency(steamPrice)}
              </dd>
            </div>

            <div
              className={`flex items-baseline justify-between gap-3 ${
                !hasCm || stale ? 'opacity-70' : ''
              }`}
            >
              <dt className="text-xs font-bold text-steam-tertiary uppercase tracking-wide">
                CS.MONEY
              </dt>
              <dd className="text-right">
                {hasCm ? (
                  <div className="flex items-center justify-end gap-1.5">
                    {changePct != null && changeDir !== 'flat' && (
                      <span
                        className={`inline-flex items-center gap-0.5 text-[11px] font-bold font-mono ${
                          changeDir === 'up' ? 'text-steam-profit' : 'text-steam-loss'
                        }`}
                      >
                        {changeDir === 'up' ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {changeDir === 'up' ? '+' : ''}
                        {changePct.toFixed(1)}%
                      </span>
                    )}
                    <span className="text-sm font-bold font-mono text-steam-text tabular-nums">
                      {formatCurrency(cmPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-bold font-mono text-steam-tertiary">-</span>
                )}
              </dd>
            </div>

            <div className="pt-3 border-t border-steam-border flex items-baseline justify-between gap-3">
              <dt className="text-xs font-bold text-steam-tertiary uppercase tracking-wide">
                Listings
              </dt>
              <dd className="text-right">
                <p className="text-base font-bold font-mono text-steam-text tabular-nums">
                  {listings == null ? '-' : listings.toLocaleString('en-US')}
                </p>
                {updatedAt ? (
                  <p className="mt-0.5 text-[11px] text-steam-tertiary inline-flex items-center gap-1 justify-end">
                    {stale && <Clock className="w-3 h-3 shrink-0" />}
                    {formatRelativeUpdated(updatedAt)}
                  </p>
                ) : !hasCm ? (
                  <p className="mt-0.5 text-[11px] text-steam-tertiary">
                    No listings on CS.MONEY
                  </p>
                ) : null}
              </dd>
            </div>
          </dl>

          <a
            href={href}
            target="_blank"
            rel={CSMONEY_LINK_REL}
            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-steam-border bg-steam-elevated/40 px-3 py-2.5 text-xs font-bold text-steam-secondary hover:text-steam-text hover:bg-steam-hover transition-colors"
          >
            Open on CS.MONEY
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </>
      )}
    </div>
  );
};
