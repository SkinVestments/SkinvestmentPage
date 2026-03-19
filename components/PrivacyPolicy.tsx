import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-[#0B0D12] relative">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-steam-accent/10 rounded-lg">
                <Shield className="w-8 h-8 text-steam-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-display">Privacy Policy</h1>
        </div>
        
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-sans">
          <p className="text-xl text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8 bg-[#161B24] p-8 rounded-2xl border border-white/10">
            
            {/* 1. INTRODUCTION */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p>
                Welcome to Skinvestments. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when you visit and use our application.
              </p>
            </section>

            {/* 2. DATA WE COLLECT */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
              <p className="mb-4">
                We collect minimal data necessary to provide and improve our services. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-400">
                <li><strong className="text-white">Account Information:</strong> We store your email address and authentication credentials securely via Supabase Auth.</li>
                <li><strong className="text-white">Inventory Data:</strong> We access your public Steam inventory data to generate valuations.</li>
                <li><strong className="text-white">Pricing Data:</strong> We do not store personal pricing data but aggregate public market data from providers like Steam, Skinport, and Buff.</li>
                
                {/* NOWE: Analytics & Diagnostics */}
                <li><strong className="text-white">Analytics & Usage Data:</strong> To optimize application performance, we collect anonymous or pseudonymous information about how you interact with the app, device identifiers (e.g., IDFV, Android ID), OS version, and approximate location based on IP.</li>
                <li><strong className="text-white">Diagnostic & Crash Data:</strong> In the event of an app crash, technical reports (stack traces, device state) are sent to our servers. These reports may contain your unique User ID to help us resolve issues associated with your specific account faster.</li>
              </ul>
            </section>

            {/* 3. THIRD-PARTY SERVICES */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Services & Data Processors</h2>
              <p>
                Our application aggregates data from multiple sources and uses third-party processors to provide a stable experience. By using our service, you acknowledge our use of:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400 mt-4">
                <li><strong className="text-white">Steam Community Market, Skinport API, Buff163</strong> (for aggregated market data)</li>
                <li><strong className="text-white">Supabase</strong> (for user authentication and database sync)</li>
                
                {/* NOWE: Google LLC (Firebase) */}
                <li>
                  <strong className="text-white">Google LLC (Firebase Analytics & Crashlytics):</strong> Used to understand user behavior and monitor app stability. Data processed by Google may be transferred to and stored on servers outside the European Economic Area (EEA). By using the app, you consent to this transfer.
                </li>
              </ul>
            </section>

            {/* NOWE: 4. USER RIGHTS & OPT-OUT */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Your Rights & Opt-Out</h2>
              <p>
                Under the General Data Protection Regulation (GDPR) and other applicable privacy laws, you have the right to access, rectify, or erase your personal data. 
              </p>
              <p className="mt-2">
                You also have the right to <strong className="text-white">opt-out</strong> of analytics and crash data collection. You can disable the sharing of diagnostic and usage data at any time via the toggle located in the app's Settings menu.
              </p>
            </section>

            {/* 5. CONTACT US */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, GDPR compliance, or your data, please contact us at: 
                <a href="mailto:kjlabs.studio@gmail.com" className="text-steam-accent hover:text-blue-400 transition-colors font-bold ml-2">
                  kjlabs.studio@gmail.com
                </a>
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};