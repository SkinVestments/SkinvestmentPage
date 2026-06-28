import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { createPortal } from 'react-dom';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Search,
  Loader2,
  Minus,
  Plus,
  Calendar,
  Folder,
  TrendingUp,
  Percent,
  AlertCircle,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import { ItemImage } from '@/components/ui/ItemImage';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { formatCurrency } from '@/utils/display';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ItemRef {
  id: string;
  market_hash_name: string;
  icon_url: string | null;
  marketPrice: number;
  ownedQty: number;
  avgBuyPrice: number;
}

interface CartLine {
  key: string;
  item: ItemRef;
  quantity: number;
  price: string;
}

interface CollectionRow {
  id: string;
  name: string;
}

interface Cs2SearchItem {
  id: string;
  market_hash_name: string;
  icon_url: string | null;
  price: number;
}

const PORTFOLIO_PREVIEW = 8;
const CSGO_RELEASE_DATE = '2012-08-21';
const CSGO_RELEASE_DATE_OBJ = new Date('2012-08-21T00:00:00');
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

const newLineKey = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `line-${Date.now()}-${Math.random()}`;

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const datePopoverRef = useRef<HTMLDivElement | null>(null);

  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [cart, setCart] = useState<CartLine[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Cs2SearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [portfolio, setPortfolio] = useState<ItemRef[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [portfolioFilter, setPortfolioFilter] = useState('');
  const [showAllPortfolio, setShowAllPortfolio] = useState(false);

  const [date, setDate] = useState(() => formatInputDate(new Date()));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [datePickerPosition, setDatePickerPosition] = useState({ top: 0, left: 0 });
  const [collectionId, setCollectionId] = useState('');
  const [isInvestment, setIsInvestment] = useState(true);
  const [applySteamFee, setApplySteamFee] = useState(true);

  const [collections, setCollections] = useState<CollectionRow[]>([]);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isBuy = type === 'BUY';

  const ownershipMap = useMemo(() => {
    const map = new Map<string, number>();
    portfolio.forEach((p) => map.set(p.id, p.ownedQty));
    return map;
  }, [portfolio]);

  const cartQtyByItem = useMemo(() => {
    const map = new Map<string, number>();
    cart.forEach((line) => {
      map.set(line.item.id, (map.get(line.item.id) ?? 0) + line.quantity);
    });
    return map;
  }, [cart]);

  const resetForm = useCallback(() => {
    setType('BUY');
    setCart([]);
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
    setPortfolioFilter('');
    setShowAllPortfolio(false);
    setDate(formatInputDate(new Date()));
    setIsDatePickerOpen(false);
    setIsInvestment(true);
    setApplySteamFee(true);
    setSubmitError(null);
  }, []);

  const selectedDate = useMemo(() => {
    const parsed = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [date]);

  const formattedDate = useMemo(
    () =>
      selectedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    [selectedDate],
  );

  const updateDatePickerPosition = useCallback(() => {
    if (!datePickerRef.current) return;
    const rect = datePickerRef.current.getBoundingClientRect();
    const calendarWidth = 320;
    const viewportWidth = window.innerWidth;
    const left = Math.min(
      Math.max(12, rect.right - calendarWidth),
      Math.max(12, viewportWidth - calendarWidth - 12),
    );
    setDatePickerPosition({
      top: rect.bottom + 8,
      left,
    });
  }, []);

  useEffect(() => {
    if (!isDatePickerOpen) return;
    updateDatePickerPosition();

    const onOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedTrigger = datePickerRef.current?.contains(target);
      const clickedPopover = datePopoverRef.current?.contains(target);
      if (!clickedTrigger && !clickedPopover) {
        setIsDatePickerOpen(false);
      }
    };

    const onScrollOrResize = () => updateDatePickerPosition();

    document.addEventListener('mousedown', onOutsideClick);
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);
    return () => {
      document.removeEventListener('mousedown', onOutsideClick);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [isDatePickerOpen, updateDatePickerPosition]);

  const switchType = (next: 'BUY' | 'SELL') => {
    setType(next);
    setCart([]);
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
    setPortfolioFilter('');
    setShowAllPortfolio(false);
    setSubmitError(null);
  };

  const fetchPortfolio = useCallback(async () => {
    if (!user) return;
    setPortfolioLoading(true);
    setPortfolioError(null);
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select(
          `
          item_id,
          quantity,
          buy_price,
          cs2_items ( id, market_hash_name, icon_url, price )
        `,
        )
        .eq('user_id', user.id)
        .gt('quantity', 0);

      if (error) throw error;

      type AggregatedItem = ItemRef & { totalCost: number };
      const byItem = new Map<string, AggregatedItem>();
      (data ?? []).forEach((row: Record<string, unknown>) => {
        const cs2 = row.cs2_items as Record<string, unknown> | null;
        const itemId = String(row.item_id ?? cs2?.id ?? '');
        if (!itemId) return;

        const qty = Number(row.quantity ?? 0);
        const buyPrice = Number(row.buy_price ?? 0);
        const rowCost = qty * buyPrice;
        const existing = byItem.get(itemId);
        if (existing) {
          existing.ownedQty += qty;
          existing.totalCost += rowCost;
          existing.avgBuyPrice = existing.ownedQty > 0 ? existing.totalCost / existing.ownedQty : 0;
          return;
        }

        byItem.set(itemId, {
          id: itemId,
          market_hash_name: String(cs2?.market_hash_name ?? 'Unknown item'),
          icon_url: cs2?.icon_url != null ? String(cs2.icon_url) : null,
          marketPrice: Number(cs2?.price ?? 0),
          ownedQty: qty,
          avgBuyPrice: qty > 0 ? rowCost / qty : 0,
          totalCost: rowCost,
        });
      });

      const list = Array.from(byItem.values())
        .map(({ totalCost: _totalCost, ...item }) => item)
        .sort((a, b) => a.market_hash_name.localeCompare(b.market_hash_name));
      setPortfolio(list);
    } catch (err) {
      console.error('Portfolio load error:', err);
      setPortfolioError(getErrorMessage(err, 'Could not load your portfolio.'));
      setPortfolio([]);
    } finally {
      setPortfolioLoading(false);
    }
  }, [user]);

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
    if (!isOpen || isBuy) return;
    fetchPortfolio();
  }, [isOpen, isBuy, fetchPortfolio]);

  useEffect(() => {
    if (!isOpen || !isBuy) return;

    const searchItems = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setSearchError(null);
        return;
      }
      setIsSearching(true);
      setSearchError(null);
      try {
        const { data, error } = await supabase
          .from('cs2_items')
          .select('id, market_hash_name, icon_url, price')
          .ilike('market_hash_name', `%${searchQuery}%`)
          .limit(12);

        if (error) throw error;
        setSearchResults((data as Cs2SearchItem[]) ?? []);
      } catch (err) {
        setSearchResults([]);
        setSearchError(getErrorMessage(err, 'Search failed. Try again.'));
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchItems, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, isOpen, isBuy]);

  const filteredPortfolio = useMemo(() => {
    const q = portfolioFilter.trim().toLowerCase();
    if (!q) return portfolio;
    return portfolio.filter((p) => p.market_hash_name.toLowerCase().includes(q));
  }, [portfolio, portfolioFilter]);

  const visiblePortfolio = showAllPortfolio
    ? filteredPortfolio
    : filteredPortfolio.slice(0, PORTFOLIO_PREVIEW);

  const addToCart = (item: ItemRef) => {
    setSubmitError(null);

    if (!isBuy) {
      const owned = ownershipMap.get(item.id) ?? item.ownedQty;
      const inCart = cartQtyByItem.get(item.id) ?? 0;
      if (inCart >= owned) {
        setSubmitError(`You only own ${owned}× ${item.market_hash_name}.`);
        return;
      }
    }

    setCart((prev) => {
      const existing = prev.find((l) => l.item.id === item.id);
      if (existing) {
        const maxQ = !isBuy ? (ownershipMap.get(item.id) ?? item.ownedQty) : Infinity;
        const nextQ = Math.min(maxQ, existing.quantity + 1);
        return prev.map((l) =>
          l.item.id === item.id ? { ...l, quantity: nextQ } : l,
        );
      }
      return [
        ...prev,
        {
          key: newLineKey(),
          item,
          quantity: 1,
          price: item.marketPrice > 0 ? item.marketPrice.toFixed(2) : '',
        },
      ];
    });
  };

  const updateLine = (key: string, patch: Partial<Pick<CartLine, 'quantity' | 'price'>>) => {
    setSubmitError(null);
    setCart((prev) =>
      prev.map((line) => {
        if (line.key !== key) return line;
        let quantity = patch.quantity ?? line.quantity;
        quantity = Math.floor(quantity);
        if (!isBuy) {
          const maxQ = ownershipMap.get(line.item.id) ?? line.item.ownedQty;
          quantity = Math.min(maxQ, Math.max(1, quantity));
        } else {
          quantity = Math.max(1, quantity);
        }
        return {
          ...line,
          ...patch,
          quantity,
        };
      }),
    );
  };

  const removeLine = (key: string) => {
    setCart((prev) => prev.filter((l) => l.key !== key));
    setSubmitError(null);
  };

  const validateCart = (): string | null => {
    if (cart.length === 0) return 'Add at least one item to the list.';
    if (!date) return 'Select a transaction date.';
    if (Number.isNaN(new Date(date).getTime())) return 'Invalid date.';
    if (collections.length > 0 && !collectionId) return 'Select a collection.';

    for (const line of cart) {
      const unitPrice = parseFloat(line.price);
      if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
        return `Enter a valid price for ${line.item.market_hash_name}.`;
      }
      if (line.quantity < 1) {
        return `Invalid quantity for ${line.item.market_hash_name}.`;
      }
    }

    if (!isBuy) {
      for (const [itemId, owned] of ownershipMap) {
        const sellQty = cartQtyByItem.get(itemId) ?? 0;
        if (sellQty > owned) {
          const name = portfolio.find((p) => p.id === itemId)?.market_hash_name ?? 'item';
          return `Cannot sell ${sellQty}× ${name}. You own ${owned}.`;
        }
      }
      for (const line of cart) {
        const owned = ownershipMap.get(line.item.id);
        if (owned === undefined || owned <= 0) {
          return `${line.item.market_hash_name} is not in your portfolio.`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError('You must be signed in.');
      return;
    }

    const validationError = validateCart();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    const transactions = cart.map((line) => {
      const unitPrice = parseFloat(line.price);
      const fee =
        type === 'SELL' && applySteamFee ? unitPrice * line.quantity * 0.13 : 0;
      const avgBuyPrice = line.item.avgBuyPrice || 0;
      const realizedProfit =
        type === 'SELL'
          ? unitPrice * line.quantity - avgBuyPrice * line.quantity - fee
          : 0;
      return {
        item_id: line.item.id,
        quantity: line.quantity,
        price: unitPrice,
        type,
        is_investment: type === 'BUY' ? isInvestment : false,
        transaction_date: new Date(date).toISOString(),
        collection_id: collectionId || '',
        fee_deducted: fee,
        realized_profit: realizedProfit,
      };
    });

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { data, error } = await supabase.rpc('add_transactions_bulk', {
        p_user_id: user.id,
        p_transactions: transactions,
      });

      if (error) throw error;

      if (data && typeof data === 'object' && 'success' in data && data.success === false) {
        const msg =
          'message' in data && data.message
            ? String(data.message)
            : 'Transaction rejected by server.';
        throw new Error(msg);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Transaction error:', err);
      setSubmitError(getErrorMessage(err, 'Failed to save. Check quantities and try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const cartTotal = cart.reduce(
    (sum, line) => sum + (parseFloat(line.price) || 0) * line.quantity,
    0,
  );
  const canSubmit = cart.length > 0 && !isSubmitting;
  const hiddenPortfolioCount = Math.max(0, filteredPortfolio.length - PORTFOLIO_PREVIEW);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:pl-[17.5rem]">
      <div className="absolute inset-0 bg-steam-bg/80 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div
        className="relative z-10 bg-steam-card rounded-2xl w-full max-w-4xl max-h-[min(92vh,880px)] shadow-2xl overflow-hidden flex flex-col border border-steam-border"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-add-title"
      >
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-steam-border shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="p-2 -ml-1 rounded-lg text-steam-secondary hover:text-steam-text hover:bg-steam-hover"
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
            className="text-sm font-bold text-steam-tertiary hover:text-steam-accent px-2 py-1"
          >
            Reset
          </button>
        </div>

        <div className="px-5 sm:px-6 pt-4 shrink-0">
          <div className="flex bg-steam-bg p-1 rounded-xl border border-steam-border">
            <button
              type="button"
              onClick={() => switchType('BUY')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                isBuy ? 'bg-green-500 text-white shadow-md' : 'text-steam-tertiary hover:text-steam-secondary'
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => switchType('SELL')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                !isBuy ? 'bg-red-500 text-white shadow-md' : 'text-steam-tertiary hover:text-steam-secondary'
              }`}
            >
              SELL
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* Sidebar: portfolio (sell) or market search (buy) */}
          <aside className="lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-steam-border flex flex-col max-h-[38vh] lg:max-h-none min-h-0">
            <div className="p-4 pb-2 shrink-0">
              <label className="block text-[10px] font-bold text-steam-tertiary uppercase tracking-wider mb-2">
                {isBuy ? 'Market search' : 'Your portfolio'}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary pointer-events-none" />
                <input
                  type="text"
                  value={isBuy ? searchQuery : portfolioFilter}
                  onChange={(e) => {
                    setSubmitError(null);
                    if (isBuy) setSearchQuery(e.target.value);
                    else setPortfolioFilter(e.target.value);
                  }}
                  placeholder={isBuy ? 'Search skins…' : 'Search your portfolio…'}
                  className="w-full bg-steam-bg border border-steam-border text-steam-text rounded-xl py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-steam-accent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-3 min-h-0">
              {isBuy ? (
                <>
                  {searchQuery.length < 2 && (
                    <p className="text-xs text-steam-tertiary px-2 py-4 text-center">
                      Type at least 2 characters to search the market.
                    </p>
                  )}
                  {searchQuery.length >= 2 && isSearching && (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-steam-accent" />
                    </div>
                  )}
                  {searchError && (
                    <p className="text-xs text-red-400 px-2 py-2">{searchError}</p>
                  )}
                  {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && !searchError && (
                    <p className="text-xs text-steam-tertiary px-2 py-4 text-center">No items found.</p>
                  )}
                  <ul className="space-y-1">
                    {searchResults.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() =>
                            addToCart({
                              id: item.id,
                              market_hash_name: item.market_hash_name,
                              icon_url: item.icon_url,
                              marketPrice: Number(item.price ?? 0),
                              ownedQty: 0,
                            })
                          }
                          className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-steam-hover text-left transition-colors"
                        >
                          <ItemImage
                            src={item.icon_url}
                            alt={item.market_hash_name}
                            className="w-9 h-9 object-contain"
                            wrapperClassName="w-9 h-9 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-steam-text truncate">
                              {item.market_hash_name}
                            </p>
                            <p className="text-[10px] text-steam-tertiary">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <Plus className="w-4 h-4 text-steam-accent shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  {portfolioLoading && (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-steam-accent" />
                    </div>
                  )}
                  {portfolioError && (
                    <p className="text-xs text-red-400 px-2 py-2">{portfolioError}</p>
                  )}
                  {!portfolioLoading && !portfolioError && portfolio.length === 0 && (
                    <p className="text-xs text-steam-tertiary px-2 py-4 text-center">
                      Nothing to sell — your portfolio is empty.
                    </p>
                  )}
                  <ul className="space-y-1">
                    {visiblePortfolio.map((item) => {
                      const inCart = cartQtyByItem.get(item.id) ?? 0;
                      const atMax = inCart >= item.ownedQty;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            disabled={atMax}
                            onClick={() => addToCart(item)}
                            className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
                              atMax
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-steam-hover'
                            }`}
                          >
                            <ItemImage
                              src={item.icon_url}
                              alt={item.market_hash_name}
                              className="w-9 h-9 object-contain"
                              wrapperClassName="w-9 h-9 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-steam-text truncate">
                                {item.market_hash_name}
                              </p>
                              <p className="text-[10px] text-steam-tertiary tabular-nums">
                                {item.ownedQty} available
                                {inCart > 0 ? ` · ${inCart} in list` : ''}
                              </p>
                            </div>
                            {!atMax && <Plus className="w-4 h-4 text-red-400 shrink-0" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {!showAllPortfolio && hiddenPortfolioCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAllPortfolio(true)}
                      className="w-full mt-2 py-2 text-xs font-bold text-red-400 hover:text-red-300"
                    >
                      See all ({filteredPortfolio.length})
                    </button>
                  )}
                </>
              )}
            </div>
          </aside>

          {/* Main: cart + options */}
          <div className="flex-1 flex flex-col min-h-0 min-w-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar px-5 sm:px-6 py-4 space-y-4">
              {collectionsError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{collectionsError}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-steam-tertiary uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Transaction list ({cart.length})
                  </label>
                </div>

                {cart.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-steam-border bg-steam-bg/50 p-8 text-center">
                    <p className="text-sm text-steam-secondary font-medium">List is empty</p>
                    <p className="text-xs text-steam-tertiary mt-1">
                      {isBuy
                        ? 'Search the market and tap + to add skins.'
                        : 'Pick items from your portfolio on the left.'}
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {cart.map((line) => {
                      const maxQ = !isBuy
                        ? (ownershipMap.get(line.item.id) ?? line.item.ownedQty)
                        : undefined;
                      const lineTotal = (parseFloat(line.price) || 0) * line.quantity;

                      return (
                        <li
                          key={line.key}
                          className="bg-steam-bg border border-steam-border rounded-xl p-3 space-y-2"
                        >
                          <div className="flex items-start gap-2">
                            <ItemImage
                              src={line.item.icon_url}
                              alt={line.item.market_hash_name}
                              className="w-10 h-10 object-contain"
                              wrapperClassName="w-10 h-10 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-steam-text truncate">
                                {line.item.market_hash_name}
                              </p>
                              {!isBuy && (
                                <p className="text-[10px] text-steam-tertiary">
                                  Own {maxQ}
                                  {maxQ !== undefined && line.quantity >= maxQ
                                    ? ' · max in list'
                                    : ''}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLine(line.key)}
                              className="p-1.5 rounded-lg text-steam-tertiary hover:text-red-400 hover:bg-red-500/10"
                              aria-label="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex gap-2">
                            <div className="flex items-center bg-steam-card border border-steam-border rounded-lg">
                              <button
                                type="button"
                                onClick={() => updateLine(line.key, { quantity: line.quantity - 1 })}
                                className="p-2 text-steam-secondary hover:text-steam-text"
                                aria-label="Decrease"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <input
                                type="number"
                                min={1}
                                max={!isBuy && maxQ !== undefined ? maxQ : undefined}
                                step={1}
                                value={line.quantity}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  const next = Number(raw);
                                  if (!Number.isFinite(next)) return;
                                  updateLine(line.key, { quantity: next });
                                }}
                                className="w-16 bg-transparent px-1 text-center text-sm font-bold font-mono tabular-nums text-steam-text [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
                                aria-label="Quantity"
                              />
                              <button
                                type="button"
                                onClick={() => updateLine(line.key, { quantity: line.quantity + 1 })}
                                disabled={!isBuy && maxQ !== undefined && line.quantity >= maxQ}
                                className="p-2 text-steam-secondary hover:text-steam-text disabled:opacity-30"
                                aria-label="Increase"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex-1 relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-steam-tertiary text-sm font-bold">
                                $
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={line.price}
                                onChange={(e) => updateLine(line.key, { price: e.target.value })}
                                className="w-full bg-steam-card border border-steam-border rounded-lg py-2 pl-7 pr-2 text-sm font-mono font-bold text-right text-steam-text focus:outline-none focus:border-steam-accent"
                              />
                            </div>
                            <div className="flex items-center text-xs font-bold text-steam-secondary font-mono min-w-[4.5rem] justify-end">
                              {formatCurrency(lineTotal)}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="bg-steam-bg border border-steam-border rounded-xl overflow-visible divide-y divide-steam-border/60">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="flex items-center gap-2 text-steam-secondary">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Date</span>
                  </div>
                  <div className="relative" ref={datePickerRef}>
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen((prev) => !prev)}
                      className="min-w-[132px] inline-flex items-center justify-between gap-2 rounded-lg border border-steam-border bg-steam-card px-3 py-1.5 text-sm font-bold text-steam-text hover:border-steam-accent/60 focus:outline-none"
                    >
                      <span>{formattedDate}</span>
                      <Calendar className="w-3.5 h-3.5 text-steam-tertiary" />
                    </button>

                    {isDatePickerOpen &&
                      createPortal(
                        <div
                          ref={datePopoverRef}
                          className="fixed z-[220] rounded-xl border border-steam-border bg-steam-surface p-3 shadow-2xl"
                          style={{ top: `${datePickerPosition.top}px`, left: `${datePickerPosition.left}px` }}
                        >
                          <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={(pickedDate) => {
                              if (!pickedDate) return;
                              const safeDate = new Date(pickedDate);
                              safeDate.setHours(0, 0, 0, 0);
                              setDate(formatInputDate(safeDate));
                              setSubmitError(null);
                              setIsDatePickerOpen(false);
                            }}
                            fromDate={CSGO_RELEASE_DATE_OBJ}
                            toDate={new Date()}
                            captionLayout="dropdown"
                            startMonth={CSGO_RELEASE_DATE_OBJ}
                            endMonth={new Date()}
                            className="text-sm"
                            classNames={{
                              root: 'text-steam-text',
                              month: 'space-y-2',
                              month_caption: 'relative flex items-center justify-center pb-1',
                              caption_label: 'sr-only',
                              dropdowns:
                                'flex items-center justify-center gap-2 text-sm font-bold text-steam-text',
                              dropdown_root: 'relative',
                              dropdown:
                                'bg-steam-card border border-steam-border rounded-md px-2 py-1 text-xs font-bold text-steam-text focus:outline-none',
                              nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
                              button_previous:
                                'inline-flex h-7 w-7 items-center justify-center rounded-md border border-steam-border bg-steam-card text-steam-secondary hover:text-steam-text',
                              button_next:
                                'inline-flex h-7 w-7 items-center justify-center rounded-md border border-steam-border bg-steam-card text-steam-secondary hover:text-steam-text',
                              month_grid: 'w-full border-collapse',
                              weekdays: 'text-steam-tertiary',
                              weekday: 'h-8 w-9 text-[10px] font-bold uppercase',
                              week: '',
                              day: 'h-9 w-9 p-0 text-center',
                              day_button:
                                'h-9 w-9 rounded-md text-sm font-medium text-steam-text hover:bg-steam-hover',
                              selected: 'bg-steam-accent text-white hover:bg-steam-accent',
                              today: 'border border-steam-accent/40',
                              outside: 'text-steam-tertiary/40',
                              disabled: 'text-steam-tertiary/40 pointer-events-none',
                            }}
                          />
                        </div>,
                        document.body,
                      )}
                  </div>
                </div>
                <div className="px-4 py-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-steam-secondary">
                    <Folder className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium">Vault / collection</span>
                  </div>
                  {collections.length > 0 ? (
                    <CustomSelect
                      value={collectionId}
                      onChange={(v) => {
                        setCollectionId(v);
                        setSubmitError(null);
                      }}
                      options={collections.map((c) => ({ value: c.id, label: c.name }))}
                      placeholder="Choose vault…"
                      aria-label="Collection vault"
                      className="w-full"
                    />
                  ) : (
                    <p className="text-xs text-steam-tertiary py-2">No collections available</p>
                  )}
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  {isBuy ? (
                    <>
                      <div className="flex items-center gap-2 text-steam-secondary">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">Investments</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
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
                      <div className="flex items-center gap-2 text-steam-secondary">
                        <Percent className="w-4 h-4" />
                        <span className="text-sm font-medium">Steam fee 13%</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
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

            <div className="shrink-0 px-5 sm:px-6 py-4 border-t border-steam-border bg-steam-card space-y-3">
              {submitError && (
                <div
                  className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-steam-tertiary font-bold uppercase tracking-wider">
                  Total ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                </span>
                <span className="text-2xl font-bold text-steam-text font-mono tabular-nums">
                  {formatCurrency(cartTotal)}
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
                  `Confirm ${cart.length} purchase${cart.length === 1 ? '' : 's'}`
                ) : (
                  `Confirm ${cart.length} sale${cart.length === 1 ? '' : 's'}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
