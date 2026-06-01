import React from 'react';
import { formatCurrency } from '@/utils/display';

export interface PurchaseBatch {
  id: string;
  type: 'BUY' | 'DROP';
  quantity: number;
  unitPrice: number;
  date: string;
}

interface ItemPurchaseBatchesProps {
  batches: PurchaseBatch[];
  loading?: boolean;
  scopeLabel?: string;
}

const formatBatchDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '—';
  }
};

export const ItemPurchaseBatches: React.FC<ItemPurchaseBatchesProps> = ({
  batches,
  loading = false,
  scopeLabel = 'all collections',
}) => (
  <div className="bg-steam-card rounded-2xl border border-steam-border shadow-lg overflow-hidden">
    <div className="p-5 border-b border-steam-border bg-steam-elevated">
      <h2 className="text-sm font-bold uppercase tracking-wider text-steam-secondary">
        Purchase batches
      </h2>
      <p className="text-xs text-steam-tertiary mt-1">
        Buy and drop events for this skin ({scopeLabel}).
      </p>
    </div>

    {loading ? (
      <div className="p-8 text-center text-steam-tertiary text-sm">Loading batches…</div>
    ) : batches.length === 0 ? (
      <div className="p-8 text-center text-steam-secondary text-sm">No purchase history found.</div>
    ) : (
      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          <div className="grid grid-cols-4 gap-4 px-5 py-3 border-b border-steam-border text-[11px] font-bold text-steam-tertiary uppercase bg-steam-surface">
            <span>Date</span>
            <span>Quantity</span>
            <span>Buy price</span>
            <span className="text-right">Total cost</span>
          </div>
          <ul className="divide-y divide-steam-border/50">
            {batches.map((batch) => {
              const total = batch.unitPrice * batch.quantity;
              return (
                <li
                  key={batch.id}
                  className="grid grid-cols-4 gap-4 px-5 py-3 text-sm text-steam-secondary hover:bg-steam-hover transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        batch.type === 'DROP' ? 'bg-green-500' : 'bg-steam-accent'
                      }`}
                      aria-hidden
                    />
                    <span className="truncate">{formatBatchDate(batch.date)}</span>
                  </div>
                  <span className="font-medium tabular-nums">x{batch.quantity}</span>
                  <span className="font-mono">
                    {batch.type === 'DROP' ? (
                      <span className="text-green-500/90 text-[10px] font-bold uppercase">Drop</span>
                    ) : (
                      formatCurrency(batch.unitPrice)
                    )}
                  </span>
                  <span className="font-mono font-bold text-steam-text text-right tabular-nums">
                    {batch.type === 'DROP' ? '—' : formatCurrency(total)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    )}
  </div>
);
