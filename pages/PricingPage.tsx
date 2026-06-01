import React, { useState, useEffect } from 'react';
import { Check, Lock, Sparkles, Infinity } from 'lucide-react';
import {
  SUBSCRIPTION_PLANS,
  type BillingCycle,
  getPlanPriceDisplay,
} from '@/constants/subscriptionPlans';

export const PricingPage: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  return (
    <div className="min-h-screen bg-steam-bg pt-24 sm:pt-32 pb-20 px-4 sm:px-6 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-steam-accent/20 to-purple-500/20 border border-steam-accent/30 text-white text-xs sm:text-sm font-bold mb-8 max-w-full text-center">
            <Sparkles size={16} className="text-yellow-400 shrink-0" />
            <span>One subscription — mobile & web, same account.</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-steam-text mb-4">
            Invest in your <span className="text-steam-accent">inventory</span>
          </h1>
          <p className="text-steam-secondary text-lg max-w-2xl mx-auto">
            Transparent pricing. Pick the plan that fits how you trade and collect.
          </p>
        </div>

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
                    -20%
                  </span>
                )}
                {cycle === 'lifetime' && (
                  <span className="absolute -top-3 -right-4 text-[9px] bg-purple-500 text-steam-text px-1.5 py-0.5 rounded-full font-extrabold transform rotate-12 flex items-center gap-0.5">
                    <Infinity size={8} /> DEAL
                  </span>
                )}
              </button>
            ))}

            <div
              className="absolute top-1.5 bottom-1.5 rounded-lg theme-subtle-strong border border-steam-border/50 transition-all duration-300 ease-in-out w-[calc(33.33%-4px)]"
              style={{
                left:
                  billingCycle === 'monthly'
                    ? '4px'
                    : billingCycle === 'yearly'
                      ? 'calc(33.33% + 2px)'
                      : 'calc(66.66% + 0px)',
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const Icon = plan.icon;
            const { price, period, yearlyNote } = getPlanPriceDisplay(plan.id, billingCycle);
            return (
              <div
                key={plan.id}
                className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col ${
                  plan.highlight
                    ? 'bg-steam-card/80 border-steam-accent shadow-[0_0_40px_rgba(59,130,246,0.1)] md:scale-105 z-10 ring-1 ring-steam-accent/50'
                    : plan.elite
                      ? 'bg-steam-card/80 border-yellow-500/40 ring-1 ring-yellow-500/30'
                      : 'bg-steam-elevated/50 border-steam-border/50 hover:border-steam-border'
                }`}
              >
                {plan.elite && (
                  <div className="absolute -top-4 left-6 px-3 py-1 bg-yellow-500 text-black text-xs font-bold uppercase tracking-widest rounded-full">
                    Elite
                  </div>
                )}
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-steam-accent to-steam-accent-dark text-on-accent text-xs font-bold uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                    <Sparkles size={12} /> Most popular
                  </div>
                )}

                <div className="mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl theme-subtle flex items-center justify-center mb-4 ${plan.color}`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-steam-text">{plan.name}</h3>

                  <div className="mt-2">
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <span className="text-4xl font-bold text-steam-text">{price}</span>
                      <span className="text-steam-tertiary text-sm font-medium">{period}</span>
                    </div>
                    {yearlyNote && (
                      <p className="text-xs text-steam-tertiary mt-1 capitalize">{yearlyNote}</p>
                    )}
                  </div>

                  <p className="text-sm text-steam-secondary mt-4 leading-relaxed">{plan.desc}</p>
                </div>

                {plan.includesLabel && (
                  <p className="text-sm font-semibold text-steam-text mb-3">{plan.includesLabel}</p>
                )}

                <div className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feat) => (
                    <div
                      key={feat.text}
                      className={`flex items-start gap-3 text-sm ${
                        feat.soon ? 'text-steam-tertiary' : 'text-steam-secondary'
                      }`}
                    >
                      <div
                        className={`p-1 rounded-full mt-0.5 shrink-0 ${
                          plan.highlight ? 'bg-steam-accent/20 text-steam-accent' : 'bg-green-500/10 text-green-500'
                        }`}
                      >
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span>
                        {feat.text}
                        {feat.soon && (
                          <span className="ml-2 inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/15 text-red-400 border border-red-500/25">
                            Soon
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.footnote && (
                  <p className="flex items-start gap-2 text-xs text-steam-tertiary leading-snug">
                    <Lock size={12} className="shrink-0 mt-0.5 opacity-70" />
                    {plan.footnote}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center border-t border-steam-border/50 pt-10">
          <p className="text-steam-secondary text-sm flex items-center justify-center gap-1.5 flex-wrap">
            <Lock size={14} className="opacity-70" />
            Payments are secure and encrypted. Cancel anytime from Settings.
          </p>
        </div>
      </div>
    </div>
  );
};
