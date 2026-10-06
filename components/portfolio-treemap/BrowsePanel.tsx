import React, { useMemo, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { ItemImage } from '@/components/ui/ItemImage';
import { formatCurrency } from '@/utils/display';
import { formatSharePct, type TreemapCategory, type TreemapPortfolio } from './model';

interface BrowsePanelProps {
  portfolio: TreemapPortfolio;
  focusedCategoryKey: string | null;
  onClose: () => void;
  onOpenCategory: (key: string) => void;
  onSelectItem: (key: string) => void;
}

const PAGE = 40;

export const BrowsePanel: React.FC<BrowsePanelProps> = ({
  portfolio,
  focusedCategoryKey,
  onClose,
  onOpenCategory,
  onSelectItem,
}) => {
  const [visible, setVisible] = useState(PAGE);
  const category = focusedCategoryKey
    ? portfolio.categoriesByKey.get(focusedCategoryKey) ?? null
    : null;

  const items = useMemo(() => category?.items ?? [], [category]);
  const slice = items.slice(0, visible);

  return (
    <div className="flex h-full min-h-0 flex-col bg-steam-card border border-steam-border rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4 border-b border-steam-border shrink-0">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary">
            {category ? 'Positions' : 'Categories'}
          </p>
          <h3 className="text-sm font-bold text-steam-text truncate">
            {category ? category.name : 'Portfolio'}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="pressable p-2 rounded-lg text-steam-secondary hover:text-steam-text hover:bg-steam-hover min-w-11 min-h-11 inline-flex items-center justify-center"
          aria-label="Close list"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {!category ? (
          <ul className="space-y-1">
            {portfolio.categories.map((cat) => (
              <li key={cat.key}>
                <button
                  type="button"
                  onClick={() => onOpenCategory(cat.key)}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-steam-hover"
                >
                  <span
                    className="w-2.5 h-8 rounded-full shrink-0"
                    style={{ backgroundColor: cat.fill }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-steam-text truncate">{cat.name}</p>
                    <p className="text-[11px] text-steam-tertiary font-mono tabular-nums">
                      {formatSharePct(cat.portfolioPct)} · {formatCurrency(cat.value)} ·{' '}
                      {cat.items.length} positions
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-steam-tertiary shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <ul className="space-y-1">
              {slice.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => onSelectItem(item.key)}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-steam-hover"
                  >
                    <ItemImage
                      src={item.iconUrl}
                      alt=""
                      className="w-8 h-8 object-contain"
                      wrapperClassName="w-8 h-8 shrink-0 rounded-md bg-steam-elevated"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-steam-text leading-snug line-clamp-2">
                        {item.fullName}
                      </p>
                      <p className="text-[11px] text-steam-tertiary font-mono tabular-nums">
                        {formatSharePct(item.portfolioPct)} · {formatCurrency(item.value)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            {visible < items.length && (
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE)}
                className="mt-2 w-full rounded-xl border border-steam-border py-2.5 text-sm font-bold text-steam-accent hover:bg-steam-hover"
              >
                Show more ({items.length - visible} left)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export type { TreemapCategory };
