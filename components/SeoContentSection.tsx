import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import type { MarketingSeoPage } from '@/content/seoCopy';

type SeoContentSectionProps = {
  page: MarketingSeoPage;
  /** When true, render h1 (standalone landings). When false, start at lead/h2 (pages that already have an h1). */
  showH1?: boolean;
  className?: string;
};

export const SeoContentSection: React.FC<SeoContentSectionProps> = ({
  page,
  showH1 = false,
  className = '',
}) => (
  <section
    className={`relative py-16 sm:py-24 bg-steam-bg overflow-hidden ${className}`}
    aria-label="Page details"
  >
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-blue-900/5 blur-[100px] rounded-full pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
      {showH1 ? (
        <header className="max-w-3xl mb-14 sm:mb-16">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-steam-text tracking-tight mb-5 leading-[1.1]">
            {page.h1}
          </h1>
          <p className="text-steam-secondary text-lg sm:text-xl leading-relaxed">{page.lead}</p>
        </header>
      ) : (
        <header className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-steam-secondary text-lg sm:text-xl leading-relaxed">{page.lead}</p>
        </header>
      )}

      <div className="space-y-8 sm:space-y-10">
        {page.blocks.map((block) => (
          <article
            key={block.heading || block.paragraphs[0]?.slice(0, 24)}
            className="rounded-3xl border border-steam-border/50 bg-steam-card/40 backdrop-blur-sm p-6 sm:p-8 md:p-10"
          >
            <div
              className={`grid grid-cols-1 gap-8 ${
                block.list?.length ? 'lg:grid-cols-12 lg:gap-12' : ''
              }`}
            >
              <div className={block.list?.length ? 'lg:col-span-7' : ''}>
                {block.heading && (
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-steam-text tracking-tight mb-4">
                    {block.heading}
                  </h2>
                )}
                {block.paragraphs.map((p) => (
                  <p
                    key={p.slice(0, 48)}
                    className="text-steam-secondary text-base sm:text-lg leading-relaxed mb-4 last:mb-0"
                  >
                    {p}
                  </p>
                ))}

                {block.links && block.links.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-8">
                    {block.links.map((l, linkIdx) => (
                      <Link
                        key={l.href}
                        to={l.href}
                        className={
                          linkIdx === 0
                            ? 'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-steam-accent text-white text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity'
                            : 'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-steam-border text-steam-text text-sm font-bold uppercase tracking-wide hover:border-steam-accent hover:text-steam-accent transition-colors'
                        }
                      >
                        {l.label}
                        <ArrowRight className="w-4 h-4" aria-hidden />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {block.list && block.list.length > 0 && (
                <ul className="lg:col-span-5 space-y-3 list-none p-0 m-0">
                  {block.list.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 p-4 rounded-2xl theme-subtle border border-steam-border/50"
                    >
                      <span className="w-8 h-8 shrink-0 rounded-lg bg-steam-accent/15 text-steam-accent flex items-center justify-center">
                        <Check className="w-4 h-4" aria-hidden />
                      </span>
                      <span className="text-steam-text text-sm sm:text-base leading-snug font-medium">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
