import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  Layers,
  SlidersHorizontal,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { ItemImage } from '@/components/ui/ItemImage';
import { formatCurrency, getRarityStyle } from '@/utils/display';
import { supabase } from '@/utils/supabaseClient';
import { AdSlot } from '@/components/ads/AdSlot';
import { usePublisherContentReady } from '@/hooks/usePublisherContentReady';

interface CatalogItem {
  id: string;
  market_hash_name: string;
  collection_name: string;
  game_collection_id: string | null;
  rarity: string | null;
  icon_url: string | null;
  reference_price: number | null;
  exterior: string | null;
}

interface CollectionOption {
  id: string;
  name: string;
}

interface CatalogDbRow {
  id: string;
  market_hash_name: string;
  icon_url: string | null;
  rarity: string | null;
  price: number | string | null;
  exterior: string | null;
  game_collection_id: string | null;
  collection_name?: string | null;
  total_count?: number | string | null;
}

const COLLECTION_ALL = '__all__';
const PAGE_SIZE = 24;
const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'price_desc', label: 'Highest price' },
  { value: 'price_asc', label: 'Lowest price' },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]['value'];
interface WishlistListRow {
  item_id: string;
}

const Catalog = () => {
  const adsContentReady = usePublisherContentReady();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(COLLECTION_ALL);
  const [sortBy, setSortBy] = useState<SortValue>('name_asc');
  const [collections, setCollections] = useState<CollectionOption[]>([]);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [wishlistItemIds, setWishlistItemIds] = useState<Set<string>>(new Set());
  const [wishlistLoadingItemId, setWishlistLoadingItemId] = useState<string | null>(null);
  const [showOnlyWishlist, setShowOnlyWishlist] = useState(false);
  const [inlineAdIndex, setInlineAdIndex] = useState<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setSearchQuery(searchInput.trim()), 350);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCollection, sortBy]);

  useEffect(() => {
    const fetchCollections = async () => {
      const { data, error } = await supabase.rpc('catalog_get_collections');
      if (error) {
        console.error('Error fetching catalog collections:', error);
        setCollections([]);
        setError('Data is not available');
        return;
      }

      let rows: CollectionOption[] = ((data as Array<{ id: string; name: string; items_count?: number }> | null) ?? [])
        .filter((row) => Boolean(row.id) && Boolean(row.name?.trim()))
        .map((row) => ({ id: row.id, name: row.name.trim() }));

      rows = rows.sort((a, b) => a.name.localeCompare(b.name));

      if (rows.length === 0) {
        setError('Data is not available');
      }

      setCollections(rows);
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      setError(null);
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error: itemsError } = await supabase.rpc('catalog_search_items', {
        p_search: searchQuery.length > 0 ? searchQuery : null,
        p_collection_id: selectedCollection === COLLECTION_ALL ? null : selectedCollection,
        p_sort: sortBy,
        p_limit: PAGE_SIZE,
        p_offset: from,
      });

      if (itemsError) {
        setItems([]);
        setTotalCount(0);
        setError('Data is not available');
        setLoading(false);
        return;
      }

      const normalizedItems: CatalogItem[] = ((data as CatalogDbRow[] | null) ?? []).map((row) => ({
        id: row.id,
        market_hash_name: row.market_hash_name,
        icon_url: row.icon_url,
        rarity: row.rarity,
        reference_price: row.price != null ? Number(row.price) : null,
        exterior: row.exterior,
        game_collection_id: row.game_collection_id,
        collection_name: row.collection_name?.trim() || 'No collection',
      }));

      setItems(normalizedItems);
      const firstRow = ((data as CatalogDbRow[] | null) ?? [])[0];
      setTotalCount(firstRow?.total_count != null ? Number(firstRow.total_count) : 0);
      setLoading(false);
    };

    fetchCatalog();
  }, [page, searchQuery, selectedCollection, sortBy]);

  useEffect(() => {
    const fetchWishlistIds = async () => {
      const { data, error } = await supabase.rpc('wishlist_list_items');
      if (error) {
        return;
      }
      const ids = new Set(
        (((data as WishlistListRow[] | null) ?? []).map((row) => row.item_id).filter(Boolean) as string[]),
      );
      setWishlistItemIds(ids);
    };

    fetchWishlistIds();
  }, []);

  const displayedItems = useMemo(() => {
    if (!showOnlyWishlist) return items;
    return items.filter((item) => wishlistItemIds.has(item.id));
  }, [items, showOnlyWishlist, wishlistItemIds]);

  useEffect(() => {
    if (displayedItems.length === 0) {
      setInlineAdIndex(null);
      return;
    }

    // Random ad position limited to places 1..15 (1-based).
    const minIndex = 0;
    const maxIndex = Math.min(14, displayedItems.length - 1);
    const randomIndex =
      Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
    setInlineAdIndex(randomIndex);
  }, [page, searchQuery, selectedCollection, sortBy, showOnlyWishlist, displayedItems.length]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / PAGE_SIZE)), [totalCount]);

  const toggleWishlist = async (itemId: string) => {
    const isSaved = wishlistItemIds.has(itemId);
    setWishlistLoadingItemId(itemId);

    if (isSaved) {
      const { data, error } = await supabase.rpc('wishlist_remove_item', { p_item_id: itemId });
      if (!error && data === true) {
        setWishlistItemIds((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
      }
      setWishlistLoadingItemId(null);
      return;
    }

    const { error } = await supabase.rpc('wishlist_add_item', { p_item_id: itemId });
    if (!error) {
      setWishlistItemIds((prev) => {
        const next = new Set(prev);
        next.add(itemId);
        return next;
      });
    }
    setWishlistLoadingItemId(null);
  };

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="text-steam-text animate-fade-in pb-10 min-w-0 overflow-x-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-steam-text mb-1">Catalog</h1>
          <p className="text-steam-secondary">Browse all CS2 skins with collection and name filters.</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 bg-steam-card p-3 rounded-xl border border-steam-border shadow-lg w-full sm:w-auto">
          <div className="px-3 sm:px-4 border-r border-steam-border">
            <p className="text-[10px] text-steam-tertiary font-bold uppercase tracking-wider mb-1">Total</p>
            <p className="text-xl font-bold text-steam-text">{totalCount}</p>
          </div>
          <div className="px-3 sm:px-4">
            <p className="text-[10px] text-steam-tertiary font-bold uppercase tracking-wider mb-1">Visible</p>
            <p className="text-xl font-bold text-steam-accent">{displayedItems.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-steam-card border border-steam-border rounded-2xl p-4 sm:p-5 mb-6 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary" />
            <input
              type="text"
              placeholder="Search skin name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-steam-bg border border-steam-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-steam-accent transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative min-w-[220px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary" />
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="w-full appearance-none bg-steam-bg border border-steam-border rounded-xl py-2.5 pl-10 pr-9 text-sm focus:outline-none focus:border-steam-accent cursor-pointer"
              >
                <option value={COLLECTION_ALL}>All collections</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary pointer-events-none" />
            </div>

            <div className="relative min-w-[180px]">
              <button
                type="button"
                onClick={() => setShowOnlyWishlist((prev) => !prev)}
                className={`w-full inline-flex items-center justify-center gap-2 border rounded-xl py-2.5 px-3 text-sm transition-colors ${
                  showOnlyWishlist
                    ? 'border-red-500/30 text-red-400 bg-red-500/10'
                    : 'border-steam-border text-steam-secondary hover:text-steam-text bg-steam-bg'
                }`}
              >
                <Heart className={`w-4 h-4 ${showOnlyWishlist ? 'fill-current' : ''}`} />
                {showOnlyWishlist ? 'Only wishlisted' : 'All items'}
              </button>
            </div>

            <div className="relative min-w-[180px]">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortValue)}
                className="w-full appearance-none bg-steam-bg border border-steam-border rounded-xl py-2.5 pl-10 pr-9 text-sm focus:outline-none focus:border-steam-accent cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-steam-card rounded-2xl border border-steam-border p-16 text-center">
          <Loader2 className="w-8 h-8 mx-auto text-steam-accent animate-spin mb-4" />
          <p className="text-sm text-steam-secondary">Loading catalog...</p>
        </div>
      ) : error ? (
        <div className="bg-steam-card rounded-2xl border border-red-500/30 p-8 text-center">
          <h3 className="text-xl font-bold text-red-400 mb-2">Catalog error</h3>
          <p className="text-sm text-steam-secondary">{error}</p>
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="bg-steam-card rounded-2xl border border-steam-border p-14 text-center">
          <Layers className="w-12 h-12 mx-auto text-steam-tertiary mb-4" />
          <h3 className="text-xl font-bold text-steam-text mb-2">
            {showOnlyWishlist ? 'No wishlisted skins on this page' : 'No skins found'}
          </h3>
          <p className="text-steam-tertiary text-sm">
            {showOnlyWishlist
              ? 'Disable the wishlist filter or add more items to wishlist.'
              : 'Try another phrase in search or change selected collection.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {displayedItems.map((item, index) => {
            const rarityStyle = getRarityStyle(item.rarity);
            const isWishlisted = wishlistItemIds.has(item.id);
            const isWishlistLoading = wishlistLoadingItemId === item.id;

            return (
              <React.Fragment key={item.id}>
                {index === inlineAdIndex && (
                  <AdSlot
                    slotKey="catalog"
                    className="h-full"
                    minHeight={260}
                    contentReady={adsContentReady && inlineAdIndex != null}
                  />
                )}
              <article
                className="bg-steam-card rounded-xl border border-steam-border hover:border-steam-accent/40 transition-colors group overflow-hidden shadow-lg h-full flex flex-col"
              >
                <div
                  className={`relative h-36 w-full flex items-center justify-center p-4 border-b-[3px] ${rarityStyle.border} bg-steam-bg`}
                >
                  <ItemImage
                    src={item.icon_url}
                    alt={item.market_hash_name}
                    className="max-h-full max-w-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-500"
                    wrapperClassName="relative z-10 w-full h-full min-h-[72px]"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-steam-bg/90 border border-steam-border text-steam-secondary">
                    {item.rarity ?? 'Common'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(item.id)}
                    disabled={isWishlistLoading}
                    className={`absolute top-2 right-2 z-20 p-1.5 rounded-md border transition-colors ${
                      isWishlisted
                        ? 'bg-red-500/15 text-red-400 border-red-500/30'
                        : 'bg-steam-bg/90 text-steam-tertiary border-steam-border hover:text-red-400'
                    } disabled:opacity-60`}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {isWishlistLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    )}
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <p className="text-sm font-bold text-steam-text line-clamp-2 leading-snug min-h-[2.75rem] mb-2">
                    {item.market_hash_name}
                  </p>
                  <p className="text-xs text-steam-tertiary mb-4 line-clamp-1">{item.collection_name}</p>

                  <div className="flex items-end justify-between gap-3 mt-auto">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-steam-tertiary font-bold mb-1">
                        Reference price
                      </p>
                      <p className="font-mono text-base font-bold text-green-400">
                        {formatCurrency(item.reference_price ?? 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-steam-tertiary font-bold mb-1">
                        Exterior
                      </p>
                      <p className="text-xs text-steam-secondary font-mono">{item.exterior || 'Any'}</p>
                    </div>
                  </div>
                </div>
              </article>
              </React.Fragment>
            );
          })}
          </div>

          <div className="mt-6 bg-steam-card border border-steam-border rounded-xl px-4 py-3 flex items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-steam-secondary">
              Page <span className="font-bold text-steam-text">{page}</span> / {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-steam-border text-sm text-steam-secondary hover:text-steam-text disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-steam-border text-sm text-steam-secondary hover:text-steam-text disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Catalog;
