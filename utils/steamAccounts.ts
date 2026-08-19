import type { PlanId } from '@/constants/subscriptionPlans';
import { supabase } from '@/utils/supabaseClient';
import {
  getSteamAccountLimit,
  type SteamConnection,
  type SteamInventoryAsset,
  type SteamInventoryStatus,
} from '@/types/steam';

const orderKey = (userId: string) => `steam_accounts_order_${userId}`;

export function loadSteamAccountsOrder(userId: string): string[] {
  try {
    const raw = localStorage.getItem(orderKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function saveSteamAccountsOrder(userId: string, steamIds: string[]): void {
  localStorage.setItem(orderKey(userId), JSON.stringify(steamIds));
}

export function sortSteamConnections(
  connections: SteamConnection[],
  userId: string,
): SteamConnection[] {
  const order = loadSteamAccountsOrder(userId);
  const orderIndex = new Map(order.map((id, i) => [id, i]));

  return [...connections].sort((a, b) => {
    if (a.is_main !== b.is_main) return a.is_main ? -1 : 1;
    const ai = orderIndex.has(a.steam_id_64) ? orderIndex.get(a.steam_id_64)! : Number.MAX_SAFE_INTEGER;
    const bi = orderIndex.has(b.steam_id_64) ? orderIndex.get(b.steam_id_64)! : Number.MAX_SAFE_INTEGER;
    if (ai !== bi) return ai - bi;
    return (a.linked_at ?? '').localeCompare(b.linked_at ?? '');
  });
}

const toSteamIdString = (v: unknown): string => {
  // Postgres bigint can arrive as string or number. Never use Number() for SteamIDs.
  if (typeof v === 'bigint') return v.toString();
  if (typeof v === 'string') return v.replace(/[^\d]/g, '');
  if (typeof v === 'number') {
    // Already may be precision-corrupted; still emit digits for debugging
    return Math.trunc(v).toString();
  }
  return String(v ?? '').replace(/[^\d]/g, '');
};

export function normalizeSteamConnection(row: Record<string, unknown>): SteamConnection {
  const status = String(row.inventory_status ?? 'ACTIVE').toUpperCase();
  const inventory_status: SteamInventoryStatus =
    status === 'PRIVATE' || status === 'ERROR' ? status : 'ACTIVE';

  return {
    user_id: String(row.user_id ?? ''),
    steam_id_64: toSteamIdString(row.steam_id_64),
    steam_username: row.steam_username == null ? null : String(row.steam_username),
    steam_avatar_url: row.steam_avatar_url == null ? null : String(row.steam_avatar_url),
    linked_at: row.linked_at == null ? null : String(row.linked_at),
    inventory_status,
    last_profile_sync: row.last_profile_sync == null ? null : String(row.last_profile_sync),
    last_inventory_sync: row.last_inventory_sync == null ? null : String(row.last_inventory_sync),
    is_main: Boolean(row.is_main),
  };
}

export async function fetchSteamConnections(userId: string): Promise<SteamConnection[]> {
  // Prefer RPC so steam_id_64 arrives as text (bigint JSON numbers lose precision in JS).
  const { data: rpcData, error: rpcError } = await supabase.rpc('get_my_steam_connections');

  if (!rpcError && Array.isArray(rpcData)) {
    const rows = rpcData.map((r) => normalizeSteamConnection(r as Record<string, unknown>));
    return sortSteamConnections(rows, userId);
  }

  const { data, error } = await supabase
    .from('steam_connections')
    .select(
      'user_id, steam_id_64, steam_username, steam_avatar_url, linked_at, inventory_status, last_profile_sync, last_inventory_sync, is_main',
    )
    .eq('user_id', userId);

  if (error) throw error;

  const rows = (data ?? []).map((r) => normalizeSteamConnection(r as Record<string, unknown>));
  return sortSteamConnections(rows, userId);
}

/** Web callback path after Steam OpenID (edge function must honor platform=web & redirect_to). */
export function getSteamWebRedirectTo(): string {
  return `${window.location.origin}/settings?tab=account`;
}

/**
 * Starts Steam OpenID link flow via edge function (full-page redirect).
 * Backend should validate JWT when available; until then this matches the mobile query contract
 * plus platform=web & redirect_to for browser return.
 * Do NOT put access tokens in the query string.
 */
export function startSteamAccountLink(params: { userId: string }): void {
  const base = import.meta.env.VITE_SUPABASE_URL;
  if (!base) throw new Error('Missing VITE_SUPABASE_URL');

  const redirectTo = getSteamWebRedirectTo();
  const url = new URL(`${base}/functions/v1/steam-auth/link`);
  url.searchParams.set('user_id', params.userId);
  url.searchParams.set('platform', 'web');
  url.searchParams.set('redirect_to', redirectTo);

  window.location.assign(url.toString());
}

export interface SteamInventoryFetchResult {
  items: SteamInventoryAsset[];
  error?: string | null;
  hint?: string | null;
  steam_status?: number | null;
}

export async function fetchSteamInventory(
  steamId64: string,
  accessToken: string,
): Promise<SteamInventoryFetchResult> {
  const base = import.meta.env.VITE_SUPABASE_URL;
  if (!base) throw new Error('Missing VITE_SUPABASE_URL');

  const res = await fetch(`${base}/functions/v1/steam-inventory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ steam_id_64: String(steamId64) }),
  });

  const json = (await res.json().catch(() => ({}))) as SteamInventoryFetchResult & {
    error?: string;
  };

  if (!res.ok) {
    const msg =
      json.detail ||
      json.hint ||
      json.error ||
      `Inventory sync failed (${res.status})`;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }

  let items = Array.isArray(json.items) ? json.items : [];
  let error = json.error ?? null;
  let hint = json.hint ?? null;
  let steam_status = json.steam_status ?? null;

  // Handoff §11: do not call Steam from the browser — Edge only (same as mobile).

  if (items.length === 0 && !hint) {
    if (steam_status === 400 || steam_status === 401 || steam_status === 429) {
      hint = `Steam blocked Edge (HTTP ${steam_status}). Redeploy steam-inventory (session cookie warmup) and retry; if still failing, Steam is blocking the Edge IP.`;
    } else if (!error) {
      hint =
        'Inventory empty or Steam blocked the Edge server. Redeploy steam-inventory and retry.';
    }
  }

  return { items, error, hint, steam_status };
}

export async function fetchAllSteamInventories(
  steamIds: string[],
  accessToken: string,
): Promise<SteamInventoryFetchResult> {
  const batches = await Promise.all(
    steamIds.map((id) => fetchSteamInventory(id, accessToken)),
  );

  const byHash = new Map<string, SteamInventoryAsset>();
  const hints: string[] = [];
  for (const batch of batches) {
    if (batch.hint) hints.push(batch.hint);
    if (batch.error && (!batch.items || batch.items.length === 0)) {
      hints.push(batch.error);
    }
    for (const item of batch.items) {
      const key = item.market_hash_name;
      if (!key) continue;
      const existing = byHash.get(key);
      if (!existing) {
        byHash.set(key, { ...item, amount: Number(item.amount) || 1 });
      } else {
        existing.amount = (Number(existing.amount) || 0) + (Number(item.amount) || 1);
      }
    }
  }

  const items = [...byHash.values()];
  return {
    items,
    error: items.length === 0 ? batches.find((b) => b.error)?.error ?? null : null,
    hint: items.length === 0 ? hints[0] ?? null : null,
    steam_status: batches.find((b) => b.steam_status != null)?.steam_status ?? null,
  };
}

export async function setMainSteamAccount(steamId64: string): Promise<void> {
  const id = toSteamIdString(steamId64);
  // Postgres bigint: always send digit string (never JS number — precision loss).
  const { error } = await supabase.rpc('set_main_steam_account', {
    p_steam_id_64: id,
  });
  if (error) throw error;
}

export async function unlinkSteamAccount(steamId64: string): Promise<void> {
  const id = toSteamIdString(steamId64);
  if (!/^\d{15,20}$/.test(id)) {
    throw new Error('Invalid Steam ID');
  }

  const { error: rpcError } = await supabase.rpc('unlink_steam_account', {
    p_steam_id_64: id,
  });

  if (!rpcError) return;

  const msg = (rpcError.message || '').toLowerCase();
  if (
    msg.includes('cannot unlink') ||
    msg.includes('not authenticated') ||
    msg.includes('invalid steam')
  ) {
    throw rpcError;
  }

  // Direct DELETE fallback (exact id, then sole account for this user).
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw rpcError;

  let { data, error: delError } = await supabase
    .from('steam_connections')
    .delete()
    .eq('user_id', user.id)
    .eq('steam_id_64', id)
    .select('user_id');

  if (delError) throw delError;

  if (!data?.length) {
    const { data: existing, error: listError } = await supabase
      .from('steam_connections')
      .select('steam_id_64')
      .eq('user_id', user.id);

    if (listError) throw listError;

    if ((existing?.length ?? 0) === 1) {
      // Don't filter by steam_id — client id may be JS-rounded vs DB bigint.
      ({ data, error: delError } = await supabase
        .from('steam_connections')
        .delete()
        .eq('user_id', user.id)
        .select('user_id'));
      if (delError) throw delError;
    }
  }

  if (!data?.length) {
    throw new Error(
      msg.includes('could not choose the best candidate')
        ? 'Run the updated 20260806_unlink_steam_account_text.sql in Supabase, then retry.'
        : rpcError.message || 'Steam account not found',
    );
  }
}

export function canLinkMoreSteamAccounts(planId: PlanId, currentCount: number): boolean {
  return currentCount < getSteamAccountLimit(planId);
}

export function trackSteamEvent(name: 'steam_account_linked' | 'steam_sync', props?: Record<string, unknown>) {
  try {
    window.gtag?.('event', name, props ?? {});
  } catch {
    /* ignore */
  }
}
