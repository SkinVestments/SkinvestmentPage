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

function normalizePlanId(id: string): PlanId | null {
  if (id === 'free' || id === 'pro' || id === 'pro_max') return id;
  return LEGACY_PLAN_IDS[id] ?? null;
}

export function loadSubscription(): SubscriptionState {
  try {
    const raw = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { planId?: string; billingCycle?: BillingCycle };
      const planId = parsed.planId ? normalizePlanId(parsed.planId) : null;
      if (planId && parsed.billingCycle) {
        return { planId, billingCycle: parsed.billingCycle };
      }
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_SUBSCRIPTION;
}

export function saveSubscription(state: SubscriptionState): void {
  localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(SUBSCRIPTION_CHANGED_EVENT));
}
