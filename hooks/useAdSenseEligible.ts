import { useLocation } from 'react-router-dom';
import { isAdSenseConfigured } from '@/constants/adSlots';
import { isAdSenseEligiblePath } from '@/constants/adsensePolicy';
import { useSubscriptionPlan } from '@/hooks/useSubscriptionPlan';

/** True when ads may load: free plan, configured client, allowed route. */
export function useAdSenseEligible(): boolean {
  const { pathname } = useLocation();
  const { hasAds } = useSubscriptionPlan();

  return hasAds && isAdSenseConfigured() && isAdSenseEligiblePath(pathname);
}
