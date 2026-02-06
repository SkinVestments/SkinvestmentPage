import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, HelpCircle, ChevronDown } from 'lucide-react';

export const FAQPage: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0), []);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Do you need my Steam Password?",
      answer: "Absolutely not. We use the public Steam Inventory API. We only need your Steam ID64 (which is public information) to fetch your inventory data. We will NEVER ask for your password or trading credentials."
    },
    {
      question: "Is it safe to link my account?",
      answer: "Yes. Since we only use read-only public data, there is zero risk to your items. We cannot trade, sell, or modify your inventory in any way."
    },
    {
      question: "How often are prices updated?",
      answer: "For Free users, prices refresh every 24 hours. For 'Trader' and 'Whale' tiers, we sync with market APIs (Buff163, Skinport) every 15 minutes to give you live volatility data."
    },
    {
      question: "Does this work with Storage Units?",
      answer: "Yes! Our algorithm detects storage units and can scan their contents if you provide the specific Unit ID, allowing you to track hidden investments."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0D12] pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest mb-4">
            <ShieldCheck size={14} /> Security First
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">
            Trust & <span className="text-steam-accent">Security</span>
          </h1>
          <p className="text-steam-secondary text-lg">
            Your inventory is your asset. We treat it with bank-grade security protocols.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className={`group rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                openIndex === idx 
                  ? 'bg-[#161B24] border-steam-accent/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                  : 'bg-[#12161E]/50 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="p-6 flex justify-between items-center">
                <h3 className={`font-bold text-lg ${openIndex === idx ? 'text-white' : 'text-gray-300'}`}>
                  {faq.question}
                </h3>
                <ChevronDown 
                  className={`transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-steam-accent' : 'text-gray-500'}`} 
                />
              </div>
              <div 
                className={`px-6 text-gray-400 leading-relaxed overflow-hidden transition-all duration-300 ${
                  openIndex === idx ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
             <div className="p-4 rounded-xl bg-white/5">
                <Lock className="w-8 h-8 text-steam-accent mx-auto mb-3" />
                <div className="font-bold text-white">Read-Only Access</div>
             </div>
             <div className="p-4 rounded-xl bg-white/5">
                <ShieldCheck className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <div className="font-bold text-white">No Passwords</div>
             </div>
             <div className="p-4 rounded-xl bg-white/5">
                <HelpCircle className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <div className="font-bold text-white">24/7 Support</div>
             </div>
        </div>
      </div>
    </div>
  );
};