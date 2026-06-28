import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Plus,
  Package,
  Loader2,
  Lock,
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
import { usePublisherContentReady } from '@/hooks/usePublisherContentReady';

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
  const adsContentReady = usePublisherContentReady();
  
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'value_desc' | 'value_asc' | 'name' | 'recent'>('value_desc');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<InventoryFilterState>(DEFAULT_INVENTORY_FILTERS);

  const fetchInventory = async () => {
    try {
      setLoading(true);
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

      if (data) setItems(data as InventoryItem[]);
    } catch (error) {
      console.error('Error fetching inventory:', error);
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
          default:
            return 0;
        }
      });
  }, [items, searchQuery, filters, sortBy, showPriceSourceFilter]);

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
              <p className="text-xl font-bold text-green-400">{formatCurrency(totalValue)}</p>
           </div>
           <button className="bg-steam-accent hover:opacity-90 text-white p-3 rounded-lg shadow-lg theme-shadow-accent transition-all ml-2">
              <Plus className="w-5 h-5" />
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
            className="w-full bg-steam-card border border-steam-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-steam-accent transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="flex-1 min-w-[140px] sm:flex-none bg-steam-card border border-steam-border text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-steam-accent cursor-pointer"
          >
            <option value="value_desc">Highest Value</option>
            <option value="value_asc">Lowest Value</option>
            <option value="name">Name (A-Z)</option>
            <option value="recent">Recently Added</option>
          </select>

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

          <div className="flex bg-steam-card p-1 rounded-xl border border-steam-border">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-steam-elevated text-steam-text' : 'text-steam-tertiary hover:text-steam-text'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-steam-elevated text-steam-text' : 'text-steam-tertiary hover:text-steam-text'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
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

      {/* KONTENT EKWIPUNKU */}
      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-steam-accent" /></div>
      ) : filteredAndSortedItems.length === 0 ? (
        <div className="bg-steam-card rounded-2xl border border-steam-border p-20 text-center">
            <Package className="w-16 h-16 mx-auto text-steam-tertiary mb-4" />
            <h3 className="text-xl font-bold text-steam-text mb-2">No items found</h3>
            <p className="text-steam-tertiary text-sm">
              Your inventory is empty or no items match your search and filters.
            </p>
        </div>
      ) : (
        <>
          {/* WIDOK SIATKI (GRID) */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
                    className="bg-steam-card rounded-xl border border-steam-border hover:border-steam-accent/40 transition-colors group relative overflow-hidden flex flex-col shadow-lg cursor-pointer"
                  >
                    
                    {/* Badges */}
                    <div className="absolute top-2 right-2 z-20 flex flex-col items-end gap-1">
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

                    {/* Info */}
                    <div className="p-3 flex flex-col flex-1 bg-steam-card relative z-20">
                      <p className="text-xs font-bold text-steam-text line-clamp-2 leading-snug mb-3 flex-1">
                        {item.cs2_items?.market_hash_name}
                      </p>
                      
                      <div className="flex justify-between items-end mt-auto gap-2">
                        <div>
                          <p className="text-[10px] text-steam-tertiary uppercase tracking-widest mb-0.5">
                            Total Value
                          </p>
                          <p className="text-sm font-bold text-steam-text font-mono">
                            {formatCurrency(totalVal)}
                          </p>
                          {pnlStatus === 'profit' && gainPct != null && (
                            <p className="text-[10px] font-bold text-green-400 mt-0.5">
                              +{gainPct.toFixed(1)}%
                            </p>
                          )}
                          {pnlStatus === 'loss' && gainPct != null && (
                            <p className="text-[10px] font-bold text-red-400 mt-0.5">
                              {gainPct.toFixed(1)}%
                            </p>
                          )}
                        </div>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-steam-secondary font-mono shrink-0">
                            ({formatCurrency(itemPrice)} ea)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* WIDOK TABELI (LIST) - BEZ ZMIAN */}
          {viewMode === 'list' && (
            <div className="bg-steam-card rounded-xl border border-steam-border overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-steam-surface text-steam-tertiary text-xs font-bold uppercase tracking-wider border-b border-steam-border">
                      <th className="p-4 pl-6">Item Details</th>
                      <th className="p-4">Quantity</th>
                      <th className="p-4 text-right">Unit Price</th>
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
                          onClick={() => openItemDetail(item.item_id)}
                          className="hover:bg-steam-hover transition-colors group cursor-pointer"
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
                              <div>
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
                            <span className="bg-steam-elevated px-2 py-1 rounded text-xs font-bold text-steam-secondary">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="p-4 text-right text-steam-secondary font-mono">
                            {formatCurrency(item.cs2_items?.price || 0)}
                          </td>
                          <td className="p-4 text-right pr-6 font-mono">
                            <div className="font-bold text-steam-text">
                              {formatCurrency(unitPrice * item.quantity)}
                            </div>
                            {pnlStatus === 'profit' && gainPct != null && (
                              <div className="text-[10px] text-green-400 font-bold">+{gainPct.toFixed(1)}%</div>
                            )}
                            {pnlStatus === 'loss' && gainPct != null && (
                              <div className="text-[10px] text-red-400 font-bold">{gainPct.toFixed(1)}%</div>
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
    </div>
  );
};

export default Inventory;