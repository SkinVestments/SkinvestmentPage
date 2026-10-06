import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { MANAGE_SUBSCRIPTION_SETTINGS_PATH } from '@/constants/settingsLinks';

export interface ProAnalyticsPaywallProps {
  /** Short feature pitch under the title. */
  description: string;
  /** Optional settings `from=` query for upgrade attribution. */
  from?: string;
  title?: string;
  ctaLabel?: string;
  className?: string;
}

/**
 * Shared Pro lock overlay for Analytics widgets (Drops, Stagnation, Diversity, …).
 */
export const ProAnalyticsPaywall: React.FC<ProAnalyticsPaywallProps> = ({
  description,
  from,
  title = 'Pro Analytics Required',
  ctaLabel = 'Upgrade to PRO',
  className = '',
}) => {
  const to = from
    ? `${MANAGE_SUBSCRIPTION_SETTINGS_PATH}?from=${encodeURIComponent(from)}`
    : MANAGE_SUBSCRIPTION_SETTINGS_PATH;

  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-steam-card/50 rounded-xl ${className}`}
    >
      <div className="bg-steam-bg p-6 rounded-2xl border border-steam-border shadow-2xl text-center max-w-sm w-full mx-4">
        <div className="w-12 h-12 bg-steam-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-steam-accent" aria-hidden />
        </div>
        <h4 className="text-steam-text font-bold text-lg mb-2">{title}</h4>
        <p className="text-sm text-steam-secondary mb-6">{description}</p>
        <Link
          to={to}
          className="block w-full bg-steam-accent hover:opacity-90 text-white font-bold py-3 rounded-xl transition-colors text-center"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
};
