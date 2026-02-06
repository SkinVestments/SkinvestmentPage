import React, { useEffect } from 'react';
import { Check, X, Zap, Crown, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const plans = [
    {
      name: "Rookie",
      price: "Free",
      desc: "Perfect for casual players tracking drops.",
      icon: Shield,
      features: ["Steam Inventory Tracking", "Weekly Drop Timer", "Basic Portfolio Value", "24h Price Updates", "1 Storage Unit"],
      notIncluded: ["Real-time Volatility", "Stagnation Detector", "Multi-Market Prices"],
      color: "text-gray-400",
      cta: "Start Free",
      popular: false
    },
    {
      name: "Trader",
      price: "$4.99",
      period: "/mo",
      desc: "For serious flippers and investors.",
      icon: Zap,
      features: ["Everything in Rookie", "Multi-Market Aggregation", "The Portfolio Pulse (Live)", "Grail Watcher", "Stagnation Detector", "Unlimited Storage Units"],
      notIncluded: [],
      color: "text-steam-accent",
      cta: "Go Pro",
      popular: true
    },
    {
      name: "Whale",
      price: "$19.99",
      period: "/mo",
      desc: "Institutional grade tools & API access.",
      icon: Crown,
      features: ["Everything in Trader", "CSV/Excel Exports", "Priority Support", "Early Access to Beta Features", "Whale Discord Role"],
      notIncluded: [],
      color: "text-yellow-500",
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0D12] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold font-display text-white mb-4">
            Invest in your <span className="text-steam-accent">Inventory</span>
          </h1>
          <p className="text-steam-secondary text-lg">Transparent pricing. No hidden fees. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div key={idx} className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col ${plan.popular ? 'bg-[#161B24]/80 border-steam-accent shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-105 z-10' : 'bg-[#12161E]/50 border-white/5 hover:border-white/10'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-steam-accent text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${plan.color}`}>
                  <plan.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 text-sm">{plan.period}</span>}
                </div>
                <p className="text-sm text-gray-400 mt-2">{plan.desc}</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="p-1 rounded-full bg-green-500/10 text-green-500"><Check size={10} strokeWidth={3} /></div>
                    {feat}
                  </div>
                ))}
                {plan.notIncluded.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="p-1 rounded-full bg-white/5"><X size={10} /></div>
                    {feat}
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-steam-accent hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};