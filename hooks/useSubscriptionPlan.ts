import { useCallback, useEffect, useState } from 'react';
import type { BillingCycle, PlanId } from '@/constants/subscriptionPlans';
import { getPlanById } from '@/constants/subscriptionPlans';
import {
  loadBillingCycle,
  normalizePlanId,
  saveBillingCycle,
  SUBSCRIPTION_CHANGED_EVENT,
} from '@/constants/subscriptionStorage';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabaseClient';

async function fetchPlanSubscription(userId: string): Promise<PlanId> {
  const { data, error } = await supabase
    .from('profiles')
    .select('plan_subscription')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return normalizePlanId(data?.plan_subscription as string | null | undefined);
}

export function useSubscriptionPlan() {
  const { user } = useAuth();
  const [planId, setPlanId] = useState<PlanId>('free');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(loadBillingCycle);
  const [loading, setLoading] = useState(true);

  const reloadPlan = useCallback(async () => {
    if (!user?.id) {
      setPlanId('free');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const nextPlanId = await fetchPlanSubscription(user.id);
      setPlanId(nextPlanId);
    } catch {
      setPlanId('free');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void reloadPlan();
  }, [reloadPlan]);

  useEffect(() => {
    const syncBillingCycle = () => setBillingCycle(loadBillingCycle());
    const handleRefresh = () => {
      syncBillingCycle();
      void reloadPlan();
    };

    window.addEventListener(SUBSCRIPTION_CHANGED_EVENT, handleRefresh);
    window.addEventListener('storage', handleRefresh);
    window.addEventListener('focus', handleRefresh);

    return () => {
      window.removeEventListener(SUBSCRIPTION_CHANGED_EVENT, handleRefresh);
      window.removeEventListener('storage', handleRefresh);
      window.removeEventListener('focus', handleRefresh);
    };
  }, [reloadPlan]);

  const setBillingCyclePreference = useCallback((cycle: BillingCycle) => {
    saveBillingCycle(cycle);
    setBillingCycle(cycle);
  }, []);

  const plan = getPlanById(planId);
  const isFreePlan = planId === 'free';
  const hasProMax = planId === 'pro_max';
  const hasPro = planId === 'pro' || hasProMax;

  return {
    planId,
    billingCycle,
    plan,
    loading,
    isFreePlan,
    hasAds: !loading && isFreePlan,
    hasPremium: !loading && !isFreePlan,
    hasPro: !loading && hasPro,
    hasProMax: !loading && hasProMax,
    canExportCsv: !loading && hasPro,
    canExportFull: !loading && hasProMax,
    reloadPlan,
    setBillingCyclePreference,
    /** @deprecated Plan is stored in Supabase — only billing cycle preference is saved locally. */
    updateSubscription: (_planId: PlanId, cycle: BillingCycle) => {
      setBillingCyclePreference(cycle);
    },
  };
}
