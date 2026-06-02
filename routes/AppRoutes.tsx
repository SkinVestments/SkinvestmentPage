import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PublicShell } from '@/routes/PublicShell';

import Home from '@/pages/Home';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import { FullFeaturesPage } from '@/pages/FullFeatures';
import { PricingPage } from '@/pages/PricingPage';
import { FAQPage } from '@/pages/FAQPage';
import { RoadmapPage } from '@/pages/RoadmapPage';
import { ContactPage } from '@/pages/ContactPage';
import NotFound from '@/pages/NotFound';
import TermsAndConditionsPage from '@/pages/TermsAndConditionsPage';
import Login from '@/pages/auth/Login';
import AuthCallback from '@/pages/auth/AuthCallback';

import Panel from '@/pages/dashboard/Panel';
import History from '@/pages/dashboard/History';
import Inventory from '@/pages/dashboard/Inventory';
import Analytics from '@/pages/dashboard/Analytics';
import CollectionDetails from '@/pages/dashboard/CollectionDetails';
import ItemDetail from '@/pages/dashboard/ItemDetail';
import Settings from '@/pages/dashboard/Settings';

export const AppRoutes = () => (
  <Routes>
    <Route element={<PublicShell />}>
      <Route path="/" element={<Home />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/features" element={<FullFeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/roadmap" element={<RoadmapPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/terms" element={<TermsAndConditionsPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>

    <Route
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/panel" element={<Panel />} />
      <Route path="/history" element={<History />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/collection/:id" element={<CollectionDetails />} />
      <Route path="/item/:itemId" element={<ItemDetail />} />
      <Route path="/settings" element={<Settings />} />
    </Route>
  </Routes>
);
