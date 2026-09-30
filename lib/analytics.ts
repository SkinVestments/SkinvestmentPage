declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire-and-forget GA event (no-op if gtag is unavailable). */
export function track(name: string, props?: Record<string, unknown>): void {
  try {
    window.gtag?.('event', name, props ?? {});
  } catch {
    /* ignore */
  }
}
