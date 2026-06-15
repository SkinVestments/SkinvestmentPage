/** Shape returned by get_portfolio_current_values (jsonb_build_object). */
export interface PortfolioCurrentValues {
  deposited: number;
  withdrawn: number;
  inventory_value: number;
  investments_value: number;
  period_gain_value: number;
  period_roi_percentage: number;
  total_portfolio_value: number;
}

/** RPC may return a jsonb object or a legacy single-row TABLE array. */
export function normalizePortfolioCurrentValues(data: unknown): PortfolioCurrentValues | null {
  if (data == null) return null;

  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== 'object') return null;

  const r = row as Record<string, unknown>;

  return {
    deposited: Number(r.deposited ?? 0),
    withdrawn: Number(r.withdrawn ?? 0),
    inventory_value: Number(r.inventory_value ?? 0),
    investments_value: Number(r.investments_value ?? 0),
    period_gain_value: Number(r.period_gain_value ?? 0),
    period_roi_percentage: Number(r.period_roi_percentage ?? 0),
    total_portfolio_value: Number(r.total_portfolio_value ?? 0),
  };
}

/** Shape returned by get_portfolio_stats (single row). */
export interface PortfolioStats {
  total_invested: number;
  total_transactions: number;
  total_earned: number;
}

/** PostgREST returns one row as an array or a single object depending on RETURNS. */
export function normalizePortfolioStats(data: unknown): PortfolioStats | null {
  if (data == null) return null;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== 'object') return null;

  const r = row as Record<string, unknown>;
  return {
    total_invested: Number(r.total_invested ?? 0),
    total_transactions: Number(r.total_transactions ?? 0),
    total_earned: Number(r.total_earned ?? 0),
  };
}

/** Shape returned by get_portfolio_item_detail (jsonb). */
export interface PortfolioItemDetail {
  item_id: string;
  market_hash_name: string;
  icon_url: string | null;
  current_market_price: number;
  last_price_update: string | null;
  owned_quantity: number;
  avg_buy_price: number;
  total_invested: number;
  current_value: number;
  unrealized_profit: number;
  roi_percentage: number;
  history_sold_quantity: number;
  history_realized_profit: number;
}

export function normalizePortfolioItemDetail(data: unknown): PortfolioItemDetail | null {
  if (data == null) return null;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== 'object') return null;

  const r = row as Record<string, unknown>;
  if (!r.item_id && !r.market_hash_name) return null;

  return {
    item_id: String(r.item_id ?? ''),
    market_hash_name: String(r.market_hash_name ?? 'Unknown item'),
    icon_url: r.icon_url != null ? String(r.icon_url) : null,
    current_market_price: Number(r.current_market_price ?? 0),
    last_price_update: r.last_price_update != null ? String(r.last_price_update) : null,
    owned_quantity: Number(r.owned_quantity ?? 0),
    avg_buy_price: Number(r.avg_buy_price ?? 0),
    total_invested: Number(r.total_invested ?? 0),
    current_value: Number(r.current_value ?? 0),
    unrealized_profit: Number(r.unrealized_profit ?? 0),
    roi_percentage: Number(r.roi_percentage ?? 0),
    history_sold_quantity: Number(r.history_sold_quantity ?? 0),
    history_realized_profit: Number(r.history_realized_profit ?? 0),
  };
}

/** Flat row from get_portfolio_treemap_data() RETURNS TABLE */
export interface TreemapRpcRow {
  category: string | null;
  item_name: string | null;
  total_value: number | string | null;
}

/** ApexCharts-style series (legacy / docs) */
export interface TreemapSeriesPoint {
  x: string;
  y: number;
}

export interface TreemapSeries {
  name: string;
  data: TreemapSeriesPoint[];
}

export interface TreemapChartNode {
  name: string;
  size?: number;
  fill?: string;
  category?: string;
  /** True when several small items were merged for readability */
  isGrouped?: boolean;
  children?: TreemapChartNode[];
}

const TREEMAP_CATEGORY_COLORS: Record<string, string> = {
  case: '#3b82f6',
  cases: '#3b82f6',
  capsule: '#8b5cf6',
  capsules: '#8b5cf6',
  skin: '#10b981',
  skins: '#10b981',
  weapon: '#10b981',
  agent: '#f59e0b',
  agents: '#f59e0b',
  sticker: '#ec4899',
  stickers: '#ec4899',
  graffiti: '#06b6d4',
  inne: '#6b7280',
  other: '#6b7280',
};

const TREEMAP_FALLBACK_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

