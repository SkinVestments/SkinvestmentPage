import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

import Home from './pages/Home';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { FullFeaturesPage } from './pages/FullFeatures';
import { PricingPage } from './pages/PricingPage';
import { FAQPage } from './pages/FAQPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ContactPage } from './pages/ContactPage';
//Auth
import { AuthLayout } from './layouts/AuthLayout';
import Login from './pages/Login';
import Panel from './pages/Panel';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
<AuthProvider>
    <HashRouter>
          <div className="min-h-screen bg-[#14171D] text-white selection:bg-steam-accent selection:text-white font-sans">
            <Navbar />
            <ScrollToTop />
            <main>
              <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/features" element={<FullFeaturesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/contact" element={<ContactPage />} />

                <Route element={<AuthLayout />}>
              
                  {/* Login musi być tutaj, żeby mieć dostęp do funkcji signIn() */}
                  <Route path="/login" element={<Login />} />

                  {/* Panel jest chroniony - wejście tylko dla zalogowanych */}
                  <Route path="/panel" 
                    element={
                      <ProtectedRoute>
                        <Panel />
                      </ProtectedRoute>
                    }/>
                  </Route>
              </Routes>
            </main>

            <Footer />
          </div>
    </HashRouter>
</AuthProvider>
  );
}

export default App;