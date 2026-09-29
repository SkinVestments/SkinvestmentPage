/** Row from public.get_market_prices_for_items(uuid[]) */

export interface MarketPriceRow {
  item_id: string;
  steam_price: number | null;
  csmoney_price: number | null;
  csmoney_listings: number | null;
  csmoney_updated_at: string | null;
  csmoney_prev_price: number | null;
  csmoney_change_pct: number | null;
  spread_pct: number | null;
}

export type MarketPriceMap = Map<string, MarketPriceRow>;
