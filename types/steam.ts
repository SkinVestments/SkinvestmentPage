import type { PlanId } from '@/constants/subscriptionPlans';
import {
  getCollectionItemLimit as getPlanCollectionItemLimit,
  COLLECTION_ITEM_LIMITS as PLAN_COLLECTION_ITEM_LIMITS,
} from '@/constants/subscriptionPlans';

export type SteamInventoryStatus = 'ACTIVE' | 'PRIVATE' | 'ERROR';

export interface SteamConnection {
  user_id: string;
  steam_id_64: string;
  steam_username: string | null;
  steam_avatar_url: string | null;
  linked_at: string | null;
  inventory_status: SteamInventoryStatus | null;
  last_profile_sync: string | null;
  last_inventory_sync: string | null;
  is_main: boolean;
}

/** Raw Steam inventory item from steam-inventory edge function */
export interface SteamInventoryAsset {
  asset_id: string;
  class_id: string;
  instance_id: string;
  amount: number;
  name: string;
  market_hash_name: string;
  type?: string;
  icon_url: string;
  tradable?: boolean;
  marketable?: boolean;
}

export interface SteamInventoryResponse {
  items: SteamInventoryAsset[];
}

/** Grouped Steam stack matched to cs2_items */
export interface SteamMatchedItem {
  itemId: string;
  marketHashName: string;
  name: string;
  imageUrl: string | null;
  quantity: number;
  currentPrice: number;
  skinportPrice: number | null;
  alreadyInPortfolio: boolean;
}

export interface SteamImportLine {
  itemId: string;
  marketHashName: string;
  name: string;
  imageUrl: string | null;
  quantity: number;
  price: number;
  addToInvestments: boolean;
}

export const STEAM_ACCOUNT_LIMITS: Record<PlanId, number> = {
  free: 1,
  pro: 3,
  pro_max: 15,
};

/** @deprecated Prefer constants/subscriptionPlans — kept for existing imports. */
export const COLLECTION_ITEM_LIMITS = PLAN_COLLECTION_ITEM_LIMITS;

export function getSteamAccountLimit(planId: PlanId): number {
  return STEAM_ACCOUNT_LIMITS[planId] ?? 1;
}

export function getCollectionItemLimit(planId: PlanId): number | null {
  return getPlanCollectionItemLimit(planId);
}
