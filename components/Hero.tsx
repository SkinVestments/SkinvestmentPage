import React from 'react';
import { Apple, Play, TrendingUp, ShieldCheck, Globe, ArrowUpRight, Bell, BarChart2, LayoutDashboard, History, User, Plus, Package, Calendar } from 'lucide-react';
import { Button } from './Button';
import { useWeeklyReset } from '@/utils/utils';

export const Hero: React.FC = () => {
    const resetTimer = useWeeklyReset();
  return (
    <section className="relative min-h-[95vh] flex items-center pt-32 pb-24 overflow-hidden bg-[#0B0D12]">
      
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px]" />
        
        {/* Modern Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10 w-full">
        
        {/* Left Column: Copy */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-steam-profit animate-pulse" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest font-display">Multi-Market Aggregation</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold leading-[0.95] tracking-tight font-display text-white">
            Master the <br/>
            <span className="text-gradient-accent">
              Economy.
            </span>
          </h1>
          
          <p className="text-xl text-steam-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
            The advanced portfolio tracker for CS2. Real-time valuation from 
            <span className="text-white font-medium mx-1">Steam, Skinport & Buff</span>. 
            Stop guessing, start profiting.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Button icon={<Apple size={20} />}>
              App Store
            </Button>
            <Button variant="outline" icon={<Play size={20} />}>
              Google Play
            </Button>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-steam-secondary text-sm font-medium">
             <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-steam-profit"/>
                <span>No Steam Password Needed</span>
             </div>
             <div className="flex items-center gap-2">
                <Globe size={18} className="text-steam-accent"/>
                <span>Global Currency Support</span>
             </div>
          </div>
        </div>

        {/* Right Column: 3D Composition */}
<div className="relative flex justify-center lg:justify-end mt-12 lg:mt-0 perspective-1000 group">
  
  {/* Floating Market Cards (3D Effect) */}
  <div className="absolute top-[15%] right-[-10%] z-30 animate-float-delayed hidden md:block">
      <div className="glass-panel p-4 rounded-xl border-l-4 border-l-steam-profit shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-steam-profit/20 flex items-center justify-center text-steam-profit font-bold text-lg">
                <Package size={20} />
              </div>
              <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Weekly Drop</div>
                  <div className="text-sm font-bold text-white">Reset in {resetTimer}</div>
              </div>
          </div>
      </div>
  </div>

  {/* The Phone */}
  <div className="relative w-[340px] h-[680px] bg-[#0B0D12] rounded-[3.5rem] border-[6px] border-[#1F2937] shadow-[0_0_50px_rgba(59,130,246,0.15)] z-20 overflow-hidden ring-1 ring-white/10 transform transition-transform duration-500 rotate-y-12 group-hover:rotate-y-0 group-hover:scale-[1.02]">
      
      {/* Glossy Reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-40 pointer-events-none rounded-[3rem]"></div>

      {/* Notch - Teraz jako stały element nad zawartością */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-7 bg-[#1F2937] rounded-b-2xl z-50"></div>

      {/* Screen Content */}
      <div className="w-full h-full flex flex-col font-sans relative">
        
        {/* Status Bar */}
        <div className="px-8 pt-5 pb-2 flex justify-between items-center relative z-30 text-white">
            <span className="text-[12px] font-bold tracking-wide">12:32</span>
            
            <div className="flex items-center gap-2">
                {/* Signal Bars */}
                <div className="flex items-end gap-[2px] h-3">
                    <div className="w-1 h-1 bg-white/50 rounded-[1px]"></div>
                    <div className="w-1 h-2 bg-white/50 rounded-[1px]"></div>
                    <div className="w-1 h-2.5 bg-white rounded-[1px]"></div>
                    <div className="w-1 h-3.5 bg-white rounded-[1px]"></div>
                </div>

                {/* WiFi */}
                <div className="relative">
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 11L0.5 2.5C2.5 0.5 5 0 7 0C9 0 11.5 0.5 13.5 2.5L7 11Z" fill="white"/>
                    </svg>
                </div>

                {/* Full Battery */}
                <div className="w-6 h-3 rounded-[3px] border border-gray-400 relative flex items-center p-[1px] ml-1">
                    {/* Wypełnienie baterii (100%) */}
                    <div className="w-full h-full bg-white rounded-[1px]"></div>
                    
                    {/* Ten "cycek" od baterii */}
                    <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-1.5 bg-gray-400 rounded-r-[1px]"></div>
                </div>
            </div>
        </div>

        {/* App Header */}
        <div className="px-5 mt-4 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                    <BarChart2 size={16} />
                </div>
                <span className="font-bold text-white text-lg">Hello, kdfjgh</span>
            </div>
            <Bell size={20} className="text-gray-400" />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
            {/* ... reszta twojego contentu (Portfolio Card, Stats, etc.) ... */}
            
            {/* Main Portfolio Card */}
            <div className="bg-[#161B24] rounded-2xl p-5 border border-white/5 mb-4 shadow-lg">
                <div className="flex justify-between items-start mb-1">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Portfolio Value</div>
                    <div className="flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded text-xs font-bold text-steam-profit">
                        <TrendingUp size={10} /> +77.5%
                    </div>
                </div>
                <div className="text-3xl font-bold text-white font-display mb-6">$110.91</div>
                
                <div className="h-24 w-full mb-4 relative flex items-end">
                     <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                        <path d="M0,38 L5,38 L10,37 L15,37 L20,32 L25,30 L30,35 L35,35 L40,36 L45,35 L50,30 L55,28 L60,32 L65,30 L70,25 L75,22 L80,24 L85,15 L90,18 L95,12 L100,10" 
                            fill="none" 
                            stroke="#F87171" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                        />
                        <defs>
                            <linearGradient id="redGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#F87171" stopOpacity="0.2"/>
                                <stop offset="100%" stopColor="#F87171" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                        <path d="M0,38 L5,38 L10,37 L15,37 L20,32 L25,30 L30,35 L35,35 L40,36 L45,35 L50,30 L55,28 L60,32 L65,30 L70,25 L75,22 L80,24 L85,15 L90,18 L95,12 L100,10 V40 H0 Z" 
                            fill="url(#redGradient)" 
                        />
                     </svg>
                             {/* Timeframe Selector Overlay */}
                             <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[8px] text-gray-500 font-bold text-right">
                                 <span className="text-red-400 bg-red-400/10 px-1 rounded">All</span>
                                 <span>1Y</span>
                                 <span>1M</span>
                                 <span>7D</span>
                             </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1 bg-[#161B24] rounded-xl p-3 border border-white/5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-red-400">
                                <TrendingUp size={16} />
                            </div>
                            <div>
                                <div className="text-[9px] text-gray-500 font-bold uppercase">Investments</div>
                                <div className="text-sm font-bold text-white">$110.91</div>
                            </div>
                        </div>
                        <div className="flex-1 bg-[#161B24] rounded-xl p-3 border border-white/5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-400">
                                <Package size={16} />
                            </div>
                            <div>
                                <div className="text-[9px] text-gray-500 font-bold uppercase">Inventory</div>
                                <div className="text-sm font-bold text-white">$0.00</div>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Drop Card */}
                    <div className="bg-[#161B24] rounded-2xl p-4 border border-white/5 mb-6 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                                    <Package size={16} />
                                </div>
                                <div>
                                    <div className="font-bold text-white">Weekly Drop</div>
                                    <div className="text-xs text-gray-400">Resets in <span className="text-red-400 font-bold">{resetTimer}</span></div>
                                </div>
                            </div>
                            
                            <button className="mt-4 flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500/20 transition-colors">
                                <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px]">✓</div>
                                Log Drop
                            </button>
                        </div>
                        
                        {/* Case Image Placeholder */}
                        <div className="absolute right-[-20px] bottom-[-20px] opacity-80 rotate-[-15deg]">
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 rounded-lg shadow-xl flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-500">CS:GO</span>
                            </div>
                        </div>
                    </div>

                    {/* Collections Header */}
                    <div className="flex justify-between items-center mb-3">
                        <div className="text-lg font-bold text-white">Collections</div>
                        <button className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1">
                            <Plus size={12} /> New Collection
                        </button>
                    </div>

                     {/* Partial Collections Row to show "scroll" */}
                    <div className="flex gap-3">
                         <div className="w-32 h-32 bg-[#161B24] rounded-xl border border-white/5 p-3 flex flex-col justify-between">
                            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                                <Package size={14} /> 3
                            </div>
                            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                                <div className="w-1/3 h-full bg-gray-500"></div>
                            </div>
                         </div>
                         <div className="w-32 h-32 bg-[#161B24] rounded-xl border border-white/5 p-3 flex flex-col justify-between">
                            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                                <Package size={14} /> 0
                            </div>
                            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden"></div>
                         </div>
                    </div>

                </div>

                {/* Bottom Navigation */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#0B0D12]/95 backdrop-blur-md border-t border-white/5 px-6 py-4 flex justify-between items-center z-20">
                    <div className="flex flex-col items-center gap-1 text-red-500">
                        <LayoutDashboard size={20} strokeWidth={2.5} />
                        <span className="text-[9px] font-bold">Dashboard</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-500">
                        <BarChart2 size={20} />
                        <span className="text-[9px] font-medium">Analytics</span>
                    </div>
                    
                    {/* Floating Plus Button */}
                    <div className="relative -top-6">
                        <div className="w-12 h-12 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center justify-center text-white">
                            <Plus size={24} />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1 text-gray-500">
                        <History size={20} />
                        <span className="text-[9px] font-medium">History</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-500">
                        <User size={20} />
                        <span className="text-[9px] font-medium">Profile</span>
                    </div>
                </div>

             </div>
          </div>
        </div>
      </div>
    </section>
  );
};