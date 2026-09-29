export interface AdminPortfolioItem {
  market_hash_name: string;
  icon_url: string | null;
  rarity: string | null;
  type: string | null;
  quantity: number;
  unit_price: number;
  position_value: number;
  acquired_at: string | null;
  collection_id?: string | null;
  collection_name?: string | null;
}

export interface AdminCollectionRow {
  id: string;
  name: string;
  created_at: string | null;
  unique_items: number;
  total_quantity: number;
  total_value: number;
}

export interface AdminHistoryItem {
  id: string;
  type: string;
  quantity: number;
  price: number;
  fee_deducted: number;
  realized_profit: number;
  is_investment: boolean;
  transaction_date: string | null;
  created_at: string | null;
  market_hash_name: string;
  icon_url: string | null;
  rarity: string | null;
  collection_name: string | null;
}

export interface AdminEntitlement {
  status: string;
  converted_to_paid: boolean;
  trial_started_at: string | null;
  trial_ended_at: string | null;
}

export interface AdminPortfolioSummary {
  unique_items: number;
  total_quantity: number;
  portfolio_value: number;
  transaction_count?: number;
  collection_count?: number;
  history_returned?: number;
  history_limit?: number;
}

export interface AdminUserPortfolio {
  found: boolean;
  user_id: string;
  nickname?: string | null;
  registered_at?: string | null;
  last_activity_at?: string | null;
  first_skin_at?: string | null;
  last_skin_at?: string | null;
  plan_subscription?: string;
  revenuecat_app_user_id?: string;
  entitlement?: AdminEntitlement | null;
  summary?: AdminPortfolioSummary;
  items?: AdminPortfolioItem[];
  collections?: AdminCollectionRow[];
  history?: AdminHistoryItem[];
}

export interface AdminTrialGroupStats {
  user_count: number;
  median_unique_items: number | null;
  median_portfolio_value: number | null;
  median_active_days_in_trial: number | null;
  median_trial_days: number | null;
}

export interface AdminTrialActivationStats {
  available: boolean;
  reason?: string;
  hint?: string;
  data_source?: string;
  groups: {
    cancelled_trial: AdminTrialGroupStats | null;
    converted: AdminTrialGroupStats | null;
  };
}
