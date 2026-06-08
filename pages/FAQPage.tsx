import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

interface FaqSection {
  title: string;
  items: FaqItem[];
}

const FAQ_SECTIONS: FaqSection[] = [
  {
    title: 'Security & Steam',
    items: [
      {
        question: 'Do you need my Steam password?',
        answer:
          'No. We use the public Steam Inventory API and only need your Steam ID or profile URL to fetch inventory data. We will never ask for your password, Steam Guard codes, or trading credentials.',
      },
      {
        question: 'Is it safe to link my account?',
        answer:
          'Yes. We only access read-only public inventory data. Skinvestments cannot trade, sell, or modify items on your account.',
      },
      {
        question: 'Which markets do you use for pricing?',
        answer:
          'We aggregate public market data from Steam Community Market, Skinport, and Buff163 to estimate item values. Prices are indicative — always verify before making trades.',
      },
    ],
  },
  {
    title: 'Plans & Billing',
    items: [
      {
        question: 'What subscription plans are available?',
        answer: (
          <>
            We offer three tiers: <strong className="text-steam-text">Starter (free)</strong>,{' '}
            <strong className="text-steam-text">Pro</strong>, and{' '}
            <strong className="text-steam-text">Pro Max</strong>. See full details on our{' '}
            <Link to="/pricing" className="text-steam-accent hover:underline">
              Pricing
            </Link>{' '}
            page.
          </>
        ),
      },
      {
        question: 'Why does the free plan show ads?',
        answer:
          'Starter (free) includes ads in the web dashboard to keep the tier free. Pro and Pro Max remove AdSense advertising. You can upgrade anytime from Settings → Manage Subscription.',
      },
      {
        question: 'Can I use the same account on mobile and web?',
        answer:
          'Yes. One Skinvestments account works across the mobile app and the web dashboard. Your subscription applies to both when purchased through our billing system.',
      },
      {
        question: 'How do I upgrade or manage my subscription?',
        answer: (
          <>
            Sign in, go to <strong className="text-steam-text">Settings → Manage Subscription</strong>, and
            choose a plan. Paid checkout is handled securely via RevenueCat. Questions about billing?{' '}
            <Link to="/contact" className="text-steam-accent hover:underline">
              Contact us
            </Link>
            .
          </>
        ),
      },
    ],
  },
  {
    title: 'Web Dashboard',
    items: [
      {
        question: 'How do I access the web dashboard?',
        answer: (
          <>
            Create an account or sign in, then open{' '}
            <Link to="/panel" className="text-steam-accent hover:underline">
              Dashboard
            </Link>
            . You can track portfolio value, inventory, transaction history, and analytics from your browser.
          </>
        ),
      },
      {
        question: 'What is included in Analytics?',
        answer:
          'Analytics includes portfolio breakdowns, allocation charts, drop performance, stagnation detection, and more. Some advanced views (e.g. Drops Performance, Stagnation Detector) require a Pro or Pro Max plan.',
      },
      {
        question: 'Can I export my data?',
        answer:
          'Pro and Pro Max include custom transaction exports. Portfolio and history features are available from the dashboard depending on your plan limits.',
      },
    ],
  },
  {
    title: 'Data & Features',
    items: [
      {
        question: 'How often are prices updated?',
        answer:
          'Price refresh frequency depends on your plan and data source. We sync with market APIs to keep valuations current; exact intervals may vary by provider and load. Treat displayed prices as estimates, not live trade quotes.',
      },
      {
        question: 'Does this work with Storage Units?',
        answer:
          'Yes. Our system can include storage unit contents when configured, so hidden investments inside units can be tracked alongside your main inventory.',
      },
      {
        question: 'How do I get support?',
        answer: (
          <>
            Email us at{' '}
            <a href="mailto:kjlabs.studio@gmail.com" className="text-steam-accent hover:underline">
              kjlabs.studio@gmail.com
            </a>{' '}
            or visit{' '}
            <Link to="/contact" className="text-steam-accent hover:underline">
              Contact
            </Link>
            . Pro Max subscribers get priority support.
          </>
        ),
      },
    ],
  },
];

export const FAQPage: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const [openKey, setOpenKey] = useState<string | null>('0-0');

  const toggle = (sectionIdx: number, itemIdx: number) => {
    const key = `${sectionIdx}-${itemIdx}`;
    setOpenKey(openKey === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-steam-bg pt-24 sm:pt-32 pb-20 px-4 sm:px-6 overflow-x-hidden">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-steam-accent/10 border border-steam-accent/20 text-steam-accent text-xs font-bold uppercase tracking-widest mb-4">
            <HelpCircle size={14} /> FAQ
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-steam-text mb-6">
            Frequently Asked <span className="text-steam-accent">Questions</span>
          </h1>
          <p className="text-steam-secondary text-lg">
            Security, subscriptions, the web dashboard, and how Skinvestments works.
          </p>
        </div>

        <div className="space-y-10">
          {FAQ_SECTIONS.map((section, sectionIdx) => (
            <div key={section.title}>
              <h2 className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-4 pl-1">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((faq, itemIdx) => {
                  const key = `${sectionIdx}-${itemIdx}`;
                  const isOpen = openKey === key;

                  return (
                    <div
                      key={key}
                      onClick={() => toggle(sectionIdx, itemIdx)}
                      className={`group rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                        isOpen
                          ? 'bg-steam-card border-steam-accent/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                          : 'bg-steam-elevated/50 border-steam-border/50 hover:border-steam-border'
                      }`}
                    >
                      <div className="p-6 flex justify-between items-start gap-4">
                        <h3
                          className={`font-bold text-base sm:text-lg leading-snug ${
                            isOpen ? 'text-steam-text' : 'text-steam-secondary'
                          }`}
                        >
                          {faq.question}
                        </h3>
                        <ChevronDown
                          className={`shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-steam-accent' : 'text-steam-tertiary'
                          }`}
                        />
                      </div>
                      <div
                        className={`px-6 text-steam-secondary leading-relaxed overflow-hidden transition-all duration-300 ${
                          isOpen ? 'max-h-[28rem] pb-6 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        {faq.answer}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-steam-border/50 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 rounded-xl theme-subtle">
            <Lock className="w-8 h-8 text-steam-accent mx-auto mb-3" />
            <div className="font-bold text-steam-text">Read-Only Access</div>
          </div>
          <div className="p-4 rounded-xl theme-subtle">
            <ShieldCheck className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <div className="font-bold text-steam-text">No Passwords</div>
          </div>
          <div className="p-4 rounded-xl theme-subtle">
            <HelpCircle className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <div className="font-bold text-steam-text">24/7 Support</div>
          </div>
        </div>

        <p className="text-center text-sm text-steam-tertiary mt-8">
          Still have questions?{' '}
          <Link to="/contact" className="text-steam-accent hover:underline font-medium">
            Get in touch
          </Link>
        </p>
      </div>
    </div>
  );
};
