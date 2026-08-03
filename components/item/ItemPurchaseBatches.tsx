import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, DollarSign, Loader2, Pencil, X } from 'lucide-react';
import { formatCurrency } from '@/utils/display';
import { editTransaction } from '@/utils/editTransaction';
import { sellFromBatch } from '@/utils/addTransactionsBulk';

export interface PurchaseBatch {
  id: string;
  type: 'BUY' | 'DROP';
  quantity: number;
  unitPrice: number;
  date: string;
  isInvestment: boolean;
  collectionId: string;
  /** Only real transaction rows can be edited/sold from (not portfolio_items fallback). */
  editable: boolean;
}

interface ItemPurchaseBatchesProps {
  batches: PurchaseBatch[];
  loading?: boolean;
  scopeLabel?: string;
  itemId: string;
  userId: string;
  marketPrice: number;
  ownedQuantity: number;
  onChanged?: () => void;
  onSold?: () => void;
}

const formatBatchDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '-';
  }
};

const toDateInputValue = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const todayInputValue = () => toDateInputValue(new Date().toISOString());

export const ItemPurchaseBatches: React.FC<ItemPurchaseBatchesProps> = ({
  batches,
  loading = false,
  scopeLabel = 'all collections',
  itemId,
  userId,
  marketPrice,
  ownedQuantity,
  onChanged,
  onSold,
}) => {
  const [editing, setEditing] = useState<PurchaseBatch | null>(null);
  const [selling, setSelling] = useState<PurchaseBatch | null>(null);

  return (
    <div className="bg-steam-card rounded-2xl border border-steam-border shadow-lg overflow-hidden">
      <div className="p-5 border-b border-steam-border bg-steam-elevated">
        <h2 className="text-sm font-bold uppercase tracking-wider text-steam-secondary">
          Purchase batches
        </h2>
        <p className="text-xs text-steam-tertiary mt-1">
          Buy and drop events for this skin ({scopeLabel}). Edit a batch or sell from it with the
          same flow as Quick Add.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-steam-tertiary text-sm">Loading batches…</div>
      ) : batches.length === 0 ? (
        <div className="p-8 text-center text-steam-secondary text-sm">No purchase history found.</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-[minmax(8rem,1.5fr)_5.5rem_7.5rem_7.5rem_9.5rem] gap-3 px-5 py-3 border-b border-steam-border text-[11px] font-bold text-steam-tertiary uppercase tracking-wider bg-steam-surface items-center">
              <span>Date</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Buy price</span>
              <span className="text-right">Total cost</span>
              <span className="text-right">Actions</span>
            </div>
            <ul className="divide-y divide-steam-border/50">
              {batches.map((batch) => {
                const total = batch.unitPrice * batch.quantity;
                const canSell =
                  batch.editable && ownedQuantity > 0 && batch.quantity > 0;
                return (
                  <li
                    key={batch.id}
                    className="grid grid-cols-[minmax(8rem,1.5fr)_5.5rem_7.5rem_7.5rem_9.5rem] gap-3 px-5 py-3 text-sm text-steam-secondary hover:bg-steam-hover transition-colors items-center"
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
                    <span className="font-medium tabular-nums text-right">x{batch.quantity}</span>
                    <span className="font-mono text-right">
                      {batch.type === 'DROP' ? (
                        <span className="text-green-500/90 text-[10px] font-bold uppercase">Drop</span>
                      ) : (
                        formatCurrency(batch.unitPrice)
                      )}
                    </span>
                    <span className="font-mono font-bold text-steam-text text-right tabular-nums">
                      {batch.type === 'DROP' ? '—' : formatCurrency(total)}
                    </span>
                    <div className="flex justify-end items-center gap-1.5 min-h-[2rem]">
                      {canSell && (
                        <button
                          type="button"
                          onClick={() => setSelling(batch)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                          aria-label="Sell from batch"
                          title="Sell from batch"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          Sell
                        </button>
                      )}
                      {batch.editable ? (
                        <button
                          type="button"
                          onClick={() => setEditing(batch)}
                          className="p-2 rounded-lg text-steam-tertiary hover:text-steam-accent hover:bg-steam-accent/10 transition-colors"
                          aria-label="Edit batch"
                          title="Edit batch"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {editing && (
        <EditBatchModal
          batch={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            onChanged?.();
          }}
        />
      )}

      {selling && (
        <SellBatchModal
          batch={selling}
          itemId={itemId}
          userId={userId}
          marketPrice={marketPrice}
          ownedQuantity={ownedQuantity}
          onClose={() => setSelling(null)}
          onSold={() => {
            setSelling(null);
            onSold?.();
          }}
        />
      )}
    </div>
  );
};

const EditBatchModal: React.FC<{
  batch: PurchaseBatch;
  onClose: () => void;
  onSaved: () => void;
}> = ({ batch, onClose, onSaved }) => {
  const [quantity, setQuantity] = useState(String(batch.quantity));
  const [price, setPrice] = useState(String(batch.unitPrice));
  const [date, setDate] = useState(toDateInputValue(batch.date));
  const [isInvestment, setIsInvestment] = useState(batch.isInvestment);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity);
    const unit = Number(price);
    if (!Number.isFinite(qty) || qty <= 0 || !Number.isInteger(qty)) {
      setError('Quantity must be a positive whole number.');
      return;
    }
    if (batch.type === 'BUY' && (!Number.isFinite(unit) || unit < 0)) {
      setError('Enter a valid buy price.');
      return;
    }
    if (!date) {
      setError('Pick a date.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await editTransaction({
        transactionId: batch.id,
        quantity: qty,
        price: batch.type === 'DROP' ? 0 : unit,
        date,
        isInvestment: batch.type === 'DROP' ? false : isInvestment,
      });
      onSaved();
    } catch (err) {
      const raw =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Could not save changes.';
      const message = raw.includes('negative inventory balance')
        ? 'Cannot lower quantity that far — you already sold more of this skin than would remain.'
        : raw;
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-steam-bg/85 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog overlay"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-batch-title"
        className="relative z-10 w-full max-w-md bg-steam-card border border-steam-border rounded-2xl shadow-2xl animate-fade-in"
      >
        <div className="flex items-start justify-between gap-3 p-5 border-b border-steam-border">
          <div>
            <h3 id="edit-batch-title" className="text-lg font-bold text-steam-text">
              Edit {batch.type === 'DROP' ? 'drop' : 'purchase'}
            </h3>
            <p className="text-xs text-steam-tertiary mt-1">
              Changes apply to this transaction only. Inventory cannot go negative.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-steam-secondary hover:text-steam-text hover:bg-steam-hover"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="p-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-steam-tertiary">
              Date
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-steam-bg border border-steam-border rounded-xl px-3 py-2.5 text-sm text-steam-text focus:outline-none focus:border-steam-accent"
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-steam-tertiary">
              Quantity
            </span>
            <input
              type="number"
              min={1}
              step={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-steam-bg border border-steam-border rounded-xl px-3 py-2.5 text-sm text-steam-text focus:outline-none focus:border-steam-accent"
              required
            />
          </label>

          {batch.type === 'BUY' && (
            <>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-steam-tertiary">
                  Buy price (unit)
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-steam-bg border border-steam-border rounded-xl px-3 py-2.5 text-sm text-steam-text focus:outline-none focus:border-steam-accent"
                  required
                />
              </label>

              <label className="flex items-center justify-between gap-3 rounded-xl border border-steam-border bg-steam-bg/50 px-3 py-3 cursor-pointer">
                <span className="text-sm font-medium text-steam-text">Count as investment</span>
                <input
                  type="checkbox"
                  checked={isInvestment}
                  onChange={(e) => setIsInvestment(e.target.checked)}
                  className="w-4 h-4 accent-[var(--color-accent)]"
                />
              </label>
            </>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl border border-steam-border text-sm font-bold text-steam-secondary hover:bg-steam-hover disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-steam-accent text-white text-sm font-bold hover:opacity-90 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SellBatchModal: React.FC<{
  batch: PurchaseBatch;
  itemId: string;
  userId: string;
  marketPrice: number;
  ownedQuantity: number;
  onClose: () => void;
  onSold: () => void;
}> = ({ batch, itemId, userId, marketPrice, ownedQuantity, onClose, onSold }) => {
  const maxQty = Math.max(1, Math.min(batch.quantity, ownedQuantity));
  const [quantity, setQuantity] = useState(String(maxQty));
  const [price, setPrice] = useState(
    marketPrice > 0 ? String(marketPrice) : String(batch.unitPrice || 0),
  );
  const [date, setDate] = useState(todayInputValue());
  const [applySteamFee, setApplySteamFee] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const preview = useMemo(() => {
    const qty = Number(quantity) || 0;
    const unit = Number(price) || 0;
    const gross = unit * qty;
    const fee = applySteamFee ? gross * 0.13 : 0;
    const cost = batch.unitPrice * qty;
    const profit = gross - cost - fee;
    return { gross, fee, cost, profit };
  }, [quantity, price, applySteamFee, batch.unitPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity);
    const unit = Number(price);
    if (!Number.isFinite(qty) || qty <= 0 || !Number.isInteger(qty)) {
      setError('Quantity must be a positive whole number.');
      return;
    }
    if (qty > maxQty) {
      setError(`Max you can sell from this batch is ${maxQty}.`);
      return;
    }
    if (!Number.isFinite(unit) || unit < 0) {
      setError('Enter a valid sell price.');
      return;
    }
    if (!date) {
      setError('Pick a date.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await sellFromBatch({
        userId,
        itemId,
        collectionId: batch.collectionId,
        quantity: qty,
        sellPrice: unit,
        costBasisUnit: batch.unitPrice,
        date,
        applySteamFee,
      });
      onSold();
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Sell failed. Check quantity and try again.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-steam-bg/85 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog overlay"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sell-batch-title"
        className="relative z-10 w-full max-w-md bg-steam-card border border-steam-border rounded-2xl shadow-2xl animate-fade-in"
      >
        <div className="flex items-start justify-between gap-3 p-5 border-b border-steam-border">
          <div>
            <h3 id="sell-batch-title" className="text-lg font-bold text-steam-text">
              Sell from batch
            </h3>
            <p className="text-xs text-steam-tertiary mt-1">
              Uses the same Quick Add sell RPC. Cost basis from this batch:{' '}
              {batch.type === 'DROP' ? 'drop (0)' : formatCurrency(batch.unitPrice)}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-steam-secondary hover:text-steam-text hover:bg-steam-hover"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="p-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-steam-tertiary">
              Date
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-steam-bg border border-steam-border rounded-xl px-3 py-2.5 text-sm text-steam-text focus:outline-none focus:border-steam-accent"
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-steam-tertiary">
              Quantity (max {maxQty})
            </span>
            <input
              type="number"
              min={1}
              max={maxQty}
              step={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-steam-bg border border-steam-border rounded-xl px-3 py-2.5 text-sm text-steam-text focus:outline-none focus:border-steam-accent"
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-steam-tertiary">
              Sell price (unit)
            </span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-steam-bg border border-steam-border rounded-xl px-3 py-2.5 text-sm text-steam-text focus:outline-none focus:border-steam-accent"
              required
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-xl border border-steam-border bg-steam-bg/50 px-3 py-3 cursor-pointer">
            <span className="text-sm font-medium text-steam-text">Apply Steam fee (13%)</span>
            <input
              type="checkbox"
              checked={applySteamFee}
              onChange={(e) => setApplySteamFee(e.target.checked)}
              className="w-4 h-4 accent-[var(--color-accent)]"
            />
          </label>

          <div className="rounded-xl border border-steam-border bg-steam-bg/40 px-3 py-3 text-xs space-y-1">
            <div className="flex justify-between gap-2 text-steam-secondary">
              <span>Gross</span>
              <span className="font-mono text-steam-text">{formatCurrency(preview.gross)}</span>
            </div>
            <div className="flex justify-between gap-2 text-steam-secondary">
              <span>Fee</span>
              <span className="font-mono text-steam-text">{formatCurrency(preview.fee)}</span>
            </div>
            <div className="flex justify-between gap-2 text-steam-secondary">
              <span>Est. profit</span>
              <span
                className={`font-mono font-bold ${
                  preview.profit >= 0 ? 'text-steam-profit' : 'text-steam-loss'
                }`}
              >
                {preview.profit >= 0 ? '+' : ''}
                {formatCurrency(preview.profit)}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl border border-steam-border text-sm font-bold text-steam-secondary hover:bg-steam-hover disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-500 text-white text-sm font-bold disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Sell
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
