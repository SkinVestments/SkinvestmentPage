import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PublicShell } from '@/routes/PublicShell';
import { RouteFallback } from '@/components/ui/RouteFallback';

import Home from '@/pages/Home';

const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const FullFeaturesPage = lazy(() =>
  import('@/pages/FullFeatures').then((m) => ({ default: m.FullFeaturesPage })),
);
const PricingPage = lazy(() =>
  import('@/pages/PricingPage').then((m) => ({ default: m.PricingPage })),
);
const FAQPage = lazy(() => import('@/pages/FAQPage').then((m) => ({ default: m.FAQPage })));
const RoadmapPage = lazy(() =>
  import('@/pages/RoadmapPage').then((m) => ({ default: m.RoadmapPage })),
);
const ContactPage = lazy(() =>
  import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })),
);
const NotFound = lazy(() => import('@/pages/NotFound'));
const TermsAndConditionsPage = lazy(() => import('@/pages/TermsAndConditionsPage'));
const Login = lazy(() => import('@/pages/auth/Login'));
const AuthCallback = lazy(() => import('@/pages/auth/AuthCallback'));

const Panel = lazy(() => import('@/pages/dashboard/Panel'));
const History = lazy(() => import('@/pages/dashboard/History'));
const Inventory = lazy(() => import('@/pages/dashboard/Inventory'));
const Catalog = lazy(() => import('@/pages/dashboard/Catalog'));
const Wishlist = lazy(() => import('@/pages/dashboard/Wishlist'));
const Analytics = lazy(() => import('@/pages/dashboard/Analytics'));
const CollectionDetails = lazy(() => import('@/pages/dashboard/CollectionDetails'));
const ItemDetail = lazy(() => import('@/pages/dashboard/ItemDetail'));
const Settings = lazy(() => import('@/pages/dashboard/Settings'));

export const AppRoutes = () => (
  <Suspense fallback={<RouteFallback />}>
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
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/collection/:id" element={<CollectionDetails />} />
        <Route path="/item/:itemId" element={<ItemDetail />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  </Suspense>
);
