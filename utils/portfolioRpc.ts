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
