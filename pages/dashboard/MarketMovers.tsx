import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { MarketMoversPair } from '@/components/catalog/MarketMoversSection';
import {
  MARKET_MOVER_CATEGORIES,
  categoryLabel,
  isMarketMoverCategory,
  type MarketMoverCategory,
} from '@/utils/itemDisplayName';

const MarketMoversPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const initialCategory = params.get('category');

  const [category, setCategory] = useState<MarketMoverCategory | ''>(() =>
    initialCategory && isMarketMoverCategory(initialCategory) ? initialCategory : '',
  );

  const categoryFilter = useMemo(
    () => (
      <div className="relative min-w-[160px]">
        <select
          value={category}
          onChange={(e) => {
            const next = e.target.value;
            const value =
              next && isMarketMoverCategory(next) ? next : ('' as const);
            setCategory(value);
            setParams(
              (prev) => {
                const p = new URLSearchParams(prev);
                if (value) p.set('category', value);
                else p.delete('category');
                p.delete('direction');
                return p;
              },
              { replace: true },
            );
          }}
          className="w-full appearance-none bg-steam-card border border-steam-border rounded-xl py-2.5 pl-3 pr-8 text-xs font-bold text-steam-text focus:outline-none focus:border-steam-accent cursor-pointer min-h-11"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {MARKET_MOVER_CATEGORIES.map((key) => (
            <option key={key} value={key}>
              {categoryLabel(key)}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-steam-tertiary pointer-events-none" />
      </div>
    ),
    [category, setParams],
  );

  return (
    <div className="text-steam-text animate-fade-in pb-10 min-w-0 overflow-x-hidden">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <Link
            to="/catalog?tab=discover"
            className="inline-flex items-center gap-1.5 rounded-xl border border-steam-border px-3 py-2 text-xs font-bold text-steam-secondary hover:text-steam-text hover:bg-steam-hover min-h-11"
          >
            <ArrowLeft className="w-4 h-4" />
            Catalog
          </Link>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-steam-text">
              Market movers
            </h1>
            <p className="text-sm text-steam-secondary">
              Top gainers and losers over the last 7 days. Steam USD, 3-day median price.
            </p>
          </div>
        </div>
        {categoryFilter}
      </div>

      <MarketMoversPair variant="page" category={category || null} limit={50} />
    </div>
  );
};

export default MarketMoversPage;
