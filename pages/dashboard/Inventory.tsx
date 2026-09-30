import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Plus,
  Package,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { formatCurrency, getRarityStyle } from '@/utils/display';
import { ItemImage } from '@/components/ui/ItemImage';
import {
  InventoryFilters,
  DEFAULT_INVENTORY_FILTERS,
  type InventoryFilterState,
} from '@/components/inventory/InventoryFilters';
import {
  countActiveFilters,
  getPnlStatus,
  isItemTradeLocked,
  normalizePriceSource,
  normalizeRarityTier,
} from '@/utils/inventoryFilters';
import { AdSlot } from '@/components/ads/AdSlot';
import { QuickAddModal } from '@/components/dashboard/QuickAddModal';
import { MarketCompareSummary } from '@/components/inventory/MarketCompareSummary';
import { MarketSpreadBadge } from '@/components/inventory/MarketPriceChips';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Shimmer } from '@/components/ui/Shimmer';
import { useMarketPrices } from '@/hooks/useMarketPrices';
import { usePublisherContentReady } from '@/hooks/usePublisherContentReady';

const INVENTORY_SORT_OPTIONS = [
  { value: 'value_desc', label: 'Highest Value' },
  { value: 'value_asc', label: 'Lowest Value' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'spread', label: 'Biggest spread' },
] as const;

const MARKET_COMPARE_LS_KEY = 'inventory_show_market_comparison';

function loadShowMarketCompare(): boolean {
  try {
    const raw = localStorage.getItem(MARKET_COMPARE_LS_KEY);
    if (raw == null) return true;
    return raw === '1' || raw === 'true';
  } catch {
    return true;
  }
}

// --- TYPY ---
interface InventoryItem {
  id: string;
  item_id: string;
  quantity: number;
  acquired_at: string;
  buy_price: number | null;
  trade_lock_until?: string | null;
  cs2_items: {
    market_hash_name: string;
    icon_url: string | null;
    price: number;
    rarity: string | null;
    type: string | null;
    price_source?: string | null;
  };
}

