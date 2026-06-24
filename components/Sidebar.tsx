import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  History,
  Settings,
  Home,
  BarChart2,
  Library,
  X,
  type LucideIcon,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { BrandLogo } from './BrandLogo';

const navItems: { icon: LucideIcon; label: string; path: string }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/panel' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: Library, label: 'Catalog', path: '/catalog' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: History, label: 'History', path: '/history' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarPanelProps {
  onNavigate?: () => void;
  showClose?: boolean;
  onClose?: () => void;
  hideHeader?: boolean;
}

const SidebarBrandHeader: React.FC<{ showClose?: boolean; onClose?: () => void }> = ({
  showClose,
  onClose,
}) => (
  <div className="p-4 sm:p-6 flex items-center justify-between gap-3 border-b border-steam-border/50 min-h-[4.5rem] shrink-0">
    <div className="flex items-center gap-3 min-w-0">
      <BrandLogo size="md" />
      <span className="text-lg font-bold text-steam-text tracking-tight uppercase truncate">
        Skin<span className="text-steam-accent">vestments</span>
      </span>
    </div>
    {showClose && onClose && (
      <button
        type="button"
        onClick={onClose}
        className="p-2 rounded-lg text-steam-secondary hover:text-steam-text hover:bg-steam-hover shrink-0"
        aria-label="Close menu"
      >
        <X className="w-5 h-5" />
      </button>
    )}
  </div>
);

const SidebarPanel: React.FC<SidebarPanelProps> = ({
  onNavigate,
  showClose,
  onClose,
  hideHeader,
}) => {
  const handleNav = () => onNavigate?.();

  return (
    <>
      {!hideHeader && <SidebarBrandHeader showClose={showClose} onClose={onClose} />}

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNav}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
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
          <p className="text-[10px] font-bold uppercase tracking-widest text-steam-tertiary mb-2">Appearance</p>
          <ThemeToggle variant="segmented" className="w-full" />
        </div>

        <NavLink
          to="/"
          onClick={handleNav}
          className="flex items-center gap-3 px-4 py-2.5 text-steam-tertiary hover:text-steam-text transition-colors text-sm font-medium rounded-xl hover:bg-steam-hover"
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
  return (
    <>
      {/* Desktop */}
      <aside className="w-64 bg-steam-surface border-r border-steam-border hidden md:flex flex-col h-screen fixed left-0 top-0 z-40">
        <div className="p-6 flex items-center gap-3 border-b border-steam-border/50 h-20 shrink-0">
          <BrandLogo size="md" />
          <span className="text-xl font-bold text-steam-text tracking-tight uppercase">
            Skin<span className="text-steam-accent">vestments</span>
          </span>
        </div>
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <SidebarPanel hideHeader />
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button
            type="button"
            className="absolute inset-0 bg-steam-bg/80 backdrop-blur-sm"
            onClick={onMobileClose}
            aria-label="Close menu overlay"
          />
          <aside className="relative w-[min(100%,280px)] max-w-[85vw] h-full bg-steam-surface border-r border-steam-border flex flex-col shadow-2xl animate-fade-in">
            <SidebarPanel showClose onClose={onMobileClose} onNavigate={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  );
};
