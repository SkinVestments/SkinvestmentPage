import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';
import { ItemImage } from '@/components/ui/ItemImage';
import { track } from '@/lib/analytics';
import { formatCurrency } from '@/utils/display';
import {
  isMarketMoverCategory,
  parseMarketHashName,
  type MarketMoverCategory,
} from '@/utils/itemDisplayName';
import {
  fetchMarketMovers,
  formatMoversUpdatedAt,
  formatSignedChangePct,
  type MarketMoverDirection,
  type MarketMoverRow,
} from '@/utils/marketMovers';

const PREVIEW_LIMIT = 5;

interface MarketMoversSectionProps {
  /** Fixed column: one card = gainers or losers (no toggle). */
  direction: MarketMoverDirection;
  /** Compact Discover card (hero + ranks 2-5 + footer link). */
  variant?: 'discover' | 'page';
  /** When set, passes p_category to the RPC. */
  category?: MarketMoverCategory | null;
  className?: string;
  /** Full ranking uses limit 50. */
  limit?: number;
}

export const MarketMoversSection: React.FC<MarketMoversSectionProps> = ({
  direction,
  variant = 'discover',
  category = null,
  className = '',
  limit: limitProp,
}) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<MarketMoverRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const viewedRef = useRef<string | null>(null);

  const limit = limitProp ?? (variant === 'page' ? 50 : PREVIEW_LIMIT);
  const categoryParam =
    category && isMarketMoverCategory(category) ? category : null;
  const isGainers = direction === 'gainers';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);

    void fetchMarketMovers({
      direction,
      limit,
      category: categoryParam,
    }).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setFailed(true);
        setRows(null);
        setLoading(false);
        return;
      }
      setRows(result.rows);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [direction, limit, categoryParam]);

  useEffect(() => {
    if (loading || failed || !rows) return;
    const key = `${direction}|${categoryParam ?? ''}|${variant}`;
    if (viewedRef.current === key) return;
    viewedRef.current = key;
    track('market_movers_viewed', { direction });
  }, [loading, failed, rows, direction, categoryParam, variant]);

  // Discover: hide this column on RPC failure (sibling may still show).
  if (failed && variant === 'discover') return null;

  const previewRows = variant === 'discover' ? (rows ?? []).slice(0, PREVIEW_LIMIT) : rows ?? [];
  const hero = previewRows[0] ?? null;
  const rest = previewRows.slice(1);
  const updatedLabel = formatMoversUpdatedAt(hero?.computed_at ?? previewRows[0]?.computed_at);

  const onSelect = (item: MarketMoverRow, rank: number) => {
    track('market_mover_clicked', { direction, rank });
    navigate(`/item/${item.item_id}`);
  };

  return (
    <section
      className={`bg-steam-card border border-steam-border rounded-2xl shadow-xl overflow-hidden h-full flex flex-col ${className}`}
      aria-label={isGainers ? 'Top gainers last 7 days' : 'Top losers last 7 days'}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 pt-4 sm:pt-5 pb-3 border-b border-steam-border/60">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {isGainers ? (
              <TrendingUp className="w-4 h-4 text-steam-profit shrink-0" />
            ) : (
              <TrendingDown className="w-4 h-4 text-steam-loss shrink-0" />
            )}
            <h2 className="text-base sm:text-lg font-bold text-steam-text tracking-tight">
              {isGainers ? 'Top gainers' : 'Top losers'}
            </h2>
          </div>
          <p className="text-xs text-steam-tertiary mt-0.5">
            Last 7 days
            {updatedLabel ? ` · ${updatedLabel}` : ''}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {loading ? (
          <MarketMoversSkeleton variant={variant} />
        ) : failed ? (
          <p className="text-sm text-steam-secondary py-8 text-center">
            Unavailable right now.
          </p>
        ) : previewRows.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm font-bold text-steam-text mb-1">No movers yet</p>
            <p className="text-xs text-steam-tertiary">
              {category ? 'Try clearing the category filter.' : 'Check back after the next refresh.'}
            </p>
          </div>
        ) : variant === 'discover' ? (
          <>
            {hero ? (
              <HeroCard
                item={hero}
                direction={direction}
                onClick={() => onSelect(hero, 1)}
              />
            ) : null}
            {rest.length > 0 ? (
              <ul className="mt-3 space-y-1.5">
                {rest.map((item, i) => (
                  <RankRow
                    key={item.item_id}
                    item={item}
                    rank={i + 2}
                    direction={direction}
                    onClick={() => onSelect(item, i + 2)}
                  />
                ))}
              </ul>
            ) : null}
            <div className="mt-auto pt-4 border-t border-steam-border/50 flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary">
                Steam · USD
              </p>
              <Link
                to={`/catalog/movers?direction=${direction}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-steam-accent hover:underline"
              >
                View ranking
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </>
        ) : (
          <ul className="space-y-1.5">
            {previewRows.map((item, i) =>
              i === 0 ? (
                <li key={item.item_id}>
                  <HeroCard
                    item={item}
                    direction={direction}
                    onClick={() => onSelect(item, 1)}
                  />
                </li>
              ) : (
                <RankRow
                  key={item.item_id}
                  item={item}
                  rank={i + 1}
                  direction={direction}
                  onClick={() => onSelect(item, i + 1)}
                />
              ),
            )}
          </ul>
        )}
      </div>
    </section>
  );
};

/** Side-by-side Gainers + Losers for Discover / ranking. */
export const MarketMoversPair: React.FC<{
  variant?: 'discover' | 'page';
  category?: MarketMoverCategory | null;
  limit?: number;
  className?: string;
}> = ({ variant = 'discover', category = null, limit, className = '' }) => (
  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 items-stretch ${className}`}>
    <MarketMoversSection
      direction="gainers"
      variant={variant}
      category={category}
      limit={limit}
    />
    <MarketMoversSection
      direction="losers"
      variant={variant}
      category={category}
      limit={limit}
    />
  </div>
);

