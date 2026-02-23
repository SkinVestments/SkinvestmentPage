import React from 'react';
import { Apple, Play, ShieldCheck, Globe, Package } from 'lucide-react';
import { Button } from './Button';
import { useWeeklyReset } from '../utils/utils'; // Upewnij się, że ścieżka jest poprawna

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
            
            {/* App Store */}
            <div className="relative group cursor-not-allowed">
              <div className="pointer-events-none opacity-60">
                <Button icon={<Apple size={20} />}>
                  App Store
                </Button>
              </div>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-steam-accent text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap shadow-lg shadow-blue-500/20 z-10 uppercase tracking-wide">
                Coming Soon
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-steam-accent rotate-45 rounded-sm"></div>
              </div>
            </div>

            {/* Google Play */}
            <div className="relative group cursor-not-allowed">
              <div className="pointer-events-none opacity-60">
                <Button variant="outline" icon={<Play size={20} />}>
                  Google Play
                </Button>
              </div>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-steam-accent text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap shadow-lg shadow-blue-500/20 z-10 uppercase tracking-wide">
                Coming Soon
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-steam-accent rotate-45 rounded-sm"></div>
              </div>
            </div>

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
          
          {/* Floating Market Card - Pływający Weekly Drop (lekko wysunięty) */}
          <div className="absolute top-[20%] right-[-15%] z-40 animate-float-delayed hidden md:block">
              <div className="glass-panel p-4 rounded-xl border-l-4 border-l-steam-profit shadow-2xl backdrop-blur-xl bg-[#161B24]/90">
                  <div className="flex items-center gap-3">
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

          {/* The Phone - TERAZ RESPONSYWNY */}
          {/* ZMIANA: Mniejsze wymiary na mobilce (w-280px, h-600px), standardowe na większych ekranach (sm:w-340px) */}
          <div className="relative w-[280px] h-[600px] sm:w-[340px] sm:h-[740px] bg-[#0B0D12] rounded-[2.5rem] sm:rounded-[3.5rem] border-[6px] sm:border-[8px] border-[#1F2937] shadow-[0_0_50px_rgba(59,130,246,0.15)] z-20 ring-1 ring-white/10 transform transition-transform duration-500 rotate-y-12 group-hover:rotate-y-0 group-hover:scale-[1.02]">
              
              {/* Glossy Reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-40 pointer-events-none rounded-[2rem] sm:rounded-[3rem]"></div>

              {/* Screen Content - Idealne wycentrowanie z dopasowanym zaokrągleniem rogu */}
              <div className="absolute inset-0 z-30 overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-[#0B0D12] flex items-center justify-center">
                  <img 
                      src="/images/screen.png" 
                      alt="Skinvestments App Interface" 
                      className="w-full h-full object-cover object-center"
                  />
              </div>

          </div>
        </div>


      </div>
    </section>
  );
};