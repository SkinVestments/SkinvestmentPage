import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p>
                Welcome to Skinvestments. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you use our application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
              <p className="mb-4">
                We collect the minimal amount of data necessary to provide and secure our services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li><strong className="text-white">Account Information:</strong> If you sign up via email, we store your email address and an encrypted password.</li>
                <li><strong className="text-white">Social Login Data:</strong> If you log in via Google or Steam, we receive basic public profile information (such as your display name, avatar, and Steam ID) provided by those platforms.</li>
                <li><strong className="text-white">Steam Inventory Data:</strong> When you import your inventory, we access and store your public Steam inventory items to generate valuations and track your portfolio.</li>
                <li><strong className="text-white">Technical & Usage Data:</strong> Our backend provider (Supabase) automatically logs standard connection data for security and performance. This includes your IP address, browser type (User Agent), location (inferred from IP), and login timestamps.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Services</h2>
              <p>
                Our application relies on third-party services to function. By using Skinvestments, you acknowledge that data is processed by or fetched from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400 mt-2">
                <li><strong className="text-white">Supabase:</strong> Provides our database and authentication infrastructure. They securely store your account credentials and technical logs.</li>
                <li><strong className="text-white">Steam (Valve Corp):</strong> Used for Steam OpenID authentication and fetching inventory data.</li>
                <li><strong className="text-white">Google:</strong> Used for OAuth authentication if you choose to sign in with Google.</li>
                <li><strong className="text-white">Market Data Providers:</strong> We aggregate non-personal, public pricing data from Steam Community Market, Skinport, and Buff163 to evaluate your portfolio.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Your Data Rights</h2>
              <p className="mb-4">You have full control over your personal data within our application:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li><strong className="text-white">Right to Erasure:</strong> You can permanently delete your account and all associated portfolio data at any time from your account settings.</li>
                <li><strong className="text-white">Right to Data Portability:</strong> You can export your portfolio and transaction history data in standard formats (e.g., CSV) via the dashboard.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
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