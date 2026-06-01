import React from 'react';
import { Github, Twitter, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
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
            <div className="mt-6 flex gap-4">
                <a href="#" className="w-8 h-8 rounded bg-steam-surface flex items-center justify-center text-steam-secondary hover:text-steam-text hover:bg-steam-accent transition-all">
                    <Twitter size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded bg-steam-surface flex items-center justify-center text-steam-secondary hover:text-steam-text hover:bg-[#5865F2] transition-all">
                    <MessageSquare size={16} /> {/* Discord proxy */}
                </a>
                <a href="#" className="w-8 h-8 rounded bg-steam-surface flex items-center justify-center text-steam-secondary hover:text-steam-text hover:theme-subtle-strong transition-all">
                    <Github size={16} />
                </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-steam-text font-bold uppercase text-xs tracking-wider mb-6">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/features" className="text-steam-tertiary hover:text-steam-accent transition-colors">Features</Link></li>
              <li><span className="text-steam-tertiary cursor-not-allowed">Web Dashboard (Beta)</span></li>
              <li><span className="text-steam-tertiary cursor-not-allowed">API Access</span></li>
              <li><Link to="/pricing" className="text-steam-tertiary hover:text-steam-accent transition-colors">Pricing</Link></li>
              <li><Link to="/roadmap" className="text-steam-tertiary hover:text-steam-accent transition-colors">Roadmap</Link></li>
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
          <p className="text-steam-tertiary text-xs">
            © {new Date().getFullYear()} Skinvestments. 
            Powered by Steam. Not affiliated with Valve Corp.
          </p>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-steam-success"></span>
            <span className="text-xs text-steam-tertiary">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};