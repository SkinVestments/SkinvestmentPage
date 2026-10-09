import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ItemImage } from '@/components/ui/ItemImage';
import { formatCurrency } from '@/utils/display';
import { squarifyLayout } from '@/utils/treemapLayout';
import {
  AUTO_ZOOM_MAX,
  clampScale,
  MANUAL_ZOOM_MAX,
  type TreemapViewport,
} from './interaction';
import { formatSharePct, type TreemapCategory, type TreemapItem, type TreemapPortfolio } from './model';

export interface MapCell {
  key: string;
  kind: 'category' | 'item';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  category?: TreemapCategory;
  item?: TreemapItem;
  portfolioPct: number;
  /** Portfolio view only — clickable header band height in map units. */
  headerHeight?: number;
}

function parseHex(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function textOn(hex: string) {
  const { r, g, b } = parseHex(hex);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.55 ? '#0f172a' : '#f8fafc';
}

function layoutPortfolio(portfolio: TreemapPortfolio, w: number, h: number, gap = 2): MapCell[] {
  if (w <= 0 || h <= 0) return [];
  const cats = squarifyLayout(
    portfolio.categories.map((c) => ({ value: c.value, data: c })),
    gap,
    gap,
    w - gap * 2,
    h - gap * 2,
  );
  const cells: MapCell[] = [];
  for (const rect of cats) {
    const cat = rect.data;
    const header = Math.min(22, Math.max(16, rect.height * 0.12));
    cells.push({
      key: cat.key,
      kind: 'category',
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      fill: cat.fill,
      category: cat,
      portfolioPct: cat.portfolioPct,
      headerHeight: header,
    });
    const ix = rect.x + gap;
    const iy = rect.y + header;
    const iw = Math.max(0, rect.width - gap * 2);
    const ih = Math.max(0, rect.height - header - gap);
    const items = squarifyLayout(
      cat.items.map((item) => ({ value: item.value, data: item })),
      ix,
      iy,
      iw,
      ih,
    );
    for (const ir of items) {
      cells.push({
        key: ir.data.key,
        kind: 'item',
        x: ir.x,
        y: ir.y,
        width: Math.max(0, ir.width - 1),
        height: Math.max(0, ir.height - 1),
        fill: ir.data.fill,
        item: ir.data,
        portfolioPct: ir.data.portfolioPct,
      });
    }
  }
  return cells;
}

function layoutCategory(category: TreemapCategory, w: number, h: number, gap = 2): MapCell[] {
  if (w <= 0 || h <= 0) return [];
  const items = squarifyLayout(
    category.items.map((item) => ({ value: item.value, data: item })),
    gap,
    gap,
    w - gap * 2,
    h - gap * 2,
  );
  return items.map((ir) => ({
    key: ir.data.key,
    kind: 'item' as const,
    x: ir.x,
    y: ir.y,
    width: Math.max(0, ir.width - 1),
    height: Math.max(0, ir.height - 1),
    fill: ir.data.fill,
    item: ir.data,
    portfolioPct: ir.data.portfolioPct,
  }));
}

/**
 * Fit a cell into the current map viewport.
 * `viewW`/`viewH` must be the map host size AFTER the side panel has laid out
 * (do not subtract panel width again).
 */
export function computeZoomToCell(
  cell: MapCell,
  viewW: number,
  viewH: number,
): TreemapViewport {
  const usableW = Math.max(160, viewW);
  const usableH = Math.max(160, viewH - 56); // leave room for floating zoom controls

  // Floor thin squarify slices for scale only — position always uses real geometry.
  const cellW = Math.max(cell.width, 28);
  const cellH = Math.max(cell.height, 28);
  const pad = 0.72;
  const sx = (usableW * pad) / cellW;
  const sy = (usableH * pad) / cellH;
  let scale = Math.min(sx, sy);
  if (!Number.isFinite(scale) || scale <= 0) scale = 1;
  scale = Math.min(AUTO_ZOOM_MAX, Math.max(1, scale));

  const cx = cell.x + cell.width / 2;
  const cy = cell.y + cell.height / 2;
  const focusX = usableW / 2;
  const focusY = usableH / 2;
  let x = focusX - cx * scale;
  let y = focusY - cy * scale;

  // Pin the focused cell into view (center if it still overflows after scale).
  const margin = 16;
  const left = cell.x * scale + x;
  const right = (cell.x + cell.width) * scale + x;
  const top = cell.y * scale + y;
  const bottom = (cell.y + cell.height) * scale + y;
  const cellScreenW = right - left;
  const cellScreenH = bottom - top;

  if (cellScreenW >= usableW - margin * 2) {
    x = focusX - cx * scale;
  } else {
    if (left < margin) x += margin - left;
    if (right > usableW - margin) x -= right - (usableW - margin);
  }

  if (cellScreenH >= usableH - margin * 2) {
    y = focusY - cy * scale;
  } else {
    if (top < margin) y += margin - top;
    if (bottom > usableH - margin) y -= bottom - (usableH - margin);
  }

  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(scale)) {
    return { scale: 1, x: 0, y: 0 };
  }

  return { scale, x, y };
}

