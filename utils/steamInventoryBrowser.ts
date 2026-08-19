import type { SteamInventoryAsset } from '@/types/steam';

type LegacyInv = Record<string, { id: string; classid: string; instanceid: string; amount: string }>;
type LegacyDesc = Record<
  string,
  {
    classid?: string;
    instanceid?: string;
    name?: string;
    market_name?: string;
    market_hash_name?: string;
    type?: string;
    icon_url?: string;
    tradable?: number | boolean;
    marketable?: number | boolean;
  }
>;

function mapAssetsFromModern(data: {
  assets?: Array<{
    assetid: string;
    classid: string;
    instanceid: string;
    amount: string;
  }>;
  descriptions?: Array<{
    classid: string;
    instanceid: string;
    name?: string;
    market_name?: string;
    market_hash_name?: string;
    type?: string;
    icon_url?: string;
    tradable?: number | boolean;
    marketable?: number | boolean;
  }>;
}): SteamInventoryAsset[] {
  const assets = data.assets ?? [];
  const descriptions = data.descriptions ?? [];
  const items: SteamInventoryAsset[] = [];

  for (const asset of assets) {
    const desc = descriptions.find(
      (d) =>
        String(d.classid) === String(asset.classid) &&
        String(d.instanceid) === String(asset.instanceid),
    );
    if (!desc) continue;
    items.push({
      asset_id: String(asset.assetid),
      class_id: String(asset.classid),
      instance_id: String(asset.instanceid),
      amount: parseInt(String(asset.amount), 10) || 1,
      name: desc.market_name || desc.name || 'Unknown',
      market_hash_name: desc.market_hash_name || desc.name || '',
      type: desc.type || 'Unknown',
      icon_url: desc.icon_url
        ? `https://community.cloudflare.steamstatic.com/economy/image/${desc.icon_url}`
        : '',
      tradable: Boolean(Number(desc.tradable)),
      marketable: Boolean(Number(desc.marketable)),
    });
  }
  return items;
}

function mapAssetsFromLegacy(data: {
  rgInventory?: LegacyInv;
  rgDescriptions?: LegacyDesc;
}): SteamInventoryAsset[] {
  const inv = data.rgInventory ?? {};
  const descs = data.rgDescriptions ?? {};
  const items: SteamInventoryAsset[] = [];

  for (const asset of Object.values(inv)) {
    const key = `${asset.classid}_${asset.instanceid}`;
    const desc = descs[key];
    if (!desc) continue;
    items.push({
      asset_id: String(asset.id),
      class_id: String(asset.classid),
      instance_id: String(asset.instanceid),
      amount: parseInt(String(asset.amount), 10) || 1,
      name: desc.market_name || desc.name || 'Unknown',
      market_hash_name: desc.market_hash_name || desc.name || '',
      type: desc.type || 'Unknown',
      icon_url: desc.icon_url
        ? `https://community.cloudflare.steamstatic.com/economy/image/${desc.icon_url}`
        : '',
      tradable: Boolean(Number(desc.tradable)),
      marketable: Boolean(Number(desc.marketable)),
    });
  }
  return items;
}

/** Dev-only: Vite proxies this to steamcommunity.com from your machine IP (Edge gets 401). */
async function fetchViaViteProxy(steamId64: string): Promise<SteamInventoryAsset[]> {
  const url =
    `/steam-community/inventory/${steamId64}/730/2?l=english&count=5000`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Steam proxy HTTP ${res.status}`);
  const data = await res.json();
  if (data.success === false || data.success === 0) {
    throw new Error('Steam inventory not accessible (private?)');
  }
  return mapAssetsFromModern(data);
}

/**
 * Browser JSONP against legacy endpoint — uses the user's IP, avoids Edge 401.
 * Steam may disable this; fail soft.
 */
function fetchViaJsonp(steamId64: string): Promise<SteamInventoryAsset[]> {
  return new Promise((resolve, reject) => {
    const cbName = `__steamInvCb_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Steam JSONP timeout'));
    }, 15000);

    const cleanup = () => {
      window.clearTimeout(timeout);
      delete (window as unknown as Record<string, unknown>)[cbName];
      script.remove();
    };

    (window as unknown as Record<string, unknown>)[cbName] = (data: unknown) => {
      cleanup();
      try {
        const parsed = data as {
          success?: boolean | number;
          rgInventory?: LegacyInv;
          rgDescriptions?: LegacyDesc;
        };
        if (parsed.success === false || parsed.success === 0) {
          reject(new Error('Steam inventory not accessible (private?)'));
          return;
        }
        resolve(mapAssetsFromLegacy(parsed));
      } catch (err) {
        reject(err);
      }
    };

    const script = document.createElement('script');
    script.src =
      `https://steamcommunity.com/profiles/${steamId64}/inventory/json/730/2?l=english&callback=${cbName}`;
    script.onerror = () => {
      cleanup();
      reject(new Error('Steam JSONP blocked'));
    };
    document.body.appendChild(script);
  });
}

/**
 * Prefer browser/user-IP fetch when Edge returns empty (Steam 401 on datacenter IPs).
 */
export async function fetchSteamInventoryFromBrowser(
  steamId64: string,
): Promise<SteamInventoryAsset[]> {
  const id = String(steamId64).replace(/[^\d]/g, '');
  if (!id) throw new Error('Invalid Steam ID');

  // 1) Local Vite proxy (dev) — most reliable while developing
  if (import.meta.env.DEV) {
    try {
      const items = await fetchViaViteProxy(id);
      if (items.length > 0) return items;
    } catch (err) {
      console.warn('[steam] vite proxy inventory failed', err);
    }
  }

  // 2) JSONP legacy endpoint (production-capable if Steam still allows it)
  try {
    const items = await fetchViaJsonp(id);
    if (items.length > 0) return items;
  } catch (err) {
    console.warn('[steam] JSONP inventory failed', err);
  }

  return [];
}
