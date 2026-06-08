import React, { useEffect } from 'react';
import { Mail, MessageSquare, Lock, Activity } from 'lucide-react';

const SUPPORT_EMAIL = 'kjlabs.studio@gmail.com';

export const ContactPage: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="min-h-screen bg-steam-bg pt-24 sm:pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Background: Abstract "3D" Cyber Map */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full opacity-10"
              style={{
                backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                transform: 'perspective(1000px) rotateX(20deg)'
              }}
        />
        {/* Glowing Nodes */}
        <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-blue-500 rounded-full animate-ping" />
        <div className="absolute top-[45%] right-[25%] w-2 h-2 bg-purple-500 rounded-full animate-ping delay-700" />
        <div className="absolute bottom-[20%] left-[40%] w-2 h-2 bg-steam-profit rounded-full animate-ping delay-1000" />
        <div className="absolute inset-0 bg-gradient-to-b from-steam-bg via-transparent to-steam-bg" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-10 items-start">
        
        {/* Left Column: Context, Info & Status */}
        <div className="space-y-12 lg:sticky lg:top-32">
          
          {/* Header Section */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              <MessageSquare size={14} /> 24/7 Support
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-steam-text mb-6 leading-tight">
              Got questions? <br />
              <span className="text-steam-accent">We're here to help.</span>
            </h1>
            <p className="text-steam-secondary text-lg leading-relaxed max-w-md">
              Whether you have questions about API limits, enterprise plans, or just want to report a bug — our team is ready.
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="max-w-md">
            <ContactCard
              icon={<Mail />}
              label="Email Support"
              value={SUPPORT_EMAIL}
              sub="Response time: < 2h"
              href={`mailto:${SUPPORT_EMAIL}`}
            />
          </div>

          {/* System Status Panel */}
          <div className="bg-steam-card/50 border border-steam-border/50 rounded-2xl p-6 backdrop-blur-sm">
             <div className="flex items-center gap-3 mb-4">
                <Activity className="text-steam-secondary" size={20} />
                <span className="text-sm font-bold text-steam-text uppercase tracking-wider">System Status</span>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> ALL SYSTEMS OPERATIONAL
                </span>
             </div>
             <div className="space-y-3">
                <StatusItem label="Steam Inventory API" status="online" />
                <StatusItem label="Web Application" status="online" />
             </div>
          </div>
        </div>

        {/* Right Column: The BIG Form */}
        <div className="relative group perspective-1000 lg:mt-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-steam-accent/40 to-purple-600/40 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-steam-card/95 backdrop-blur-xl border border-steam-border rounded-3xl p-8 md:p-12 shadow-2xl min-h-[420px] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-steam-accent/15 flex items-center justify-center text-steam-accent mb-6">
              <Lock size={28} />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              Coming soon
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-steam-text mb-3">Contact form unavailable</h3>
            <p className="text-steam-secondary text-base leading-relaxed max-w-md mb-8">
              We&apos;re setting up secure message delivery. For now, please reach us directly by email — we typically reply within 2 hours.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-steam-accent hover:brightness-110 text-white font-bold rounded-xl shadow-lg theme-shadow-accent transition-all"
            >
              <Mail size={18} />
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Subcomponents ---

// Rozszerzenie propsów o comingSoon
const ContactCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  href?: string;
  action?: string;
  comingSoon?: boolean;
}> = ({ icon, label, value, sub, href, action, comingSoon }) => (
  <div className="bg-steam-card/50 p-5 rounded-xl border border-steam-border/50 hover:border-steam-border transition-colors group flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 rounded-lg theme-subtle flex items-center justify-center text-steam-accent group-hover:scale-110 transition-transform">
        {icon}
      </div>
      
      {/* Znaczek Coming Soon */}
      {comingSoon && (
        <div className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center">
          <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400">
            Coming Soon
          </span>
        </div>
      )}
    </div>
    
    <div className="text-xs font-bold text-steam-tertiary uppercase tracking-wider mb-1">{label}</div>
    {href ? (
      <a href={href} className="text-lg font-bold text-steam-accent hover:underline mb-1 break-all">
        {value}
      </a>
    ) : (
      <div className="text-lg font-bold text-steam-text mb-1">{value}</div>
    )}
    <div className="text-sm text-steam-tertiary">{sub}</div>
    
    {action && (
        <div className="mt-auto pt-4 border-t border-steam-border/50">
            {/* Przycisk dostosowuje się w zależności od tego, czy funkcja jest dostępna, czy "wkrótce" */}
            <button 
              disabled={comingSoon}
              className={`text-sm font-bold flex items-center gap-2 transition-all ${
                comingSoon 
                  ? 'text-steam-tertiary cursor-not-allowed' 
                  : 'text-steam-text hover:gap-3'
              }`}
            >
                {action} {!comingSoon && <span className="text-steam-accent">&rarr;</span>}
            </button>
        </div>
    )}
  </div>
);

const StatusItem: React.FC<{ label: string, status: 'online' | 'offline' }> = ({ label, status }) => (
    <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-steam-hover transition-colors">
        <span className="text-steam-secondary">{label}</span>
        <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase ${status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                {status === 'online' ? 'Operational' : 'Down'}
            </span>
            <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
    </div>
);