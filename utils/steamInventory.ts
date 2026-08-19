import { supabase } from '@/utils/supabaseClient';
import type { SteamInventoryAsset, SteamMatchedItem } from '@/types/steam';

interface Cs2ItemRow {
  id: string;
  market_hash_name: string;
  type: string | null;
  rarity: string | null;
  icon_url: string | null;
  price: number | null;
  skinport_price: number | null;
}

/** Group Steam assets by market_hash_name and sum amounts. */
export function groupSteamAssetsByHash(
  assets: SteamInventoryAsset[],
): Map<string, { amount: number; sample: SteamInventoryAsset }> {
  const map = new Map<string, { amount: number; sample: SteamInventoryAsset }>();
  for (const asset of assets) {
    const hash = asset.market_hash_name?.trim();
    if (!hash) continue;
    const amount = Number(asset.amount) || 1;
    const existing = map.get(hash);
    if (!existing) {
      map.set(hash, { amount, sample: asset });
    } else {
      existing.amount += amount;
    }
  }
  return map;
}

/**
 * Match Steam stacks to cs2_items. Unknown hashes are dropped (same as mobile).
 * Batches IN queries to avoid oversized payloads.
 */
export async function matchSteamInventoryToCatalog(
  assets: SteamInventoryAsset[],
  ownedItemIds: Set<string>,
): Promise<{ matched: SteamMatchedItem[]; skippedUnknown: number }> {
  const grouped = groupSteamAssetsByHash(assets);
  const hashNames = [...grouped.keys()];
  if (hashNames.length === 0) {
    return { matched: [], skippedUnknown: 0 };
  }

  const catalog = new Map<string, Cs2ItemRow>();
  const CHUNK = 150;

  for (let i = 0; i < hashNames.length; i += CHUNK) {
    const slice = hashNames.slice(i, i + CHUNK);
    const { data, error } = await supabase
      .from('cs2_items')
      .select('id, market_hash_name, type, rarity, icon_url, price, skinport_price')
      .in('market_hash_name', slice);

    if (error) throw error;
    for (const row of data ?? []) {
      const r = row as Cs2ItemRow;
      catalog.set(r.market_hash_name, r);
    }
  }

  const matched: SteamMatchedItem[] = [];
  let skippedUnknown = 0;

  for (const [hash, { amount, sample }] of grouped) {
    const row = catalog.get(hash);
    if (!row) {
      skippedUnknown += 1;
      continue;
    }
    matched.push({
      itemId: row.id,
      marketHashName: hash,
      name: row.market_hash_name || hash,
      imageUrl: row.icon_url || sample.icon_url || null,
      quantity: amount,
      currentPrice: Number(row.price) || 0,
      skinportPrice: row.skinport_price == null ? null : Number(row.skinport_price),
      alreadyInPortfolio: ownedItemIds.has(row.id),
    });
  }

  matched.sort((a, b) => a.marketHashName.localeCompare(b.marketHashName));
  return { matched, skippedUnknown };
}

export async function fetchOwnedPortfolioItemIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('item_id')
    .eq('user_id', userId)
    .gt('quantity', 0);

  if (error) throw error;
  return new Set((data ?? []).map((r: { item_id: string }) => r.item_id));
}

export async function countCollectionItems(
  userId: string,
  collectionId: string | null,
): Promise<number> {
  let query = supabase
    .from('portfolio_items')
    .select('quantity')
    .eq('user_id', userId)
    .gt('quantity', 0);

  if (collectionId) {
    query = query.eq('collection_id', collectionId);
  } else {
    query = query.is('collection_id', null);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).reduce((sum, row) => sum + (Number(row.quantity) || 0), 0);
}
