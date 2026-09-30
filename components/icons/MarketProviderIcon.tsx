import React from 'react';
import { getMarketSourceConfig, STEAM_MARKET_ICON } from '@/constants/marketSources';

interface MarketProviderIconProps {
  source: string;
  size?: number;
  className?: string;
}

export const MarketProviderIcon: React.FC<MarketProviderIconProps> = ({
  source,
  size = 20,
  className = '',
}) => {
  const isSteam = source.trim().toLowerCase() === 'steam';
  const src = isSteam
    ? STEAM_MARKET_ICON
    : getMarketSourceConfig(source).iconSrc;

  if (!src) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-md bg-steam-elevated border border-steam-border text-[9px] font-bold text-steam-tertiary shrink-0 ${className}`}
        style={{ width: size, height: size }}
        aria-hidden
      >
        ?
      </span>
    );
  }

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={`rounded-md object-cover shrink-0 bg-steam-elevated border border-steam-border/60 ${className}`}
      aria-hidden
    />
  );
};
