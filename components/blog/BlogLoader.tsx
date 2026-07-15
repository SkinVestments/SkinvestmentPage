import React from 'react';

type BlogLoaderProps = {
  label?: string;
  className?: string;
};

/** Custom journal loader — accent orbit + portfolio spark (not generic Lucide spinner). */
export const BlogLoader: React.FC<BlogLoaderProps> = ({
  label = 'Loading journal…',
  className = '',
}) => (
  <div
    className={`flex flex-col items-center justify-center gap-5 py-20 sm:py-28 ${className}`}
    role="status"
    aria-live="polite"
    aria-label={label}
  >
    <div className="relative w-14 h-14 sm:w-16 sm:h-16">
      {/* Outer faint ring */}
      <div className="absolute inset-0 rounded-full border border-steam-border/70" />

      {/* Spinning accent arc */}
      <div
        className="absolute inset-0 rounded-full border-[2.5px] border-transparent border-t-steam-accent border-r-steam-accent/40 animate-blog-spin"
        aria-hidden
      />

      {/* Counter-orbit tick */}
      <div className="absolute inset-1.5 animate-blog-orbit" aria-hidden>
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-steam-accent shadow-[0_0_10px_color-mix(in_srgb,var(--color-accent)_55%,transparent)]" />
      </div>

      {/* Center: mini portfolio spark */}
      <div className="absolute inset-0 flex items-center justify-center animate-blog-pulse" aria-hidden>
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 sm:w-6 sm:h-6 text-steam-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 17 L9 12 L13 15 L20 7" />
          <path d="M15 7 H20 V12" />
        </svg>
      </div>
    </div>

    <p className="font-display text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] text-steam-tertiary">
      {label}
    </p>
  </div>
);
