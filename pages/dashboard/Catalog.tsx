import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Library } from 'lucide-react';
import { CatalogBrowse } from '@/components/catalog/CatalogBrowse';
import { MarketMoversPair } from '@/components/catalog/MarketMoversSection';

type CatalogTab = 'discover' | 'browse';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: CatalogTab = searchParams.get('tab') === 'browse' ? 'browse' : 'discover';

  const setTab = (next: CatalogTab) => {
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (next === 'browse') p.set('tab', 'browse');
        else {
          p.delete('tab');
          // Drop browse-only query keys when leaving Browse.
          for (const key of [
            'q',
            'category',
            'group',
            'weapon',
            'collection',
            'rarity',
            'min',
            'max',
            'sort',
            'page',
          ]) {
            p.delete(key);
          }
        }
        return p;
      },
      { replace: true },
    );
  };

  return (
    <div className="text-steam-text animate-fade-in pb-10 min-w-0 overflow-x-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-steam-text mb-1">
            Catalog
          </h1>
          <p className="text-steam-secondary">
            {tab === 'discover'
              ? 'Market movers and highlights from the CS2 economy.'
              : 'Browse item families like the Steam Market, then open a variant.'}
          </p>
        </div>
      </div>

      <div
        className="mb-6 inline-flex rounded-xl border border-steam-border bg-steam-card p-1 shadow-lg"
        role="tablist"
        aria-label="Catalog views"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'discover'}
          onClick={() => setTab('discover')}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] text-sm font-bold min-h-11 transition-colors ${
            tab === 'discover'
              ? 'bg-steam-accent text-white'
              : 'text-steam-secondary hover:text-steam-text'
          }`}
        >
          <Compass className="w-4 h-4" />
          Discover
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'browse'}
          onClick={() => setTab('browse')}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] text-sm font-bold min-h-11 transition-colors ${
            tab === 'browse'
              ? 'bg-steam-accent text-white'
              : 'text-steam-secondary hover:text-steam-text'
          }`}
        >
          <Library className="w-4 h-4" />
          Browse
        </button>
      </div>

      {tab === 'discover' ? <MarketMoversPair variant="discover" /> : null}
      {tab === 'browse' ? <CatalogBrowse /> : null}
    </div>
  );
};

export default Catalog;
