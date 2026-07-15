import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { usePageSeo } from '@/hooks/usePageSeo';
import { PAGE_SEO } from '@/utils/seo';

const LAST_UPDATED = 'June 8, 2026';

export default function TermsAndConditionsPage() {
  usePageSeo(PAGE_SEO.terms);

  return (
    <div className="pt-24 sm:pt-32 pb-24 px-4 sm:px-6 min-h-screen bg-steam-bg relative overflow-x-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-steam-accent/10 rounded-lg">
            <FileText className="w-8 h-8 text-steam-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-steam-text font-display">Terms &amp; Conditions</h1>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-steam-secondary font-sans">
          <p className="text-xl text-steam-secondary mb-8">Last updated: {LAST_UPDATED}</p>

          <div className="space-y-8 bg-steam-card p-8 rounded-2xl border border-steam-border">
            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Skinvestments (&quot;the Service&quot;) at{' '}
                <a href="https://skinvestments.app" className="text-steam-accent hover:underline">
                  skinvestments.app
                </a>{' '}
                or our mobile applications, you agree to these Terms &amp; Conditions and our{' '}
                <Link to="/privacy" className="text-steam-accent hover:underline">
                  Privacy Policy
                </Link>
                . If you do not agree, you must not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">2. Description of Service</h2>
              <p>
                Skinvestments is a portfolio tracking and analytics tool for Counter-Strike 2 (CS2) virtual items. We
                provide estimated valuations based on aggregated data from third-party marketplaces.
              </p>
              <p className="mt-2 text-yellow-500 font-medium">
                Disclaimer: We do not provide financial, investment, or legal advice. The virtual item market is highly
                volatile, and past performance is not indicative of future results.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">3. Subscription Plans &amp; Advertising</h2>
              <p className="mb-4">The Service is offered under multiple subscription tiers:</p>
              <ul className="list-disc pl-6 space-y-2 text-steam-secondary">
                <li>
                  <strong className="text-steam-text">Starter (free):</strong> Includes access to core features. The web
                  dashboard may display third-party advertisements (Google AdSense) to support the free tier.
                </li>
                <li>
                  <strong className="text-steam-text">Pro and Pro Max (paid):</strong> Include additional features and{' '}
                  <strong className="text-steam-text">no AdSense advertising</strong> in the web dashboard, as described
                  on our{' '}
                  <Link to="/pricing" className="text-steam-accent hover:underline">
                    Pricing
                  </Link>{' '}
                  page.
                </li>
              </ul>
              <p className="mt-4">
                Paid subscriptions are processed through third-party billing (e.g. RevenueCat). Prices, billing cycles,
                and feature availability are listed at checkout and may change with notice. Refunds are handled according
                to the policies of the payment platform and applicable law.
              </p>
              <p className="mt-2 text-sm">
                Third-party ads are not endorsed by Skinvestments. We are not responsible for the content, products, or
                practices of advertisers or linked websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">4. Data Accuracy</h2>
              <p>
                While we strive to provide accurate and up-to-date pricing data, we do not guarantee the accuracy,
                completeness, or timeliness of any market data displayed. Prices can fluctuate rapidly, and discrepancies
                between our platform and actual marketplace prices may occur. You assume all risks associated with trading
                or investing based on our data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">5. User Accounts</h2>
              <ul className="list-disc pl-6 space-y-2 text-steam-secondary">
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You must provide accurate information and keep your profile up to date where applicable.</li>
                <li>You must not use the Service for any illegal or unauthorized purpose.</li>
                <li>
                  You must not attempt to circumvent subscription limits, ad restrictions, or security measures.
                </li>
                <li>We reserve the right to suspend or terminate your account if you violate these Terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">6. Intellectual Property &amp; Affiliation</h2>
              <p>
                Skinvestments is an independent service and is{' '}
                <strong className="text-steam-text">
                  not affiliated with, endorsed by, or sponsored by Valve Corporation or Steam.
                </strong>{' '}
                Counter-Strike, CS2, and all related in-game items, images, and assets are trademarks and/or registered
                trademarks of Valve Corporation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Skinvestments and its operators shall not be liable for any
                direct, indirect, incidental, or consequential damages resulting from your use of the Service, including
                but not limited to financial losses incurred through virtual item trading, subscription billing issues,
                or third-party advertisements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">8. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. The &quot;Last updated&quot; date at the top of this page
                indicates when changes were last made. Continued use of the Service after changes constitutes acceptance
                of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">9. Contact</h2>
              <p>
                For questions regarding these Terms, contact us at:{' '}
                <a href="mailto:kjlabs.studio@gmail.com" className="text-steam-accent hover:underline">
                  kjlabs.studio@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
