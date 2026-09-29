import React from 'react';
import { X } from 'lucide-react';
import { CustomSelect } from '@/components/ui/CustomSelect';
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

const PNL_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'profit', label: 'In profit' },
  { value: 'loss', label: 'In loss' },
  { value: 'breakeven', label: 'Break-even' },
  { value: 'unknown', label: 'No buy price' },
] as const;

const PRICE_SOURCE_OPTIONS = [
  { value: 'all', label: 'All sources' },
  { value: 'steam', label: 'Steam' },
  { value: 'buff', label: 'Buff163' },
  { value: 'skinport', label: 'Skinport' },
  { value: 'unknown', label: 'Unknown' },
] as const;

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
    <div className="mb-6 dashboard-card p-4 sm:p-5 animate-fade-in">
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
        <div>
          <span className="dashboard-label mb-1.5 block">Rarity</span>
          <CustomSelect
            value={filters.rarity}
            onChange={(v) => set('rarity', v as RarityTier)}
            options={[...RARITY_FILTER_OPTIONS]}
            aria-label="Filter by rarity"
          />
        </div>

        <div>
          <span className="dashboard-label mb-1.5 block">Profit / loss</span>
          <CustomSelect
            value={filters.pnl}
            onChange={(v) => set('pnl', v as PnlFilter)}
            options={[...PNL_OPTIONS]}
            aria-label="Filter by profit or loss"
          />
        </div>

        {showPriceSourceFilter && (
          <div>
            <span className="dashboard-label mb-1.5 block">Price source</span>
            <CustomSelect
              value={filters.priceSource}
              onChange={(v) => set('priceSource', v as PriceSourceFilter)}
              options={[...PRICE_SOURCE_OPTIONS]}
              aria-label="Filter by price source"
            />
          </div>
        )}
      </div>
    </div>
  );
};
