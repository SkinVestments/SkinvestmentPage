import React, { useState, useEffect } from 'react';
import { Check, X, Zap, Crown, Shield, Sparkles, Infinity } from 'lucide-react';

type BillingCycle = 'monthly' | 'yearly' | 'lifetime';

export const PricingPage: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0), []);
  
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');

  // Funkcja pomocnicza do wyświetlania okresu rozliczeniowego
  const getPeriodLabel = () => {
    switch (billingCycle) {
      case 'monthly': return '/mo';
      case 'yearly': return '/yr';
      case 'lifetime': return 'one-time';
    }
  };

  const plans = [
    {
      name: "Basic",
      price: { monthly: "€0", yearly: "€0", lifetime: "€0" },
      desc: "Perfect for casual players tracking drops.",
      icon: Shield,
      features: ["Steam Inventory Tracking", "Weekly Drop Timer", "Basic Portfolio Value", "24h Price Updates", "1 Storage Unit"],
      notIncluded: ["Real-time Volatility", "Stagnation Detector", "Multi-Market Prices", "API Access"],
      color: "text-steam-secondary",
      cta: "Start Free",
      highlight: false
    },
    {
      name: "Pro",
      price: { monthly: "€4.99", yearly: "€49.90", lifetime: "€299.00" },
      desc: "For serious flippers and investors.",
      icon: Zap,
      features: ["Everything in Basic", "Multi-Market Aggregation", "The Portfolio Pulse (Live)", "Grail Watcher", "Stagnation Detector", "Unlimited Storage Units"],
      notIncluded: ["Private API Access", "Priority Support"],
      color: "text-steam-accent",
      cta: "Start 7-Day Free Trial",
      subCta: "No credit card required",
      highlight: true
    },
    {
      name: "Pro Max",
      price: { monthly: "€8.99", yearly: "€89.90", lifetime: "€399.00" },
      desc: "Institutional grade tools & API access.",
      icon: Crown,
      features: ["Everything in Pro", "Private API Access", "CSV/Excel Exports", "Priority Support", "Early Access to Beta Features", "Whale Discord Role"],
      notIncluded: [],
      color: "text-yellow-500",
      cta: "Get Pro Max",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-steam-bg pt-24 sm:pt-32 pb-20 px-4 sm:px-6 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Trial Banner */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-steam-accent/20 to-purple-500/20 border border-steam-accent/30 text-white text-xs sm:text-sm font-bold mb-8 animate-pulse max-w-full text-center">
            <Sparkles size={16} className="text-yellow-400 shrink-0" />
            <span>Try PRO features for 7 days — No credit card needed.</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-steam-text mb-4">
            Invest in your <span className="text-steam-accent">Inventory</span>
          </h1>
          <p className="text-steam-secondary text-lg max-w-2xl mx-auto">
            Transparent pricing. Choose the plan that fits your trading style.
          </p>
        </div>

        {/* Billing Switcher */}
        <div className="flex justify-center mb-16 px-1">
          <div className="bg-steam-card p-1.5 rounded-xl border border-steam-border flex relative w-full max-w-md sm:max-w-none sm:w-auto">
            {(['monthly', 'yearly', 'lifetime'] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`relative z-10 flex-1 sm:flex-none px-3 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 capitalize ${
                  billingCycle === cycle 
                    ? 'text-steam-text shadow-lg' 
                    : 'text-steam-tertiary hover:text-steam-secondary'
                }`}
              >
                {cycle}
                {cycle === 'yearly' && (
                  <span className="absolute -top-3 -right-2 text-[9px] bg-green-500 text-black px-1.5 py-0.5 rounded-full font-extrabold transform rotate-12">
                    -15%
                  </span>
                )}
                {cycle === 'lifetime' && (
                  <span className="absolute -top-3 -right-4 text-[9px] bg-purple-500 text-steam-text px-1.5 py-0.5 rounded-full font-extrabold transform rotate-12 flex items-center gap-0.5">
                    <Infinity size={8} /> DEAL
                  </span>
                )}
              </button>
            ))}
            
            {/* Sliding Background */}
            <div 
              className={`absolute top-1.5 bottom-1.5 rounded-lg theme-subtle-strong border border-steam-border/50 transition-all duration-300 ease-in-out w-[calc(33.33%-4px)]`}
              style={{
                left: billingCycle === 'monthly' ? '4px' : billingCycle === 'yearly' ? 'calc(33.33% + 2px)' : 'calc(66.66% + 0px)'
              }}
            />
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col ${
                plan.highlight 
                  ? 'bg-steam-card/80 border-steam-accent shadow-[0_0_40px_rgba(59,130,246,0.1)] md:scale-105 z-10 ring-1 ring-steam-accent/50' 
                  : 'bg-steam-elevated/50 border-steam-border/50 hover:border-steam-border'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-steam-accent to-steam-accent-dark text-on-accent text-xs font-bold uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                  <Sparkles size={12} /> Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <div className={`w-12 h-12 rounded-xl theme-subtle flex items-center justify-center mb-4 ${plan.color}`}>
                  <plan.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-steam-text">{plan.name}</h3>
                
                {/* Price Display */}
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold text-steam-text">{plan.price[billingCycle]}</span>
                  {plan.name !== "Basic" && (
                    <span className="text-steam-tertiary text-sm font-medium">{getPeriodLabel()}</span>
                  )}
                </div>
                
                {/* Yearly Savings Text */}
                {billingCycle === 'yearly' && plan.name !== "Basic" && (
                  <div className="text-xs text-green-400 mt-1 font-bold">
                    Save ~17% vs Monthly
                  </div>
                )}
                 {billingCycle === 'lifetime' && plan.name !== "Basic" && (
                  <div className="text-xs text-purple-400 mt-1 font-bold">
                    Pay once, own forever
                  </div>
                )}

                <p className="text-sm text-steam-secondary mt-4 leading-relaxed">{plan.desc}</p>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-steam-secondary">
                    <div className={`p-1 rounded-full mt-0.5 shrink-0 ${plan.highlight ? 'bg-steam-accent/20 text-steam-accent' : 'bg-green-500/10 text-green-500'}`}>
                      <Check size={10} strokeWidth={3} />
                    </div>
                    {feat}
                  </div>
                ))}
                {plan.notIncluded.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-steam-tertiary">
                    <div className="p-1 rounded-full theme-subtle shrink-0"><X size={10} /></div>
                    {feat}
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-auto">
                <button className={`w-full py-4 rounded-xl font-bold transition-all text-sm uppercase tracking-wider ${
                  plan.highlight 
                    ? 'bg-steam-accent hover:opacity-90 text-white shadow-lg theme-shadow-accent' 
                    : 'theme-subtle hover:bg-steam-hover text-steam-text border border-steam-border/50'
                }`}>
                  {plan.cta}
                </button>
                {plan.subCta && (
                  <div className="text-center text-[10px] text-steam-tertiary mt-3 font-medium uppercase tracking-wide">
                    {plan.subCta}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Teaser / Guarantee */}
        <div className="mt-20 text-center border-t border-steam-border/50 pt-10">
          <p className="text-steam-secondary text-sm">
            Unsure? <span className="text-steam-text font-bold">Start with the 7-day free trial.</span> 
            You can cancel anytime from your dashboard. 
            <br className="hidden md:block"/> 
            For Lifetime plans, we offer a 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
};