const Inventory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const adsContentReady = usePublisherContentReady();
  
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<
    'value_desc' | 'value_asc' | 'name' | 'recent' | 'spread'
  >('value_desc');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<InventoryFilterState>(DEFAULT_INVENTORY_FILTERS);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [showMarketCompare, setShowMarketCompare] = useState(loadShowMarketCompare);

  const marketItemIds = useMemo(() => items.map((i) => i.item_id), [items]);
  const {
    prices: marketPrices,
    loading: marketLoading,
    error: marketError,
  } = useMarketPrices(marketItemIds);

  useEffect(() => {
    try {
      localStorage.setItem(
        MARKET_COMPARE_LS_KEY,
        showMarketCompare ? '1' : '0',
      );
    } catch {
      /* ignore */
    }
  }, [showMarketCompare]);

  useEffect(() => {
    const state = location.state as { flash?: { type?: string; message?: string } } | null;
    const message = state?.flash?.message?.trim();
    if (!message) return;
    setFlashMessage(message);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (!flashMessage) return;
    const timer = window.setTimeout(() => setFlashMessage(null), 4500);
    return () => window.clearTimeout(timer);
  }, [flashMessage]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      if (!user) return;

      const { data, error } = await supabase
        .from('portfolio_items')
        .select(`
          id, item_id, quantity, acquired_at, buy_price,
          cs2_items ( market_hash_name, icon_url, price, rarity, type )
        `)
        .eq('user_id', user.id)
        .gt('quantity', 0);

      if (error) throw error;

      setItems((data as InventoryItem[]) ?? []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setItems([]);
      setFetchError('Could not load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [user]);

  const showPriceSourceFilter = useMemo(
    () => items.some((item) => item.cs2_items?.price_source),
    [items],
  );

  const filteredAndSortedItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return items
      .filter((item) => {
        const name = item.cs2_items?.market_hash_name?.toLowerCase() ?? '';
        if (q && !name.includes(q)) return false;

        const tier = normalizeRarityTier(item.cs2_items?.rarity);
        if (filters.rarity !== 'all' && tier !== filters.rarity) return false;

        const unitPrice = item.cs2_items?.price ?? 0;
        const { status: pnlStatus } = getPnlStatus(unitPrice, item.buy_price);
        if (filters.pnl !== 'all' && pnlStatus !== filters.pnl) return false;

        if (filters.priceSource !== 'all' && showPriceSourceFilter) {
          const src = normalizePriceSource(item.cs2_items?.price_source);
          if (src !== filters.priceSource) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const valA = (a.cs2_items?.price || 0) * a.quantity;
        const valB = (b.cs2_items?.price || 0) * b.quantity;

        switch (sortBy) {
          case 'value_desc':
            return valB - valA;
          case 'value_asc':
            return valA - valB;
          case 'name':
            return (a.cs2_items?.market_hash_name || '').localeCompare(
              b.cs2_items?.market_hash_name || '',
            );
          case 'recent':
            return new Date(b.acquired_at).getTime() - new Date(a.acquired_at).getTime();
          case 'spread': {
            const sa = marketPrices.get(a.item_id)?.spread_pct;
            const sb = marketPrices.get(b.item_id)?.spread_pct;
            const aMissing = sa == null || !Number.isFinite(sa);
            const bMissing = sb == null || !Number.isFinite(sb);
            if (aMissing && bMissing) return 0;
            if (aMissing) return 1;
            if (bMissing) return -1;
            // Biggest absolute discount first (most negative spread)
            return (sa as number) - (sb as number);
          }
          default:
            return 0;
        }
      });
  }, [items, searchQuery, filters, sortBy, showPriceSourceFilter, marketPrices]);

  const marketSummaryLines = useMemo(
    () =>
      filteredAndSortedItems.map((i) => ({
        item_id: i.item_id,
        quantity: i.quantity,
        steamUnitPrice: i.cs2_items?.price || 0,
      })),
    [filteredAndSortedItems],
  );

  const activeFilterCount = countActiveFilters(filters);

  const openItemDetail = (itemId: string) => {
    navigate(`/item/${itemId}`, { state: { from: '/inventory' } });
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalValue = items.reduce(
    (acc, item) => acc + (item.cs2_items?.price || 0) * item.quantity,
    0,
  );

  return (
    <div className="text-steam-text animate-fade-in pb-10 min-w-0 overflow-x-hidden">
      {flashMessage && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 rounded-xl theme-alert-success px-4 py-3 text-sm"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="flex-1 font-medium">
            <span className="font-bold">{flashMessage}</span>
          </p>
          <button
            type="button"
            onClick={() => setFlashMessage(null)}
            className="pressable p-1 rounded-lg text-steam-tertiary hover:text-steam-text hover:bg-steam-hover"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-steam-text mb-1">Inventory</h1>
          <p className="text-steam-secondary">Manage and browse your CS2 collection.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 bg-steam-card p-3 rounded-xl border border-steam-border shadow-lg w-full sm:w-auto">
           <div className="px-3 sm:px-4 border-r border-steam-border min-w-0">
              <p className="text-[10px] text-steam-tertiary font-bold uppercase tracking-wider mb-1">Total Items</p>
              <p className="text-xl font-bold text-steam-text">{totalItems}</p>
           </div>
           <div className="px-4">
              <p className="text-[10px] text-steam-tertiary font-bold uppercase tracking-wider mb-1">Total Value</p>
              <p className="num text-xl font-bold text-steam-text font-mono leading-tight">{formatCurrency(totalValue)}</p>
           </div>
           <button
              type="button"
              onClick={() => setIsQuickAddModalOpen(true)}
              title="Quick Add"
              aria-label="Quick Add"
              className="btn-dashboard-primary p-3 ml-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-bold pr-1">Quick Add</span>
           </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary" />
          <input 
            type="text" 
            placeholder="Search your inventory..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            className="w-full bg-steam-card border border-steam-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-steam-accent transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <span className="dashboard-label hidden sm:inline shrink-0">Market</span>
            <SegmentedControl
              aria-label="CS.MONEY market comparison"
              value={showMarketCompare ? 'on' : 'off'}
              onChange={(v) => setShowMarketCompare(v === 'on')}
              options={[
                { value: 'off', label: 'Off' },
                { value: 'on', label: 'Compare' },
              ]}
            />
          </div>

          <CustomSelect
            value={sortBy}
            onChange={(v) =>
              setSortBy(
                v as 'value_desc' | 'value_asc' | 'name' | 'recent' | 'spread',
              )
            }
            options={[...INVENTORY_SORT_OPTIONS]}
            aria-label="Sort inventory"
            className="flex-1 min-w-[160px] sm:flex-none sm:w-48"
          />

          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className={`relative bg-steam-card border p-2.5 rounded-xl transition-colors ${
              filtersOpen || activeFilterCount > 0
                ? 'border-steam-accent text-steam-accent'
                : 'border-steam-border text-steam-secondary hover:text-steam-text'
            }`}
            aria-expanded={filtersOpen}
            aria-label="Toggle filters"
          >
            <Filter className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-steam-accent text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <SegmentedControl
            aria-label="View mode"
            value={viewMode}
            onChange={setViewMode}
            options={[
              {
                value: 'grid',
                label: <LayoutGrid className="w-4 h-4" />,
                ariaLabel: 'Grid view',
              },
              {
                value: 'list',
                label: <ListIcon className="w-4 h-4" />,
                ariaLabel: 'List view',
              },
            ]}
          />
        </div>
      </div>

      <InventoryFilters
        open={filtersOpen}
        filters={filters}
        onChange={setFilters}
        onClose={() => setFiltersOpen(false)}
        showPriceSourceFilter={showPriceSourceFilter}
        resultCount={filteredAndSortedItems.length}
        totalCount={items.length}
      />

      <AdSlot
        slotKey="inventory"
        className="mb-6"
        contentReady={!loading && items.length > 0 && adsContentReady}
      />

      {fetchError && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl theme-alert-error px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm text-steam-text">{fetchError}</p>
          </div>
          <button
            type="button"
            onClick={() => void fetchInventory()}
            className="shrink-0 text-xs font-bold text-steam-accent hover:underline self-start sm:self-auto"
          >
            Retry
          </button>
        </div>
      )}

      {/* KONTENT EKWIPUNKU */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="dashboard-card overflow-hidden flex flex-col">
              <Shimmer className="h-36 w-full rounded-none" />
              <div className="p-3 space-y-2 flex-1">
                <Shimmer className="h-3 w-[80%]" />
                <Shimmer className="h-3 w-12 mt-2" />
                <Shimmer className="h-4 w-1/3" />
                <Shimmer className="h-3 w-10" />
                {showMarketCompare && <Shimmer className="h-[18px] w-20 mt-1" />}
              </div>
            </div>
          ))}
        </div>
      ) : filteredAndSortedItems.length === 0 ? (
        <div className="bg-steam-card rounded-2xl border border-steam-border p-12 sm:p-16 text-center">
            <Package className="w-16 h-16 mx-auto text-steam-tertiary mb-4" />
            {items.length === 0 ? (
              <>
                <h3 className="text-xl font-bold text-steam-text mb-2">Inventory is empty</h3>
                <p className="text-steam-tertiary text-sm mb-6">
                  Add your first skins to start tracking value and market prices.
                </p>
                <button
                  type="button"
                  onClick={() => setIsQuickAddModalOpen(true)}
                  className="btn-dashboard-primary"
                >
                  <Plus className="w-4 h-4" />
                  Quick Add
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-steam-text mb-2">No matching items</h3>
                <p className="text-steam-tertiary text-sm mb-6">
                  Nothing matches your search or filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilters(DEFAULT_INVENTORY_FILTERS);
                    setFiltersOpen(false);
                  }}
                  className="inline-flex items-center gap-2 border border-steam-border bg-steam-elevated/40 hover:bg-steam-hover text-steam-text px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
                >
                  Clear filters
                </button>
              </>
            )}
        </div>
      ) : (
        <>
          {showMarketCompare && (
            <MarketCompareSummary
              lines={marketSummaryLines}
              prices={marketPrices}
              loading={marketLoading}
              error={marketError}
            />
          )}

          {/* WIDOK SIATKI (GRID) */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAndSortedItems.map((item) => {
                const rarityStyle = getRarityStyle(item.cs2_items?.rarity);
                const itemPrice = item.cs2_items?.price || 0;
                const totalVal = itemPrice * item.quantity;
                const locked = isItemTradeLocked(item.acquired_at, item.trade_lock_until);
                const { status: pnlStatus, gainPct } = getPnlStatus(itemPrice, item.buy_price);

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openItemDetail(item.item_id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openItemDetail(item.item_id);
                      }
                    }}
                    className="dashboard-card group relative overflow-hidden flex flex-col cursor-pointer hover:border-steam-accent/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steam-accent/40"
                  >
                    
                    {/* Badges */}
                    <div className="absolute top-2 right-2 z-20 flex flex-row items-center gap-1">
                      {item.quantity > 1 && (
                        <div className="bg-steam-bg/90 border border-steam-border text-steam-text text-[10px] font-bold px-2 py-1 rounded-md">
                          x{item.quantity}
                        </div>
                      )}
                      {locked && (
                        <div className="bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Locked
                        </div>
                      )}
                    </div>

                    <div className={`relative h-36 w-full flex items-center justify-center p-4 border-b-[3px] ${rarityStyle.border} bg-steam-bg overflow-hidden`}>
                      <ItemImage
                        src={item.cs2_items?.icon_url}
                        alt={item.cs2_items?.market_hash_name ?? ''}
                        className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-500 group-hover:-translate-y-1"
                        wrapperClassName="relative z-10 w-full h-full min-h-[72px]"
                      />
                    </div>

                    {/* Info — spacer at bottom so equal-height rows don't gap under the title */}
                    <div className="p-3 flex flex-col flex-1 bg-steam-card relative z-20">
                      <p className="text-xs font-bold text-steam-text line-clamp-2 leading-snug min-h-[2.5rem]">
                        {item.cs2_items?.market_hash_name}
                      </p>

                      <div className="flex justify-between items-end gap-2 mt-2">
                        <div className="min-w-0 flex-1">
                          <p className="dashboard-label mb-0.5">
                            Total Value
                          </p>
                          <p className="num text-sm font-bold text-steam-text font-mono leading-tight">
                            {formatCurrency(totalVal)}
                          </p>
                          {pnlStatus === 'profit' && gainPct != null && (
                            <p className="num text-[10px] font-bold text-steam-profit mt-0.5">
                              +{gainPct.toFixed(1)}%
                            </p>
                          )}
                          {pnlStatus === 'loss' && gainPct != null && (
                            <p className="num text-[10px] font-bold text-steam-loss mt-0.5">
                              {gainPct.toFixed(1)}%
                            </p>
                          )}
                          {showMarketCompare && (
                            <MarketSpreadBadge
                              className="mt-1.5"
                              spread={marketPrices.get(item.item_id)?.spread_pct}
                              loading={marketLoading && !marketPrices.has(item.item_id)}
                            />
                          )}
                        </div>
                        {item.quantity > 1 && !showMarketCompare && (
                          <p className="num text-[10px] text-steam-secondary font-mono shrink-0">
                            ({formatCurrency(itemPrice)} ea)
                          </p>
                        )}
                      </div>
                      <div className="flex-1 min-h-0" aria-hidden />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* WIDOK TABELI (LIST) */}
          {viewMode === 'list' && (
            <div className="bg-steam-card rounded-xl border border-steam-border overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-steam-surface text-steam-tertiary text-xs font-bold uppercase tracking-wider border-b border-steam-border">
                      <th className="p-4 pl-6">Item Details</th>
                      <th className="p-4">Quantity</th>
                      <th className="p-4 text-right">Unit Price</th>
                      {showMarketCompare && (
                        <th className="p-4 text-right">Spread</th>
                      )}
                      <th className="p-4 text-right pr-6">Total Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steam-border/50 text-sm">
                    {filteredAndSortedItems.map((item) => {
                      const rarityStyle = getRarityStyle(item.cs2_items?.rarity);
                      const unitPrice = item.cs2_items?.price || 0;
                      const locked = isItemTradeLocked(item.acquired_at, item.trade_lock_until);
                      const { status: pnlStatus, gainPct } = getPnlStatus(unitPrice, item.buy_price);
                      return (
                        <tr
                          key={item.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => openItemDetail(item.item_id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              openItemDetail(item.item_id);
                            }
                          }}
                          className="pressable-row hover:bg-steam-hover group cursor-pointer focus-visible:outline-none focus-visible:bg-steam-hover focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-steam-accent/40"
                        >
                          <td className="p-3 pl-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-14 h-10 rounded overflow-hidden border-b-2 ${rarityStyle.border}`}>
                                <ItemImage
                                  src={item.cs2_items?.icon_url}
                                  alt={item.cs2_items?.market_hash_name ?? ''}
                                  className="max-w-full max-h-full object-contain"
                                  wrapperClassName="w-full h-full"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-steam-text flex items-center gap-2 flex-wrap">
                                  {item.cs2_items?.market_hash_name}
                                  {locked && (
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 inline-flex items-center gap-0.5">
                                      <Lock className="w-2.5 h-2.5" /> Lock
                                    </span>
                                  )}
                                </div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider ${rarityStyle.text}`}>
                                  {item.cs2_items?.rarity || 'Common'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="num bg-steam-elevated px-2 py-1 rounded text-xs font-bold text-steam-secondary">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="p-4 text-right text-steam-secondary font-mono num">
                            {formatCurrency(item.cs2_items?.price || 0)}
                          </td>
                          {showMarketCompare && (
                            <td className="p-4 text-right">
                              <MarketSpreadBadge
                                spread={marketPrices.get(item.item_id)?.spread_pct}
                                loading={marketLoading && !marketPrices.has(item.item_id)}
                              />
                            </td>
                          )}
                          <td className="p-4 text-right pr-6 font-mono num">
                            <div className="font-bold text-steam-text">
                              {formatCurrency(unitPrice * item.quantity)}
                            </div>
                            {pnlStatus === 'profit' && gainPct != null && (
                              <div className="text-[10px] text-steam-profit font-bold">+{gainPct.toFixed(1)}%</div>
                            )}
                            {pnlStatus === 'loss' && gainPct != null && (
                              <div className="text-[10px] text-steam-loss font-bold">{gainPct.toFixed(1)}%</div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <QuickAddModal
        isOpen={isQuickAddModalOpen}
        onClose={() => setIsQuickAddModalOpen(false)}
        onSuccess={() => {
          void fetchInventory();
        }}
      />
    </div>
  );
};

export default Inventory;