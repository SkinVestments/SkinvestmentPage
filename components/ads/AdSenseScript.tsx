import { useEffect } from 'react';
import { ADSENSE_CLIENT } from '@/constants/adSlots';
import { useSubscriptionPlan } from '@/hooks/useSubscriptionPlan';

const SCRIPT_ATTR = 'data-skinvestments-adsense';

/** Loads AdSense script once for free-plan dashboard users. */
export function AdSenseScript() {
  const { hasAds } = useSubscriptionPlan();

  useEffect(() => {
    if (!ADSENSE_CLIENT || !hasAds) return;
    if (document.querySelector(`script[${SCRIPT_ATTR}]`)) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    script.crossOrigin = 'anonymous';
    script.setAttribute(SCRIPT_ATTR, 'true');
    document.head.appendChild(script);
  }, [hasAds]);

  return null;
}
