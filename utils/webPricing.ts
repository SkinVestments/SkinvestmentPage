import webMonthlyPrices from '@/data/web-monthly-prices.json';
import type { PlanId } from '@/constants/subscriptionPlans';

export type WebMonthlyPriceRow = {
  currency: string;
  pro: string;
  pro_max: string;
  bucket_id: string;
  pro_trial_days: number;
  pro_max_trial_days: number;
  proposed_offering_id: string;
  proposed_product_ids: { pro: string; pro_max: string };
};

type WebMonthlyCatalog = {
  schema_version: string;
  source: string;
  snapshot_date: string;
  status: string;
  owner_approved: boolean;
  pricing_policy: string;
  billing_period: string;
  country_count: number;
  countries: Record<string, WebMonthlyPriceRow>;
};

const catalog = webMonthlyPrices as WebMonthlyCatalog;

/** Fallback when country has no dump row (PL matches mobile target). */
export const DEFAULT_WEB_MONTHLY = {
  country: 'PL',
  currency: 'PLN',
  pro: '19.99',
  pro_max: '24.99',
} as const;

export function isWebPricingApproved(): boolean {
  return Boolean(catalog.owner_approved);
}

export function getWebPricingMeta() {
  return {
    status: catalog.status,
    owner_approved: catalog.owner_approved,
    snapshot_date: catalog.snapshot_date,
    country_count: catalog.country_count,
    pricing_policy: catalog.pricing_policy,
  };
}

/** Resolve ISO country code (e.g. PL) to monthly Pro / Pro Max amounts. */
export function getWebMonthlyForCountry(
  countryCode: string | null | undefined,
): {
  country: string;
  currency: string;
  pro: string;
  pro_max: string;
  fromCatalog: boolean;
  row: WebMonthlyPriceRow | null;
} {
  const code = String(countryCode ?? '')
    .trim()
    .toUpperCase();
  const row = code ? catalog.countries[code] ?? null : null;
  if (!row) {
    return {
      country: DEFAULT_WEB_MONTHLY.country,
      currency: DEFAULT_WEB_MONTHLY.currency,
      pro: DEFAULT_WEB_MONTHLY.pro,
      pro_max: DEFAULT_WEB_MONTHLY.pro_max,
      fromCatalog: false,
      row: null,
    };
  }
  return {
    country: code,
    currency: row.currency,
    pro: row.pro,
    pro_max: row.pro_max,
    fromCatalog: true,
    row,
  };
}

function regionFromLocaleTag(tag: string): string | null {
  const parts = String(tag ?? '')
    .trim()
    .replace('_', '-')
    .split('-')
    .filter(Boolean);
  if (parts.length < 2) return null;
  const region = parts[parts.length - 1];
  if (/^[A-Za-z]{2}$/.test(region)) return region.toUpperCase();
  return null;
}

/**
 * Best-effort display country. Prefer explicit region (pl-PL, en-GB), then
 * timezone (Europe/Warsaw → PL). Bare `en` must NOT become US — many PL users
 * run an English browser UI and would otherwise see USD while yearly stays PLN.
 * Not proof of billing country — checkout still uses the payment provider.
 */
export function guessCountryFromLocale(
  locale: string | null | undefined = typeof navigator !== 'undefined'
    ? navigator.language
    : 'pl-PL',
): string | null {
  if (typeof navigator !== 'undefined' && Array.isArray(navigator.languages)) {
    for (const tag of navigator.languages) {
      const region = regionFromLocaleTag(tag);
      if (region) return region;
    }
  }

  const fromArg = regionFromLocaleTag(String(locale ?? ''));
  if (fromArg) return fromArg;

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Europe/Warsaw') return 'PL';
  } catch {
    /* ignore */
  }

  const lang = String(locale ?? '')
    .trim()
    .replace('_', '-')
    .split('-')[0]
    ?.toLowerCase();
  if (lang === 'pl') return 'PL';
  if (lang === 'de') return 'DE';
  // No language-only en → US mapping (causes PLN/USD flip in the plan modal).
  return null;
}

/** Country used for on-page monthly price display (defaults to PL). */
export function resolveDisplayCountry(explicit?: string | null): string {
  const code = String(explicit ?? '').trim().toUpperCase();
  if (code && catalog.countries[code]) return code;
  return guessCountryFromLocale() ?? DEFAULT_WEB_MONTHLY.country;
}

export function amountForPlan(
  planId: PlanId,
  monthly: { pro: string; pro_max: string },
): string | null {
  if (planId === 'free') return '0';
  if (planId === 'pro') return monthly.pro;
  if (planId === 'pro_max') return monthly.pro_max;
  return null;
}

/**
 * Format catalog amount for UI. Always `CURRENCY 12.34` (code first) so monthly
 * matches yearly/lifetime (`PLN 18,33`) — Intl pl-PL would put PLN after the number.
 */
export function formatWebMoney(amount: string, currency: string, locale?: string): string {
  const n = Number(amount);
  const code = String(currency || '').trim().toUpperCase() || 'PLN';
  if (!Number.isFinite(n)) return `${code} ${amount}`;
  const loc = locale ?? (code === 'PLN' ? 'pl-PL' : 'en');
  const fraction = code === 'HUF' || code === 'PYG' ? 0 : 2;
  try {
    const num = new Intl.NumberFormat(loc, {
      minimumFractionDigits: fraction,
      maximumFractionDigits: fraction,
    }).format(n);
    return `${code} ${num}`;
  } catch {
    return `${code} ${n.toFixed(fraction)}`;
  }
}
