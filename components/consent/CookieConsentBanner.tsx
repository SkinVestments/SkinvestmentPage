import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  applyConsent,
  getPrivacyRegion,
  getStoredConsent,
  isGoogleCmpPresent,
  needsConsentPrompt,
  type PrivacyRegion,
} from '@/utils/consent';

const COPY: Record<Exclude<PrivacyRegion, 'other'>, { body: React.ReactNode; accept: string; reject: string }> = {
  eea: {
    body: (
      <>
        We use cookies for analytics and ads (Google AdSense) to keep Skinvestments free. You can
        accept or reject non-essential cookies. See our{' '}
        <Link to="/privacy" className="text-steam-accent hover:underline font-medium">
          Privacy Policy
        </Link>
        .
      </>
    ),
    accept: 'Accept all',
    reject: 'Reject non-essential',
  },
  us: {
    body: (
      <>
        We use cookies and similar technologies for ads and analytics. If you are in California or
        other US states with privacy laws, you may opt out of personalized advertising. See our{' '}
        <Link to="/privacy" className="text-steam-accent hover:underline font-medium">
          Privacy Policy
        </Link>
        .
      </>
    ),
    accept: 'OK',
    reject: 'Opt out of personalized ads',
  },
};

/**
 * Fallback when Google CMP does not load.
 * Configure certified messages in AdSense → Privacy & messaging:
 * - European regulations (EEA/UK/CH)
 * - US state regulations
 */
export const CookieConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [region, setRegion] = useState<Exclude<PrivacyRegion, 'other'>>('eea');

  useEffect(() => {
    if (getStoredConsent()) return;
    if (!needsConsentPrompt()) return;

    const r = getPrivacyRegion();
    if (r === 'other') return;
    setRegion(r);

    const timer = window.setTimeout(() => {
      if (getStoredConsent()) return;
      if (isGoogleCmpPresent()) return;
      setVisible(true);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const copy = COPY[region];

  const choose = (granted: boolean) => {
    applyConsent(granted ? 'granted' : 'denied');
    setVisible(false);
  };

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[100] p-4 sm:p-6 pointer-events-none"
      role="dialog"
      aria-label="Privacy choices"
    >
      <div className="max-w-3xl mx-auto pointer-events-auto rounded-2xl border border-steam-border bg-steam-surface/95 backdrop-blur-xl shadow-2xl p-5 sm:p-6">
        <p className="text-sm text-steam-secondary leading-relaxed mb-4">{copy.body}</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => choose(false)}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-steam-secondary border border-steam-border hover:bg-steam-hover transition-colors"
          >
            {copy.reject}
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-steam-accent hover:opacity-90 transition-opacity"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
};
