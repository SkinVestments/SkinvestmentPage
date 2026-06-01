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
