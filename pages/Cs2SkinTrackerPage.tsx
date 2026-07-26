import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageSeo } from '@/hooks/usePageSeo';
import { PAGE_SEO } from '@/utils/seo';
import { CS2_SKIN_TRACKER_SEO } from '@/content/seoCopy';
import { SeoContentSection } from '@/components/SeoContentSection';
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@/constants/appLinks';

export default function Cs2SkinTrackerPage() {
  usePageSeo(PAGE_SEO.cs2SkinTracker);
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="min-h-screen bg-steam-bg pt-24 sm:pt-32 pb-8 overflow-x-hidden">
      <SeoContentSection page={CS2_SKIN_TRACKER_SEO} showH1 />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 -mt-6 sm:-mt-10 relative z-10">
        <div className="rounded-3xl border border-steam-border/50 bg-steam-elevated/60 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-steam-text mb-2">
              Start tracking free
            </h2>
            <p className="text-steam-secondary text-sm sm:text-base max-w-xl">
              Same product as Features: web dashboard plus iOS and Android, one account.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/login"
              className="bg-steam-accent hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-sm"
            >
              Start free
            </Link>
            <Link
              to="/pricing"
              className="border border-steam-border text-steam-text hover:border-steam-accent px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-sm"
            >
              Pricing
            </Link>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-steam-border text-steam-text hover:border-steam-accent px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-sm"
            >
              iOS
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-steam-border text-steam-text hover:border-steam-accent px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-sm"
            >
              Android
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
