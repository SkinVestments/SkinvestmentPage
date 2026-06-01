import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { BrandLogo } from '../components/BrandLogo';
import { Menu, X } from 'lucide-react';

export const DashboardLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

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
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 flex flex-col md:ml-64 h-screen overflow-hidden min-w-0 w-full">
        <header className="md:hidden h-14 shrink-0 bg-steam-surface border-b border-steam-border flex items-center justify-between px-4 z-30">
          <Link to="/panel" className="flex items-center gap-2 min-w-0">
            <BrandLogo size="sm" />
            <span className="font-bold text-steam-text text-sm uppercase tracking-tight truncate">
              Skin<span className="text-steam-accent">vestments</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileNavOpen((open) => !open)}
            className="p-2.5 rounded-lg text-steam-text hover:bg-steam-hover border border-steam-border transition-colors shrink-0"
            aria-expanded={mobileNavOpen}
            aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