const ChangeBadge: React.FC<{
  direction: MarketMoverDirection;
  changePct: number;
  size?: 'md' | 'sm';
}> = ({ direction, changePct, size = 'md' }) => {
  const up = direction === 'gainers';
  return (
    <span
      className={`inline-flex items-center gap-0.5 font-bold num shrink-0 ${
        up ? 'text-steam-profit' : 'text-steam-loss'
      } ${size === 'md' ? 'text-sm' : 'text-xs'}`}
    >
      {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
      {formatSignedChangePct(changePct)}
    </span>
  );
};

const HeroCard: React.FC<{
  item: MarketMoverRow;
  direction: MarketMoverDirection;
  onClick: () => void;
}> = ({ item, direction, onClick }) => {
  const { title, subtitle } = parseMarketHashName(item.market_hash_name, item.category);
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl border border-steam-border bg-steam-bg/80 hover:border-steam-accent/40 transition-colors p-3 sm:p-4 flex gap-3 sm:gap-4 items-center"
    >
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-lg sm:text-xl font-bold font-mono text-steam-text num">
          {formatCurrency(item.price)}
        </p>
        <p className="text-sm sm:text-base font-bold text-steam-text truncate">{title}</p>
        <p className="text-xs text-steam-tertiary truncate">{subtitle}</p>
        <ChangeBadge direction={direction} changePct={item.change_pct} />
      </div>
      <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-steam-elevated border border-steam-border/60 flex items-center justify-center p-2">
        <ItemImage
          src={item.icon_url}
          alt={item.market_hash_name}
          className="max-h-full max-w-full object-contain"
          wrapperClassName="w-full h-full"
        />
      </div>
    </button>
  );
};

const RankRow: React.FC<{
  item: MarketMoverRow;
  rank: number;
  direction: MarketMoverDirection;
  onClick: () => void;
}> = ({ item, rank, direction, onClick }) => {
  const { title, subtitle } = parseMarketHashName(item.market_hash_name, item.category);
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left rounded-xl border border-steam-border/70 bg-steam-bg/40 hover:border-steam-accent/35 hover:bg-steam-hover/40 transition-colors px-3 py-2.5 flex items-center gap-3"
      >
        <span className="w-6 text-center text-xs font-bold text-steam-tertiary num shrink-0">
          {rank}
        </span>
        <div className="w-10 h-10 shrink-0 rounded-lg bg-steam-elevated border border-steam-border/50 flex items-center justify-center p-1">
          <ItemImage
            src={item.icon_url}
            alt=""
            className="max-h-full max-w-full object-contain"
            wrapperClassName="w-full h-full"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-steam-text truncate">{title}</p>
          <p className="text-[11px] text-steam-tertiary truncate">{subtitle}</p>
        </div>
        <div className="text-right shrink-0 space-y-0.5">
          <p className="text-sm font-bold font-mono text-steam-text num">
            {formatCurrency(item.price)}
          </p>
          <ChangeBadge direction={direction} changePct={item.change_pct} size="sm" />
        </div>
      </button>
    </li>
  );
};

/** Fixed-height skeleton matching hero + 4 rows to avoid CLS. */
export const MarketMoversSkeleton: React.FC<{ variant?: 'discover' | 'page' }> = ({
  variant = 'discover',
}) => {
  const rowCount = variant === 'page' ? 8 : 4;
  return (
    <div aria-hidden className="animate-pulse">
      <div className="rounded-xl border border-steam-border bg-steam-bg/60 p-3 sm:p-4 flex gap-3 sm:gap-4 items-center min-h-[112px] sm:min-h-[128px]">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-6 w-24 rounded bg-steam-elevated" />
          <div className="h-4 w-40 rounded bg-steam-elevated" />
          <div className="h-3 w-28 rounded bg-steam-elevated" />
          <div className="h-4 w-16 rounded bg-steam-elevated" />
        </div>
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-steam-elevated shrink-0" />
      </div>
      <div className="mt-3 space-y-1.5">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-steam-border/60 bg-steam-bg/40 px-3 py-2.5 flex items-center gap-3 min-h-[58px]"
          >
            <div className="w-6 h-3 rounded bg-steam-elevated" />
            <div className="w-10 h-10 rounded-lg bg-steam-elevated shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-32 rounded bg-steam-elevated" />
              <div className="h-3 w-20 rounded bg-steam-elevated" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3.5 w-14 rounded bg-steam-elevated ml-auto" />
              <div className="h-3 w-12 rounded bg-steam-elevated ml-auto" />
            </div>
          </div>
        ))}
      </div>
      {variant === 'discover' ? (
        <div className="mt-4 pt-3 border-t border-steam-border/50 flex justify-between">
          <div className="h-3 w-20 rounded bg-steam-elevated" />
          <div className="h-3 w-24 rounded bg-steam-elevated" />
        </div>
      ) : null}
    </div>
  );
};
