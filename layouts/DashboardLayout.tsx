import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Menu } from 'lucide-react'; // Ikona hamburgera dla mobile

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[#14171D] overflow-hidden">
      {/* Sidebar (widoczny na desktop) */}
      <Sidebar />

      {/* Główny obszar treści */}
      <div className="flex-1 flex flex-col md:ml-64 h-screen overflow-y-auto relative">
        
        {/* Mobile Header (tylko na telefonach, żeby otworzyć menu) */}
        <div className="md:hidden h-16 bg-[#171a21] border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-30">
           <span className="font-bold text-white">Skinvestments</span>
           <button className="text-gray-400"><Menu /></button>
        </div>

        {/* Tutaj renderuje się Panel.tsx */}
        <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};