export function viewportsNearlyEqual(a: TreemapViewport, b: TreemapViewport): boolean {
  return (
    Math.abs(a.scale - b.scale) < 0.001 &&
    Math.abs(a.x - b.x) < 0.5 &&
    Math.abs(a.y - b.y) < 0.5
  );
}

interface MapCanvasProps {
  portfolio: TreemapPortfolio;
  focusedCategoryKey: string | null;
  selectedItemKey: string | null;
  viewport: TreemapViewport;
  onViewportChange: (next: TreemapViewport) => void;
  onSelectCategory: (key: string) => void;
  onSelectItem: (key: string) => void;
  wheelActive: boolean;
  /** Optional explicit size from parent (avoids 0×0 absolute-host race). */
  width?: number;
  height?: number;
  className?: string;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  portfolio,
  focusedCategoryKey,
  selectedItemKey,
  viewport,
  onViewportChange,
  onSelectCategory,
  onSelectItem,
  wheelActive,
  width: widthProp,
  height: heightProp,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = React.useState({ w: 0, h: 0 });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
    downCell: MapCell | null;
  } | null>(null);
  // Keep latest viewport in a ref so wheel/pan can read it without rebinding listeners every frame.
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;
  const onViewportChangeRef = useRef(onViewportChange);
  onViewportChangeRef.current = onViewportChange;
  const wheelRafRef = useRef(0);
  const pendingViewportRef = useRef<TreemapViewport | null>(null);

  const flushViewport = useCallback(() => {
    wheelRafRef.current = 0;
    const next = pendingViewportRef.current;
    if (!next) return;
    pendingViewportRef.current = null;
    onViewportChangeRef.current(next);
  }, []);

  const scheduleViewport = useCallback(
    (next: TreemapViewport) => {
      pendingViewportRef.current = next;
      viewportRef.current = next;
      if (wheelRafRef.current) return;
      wheelRafRef.current = window.requestAnimationFrame(flushViewport);
    },
    [flushViewport],
  );

  useEffect(
    () => () => {
      if (wheelRafRef.current) window.cancelAnimationFrame(wheelRafRef.current);
    },
    [],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const w = Math.floor(r.width);
      const h = Math.floor(r.height);
      if (w > 0 && h > 0) setMeasured({ w, h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const size = {
    w: widthProp && widthProp > 0 ? widthProp : measured.w,
    h: heightProp && heightProp > 0 ? heightProp : measured.h,
  };

  const focused = focusedCategoryKey
    ? portfolio.categoriesByKey.get(focusedCategoryKey) ?? null
    : null;

  const cells = useMemo(() => {
    if (size.w <= 0 || size.h <= 0) return [];
    if (focused) return layoutCategory(focused, size.w, size.h);
    return layoutPortfolio(portfolio, size.w, size.h);
  }, [portfolio, focused, size.w, size.h]);

  const cellsByKey = useMemo(() => {
    const m = new Map<string, MapCell>();
    for (const c of cells) m.set(c.key, c);
    return m;
  }, [cells]);

  const screenToMap = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      const sx = clientX - r.left;
      const sy = clientY - r.top;
      return {
        x: (sx - viewport.x) / viewport.scale,
        y: (sy - viewport.y) / viewport.scale,
      };
    },
    [viewport],
  );

  const hitTest = useCallback(
    (clientX: number, clientY: number): MapCell | null => {
      const p = screenToMap(clientX, clientY);
      // Prefer items — gaps between tiles must NOT fall through to the category body
      // (that felt like “click twice”: first drill-in, second select).
      for (let i = cells.length - 1; i >= 0; i -= 1) {
        const c = cells[i];
        if (c.kind !== 'item') continue;
        if (p.x >= c.x && p.x <= c.x + c.width && p.y >= c.y && p.y <= c.y + c.height) {
          return c;
        }
      }
      for (let i = cells.length - 1; i >= 0; i -= 1) {
        const c = cells[i];
        if (c.kind !== 'category') continue;
        // Only the header strip opens a category — not the whole padded body.
        const headerH = c.headerHeight ?? 18;
        if (
          p.x >= c.x &&
          p.x <= c.x + c.width &&
          p.y >= c.y &&
          p.y <= c.y + headerH
        ) {
          return c;
        }
      }
      return null;
    },
    [cells, screenToMap],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !wheelActive) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      const vp = viewportRef.current;
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      const nextScale = clampScale(vp.scale * factor, MANUAL_ZOOM_MAX);
      const mx = (px - vp.x) / vp.scale;
      const my = (py - vp.y) / vp.scale;
      // Coalesce to one React update per frame so labels stay locked to tiles.
      scheduleViewport({
        scale: nextScale,
        x: px - mx * nextScale,
        y: py - my * nextScale,
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [wheelActive, scheduleViewport]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const vp = viewportRef.current;
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: vp.x,
      originY: vp.y,
      moved: false,
      downCell: hitTest(e.clientX, e.clientY),
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    // Only pan after a real drag — never while zoomed on tiny pointer jitter (that ate clicks).
    if (!d.moved && Math.hypot(dx, dy) > 8) d.moved = true;
    if (!d.moved) return;
    const vp = viewportRef.current;
    scheduleViewport({
      scale: vp.scale,
      x: d.originX + dx,
      y: d.originY + dy,
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    dragRef.current = null;
    if (d.moved) return;
    // Prefer down-cell so a 1px layout shift during click still selects what you pressed.
    const cell = d.downCell ?? hitTest(e.clientX, e.clientY);
    if (!cell) return;
    if (cell.kind === 'category' && cell.category) onSelectCategory(cell.category.key);
    else if (cell.kind === 'item' && cell.item) onSelectItem(cell.item.key);
  };

  const viewW = size.w;
  const viewH = size.h;

  // Everything in screen pixels (no CSS scale) — tiles + type stay sharp when zoomed.
  const screenTiles = useMemo(() => {
    const out: Array<{
      key: string;
      kind: 'category' | 'item';
      left: number;
      top: number;
      width: number;
      height: number;
      headerPx: number;
      fill: string;
      ink: string;
      cell: MapCell;
    }> = [];

    for (const c of cells) {
      const left = Math.round(c.x * viewport.scale + viewport.x);
      const top = Math.round(c.y * viewport.scale + viewport.y);
      const width = Math.max(0, Math.round(c.width * viewport.scale));
      const height = Math.max(0, Math.round(c.height * viewport.scale));
      if (left + width < 0 || top + height < 0 || left > viewW || top > viewH) continue;
      if (width < 2 || height < 2) continue;
      out.push({
        key: c.key,
        kind: c.kind,
        left,
        top,
        width,
        height,
        headerPx: Math.max(0, Math.round((c.headerHeight ?? 0) * viewport.scale)),
        fill: c.fill,
        ink: textOn(c.fill),
        cell: c,
      });
    }
    return out;
  }, [cells, viewport.scale, viewport.x, viewport.y, viewW, viewH]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden touch-none bg-steam-bg/80 select-none ${className}`}
      style={{ touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="application"
      aria-label={
        focused
          ? `${focused.name} positions map`
          : 'Portfolio diversity map'
      }
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {cells.length === 0 && size.w > 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-steam-tertiary">
            Preparing map…
          </div>
        ) : null}

        {screenTiles.map((tile) => {
          if (tile.kind === 'category') {
            if (focused) return null;
            return (
              <div
                key={`tile-cat-${tile.key}`}
                className="absolute overflow-hidden rounded"
                style={{
                  left: tile.left,
                  top: tile.top,
                  width: tile.width,
                  height: tile.height,
                  backgroundColor: tile.fill,
                  opacity: 0.4,
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)',
                }}
              />
            );
          }
          return null;
        })}

        {screenTiles.map((tile) => {
          if (tile.kind === 'category') {
            if (focused || tile.width < 56 || tile.headerPx < 14) return null;
            return (
              <div
                key={`hdr-cat-${tile.key}`}
                className="absolute overflow-hidden px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                style={{
                  left: tile.left,
                  top: tile.top,
                  width: tile.width,
                  height: Math.min(tile.headerPx, 22),
                  backgroundColor: tile.fill,
                  color: tile.ink,
                }}
              >
                <span className="block truncate">
                  {tile.cell.category?.name} · {formatSharePct(tile.cell.portfolioPct)}
                </span>
              </div>
            );
          }

          const selected = tile.key === selectedItemKey;
          const showName = tile.width >= 72 && tile.height >= 32;
          const showValue = tile.width >= 52 && tile.height >= 22;
          const nameLines = selected ? 6 : focused ? 4 : 3;
          const fontSize = tile.width >= 320 ? 14 : tile.width >= 180 ? 12 : 11;
          const pad = 12; // p-1.5 × 2
          const textReserve =
            showName || showValue
              ? Math.round(
                  Math.min(
                    58,
                    Math.max(26, fontSize * (showName && showValue ? 2.75 : 1.45) + 10),
                  ),
                )
              : 0;
          // Explicit icon window from tile size — img uses object-contain (auto other side).
          const iconMaxW = Math.max(0, tile.width - pad);
          const iconMaxH = Math.max(0, tile.height - pad - textReserve);
          const hasIcon = Boolean(tile.cell.item?.iconUrl);
          const showHeroIcon = hasIcon && iconMaxW >= 48 && iconMaxH >= 40;
          const inlineSize = Math.max(16, Math.min(28, Math.floor(tile.height * 0.42)));
          const showInlineIcon =
            hasIcon && !showHeroIcon && showName && tile.width >= 88 && tile.height >= 40;

          return (
            <div
              key={`tile-item-${tile.key}`}
              className="absolute box-border flex flex-col overflow-hidden rounded-sm p-1.5"
              style={{
                left: tile.left,
                top: tile.top,
                width: tile.width,
                height: tile.height,
                backgroundColor: tile.fill,
                color: tile.ink,
                fontSize,
                lineHeight: 1.25,
                boxShadow: selected
                  ? 'inset 0 0 0 2px #fff, 0 0 0 1px rgba(15,23,42,0.35)'
                  : 'inset 0 0 0 1px rgba(0,0,0,0.28)',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              {showHeroIcon ? (
                <div
                  className="mb-1 flex shrink-0 items-center justify-center overflow-hidden"
                  style={{ width: '100%', height: iconMaxH, maxHeight: iconMaxH }}
                >
                  <ItemImage
                    src={tile.cell.item!.iconUrl}
                    alt=""
                    className="h-auto w-auto max-h-full max-w-full object-contain"
                    wrapperClassName="flex h-full w-full items-center justify-center"
                  />
                </div>
              ) : null}
              {(showName || showValue) && (
                <div
                  className={`flex min-h-0 flex-col gap-0.5 ${
                    showHeroIcon ? 'shrink-0' : 'flex-1 justify-between'
                  }`}
                >
                  {showName ? (
                    <div className="flex min-w-0 items-start gap-1 font-semibold">
                      {showInlineIcon ? (
                        <span
                          className="mt-0.5 inline-flex shrink-0 items-center justify-center overflow-hidden"
                          style={{ width: inlineSize, height: inlineSize }}
                        >
                          <ItemImage
                            src={tile.cell.item!.iconUrl}
                            alt=""
                            className="h-auto w-auto max-h-full max-w-full object-contain"
                            wrapperClassName="flex h-full w-full items-center justify-center"
                          />
                        </span>
                      ) : null}
                      <span
                        className="min-w-0"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: nameLines,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {tile.cell.item?.displayName}
                        {tile.cell.item?.wearSuffix ? (
                          <span className="ml-1 opacity-80">{tile.cell.item.wearSuffix}</span>
                        ) : null}
                      </span>
                    </div>
                  ) : null}
                  {showValue ? (
                    <div className="shrink-0 font-mono tabular-nums opacity-90" style={{ fontSize }}>
                      {formatCurrency(tile.cell.item?.value ?? 0)}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <span className="sr-only" data-cell-count={cells.length} data-has={cellsByKey.has(selectedItemKey ?? '') ? '1' : '0'} />
    </div>
  );
};

export function findCell(
  portfolio: TreemapPortfolio,
  focusedCategoryKey: string | null,
  itemKey: string,
  w: number,
  h: number,
): MapCell | null {
  const focused = focusedCategoryKey
    ? portfolio.categoriesByKey.get(focusedCategoryKey) ?? null
    : null;
  const cells = focused ? layoutCategory(focused, w, h) : layoutPortfolio(portfolio, w, h);
  return cells.find((c) => c.key === itemKey) ?? null;
}
