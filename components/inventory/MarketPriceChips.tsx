import React from 'react';

const NEUTRAL_PCT = 0.1;

/** Compact spread indicator for inventory cards/list (full compare lives on Item Detail). */
export const MarketSpreadBadge: React.FC<{
  spread: number | null | undefined;
  loading?: boolean;
  className?: string;
}> = ({ spread, loading = false, className = '' }) => {
  if (loading) {
    return (
      <span
        className={`inline-block h-[18px] w-16 rounded border border-steam-border bg-steam-elevated/40 animate-pulse ${className}`}
        aria-hidden
      />
    );
  }

  if (spread == null || !Number.isFinite(spread)) {
    return (
      <span className={`inline-block text-[9px] font-bold text-steam-tertiary ${className}`}>
        No CS.MONEY
      </span>
    );
  }

  return (
    <span
      className={`inline-block text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border ${
        spread < -NEUTRAL_PCT
          ? 'text-steam-profit border-green-500/30 bg-green-500/10'
          : spread > NEUTRAL_PCT
            ? 'text-steam-loss border-red-500/30 bg-red-500/10'
            : 'text-steam-tertiary border-steam-border bg-steam-elevated/50'
      } ${className}`}
      title="CS.MONEY vs Steam"
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
