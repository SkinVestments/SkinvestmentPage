import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const PublicShell = () => (
  <div className="min-h-screen bg-steam-bg text-steam-text selection:bg-steam-accent selection:text-steam-text font-sans flex flex-col overflow-x-hidden w-full">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);
