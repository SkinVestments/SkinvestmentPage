import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

function App() {
  return (
<HashRouter>
      <div className="min-h-screen bg-[#14171D] text-white selection:bg-steam-accent selection:text-white font-sans">
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;