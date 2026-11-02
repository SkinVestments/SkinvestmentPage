import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Filter,
  Layers,
  Loader2,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { AdSlot } from '@/components/ads/AdSlot';
import { ItemImage } from '@/components/ui/ItemImage';
import {
  CatalogFamilyCard,
  CatalogFamilyCardSkeleton,
} from '@/components/catalog/CatalogFamilyCard';
import { usePublisherContentReady } from '@/hooks/usePublisherContentReady';
import { track } from '@/lib/analytics';
import { categoryLabel } from '@/utils/itemDisplayName';
import {
  countActiveFamilyFilters,
  fetchCatalogBrowseFacets,
  fetchCatalogCategories,
  fetchCatalogCollections,
  fetchCatalogFamilies,
  type CatalogBrowseFacets,
  type CatalogCollectionOption,
  type CatalogFamily,
  type CatalogFamilySort,
  type CatalogWeaponGroup,
  validatePriceRange,
} from '@/utils/catalogFamilies';
import { supabase } from '@/utils/supabaseClient';

const PAGE_SIZE = 24;
const SORT_OPTIONS: Array<{ value: CatalogFamilySort; label: string }> = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'price_desc', label: 'Highest price' },
  { value: 'price_asc', label: 'Lowest price' },
];

const FALLBACK_WEAPON_GROUPS: Array<{ id: CatalogWeaponGroup; label: string }> = [
  { id: 'rifles', label: 'Rifles' },
  { id: 'pistols', label: 'Pistols' },
  { id: 'smgs', label: 'SMGs' },
  { id: 'heavy', label: 'Heavy' },
];

function parseSort(raw: string | null): CatalogFamilySort {
  if (raw === 'name_desc' || raw === 'price_asc' || raw === 'price_desc') return raw;
  return 'name_asc';
}

function parseGroup(raw: string | null): CatalogWeaponGroup | null {
  if (raw === 'rifles' || raw === 'pistols' || raw === 'smgs' || raw === 'heavy') return raw;
  return null;
}

