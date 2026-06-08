import { useCallback, useEffect, useState } from 'react';
import type { BillingCycle, PlanId } from '@/constants/subscriptionPlans';
import { getPlanById } from '@/constants/subscriptionPlans';
import {
  DEFAULT_SUBSCRIPTION,
  loadSubscription,
  saveSubscription,
  SUBSCRIPTION_CHANGED_EVENT,
  type SubscriptionState,
} from '@/constants/subscriptionStorage';

export function useSubscriptionPlan() {
  const [subscription, setSubscription] = useState<SubscriptionState>(loadSubscription);

  useEffect(() => {
    const sync = () => setSubscription(loadSubscription());
    window.addEventListener(SUBSCRIPTION_CHANGED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SUBSCRIPTION_CHANGED_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const updateSubscription = useCallback((planId: PlanId, billingCycle: BillingCycle) => {
    const next = { planId, billingCycle };
    saveSubscription(next);
    setSubscription(next);
  }, []);

  const plan = getPlanById(subscription.planId);
  const isFreePlan = subscription.planId === 'free';
  const hasAds = isFreePlan;
  const hasProMax = subscription.planId === 'pro_max';
  const hasPro = subscription.planId === 'pro' || hasProMax;

  return {
    ...subscription,
    plan,
    isFreePlan,
    hasAds,
    hasPremium: !isFreePlan,
    hasPro,
    hasProMax,
    canExportCsv: hasPro,
    canExportFull: hasProMax,
    updateSubscription,
    resetSubscription: () => {
      saveSubscription(DEFAULT_SUBSCRIPTION);
      setSubscription(DEFAULT_SUBSCRIPTION);
    },
  };
}
