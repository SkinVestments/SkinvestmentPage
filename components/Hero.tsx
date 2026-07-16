import React, { useEffect } from 'react';
import { Apple, ShieldCheck, Globe, Package } from 'lucide-react';
import { Button } from './Button';
import { GooglePlayIcon } from './icons/GooglePlayIcon';
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@/constants/appLinks';
import { useTheme } from '@/context/ThemeContext';
import { useWeeklyReset } from '../utils/utils';

const HERO_SCREEN = {
  dark: {
    src: '/images/screen-b-md.webp',
    srcSet: '/images/screen-b-sm.webp 335w, /images/screen-b-md.webp 670w',
  },
  light: {
    src: '/images/screen-w-md.webp',
    srcSet: '/images/screen-w-sm.webp 335w, /images/screen-w-md.webp 670w',
  },
} as const;

export const Hero: React.FC = () => {
  const resetTimer = useWeeklyReset();
  const { theme } = useTheme();
  const screen = theme === 'light' ? HERO_SCREEN.light : HERO_SCREEN.dark;

  useEffect(() => {
    const id = 'hero-lcp-preload';
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'preload';
      link.as = 'image';
      link.type = 'image/webp';
      document.head.appendChild(link);
    }
    if (link.getAttribute('href') === screen.src) return;
    link.setAttribute('href', screen.src);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [screen.src]);
  
  return (
    <section className="relative min-h-[90vh] sm:min-h-[95vh] flex items-center pt-24 sm:pt-32 pb-16 sm:pb-24 bg-steam-bg">
      
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px]" />
        
        {/* Modern Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center relative z-10 w-full min-w-0">
        
        {/* Left Column: Copy */}
        <div className="space-y-6 sm:space-y-8 text-center lg:text-left min-w-0">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full theme-subtle border border-steam-border backdrop-blur-sm max-w-full">
            <span className="w-2 h-2 shrink-0 rounded-full bg-steam-profit animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-steam-secondary uppercase tracking-wide sm:tracking-widest font-display">Multi-Market Aggregation</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight font-display text-steam-text break-words">
            CS2 Portfolio Tracker
            <span className="block text-gradient-accent mt-2">
              Master the skin economy.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-steam-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
            Skinvestments is a portfolio tracker for CS2 skins with real-time valuation from
            <span className="text-steam-text font-medium mx-1">Steam, Skinport & Buff</span>.
            Track profits, drops, and inventory value on web and mobile.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-4 w-full max-w-sm sm:max-w-none mx-auto lg:mx-0">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full sm:w-auto"
            >
              <Button icon={<Apple size={20} />} className="w-full sm:w-auto justify-center">
                App Store
              </Button>
            </a>

            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full sm:w-auto"
            >
              <Button icon={<GooglePlayIcon size={20} />} className="w-full sm:w-auto justify-center">
                Google Play
              </Button>
            </a>
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

        {/* Right Column: app mockup */}
        <div className="relative flex justify-center w-full mt-8 lg:mt-0 perspective-1000 group">
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-none mx-auto md:pr-28">
            {/* Floating Weekly Drop — desktop only */}
            <div className="absolute top-[18%] right-0 translate-x-[calc(50%+50px)] z-40 animate-float-delayed hidden md:block w-max pointer-events-none">
              <div className="glass-panel p-4 rounded-xl border-l-4 border-l-steam-profit shadow-2xl backdrop-blur-xl bg-steam-card/90 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-steam-profit/20 flex items-center justify-center text-steam-profit font-bold text-lg">
                    <Package size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-steam-secondary font-bold uppercase">Weekly Drop</div>
                    <div className="text-sm font-bold text-steam-text">Reset in {resetTimer}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone frame */}
            <div className="relative mx-auto w-[240px] h-[520px] sm:w-[280px] sm:h-[600px] md:w-[340px] md:h-[740px] bg-steam-bg rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] border-[5px] sm:border-[6px] md:border-[8px] border-steam-border shadow-[0_0_50px_rgba(59,130,246,0.15)] z-20 ring-1 ring-white/10 transform transition-transform duration-500 lg:rotate-y-12 group-hover:rotate-y-0 group-hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-40 pointer-events-none rounded-[1.6rem] sm:rounded-[2.2rem] md:rounded-[3rem]" />

              <div className="absolute inset-[3px] sm:inset-1 z-30 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.8rem] bg-steam-bg">
                <img
                  src={screen.src}
                  srcSet={screen.srcSet}
                  sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, 340px"
                  alt="Skinvestments CS2 portfolio tracker app on iPhone"
                  width={335}
                  height={725}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="block w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};