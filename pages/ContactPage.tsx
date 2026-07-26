import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Activity, HelpCircle } from 'lucide-react';
import { SocialLinks } from '@/components/SocialLinks';
import { usePageSeo } from '@/hooks/usePageSeo';
import { PAGE_SEO } from '@/utils/seo';

const SUPPORT_EMAIL = 'kjlabs.studio@gmail.com';

const TOPICS = [
  {
    title: 'Account & Steam sync',
    body: 'Public inventory import, linking issues, or questions about what data we store.',
  },
  {
    title: 'Billing & subscriptions',
    body: 'Plan changes, App Store / Play billing, or dashboard access on Pro plans.',
  },
  {
    title: 'Privacy requests',
    body: 'Data export, deletion requests, or cookie / advertising preferences.',
  },
  {
    title: 'Partnerships & press',
    body: 'Collaboration ideas, affiliate inquiries, or product coverage.',
  },
];

export const ContactPage: React.FC = () => {
  usePageSeo(PAGE_SEO.contact);

  return (
    <div className="min-h-screen bg-steam-bg pt-24 sm:pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: 'perspective(1000px) rotateX(20deg)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-steam-bg via-transparent to-steam-bg" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-10 items-start">
        <div className="space-y-12 lg:sticky lg:top-32">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-steam-text mb-6 leading-tight">
              Contact Skinvestments
            </h1>
            <p className="text-steam-secondary text-lg leading-relaxed max-w-md">
              Email is the fastest way to reach us. We typically reply within a few hours on business
              days. For product background, see{' '}
              <Link to="/about" className="text-steam-accent hover:underline">
                About
              </Link>{' '}
              or browse the{' '}
              <Link to="/faq" className="text-steam-accent hover:underline">
                FAQ
              </Link>
              .
            </p>
          </div>

          <div className="max-w-md space-y-8">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="block bg-steam-card/50 p-5 rounded-xl border border-steam-border/50 hover:border-steam-accent/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg theme-subtle flex items-center justify-center text-steam-accent mb-4">
                <Mail />
              </div>
              <div className="text-xs font-bold text-steam-tertiary uppercase tracking-wider mb-1">
                Email Support
              </div>
              <div className="text-lg font-bold text-steam-accent break-all mb-1">{SUPPORT_EMAIL}</div>
              <div className="text-sm text-steam-tertiary">Typical reply: under 2 hours</div>
            </a>

            <div>
              <p className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-3">
                Follow us
              </p>
              <SocialLinks />
            </div>
          </div>

          <div className="bg-steam-card/50 border border-steam-border/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="text-steam-secondary" size={20} />
              <span className="text-sm font-bold text-steam-text uppercase tracking-wider">
                System Status
              </span>
              <span className="ml-auto flex items-center gap-1.5 text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> ALL SYSTEMS
                OPERATIONAL
              </span>
            </div>
            <div className="space-y-3">
              <StatusItem label="Steam Inventory API" status="online" />
              <StatusItem label="Web Application" status="online" />
            </div>
          </div>
        </div>

        <div className="relative lg:mt-12">
          <div className="bg-steam-card/95 backdrop-blur-xl border border-steam-border rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="text-steam-accent" size={22} />
              <h2 className="text-2xl font-bold text-steam-text font-display">What to include</h2>
            </div>
            <p className="text-steam-secondary mb-8 leading-relaxed">
              Send a short description of the issue or request. If it is account-related, include the
              email on your Skinvestments account (never your Steam password).
            </p>
            <ul className="space-y-5 mb-10">
              {TOPICS.map((topic) => (
                <li key={topic.title} className="border-b border-steam-border/40 pb-5 last:border-0 last:pb-0">
                  <h3 className="font-bold text-steam-text mb-1">{topic.title}</h3>
                  <p className="text-sm text-steam-tertiary leading-relaxed">{topic.body}</p>
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Skinvestments%20support`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-steam-accent hover:brightness-110 text-white font-bold rounded-xl shadow-lg theme-shadow-accent transition-all"
            >
              <Mail size={18} />
              Email {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusItem: React.FC<{ label: string; status: 'online' | 'offline' }> = ({ label, status }) => (
  <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-steam-hover transition-colors">
    <span className="text-steam-secondary">{label}</span>
    <div className="flex items-center gap-2">
      <span
        className={`text-xs font-bold uppercase ${status === 'online' ? 'text-green-500' : 'text-red-500'}`}
      >
        {status === 'online' ? 'Operational' : 'Down'}
      </span>
      <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
    </div>
  </div>
);
