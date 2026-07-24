export type PortfolioShareVisibility = {
  show_summary: boolean;
  show_chart: boolean;
  show_categories: boolean;
  show_items: boolean;
  show_history: boolean;
  show_collections: boolean;
};

export type PortfolioShareRow = {
  id: string;
  user_id: string;
  token: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  revoked_at: string | null;
  show_summary?: boolean;
  show_chart?: boolean;
  show_categories?: boolean;
  show_items?: boolean;
  show_history?: boolean;
  show_collections?: boolean;
};

export type PublicPortfolioItem = {
  market_hash_name: string;
  icon_url: string | null;
  rarity: string | null;
  type?: string | null;
  quantity: number;
  unit_price: number;
  position_value: number;
};

export type PublicPortfolioSummary = {
  total_portfolio_value: number;
  inventory_value: number;
  item_count: number;
};

export type PublicPortfolioCategory = {
  name: string;
  value: number;
  percentage: number;
};

export type PublicPortfolioChartPoint = {
  chart_date: string;
  portfolio_value?: number;
  invested_value?: number;
  [key: string]: unknown;
};

export type PublicPortfolioHistoryItem = {
  id: string;
  type: string;
  quantity: number;
  price: number;
  transaction_date: string;
  market_hash_name: string;
  icon_url: string | null;
  rarity: string | null;
};

export type PublicPortfolioHistoryPage = {
  items: PublicPortfolioHistoryItem[];
  total_count: number;
  page: number;
  page_size: number;
};

export type PublicPortfolioCollection = {
  id: string;
  name: string;
  total_items_quantity?: number;
  total_value?: number;
  [key: string]: unknown;
};

export type PublicPortfolioPayload = {
  display_name: string;
  avatar: string | null;
  summary: PublicPortfolioSummary;
  items: PublicPortfolioItem[];
  categories?: PublicPortfolioCategory[];
  chart?: PublicPortfolioChartPoint[];
  history?: PublicPortfolioHistoryItem[];
  collections?: PublicPortfolioCollection[];
  visibility?: PortfolioShareVisibility;
};

export const DEFAULT_SHARE_VISIBILITY: PortfolioShareVisibility = {
  show_summary: true,
  show_chart: true,
  show_categories: true,
  show_items: true,
  show_history: true,
  show_collections: false,
};

export function visibilityFromShareRow(
  row: PortfolioShareRow | null | undefined,
): PortfolioShareVisibility {
  return {
    show_summary: row?.show_summary ?? DEFAULT_SHARE_VISIBILITY.show_summary,
    show_chart: row?.show_chart ?? DEFAULT_SHARE_VISIBILITY.show_chart,
    show_categories: row?.show_categories ?? DEFAULT_SHARE_VISIBILITY.show_categories,
    show_items: row?.show_items ?? DEFAULT_SHARE_VISIBILITY.show_items,
    show_history: row?.show_history ?? DEFAULT_SHARE_VISIBILITY.show_history,
    show_collections: row?.show_collections ?? DEFAULT_SHARE_VISIBILITY.show_collections,
  };
}
