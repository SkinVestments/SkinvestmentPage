import React from 'react';
import { Package, Lock, BarChart2, ArrowRight, ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { LazyMount } from '@/components/ui/LazyMount';
export const DeepDive: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 md:py-32 bg-steam-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24">
           <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 text-steam-text font-display">
             Upgrade Your <span className="text-steam-accent">Workflow</span>
           </h2>
           <p className="text-steam-secondary max-w-2xl mx-auto text-lg">
             Move from static spreadsheets to a dynamic financial terminal.
           </p>
        </div>

        {/* Modern Comparison UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-steam-border rounded-3xl overflow-hidden bg-steam-elevated">
            
            {/* The Old Way */}
            <div className="p-6 sm:p-8 md:p-12 border-b md:border-b-0 md:border-r border-steam-border/50 relative group">
                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <XCircle className="text-red-500 w-8 h-8" />
                        <h3 className="text-2xl font-bold text-steam-secondary font-display">Manual Excel</h3>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 opacity-50">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5"></div>
                            <div>
                                <h4 className="font-bold text-steam-secondary">Outdated Prices</h4>
                                <p className="text-sm text-steam-tertiary">Manual entry every single day.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 opacity-50">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5"></div>
                            <div>
                                <h4 className="font-bold text-steam-secondary">No Historical Data</h4>
                                <p className="text-sm text-steam-tertiary">Can't see if you bought the dip.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 opacity-50">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5"></div>
                            <div>
                                <h4 className="font-bold text-steam-secondary">Single Account</h4>
                                <p className="text-sm text-steam-tertiary">Log in/out to check alts.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Pro Way */}
            <div className="p-6 sm:p-8 md:p-12 relative overflow-hidden group">
                <div className="absolute inset-0 bg-steam-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-steam-accent/10 blur-[80px] rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <CheckCircle2 className="text-steam-accent w-8 h-8" />
                        <h3 className="text-2xl font-bold text-steam-text font-display">Skinvestments</h3>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-steam-accent mt-2.5 shadow-[0_0_10px_#3B82F6]"></div>
                            <div>
                                <h4 className="font-bold text-steam-text">Live Multi-Source Feeds</h4>
                                <p className="text-sm text-steam-secondary">Syncs automatically from Steam, Skinport & Buff.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-steam-accent mt-2.5 shadow-[0_0_10px_#3B82F6]"></div>
                            <div>
                                <h4 className="font-bold text-steam-text">Interactive Charts</h4>
                                <p className="text-sm text-steam-secondary">Visual buy/sell markers on price history.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-steam-accent mt-2.5 shadow-[0_0_10px_#3B82F6]"></div>
                            <div>
                                <h4 className="font-bold text-steam-text">Unlimited Vaults</h4>
                                <p className="text-sm text-steam-secondary">Track main, storage units, and investments in one place.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Feature Spotlight: The Chart */}
        <div className="mt-16 sm:mt-24 md:mt-32 p-6 sm:p-8 md:p-12 bg-gradient-to-b from-steam-elevated to-steam-bg rounded-2xl sm:rounded-3xl border border-steam-border/50 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10"></div>
             
             <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 relative z-10 min-w-0">
                 <div className="flex-1 space-y-8">
                     <div className="inline-block px-3 py-1 rounded bg-steam-accent/10 border border-steam-accent/20 text-steam-accent text-xs font-bold uppercase tracking-wider">
                         Analytics
                     </div>
                     <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-steam-text font-display">
                         See the Matrix.
                     </h3>
                     <p className="text-steam-secondary text-lg leading-relaxed">
                         Our proprietary charting engine overlays your transaction history onto global market data. 
                         Know exactly how much profit you made on that <span className="text-steam-text font-medium">AWP | Dragon Lore</span> trade.
                     </p>
                 </div>

                 {/* TradingView Style Mockup */}
                 <div className="flex-1 w-full min-w-0">
    <div className="bg-steam-bg rounded-xl border border-steam-border p-4 sm:p-6 shadow-2xl overflow-hidden">
        {/* Header Karty */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 border-b border-steam-border/50 pb-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                <div>
                    <div className="text-sm font-bold text-steam-text">AWP | Dragon Lore</div>
                    <div className="text-xs text-steam-tertiary">Factory New • 0.014 Float</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-lg font-bold text-steam-text">$14,250.00</div>
                <div className="text-xs text-green-400 font-medium">+24.5% Past Year</div>
            </div>
        </div>
        
        {/* PRAWDZIWY WYKRES RECHARTS (Zamiast divów) */}
        <div className="h-48 w-full min-w-0 pointer-events-none">
            <LazyMount minHeight="12rem" className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                    { val: 10000 }, { val: 10200 }, { val: 10500 }, { val: 10100 }, 
                    { val: 10800 }, { val: 11500 }, { val: 11200 }, { val: 12000 }, 
                    { val: 12500 }, { val: 12100 }, { val: 13000 }, { val: 13800 }, 
                    { val: 13500 }, { val: 14250 }
                ]}>
                    <defs>
                        <linearGradient id="colorLore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-profit)" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="var(--color-profit)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area 
                        type="monotone" 
                        dataKey="val" 
                        stroke="var(--color-profit)" 
                        strokeWidth={3} 
                        fill="url(#colorLore)" 
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
            </LazyMount>
        </div>
        
        {/* Oś X (Ręczna, dla efektu wizualnego) */}
        <div className="flex justify-between mt-2 px-2 text-[10px] text-steam-tertiary font-mono tracking-widest uppercase">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
        </div>
    </div>
</div>
             </div>
        </div>

      </div>
    </section>
  );
};