function treemapCategoryColor(name: string | null | undefined, index: number): string {
  const key = (name ?? 'other').toLowerCase();
  for (const [segment, color] of Object.entries(TREEMAP_CATEGORY_COLORS)) {
    if (key.includes(segment)) return color;
  }
  return TREEMAP_FALLBACK_COLORS[index % TREEMAP_FALLBACK_COLORS.length];
}

function shadeColor(hex: string, step: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - step);
  const g = Math.max(0, ((n >> 8) & 0xff) - step);
  const b = Math.max(0, (n & 0xff) - step);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function parseTreemapValue(value: unknown): number {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? 0));
  return Number.isFinite(n) ? n : 0;
}

function isTreemapRpcRow(row: unknown): row is TreemapRpcRow {
  if (!row || typeof row !== 'object') return false;
  const r = row as Record<string, unknown>;
  if (Array.isArray(r.data)) return false;
  return 'item_name' in r && ('total_value' in r || 'category' in r);
}

function isTreemapSeries(group: unknown): group is TreemapSeries {
  if (!group || typeof group !== 'object') return false;
  const g = group as Record<string, unknown>;
  return Array.isArray(g.data) && ('name' in g || 'category' in g);
}

/** Group flat SQL rows by category → Recharts treemap nodes */
function normalizeTreemapRows(rows: TreemapRpcRow[]): TreemapChartNode[] {
  const byCategory = new Map<string, TreemapChartNode[]>();

  for (const row of rows) {
    const category = String(row.category ?? 'Other').trim() || 'Other';
    const itemName = String(row.item_name ?? 'Unknown').trim() || 'Unknown';
    const size = parseTreemapValue(row.total_value);
    if (size <= 0) continue;

    const list = byCategory.get(category) ?? [];
    list.push({ name: itemName, size, category });
    byCategory.set(category, list);
  }

  return Array.from(byCategory.entries())
    .map(([category, items], groupIndex) => {
      const base = treemapCategoryColor(category, groupIndex);
      const children = items
        .map((item, itemIndex) => ({
          name: item.name,
          size: item.size,
          fill: shadeColor(base, itemIndex * 14),
          category,
        }))
        .sort((a, b) => (b.size ?? 0) - (a.size ?? 0));

      const groupTotal = children.reduce((sum, c) => sum + (c.size ?? 0), 0);
      return { name: category, children, size: groupTotal, fill: base };
    })
    .sort((a, b) => (b.size ?? 0) - (a.size ?? 0));
}

/** RPC get_portfolio_treemap_data — flat rows or legacy series format */
export function normalizePortfolioTreemapData(data: unknown): TreemapChartNode[] {
  if (data == null) return [];

  if (Array.isArray(data)) {
    if (data.length === 0) return [];
    if (isTreemapRpcRow(data[0])) {
      return normalizeTreemapRows(data as TreemapRpcRow[]);
    }
    if (isTreemapSeries(data[0])) {
      return normalizeTreemapSeries(data as TreemapSeries[]);
    }
  }

  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.rows)) return normalizeTreemapRows(obj.rows as TreemapRpcRow[]);
    if (Array.isArray(obj.series)) return normalizeTreemapSeries(obj.series as TreemapSeries[]);
    if (Array.isArray(obj.data)) {
      const arr = obj.data;
      if (arr.length === 0) return [];
      if (isTreemapRpcRow(arr[0])) return normalizeTreemapRows(arr as TreemapRpcRow[]);
      if (isTreemapSeries(arr[0])) return normalizeTreemapSeries(arr as TreemapSeries[]);
    }
  }

  return [];
}

function normalizeTreemapSeries(series: TreemapSeries[]): TreemapChartNode[] {
  return series
    .map((group, groupIndex) => {
      const category = String(group.name ?? 'Other').trim() || 'Other';
      const base = treemapCategoryColor(category, groupIndex);
      const children = (group.data ?? [])
        .map((point, itemIndex) => {
          const size = parseTreemapValue(point.y);
          if (size <= 0) return null;
          const itemName = String(point.x ?? 'Unknown').trim() || 'Unknown';
          return {
            name: itemName,
            size,
            fill: shadeColor(base, itemIndex * 14),
            category,
          } satisfies TreemapChartNode;
        })
        .filter((node): node is TreemapChartNode => node !== null);

      if (children.length === 0) return null;
      const groupTotal = children.reduce((sum, c) => sum + (c.size ?? 0), 0);
      return { name: category, children, size: groupTotal, fill: base } satisfies TreemapChartNode;
    })
    .filter((node): node is TreemapChartNode => node !== null);
}
