import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { AD_SLOTS, ADSENSE_CLIENT, type AdSlotKey } from '@/constants/adSlots';
import { useAdSenseEligible } from '@/hooks/useAdSenseEligible';

interface AdSlotProps {
  slotKey: AdSlotKey;
  className?: string;
  /** Reserve min height to reduce CLS while ad loads */
  minHeight?: number;
  lazy?: boolean;
  showUpgradeHint?: boolean;
  /** Wait until page has loaded meaningful publisher content (not loading/empty shells). */
  contentReady?: boolean;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotKey,
  className = '',
  minHeight = 90,
  lazy = true,
  showUpgradeHint = true,
  contentReady = true,
}) => {
  const eligible = useAdSenseEligible();
  const containerRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);
  const [visible, setVisible] = useState(!lazy);

  const slotId = AD_SLOTS[slotKey];
  const mayShowAd = eligible && contentReady && Boolean(slotId && ADSENSE_CLIENT);

  useEffect(() => {
    if (!lazy || !containerRef.current) return;

    const el = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy]);

  useEffect(() => {
    if (!mayShowAd || !visible || pushedRef.current) return;

    const timer = window.setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      } catch {
        /* AdSense not ready yet */
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [mayShowAd, visible, slotId]);

  if (!mayShowAd) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`rounded-xl border border-steam-border/60 bg-steam-elevated/40 overflow-hidden ${className}`}
      style={{ minHeight }}
      role="complementary"
      aria-label="Advertisement"
    >
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-steam-border/40">
        <span className="text-[10px] font-bold uppercase tracking-widest text-steam-tertiary">
          Advertisement
        </span>
        {showUpgradeHint && (
          <Link
            to="/settings"
            className="text-[10px] font-semibold text-steam-accent hover:text-steam-text flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            Remove ads with Pro
          </Link>
        )}
      </div>

      {visible && (
        <div className="flex justify-center p-2">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={ADSENSE_CLIENT}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      )}
    </div>
  );
};
