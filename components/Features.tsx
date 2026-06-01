import React, { useRef, useState } from 'react';
import { RefreshCw, Wallet, Cloud, Crosshair, Box, Globe, BarChart3 } from 'lucide-react';
import { Feature } from '../types';
import { Link } from 'react-router-dom';

// Rozszerzamy lokalnie typ Feature, aby TS nie narzekał na nową flagę
type ExtendedFeature = Feature & {
  comingSoon?: boolean;
};

const features: ExtendedFeature[] = [
  {
    title: "Multi-Market Data",
    description: "Don't rely on just Steam. We aggregate prices from Skinport, Buff163, and GamerPay to show you the real cash value.",
    icon: Globe,
    comingSoon: true // <--- Dodana flaga
  },
  {
    title: "Weekly Drop Tracker",
    description: "Never miss a drop. Log your weekly rewards and calculate the exact odds of your luck over time.",
    icon: Box
  },
  {
    title: "True ROI Calculator",
    description: "Input your buy price and instantly see your Return on Investment after specific marketplace fees.",
    icon: Crosshair
  },
  {
    title: "Cloud Sync",
    description: "Your portfolio travels with you. Seamlessly sync between iOS, Android, and Web with end-to-end encryption.",
    icon: Cloud
  },
  {
    title: "Multiple Accounts",
    description: "Storage units? Alt accounts? Track everything in one unified dashboard view without relogging.",
    icon: Wallet,
  },
  {
    title: "Analytics Dashboard",
    description: "Visual breakdown of your inventory by collection, rarity, and trade hold status.",
    icon: BarChart3
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-steam-bg relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-900/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-display text-steam-text mb-4">
            Pro Tools for <span className="text-steam-accent">Serious Traders</span>
          </h2>
          <p className="text-steam-secondary max-w-2xl mx-auto text-lg">
            Built to handle portfolios from $10 to $1,000,000.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Używamy ExtendedFeature */}
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent">
            {/* Zamiana button na Link */}
            <Link 
              to="/features" 
              className="px-8 py-3 rounded-full bg-steam-card text-steam-text font-bold hover:bg-steam-hover transition-colors border border-steam-border/50 hover:border-steam-accent/50 flex items-center gap-2 mx-auto"
            >
              View Full Feature List <span className="text-steam-accent">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Zaktualizowany FeatureCard przyjmujący ExtendedFeature
const FeatureCard: React.FC<{ feature: ExtendedFeature }> = ({ feature }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div 
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative p-8 rounded-2xl bg-steam-elevated border border-steam-border/50 overflow-hidden group hover:scale-[1.01] transition-transform duration-300 flex flex-col"
        >
            {/* Spotlight Effect */}
            <div 
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
                }}
            />
            {/* Border Highlight on Hover */}
             <div 
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                style={{
                    background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.3), transparent 40%)`,
                    maskImage: 'linear-gradient(black, black)',
                    WebkitMaskClip: 'content-box',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '1px'
                }}
            />

            <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-steam-border flex items-center justify-center group-hover:border-steam-accent/30 group-hover:bg-steam-accent/10 transition-colors">
                        <feature.icon className="w-6 h-6 text-steam-secondary group-hover:text-steam-accent transition-colors" />
                    </div>
                    
                    {/* Badge "Coming Soon" renderowany tylko gdy flaga jest na true */}
                    {feature.comingSoon && (
                        <div className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400">
                                Coming Soon
                            </span>
                        </div>
                    )}
                </div>
                
                <h3 className="text-xl font-bold text-steam-text mb-3 font-display">
                    {feature.title}
                </h3>
                <p className="text-steam-secondary leading-relaxed text-sm">
                    {feature.description}
                </p>
            </div>
        </div>
    );
};