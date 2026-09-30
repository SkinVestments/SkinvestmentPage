import React, { useEffect, useId, useRef, useState } from 'react';
import { Clock, ExternalLink, TrendingDown, TrendingUp } from 'lucide-react';
import {
  getMarketLabel,
  getMarketSourceConfig,
  missingMarketPriceMessage,
} from '@/constants/marketSources';
import { MarketProviderIcon } from '@/components/icons/MarketProviderIcon';
import { formatCurrency } from '@/utils/display';
import { track } from '@/lib/analytics';
import type { MarketListing, MarketPriceRow } from '@/types/marketPrices';
import { getBestAbsoluteSpread } from '@/types/marketPrices';

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

function changeDirection(pct: number | null): 'up' | 'down' | 'flat' {
  if (pct == null || Math.abs(pct) < NEUTRAL_PCT) return 'flat';
  return pct > 0 ? 'up' : 'down';
}

/** Compact spread indicator for inventory cards/list (best |spread| across markets). */
export const MarketSpreadBadge: React.FC<{
  row: MarketPriceRow | undefined;
  loading?: boolean;
  className?: string;
}> = ({ row, loading = false, className = '' }) => {
  if (loading) {
    return (
      <span
        className={`inline-block h-[18px] w-16 rounded border border-steam-border bg-steam-elevated/40 animate-pulse ${className}`}
        aria-hidden
      />
    );
  }

  const best = getBestAbsoluteSpread(row);
  if (!best) {
    return (
      <span className={`inline-block text-[9px] font-bold text-steam-tertiary ${className}`}>
        No markets
      </span>
    );
  }

  const { spread, source } = best;
  const label = getMarketLabel(source);

  return (
    <span
      className={`inline-block text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border ${
        spread < -NEUTRAL_PCT
          ? 'text-steam-profit border-green-500/30 bg-green-500/10'
          : spread > NEUTRAL_PCT
            ? 'text-steam-loss border-red-500/30 bg-red-500/10'
            : 'text-steam-tertiary border-steam-border bg-steam-elevated/50'
      } ${className}`}
      title={`${label} vs Steam`}
    >
      <span className="sm:hidden">
        {spread > 0 ? '+' : ''}
        {spread.toFixed(1)}%
      </span>
      <span className="hidden sm:inline">
        {spread > 0 ? '+' : ''}
        {spread.toFixed(1)}% vs Steam
      </span>
    </span>
  );
};

interface MarketPriceChipsProps {
  marketHashName: string;
  steamFallbackPrice: number;
  market: MarketPriceRow | undefined;
  loading: boolean;
  compact?: boolean;
  categoryOrType?: string | null;
}

export const MarketPriceChips: React.FC<MarketPriceChipsProps> = ({
  marketHashName,
  steamFallbackPrice,
  market,
  loading,
  compact = false,
  categoryOrType = null,
}) => {
  const steamPrice =
    market?.steam_price != null && Number.isFinite(market.steam_price)
      ? market.steam_price
      : steamFallbackPrice;

  const listings = market?.markets ?? [];
  const priced = listings.filter((m) => m.price != null && Number.isFinite(m.price));
  const bestPrice =
    priced.length > 0
      ? Math.min(
          steamPrice,
          ...priced.map((m) => m.price as number),
        )
      : steamPrice;
  const steamIsBest =
    priced.length > 0 && Number.isFinite(steamPrice) && steamPrice <= bestPrice + 1e-9;

  const stop = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 ${compact ? 'mt-1' : 'mt-2'}`}
      onClick={stop}
      onKeyDown={stop}
    >
      <SteamChip price={steamPrice} best={steamIsBest && priced.length > 0} compact={compact} />

      {loading && listings.length === 0 ? (
        <>
          <MarketChipSkeleton compact={compact} />
          <MarketChipSkeleton compact={compact} />
        </>
      ) : (
        listings.map((listing) => (
          <MarketChip
            key={listing.source}
            listing={listing}
            marketHashName={marketHashName}
            best={
              listing.price != null &&
              Number.isFinite(listing.price) &&
              listing.price <= bestPrice + 1e-9 &&
              priced.length > 0
            }
            compact={compact}
            categoryOrType={categoryOrType}
          />
        ))
      )}
    </div>
  );
};

const BEST_CHIP_CLASS =
  'border-steam-profit/50 bg-steam-profit/10 ring-1 ring-steam-profit/25';

const SteamChip: React.FC<{
  price: number;
  best: boolean;
  compact: boolean;
}> = ({ price, best, compact }) => (
  <div className="relative inline-flex pt-2">
    {best && (
      <span className="absolute -top-0.5 left-1 z-10 rounded px-1 py-px text-[8px] font-bold uppercase tracking-wide text-steam-profit bg-steam-card border border-steam-profit/40 leading-none">
        Best deal
      </span>
    )}
    <div
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-1 ${
        best ? BEST_CHIP_CLASS : 'border-steam-border bg-steam-elevated/60'
      } ${compact ? 'text-[9px]' : 'text-[10px]'}`}
      aria-label={`Steam price ${formatCurrency(price)}${best ? ', best deal' : ''}`}
    >
      <MarketProviderIcon source="steam" size={14} />
      <span className="font-bold text-steam-tertiary uppercase tracking-wide">Steam</span>
      <span className="font-mono font-bold text-steam-text">{formatCurrency(price)}</span>
      <span className="w-3.5 h-3.5 inline-block shrink-0" aria-hidden />
    </div>
  </div>
);

