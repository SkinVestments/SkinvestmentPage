import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Komponenty globalne
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouty
import { DashboardLayout } from './layouts/DashboardLayout'; // <--- Upewnij się, że ten plik istnieje (z poprzedniego kroku)

// Strony Publiczne
import Home from './pages/Home';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { FullFeaturesPage } from './pages/FullFeatures';
import { PricingPage } from './pages/PricingPage';
import { FAQPage } from './pages/FAQPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ContactPage } from './pages/ContactPage';
import Login from './pages/auth/Login';
import History from './pages/dashboard/History';

// Strony Prywatne (Panel)
import Panel from './pages/dashboard/Panel';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <ScrollToTop /> {/* Przewija na górę przy zmianie strony */}
        
        <Routes>
          
          {/* === UKŁAD 1: STRONY PUBLICZNE (Navbar + Footer) === */}
          {/* Używamy elementu <div...>, żeby owinąć te strony w Navbar i Footer */}
          <Route element={
            <div className="min-h-screen bg-[#14171D] text-white selection:bg-steam-accent selection:text-white font-sans flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Outlet /> {/* W tym miejscu renderują się poniższe Route'y */}
              </main>
              <Footer />
            </div>
          }>
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/features" element={<FullFeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* === UKŁAD 2: APLIKACJA / PANEL (Sidebar, brak Navbara/Footera) === */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout /> {/* To zawiera Sidebar i miejsce na treść */}
            </ProtectedRoute>
          }>
            <Route path="/panel" element={<Panel />} />
            {/* Tutaj w przyszłości dodasz: */}
            {/* <Route path="/inventory" element={<Inventory />} /> */}
            {/* <Route path="/settings" element={<Settings />} /> */}
            <Route path="/history" element={<History />} />
          </Route>

        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;