import React, { useEffect, useRef, useState } from 'react';
import { Apple, ChevronDown } from 'lucide-react';
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@/constants/appLinks';
import { GooglePlayIcon } from './icons/GooglePlayIcon';

const storeLinkClass =
  'flex items-center gap-3 px-4 py-3 text-sm font-bold text-steam-text hover:bg-steam-hover transition-colors';

interface GetAppButtonProps {
  /** Compact nav CTA with dropdown; mobile = two full-width store buttons */
  variant?: 'nav' | 'mobile';
  onNavigate?: () => void;
}

export const GetAppButton: React.FC<GetAppButtonProps> = ({ variant = 'nav', onNavigate }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleStoreClick = () => {
    setOpen(false);
    onNavigate?.();
  };

  if (variant === 'mobile') {
    return (
      <div className="flex flex-col gap-2 mt-2">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="w-full py-3 rounded-lg bg-steam-accent text-on-accent font-bold uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Apple className="w-5 h-5" aria-hidden />
          App Store
        </a>
        <a
          href={GOOGLE_PLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="w-full py-3 rounded-lg bg-steam-surface border border-steam-border text-steam-text font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-steam-hover"
        >
          <GooglePlayIcon size={20} />
          Google Play
        </a>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="px-5 py-2 rounded bg-steam-surface hover:bg-steam-hover text-steam-text text-sm font-bold uppercase tracking-wide transition-colors border border-steam-border hover:border-steam-accent/50 shadow-md flex items-center gap-1.5"
      >
        Get App
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 min-w-[200px] rounded-xl border border-steam-border bg-steam-card shadow-2xl overflow-hidden z-[60] animate-fade-in"
        >
          <a
            role="menuitem"
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={storeLinkClass}
            onClick={handleStoreClick}
          >
            <Apple className="w-5 h-5 text-steam-text shrink-0" aria-hidden />
            App Store
          </a>
          <a
            role="menuitem"
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${storeLinkClass} border-t border-steam-border`}
            onClick={handleStoreClick}
          >
            <GooglePlayIcon size={20} />
            Google Play
          </a>
        </div>
      )}
    </div>
  );
};
