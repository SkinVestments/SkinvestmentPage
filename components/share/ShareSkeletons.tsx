import React from 'react';
import { Shimmer } from '@/components/ui/Shimmer';
import type { PortfolioEmbedLayout } from '@/types/portfolioShare';

/** Public /p/:token loading shell: header, summary, chart, holdings. */
export const PublicPortfolioSkeleton: React.FC = () => (
  <div
    className="min-h-screen bg-steam-bg pt-24 sm:pt-32 pb-20 px-4 sm:px-6 overflow-x-hidden"
    aria-busy="true"
    aria-label="Loading shared portfolio"
  >
    <div className="max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10">
        <Shimmer className="w-16 h-16 rounded-2xl shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <Shimmer className="h-3 w-28 rounded" />
          <Shimmer className="h-9 sm:h-10 w-56 sm:w-72 max-w-full rounded-md" />
          <Shimmer className="h-4 w-64 max-w-full rounded" />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-steam-border bg-steam-card p-5 min-h-[5.5rem]">
            <Shimmer className="h-3 w-24 rounded mb-3" />
            <Shimmer className="h-7 w-32 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-10">
        <section className="lg:col-span-3 bg-steam-card border border-steam-border rounded-2xl p-5 sm:p-6">
          <Shimmer className="h-5 w-36 rounded mb-4" />
          <Shimmer className="h-[240px] w-full rounded-xl" />
        </section>
        <section className="lg:col-span-2 bg-steam-card border border-steam-border rounded-2xl p-5 sm:p-6">
          <Shimmer className="h-5 w-28 rounded mb-4" />
          <Shimmer className="h-[160px] w-full rounded-full max-w-[160px] mx-auto mb-3" />
          <div className="space-y-2">
            <Shimmer className="h-4 w-full rounded" />
            <Shimmer className="h-4 w-40 max-w-full rounded" />
            <Shimmer className="h-4 w-32 max-w-full rounded" />
          </div>
        </section>
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between gap-3 mb-4">
          <Shimmer className="h-6 w-24 rounded" />
          <Shimmer className="h-3 w-16 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-steam-card border border-steam-border rounded-xl overflow-hidden flex flex-col"
            >
              <div className="h-24 sm:h-28 bg-steam-elevated border-b border-steam-border flex items-center justify-center p-3">
                <Shimmer className="w-16 h-16 rounded-md" />
              </div>
              <div className="p-3 space-y-2">
                <Shimmer className="h-3 w-full rounded" />
                <Shimmer className="h-3 w-20 rounded" />
                <Shimmer className="h-4 w-16 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

/** Embed /embed/:token loading shell sized to the requested layout. */
export const EmbedPortfolioSkeleton: React.FC<{ layout: PortfolioEmbedLayout }> = ({ layout }) => (
  <div
    className="min-h-screen bg-steam-bg text-steam-text p-2 sm:p-3 flex items-stretch justify-center"
    aria-busy="true"
    aria-label="Loading portfolio embed"
  >
    <div className="w-full max-w-[380px] bg-steam-card border border-steam-border rounded-2xl shadow-xl p-3 sm:p-4 self-start">
      <div className="flex items-center gap-2.5">
        <Shimmer className="w-9 h-9 rounded-xl shrink-0" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Shimmer className="h-2.5 w-24 rounded" />
          <Shimmer className="h-4 w-36 max-w-full rounded" />
        </div>
      </div>

      {(layout === 'summary' || layout === 'top' || layout === 'sections') && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="rounded-xl bg-steam-elevated/60 border border-steam-border/50 px-2.5 py-2 min-h-[3.25rem]">
            <Shimmer className="h-2.5 w-10 rounded mb-1.5" />
            <Shimmer className="h-4 w-16 rounded" />
          </div>
          <div className="rounded-xl bg-steam-elevated/60 border border-steam-border/50 px-2.5 py-2 min-h-[3.25rem]">
            <Shimmer className="h-2.5 w-10 rounded mb-1.5" />
            <Shimmer className="h-4 w-12 rounded" />
          </div>
        </div>
      )}

      {layout === 'top' && (
        <div className="mt-3 space-y-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg bg-steam-elevated/50 border border-steam-border/40 px-2 py-1.5"
            >
              <Shimmer className="w-8 h-8 rounded-md shrink-0" />
              <div className="min-w-0 flex-1 space-y-1">
                <Shimmer className="h-3 w-full rounded" />
                <Shimmer className="h-2.5 w-10 rounded" />
              </div>
              <Shimmer className="h-3 w-12 rounded shrink-0" />
            </div>
          ))}
        </div>
      )}

      {layout === 'sections' && (
        <div className="mt-3 space-y-2">
          <Shimmer className="h-16 w-full rounded-xl" />
          <div className="flex items-center gap-3 rounded-xl border border-steam-border/50 bg-steam-elevated/30 p-2">
            <Shimmer className="w-14 h-14 rounded-full shrink-0" />
            <div className="min-w-0 flex-1 space-y-1">
              <Shimmer className="h-2.5 w-full rounded" />
              <Shimmer className="h-2.5 w-28 max-w-full rounded" />
              <Shimmer className="h-2.5 w-20 max-w-full rounded" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Shimmer key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-steam-border/40 flex items-center justify-between gap-2">
        <Shimmer className="h-2.5 w-20 rounded" />
        <Shimmer className="h-2.5 w-24 rounded" />
      </div>
    </div>
  </div>
);
