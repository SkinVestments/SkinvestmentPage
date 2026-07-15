import { useEffect } from 'react';
import { ADSENSE_CLIENT } from '@/constants/adSlots';
import { useAdSenseEligible } from '@/hooks/useAdSenseEligible';

const SCRIPT_ATTR = 'data-skinvestments-adsense';

/** Loads AdSense script on public eligible routes (blog, FAQ, features). */
export function AdSenseScript() {
  const eligible = useAdSenseEligible();

  useEffect(() => {
    if (!eligible || !ADSENSE_CLIENT) return;
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
    if (document.querySelector(`script[${SCRIPT_ATTR}]`)) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    script.crossOrigin = 'anonymous';
    script.setAttribute(SCRIPT_ATTR, 'true');
    document.head.appendChild(script);
  }, [eligible]);

  return null;
}
