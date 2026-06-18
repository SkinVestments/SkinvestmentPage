const CONSENT_KEY = 'sv_cookie_consent';

export const CONSENT_PREFERENCES_REQUEST_EVENT = 'skinvestments:consent-preferences';
export const CONSENT_UPDATED_EVENT = 'skinvestments:consent-updated';

export type ConsentChoice = 'granted' | 'denied';
export type PrivacyRegion = 'eea' | 'us' | 'other';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __tcfapi?: (...args: unknown[]) => void;
    googlefc?: { showRevocationMessage?: () => void };
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

  window.dispatchEvent(new CustomEvent(CONSENT_UPDATED_EVENT));
}

/** Google Funding Choices UI loaded (not our googlefcPresent signal iframe). */
export function isGoogleCmpPresent(): boolean {
  if (typeof window.__tcfapi === 'function') return true;
  if (typeof window.googlefc?.showRevocationMessage === 'function') return true;
  if (document.querySelector('[id*="fc-consent"], [class*="fc-consent"], .fc-dialog')) return true;
  return false;
}

export function clearStoredConsent(): void {
  localStorage.removeItem(CONSENT_KEY);
}

export function getConsentLabel(choice: ConsentChoice | null): string {
  if (choice === 'granted') return 'Non-essential cookies accepted';
  if (choice === 'denied') return 'Non-essential cookies rejected';
  return 'No choice saved yet';
}

/** Re-open Google CMP or fallback cookie banner. */
export function openConsentPreferences(): void {
  clearStoredConsent();

  if (typeof window.googlefc?.showRevocationMessage === 'function') {
    window.googlefc.showRevocationMessage();
    return;
  }

  if (typeof window.__tcfapi === 'function') {
    window.__tcfapi('displayConsentUi', 2, () => {});
    return;
  }

  window.dispatchEvent(new CustomEvent(CONSENT_PREFERENCES_REQUEST_EVENT));
}
