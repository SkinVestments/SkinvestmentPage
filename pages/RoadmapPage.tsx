import React, { useEffect } from 'react';
import { CheckCircle2, Circle, GitCommit, Rocket } from 'lucide-react';
import { usePageSeo } from '@/hooks/usePageSeo';
import { PAGE_SEO } from '@/utils/seo';

export const RoadmapPage: React.FC = () => {
  usePageSeo(PAGE_SEO.roadmap);
  useEffect(() => window.scrollTo(0, 0), []);

  const milestones = [
    {
      date: 'Q3 2025',
      title: 'Project Inception',
      desc: 'Core engine development and connection with Steam Inventory API.',
      status: 'completed',
    },
    {
      date: 'Q4 2025',
      title: 'Beta Launch v0.5',
      desc: 'First 100 users. Basic portfolio tracking and valuation.',
      status: 'completed',
    },
    {
      date: 'Q1 2026',
      title: 'Multi-Market Aggregation',
      desc: 'Integration with Skinport and Buff163 for real market prices alongside Steam.',
      status: 'completed',
    },
    {
      date: 'Q2 2026',
      title: 'Public Launch v1.0',
      desc: 'Web dashboard, Portfolio Pulse, Stagnation Detector, subscriptions, and mobile apps.',
      status: 'completed',
    },
    {
      date: 'Jul 2026',
      title: 'Skinvestments Journal',
      desc: 'Public blog with SEO, feature images, and CS2 portfolio insights for players and investors.',
      status: 'completed',
    },
    {
      date: 'NEXT',
      title: 'Weekly Drop Scanner',
      desc: 'Scan and surface weekly CS2 drops across your inventory — faster logging, clearer drop history.',
      status: 'active',
    },
    {
      date: 'Q3 2026',
      title: 'New Price Providers',
      desc: 'Add more market data sources beyond Steam, Skinport, and Buff163 for broader and more reliable pricing coverage.',
      status: 'upcoming',
    },
    {
      date: 'Q3 2026',
      title: 'Advanced Charts',
      desc: 'New portfolio charts and widgets for deeper performance, allocation, and trend views.',
      status: 'upcoming',
    },
    {
      date: 'Q4 2026',
      title: 'AI Insights',
      desc: 'AI-assisted portfolio insights — spotlight stagnant positions, unusual moves, and market context.',
      status: 'upcoming',
    },
  ];

  return (
    <div className="min-h-screen bg-steam-bg pt-24 sm:pt-32 pb-20 px-4 sm:px-6 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-4">
            <GitCommit size={14} /> Changelog
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-steam-text mb-6">
            Building the <br/><span className="text-steam-accent">Future of Trading</span>
          </h1>
        </div>

        <div className="relative">
          {/* Vertical Neon Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-steam-accent via-purple-500 to-gray-800 opacity-30 md:-translate-x-1/2"></div>

          <div className="space-y-12">
            {milestones.map((item, idx) => (
              <div key={idx} className={`relative flex flex-col md:flex-row gap-8 items-start md:items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Content Card */}
                <div className="flex-1 w-full pl-12 md:pl-0">
                  <div className={`p-6 rounded-2xl border transition-all duration-500 group hover:scale-[1.02] ${
                    item.status === 'active' 
                      ? 'bg-steam-card border-steam-accent shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
                      : 'bg-steam-elevated/50 border-steam-border/50 hover:border-steam-border'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold uppercase tracking-widest ${
                        item.status === 'active' ? 'text-steam-accent' : 'text-steam-tertiary'
                      }`}>{item.date}</span>
                      {item.status === 'active' && (
                        <span className="animate-pulse text-[10px] bg-steam-accent px-2 rounded text-white font-bold">
                          NEXT UP
                        </span>
                      )}
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${item.status === 'upcoming' ? 'text-steam-secondary' : 'text-steam-text'}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-steam-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                {/* Center Node */}
                <div className="absolute left-[20px] md:left-1/2 w-10 h-10 -translate-x-1/2 flex items-center justify-center z-10">
                  <div className={`w-4 h-4 rounded-full border-4 transition-all duration-500 ${
                    item.status === 'completed' ? 'bg-steam-accent border-steam-bg shadow-[0_0_15px_#3b82f6]' :
                    item.status === 'active' ? 'bg-steam-card border-steam-accent scale-125 shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_40%,transparent)]' :
                    'bg-steam-bg border-steam-border'
                  }`}></div>
                </div>

                {/* Empty spacer for opposite side (Desktop only) */}
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};