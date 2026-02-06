import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DeepDive } from './components/DeepDive';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { ViewState } from './types';

function App() {
  const [view, setView] = useState<ViewState>('home');

  return (
    <div className="min-h-screen bg-[#14171D] text-white selection:bg-steam-accent selection:text-white font-sans">
      <Navbar currentView={view} setView={setView} />
      
      <main>
        {view === 'home' ? (
          <>
            <Hero setView={setView} />
            <DeepDive />
            <Features />
          </>
        ) : (
          <PrivacyPolicy />
        )}
      </main>

      <Footer setView={setView} />
    </div>
  );
}

export default App;