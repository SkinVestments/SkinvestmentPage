import type { TreemapChartNode } from '@/utils/portfolioRpc';

export function treemapGroupTotal(group: TreemapChartNode): number {
  return group.size ?? (group.children ?? []).reduce((sum, child) => sum + (child.size ?? 0), 0);
}

function maxItemsForCategory(categorySharePct: number): number {
  if (categorySharePct >= 35) return 7;
  if (categorySharePct >= 20) return 6;
  if (categorySharePct >= 12) return 5;
  if (categorySharePct >= 6) return 4;
  return 3;
}

function darkenColor(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - amount);
  const g = Math.max(0, ((n >> 8) & 0xff) - amount);
  const b = Math.max(0, (n & 0xff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/** Cap items per sector so cells stay readable. Categories always keep their own sector. */
export function condenseTreemapForDisplay(
  groups: TreemapChartNode[],
  portfolioTotal: number,
): { data: TreemapChartNode[]; groupedItemCount: number; groupedCategoryCount: number } {
  let groupedItemCount = 0;

  const data = groups.map((group) => {
    const categoryTotal = treemapGroupTotal(group);
    const categorySharePct = portfolioTotal > 0 ? (categoryTotal / portfolioTotal) * 100 : 0;
    const maxItems = maxItemsForCategory(categorySharePct);
    const children = [...(group.children ?? [])].sort((a, b) => (b.size ?? 0) - (a.size ?? 0));

    if (children.length <= maxItems) {
      return { ...group, children, size: categoryTotal };
    }

    const visibleCount = Math.max(2, maxItems - 1);
    const visible = children.slice(0, visibleCount);
    const rest = children.slice(visibleCount);
    groupedItemCount += rest.length;

    const restTotal = rest.reduce((sum, child) => sum + (child.size ?? 0), 0);
    const baseFill = group.fill ?? '#6b7280';

    return {
      ...group,
      size: categoryTotal,
      children: [
        ...visible,
        {
          name: `+${rest.length} more`,
          size: restTotal,
          fill: darkenColor(baseFill, 36),
          category: group.name,
          isGrouped: true,
        },
      ],
    };
  });

  return { data, groupedItemCount, groupedCategoryCount: 0 };
}

export function treemapDisplayHeight(groups: TreemapChartNode[]): number {
  const categoryCount = groups.length;
  const maxItems = Math.max(...groups.map((group) => group.children?.length ?? 0), 1);
  return Math.min(540, Math.max(420, 360 + categoryCount * 20 + maxItems * 10));
}

export interface TreemapLayoutRect<T> {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  data: T;
}

interface LayoutItem<T> {
  value: number;
  data: T;
}

function worst(row: number[], length: number): number {
  const sum = row.reduce((a, b) => a + b, 0);
  if (sum <= 0 || length <= 0) return Infinity;

  const r2 = length * length;
  let rmax = 0;
  let rmin = Infinity;

  for (const value of row) {
    const area = (value / sum) * r2;
    rmax = Math.max(rmax, area);
    rmin = Math.min(rmin, area);
  }

  return Math.max((rmax * sum * sum) / r2, r2 / (rmin * sum * sum));
}

/** Classic squarify — rectangles sized by value within a bounding box. */
export function squarifyLayout<T>(
  items: LayoutItem<T>[],
  x: number,
  y: number,
  width: number,
  height: number,
): TreemapLayoutRect<T>[] {
  if (items.length === 0 || width <= 0 || height <= 0) return [];

  const total = items.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) return [];

  const sorted = [...items].sort((a, b) => b.value - a.value);
  const rects: TreemapLayoutRect<T>[] = [];

  let index = 0;
  let cx = x;
  let cy = y;
  let cw = width;
  let ch = height;
  const area = width * height;

  while (index < sorted.length) {
    const horizontal = cw >= ch;
    const length = horizontal ? ch : cw;

    const row: LayoutItem<T>[] = [];
    const rowValues: number[] = [];
    let rowSum = 0;

    while (index + row.length < sorted.length) {
      const candidate = sorted[index + row.length];
      const nextValues = [...rowValues, candidate.value];
      const nextSum = rowSum + candidate.value;

      if (row.length === 0 || worst(nextValues, length) <= worst(rowValues, length)) {
        row.push(candidate);
        rowValues.push(candidate.value);
        rowSum = nextSum;
      } else {
        break;
      }
    }

    const rowArea = (rowSum / total) * area;
    const thickness = rowArea / length;

    let offset = 0;
    for (const item of row) {
      const itemLength = (item.value / rowSum) * length;

      if (horizontal) {
        rects.push({
          x: cx,
          y: cy + offset,
          width: thickness,
          height: itemLength,
          value: item.value,
          data: item.data,
        });
      } else {
        rects.push({
          x: cx + offset,
          y: cy,
          width: itemLength,
          height: thickness,
          value: item.value,
          data: item.data,
        });
      }

      offset += itemLength;
    }

    if (horizontal) {
      cx += thickness;
      cw -= thickness;
    } else {
      cy += thickness;
      ch -= thickness;
    }

    index += row.length;
  }

  return rects;
}

export interface NestedTreemapCell {
  x: number;
  y: number;
  width: number;
  height: number;
  node: TreemapChartNode;
  depth: 'category' | 'item';
  portfolioPct: number;
  categoryPct?: number;
}

export interface NestedTreemapLayout {
  categories: NestedTreemapCell[];
  items: NestedTreemapCell[];
}

export function layoutNestedTreemap(
  groups: TreemapChartNode[],
  width: number,
  height: number,
  portfolioTotal: number,
  options?: { gap?: number; categoryHeader?: number },
): NestedTreemapLayout {
  const gap = options?.gap ?? 1;
  const header = options?.categoryHeader ?? 18;

  const categoryRects = squarifyLayout(
    groups.map((group) => ({
      value: group.size ?? group.children?.reduce((sum, child) => sum + (child.size ?? 0), 0) ?? 0,
      data: group,
    })),
    0,
    0,
    width,
    height,
  );

  const categories: NestedTreemapCell[] = [];
  const items: NestedTreemapCell[] = [];

  for (const categoryRect of categoryRects) {
    const group = categoryRect.data;
    const categoryTotal =
      group.size ?? group.children?.reduce((sum, child) => sum + (child.size ?? 0), 0) ?? 0;
    const portfolioPct = portfolioTotal > 0 ? (categoryTotal / portfolioTotal) * 100 : 0;

    categories.push({
      x: categoryRect.x,
      y: categoryRect.y,
      width: categoryRect.width,
      height: categoryRect.height,
      node: group,
      depth: 'category',
      portfolioPct,
    });

    const innerX = categoryRect.x + gap;
    const innerY = categoryRect.y + header;
    const innerWidth = Math.max(0, categoryRect.width - gap * 2);
    const innerHeight = Math.max(0, categoryRect.height - header - gap);

    const itemRects = squarifyLayout(
      (group.children ?? []).map((child) => ({
        value: child.size ?? 0,
        data: child,
      })),
      innerX,
      innerY,
      innerWidth,
      innerHeight,
    );

    for (const itemRect of itemRects) {
      items.push({
        x: itemRect.x,
        y: itemRect.y,
        width: itemRect.width,
        height: itemRect.height,
        node: itemRect.data,
        depth: 'item',
        portfolioPct: portfolioTotal > 0 ? ((itemRect.data.size ?? 0) / portfolioTotal) * 100 : 0,
        categoryPct: categoryTotal > 0 ? ((itemRect.data.size ?? 0) / categoryTotal) * 100 : 0,
      });
    }
  }

  return { categories, items };
}
