import React, { useState, useEffect } from 'react';
import { 
  Mail, MessageSquare, Send, CheckCircle, 
  Loader2, Activity
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0), []);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 2000);
  };

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
              value="kjlabs.studio@gmail.com"
              sub="Response time: < 2h"
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
                <StatusItem label="Pricing Engine (Buff/Skinport)" status="online" />
                <StatusItem label="Web Application" status="online" />
             </div>
          </div>
        </div>

        {/* Right Column: The BIG Form */}
        <div className="relative group perspective-1000 lg:mt-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-steam-accent/40 to-purple-600/40 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-steam-card/95 backdrop-blur-xl border border-steam-border rounded-3xl p-8 md:p-12 shadow-2xl">
            {isSent ? (
              <div className="h-[600px] flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-8">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-bold text-steam-text mb-4">Message Sent!</h3>
                <p className="text-steam-secondary mb-8 text-lg max-w-sm mx-auto">We've received your inquiry and will get back to you shortly.</p>
                <button 
                  onClick={() => setIsSent(false)}
                  className="px-8 py-3 rounded-xl theme-subtle hover:bg-steam-hover text-steam-text font-bold transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-steam-secondary uppercase tracking-widest ml-1">Name</label>
                    <input type="text" required placeholder="John Doe" className="w-full bg-steam-bg border border-steam-border rounded-xl px-5 py-4 text-steam-text focus:outline-none focus:border-steam-accent transition-colors placeholder:text-steam-tertiary text-lg" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-steam-secondary uppercase tracking-widest ml-1">Email</label>
                    <input type="email" required placeholder="john@example.com" className="w-full bg-steam-bg border border-steam-border rounded-xl px-5 py-4 text-steam-text focus:outline-none focus:border-steam-accent transition-colors placeholder:text-steam-tertiary text-lg" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-steam-secondary uppercase tracking-widest ml-1">Subject</label>
                  <div className="relative">
                    <select className="w-full bg-steam-bg border border-steam-border rounded-xl px-5 py-4 text-steam-text focus:outline-none focus:border-steam-accent transition-colors appearance-none cursor-pointer text-lg">
                        <option>General Inquiry</option>
                        <option>Technical Support</option>
                        <option>Billing Question</option>
                        <option>Bug Report</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-steam-tertiary">
                        ▼
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-steam-secondary uppercase tracking-widest ml-1">Message</label>
                  <textarea required rows={6} placeholder="How can we help you?" className="w-full bg-steam-bg border border-steam-border rounded-xl px-5 py-4 text-steam-text focus:outline-none focus:border-steam-accent transition-colors placeholder:text-steam-tertiary resize-none text-lg leading-relaxed"></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-steam-accent hover:opacity-90 text-white font-bold py-5 rounded-xl shadow-lg theme-shadow-accent transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed text-lg mt-4"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : <>Send Message <Send size={20} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Subcomponents ---

// Rozszerzenie propsów o comingSoon
const ContactCard: React.FC<{ icon: React.ReactNode, label: string, value: string, sub: string, action?: string, comingSoon?: boolean }> = ({ icon, label, value, sub, action, comingSoon }) => (
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
    <div className="text-lg font-bold text-steam-text mb-1">{value}</div>
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