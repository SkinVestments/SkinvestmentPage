import React, { useState, useEffect } from 'react';
import { Menu, X, User, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { GetAppButton } from './GetAppButton';
import { BrandLogo } from './BrandLogo';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Pobieramy stan użytkownika
  const { user } = useAuth();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
      isScrolled ? 'bg-steam-surface/95 backdrop-blur-md border-steam-border py-3 shadow-lg' : 'bg-transparent border-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center gap-3 min-w-0">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0 shrink"
        >
          <BrandLogo className="group-hover:shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_25%,transparent)] transition-all" />
          <span className="text-lg sm:text-2xl font-bold tracking-tight text-steam-text uppercase truncate">
            Skin<span className="text-steam-accent">vestments</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-semibold uppercase tracking-wider transition-colors ${location.pathname === '/' ? 'text-steam-accent' : 'text-steam-secondary hover:text-steam-text'}`}
          >
            Home
          </Link>
          <Link
            to="/blog"
            className={`text-sm font-semibold uppercase tracking-wider transition-colors ${location.pathname.startsWith('/blog') ? 'text-steam-accent' : 'text-steam-secondary hover:text-steam-text'}`}
          >
            Blog
          </Link>
          <Link
            to="/privacy"
            className={`text-sm font-semibold uppercase tracking-wider transition-colors ${location.pathname === '/privacy' ? 'text-steam-accent' : 'text-steam-secondary hover:text-steam-text'}`}
          >
            Privacy
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-semibold uppercase tracking-wider transition-colors ${location.pathname === '/contact' ? 'text-steam-accent' : 'text-steam-secondary hover:text-steam-text'}`}
          >
            Contact
          </Link>

          {user ? (
            <Link
              to="/panel"
              className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
                location.pathname.startsWith('/panel') || location.pathname.startsWith('/history') || location.pathname.startsWith('/inventory') || location.pathname.startsWith('/analytics') || location.pathname.startsWith('/settings') || location.pathname.startsWith('/collection')
                  ? 'text-steam-accent'
                  : 'text-steam-secondary hover:text-steam-text'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Panel
            </Link>
          ) : (
            <Link
              to="/login"
              className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
                location.pathname === '/login' ? 'text-steam-accent' : 'text-steam-secondary hover:text-steam-text'
              }`}
            >
              <User className="w-4 h-4" />
              Log In
            </Link>
          )}

          <ThemeToggle />

          <GetAppButton />
        </div>

        {/* Mobile: theme + menu */}
        <div className="flex items-center gap-2 md:hidden shrink-0">
          <ThemeToggle />
          <button
            type="button"
            className="text-steam-text hover:text-steam-accent transition-colors p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-steam-surface border-b border-steam-border p-6 flex flex-col gap-4 md:hidden animate-fade-in shadow-2xl">
          <Link 
            to="/" 
            onClick={closeMobileMenu}
            className="text-left text-lg font-bold uppercase text-steam-secondary hover:text-steam-accent"
          >
            Home
          </Link>
          <Link
            to="/blog"
            onClick={closeMobileMenu}
            className="text-left text-lg font-bold uppercase text-steam-secondary hover:text-steam-accent"
          >
            Blog
          </Link>
          <Link 
            to="/privacy" 
            onClick={closeMobileMenu}
            className="text-left text-lg font-bold uppercase text-steam-secondary hover:text-steam-accent"
          >
            Privacy Policy
          </Link>
          <Link 
            to="/contact" 
            onClick={closeMobileMenu}
            className="text-left text-lg font-bold uppercase text-steam-secondary hover:text-steam-accent"
          >
            Contact
          </Link>

          {user ? (
             <Link 
              to="/panel" 
              onClick={closeMobileMenu}
              className="flex items-center gap-2 text-left text-lg font-bold uppercase text-steam-secondary hover:text-steam-accent"
            >
              <LayoutDashboard className="w-5 h-5" />
              Panel
            </Link>
          ) : (
            <Link 
              to="/login" 
              onClick={closeMobileMenu}
              className="flex items-center gap-2 text-left text-lg font-bold uppercase text-steam-secondary hover:text-steam-accent"
            >
              <User className="w-5 h-5" />
              Log In
            </Link>
          )}

          <div className="pt-2 border-t border-steam-border">
            <p className="text-[10px] font-bold uppercase tracking-widest text-steam-tertiary mb-2">Appearance</p>
            <ThemeToggle variant="segmented" className="w-full" />
          </div>

          <GetAppButton variant="mobile" onNavigate={closeMobileMenu} />
        </div>
      )}
    </nav>
  );
};