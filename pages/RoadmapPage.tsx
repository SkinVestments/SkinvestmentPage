import React, { useEffect } from 'react';
import { CheckCircle2, Circle, GitCommit, Rocket } from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const milestones = [
    {
      date: "Q3 2025",
      title: "Project Inception",
      desc: "Core engine development and connection with Steam Inventory API.",
      status: "completed"
    },
    {
      date: "Q4 2025",
      title: "Beta Launch v0.5",
      desc: "First 100 users. Basic portfolio tracking and valuation.",
      status: "completed"
    },
    {
      date: "Q1 2026",
      title: "Multi-Market Aggregation",
      desc: "Integration with Skinport for real cash prices.",
      status: "completed"
    },
    {
      date: "NOW",
      title: "Public Launch v1.0",
      desc: "Portfolio Pulse, Stagnation Detector, and Mobile Widgets.",
      status: "active"
    },
    {
      date: "Q3 2026",
      title: "AI Price Prediction",
      desc: "Machine Learning models to predict trend reversals based on market volume.",
      status: "upcoming"
    },
    {
      date: "Q4 2026",
      title: "Wearables & App",
      desc: "Native iOS/Android App and Apple Watch complications.",
      status: "upcoming"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0D12] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-4">
            <GitCommit size={14} /> Changelog
          </div>
          <h1 className="text-5xl font-bold font-display text-white mb-6">
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
                      ? 'bg-[#161B24] border-steam-accent shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
                      : 'bg-[#12161E]/50 border-white/5 hover:border-white/10'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold uppercase tracking-widest ${
                        item.status === 'active' ? 'text-steam-accent' : 'text-gray-500'
                      }`}>{item.date}</span>
                      {item.status === 'active' && <span className="animate-pulse text-[10px] bg-steam-accent px-2 rounded text-white font-bold">CURRENT</span>}
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${item.status === 'upcoming' ? 'text-gray-400' : 'text-white'}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                {/* Center Node */}
                <div className="absolute left-[20px] md:left-1/2 w-10 h-10 -translate-x-1/2 flex items-center justify-center z-10">
                  <div className={`w-4 h-4 rounded-full border-4 transition-all duration-500 ${
                    item.status === 'completed' ? 'bg-steam-accent border-[#0B0D12] shadow-[0_0_15px_#3b82f6]' :
                    item.status === 'active' ? 'bg-white border-steam-accent scale-125 shadow-[0_0_20px_white]' :
                    'bg-[#0B0D12] border-gray-700'
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