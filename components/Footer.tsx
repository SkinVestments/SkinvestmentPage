import React from 'react';
import { Apple } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SocialLinks } from '@/components/SocialLinks';
import { GooglePlayIcon } from '@/components/icons/GooglePlayIcon';
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@/constants/appLinks';

export const Footer: React.FC = () => {
  const { user } = useAuth();
  return (
    <footer className="bg-steam-bg border-t border-steam-border/50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-steam-text mb-4 tracking-tight uppercase">
              Skin<span className="text-steam-accent">vestments</span>
            </h3>
            <p className="text-steam-tertiary max-w-sm text-sm leading-relaxed">
              We help CS2 players treat their inventory like a real asset class. 
              Secure, private, and precise tracking for the digital economy.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <SocialLinks />
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-steam-border bg-steam-card text-steam-tertiary transition-colors hover:border-steam-accent/40 hover:bg-steam-hover hover:text-steam-accent"
              >
                <Apple className="h-[18px] w-[18px] shrink-0" aria-hidden />
              </a>
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get it on Google Play"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-steam-border bg-steam-card text-steam-tertiary transition-colors hover:border-steam-accent/40 hover:bg-steam-hover hover:text-steam-accent"
              >
                <GooglePlayIcon size={18} className="shrink-0" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-steam-text font-bold uppercase text-xs tracking-wider mb-6">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/features" className="text-steam-tertiary hover:text-steam-accent transition-colors">Features</Link></li>
              <li>
                <Link
                  to={user ? '/panel' : '/login'}
                  className="text-steam-tertiary hover:text-steam-accent transition-colors"
                >
                  Web Dashboard
                </Link>
              </li>
              <li><span className="text-steam-tertiary cursor-not-allowed">API Access</span></li>
              <li><Link to="/pricing" className="text-steam-tertiary hover:text-steam-accent transition-colors">Pricing</Link></li>
              <li><Link to="/roadmap" className="text-steam-tertiary hover:text-steam-accent transition-colors">Roadmap</Link></li>
              <li><Link to="/blog" className="text-steam-tertiary hover:text-steam-accent transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-steam-text font-bold uppercase text-xs tracking-wider mb-6">Legal & Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/faq" className="text-steam-tertiary hover:text-steam-accent transition-colors">FAQ</Link></li>
              <li><Link to="/privacy" className="text-steam-tertiary hover:text-steam-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-steam-tertiary hover:text-steam-accent transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/contact" className="text-steam-tertiary hover:text-steam-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-steam-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-steam-tertiary text-xs text-center md:text-left">
            © {new Date().getFullYear()} Skinvestments. 
            Powered by Steam. Not affiliated with Valve Corp.{' '}
            <a
              href="https://kjlabs.studio/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-steam-accent hover:underline"
            >
              Created by KJ Labs Studio
            </a>
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-steam-success shrink-0" aria-hidden />
            <span className="text-xs text-steam-tertiary leading-none">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};