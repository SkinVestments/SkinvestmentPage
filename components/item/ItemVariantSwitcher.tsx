import React, { useEffect, useMemo, useState } from 'react';
import { formatCurrency } from '@/utils/display';
import { exteriorFullLabel, exteriorShortLabel } from '@/utils/itemDisplayName';
import {
  editionLabel,
  editionsPresent,
  fetchCatalogFamilyVariants,
  isVanillaFamily,
  pickVariantForEdition,
  wearsForEdition,
  type CatalogFamilyVariant,
  type CatalogVariantEdition,
} from '@/utils/catalogFamilyVariants';

interface ItemVariantSwitcherProps {
  itemId: string;
  onSelectVariant: (itemId: string) => void;
  className?: string;
}

export const ItemVariantSwitcher: React.FC<ItemVariantSwitcherProps> = ({
  itemId,
  onSelectVariant,
  className = '',
}) => {
  const [rows, setRows] = useState<CatalogFamilyVariant[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [edition, setEdition] = useState<CatalogVariantEdition>('standard');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);

    void fetchCatalogFamilyVariants(itemId).then((result) => {
      if (cancelled) return;
      if (result == null) {
        setFailed(true);
        setRows(null);
        setLoading(false);
        return;
      }
      setRows(result);
      const current = result.find((r) => r.is_current) ?? result.find((r) => r.item_id === itemId);
      setEdition(current?.edition ?? editionsPresent(result)[0] ?? 'standard');
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [itemId]);

  const editions = useMemo(() => (rows ? editionsPresent(rows) : []), [rows]);
  const vanilla = useMemo(() => (rows ? isVanillaFamily(rows) : false), [rows]);
  const wearRows = useMemo(
    () => (rows ? wearsForEdition(rows, edition) : []),
    [rows, edition],
  );

  if (failed) return null;
  if (!loading && (!rows || rows.length <= 1)) return null;

  const onEditionChange = (next: CatalogVariantEdition) => {
    if (!rows || next === edition) {
      setEdition(next);
      return;
    }
    const current =
      rows.find((r) => r.is_current) ?? rows.find((r) => r.item_id === itemId) ?? null;
    const preferredExterior = current?.exterior ?? null;
    const target = pickVariantForEdition(rows, next, preferredExterior);
    setEdition(next);
    if (target && target.item_id !== itemId) {
      onSelectVariant(target.item_id);
    }
  };

  const onWearClick = (variant: CatalogFamilyVariant) => {
    if (variant.item_id === itemId) return;
    onSelectVariant(variant.item_id);
  };

  return (
    <div className={`space-y-3 ${className}`} aria-label="Item variants">
      {loading ? (
        <VariantSwitcherSkeleton />
      ) : (
        <>
          {editions.length > 1 ? (
            <div
              className="inline-flex flex-wrap rounded-xl border border-steam-border bg-steam-bg p-0.5 gap-0.5"
              role="group"
              aria-label="Edition"
            >
              {editions.map((ed) => {
                const active = edition === ed;
                return (
                  <button
                    key={ed}
                    type="button"
                    onClick={() => onEditionChange(ed)}
                    aria-pressed={active}
                    className={`px-3 py-1.5 rounded-[10px] text-xs font-bold transition-colors min-h-9 ${
                      active
                        ? editionActiveClass(ed)
                        : editionIdleClass(ed)
                    }`}
                  >
                    {editionLabel(ed)}
                  </button>
                );
              })}
            </div>
          ) : null}

          {!vanilla && wearRows.length > 0 ? (
            <div className="flex flex-wrap gap-2" role="list" aria-label="Wear">
              {wearRows.map((variant) => {
                const short = exteriorShortLabel(variant.exterior) ?? '?';
                const full = exteriorFullLabel(variant.exterior) ?? short;
                const current = variant.item_id === itemId;
                const priceLabel =
                  variant.price == null ? 'No price' : formatCurrency(variant.price);
                return (
                  <button
                    key={variant.item_id}
                    type="button"
                    role="listitem"
                    title={full}
                    onClick={() => onWearClick(variant)}
                    aria-pressed={current}
                    className={`min-w-[4.25rem] px-2.5 py-2 rounded-xl border text-center transition-colors ${
                      current
                        ? 'border-steam-accent bg-steam-accent/15 text-steam-accent'
                        : 'border-steam-border bg-steam-bg text-steam-secondary hover:border-steam-accent/40 hover:text-steam-text'
                    }`}
                  >
                    <span className="block text-xs font-bold tracking-wide">{short}</span>
                    <span
                      className={`block mt-0.5 text-[10px] font-mono num ${
                        variant.price == null ? 'text-steam-tertiary' : ''
                      }`}
                    >
                      {priceLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

function editionActiveClass(edition: CatalogVariantEdition): string {
  if (edition === 'stattrak') return 'bg-orange-500/20 text-orange-400 border border-orange-500/40';
  if (edition === 'souvenir') return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40';
  return 'bg-steam-accent text-white';
}

function editionIdleClass(edition: CatalogVariantEdition): string {
  if (edition === 'stattrak') return 'text-orange-400/80 hover:text-orange-400';
  if (edition === 'souvenir') return 'text-yellow-500/80 hover:text-yellow-400';
  return 'text-steam-tertiary hover:text-steam-secondary';
}

const VariantSwitcherSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse" aria-hidden>
    <div className="h-9 w-56 rounded-xl bg-steam-elevated" />
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 w-[4.25rem] rounded-xl bg-steam-elevated" />
      ))}
    </div>
  </div>
);