const MarketChipSkeleton: React.FC<{ compact: boolean }> = ({ compact }) => (
  <div
    className={`inline-flex items-center gap-1.5 rounded-md border border-steam-border bg-steam-elevated/40 px-1.5 py-1 animate-pulse ${
      compact ? 'min-w-[5.5rem] h-[22px]' : 'min-w-[6.5rem] h-[24px]'
    }`}
    aria-hidden
  >
    <span className="h-2 w-10 rounded bg-steam-border/80" />
    <span className="h-2 w-8 rounded bg-steam-border/60" />
  </div>
);

const MarketChip: React.FC<{
  listing: MarketListing;
  marketHashName: string;
  best: boolean;
  compact: boolean;
  categoryOrType?: string | null;
}> = ({ listing, marketHashName, best, compact, categoryOrType }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();
  const cfg = getMarketSourceConfig(listing.source);
  const price = listing.price;
  const missing = price == null || !Number.isFinite(price);
  const changePct = listing.change_pct;
  const changeDir = changeDirection(changePct);
  const stale =
    !missing &&
    listing.updated_at != null &&
    Date.now() - new Date(listing.updated_at).getTime() > STALE_MS;
  const href = cfg.url && marketHashName ? cfg.url(marketHashName) : null;
  const missingMsg = missingMarketPriceMessage(
    listing.source,
    categoryOrType,
    marketHashName,
  );

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const changeLabel =
    changeDir === 'flat' || changePct == null
      ? 'unchanged'
      : changeDir === 'up'
        ? `up ${Math.abs(changePct).toFixed(1)}% since yesterday`
        : `down ${Math.abs(changePct).toFixed(1)}% since yesterday`;

  const aria = missing
    ? `${cfg.label} price unavailable, ${missingMsg}`
    : `${cfg.label} price ${formatCurrency(price)}, ${changeLabel}`;

  const ariaFull = best && !missing ? `${aria}, best deal` : aria;

  return (
    <div ref={rootRef} className="relative inline-flex pt-2">
      {best && !missing && (
        <span className="absolute -top-0.5 left-1 z-10 rounded px-1 py-px text-[8px] font-bold uppercase tracking-wide text-steam-profit bg-steam-card border border-steam-profit/40 leading-none pointer-events-none">
          Best deal
        </span>
      )}
      <button
        type="button"
        aria-label={ariaFull}
        aria-expanded={open}
        aria-controls={popoverId}
        title={missing ? missingMsg : undefined}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-1 transition-colors ${
          best && !missing
            ? BEST_CHIP_CLASS
            : 'border-steam-border bg-steam-elevated/60'
        } ${stale || missing ? 'opacity-60' : ''} ${compact ? 'text-[9px]' : 'text-[10px]'}`}
      >
        <MarketProviderIcon source={listing.source} size={14} />
        <span className="font-bold text-steam-tertiary uppercase tracking-wide">
          {cfg.label}
        </span>
        {missing ? (
          <span className="font-mono text-steam-tertiary">-</span>
        ) : (
          <span className="font-mono font-bold text-steam-text">
            {formatCurrency(price)}
          </span>
        )}
        <span className="inline-flex items-center justify-center w-3.5 h-3.5 shrink-0">
          {stale && !missing ? (
            <Clock className="w-3 h-3 text-steam-tertiary" aria-hidden />
          ) : changeDir === 'up' ? (
            <TrendingUp className="w-3 h-3 text-steam-profit" aria-hidden />
          ) : changeDir === 'down' ? (
            <TrendingDown className="w-3 h-3 text-steam-loss" aria-hidden />
          ) : (
            <span className="w-3 h-3" aria-hidden />
          )}
        </span>
        {!missing && changePct != null && changeDir !== 'flat' && (
          <span
            className={`font-mono font-bold ${
              changeDir === 'up' ? 'text-steam-profit' : 'text-steam-loss'
            }`}
          >
            {changeDir === 'up' ? '+' : ''}
            {changePct.toFixed(1)}%
          </span>
        )}
      </button>

      {open && (
        <div
          id={popoverId}
          role="dialog"
          className="absolute left-0 bottom-full mb-1.5 z-40 w-56 rounded-xl border border-steam-border bg-steam-card p-3 shadow-xl text-left"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary mb-2">
            {cfg.label}
          </p>
          {missing ? (
            <p className="text-xs text-steam-secondary">{missingMsg}</p>
          ) : (
            <ul className="text-xs text-steam-secondary space-y-1 mb-2">
              <li>
                Listings:{' '}
                <span className="font-mono text-steam-text">
                  {listing.listings == null ? '-' : listing.listings}
                </span>
              </li>
              <li>{formatRelativeUpdated(listing.updated_at)}</li>
              {listing.spread_pct != null && Number.isFinite(listing.spread_pct) && (
                <li>
                  Spread vs Steam:{' '}
                  <span className="font-mono text-steam-text">
                    {listing.spread_pct > 0 ? '+' : ''}
                    {listing.spread_pct.toFixed(1)}%
                  </span>
                </li>
              )}
              {stale && (
                <li className="text-amber-300/90 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Data older than 6h
                </li>
              )}
            </ul>
          )}
          {href && (
            <a
              href={href}
              target="_blank"
              rel={cfg.rel ?? 'noopener noreferrer'}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-steam-accent hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                if (listing.source.toLowerCase() === 'csmoney') {
                  track('csmoney_link_clicked', { placement: 'inventory_chip' });
                }
              }}
            >
              Open on {cfg.label}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
