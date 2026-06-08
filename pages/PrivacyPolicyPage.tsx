import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const LAST_UPDATED = 'June 8, 2026';

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-24 sm:pt-32 pb-24 px-4 sm:px-6 min-h-screen bg-steam-bg relative overflow-x-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-steam-accent/10 rounded-lg">
            <Shield className="w-8 h-8 text-steam-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-steam-text font-display">Privacy Policy</h1>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-steam-secondary font-sans">
          <p className="text-xl text-steam-secondary mb-8">Last updated: {LAST_UPDATED}</p>

          <div className="space-y-8 bg-steam-card p-8 rounded-2xl border border-steam-border">
            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">1. Introduction</h2>
              <p>
                Welcome to Skinvestments (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). We respect your privacy and are
                committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and
                safeguard your information when you use our website at{' '}
                <a href="https://skinvestments.app" className="text-steam-accent hover:underline">
                  skinvestments.app
                </a>{' '}
                and our mobile applications.
              </p>
              <p className="mt-2">
                By using Skinvestments, you acknowledge that you have read this policy. Where required by law (including
                the GDPR), we ask for your consent before placing non-essential cookies or serving personalized
                advertising.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">2. Data We Collect</h2>
              <p className="mb-4">
                We collect only the data necessary to provide, secure, improve, and monetize our services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-steam-secondary">
                <li>
                  <strong className="text-steam-text">Account information:</strong> Email address and encrypted password
                  when you register with email, or basic profile data when you sign in with Google or Apple.
                </li>
                <li>
                  <strong className="text-steam-text">Profile data:</strong> Display name, optional Steam profile URL,
                  avatar, and preferences you save in Settings.
                </li>
                <li>
                  <strong className="text-steam-text">Steam inventory data:</strong> Public Steam inventory items you
                  import, used to generate valuations and track your portfolio.
                </li>
                <li>
                  <strong className="text-steam-text">Technical &amp; usage data:</strong> IP address, browser type,
                  device information, pages visited, and login timestamps. Our backend (Supabase) logs connection data
                  for security and performance.
                </li>
                <li>
                  <strong className="text-steam-text">Analytics data (website):</strong> Through Google Analytics 4, we
                  collect aggregated and pseudonymous information about how visitors use our website (e.g. pages viewed,
                  session duration, approximate location derived from IP).
                </li>
                <li>
                  <strong className="text-steam-text">Analytics &amp; diagnostic data (mobile app):</strong> Anonymous or
                  pseudonymous usage data, device identifiers (e.g. IDFV, Android ID), OS version, and crash reports via
                  Firebase Analytics and Crashlytics.
                </li>
                <li>
                  <strong className="text-steam-text">Advertising data (website):</strong> On the free (Starter) plan,
                  Google AdSense may use cookies and similar technologies to serve and measure ads in the web dashboard.
                  This can include cookie identifiers, ad interaction data, and IP address.
                </li>
                <li>
                  <strong className="text-steam-text">Advertising data (mobile app):</strong> Mobile advertising
                  identifiers (such as Apple&apos;s IDFA or Google&apos;s Advertising ID) may be used by AdMob to serve
                  ads in the mobile application.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">3. Cookies &amp; Similar Technologies</h2>
              <p className="mb-4">
                Our website uses cookies and similar storage technologies for essential functionality, analytics, and
                advertising.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-steam-secondary">
                <li>
                  <strong className="text-steam-text">Essential cookies:</strong> Required for authentication, security,
                  and core features (e.g. Supabase session).
                </li>
                <li>
                  <strong className="text-steam-text">Analytics cookies:</strong> Set by Google Analytics to understand
                  how the website is used. Loaded only after you accept non-essential cookies where consent is required.
                </li>
                <li>
                  <strong className="text-steam-text">Advertising cookies:</strong> Set by Google AdSense for users on the
                  free plan, to display and measure ads. Subject to your consent in the EEA, UK, and Switzerland, and
                  applicable US state privacy choices.
                </li>
                <li>
                  <strong className="text-steam-text">Consent storage:</strong> We store your cookie preference locally
                  (e.g. in your browser) so we do not ask on every visit.
                </li>
              </ul>
              <p className="mt-4 text-sm">
                When you first visit from a region where consent is required, a cookie banner lets you accept or reject
                non-essential cookies. You can change your mind by clearing site data or adjusting your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">4. Third-Party Services</h2>
              <p>
                Skinvestments relies on third-party processors and data sources. By using our service, you acknowledge
                that data may be processed by:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-steam-secondary mt-2">
                <li>
                  <strong className="text-steam-text">Supabase:</strong> Authentication, database, and secure storage
                  of account and portfolio data.
                </li>
                <li>
                  <strong className="text-steam-text">Steam (Valve Corp.):</strong> Public inventory data.
                </li>
                <li>
                  <strong className="text-steam-text">Market data providers:</strong> Aggregated public pricing from
                  Steam Community Market, Skinport, and Buff163.
                </li>
                <li>
                  <strong className="text-steam-text">Google LLC — Google Analytics 4 (website):</strong> Website usage
                  analytics. See{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-steam-accent hover:underline"
                  >
                    Google&apos;s Privacy Policy
                  </a>
                  .
                </li>
                <li>
                  <strong className="text-steam-text">Google LLC — Google AdSense (website):</strong> Display
                  advertising on the web dashboard for free-plan users. See{' '}
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-steam-accent hover:underline"
                  >
                    How Google uses advertising cookies
                  </a>
                  .
                </li>
                <li>
                  <strong className="text-steam-text">Google LLC — Firebase Analytics &amp; Crashlytics (mobile):</strong>{' '}
                  App usage and stability monitoring.
                </li>
                <li>
                  <strong className="text-steam-text">Google LLC — AdMob (mobile):</strong> In-app advertising.
                </li>
                <li>
                  <strong className="text-steam-text">RevenueCat:</strong> Subscription checkout and plan management
                  when you purchase Pro or Pro Max.
                </li>
              </ul>
              <p className="mt-4 text-sm">
                Data processed by Google and other providers may be transferred to and stored on servers outside the
                European Economic Area (EEA), including the United States. Where required, we rely on appropriate
                safeguards such as Standard Contractual Clauses and your explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">5. Advertising &amp; Subscription Plans</h2>
              <p className="mb-4">
                Advertising on our website is shown only to users on the <strong className="text-steam-text">Starter (free)</strong>{' '}
                plan. Paid plans (<strong className="text-steam-text">Pro</strong> and{' '}
                <strong className="text-steam-text">Pro Max</strong>) do not display AdSense ads in the web dashboard.
              </p>
              <p>
                Ads are provided by third parties (Google). We do not control the content of every ad. Clicking an ad
                takes you to a third-party site governed by its own privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">6. Your Rights &amp; Opt-Out</h2>
              <p className="mb-4">
                Under the GDPR and other applicable laws, you may have the right to access, rectify, erase, restrict, or
                port your personal data, and to object to certain processing.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-steam-secondary">
                <li>
                  <strong className="text-steam-text">Cookie consent (website):</strong> Use the cookie banner on your
                  first visit to accept or reject non-essential cookies. Rejecting limits analytics and personalized
                  advertising.
                </li>
                <li>
                  <strong className="text-steam-text">Google ad personalization:</strong> Manage preferences at{' '}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-steam-accent hover:underline"
                  >
                    Google Ad Settings
                  </a>
                  .
                </li>
                <li>
                  <strong className="text-steam-text">Analytics opt-out (mobile):</strong> Disable diagnostics and usage
                  data sharing via the toggle in the app Settings → Privacy tab.
                </li>
                <li>
                  <strong className="text-steam-text">Mobile ad tracking:</strong> Use device settings such as
                  &quot;Limit Ad Tracking&quot; (iOS) or &quot;Opt out of Ads Personalization&quot; (Android).
                </li>
                <li>
                  <strong className="text-steam-text">Remove ads:</strong> Upgrade to a paid plan — see{' '}
                  <Link to="/pricing" className="text-steam-accent hover:underline">
                    Pricing
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-steam-text">Account deletion:</strong> Contact us to request permanent deletion
                  of your account and associated data.
                </li>
                <li>
                  <strong className="text-steam-text">Data export:</strong> Export portfolio and transaction data from
                  the dashboard where available.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">7. Contact Us</h2>
              <p>
                For privacy questions or to exercise your data rights, contact us at:{' '}
                <a href="mailto:kjlabs.studio@gmail.com" className="text-steam-accent hover:underline">
                  kjlabs.studio@gmail.com
                </a>
              </p>
              <p className="mt-2 text-sm">
                See also our{' '}
                <Link to="/terms" className="text-steam-accent hover:underline">
                  Terms &amp; Conditions
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
