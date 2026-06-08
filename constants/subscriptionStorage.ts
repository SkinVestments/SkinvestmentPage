import type { BillingCycle, PlanId } from '@/constants/subscriptionPlans';

export const SUBSCRIPTION_STORAGE_KEY = 'skinvestments_subscription';

export const SUBSCRIPTION_CHANGED_EVENT = 'skinvestments:subscription-changed';

export interface SubscriptionState {
  planId: PlanId;
  billingCycle: BillingCycle;
}

export const DEFAULT_SUBSCRIPTION: SubscriptionState = {
  planId: 'free',
  billingCycle: 'yearly',
};

/** Legacy plan ids before rename to free / pro_max */
const LEGACY_PLAN_IDS: Record<string, PlanId> = {
  basic: 'free',
  'pro-max': 'pro_max',
};

export function normalizePlanId(id: string | null | undefined): PlanId {
  if (!id) return 'free';
  if (id === 'free' || id === 'pro' || id === 'pro_max') return id;
  return LEGACY_PLAN_IDS[id] ?? 'free';
}

const BILLING_CYCLE_STORAGE_KEY = 'skinvestments_billing_cycle';

export function loadBillingCycle(): BillingCycle {
  try {
    const raw = localStorage.getItem(BILLING_CYCLE_STORAGE_KEY);
    if (raw === 'monthly' || raw === 'yearly' || raw === 'lifetime') return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_SUBSCRIPTION.billingCycle;
}

export function saveBillingCycle(cycle: BillingCycle): void {
  localStorage.setItem(BILLING_CYCLE_STORAGE_KEY, cycle);
  window.dispatchEvent(new CustomEvent(SUBSCRIPTION_CHANGED_EVENT));
}

/** @deprecated Plan id comes from profiles.plan_subscription — use loadBillingCycle for UI cycle only. */
export function loadSubscription(): SubscriptionState {
  return { planId: 'free', billingCycle: loadBillingCycle() };
}
