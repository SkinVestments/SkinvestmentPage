import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ExternalLink } from 'lucide-react';
import {
  CONSENT_UPDATED_EVENT,
  getConsentLabel,
  getStoredConsent,
  openConsentPreferences,
  type ConsentChoice,
} from '@/utils/consent';

export const CookiePreferencesPanel: React.FC = () => {
  const [consent, setConsent] = useState<ConsentChoice | null>(() => getStoredConsent());

  const refreshConsent = useCallback(() => {
    setConsent(getStoredConsent());
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'sv_cookie_consent') refreshConsent();
    };
    const onConsentChange = () => refreshConsent();

    window.addEventListener('storage', onStorage);
    window.addEventListener(CONSENT_UPDATED_EVENT, onConsentChange);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(CONSENT_UPDATED_EVENT, onConsentChange);
    };
  }, [refreshConsent]);

  const handleManage = () => {
    openConsentPreferences();
    window.setTimeout(refreshConsent, 500);
  };

  return (
    <div className="bg-steam-card border border-steam-border rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 shrink-0">
          <Cookie size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-steam-text text-xl mb-1">Cookies &amp; advertising</h4>
          <p className="text-sm text-steam-secondary leading-relaxed mb-4">
            On the free plan, Google AdSense may use cookies to show and measure ads in the dashboard.
            You can change your cookie and personalized ad choices at any time.
          </p>
          <p className="text-xs text-steam-tertiary mb-4">
            Current status:{' '}
            <span className="font-semibold text-steam-secondary">{getConsentLabel(consent)}</span>
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <button
              type="button"
              onClick={handleManage}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-steam-accent hover:opacity-90 transition-opacity"
            >
              Manage cookie &amp; ad preferences
            </button>
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-steam-secondary border border-steam-border hover:bg-steam-hover transition-colors"
            >
              Google Ad Settings
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              to="/privacy"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-steam-accent hover:text-steam-text transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
