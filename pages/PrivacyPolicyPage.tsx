import React from 'react';
import { Shield } from 'lucide-react';

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
          <p className="text-xl text-steam-secondary mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8 bg-steam-card p-8 rounded-2xl border border-steam-border">
            
            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">1. Introduction</h2>
              <p>
                Welcome to Skinvestments. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you use our web and mobile applications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">2. Data We Collect</h2>
              <p className="mb-4">
                We collect the minimal amount of data necessary to provide, secure, and monetize our services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-steam-secondary">
                <li><strong className="text-steam-text">Account Information:</strong> If you sign up via email, we store your email address and an encrypted password.</li>
                <li><strong className="text-steam-text">Social Login Data:</strong> If you log in via Apple or Google, we receive basic profile information provided by those platforms.</li>
                <li><strong className="text-steam-text">Steam Inventory Data:</strong> When you import your inventory, we access and store your public Steam inventory items to generate valuations and track your portfolio.</li>
                <li><strong className="text-steam-text">Technical & Usage Data:</strong> Our backend provider (Supabase) automatically logs standard connection data for security and performance. This includes your IP address, browser type (User Agent), location (inferred from IP), and login timestamps.</li>
                <li><strong className="text-steam-text">Analytics & Diagnostic Data:</strong> To optimize application performance, we collect anonymous or pseudonymous information about how you interact with the app, device identifiers (e.g., IDFV, Android ID), OS version, and crash reports.</li>
                <li><strong className="text-steam-text">Advertising Data:</strong> In our mobile application, we use mobile advertising identifiers (such as Apple’s IDFA or Google’s Advertising ID) to serve advertisements.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">3. Third-Party Services</h2>
              <p>
                Our application relies on third-party services to function. By using Skinvestments, you acknowledge that data is processed by or fetched from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-steam-secondary mt-2">
                <li><strong className="text-steam-text">Supabase:</strong> Provides our database and authentication infrastructure. They securely store your account credentials and technical logs.</li>
                <li><strong className="text-steam-text">Steam (Valve Corp):</strong> Used for fetching inventory data.</li>
                <li><strong className="text-steam-text">Market Data Providers:</strong> We aggregate non-personal, public pricing data from Steam Community Market, Skinport, and Buff163.</li>
                <li><strong className="text-steam-text">Google LLC (Firebase Analytics & Crashlytics):</strong> Used to understand user behavior and monitor app stability.</li>
                <li><strong className="text-steam-text">Google LLC (AdMob):</strong> Used to serve advertisements within our mobile application. AdMob may collect and process certain data to provide personalized or non-personalized ads.</li>
              </ul>
              <p className="mt-4 text-sm">
                Data processed by Google may be transferred to and stored on servers outside the European Economic Area (EEA). By using the app, you consent to this transfer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">4. Your Data Rights & Opt-Out</h2>
              <p className="mb-4">You have full control over your personal data within our application:</p>
              <ul className="list-disc pl-6 space-y-2 text-steam-secondary">
                <li><strong className="text-steam-text">Right to Erasure:</strong> You can permanently delete your account and all associated portfolio data at any time from your account settings.</li>
                <li><strong className="text-steam-text">Right to Data Portability:</strong> You can export your portfolio and transaction history data in standard formats (e.g., CSV) via the dashboard.</li>
                <li><strong className="text-steam-text">Analytics & Crash Data Opt-Out:</strong> You can disable the sharing of diagnostic and usage data at any time via the toggle located in the app's Settings menu.</li>
                <li><strong className="text-steam-text">Personalized Advertising Opt-Out:</strong> You can opt out of personalized ads by adjusting your device's privacy settings (e.g., turning on "Limit Ad Tracking" on iOS or "Opt out of Ads Personalization" on Android).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-steam-text mb-4">5. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or wish to exercise your data rights, please contact us at: 
                <a href="mailto:kjlabs.studio@gmail.com" className="text-steam-accent hover:underline ml-1">kjlabs.studio@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}