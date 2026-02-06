import React from 'react';
import { 
  Globe, Box, Crosshair, Cloud, Wallet, BarChart3, 
  TrendingUp, Clock, Pyramid, Zap, ShieldCheck, Search 
} from 'lucide-react';

export const FullFeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0D12] text-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
            Everything you need to <br />
            <span className="text-gradient-accent text-steam-accent">Trade Like a Pro.</span>
          </h1>
          <p className="text-xl text-steam-secondary max-w-3xl leading-relaxed">
            From rarity distribution tracking to behavioral trade analysis. 
            We built the tools that give you a definitive edge over the Steam market.
          </p>
        </div>

        {/* Detailed Feature Showcase */}
        <div className="space-y-32">
          
          {/* Section 1: Visual Analytics (Rarity Pyramid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-steam-accent/10 border border-steam-accent/20 text-steam-accent text-xs font-bold uppercase tracking-widest">
                <Pyramid size={14} /> Analytics
              </div>
              <h2 className="text-4xl font-bold font-display">Inventory Quality Structure</h2>
              <p className="text-steam-secondary text-lg">
                Automatic categorization of your inventory by rarity grades (Covert, Classified, etc.). 
                Determine if your portfolio is built on stable "blue-chip" assets or high-risk speculative skins.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  'Real-time rarity distribution tracking', 
                  'Bulk valuation by quality tier', 
                  'Global market saturation benchmarks'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-300">
                    <ShieldCheck size={18} className="text-steam-profit" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Visual: Pyramid Chart */}
            <div className="order-1 lg:order-2 bg-[#12161E] border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-steam-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl" />
              <div className="relative z-10 space-y-4">
                <div className="flex justify-center flex-col items-center gap-2">
                  {[
                    { label: 'GOLD', color: 'bg-yellow-500', w: 'w-20', val: '1%' },
                    { label: 'RED', color: 'bg-red-500', w: 'w-32', val: '5%' },
                    { label: 'PINK', color: 'bg-pink-500', w: 'w-48', val: '15%' },
                    { label: 'PURPLE', color: 'bg-purple-500', w: 'w-64', val: '25%' },
                    { label: 'BLUE', color: 'bg-blue-500', w: 'w-80', val: '54%' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`${row.w} h-10 ${row.color} rounded-lg flex items-center justify-center font-bold text-[10px] shadow-lg shadow-black/20 text-white`}>
                        {row.label}
                      </div>
                      <span className="text-xs font-bold text-gray-500">{row.val}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center pt-6">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Quality Score</div>
                  <div className="text-2xl font-bold text-steam-accent">HIGH TIER 💎</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Time vs Profit (Holding Time) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             {/* Visual: Holding Time Stats */}
             <div className="bg-[#12161E] border border-white/5 p-8 rounded-3xl relative group">
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-sm font-bold text-gray-400 flex items-center gap-2 italic">
                    <Clock size={16} /> Holding Time Analysis
                  </span>
                  <div className="px-2 py-1 rounded bg-steam-profit/10 text-steam-profit text-[10px] font-bold">LIVE DATA</div>
                </div>
                
                {[
                  { label: 'Hold < 1 Month', roi: '-5%', color: 'text-red-500', bg: 'bg-red-500/20' },
                  { label: 'Hold 1-6 Months', roi: '+12%', color: 'text-yellow-500', bg: 'bg-yellow-500/20' },
                  { label: 'Hold > 1 Year', roi: '+85%', color: 'text-green-500', bg: 'bg-green-500/20' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <span className="text-sm font-medium">{row.label}</span>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${row.color}`}>Avg ROI {row.roi}</span>
                      <div className={`w-3 h-3 rounded-full ${row.bg.replace('/20', '')}`} />
                    </div>
                  </div>
                ))}

                <div className="mt-8 p-4 rounded-xl bg-steam-accent/5 border border-steam-accent/10">
                  <p className="text-xs text-gray-400 mb-2 font-bold uppercase">Pro Advice:</p>
                  <p className="text-sm text-white">History shows you earn more when you wait. Your current style: <span className="text-steam-accent font-bold">IMPATIENT TRADER 🐰</span></p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-steam-profit/10 border border-steam-profit/20 text-steam-profit text-xs font-bold uppercase tracking-widest">
                <TrendingUp size={14} /> Profitability
              </div>
              <h2 className="text-4xl font-bold font-display">"Paper Hands" vs "Diamond Hands"</h2>
              <p className="text-steam-secondary text-lg">
                We analyze every buy and sell transaction to calculate your Average Holding Time. 
                Discover if your "quick flip" strategy is actually outperforming long-term asset appreciation.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-2xl font-bold text-white">14 Days</div>
                  <div className="text-xs text-gray-500">Your Avg. Hold Time</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-2xl font-bold text-steam-profit">+77.5%</div>
                  <div className="text-xs text-gray-500">Global Profit Benchmark</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: More features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 border-t border-white/5">
            <FeatureSmall 
              icon={<Zap className="text-yellow-500" />} 
              title="Instant Market Sync" 
              desc="Real-time price fetching from Buff163, Skinport, and Steam. Know exactly what your knife is worth in cash, not just Steam credit." 
            />
            <FeatureSmall 
              icon={<Search className="text-blue-500" />} 
              title="Deep Search & Filter" 
              desc="Search by float values, rare stickers, and seed patterns across your entire inventory and storage units." 
            />
            <FeatureSmall 
              icon={<Globe className="text-steam-accent" />} 
              title="Multi-Currency Support" 
              desc="Track in USD, EUR, CNY, or PLN. Automated exchange rate updates powered by central bank data." 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

const FeatureSmall: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="space-y-4">
    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">{icon}</div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-steam-secondary text-sm leading-relaxed">{desc}</p>
  </div>
);