import React, { useMemo } from 'react';
import { Clock, ExternalLink, TrendingDown, TrendingUp } from 'lucide-react';
import {
  getMarketLabel,
  getMarketSourceConfig,
  missingMarketPriceMessage,
} from '@/constants/marketSources';
import { formatCurrency } from '@/utils/display';
import type { MarketPriceRow } from '@/types/marketPrices';
import { getBestAbsoluteSpread } from '@/types/marketPrices';
import { track } from '@/lib/analytics';
import { MarketProviderIcon } from '@/components/icons/MarketProviderIcon';

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
  categoryOrType?: string | null;
}

export const MarketComparePanel: React.FC<MarketComparePanelProps> = ({
  marketHashName,
  steamFallbackPrice,
  market,
  loading,
  error = null,
  categoryOrType = null,
}) => {
  const steamPrice =
    market?.steam_price != null && Number.isFinite(market.steam_price)
      ? market.steam_price
      : steamFallbackPrice;

  const markets = market?.markets ?? [];
  const bestSpread = getBestAbsoluteSpread(market);

  const bestPrice = useMemo(() => {
    const priced = markets
      .map((m) => m.price)
      .filter((p): p is number => p != null && Number.isFinite(p));
    if (priced.length === 0) return null;
    return Math.min(steamPrice, ...priced);
  }, [markets, steamPrice]);

  const steamIsBest =
    bestPrice != null && Number.isFinite(steamPrice) && steamPrice <= bestPrice + 1e-9;

  return (
    <div className="dashboard-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <p className="dashboard-label">Market compare</p>
          <p className="text-sm text-steam-secondary mt-1">Prices vs Steam</p>
        </div>
        {bestSpread && (
          <div className="text-right shrink-0">
            <p
              className={`text-lg font-bold font-mono tabular-nums ${
                bestSpread.spread < -NEUTRAL_PCT
                  ? 'text-steam-profit'
                  : bestSpread.spread > NEUTRAL_PCT
                    ? 'text-steam-loss'
                    : 'text-steam-text'
              }`}
              title={`${getMarketLabel(bestSpread.source)} vs Steam`}
            >
              {bestSpread.spread > 0 ? '+' : ''}
              {bestSpread.spread.toFixed(1)}%
            </p>
            <p className="text-[10px] text-steam-tertiary mt-0.5">best vs Steam</p>
          </div>
        )}
      </div>

      {error && !market ? (
        <p className="text-sm text-steam-loss">
          Could not load market prices. Try again later.
        </p>
      ) : loading && !market ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-16 rounded-xl bg-steam-elevated/60" />
          <div className="h-16 rounded-xl bg-steam-elevated/40" />
          <div className="h-16 rounded-xl bg-steam-elevated/40" />
        </div>
      ) : (
        <ul className="space-y-2">
          <MarketRow
            source="steam"
            label="Steam"
            price={steamPrice}
            best={steamIsBest && bestPrice != null}
            meta={null}
            href={null}
            rel={undefined}
            changePct={null}
            stale={false}
            missing={false}
            missingMsg={null}
            onOpen={undefined}
          />

          {markets.map((m) => {
            const cfg = getMarketSourceConfig(m.source);
            const hasPrice = m.price != null && Number.isFinite(m.price);
            const stale =
              hasPrice &&
              m.updated_at != null &&
              Date.now() - new Date(m.updated_at).getTime() > STALE_MS;
            const href =
              cfg.url && marketHashName ? cfg.url(marketHashName) : null;
            const isBest =
              hasPrice &&
              bestPrice != null &&
              (m.price as number) <= bestPrice + 1e-9;
            const missingMsg = missingMarketPriceMessage(
              m.source,
              categoryOrType,
              marketHashName,
            );
            const metaParts: string[] = [];
            if (hasPrice && m.updated_at) {
              metaParts.push(formatRelativeUpdated(m.updated_at));
            }
            if (hasPrice && m.listings != null) {
              metaParts.push(`${m.listings.toLocaleString('en-US')} listings`);
            }

            return (
              <MarketRow
                key={m.source}
                source={m.source}
                label={cfg.label}
                price={hasPrice ? (m.price as number) : null}
                best={isBest}
                meta={
                  !hasPrice
                    ? missingMsg
                    : metaParts.length > 0
                      ? metaParts.join(' · ')
                      : null
                }
                href={href}
                rel={cfg.rel}
                changePct={m.change_pct}
                stale={Boolean(stale)}
                missing={!hasPrice}
                missingMsg={missingMsg}
                onOpen={
                  m.source.toLowerCase() === 'csmoney'
                    ? () =>
                        track('csmoney_link_clicked', {
                          placement: 'item_detail',
                        })
                    : undefined
                }
              />
            );
          })}

          {!loading && markets.length === 0 && (
            <li className="rounded-xl border border-dashed border-steam-border px-4 py-5 text-center text-xs text-steam-tertiary">
              No third-party market prices for this item yet.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

const MarketRow: React.FC<{
  source: string;
  label: string;
  price: number | null;
  best: boolean;
  meta: string | null;
  href: string | null;
  rel?: string;
  changePct: number | null;
  stale: boolean;
  missing: boolean;
  missingMsg: string | null;
  onOpen?: () => void;
}> = ({
  source,
  label,
  price,
  best,
  meta,
  href,
  rel,
  changePct,
  stale,
  missing,
  missingMsg,
  onOpen,
}) => {
  const changeDir =
    changePct == null || Math.abs(changePct) < NEUTRAL_PCT
      ? 'flat'
      : changePct > 0
        ? 'up'
        : 'down';

  return (
    <li
      className={`rounded-xl border px-3.5 py-3 transition-colors ${
        best
          ? 'border-steam-profit/40 bg-steam-profit/[0.07]'
          : 'border-steam-border/70 bg-steam-elevated/30'
      } ${stale || missing ? 'opacity-75' : ''}`}
    >
      <div className="flex items-center gap-3">
        <MarketProviderIcon source={source} size={32} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-steam-text tracking-wide">
              {label}
            </span>
            {best && !missing && (
              <span className="inline-flex items-center rounded-md bg-steam-profit/15 text-steam-profit border border-steam-profit/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                Best deal
              </span>
            )}
            {stale && !missing && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300/90">
                <Clock className="w-3 h-3" />
                Stale
              </span>
            )}
          </div>
          {meta && (
            <p className="mt-1 text-[11px] text-steam-tertiary leading-snug">
              {meta}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {!missing && changePct != null && changeDir !== 'flat' && (
            <span
              className={`inline-flex items-center gap-0.5 text-[11px] font-bold font-mono tabular-nums w-[3.75rem] justify-end ${
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
          <span
            className={`text-sm font-bold font-mono tabular-nums min-w-[4.5rem] text-right ${
              missing ? 'text-steam-tertiary' : 'text-steam-text'
            }`}
            title={missing && missingMsg ? missingMsg : undefined}
          >
            {missing || price == null ? '-' : formatCurrency(price)}
          </span>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel={rel ?? 'noopener noreferrer'}
              onClick={onOpen}
              aria-label={`Open on ${label}`}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-steam-border text-steam-secondary hover:text-steam-text hover:bg-steam-hover hover:border-steam-border transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="w-8 h-8" aria-hidden />
          )}
        </div>
      </div>
    </li>
  );
};
