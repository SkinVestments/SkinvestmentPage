/**
 * AdSense — public marketing/content pages only (not dashboard).
 * Everyone sees ads here; Pro only removes ads inside the authenticated app.
 */
export const ADSENSE_ELIGIBLE_PATHS = [
  '/features',
  '/faq',
  '/blog',
] as const;

export function isAdSenseEligiblePath(pathname: string): boolean {
  return ADSENSE_ELIGIBLE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
