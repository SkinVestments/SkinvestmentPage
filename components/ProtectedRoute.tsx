import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Możesz tu wstawić ładny spinner ładowania
    return <div className="text-white p-10">Ładowanie uprawnień...</div>;
  }

  if (!user) {
    // Jeśli brak użytkownika, przekieruj do logowania
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};