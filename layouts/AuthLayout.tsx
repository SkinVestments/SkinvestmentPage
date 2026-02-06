import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

// Ten komponent owija swoje dzieci w AuthProvider.
// Dzięki Outlet, możemy w nim zagnieżdżać inne Route'y.
export const AuthLayout = () => {
  return (
    <AuthProvider>
      {/* Tutaj renderują się podstrony (Login, Panel, itp.) */}
      <Outlet />
    </AuthProvider>
  );
};