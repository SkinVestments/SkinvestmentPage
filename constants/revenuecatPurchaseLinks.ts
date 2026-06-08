import type { BillingCycle, PlanId } from '@/constants/subscriptionPlans';

/** RevenueCat Web Billing purchase link slug (without user id). */
export const RC_PURCHASE_BASE = 'https://pay.rev.cat/amtaebmynffvulpg';

/** package_id from RevenueCat → Offerings → Packages */
const PACKAGE_IDS: Record<Exclude<PlanId, 'free'>, Record<BillingCycle, string>> = {
  pro: {
    monthly: 'pro_monthly',
    yearly: 'pro_annual',
    lifetime: 'pro_lifetime',
  },
  pro_max: {
    monthly: 'promax_monthly',
    yearly: 'promax_annual',
    lifetime: 'promax_lifetime',
  },
};

const normalizeBase = (base: string) => (base.endsWith('/') ? base.slice(0, -1) : base);

/** {base}/{userId}/checkout?package_id=... */
export const buildRevenueCatCheckoutUrl = (
  userId: string,
  planId: PlanId,
  billingCycle: BillingCycle,
): string | null => {
  if (planId === 'free' || !userId.trim()) return null;

  const packageId = PACKAGE_IDS[planId]?.[billingCycle];
  if (!packageId) return null;

  const base = normalizeBase(RC_PURCHASE_BASE);
  const params = new URLSearchParams({ package_id: packageId });
  return `${base}/${encodeURIComponent(userId)}/checkout?${params.toString()}`;
};
