export type TreemapViewport = { scale: number; x: number; y: number };

export type TreemapPanel = 'none' | 'details' | 'browse';

export type TreemapInteractionState = {
  focusedCategoryKey: string | null;
  selectedItemKey: string | null;
  viewport: TreemapViewport;
  viewportBeforeSelection: TreemapViewport | null;
  panel: TreemapPanel;
};

export const DEFAULT_VIEWPORT: TreemapViewport = { scale: 1, x: 0, y: 0 };

export const MANUAL_ZOOM_MIN = 1;
export const MANUAL_ZOOM_MAX = 8;
export const AUTO_ZOOM_MAX = 64;

export function createInitialInteraction(): TreemapInteractionState {
  return {
    focusedCategoryKey: null,
    selectedItemKey: null,
    viewport: { ...DEFAULT_VIEWPORT },
    viewportBeforeSelection: null,
    panel: 'none',
  };
}

export function clampScale(scale: number, max = MANUAL_ZOOM_MAX): number {
  return Math.min(max, Math.max(MANUAL_ZOOM_MIN, scale));
}
