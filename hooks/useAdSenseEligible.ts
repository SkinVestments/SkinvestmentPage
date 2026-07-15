import { useLocation } from 'react-router-dom';
import { isAdSenseConfigured } from '@/constants/adSlots';
import { isAdSenseEligiblePath } from '@/constants/adsensePolicy';

/**
 * True on public high-content routes when AdSense is configured.
 * Plan (Pro / free) does not matter — these pages are not behind login.
 */
export function useAdSenseEligible(): boolean {
  const { pathname } = useLocation();

  return isAdSenseConfigured() && isAdSenseEligiblePath(pathname);
}
