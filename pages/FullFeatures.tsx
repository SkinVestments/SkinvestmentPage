import React, { useEffect } from 'react';
import { 
  Globe, Box, Crosshair, Cloud, Wallet, BarChart3, 
  TrendingUp, Clock, Pyramid, Zap, ShieldCheck, Search,
  Activity, Target, Rocket, Moon
} from 'lucide-react';

export const FullFeaturesPage: React.FC = () => {
  // Reset scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            From algorithmic stagnation detection to real-time market pulse widgets. 
            We built the tools that give you a definitive edge over the Steam market.
          </p>
        </div>

        {/* Detailed Feature Showcase */}
        <div className="space-y-32">
          
{/* Section 1: Portfolio Pulse (Fixed Proportions) */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
  <div className="space-y-6 order-2 lg:order-1">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
      <Activity size={14} /> Real-Time Monitor
    </div>
    <h2 className="text-4xl font-bold font-display">The Portfolio Pulse</h2>
    <p className="text-steam-secondary text-lg">
      Stop guessing. Our Pulse monitor tracks 24h volatility with a live tracking indicator.
      It acts like a speedometer for your wealth – providing instant clarity on your market momentum.
    </p>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-2 gap-4 pt-4">
      <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
        <div className="text-green-400 font-bold flex items-center gap-1"><Rocket size={14}/> Top Gainer</div>
        <div className="text-sm">AK-47 | Redline</div>
        <div className="text-xs text-green-400/70">+5.2%</div>
      </div>
      <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
        <div className="text-red-400 font-bold flex items-center gap-1"><TrendingUp size={14} className="rotate-180"/> Top Loser</div>
        <div className="text-sm">Paris 2023 Case</div>
        <div className="text-xs text-red-400/70">-2.4%</div>
      </div>
    </div>
  </div>
  
  {/* Visual: Pro Chart Widget */}
  <div className="order-1 lg:order-2 bg-[#12161E] border border-white/5 p-8 rounded-3xl relative overflow-hidden group font-mono">
      <div className="border border-white/20 p-6 rounded-lg bg-black/40 shadow-2xl relative z-10">
          
          {/* Header */}
          <div className="flex justify-between mb-4 border-b border-white/5 pb-2">
              <span className="text-[10px] opacity-50 uppercase tracking-wider font-bold text-gray-400">SteamVestments Pulse</span>
              <span className="text-[10px] text-blue-400 font-bold flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                LIVE
              </span>
          </div>

          {/* Main Values */}
          <div className="text-4xl font-bold mb-1 text-white tracking-tight">$14,759.06</div>
          <div className="text-green-400 text-sm mb-6 font-bold flex items-center gap-1">
            ▲ +$234.50 (24h)
          </div>
          
          {/* Wykres Liniowy - Poprawione proporcje */}
          <div className="h-28 w-full relative">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                </linearGradient>
              </defs>
              
              {/* Linia odniesienia (Baseline) - np. cena otwarcia */}
              <line x1="0" y1="80" x2="300" y2="80" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

              {/* Obszar wypełnienia (Area) */}
              <path 
                d="M0,80 C40,80 50,60 80,65 C110,70 130,40 160,45 C190,50 220,20 250,25 C270,28 280,10 300,10 V100 H0 Z" 
                fill="url(#chartGradient)" 
              />
              
              {/* Główna linia (Line) - Bardziej naturalna krzywa finansowa */}
              <path 
                d="M0,80 C40,80 50,60 80,65 C110,70 130,40 160,45 C190,50 220,20 250,25 C270,28 280,10 300,10" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="2" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Punkt końcowy (Indicator) */}
              <g transform="translate(300, 10)">
                <circle r="4" fill="#3b82f6" className="animate-pulse opacity-50"/>
                <circle r="2.5" fill="#fff" />
              </g>
            </svg>
          </div>
          
          {/* Footer */}
          <div className="mt-4 flex justify-between items-end text-[10px] text-gray-500 font-medium">
             <span>24H VOLATILITY</span>
             <span className="opacity-50">UPDATED: 10:45:02</span>
          </div>
      </div>
  </div>
</div>

          {/* Section 2: Visual Analytics (Rarity Pyramid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual: Pyramid Chart */}
            <div className="bg-[#12161E] border border-white/5 p-8 rounded-3xl relative overflow-hidden group order-2 lg:order-1">
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

            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-steam-accent/10 border border-steam-accent/20 text-steam-accent text-xs font-bold uppercase tracking-widest">
                <Pyramid size={14} /> Analytics
              </div>
              <h2 className="text-4xl font-bold font-display">Inventory Quality Structure</h2>
              <p className="text-steam-secondary text-lg">
                Automatic categorization of your inventory by rarity grades. 
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
          </div>

          {/* Section 3: Grail Watcher & Stagnation Detector */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest">
                <Moon size={14} /> Asset Efficiency
              </div>
              <h2 className="text-4xl font-bold font-display">Identify Dead Money</h2>
              <p className="text-steam-secondary text-lg">
                Most investors lose money through **stagnation**. Our detector identifies items that haven't moved in 180+ days, 
                calculating the "Cost of Opportunity" to help you rotate funds into growth assets.
              </p>
              <h3 className="text-2xl font-bold pt-4 text-white flex items-center gap-2">
                <Target className="text-steam-accent" /> Focus on your "Grails"
              </h3>
              <p className="text-steam-secondary">
                Pin your highest-conviction investments. Set specific profit targets and track your journey 
                to the exit price with high-fidelity progress bars.
              </p>
            </div>
            
            <div className="bg-[#12161E] border border-white/5 p-8 rounded-3xl relative group font-mono">
                <div className="space-y-6 relative z-10">
                    {/* Grail Watcher Mockup */}
                    <div className="border border-white/10 p-5 rounded-xl bg-black/20">
                        <div className="flex items-center gap-2 mb-4 text-steam-accent text-sm font-bold uppercase tracking-tighter">
                            <Target size={16}/> Top Asset Watcher
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>Revolution Case</span>
                            <span className="opacity-50">Qty: 1,500</span>
                        </div>
                        <div className="text-2xl font-bold">$0.45 <span className="text-xs text-green-400 font-normal">(+125%)</span></div>
                        <div className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden border border-white/5">
                            <div className="w-[45%] h-full bg-steam-accent shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                        </div>
                        <div className="flex justify-between text-[10px] mt-2 opacity-50 font-bold uppercase">
                            <span>Avg: $0.20</span>
                            <span>Target: $1.00</span>
                        </div>
                    </div>

                    {/* Stagnation Detector Mockup */}
                    <div className="border border-red-500/20 p-5 rounded-xl bg-red-500/5 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-2 text-red-400 text-sm font-bold uppercase tracking-tighter">
                            <Moon size={16}/> Stagnation Alert
                        </div>
                        <div className="text-[11px] opacity-70 mb-4 leading-tight">These items have lower volatility than savings accounts. Consider rotating funds.</div>
                        <div className="space-y-2">
                            <div className="text-xs flex justify-between border-b border-red-500/10 pb-1">
                                <span className="opacity-60">Stagnant Assets:</span>
                                <span className="font-bold text-red-400">$1,250</span>
                            </div>
                            <div className="text-xs flex justify-between">
                                <span className="opacity-60">Potential if Reinvested:</span>
                                <span className="font-bold text-green-400">+$300/yr</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Section 4: Holding Time Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             {/* Visual: Holding Time Stats */}
             <div className="bg-[#12161E] border border-white/5 p-8 rounded-3xl relative group order-2 lg:order-1">
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-sm font-bold text-gray-400 flex items-center gap-2 italic">
                    <Clock size={16} /> Holding Time Analysis
                  </span>
                  <div className="px-2 py-1 rounded bg-steam-profit/10 text-steam-profit text-[10px] font-bold">PRO FEATURE</div>
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
                  <p className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-tighter">Strategic Advice:</p>
                  <p className="text-sm text-white">History shows you earn more when you wait. Your current style: <span className="text-steam-accent font-bold uppercase">Impatient Trader 🐰</span></p>
                </div>
              </div>
            </div>

            <div className="space-y-6 order-1 lg:order-2">
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
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Avg. Hold Time</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-2xl font-bold text-steam-profit">+77.5%</div>
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Market Benchmark</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Small features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 border-t border-white/5">
            <FeatureSmall 
              icon={<Zap className="text-yellow-500" />} 
              title="Instant Market Sync" 
              desc="Real-time price fetching from Buff163, Skinport, and Steam. Know the cash value, not just Steam credit." 
            />
            <FeatureSmall 
              icon={<Search className="text-blue-500" />} 
              title="Deep Search & Filter" 
              desc="Search by float values, rare stickers, and seed patterns across all storage units." 
            />
            <FeatureSmall 
              icon={<Globe className="text-steam-accent" />} 
              title="Multi-Currency Support" 
              desc="Track in USD, EUR, CNY, or PLN with automated real-time exchange rate updates." 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

const FeatureSmall: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="space-y-4">
    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shadow-inner">{icon}</div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-steam-secondary text-sm leading-relaxed">{desc}</p>
  </div>
);