import React from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { ItemImage } from '@/components/ui/ItemImage';
import { formatCurrency, getRarityStyle } from '@/utils/display';
import {
  splitFamilyDisplayName,
  type CatalogFamily,
} from '@/utils/catalogFamilies';

interface CatalogFamilyCardProps {
  family: CatalogFamily;
  isWishlisted: boolean;
  wishlistLoading: boolean;
  onOpen: () => void;
  onToggleWishlist: (e: React.MouseEvent) => void;
}

export const CatalogFamilyCard: React.FC<CatalogFamilyCardProps> = ({
  family,
  isWishlisted,
  wishlistLoading,
  onOpen,
  onToggleWishlist,
}) => {
  const rarityStyle = getRarityStyle(family.rarity);
  const { title, subtitle } = splitFamilyDisplayName(
    family.display_name,
    family.weapon,
    family.category,
  );

  const priceLabel =
    family.price == null
      ? 'No price'
      : family.variant_count > 1
        ? `from ${formatCurrency(family.price)}`
        : formatCurrency(family.price);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      className="dashboard-card group overflow-hidden h-full flex flex-col hover:border-steam-accent/40 transition-colors cursor-pointer text-left"
    >
      <div
        className={`relative h-36 w-full flex items-center justify-center p-4 border-b-[3px] ${rarityStyle.border} bg-steam-bg`}
      >
        <ItemImage
          src={family.icon_url}
          alt={family.display_name}
          className="max-h-full max-w-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-500"
          wrapperClassName="relative z-10 w-full h-full min-h-[72px]"
        />
        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-steam-bg/90 border border-steam-border text-steam-secondary">
          {family.rarity ?? 'Common'}
        </span>
        <button
          type="button"
          onClick={onToggleWishlist}
          disabled={wishlistLoading}
          className={`absolute top-2 right-2 z-20 p-1.5 rounded-md border transition-colors ${
            isWishlisted
              ? 'bg-red-500/15 text-red-400 border-red-500/30'
              : 'bg-steam-bg/90 text-steam-tertiary border-steam-border hover:text-red-400'
          } disabled:opacity-60`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlistLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          )}
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-bold text-steam-text line-clamp-2 leading-snug mb-0.5">
          {title}
        </p>
        <p className="text-xs text-steam-tertiary mb-2 line-clamp-1">{subtitle}</p>
        {family.collection_name ? (
          <p className="text-[11px] text-steam-tertiary/80 mb-3 line-clamp-1">
            {family.collection_name}
          </p>
        ) : (
          <div className="mb-3" />
        )}

        <div className="flex items-end justify-between gap-3 mt-auto">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-steam-tertiary font-bold mb-1">
              Price
            </p>
            <p
              className={`font-mono text-base font-bold num ${
                family.price == null ? 'text-steam-tertiary' : 'text-steam-text'
              }`}
            >
              {priceLabel}
            </p>
          </div>
          {family.variant_count > 1 ? (
            <p className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary num">
              {family.variant_count} variants
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export const CatalogFamilyCardSkeleton: React.FC = () => (
  <div
    className="dashboard-card overflow-hidden h-full flex flex-col animate-pulse"
    aria-hidden
  >
    <div className="h-36 w-full bg-steam-elevated border-b-[3px] border-steam-border" />
    <div className="p-4 space-y-2 flex-1">
      <div className="h-4 w-3/4 rounded bg-steam-elevated" />
      <div className="h-3 w-1/2 rounded bg-steam-elevated" />
      <div className="h-3 w-2/3 rounded bg-steam-elevated" />
      <div className="mt-auto pt-4 flex justify-between">
        <div className="h-5 w-20 rounded bg-steam-elevated" />
        <div className="h-3 w-16 rounded bg-steam-elevated" />
      </div>
    </div>
  </div>
);
