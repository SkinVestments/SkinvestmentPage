import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Shield } from 'lucide-react';
import { usePageSeo } from '@/hooks/usePageSeo';
import { PAGE_SEO } from '@/utils/seo';

export default function AboutPage() {
  usePageSeo(PAGE_SEO.about);

  return (
    <div className="pt-24 sm:pt-32 pb-24 px-4 sm:px-6 min-h-screen bg-steam-bg relative overflow-x-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-steam-accent/10 rounded-lg">
            <Building2 className="w-8 h-8 text-steam-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-steam-text font-display">About Skinvestments</h1>
        </div>

        <p className="text-xl text-steam-secondary mb-10 leading-relaxed">
          Skinvestments is a CS2 portfolio tracker that helps players measure inventory value, cost
          basis, and performance across markets - built by{' '}
          <a
            href="https://kjlabs.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-steam-accent hover:underline"
          >
            KJ Labs Studio
          </a>
          .
        </p>

        <div className="space-y-8 bg-steam-card p-8 rounded-2xl border border-steam-border text-steam-secondary">
          <section>
            <h2 className="text-2xl font-bold text-steam-text mb-4">Who we are</h2>
            <p className="leading-relaxed">
              KJ Labs Studio builds focused products for people who already treat digital items as
              assets. Skinvestments started from a simple frustration: Steam inventory screens show
              items, not a portfolio. Cost basis, multi-market prices, drop history, and stagnating
              holdings were scattered across marketplaces, spreadsheets, and memory.
            </p>
            <p className="mt-3 leading-relaxed">
              We are an independent studio. Skinvestments is not affiliated with Valve Corporation,
              Steam, Skinport, Buff163, or any marketplace we reference for public pricing signals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-steam-text mb-4">What we build</h2>
            <p className="leading-relaxed mb-4">
              The product is available on web, iOS, and Android. Core capabilities include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Syncing public Steam inventory data without asking for your Steam password</li>
              <li>Tracking purchase cost, current value, and unrealized P&amp;L</li>
              <li>Comparing pricing context across Steam, Skinport, and Buff163</li>
              <li>Logging weekly drops and reviewing portfolio analytics over time</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              Learn more on our{' '}
              <Link to="/features" className="text-steam-accent hover:underline">
                features
              </Link>{' '}
              and{' '}
              <Link to="/pricing" className="text-steam-accent hover:underline">
                pricing
              </Link>{' '}
              pages, or browse practical guides on the{' '}
              <Link to="/blog" className="text-steam-accent hover:underline">
                blog
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-steam-text mb-4">How we think about content</h2>
            <p className="leading-relaxed">
              Our journal covers CS2 inventory tracking, marketplace spreads, update context, and
              record-keeping habits. We focus on methods you can verify - not price predictions or
              “guaranteed” returns. Skin markets move for many reasons; our job is to help you see
              your own numbers clearly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-steam-text mb-4">Privacy and trust</h2>
            <p className="leading-relaxed">
              We design Skinvestments so you do not hand over Steam credentials. Public inventory
              sync and account security details are explained in our{' '}
              <Link to="/privacy" className="text-steam-accent hover:underline inline-flex items-center gap-1">
                <Shield className="w-4 h-4" aria-hidden />
                Privacy Policy
              </Link>
              . Terms of use are on{' '}
              <Link to="/terms" className="text-steam-accent hover:underline">
                Terms &amp; Conditions
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-steam-text mb-4">Contact</h2>
            <p className="leading-relaxed">
              Questions about the product, billing, privacy requests, or partnerships go to{' '}
              <a
                href="mailto:kjlabs.studio@gmail.com"
                className="text-steam-accent hover:underline inline-flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" aria-hidden />
                kjlabs.studio@gmail.com
              </a>
              . More options are on the{' '}
              <Link to="/contact" className="text-steam-accent hover:underline">
                Contact
              </Link>{' '}
              page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
