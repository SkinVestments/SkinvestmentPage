import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { ScrollToTop } from '@/components/ScrollToTop';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { CookieConsentBanner } from '@/components/consent/CookieConsentBanner';
import { AppRoutes } from '@/routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MotionProvider>
          <BrowserRouter>
            <ScrollToTop />
            <CookieConsentBanner />
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </BrowserRouter>
        </MotionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
