import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsAndConditionsPage() {
  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-[#0B0D12] relative">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-steam-accent/10 rounded-lg">
                <FileText className="w-8 h-8 text-steam-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-display">Terms & Conditions</h1>
        </div>
        
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-sans">
          <p className="text-xl text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8 bg-[#161B24] p-8 rounded-2xl border border-white/10">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Skinvestments ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p>
                Skinvestments is a portfolio tracking and analytics tool designed for Counter-Strike 2 (CS2) virtual items. We provide estimated valuations based on aggregated data from third-party marketplaces. 
              </p>
              <p className="mt-2 text-yellow-500 font-medium">
                Disclaimer: We do not provide financial, investment, or legal advice. The virtual item market is highly volatile, and past performance is not indicative of future results.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Data Accuracy</h2>
              <p>
                While we strive to provide accurate and up-to-date pricing data, we do not guarantee the accuracy, completeness, or timeliness of any market data displayed. Prices can fluctuate rapidly, and discrepancies between our platform and actual marketplace prices may occur. You assume all risks associated with trading or investing based on our data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. User Accounts</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You must not use the Service for any illegal or unauthorized purpose.</li>
                <li>We reserve the right to suspend or terminate your account at any time if you violate these terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property & Affiliation</h2>
              <p>
                Skinvestments is an independent service and is <strong className="text-white">not affiliated with, endorsed by, or sponsored by Valve Corporation or Steam.</strong> 
                Counter-Strike, CS2, and all related in-game items, images, and assets are trademarks and/or registered trademarks of Valve Corporation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Skinvestments and its operators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the Service, including but not limited to financial losses incurred through virtual item trading.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Contact</h2>
              <p>
                For any questions regarding these Terms, please contact us at: 
                <a href="mailto:support@skinvestment.app" className="text-steam-accent hover:underline ml-1">support@skinvestment.app</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}