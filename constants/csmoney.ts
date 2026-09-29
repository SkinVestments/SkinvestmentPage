/** CS.MONEY market links (affiliate). Keep UTM params exactly as specified. */

const CSMONEY_BASE = 'https://cs.money/market/buy/';

const UTM = {
  utm_source: 'mediabuy',
  utm_medium: 'skinvestments',
  utm_campaign: 'market',
  utm_content: 'link',
} as const;

/** Generic market link (summary / fallback): UTM + order=desc&sort=discount */
export const CSMONEY_MARKET_URL: string = (() => {
  const url = new URL(CSMONEY_BASE);
  const params = new URLSearchParams({
    ...UTM,
    order: 'desc',
    sort: 'discount',
  });
  url.search = params.toString();
  return url.toString();
})();

/** Per-item search link: UTM + search=<market_hash_name> (no order/sort). */
export function buildCsMoneyItemUrl(marketHashName: string): string {
  const url = new URL(CSMONEY_BASE);
  const params = new URLSearchParams({
    ...UTM,
    search: marketHashName,
  });
  url.search = params.toString();
  return url.toString();
}

export const CSMONEY_LINK_REL = 'sponsored noopener noreferrer';
