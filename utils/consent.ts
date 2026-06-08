const CONSENT_KEY = 'sv_cookie_consent';

export type ConsentChoice = 'granted' | 'denied';
export type PrivacyRegion = 'eea' | 'us' | 'other';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __tcfapi?: (...args: unknown[]) => void;
  }
}

function getTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return '';
  }
}

/** EEA, UK, CH */
export function isLikelyEeaUser(): boolean {
  return getTimeZone().startsWith('Europe/');
}

/** US states with privacy laws (timezone heuristic) */
export function isLikelyUsStateUser(): boolean {
  const tz = getTimeZone();
  return tz.startsWith('America/') || tz === 'Pacific/Honolulu' || tz === 'US/Alaska';
}

export function getPrivacyRegion(): PrivacyRegion {
  if (isLikelyEeaUser()) return 'eea';
  if (isLikelyUsStateUser()) return 'us';
  return 'other';
}

export function needsConsentPrompt(): boolean {
  return getPrivacyRegion() === 'eea' || getPrivacyRegion() === 'us';
}

export function getStoredConsent(): ConsentChoice | null {
  const v = localStorage.getItem(CONSENT_KEY);
  return v === 'granted' || v === 'denied' ? v : null;
}

export function applyConsent(choice: ConsentChoice): void {
  localStorage.setItem(CONSENT_KEY, choice);
  const granted = choice === 'granted';

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
    });
  }
}

/** Google Funding Choices UI loaded (not our googlefcPresent signal iframe). */
export function isGoogleCmpPresent(): boolean {
  if (typeof window.__tcfapi === 'function') return true;
  if (document.querySelector('[id*="fc-consent"], [class*="fc-consent"], .fc-dialog')) return true;
  return false;
}
