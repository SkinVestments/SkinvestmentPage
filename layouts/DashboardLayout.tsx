import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { BrandLogo } from '../components/BrandLogo';
import { AdSenseScript } from '@/components/ads/AdSenseScript';
import { useScrollEdge } from '@/hooks/useScrollEdge';
import { Menu, X } from 'lucide-react';

export const DashboardLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const headerEdged = useScrollEdge(mainRef, sentinelRef);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  return (
    <div className="flex h-screen bg-steam-bg text-steam-text overflow-hidden w-full max-w-[100vw]">
      <AdSenseScript />
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 flex flex-col md:ml-64 h-screen overflow-hidden min-w-0 w-full">
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 w-full"
        >
          {/* Sentinel at scroll top — when it leaves, chrome shows scroll-edge fade */}
          <div ref={sentinelRef} className="h-px w-full pointer-events-none" aria-hidden />

          <header
            className="md:hidden sticky top-0 z-30 h-14 shrink-0 chrome-material flex items-center justify-between px-4"
            data-edge={headerEdged ? 'on' : 'off'}
          >
            <Link to="/panel" className="flex items-center gap-2 min-w-0">
              <BrandLogo size="sm" />
              <span className="font-bold text-steam-text text-sm uppercase tracking-tight truncate">
                Skin<span className="text-steam-accent">vestments</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileNavOpen((open) => !open)}
              className="pressable p-2.5 rounded-lg text-steam-text hover:bg-steam-hover border border-steam-border shrink-0"
              aria-expanded={mobileNavOpen}
              aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </header>

          <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
