import React from 'react';
import { X } from 'lucide-react';
import { ItemImage } from '@/components/ui/ItemImage';
import { formatCurrency } from '@/utils/display';
import { formatSharePct, type TreemapItem } from './model';

interface ItemDetailsPanelProps {
  item: TreemapItem;
  onClose: () => void;
}

export const ItemDetailsPanel: React.FC<ItemDetailsPanelProps> = ({ item, onClose }) => {
  return (
    <div className="flex h-full min-h-0 flex-col bg-steam-card border border-steam-border rounded-2xl overflow-hidden">
      <div className="flex items-start justify-between gap-3 p-4 border-b border-steam-border shrink-0">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary">
            {item.category}
          </p>
          <h3 className="text-sm font-bold text-steam-text leading-snug mt-1 break-words">
            {item.fullName}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="pressable p-2 rounded-lg text-steam-secondary hover:text-steam-text hover:bg-steam-hover shrink-0 min-w-11 min-h-11 inline-flex items-center justify-center"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <div className="flex justify-center rounded-xl border border-steam-border bg-steam-elevated/40 p-4">
          <ItemImage
            src={item.iconUrl}
            alt={item.fullName}
            className="max-h-28 max-w-full object-contain"
            wrapperClassName="max-h-28 w-full"
          />
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary mb-1">
            Position value
          </p>
          <p className="text-2xl font-bold font-mono text-steam-text tabular-nums">
            {formatCurrency(item.value)}
          </p>
        </div>

        <div className="space-y-3">
          <ShareBar label="Of portfolio" pct={item.portfolioPct} />
          <ShareBar label="Of category" pct={item.categoryPct} />
        </div>
      </div>
    </div>
  );
};

const ShareBar: React.FC<{ label: string; pct: number }> = ({ label, pct }) => (
  <div>
    <div className="flex justify-between text-xs mb-1.5">
      <span className="text-steam-secondary">{label}</span>
      <span className="font-mono font-bold text-steam-text tabular-nums">{formatSharePct(pct)}</span>
    </div>
    <div className="h-1.5 rounded-full bg-steam-elevated overflow-hidden">
      <div
        className="h-full rounded-full bg-steam-accent"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  </div>
);
