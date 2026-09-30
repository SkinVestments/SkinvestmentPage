import { buildCsMoneyItemUrl, CSMONEY_LINK_REL } from '@/constants/csmoney';

export type MarketSourceConfig = {
  label: string;
  /** Per-item URL builder; omit for unknown sources (no link). */
  url?: (marketHashName: string) => string;
  /** Anchor rel; default noopener noreferrer when url is set. */
  rel?: string;
  iconSrc?: string;
};

/**
 * Known third-party market sources. New RPC sources appear with raw name + no link
 * until added here.
 */
export const MARKET_SOURCE_CONFIG: Record<string, MarketSourceConfig> = {
  csmoney: {
    label: 'CS.MONEY',
    url: buildCsMoneyItemUrl,
    rel: CSMONEY_LINK_REL,
    iconSrc: '/images/markets/cs.money-256x256.png',
  },
  csfloat: {
    label: 'CSFloat',
    url: (name) =>
      `https://csfloat.com/search?market_hash_name=${encodeURIComponent(name)}`,
    rel: 'noopener noreferrer',
    iconSrc: '/images/markets/csfloat.com-512x512.png',
  },
  skinport: {
    label: 'Skinport',
    url: (name) => `https://skinport.com/market?search=${encodeURIComponent(name)}`,
    rel: 'noopener noreferrer',
    iconSrc: '/images/markets/skinport.com-256x256.png',
  },
};

export const STEAM_MARKET_ICON = '/images/markets/store.steampowered.com-256x256.png';

export function normalizeMarketSourceKey(source: string): string {
  return source.trim().toLowerCase().replace(/[\s._-]+/g, '');
}

export function getMarketSourceConfig(source: string): MarketSourceConfig {
  const key = normalizeMarketSourceKey(source);
  // Map common aliases to config keys
  const aliases: Record<string, string> = {
    csmoney: 'csmoney',
    csmoneycom: 'csmoney',
    csfloat: 'csfloat',
    csfloatcom: 'csfloat',
    skinport: 'skinport',
    skinportcom: 'skinport',
  };
  const mapped = aliases[key] ?? key;
  const known = MARKET_SOURCE_CONFIG[mapped];
  if (known) return known;
  return { label: source.trim() || 'Market' };
}

export function getMarketLabel(source: string): string {
  return getMarketSourceConfig(source).label;
}

function isNonTradedCategory(categoryOrType: string | null | undefined): boolean {
  if (!categoryOrType) return false;
  const t = categoryOrType.trim().toLowerCase();
  return t === 'graffiti' || t.includes('graffiti');
}

function isNonTradedName(marketHashName: string | null | undefined): boolean {
  if (!marketHashName) return false;
  return marketHashName.trim().toLowerCase().startsWith('sticker slab');
}

/** Missing-price copy: avoid sounding like a sync error for non-traded categories. */
export function missingMarketPriceMessage(
  source: string,
  categoryOrType?: string | null,
  marketHashName?: string | null,
): string {
  const label = getMarketLabel(source);
  if (isNonTradedCategory(categoryOrType) || isNonTradedName(marketHashName)) {
    return `Not traded on ${label}`;
  }
  return `No listings on ${label}`;
}
