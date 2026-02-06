import React from 'react';
import { Package, Lock, BarChart2, ArrowRight, ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export const DeepDive: React.FC = () => {
  return (
    <section className="py-32 bg-[#0B0D12] relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24">
           <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white font-display">
             Upgrade Your <span className="text-steam-accent">Workflow</span>
           </h2>
           <p className="text-steam-secondary max-w-2xl mx-auto text-lg">
             Move from static spreadsheets to a dynamic financial terminal.
           </p>
        </div>

        {/* Modern Comparison UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/10 rounded-3xl overflow-hidden bg-[#12161E]">
            
            {/* The Old Way */}
            <div className="p-12 border-b md:border-b-0 md:border-r border-white/5 relative group">
                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <XCircle className="text-red-500 w-8 h-8" />
                        <h3 className="text-2xl font-bold text-gray-400 font-display">Manual Excel</h3>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 opacity-50">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5"></div>
                            <div>
                                <h4 className="font-bold text-gray-300">Outdated Prices</h4>
                                <p className="text-sm text-gray-500">Manual entry every single day.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 opacity-50">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5"></div>
                            <div>
                                <h4 className="font-bold text-gray-300">No Historical Data</h4>
                                <p className="text-sm text-gray-500">Can't see if you bought the dip.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 opacity-50">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5"></div>
                            <div>
                                <h4 className="font-bold text-gray-300">Single Account</h4>
                                <p className="text-sm text-gray-500">Log in/out to check alts.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Pro Way */}
            <div className="p-12 relative overflow-hidden group">
                <div className="absolute inset-0 bg-steam-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-steam-accent/10 blur-[80px] rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <CheckCircle2 className="text-steam-accent w-8 h-8" />
                        <h3 className="text-2xl font-bold text-white font-display">Skinvestments</h3>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-steam-accent mt-2.5 shadow-[0_0_10px_#3B82F6]"></div>
                            <div>
                                <h4 className="font-bold text-white">Live Multi-Source Feeds</h4>
                                <p className="text-sm text-steam-secondary">Syncs automatically from Steam, Skinport & Buff.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-steam-accent mt-2.5 shadow-[0_0_10px_#3B82F6]"></div>
                            <div>
                                <h4 className="font-bold text-white">Interactive Charts</h4>
                                <p className="text-sm text-steam-secondary">Visual buy/sell markers on price history.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-steam-accent mt-2.5 shadow-[0_0_10px_#3B82F6]"></div>
                            <div>
                                <h4 className="font-bold text-white">Unlimited Vaults</h4>
                                <p className="text-sm text-steam-secondary">Track main, storage units, and investments in one place.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Feature Spotlight: The Chart */}
        <div className="mt-32 p-8 md:p-12 bg-gradient-to-b from-[#12161E] to-[#0B0D12] rounded-3xl border border-white/5 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
             
             <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                 <div className="flex-1 space-y-8">
                     <div className="inline-block px-3 py-1 rounded bg-steam-accent/10 border border-steam-accent/20 text-steam-accent text-xs font-bold uppercase tracking-wider">
                         Analytics
                     </div>
                     <h3 className="text-4xl font-bold text-white font-display">
                         See the Matrix.
                     </h3>
                     <p className="text-steam-secondary text-lg leading-relaxed">
                         Our proprietary charting engine overlays your transaction history onto global market data. 
                         Know exactly how much profit you made on that <span className="text-white font-medium">AWP | Gungnir</span> trade.
                     </p>
                     <Button>Explore Analytics</Button>
                 </div>

                 {/* TradingView Style Mockup */}
                 <div className="flex-1 w-full">
                     <div className="bg-[#0B0D12] rounded-xl border border-white/10 p-6 shadow-2xl">
                         <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                                 <div>
                                     <div className="text-sm font-bold text-white">AWP | Dragon Lore</div>
                                     <div className="text-xs text-gray-500">Factory New • 0.014 Float</div>
                                 </div>
                             </div>
                             <div className="text-right">
                                 <div className="text-lg font-bold text-white">$14,250.00</div>
                                 <div className="text-xs text-steam-profit">+24.5% Past Year</div>
                             </div>
                         </div>
                         
                         {/* Candlestick visualization (Abstract) */}
                         <div className="flex items-end h-48 gap-2 opacity-80">
                             {[40, 35, 45, 50, 48, 60, 55, 65, 70, 68, 80, 75, 85, 90, 88, 100].map((h, i) => (
                                 <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer">
                                     <div 
                                        style={{ height: `${h}%` }} 
                                        className={`w-full rounded-sm transition-all duration-300 ${i % 3 === 0 ? 'bg-steam-loss/80' : 'bg-steam-profit/80'} group-hover:brightness-125`}
                                     ></div>
                                 </div>
                             ))}
                         </div>
                         
                         {/* Axis */}
                         <div className="flex justify-between mt-4 text-[10px] text-gray-600 font-mono">
                             <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
                         </div>
                     </div>
                 </div>
             </div>
        </div>

      </div>
    </section>
  );
};