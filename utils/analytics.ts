const GA_ID = 'G-6VT5X6FJBQ';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Load GA after idle so it does not force layout during LCP/FCP. */
export function initDeferredAnalytics(): void {
  const load = () => {
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) return;

    window.dataLayer = window.dataLayer ?? [];
    if (!window.gtag) {
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(load, { timeout: 5000 });
  } else {
    window.addEventListener('load', () => window.setTimeout(load, 3000), { once: true });
  }
}
