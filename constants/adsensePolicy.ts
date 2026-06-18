/**
 * AdSense Program Policies — ads only on dashboard views with substantive user content.
 * Excludes login, OAuth, settings, loading shells, and navigation-only screens.
 */
export const ADSENSE_ELIGIBLE_PATHS = [
  '/panel',
  '/inventory',
  '/analytics',
  '/history',
] as const;

export function isAdSenseEligiblePath(pathname: string): boolean {
  return ADSENSE_ELIGIBLE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
