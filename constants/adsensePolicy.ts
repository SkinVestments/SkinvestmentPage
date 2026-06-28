/**
 * AdSense Program Policies — ads only on public, high-content pages.
 * Keep ads off utility dashboard screens to reduce low-value-content risk.
 */
export const ADSENSE_ELIGIBLE_PATHS = [
  '/features',
  '/faq',
] as const;

export function isAdSenseEligiblePath(pathname: string): boolean {
  return ADSENSE_ELIGIBLE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
