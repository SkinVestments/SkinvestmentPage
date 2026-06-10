import React from 'react';
import { SOCIAL_LINKS } from '@/constants/appLinks';

interface SocialLinksProps {
  className?: string;
  iconSize?: number;
}

const linkClass =
  'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-steam-border bg-steam-card text-steam-tertiary transition-colors hover:border-steam-accent/40 hover:bg-steam-hover hover:text-steam-accent';

const XIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export const SocialLinks: React.FC<SocialLinksProps> = ({ className = '', iconSize = 18 }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <a
      href={SOCIAL_LINKS.x}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
      aria-label="Skinvestments on X"
    >
      <XIcon size={iconSize} />
    </a>
    <a
      href={SOCIAL_LINKS.tiktok}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
      aria-label="Skinvestments on TikTok"
    >
      <TikTokIcon size={iconSize} />
    </a>
  </div>
);
