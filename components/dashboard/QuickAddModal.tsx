import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { X, Search, Loader2, Minus, Plus, Calendar, Folder, TrendingUp, Percent, AlertCircle } from 'lucide-react';
import { ItemImage } from '@/components/ui/ItemImage';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Cs2SearchItem {
  id: string;
  market_hash_name: string;
  icon_url: string | null;
  price: number;
  rarity?: string | null;
}

interface CollectionRow {
  id: string;
  name: string;
}

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = String((err as { message?: string }).message);
    if (msg) return msg;
  }
  return fallback;
};

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();

  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Cs2SearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Cs2SearchItem | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [collectionId, setCollectionId] = useState('');

  const [isInvestment, setIsInvestment] = useState(true);
  const [applySteamFee, setApplySteamFee] = useState(true);

  const [collections, setCollections] = useState<CollectionRow[]>([]);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setType('BUY');
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
    setSelectedItem(null);
    setQuantity(1);
    setPrice('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsInvestment(true);
    setApplySteamFee(true);
    setSubmitError(null);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    resetForm();

    const fetchCollections = async () => {
      if (!user) return;
      setCollectionsError(null);
      const { data, error } = await supabase.rpc('get_collections', { p_user_id: user.id });
      if (error) {
        setCollectionsError(getErrorMessage(error, 'Could not load collections.'));
        setCollections([]);
        setCollectionId('');
        return;
      }
      const rows = (Array.isArray(data) ? data : []) as CollectionRow[];
      setCollections(rows);
      setCollectionId(rows[0]?.id ?? '');
    };

    fetchCollections();
  }, [user, isOpen, resetForm]);

  useEffect(() => {
    if (!isOpen) return;

    const searchItems = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        setSearchError(null);
        return;
      }
      setIsSearching(true);
      setSearchError(null);
      try {
        const { data, error } = await supabase
          .from('cs2_items')
          .select('id, market_hash_name, icon_url, price, rarity')
          .ilike('market_hash_name', `%${searchQuery}%`)
          .limit(5);

        if (error) throw error;
        setSearchResults((data as Cs2SearchItem[]) ?? []);
      } catch (err) {
        setSearchResults([]);
        setSearchError(getErrorMessage(err, 'Search failed. Try again.'));
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchItems, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, isOpen]);

  const handleSelectItem = (item: Cs2SearchItem) => {
    setSelectedItem(item);
    setPrice(item.price?.toString() ?? '');
    setSearchQuery('');
    setSearchResults([]);
    setSubmitError(null);
  };

  const validate = (): string | null => {
    if (!selectedItem) return 'Select an item to continue.';
    const unitPrice = parseFloat(price);
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      return 'Enter a valid unit price greater than 0.';
    }
    if (!date) return 'Select a transaction date.';
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return 'Invalid date.';
    if (collections.length > 0 && !collectionId) return 'Select a collection.';
    return null;
  };

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError('You must be signed in to add a transaction.');
      return;
    }

    const validationError = validate();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    if (!selectedItem) return;

    const unitPriceNum = parseFloat(price);
    const fee = type === 'SELL' && applySteamFee ? unitPriceNum * quantity * 0.13 : 0;

    const transaction = {
      item_id: selectedItem.id,
      quantity,
      price: unitPriceNum,
      type,
      is_investment: type === 'BUY' ? isInvestment : false,
      transaction_date: new Date(date).toISOString(),
      collection_id: collectionId || '',
      fee_deducted: fee,
      realized_profit: 0,
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { error } = await supabase.rpc('add_transactions_bulk', {
        p_user_id: user.id,
        p_transactions: [transaction],
      });

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Transaction error:', err);
      setSubmitError(getErrorMessage(err, 'Failed to save transaction. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const totalValue = (parseFloat(price) || 0) * quantity;
  const isBuy = type === 'BUY';
  const canSubmit = Boolean(selectedItem) && !isSubmitting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-steam-bg/80 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div
        className="relative z-10 bg-steam-card rounded-2xl w-full max-w-md max-h-[min(90vh,800px)] shadow-2xl overflow-hidden flex flex-col border border-steam-border animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-add-title"
      >
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 sm:py-5 border-b border-steam-border shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="p-2 -ml-1 rounded-lg text-steam-secondary hover:text-steam-text hover:bg-steam-hover transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 id="quick-add-title" className="text-lg font-bold text-steam-text">
            New Transaction
          </h2>
          <button
            type="button"
            onClick={resetForm}
            className="text-sm font-bold text-steam-tertiary hover:text-steam-accent transition-colors px-2 py-1"
          >
            Reset
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6 space-y-6 custom-scrollbar">
          {collectionsError && (
            <div
              className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{collectionsError}</p>
            </div>
          )}

          <div className="flex bg-steam-bg p-1 rounded-xl border border-steam-border">
            <button
              type="button"
              onClick={() => {
                setType('BUY');
                setSubmitError(null);
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                isBuy ? 'bg-green-500 text-white shadow-md' : 'text-steam-tertiary hover:text-steam-secondary'
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => {
                setType('SELL');
                setSubmitError(null);
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                !isBuy ? 'bg-red-500 text-white shadow-md' : 'text-steam-tertiary hover:text-steam-secondary'
              }`}
            >
              SELL
            </button>
          </div>

          <div className="relative">
            <label className="block text-[10px] font-bold text-steam-tertiary uppercase tracking-wider mb-2">
              Item
            </label>
            {!selectedItem ? (
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search skin (min. 3 characters)…"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSubmitError(null);
                  }}
                  className="w-full bg-steam-bg border border-steam-border text-steam-text rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-steam-accent transition-colors"
                />

                {searchQuery.length >= 3 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-steam-card border border-steam-border rounded-xl shadow-xl overflow-hidden z-20 max-h-56 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 flex justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-steam-accent" />
                      </div>
                    ) : searchError ? (
                      <div className="p-4 text-sm text-red-400">{searchError}</div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectItem(item)}
                          className="w-full p-3 flex items-center gap-3 hover:bg-steam-hover text-left border-b border-steam-border/50 last:border-0"
                        >
                          <ItemImage
                            src={item.icon_url}
                            alt={item.market_hash_name}
                            className="w-10 h-10 object-contain"
                            wrapperClassName="w-10 h-10 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-steam-text truncate">
                              {item.market_hash_name}
                            </p>
                            <p className="text-xs text-steam-tertiary">${item.price}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-steam-tertiary">No items found</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-steam-bg border border-steam-border rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <ItemImage
                    src={selectedItem.icon_url}
                    alt={selectedItem.market_hash_name}
                    className="w-12 h-12 object-contain"
                    wrapperClassName="w-12 h-12 shrink-0"
                  />
                  <p className="text-sm font-bold text-steam-text truncate">{selectedItem.market_hash_name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(null);
                    setSubmitError(null);
                  }}
                  className="p-2 rounded-lg text-steam-tertiary hover:text-steam-text hover:bg-steam-hover shrink-0"
                  aria-label="Clear selected item"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-steam-tertiary uppercase tracking-wider mb-2">
              Details
            </label>
            <div className="flex gap-3">
              <div className="flex-1 bg-steam-bg border border-steam-border rounded-xl flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-steam-secondary hover:text-steam-text hover:bg-steam-hover rounded-lg transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-steam-text text-lg font-mono tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-steam-secondary hover:text-steam-text hover:bg-steam-hover rounded-lg transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-[1.5] relative min-w-0">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-steam-tertiary font-bold pointer-events-none">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setSubmitError(null);
                  }}
                  placeholder="0.00"
                  className="w-full bg-steam-bg border border-steam-border text-steam-text rounded-xl py-3 pl-8 pr-4 focus:outline-none focus:border-steam-accent transition-colors font-mono text-lg font-bold text-right"
                />
              </div>
            </div>
          </div>

          <div className="bg-steam-bg border border-steam-border rounded-xl overflow-hidden divide-y divide-steam-border/60">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <div className="flex items-center gap-3 text-steam-secondary shrink-0">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Date</span>
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSubmitError(null);
                }}
                className="bg-transparent text-steam-text text-sm font-bold focus:outline-none cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <div className="flex items-center gap-3 text-steam-secondary shrink-0">
                <Folder className="w-4 h-4" />
                <span className="text-sm font-medium">Collection</span>
              </div>
              {collections.length > 0 ? (
                <select
                  value={collectionId}
                  onChange={(e) => {
                    setCollectionId(e.target.value);
                    setSubmitError(null);
                  }}
                  className="bg-steam-card border border-steam-border text-steam-text text-sm font-bold rounded-lg px-3 py-1.5 max-w-[55%] truncate focus:outline-none focus:border-steam-accent cursor-pointer"
                >
                  {collections.map((c) => (
                    <option key={c.id} value={c.id} className="bg-steam-card text-steam-text">
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xs text-steam-tertiary">No collections</span>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              {isBuy ? (
                <>
                  <div className="flex items-center gap-3 text-steam-secondary min-w-0">
                    <TrendingUp className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium">Add to Investments</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isInvestment}
                      onChange={() => setIsInvestment(!isInvestment)}
                    />
                    <div className="w-11 h-6 bg-steam-elevated rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-steam-card after:border after:border-steam-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-steam-accent" />
                  </label>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-steam-secondary min-w-0">
                    <Percent className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium">Steam Fee (13%)</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={applySteamFee}
                      onChange={() => setApplySteamFee(!applySteamFee)}
                    />
                    <div className="w-11 h-6 bg-steam-elevated rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-steam-card after:border after:border-steam-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500" />
                  </label>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 px-5 sm:px-6 py-4 sm:py-5 border-t border-steam-border bg-steam-card space-y-4">
          {submitError && (
            <div
              className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 -mb-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-steam-tertiary font-bold uppercase tracking-wider">Total</span>
            <span className="text-2xl font-bold text-steam-text font-mono tabular-nums">
              ${totalValue.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-colors flex items-center justify-center gap-2 ${
              !canSubmit
                ? 'opacity-50 cursor-not-allowed bg-steam-elevated text-steam-tertiary'
                : isBuy
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isBuy ? (
              'Confirm Purchase'
            ) : (
              'Confirm Sale'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
