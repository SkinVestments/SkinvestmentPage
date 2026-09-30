import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import * as m from 'motion/react-m';
import {
  LayoutDashboard,
  Package,
  History,
  Settings,
  Home,
  BarChart2,
  Library,
  Heart,
  Flame,
  X,
  type LucideIcon,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { BrandLogo } from './BrandLogo';
import { useScrollEdge } from '@/hooks/useScrollEdge';
import {
  drawerPanelVariants,
  drawerScrimVariants,
  fadeCross,
  springDefault,
} from '@/lib/motion';

const navItems: { icon: LucideIcon; label: string; path: string }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/panel' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: Library, label: 'Catalog', path: '/catalog' },
  { icon: Heart, label: 'Wishlist', path: '/wishlist' },
  { icon: Flame, label: 'Drop Challenge', path: '/challenge' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: History, label: 'History', path: '/history' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarPanelProps {
  onNavigate?: () => void;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({ onNavigate }) => {
  const handleNav = () => onNavigate?.();

  return (
    <>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNav}
            className={({ isActive }) =>
              `pressable flex items-center gap-3 px-4 py-2.5 rounded-xl ${
                isActive
                  ? 'bg-steam-accent/10 text-steam-accent font-bold'
                  : 'text-steam-secondary hover:bg-steam-hover hover:text-steam-text font-medium'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-steam-border/50 bg-steam-elevated shrink-0 space-y-3">
        <div className="px-1">
          <p className="dashboard-label mb-2">Appearance</p>
          <ThemeToggle variant="segmented" className="w-full" />
        </div>

        <NavLink
          to="/"
          onClick={handleNav}
          className="pressable flex items-center gap-3 px-4 py-2.5 text-steam-tertiary hover:text-steam-text text-sm font-medium rounded-xl hover:bg-steam-hover"
        >
          <Home className="w-4 h-4 shrink-0" /> Back to Home
        </NavLink>
      </div>
    </>
  );
};

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const desktopSentinelRef = useRef<HTMLDivElement>(null);
  const desktopEdged = useScrollEdge(desktopScrollRef, desktopSentinelRef);

  const drawerScrollRef = useRef<HTMLDivElement>(null);
  const drawerSentinelRef = useRef<HTMLDivElement>(null);
  const drawerEdged = useScrollEdge(drawerScrollRef, drawerSentinelRef);

  useEffect(() => {
    if (!mobileOpen || !onMobileClose) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onMobileClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, onMobileClose]);

  return (
    <>
      {/* Desktop — sticky frosted brand header; nav scrolls underneath */}
      <aside className="w-64 bg-steam-surface border-r border-steam-border hidden md:flex flex-col h-screen fixed left-0 top-0 z-40">
        <div
          ref={desktopScrollRef}
          className="flex-1 flex flex-col min-h-0 overflow-y-auto"
        >
          <div ref={desktopSentinelRef} className="h-px w-full pointer-events-none shrink-0" aria-hidden />
          <div
            className="sticky top-0 z-10 h-14 shrink-0 chrome-material px-6 flex items-center gap-3"
            data-edge={desktopEdged ? 'on' : 'off'}
          >
            <BrandLogo size="sm" />
            <span className="text-sm font-bold text-steam-text tracking-tight uppercase truncate">
              Skin<span className="text-steam-accent">vestments</span>
            </span>
          </div>
          <div className="flex flex-col min-h-0 flex-1">
            <SidebarPanel />
          </div>
        </div>
      </aside>

      <m.button
        type="button"
        className="md:hidden fixed inset-0 z-50 bg-steam-bg/80 backdrop-blur-sm"
        initial={false}
        animate={mobileOpen ? 'visible' : 'hidden'}
        variants={drawerScrimVariants}
        transition={fadeCross}
        style={{ pointerEvents: mobileOpen ? 'auto' : 'none' }}
        onClick={onMobileClose}
        aria-label="Close menu overlay"
        aria-hidden={!mobileOpen}
        tabIndex={mobileOpen ? 0 : -1}
      />

      <m.aside
        className="md:hidden fixed left-0 top-0 z-50 w-[min(100%,280px)] max-w-[85vw] h-full bg-steam-surface border-r border-steam-border flex flex-col shadow-2xl"
        initial={false}
        animate={mobileOpen ? 'visible' : 'hidden'}
        variants={drawerPanelVariants}
        transition={springDefault}
        style={{ pointerEvents: mobileOpen ? 'auto' : 'none' }}
        role="dialog"
        aria-modal={mobileOpen}
        aria-label="Navigation menu"
        aria-hidden={!mobileOpen}
      >
        <div
          ref={drawerScrollRef}
          className="flex-1 flex flex-col min-h-0 overflow-y-auto"
        >
          <div ref={drawerSentinelRef} className="h-px w-full pointer-events-none shrink-0" aria-hidden />
          <div
            className="sticky top-0 z-10 h-14 shrink-0 chrome-material flex items-center justify-end px-4"
            data-edge={drawerEdged ? 'on' : 'off'}
          >
            <button
              type="button"
              onClick={onMobileClose}
              className="pressable p-2 rounded-lg text-steam-secondary hover:text-steam-text hover:bg-steam-hover"
              aria-label="Close menu"
              tabIndex={mobileOpen ? 0 : -1}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col min-h-0 flex-1">
            <SidebarPanel onNavigate={onMobileClose} />
          </div>
        </div>
      </m.aside>
    </>
  );
};