function parseNonNegNumber(raw: string | null): number | null {
  if (raw == null || raw.trim() === '') return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

interface WishlistListRow {
  item_id: string;
}

export const CatalogBrowse: React.FC = () => {
  const navigate = useNavigate();
  const adsContentReady = usePublisherContentReady();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQ = searchParams.get('q') ?? '';
  const category = searchParams.get('category');
  const weaponGroup = parseGroup(searchParams.get('group'));
  const weapon = searchParams.get('weapon');
  const collectionId = searchParams.get('collection');
  const rarity = searchParams.get('rarity');
  const minPrice = parseNonNegNumber(searchParams.get('min'));
  const maxPrice = parseNonNegNumber(searchParams.get('max'));
  const sortBy = parseSort(searchParams.get('sort'));
  const page = Math.max(1, Math.trunc(Number(searchParams.get('page') || '1')) || 1);

  const [searchInput, setSearchInput] = useState(searchQ);
  const [minInput, setMinInput] = useState(minPrice != null ? String(minPrice) : '');
  const [maxInput, setMaxInput] = useState(maxPrice != null ? String(maxPrice) : '');

  const [families, setFamilies] = useState<CatalogFamily[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const [facets, setFacets] = useState<CatalogBrowseFacets | null>(null);
  const [collections, setCollections] = useState<CatalogCollectionOption[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [wishlistItemIds, setWishlistItemIds] = useState<Set<string>>(new Set());
  const [wishlistLoadingItemId, setWishlistLoadingItemId] = useState<string | null>(null);
  const [inlineAdIndex, setInlineAdIndex] = useState<number | null>(null);
  const viewedKeyRef = useRef<string | null>(null);

  const patchParams = useCallback(
    (patch: Record<string, string | null>, resetPage = true) => {
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          p.set('tab', 'browse');
          for (const [key, value] of Object.entries(patch)) {
            if (value == null || value === '') p.delete(key);
            else p.set(key, value);
          }
          if (resetPage) p.delete('page');
          return p;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Sync controlled inputs when URL changes (back/forward).
  useEffect(() => {
    setSearchInput(searchQ);
  }, [searchQ]);
  useEffect(() => {
    setMinInput(minPrice != null ? String(minPrice) : '');
  }, [minPrice]);
  useEffect(() => {
    setMaxInput(maxPrice != null ? String(maxPrice) : '');
  }, [maxPrice]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const next = searchInput.trim();
      if (next === searchQ) return;
      patchParams({ q: next || null });
    }, 350);
    return () => window.clearTimeout(t);
  }, [searchInput, searchQ, patchParams]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const minRaw = minInput.trim();
      const maxRaw = maxInput.trim();
      const minN = minRaw === '' ? null : Number(minRaw);
      const maxN = maxRaw === '' ? null : Number(maxRaw);

      if (minRaw !== '' && (!Number.isFinite(minN) || (minN as number) < 0)) return;
      if (maxRaw !== '' && (!Number.isFinite(maxN) || (maxN as number) < 0)) return;
      if (minN != null && maxN != null && minN > maxN) return;

      const nextMin = minN == null ? null : String(minN);
      const nextMax = maxN == null ? null : String(maxN);
      const curMin = minPrice == null ? null : String(minPrice);
      const curMax = maxPrice == null ? null : String(maxPrice);
      if (nextMin === curMin && nextMax === curMax) return;
      patchParams({ min: nextMin, max: nextMax });
    }, 350);
    return () => window.clearTimeout(t);
  }, [minInput, maxInput, minPrice, maxPrice, patchParams]);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      fetchCatalogBrowseFacets().catch(() => null),
      fetchCatalogCollections().catch(() => [] as CatalogCollectionOption[]),
      fetchCatalogCategories().catch(() => [] as string[]),
    ]).then(([f, cols, cats]) => {
      if (cancelled) return;
      if (f) setFacets(f);
      setCollections(cols);
      setCategories(cats);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const fetchWishlistIds = async () => {
      const { data, error: wErr } = await supabase.rpc('wishlist_list_items');
      if (wErr) return;
      const ids = new Set(
        (((data as WishlistListRow[] | null) ?? [])
          .map((row) => row.item_id)
          .filter(Boolean) as string[]),
      );
      setWishlistItemIds(ids);
    };
    void fetchWishlistIds();
  }, []);

  const priceValidation = validatePriceRange(minPrice, maxPrice);

  useEffect(() => {
    if (priceValidation.ok === false) {
      setError(priceValidation.message);
      setFamilies([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const offset = (page - 1) * PAGE_SIZE;
    void fetchCatalogFamilies({
      search: searchQ.trim() || null,
      category,
      weaponGroup,
      weapon,
      collectionId,
      rarity,
      minPrice,
      maxPrice,
      sort: sortBy,
      limit: PAGE_SIZE,
      offset,
    })
      .then((result) => {
        if (cancelled) return;
        setFamilies(result.items);
        setTotalCount(result.total_count);
        setLoading(false);

        const filtersActive = countActiveFamilyFilters({
          search: searchQ.trim() || null,
          category,
          weaponGroup,
          weapon,
          collectionId,
          rarity,
          minPrice,
          maxPrice,
        });
        const viewKey = `${offset}|${filtersActive}|${sortBy}|${result.total_count}`;
        if (viewedKeyRef.current !== viewKey) {
          viewedKeyRef.current = viewKey;
          track('catalog_families_viewed', { filters_active_count: filtersActive });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[catalog] families fetch failed', err);
        setFamilies([]);
        setTotalCount(0);
        setError('Could not load catalog. Try again.');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    searchQ,
    category,
    weaponGroup,
    weapon,
    collectionId,
    rarity,
    minPrice,
    maxPrice,
    sortBy,
    page,
    reloadToken,
    priceValidation,
  ]);

  useEffect(() => {
    if (families.length === 0) {
      setInlineAdIndex(null);
      return;
    }
    const maxIndex = Math.min(14, families.length - 1);
    setInlineAdIndex(Math.floor(Math.random() * (maxIndex + 1)));
  }, [page, searchQ, category, weaponGroup, weapon, collectionId, rarity, sortBy, families.length]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    [totalCount],
  );

  useEffect(() => {
    if (page > totalPages) {
      patchParams({ page: totalPages > 1 ? String(totalPages) : null }, false);
    }
  }, [page, totalPages, patchParams]);

  const weaponGroupChips = useMemo(() => {
    const fromFacets = (facets?.groups ?? [])
      .map((g) => {
        const id = parseGroup(g.id);
        if (!id) return null;
        return { id, label: g.label || id, icon_url: g.icon_url };
      })
      .filter((g): g is { id: CatalogWeaponGroup; label: string; icon_url: string | null } => g != null);
    if (fromFacets.length > 0) return fromFacets;
    return FALLBACK_WEAPON_GROUPS.map((g) => ({ ...g, icon_url: null as string | null }));
  }, [facets]);

  const weaponsForSelect = facets?.weapons ?? [];

  const toggleWishlist = async (itemId: string) => {
    const isSaved = wishlistItemIds.has(itemId);
    setWishlistLoadingItemId(itemId);
    if (isSaved) {
      const { data, error: remErr } = await supabase.rpc('wishlist_remove_item', {
        p_item_id: itemId,
      });
      if (!remErr && data === true) {
        setWishlistItemIds((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
      }
    } else {
      const { error: addErr } = await supabase.rpc('wishlist_add_item', { p_item_id: itemId });
      if (!addErr) {
        setWishlistItemIds((prev) => {
          const next = new Set(prev);
          next.add(itemId);
          return next;
        });
      }
    }
    setWishlistLoadingItemId(null);
  };

  const openFamily = (family: CatalogFamily, position: number) => {
    track('catalog_family_clicked', { family_key: family.family_key, position });
    navigate(`/item/${family.item_id}`, { state: { from: '/catalog?tab=browse' } });
  };

  return (
    <div className="min-w-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 bg-steam-card p-3 rounded-xl border border-steam-border shadow-lg w-full sm:w-auto md:ml-auto">
          <div className="px-3 sm:px-4 border-r border-steam-border">
            <p className="text-[10px] text-steam-tertiary font-bold uppercase tracking-wider mb-1">
              Families
            </p>
            <p className="text-xl font-bold text-steam-text num">{totalCount}</p>
          </div>
          <div className="px-3 sm:px-4">
            <p className="text-[10px] text-steam-tertiary font-bold uppercase tracking-wider mb-1">
              Visible
            </p>
            <p className="text-xl font-bold text-steam-accent num">{families.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-steam-card border border-steam-border rounded-2xl p-4 sm:p-5 mb-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary" />
            <input
              type="text"
              placeholder="Search family name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              className="w-full bg-steam-bg border border-steam-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-steam-accent transition-colors"
            />
          </div>

          <div className="relative min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary" />
            <select
              value={category ?? ''}
              onChange={(e) => patchParams({ category: e.target.value || null })}
              className="w-full appearance-none bg-steam-bg border border-steam-border rounded-xl py-2.5 pl-10 pr-9 text-sm focus:outline-none focus:border-steam-accent cursor-pointer"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel(c)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary pointer-events-none" />
          </div>

          <div className="relative min-w-[180px]">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary" />
            <select
              value={sortBy}
              onChange={(e) => patchParams({ sort: e.target.value })}
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

        <div className="flex flex-wrap gap-2" role="group" aria-label="Weapon groups">
          <button
            type="button"
            onClick={() => patchParams({ group: null, weapon: null })}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors min-h-10 ${
              !weaponGroup
                ? 'border-steam-accent bg-steam-accent/15 text-steam-accent'
                : 'border-steam-border text-steam-secondary hover:text-steam-text'
            }`}
          >
            All weapons
          </button>
          {weaponGroupChips.map((chip) => {
            const active = weaponGroup === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() =>
                  patchParams({
                    group: active ? null : chip.id,
                    weapon: null,
                  })
                }
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors min-h-10 ${
                  active
                    ? 'border-steam-accent bg-steam-accent/15 text-steam-accent'
                    : 'border-steam-border text-steam-secondary hover:text-steam-text'
                }`}
              >
                {chip.icon_url ? (
                  <ItemImage
                    src={chip.icon_url}
                    alt=""
                    className="h-4 w-4 object-contain"
                    wrapperClassName="inline-flex h-4 w-4"
                  />
                ) : (
                  <Crosshair className="w-3.5 h-3.5 opacity-70" />
                )}
                {chip.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <select
              value={weapon ?? ''}
              onChange={(e) => patchParams({ weapon: e.target.value || null })}
              className="w-full appearance-none bg-steam-bg border border-steam-border rounded-xl py-2.5 px-3 pr-9 text-sm focus:outline-none focus:border-steam-accent cursor-pointer"
            >
              <option value="">All weapon names</option>
              {weaponsForSelect.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={collectionId ?? ''}
              onChange={(e) => patchParams({ collection: e.target.value || null })}
              className="w-full appearance-none bg-steam-bg border border-steam-border rounded-xl py-2.5 px-3 pr-9 text-sm focus:outline-none focus:border-steam-accent cursor-pointer"
            >
              <option value="">All collections</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary pointer-events-none" />
            {collectionId
              ? (() => {
                  const col = collections.find((c) => c.id === collectionId);
                  if (!col?.icon_url) return null;
                  return (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                      <ItemImage
                        src={col.icon_url}
                        alt=""
                        className="h-4 w-4 object-contain"
                        wrapperClassName="inline-flex h-4 w-4"
                      />
                    </span>
                  );
                })()
              : null}
          </div>

          <div className="relative">
            <select
              value={rarity ?? ''}
              onChange={(e) => patchParams({ rarity: e.target.value || null })}
              className="w-full appearance-none bg-steam-bg border border-steam-border rounded-xl py-2.5 px-3 pr-9 text-sm focus:outline-none focus:border-steam-accent cursor-pointer"
            >
              <option value="">All rarities</option>
              {(facets?.rarities ?? []).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary pointer-events-none" />
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              placeholder="Min $"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              className="w-full bg-steam-bg border border-steam-border rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-steam-accent num"
            />
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              placeholder="Max $"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              className="w-full bg-steam-bg border border-steam-border rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-steam-accent num"
            />
          </div>
        </div>

        {collectionId ? (
          <div className="flex items-center gap-2 text-xs text-steam-secondary">
            {(() => {
              const col = collections.find((c) => c.id === collectionId);
              if (!col) return null;
              return (
                <>
                  {col.icon_url ? (
                    <ItemImage
                      src={col.icon_url}
                      alt=""
                      className="h-5 w-5 object-contain"
                      wrapperClassName="inline-flex h-5 w-5"
                    />
                  ) : (
                    <Layers className="w-4 h-4 text-steam-tertiary" />
                  )}
                  <span className="font-semibold text-steam-text">{col.name}</span>
                </>
              );
            })()}
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <CatalogFamilyCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl theme-alert-error p-8 text-center">
          <h3 className="text-xl font-bold text-steam-text mb-2">Catalog error</h3>
          <p className="text-sm text-steam-secondary mb-4">{error}</p>
          <button
            type="button"
            onClick={() => setReloadToken((n) => n + 1)}
            className="text-xs font-bold text-steam-accent hover:underline"
          >
            Retry
          </button>
        </div>
      ) : families.length === 0 ? (
        <div className="bg-steam-card rounded-2xl border border-steam-border p-14 text-center">
          <Layers className="w-12 h-12 mx-auto text-steam-tertiary mb-4" />
          <h3 className="text-xl font-bold text-steam-text mb-2">No families found</h3>
          <p className="text-steam-tertiary text-sm">
            Try another search phrase or clear some filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {families.map((family, index) => (
              <React.Fragment key={family.family_key}>
                {index === inlineAdIndex ? (
                  <AdSlot
                    slotKey="catalog"
                    className="h-full"
                    minHeight={260}
                    contentReady={adsContentReady && inlineAdIndex != null}
                  />
                ) : null}
                <CatalogFamilyCard
                  family={family}
                  isWishlisted={wishlistItemIds.has(family.item_id)}
                  wishlistLoading={wishlistLoadingItemId === family.item_id}
                  onOpen={() => openFamily(family, index + 1)}
                  onToggleWishlist={(e) => {
                    e.stopPropagation();
                    void toggleWishlist(family.item_id);
                  }}
                />
              </React.Fragment>
            ))}
          </div>

          <div className="mt-6 bg-steam-card border border-steam-border rounded-xl px-4 py-3 flex items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-steam-secondary">
              Page <span className="font-bold text-steam-text num">{page}</span> /{' '}
              <span className="num">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  patchParams({ page: page > 2 ? String(page - 1) : null }, false)
                }
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-steam-border text-sm text-steam-secondary hover:text-steam-text disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <button
                type="button"
                onClick={() =>
                  patchParams(
                    { page: page + 1 <= totalPages ? String(page + 1) : String(page) },
                    false,
                  )
                }
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

      {loading ? (
        <div className="sr-only" aria-live="polite">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading catalog
        </div>
      ) : null}
    </div>
  );
};
