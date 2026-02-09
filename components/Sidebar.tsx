import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, History, Settings, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { signOut } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/panel' },
    { icon: Package, label: 'Inventory', path: '/inventory' }, // (Jeszcze nie masz tej strony, ale się przyda)
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-[#171a21] border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-40 hidden md:flex">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 border-b border-white/5 h-20">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-steam-accent to-blue-600 flex items-center justify-center shadow-lg">
           {/* Małe SVG logo */}
           <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
        </div>
        <span className="text-xl font-bold text-white tracking-tight uppercase">
          Skin<span className="text-steam-accent">vest</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-steam-accent/10 text-steam-accent font-bold shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'}
            `}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/5 bg-[#14161b]">
        
        {/* Link powrotu na stronę główną */}
        <NavLink to="/" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white transition-colors text-sm font-medium mb-1">
            <Home className="w-4 h-4" /> Back to Home
        </NavLink>

        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};