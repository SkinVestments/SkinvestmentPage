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
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p>
                Welcome to Skinvestments. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when you visit our application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
              <p className="mb-4">
                We collect minimal data necessary to provide our services. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li><strong className="text-white">Account Information:</strong> We store your email address and authentication credentials securely via Supabase Auth.</li>
                <li><strong className="text-white">Inventory Data:</strong> We access your public Steam inventory data to generate valuations.</li>
                <li><strong className="text-white">Pricing Data:</strong> We do not store personal pricing data but aggregate public market data from providers like Steam, Skinport, and Buff.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Services & Data</h2>
              <p>
                Our application aggregates data from multiple sources to provide accurate valuations. By using our service, you acknowledge that we fetch non-personal market data from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400 mt-2">
                <li><strong className="text-white">Steam Community Market</strong></li>
                <li><strong className="text-white">Skinport API</strong></li>
                <li><strong className="text-white">Buff163 (Aggregated)</strong></li>
                <li><strong className="text-white">Supabase</strong> (for user authentication and sync)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at: 
                <a href="mailto:privacy@skinvestment.app" className="text-steam-accent hover:underline ml-1">privacy@skinvestment.app</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};