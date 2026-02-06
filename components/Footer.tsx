import React from 'react';
import { Github, Twitter, Mail, MessageSquare } from 'lucide-react';
import { ViewState } from '../types';

interface FooterProps {
    setView: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="bg-[#14171D] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight uppercase">
              Skin<span className="text-steam-accent">vestments</span>
            </h3>
            <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
              We help CS2 players treat their inventory like a real asset class. 
              Secure, private, and precise tracking for the digital economy.
            </p>
            <div className="mt-6 flex gap-4">
                <a href="#" className="w-8 h-8 rounded bg-[#1B2838] flex items-center justify-center text-gray-400 hover:text-white hover:bg-steam-accent transition-all">
                    <Twitter size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded bg-[#1B2838] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#5865F2] transition-all">
                    <MessageSquare size={16} /> {/* Discord proxy */}
                </a>
                <a href="#" className="w-8 h-8 rounded bg-[#1B2838] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all">
                    <Github size={16} />
                </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-6">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => setView('home')} className="text-gray-500 hover:text-steam-accent transition-colors">Features</button></li>
              <li><span className="text-gray-600 cursor-not-allowed">Web Dashboard (Beta)</span></li>
              <li><span className="text-gray-600 cursor-not-allowed">API Access</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-6">Legal & Support</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => setView('privacy')} className="text-gray-500 hover:text-steam-accent transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => setView('privacy')} className="text-gray-500 hover:text-steam-accent transition-colors">Terms of Service</button></li>
              <li><a href="mailto:kjlabs.studio@gmail.com" className="text-gray-500 hover:text-steam-accent transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Skinvestments. 
            Powered by Steam. Not affiliated with Valve Corp.
          </p>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-steam-success"></span>
            <span className="text-xs text-gray-500">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};