import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { FullFeaturesPage } from './pages/FullFeatures';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  return (
<HashRouter>
      <div className="min-h-screen bg-[#14171D] text-white selection:bg-steam-accent selection:text-white font-sans">
        <Navbar />
        <ScrollToTop />
        <main>
          <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/features" element={<FullFeaturesPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;