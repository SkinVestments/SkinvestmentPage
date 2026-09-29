import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { adminIsAdmin } from '@/utils/adminPortfolio';

interface AdminGateProps {
  children: React.ReactNode;
}

/** UX-only gate. Real protection is RPC admin_assert_caller(). */
export const AdminGate: React.FC<AdminGateProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (authLoading) return;
      if (!user) {
        if (!cancelled) {
          setAllowed(false);
          setChecking(false);
        }
        return;
      }

      setChecking(true);
      const ok = await adminIsAdmin();
      if (!cancelled) {
        setAllowed(ok);
        setChecking(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-steam-bg text-steam-text flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-steam-accent" />
        <span className="text-sm text-steam-secondary">Checking admin access…</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed) {
    return <Navigate to="/panel" replace />;
  }

  return <>{children}</>;
};
