import React, { useEffect, useMemo, useState } from 'react';
import { Heart, Loader2, Trash2, RefreshCw, Save, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { ItemImage } from '@/components/ui/ItemImage';
import { formatCurrency, getRarityStyle } from '@/utils/display';

interface WishlistItemRow {
  wishlist_item_id: string;
  item_id: string;
  market_hash_name: string;
  icon_url: string | null;
  rarity: string | null;
  exterior: string | null;
  current_price: number | string | null;
  skinport_price: number | string | null;
  target_buy_price: number | string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'paused' | 'archived' | 'bought';
  note: string | null;
  created_at: string;
}

interface WishlistSummaryRow {
  items_count: number | string;
  est_cost_now: number | string;
  est_cost_target: number | string;
}

interface WishlistDraft {
  target: string;
  priority: 'low' | 'medium' | 'high';
}

const Wishlist = () => {
  const [items, setItems] = useState<WishlistItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [summary, setSummary] = useState<WishlistSummaryRow | null>(null);
  const [drafts, setDrafts] = useState<Record<string, WishlistDraft>>({});

  const toDraftMap = (rows: WishlistItemRow[]) =>
    rows.reduce<Record<string, WishlistDraft>>((acc, row) => {
      acc[row.item_id] = {
        target:
          row.target_buy_price == null || Number.isNaN(Number(row.target_buy_price))
            ? ''
            : Number(row.target_buy_price).toFixed(2),
        priority: row.priority,
      };
      return acc;
    }, {});

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);

    const [itemsRes, summaryRes] = await Promise.all([
      supabase.rpc('wishlist_list_items'),
      supabase.rpc('wishlist_summary'),
    ]);

    if (itemsRes.error) {
      setError(itemsRes.error.message || 'Could not load wishlist.');
      setItems([]);
      setSummary(null);
      setLoading(false);
      return;
    }

    if (summaryRes.error) {
      setError(summaryRes.error.message || 'Could not load wishlist summary.');
      setSummary(null);
    }

    const activeRows = ((itemsRes.data as WishlistItemRow[] | null) ?? []).filter(
      (row) => row.status === 'active',
    );
    setItems(activeRows);
    setDrafts(toDraftMap(activeRows));
    setSummary((((summaryRes.data as WishlistSummaryRow[] | null) ?? [])[0] ?? null) as WishlistSummaryRow | null);
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (itemId: string) => {
    setRemovingItemId(itemId);
    const { data, error: removeError } = await supabase.rpc('wishlist_remove_item', {
      p_item_id: itemId,
    });

    if (removeError) {
      setError(removeError.message || 'Failed to remove item from wishlist.');
      setRemovingItemId(null);
      return;
    }

    if (data === true) {
      setItems((prev) => prev.filter((row) => row.item_id !== itemId));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
    }

    setRemovingItemId(null);
  };

  const saveWishlistItem = async (row: WishlistItemRow) => {
    const draft = drafts[row.item_id];
    if (!draft) return;

    setSavingItemId(row.item_id);
    setError(null);

    const parsedTarget = draft.target.trim() === '' ? null : Number(draft.target);
    if (parsedTarget != null && (Number.isNaN(parsedTarget) || parsedTarget < 0)) {
      setError('Target price must be a valid positive number.');
      setSavingItemId(null);
      return;
    }

    const { error: saveError } = await supabase.rpc('wishlist_add_item', {
      p_item_id: row.item_id,
      p_target_buy_price: parsedTarget,
      p_priority: draft.priority,
      p_note: row.note,
    });

    if (saveError) {
      setError(saveError.message || 'Failed to save wishlist item settings.');
      setSavingItemId(null);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.item_id === row.item_id
          ? {
              ...item,
              target_buy_price: parsedTarget,
              priority: draft.priority,
            }
          : item,
      ),
    );

    const { data: summaryData } = await supabase.rpc('wishlist_summary');
    setSummary((((summaryData as WishlistSummaryRow[] | null) ?? [])[0] ?? null) as WishlistSummaryRow | null);
    setSavingItemId(null);
  };

  const hasDraftChanges = (row: WishlistItemRow) => {
    const draft = drafts[row.item_id];
    if (!draft) return false;

    const rowTarget = row.target_buy_price == null ? '' : Number(row.target_buy_price).toFixed(2);
    const draftTarget = draft.target.trim() === '' ? '' : Number(draft.target).toFixed(2);
    return draft.priority !== row.priority || draftTarget !== rowTarget;
  };

  const totals = useMemo(() => {
    if (!summary) {
      return {
        itemsCount: items.length,
        estNow: items.reduce((acc, row) => acc + Number(row.current_price ?? 0), 0),
        estTarget: items.reduce(
          (acc, row) => acc + Number(row.target_buy_price ?? row.current_price ?? 0),
          0,
        ),
      };
    }

    return {
      itemsCount: Number(summary.items_count ?? 0),
      estNow: Number(summary.est_cost_now ?? 0),
      estTarget: Number(summary.est_cost_target ?? 0),
    };
  }, [items, summary]);

  return (
    <div className="text-steam-text animate-fade-in pb-10 min-w-0 overflow-x-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-steam-text mb-1">Wishlist</h1>
          <p className="text-steam-secondary">Track target entries and monitor desired items.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-steam-border text-sm text-steam-secondary hover:text-steam-text hover:bg-steam-card"
          >
            <Plus className="w-4 h-4" /> Add more
          </Link>
          <button
            type="button"
            onClick={fetchWishlist}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-steam-border text-sm text-steam-secondary hover:text-steam-text hover:bg-steam-card"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-steam-card rounded-2xl p-5 border border-steam-border">
          <p className="text-steam-tertiary text-[10px] font-bold uppercase tracking-wider mb-1">Items</p>
          <p className="text-2xl font-bold">{totals.itemsCount}</p>
        </div>
        <div className="bg-steam-card rounded-2xl p-5 border border-steam-border">
          <p className="text-steam-tertiary text-[10px] font-bold uppercase tracking-wider mb-1">Est. Cost Now</p>
          <p className="text-2xl font-bold font-mono">{formatCurrency(totals.estNow)}</p>
        </div>
        <div className="bg-steam-card rounded-2xl p-5 border border-steam-border">
          <p className="text-steam-tertiary text-[10px] font-bold uppercase tracking-wider mb-1">Est. Target Cost</p>
          <p className="text-2xl font-bold font-mono">{formatCurrency(totals.estTarget)}</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-steam-card rounded-2xl border border-steam-border p-16 text-center">
          <Loader2 className="w-8 h-8 mx-auto text-steam-accent animate-spin mb-4" />
          <p className="text-sm text-steam-secondary">Loading wishlist...</p>
        </div>
      ) : error ? (
        <div className="bg-steam-card rounded-2xl border border-red-500/30 p-8 text-center">
          <h3 className="text-xl font-bold text-red-400 mb-2">Wishlist error</h3>
          <p className="text-sm text-steam-secondary">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-steam-card rounded-2xl border border-steam-border p-14 text-center">
          <Heart className="w-12 h-12 mx-auto text-steam-tertiary mb-4" />
          <h3 className="text-xl font-bold text-steam-text mb-2">Wishlist is empty</h3>
          <p className="text-steam-tertiary text-sm">Add items from Catalog to start tracking opportunities.</p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-xl border border-steam-border text-sm text-steam-secondary hover:text-steam-text hover:bg-steam-surface"
          >
            <Plus className="w-4 h-4" /> Add from Catalog
          </Link>
        </div>
      ) : (
        <div className="bg-steam-card rounded-2xl border border-steam-border shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-steam-surface text-steam-tertiary text-xs font-bold uppercase tracking-wider border-b border-steam-border">
                  <th className="p-4 pl-6">Item</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4 text-right">Current</th>
                  <th className="p-4 text-right">Target</th>
                  <th className="p-4 text-right">Delta</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => {
                  const rarityStyle = getRarityStyle(row.rarity);
                  const draft = drafts[row.item_id];
                  const currentPrice = Number(row.current_price ?? 0);
                  const draftTarget =
                    draft?.target && !Number.isNaN(Number(draft.target))
                      ? Number(draft.target)
                      : null;
                  const rowTarget =
                    row.target_buy_price != null && !Number.isNaN(Number(row.target_buy_price))
                      ? Number(row.target_buy_price)
                      : null;
                  const targetPrice = draftTarget ?? rowTarget;
                  const hasTarget = targetPrice != null && targetPrice > 0;
                  const delta = hasTarget ? currentPrice - targetPrice : null;
                  const ratio = hasTarget ? currentPrice / targetPrice : null;
                  const deltaPercent = hasTarget ? ((currentPrice - targetPrice) / targetPrice) * 100 : null;
                  const deltaToneClass =
                    delta == null
                      ? 'text-steam-tertiary'
                      : delta <= 0
                        ? 'text-green-400'
                        : ratio != null && ratio <= 1.15
                          ? 'text-amber-400'
                          : 'text-red-400';

                  return (
                    <tr
                      key={row.wishlist_item_id}
                      className="border-b border-steam-border/70 hover:bg-steam-surface/60 transition-colors"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-14 h-10 rounded-md overflow-hidden border-b-2 ${rarityStyle.border}`}>
                            <ItemImage
                              src={row.icon_url}
                              alt={row.market_hash_name}
                              className="max-w-full max-h-full object-contain"
                              wrapperClassName="w-full h-full"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-steam-text">{row.market_hash_name}</p>
                            <p className="text-xs text-steam-tertiary">{row.exterior || 'Any exterior'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={draft?.priority ?? row.priority}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [row.item_id]: {
                                target: prev[row.item_id]?.target ?? '',
                                priority: e.target.value as WishlistDraft['priority'],
                              },
                            }))
                          }
                          onBlur={() => {
                            if (hasDraftChanges(row)) saveWishlistItem(row);
                          }}
                          className="px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border bg-steam-bg border-steam-border"
                        >
                          <option value="high">high</option>
                          <option value="medium">medium</option>
                          <option value="low">low</option>
                        </select>
                      </td>
                      <td className="p-4 text-right font-mono text-sm">{formatCurrency(currentPrice)}</td>
                      <td className="p-4 text-right">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={draft?.target ?? ''}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [row.item_id]: {
                                target: e.target.value,
                                priority: prev[row.item_id]?.priority ?? row.priority,
                              },
                            }))
                          }
                          onBlur={() => {
                            if (hasDraftChanges(row)) saveWishlistItem(row);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && hasDraftChanges(row)) {
                              e.preventDefault();
                              saveWishlistItem(row);
                            }
                          }}
                          className="w-28 bg-steam-bg border border-steam-border rounded-lg px-2 py-1 text-right font-mono text-sm focus:outline-none focus:border-steam-accent"
                        />
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className={`font-mono text-sm font-bold ${deltaToneClass}`}>
                            {delta == null ? '--' : `${delta > 0 ? '+' : ''}${formatCurrency(delta)}`}
                          </span>
                          <span className={`text-[11px] font-mono ${deltaToneClass}`}>
                            {deltaPercent == null ? 'set target' : `${deltaPercent > 0 ? '+' : ''}${deltaPercent.toFixed(1)}% vs target`}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => saveWishlistItem(row)}
                            disabled={savingItemId === row.item_id || !hasDraftChanges(row)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-steam-border text-xs text-steam-secondary hover:text-steam-text disabled:opacity-50"
                          >
                            {savingItemId === row.item_id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Save className="w-3 h-3" />
                            )}
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(row.item_id)}
                            disabled={removingItemId === row.item_id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-steam-border text-xs text-steam-secondary hover:text-red-400 disabled:opacity-50"
                          >
                            {removingItemId === row.item_id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default Wishlist;
