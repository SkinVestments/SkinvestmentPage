import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Minus,
  Plus,
  Folder,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabaseClient';
import { ItemImage } from '@/components/ui/ItemImage';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { formatCurrency } from '@/utils/display';
import { useSubscriptionPlan } from '@/hooks/useSubscriptionPlan';
import { getCollectionItemLimit, type SteamMatchedItem } from '@/types/steam';
import { countCollectionItems } from '@/utils/steamInventory';
import { trackSteamEvent } from '@/utils/steamAccounts';

interface CollectionRow {
  id: string;
  name: string;
}

interface SteamInventoryImportModalProps {
  isOpen: boolean;
  items: SteamMatchedItem[];
  skippedUnknown: number;
  onClose: () => void;
  onSuccess: () => void;
}

const formatInputDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = String((err as { message?: string }).message);
    if (msg) return msg;
  }
  return fallback;
};

export const SteamInventoryImportModal: React.FC<SteamInventoryImportModalProps> = ({
  isOpen,
  items,
  skippedUnknown,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { planId } = useSubscriptionPlan();

  const [query, setQuery] = useState('');
  const [newOnly, setNewOnly] = useState(false);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [collections, setCollections] = useState<CollectionRow[]>([]);
  const [collectionId, setCollectionId] = useState('');
  const [addToInvestments, setAddToInvestments] = useState(true);
  const [date, setDate] = useState(() => formatInputDate(new Date()));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setNewOnly(false);
    setError(null);
    setDate(formatInputDate(new Date()));
    // Default: select all stacks at full Steam quantity
    const next: Record<string, number> = {};
    for (const item of items) {
      next[item.itemId] = item.quantity;
    }
    setSelected(next);
  }, [isOpen, items]);

  useEffect(() => {
    if (!isOpen || !user) return;
    void (async () => {
      const { data } = await supabase
        .from('collections')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name', { ascending: true });
      setCollections((data as CollectionRow[]) ?? []);
    })();
  }, [isOpen, user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (newOnly && item.alreadyInPortfolio) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.marketHashName.toLowerCase().includes(q)
      );
    });
  }, [items, query, newOnly]);

  const selectedCount = Object.keys(selected).filter((id) => (selected[id] ?? 0) > 0).length;
  const selectedUnits = Object.values(selected).reduce((s, n) => s + (n > 0 ? n : 0), 0);

  const toggleAllVisible = (on: boolean) => {
    setSelected((prev) => {
      const next = { ...prev };
      for (const item of filtered) {
        if (on) next[item.itemId] = item.quantity;
        else delete next[item.itemId];
      }
      return next;
    });
  };

  const setQty = (itemId: string, max: number, qty: number) => {
    const clamped = Math.max(0, Math.min(max, Math.floor(qty)));
    setSelected((prev) => {
      const next = { ...prev };
      if (clamped <= 0) delete next[itemId];
      else next[itemId] = clamped;
      return next;
    });
  };

  const handleImport = async () => {
    if (!user) return;
    const lines = items
      .filter((item) => (selected[item.itemId] ?? 0) > 0)
      .map((item) => ({
        item,
        quantity: selected[item.itemId],
      }));

    if (lines.length === 0) {
      setError('Select at least one item.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const limit = getCollectionItemLimit(planId);
      if (limit != null) {
        const existing = await countCollectionItems(user.id, collectionId || null);
        const incoming = lines.reduce((sum, l) => sum + l.quantity, 0);
        if (existing + incoming > limit) {
          throw new Error(
            `Collection item limit reached for your plan (${limit}). Upgrade or pick fewer items.`,
          );
        }
      }

      const dropAt = new Date(`${date}T12:00:00`).toISOString();
      const transactions = lines.map(({ item, quantity }) => ({
        item_id: item.itemId,
        quantity,
        price: item.currentPrice,
        type: 'BUY' as const,
        is_investment: addToInvestments,
        transaction_date: dropAt,
        collection_id: collectionId || '',
        fee_deducted: 0,
        realized_profit: 0,
      }));

      const { data, error: rpcError } = await supabase.rpc('add_transactions_bulk', {
        p_user_id: user.id,
        p_transactions: transactions,
      });

      if (rpcError) throw rpcError;
      if (data && typeof data === 'object' && 'success' in data && data.success === false) {
        const msg =
          'message' in data && data.message
            ? String(data.message)
            : 'Import rejected by server.';
        throw new Error(msg);
      }

      trackSteamEvent('steam_sync', { imported: lines.length });
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Steam import error:', err);
      setError(getErrorMessage(err, 'Failed to import items.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 bg-steam-bg/80 backdrop-blur-sm">
      <div className="bg-steam-bg w-full max-w-3xl rounded-2xl border border-steam-border shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-steam-border flex justify-between items-center bg-steam-elevated shrink-0">
          <div>
            <h2 className="text-xl font-bold text-steam-text">Import from Steam</h2>
            <p className="text-xs text-steam-secondary mt-0.5">
              {items.length} matched in catalog
              {skippedUnknown > 0 ? ` · ${skippedUnknown} unknown skipped` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-steam-secondary hover:text-steam-text hover:bg-steam-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-steam-border/60 space-y-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name…"
              className="w-full bg-steam-elevated border border-steam-border rounded-xl pl-10 pr-3 py-2.5 text-sm text-steam-text placeholder:text-steam-tertiary focus:outline-none focus:border-steam-accent"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-steam-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={newOnly}
                onChange={(e) => setNewOnly(e.target.checked)}
                className="rounded border-steam-border"
              />
              New only
            </label>
            <button
              type="button"
              onClick={() => toggleAllVisible(true)}
              className="text-xs font-bold text-steam-accent hover:underline"
            >
              Select all visible
            </button>
            <button
              type="button"
              onClick={() => toggleAllVisible(false)}
              className="text-xs font-bold text-steam-tertiary hover:text-steam-secondary"
            >
              Clear
            </button>
            <span className="text-xs text-steam-tertiary ml-auto">
              {selectedCount} stacks · {selectedUnits} units
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar min-h-0">
          {filtered.length === 0 ? (
            <p className="text-sm text-steam-secondary text-center py-10">No items match.</p>
          ) : (
            filtered.map((item) => {
              const qty = selected[item.itemId] ?? 0;
              const checked = qty > 0;
              return (
                <div
                  key={item.itemId}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                    checked
                      ? 'border-steam-accent/40 bg-steam-accent/5'
                      : 'border-steam-border/50 bg-steam-elevated/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      setQty(item.itemId, item.quantity, e.target.checked ? item.quantity : 0)
                    }
                    className="rounded border-steam-border shrink-0"
                  />
                  <ItemImage
                    src={item.imageUrl}
                    alt={item.name}
                    wrapperClassName="w-10 h-10 rounded-lg shrink-0 bg-steam-bg"
                    className="max-w-[85%] max-h-[85%] object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-steam-text truncate">{item.name}</p>
                    <p className="text-[10px] text-steam-tertiary truncate">
                      {formatCurrency(item.currentPrice)}
                      {item.alreadyInPortfolio ? ' · in portfolio' : ''}
                      {' · '}×{item.quantity} on Steam
                    </p>
                  </div>
                  {checked && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setQty(item.itemId, item.quantity, qty - 1)}
                        className="p-1 rounded-md bg-steam-hover text-steam-secondary"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={item.quantity}
                        value={qty}
                        onChange={(e) =>
                          setQty(item.itemId, item.quantity, Number(e.target.value) || 0)
                        }
                        className="w-12 text-center bg-steam-bg border border-steam-border rounded-md text-sm py-1 text-steam-text"
                      />
                      <button
                        type="button"
                        onClick={() => setQty(item.itemId, item.quantity, qty + 1)}
                        className="p-1 rounded-md bg-steam-hover text-steam-secondary"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-steam-border space-y-3 shrink-0 bg-steam-elevated">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary mb-1.5 flex items-center gap-1">
                <Folder className="w-3 h-3" /> Collection
              </label>
              <CustomSelect
                value={collectionId}
                onChange={setCollectionId}
                options={[
                  { value: '', label: 'No collection' },
                  ...collections.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary mb-1.5 block">
                Buy date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-steam-bg border border-steam-border rounded-xl px-3 py-2.5 text-sm text-steam-text"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs font-medium text-steam-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={addToInvestments}
              onChange={(e) => setAddToInvestments(e.target.checked)}
              className="rounded border-steam-border"
            />
            Add as investments
          </label>

          {error && (
            <div className="flex items-start gap-2 text-sm text-amber-200 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="button"
            disabled={submitting || selectedCount === 0}
            onClick={() => void handleImport()}
            className="w-full bg-steam-accent hover:opacity-90 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Add selected ({selectedCount})
          </button>
        </div>
      </div>
    </div>
  );
};
