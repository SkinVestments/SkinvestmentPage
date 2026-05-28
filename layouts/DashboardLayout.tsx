import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Menu } from 'lucide-react'; // Ikona hamburgera dla mobile

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-steam-bg text-steam-text overflow-hidden w-full max-w-[100vw]">
      {/* Sidebar (widoczny na desktop) */}
      <Sidebar />

      {/* Główny obszar treści */}
      <div className="flex-1 flex flex-col md:ml-64 h-screen overflow-y-auto overflow-x-hidden relative min-w-0">
        
        {/* Mobile Header (tylko na telefonach, żeby otworzyć menu) */}
        <div className="md:hidden h-16 bg-steam-surface border-b border-steam-border flex items-center justify-between px-4 sticky top-0 z-30">
           <span className="font-bold text-steam-text">Skinvestments</span>
           <button className="text-steam-secondary"><Menu /></button>
        </div>

        {/* Tutaj renderuje się Panel.tsx */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};