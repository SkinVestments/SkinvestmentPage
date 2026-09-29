import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminGate } from '@/components/admin/AdminGate';

/**
 * Wire into AppRoutes.tsx (only change needed in an existing file):
 *
 *   import { adminPortfolioRoute } from '@/routes/adminRoutes';
 *   // inside <Routes>:
 *   {adminPortfolioRoute}
 *
 * Path: /admin/portfolio (noindex, not linked from public nav).
 */
const AdminPortfolioLookup = lazy(() => import('@/pages/admin/AdminPortfolioLookup'));

export const adminPortfolioRoute = (
  <Route
    key="admin-portfolio"
    path="/admin/portfolio"
    element={
      <ProtectedRoute>
        <AdminGate>
          <AdminPortfolioLookup />
        </AdminGate>
      </ProtectedRoute>
    }
  />
);
