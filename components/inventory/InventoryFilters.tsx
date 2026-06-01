import React from 'react';
import { X } from 'lucide-react';
import {
  countActiveFilters,
  RARITY_FILTER_OPTIONS,
  type PnlFilter,
  type PriceSourceFilter,
  type RarityTier,
} from '@/utils/inventoryFilters';

export interface InventoryFilterState {
  rarity: RarityTier;
  pnl: PnlFilter;
  priceSource: PriceSourceFilter;
}

export const DEFAULT_INVENTORY_FILTERS: InventoryFilterState = {
  rarity: 'all',
  pnl: 'all',
  priceSource: 'all',
};

interface InventoryFiltersProps {
  open: boolean;
  filters: InventoryFilterState;
  onChange: (filters: InventoryFilterState) => void;
  onClose: () => void;
  showPriceSourceFilter: boolean;
  resultCount: number;
  totalCount: number;
}

const selectClass =
  'w-full bg-steam-bg border border-steam-border text-sm text-steam-text rounded-xl px-3 py-2.5 focus:outline-none focus:border-steam-accent cursor-pointer';

export const InventoryFilters = ({
  open,
  filters,
  onChange,
  onClose,
  showPriceSourceFilter,
  resultCount,
  totalCount,
}: InventoryFiltersProps) => {
  if (!open) return null;

  const activeCount = countActiveFilters(filters);

  const set = <K extends keyof InventoryFilterState>(key: K, value: InventoryFilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const clearAll = () => onChange(DEFAULT_INVENTORY_FILTERS);

  return (
    <div className="mb-6 bg-steam-card border border-steam-border rounded-2xl p-4 sm:p-5 shadow-lg animate-fade-in">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-steam-text text-sm">Filters</h3>
          <p className="text-xs text-steam-tertiary mt-0.5">
            Showing {resultCount} of {totalCount} items
            {activeCount > 0 ? ` · ${activeCount} active` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-bold text-steam-accent hover:underline"
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-steam-tertiary hover:text-steam-text hover:bg-steam-hover transition-colors"
            aria-label="Close filters"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-[10px] font-bold text-steam-tertiary uppercase tracking-wider mb-1.5 block">
            Rarity
          </span>
          <select
            value={filters.rarity}
            onChange={(e) => set('rarity', e.target.value as RarityTier)}
            className={selectClass}
          >
            {RARITY_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-[10px] font-bold text-steam-tertiary uppercase tracking-wider mb-1.5 block">
            Profit / loss
          </span>
          <select
            value={filters.pnl}
            onChange={(e) => set('pnl', e.target.value as PnlFilter)}
            className={selectClass}
          >
            <option value="all">All</option>
            <option value="profit">In profit</option>
            <option value="loss">In loss</option>
            <option value="breakeven">Break-even</option>
            <option value="unknown">No buy price</option>
          </select>
        </label>

        {showPriceSourceFilter && (
          <label className="block">
            <span className="text-[10px] font-bold text-steam-tertiary uppercase tracking-wider mb-1.5 block">
              Price source
            </span>
            <select
              value={filters.priceSource}
              onChange={(e) => set('priceSource', e.target.value as PriceSourceFilter)}
              className={selectClass}
            >
              <option value="all">All sources</option>
              <option value="steam">Steam</option>
              <option value="buff">Buff163</option>
              <option value="skinport">Skinport</option>
              <option value="unknown">Unknown</option>
            </select>
          </label>
        )}
      </div>
    </div>
  );
};
