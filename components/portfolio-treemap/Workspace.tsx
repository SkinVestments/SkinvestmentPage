import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Expand,
  List,
  Loader2,
  Maximize2,
  Minimize2,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { formatCurrency } from '@/utils/display';
import { BrowsePanel } from './BrowsePanel';
import { computeZoomToCell, findCell, MapCanvas, viewportsNearlyEqual } from './MapCanvas';
import { ItemDetailsPanel } from './ItemDetailsPanel';
import {
  clampScale,
  createInitialInteraction,
  DEFAULT_VIEWPORT,
  MANUAL_ZOOM_MAX,
  type TreemapInteractionState,
} from './interaction';
import type { TreemapPortfolio } from './model';

interface WorkspaceProps {
  portfolio: TreemapPortfolio;
  mode: 'embedded' | 'page' | 'fullscreen';
  onRequestFullscreen?: () => void;
  onExitFullscreen?: () => void;
  onClosePage?: () => void;
  initialCategoryKey?: string | null;
  className?: string;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  portfolio,
  mode,
  onRequestFullscreen,
  onExitFullscreen,
  onClosePage,
  initialCategoryKey = null,
  className = '',
}) => {
  const [state, setState] = useState<TreemapInteractionState>(() => ({
    ...createInitialInteraction(),
    focusedCategoryKey: initialCategoryKey,
  }));
  const mapHostRef = useRef<HTMLDivElement>(null);
  const [mapSize, setMapSize] = useState({ w: 0, h: 0 });
  const [wheelActive, setWheelActive] = useState(false);
  const wide = useMediaWide();

  const panelOpen = state.panel !== 'none';
  /** When true, skip auto-fit (user panned/zoomed after selecting). */
  const userViewportRef = useRef(false);
  const fitGenRef = useRef(0);

  const measureMapHost = useCallback(() => {
    const el = mapHostRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const w = Math.floor(r.width);
    const h = Math.floor(r.height);
    if (w > 0 && h > 0) {
      setMapSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    }
  }, []);

  useEffect(() => {
    const el = mapHostRef.current;
    if (!el) return;
    measureMapHost();
    const ro = new ResizeObserver(measureMapHost);
    ro.observe(el);
    // Layout can settle a frame later inside dashboard flex shells / side panel.
    const raf = window.requestAnimationFrame(measureMapHost);
    return () => {
      ro.disconnect();
      window.cancelAnimationFrame(raf);
    };
  }, [portfolio.positionCount, panelOpen, measureMapHost]);

  // Preserve selection across refresh if keys still exist
  useEffect(() => {
    setState((prev) => {
      let next = { ...prev };
      if (next.focusedCategoryKey && !portfolio.categoriesByKey.has(next.focusedCategoryKey)) {
        next = {
          ...next,
          focusedCategoryKey: null,
          selectedItemKey: null,
          panel: 'none',
          viewport: { ...DEFAULT_VIEWPORT },
          viewportBeforeSelection: null,
        };
      }
      if (next.selectedItemKey && !portfolio.itemsByKey.has(next.selectedItemKey)) {
        next = {
          ...next,
          selectedItemKey: null,
          panel: next.panel === 'details' ? 'none' : next.panel,
          viewport: next.viewportBeforeSelection ?? next.viewport,
          viewportBeforeSelection: null,
        };
      }
      return next;
    });
  }, [portfolio]);

  const selectedItem = state.selectedItemKey
    ? portfolio.itemsByKey.get(state.selectedItemKey) ?? null
    : null;

  const setViewport = useCallback((viewport: TreemapInteractionState['viewport']) => {
    userViewportRef.current = true;
    setState((s) => ({ ...s, viewport }));
  }, []);

  const openCategory = useCallback((key: string) => {
    userViewportRef.current = false;
    fitGenRef.current += 1;
    setState((s) => ({
      ...s,
      focusedCategoryKey: key,
      selectedItemKey: null,
      panel: s.panel === 'details' ? 'browse' : s.panel,
      viewport: { ...DEFAULT_VIEWPORT },
      viewportBeforeSelection: null,
    }));
  }, []);

  const selectItem = useCallback(
    (key: string) => {
      const item = portfolio.itemsByKey.get(key);
      if (!item) return;
      // Re-enable auto-fit; zoom runs again whenever the map host resizes (panel open).
      userViewportRef.current = false;
      fitGenRef.current += 1;
      setState((s) => {
        const focused = s.focusedCategoryKey ?? item.category;
        const enteringCategory = s.focusedCategoryKey !== focused;
        const before = s.selectedItemKey ? s.viewportBeforeSelection : { ...s.viewport };
        return {
          ...s,
          focusedCategoryKey: focused,
          selectedItemKey: key,
          panel: 'details',
          viewportBeforeSelection: before,
          viewport: enteringCategory ? { ...DEFAULT_VIEWPORT } : s.viewport,
        };
      });
    },
    [portfolio],
  );

  // Fit selection to the *current* map host. Re-runs on resize so panel open can't leave tiles off-screen.
  useEffect(() => {
    const key = state.selectedItemKey;
    if (!key || userViewportRef.current) return;
    if (mapSize.w < 80 || mapSize.h < 80) return;

    const gen = fitGenRef.current;
    const cell = findCell(portfolio, state.focusedCategoryKey, key, mapSize.w, mapSize.h);
    if (!cell || cell.width < 1 || cell.height < 1) return;

    const nextVp = computeZoomToCell(cell, mapSize.w, mapSize.h);
    setState((s) => {
      if (s.selectedItemKey !== key || userViewportRef.current || fitGenRef.current !== gen) return s;
      if (viewportsNearlyEqual(s.viewport, nextVp)) return s;
      return { ...s, viewport: nextVp };
    });
  }, [state.selectedItemKey, state.focusedCategoryKey, mapSize.w, mapSize.h, portfolio]);

  // Remeasure after panel/selection paints (ResizeObserver can lag one frame).
  useEffect(() => {
    if (!state.selectedItemKey) return;
    const id = window.requestAnimationFrame(() => {
      measureMapHost();
      window.requestAnimationFrame(measureMapHost);
    });
    return () => window.cancelAnimationFrame(id);
  }, [state.selectedItemKey, state.panel, measureMapHost]);

  const closePanel = useCallback(() => {
    userViewportRef.current = false;
    fitGenRef.current += 1;
    setState((s) => ({
      ...s,
      selectedItemKey: null,
      panel: 'none',
      viewport: s.viewportBeforeSelection ?? s.viewport,
      viewportBeforeSelection: null,
    }));
  }, []);

  const goBack = useCallback(() => {
    setState((s) => {
      if (s.selectedItemKey || s.panel === 'details') {
        userViewportRef.current = false;
        fitGenRef.current += 1;
        return {
          ...s,
          selectedItemKey: null,
          panel: 'none',
          viewport: s.viewportBeforeSelection ?? { ...DEFAULT_VIEWPORT },
          viewportBeforeSelection: null,
        };
      }
      if (s.panel === 'browse') {
        return { ...s, panel: 'none' };
      }
      if (s.focusedCategoryKey) {
        userViewportRef.current = false;
        return {
          ...s,
          focusedCategoryKey: null,
          viewport: { ...DEFAULT_VIEWPORT },
        };
      }
      return s;
    });
  }, []);

  const zoomBy = (factor: number) => {
    userViewportRef.current = true;
    setState((s) => {
      const cx = mapSize.w / 2;
      const cy = mapSize.h / 2;
      const nextScale = clampScale(s.viewport.scale * factor, MANUAL_ZOOM_MAX);
      const mx = (cx - s.viewport.x) / s.viewport.scale;
      const my = (cy - s.viewport.y) / s.viewport.scale;
      return {
        ...s,
        viewport: {
          scale: nextScale,
          x: cx - mx * nextScale,
          y: cy - my * nextScale,
        },
      };
    });
  };

  const resetView = () => {
    userViewportRef.current = false;
    fitGenRef.current += 1;
    setState((s) => ({
      ...s,
      viewport: { ...DEFAULT_VIEWPORT },
      viewportBeforeSelection: null,
      selectedItemKey: null,
      panel: s.panel === 'details' ? 'none' : s.panel,
    }));
  };

  const breadcrumb = state.focusedCategoryKey
    ? portfolio.categoriesByKey.get(state.focusedCategoryKey)?.name ?? 'Category'
    : 'Portfolio';

  return (
    <div
      className={`flex h-full min-h-0 flex-col bg-steam-bg ${className}`}
      onFocusCapture={() => setWheelActive(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setWheelActive(false);
      }}
      onPointerEnter={() => setWheelActive(true)}
      onPointerLeave={() => setWheelActive(false)}
    >
      <header className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-3 border-b border-steam-border shrink-0 bg-steam-card/80 backdrop-blur">
        <button
          type="button"
          onClick={goBack}
          disabled={!state.focusedCategoryKey && state.panel === 'none'}
          className="pressable inline-flex items-center gap-1.5 rounded-xl border border-steam-border px-3 py-2 text-xs font-bold text-steam-text hover:bg-steam-hover disabled:opacity-40 min-h-11"
          aria-label="Back one level"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary">
            {mode === 'fullscreen' ? 'Fullscreen map' : 'Interactive map'}
          </p>
          <p className="text-sm font-bold text-steam-text truncate">
            {breadcrumb}
            {selectedItem ? ` · ${selectedItem.displayName}` : ''}
          </p>
        </div>

        <p className="text-xs font-mono text-steam-secondary tabular-nums hidden sm:block">
          {formatCurrency(portfolio.totalValue)} · {portfolio.positionCount} positions ·{' '}
          {portfolio.categoryCount} categories
        </p>

        <button
          type="button"
          onClick={() =>
            setState((s) => ({
              ...s,
              panel: s.panel === 'browse' ? 'none' : 'browse',
              selectedItemKey: s.panel === 'browse' ? s.selectedItemKey : null,
            }))
          }
          className="pressable inline-flex items-center gap-1.5 rounded-xl border border-steam-border px-3 py-2 text-xs font-bold text-steam-text hover:bg-steam-hover min-h-11"
          aria-label="Open positions list"
        >
          <List className="w-4 h-4" />
          List
        </button>

        {mode !== 'fullscreen' && onRequestFullscreen && (
          <button
            type="button"
            onClick={onRequestFullscreen}
            className="pressable inline-flex items-center gap-1.5 rounded-xl border border-steam-border px-3 py-2 text-xs font-bold text-steam-text hover:bg-steam-hover min-h-11"
            aria-label="Open fullscreen map"
          >
            <Maximize2 className="w-4 h-4" />
            Full screen
          </button>
        )}

        {mode === 'fullscreen' && onExitFullscreen && (
          <button
            type="button"
            onClick={onExitFullscreen}
            className="pressable inline-flex items-center gap-1.5 rounded-xl bg-steam-accent text-white px-3 py-2 text-xs font-bold min-h-11"
            aria-label="Exit fullscreen"
          >
            <Minimize2 className="w-4 h-4" />
            Close
          </button>
        )}

        {mode === 'page' && onClosePage && (
          <button
            type="button"
            onClick={onClosePage}
            className="pressable p-2 rounded-xl border border-steam-border text-steam-secondary hover:text-steam-text min-w-11 min-h-11 inline-flex items-center justify-center"
            aria-label="Close explorer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </header>

      <div
        className={`flex-1 min-h-0 overflow-hidden p-3 gap-3 ${
          wide ? 'flex flex-row' : 'flex flex-col'
        }`}
      >
        <div
          ref={mapHostRef}
          className="relative min-h-[240px] min-w-0 flex-1 basis-0 h-full rounded-2xl border border-steam-border overflow-hidden bg-steam-elevated/30"
        >
          <MapCanvas
            portfolio={portfolio}
            focusedCategoryKey={state.focusedCategoryKey}
            selectedItemKey={state.selectedItemKey}
            viewport={state.viewport}
            onViewportChange={setViewport}
            onSelectCategory={openCategory}
            onSelectItem={selectItem}
            wheelActive={wheelActive}
            width={mapSize.w}
            height={mapSize.h}
            className="absolute inset-0 h-full w-full"
          />

          <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-10">
            <ZoomBtn label="Zoom in" onClick={() => zoomBy(1.2)} icon={<ZoomIn className="w-4 h-4" />} />
            <ZoomBtn label="Zoom out" onClick={() => zoomBy(1 / 1.2)} icon={<ZoomOut className="w-4 h-4" />} />
            <ZoomBtn label="Reset view" onClick={resetView} icon={<RotateCcw className="w-4 h-4" />} />
            <div className="rounded-lg bg-steam-card/90 border border-steam-border px-2 py-1 text-[10px] font-mono text-steam-secondary text-center tabular-nums">
              {state.viewport.scale.toFixed(1)}×
            </div>
          </div>
        </div>

        {panelOpen && (
          <div
            className={`min-h-0 shrink-0 ${
              wide ? 'w-[min(360px,43%)]' : 'h-[min(320px,43%)]'
            }`}
          >
            {state.panel === 'details' && selectedItem ? (
              <ItemDetailsPanel item={selectedItem} onClose={closePanel} />
            ) : (
              <BrowsePanel
                portfolio={portfolio}
                focusedCategoryKey={state.focusedCategoryKey}
                onClose={closePanel}
                onOpenCategory={openCategory}
                onSelectItem={selectItem}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ZoomBtn: React.FC<{ label: string; onClick: () => void; icon: React.ReactNode }> = ({
  label,
  onClick,
  icon,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="pressable inline-flex items-center justify-center w-11 h-11 rounded-xl border border-steam-border bg-steam-card/95 text-steam-text hover:bg-steam-hover shadow-lg"
  >
    {icon}
  </button>
);

function useMediaWide() {
  const [wide, setWide] = useState(
    () => (typeof window !== 'undefined' ? window.innerWidth >= 768 : true),
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  // Also react to container aspect via resize — prefer width of window for panel side
  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= 768 && window.innerWidth > window.innerHeight * 0.85);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return wide;
}

export const WorkspaceLoading: React.FC = () => (
  <div className="flex flex-1 items-center justify-center min-h-[320px] text-steam-accent">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);

export const WorkspaceEmpty: React.FC = () => (
  <div className="flex flex-1 flex-col items-center justify-center min-h-[280px] text-center px-6">
    <Expand className="w-8 h-8 text-steam-tertiary mb-3" />
    <p className="font-bold text-steam-text">No positions to map</p>
    <p className="text-sm text-steam-secondary mt-1">Add portfolio items to explore diversity.</p>
  </div>
);

export const WorkspaceError: React.FC<{ message: string; onRetry: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="flex flex-1 flex-col items-center justify-center min-h-[280px] text-center px-6 gap-3">
    <p className="font-bold text-steam-text">Could not load map</p>
    <p className="text-sm text-steam-secondary">{message}</p>
    <button
      type="button"
      onClick={onRetry}
      className="pressable rounded-xl bg-steam-accent text-white px-4 py-2.5 text-sm font-bold"
    >
      Retry
    </button>
  </div>
);
