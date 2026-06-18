import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { usePageSeo } from '@/hooks/usePageSeo';

const AuthCallback = () => {
  usePageSeo({
    title: 'Signing in — Skinvestments',
    description: 'Completing sign-in to Skinvestments.',
    path: '/auth/callback',
    robots: 'noindex, nofollow',
  });

  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const finalizeOAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const next = params.get('next') || '/panel';

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error('OAuth session was not created. Check Supabase Apple provider settings.');
        }

        navigate(next, { replace: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'OAuth login failed.';
        setError(message);
      }
    };

    finalizeOAuth();
  }, [navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-steam-card border border-steam-border rounded-2xl p-6 w-full max-w-md text-center">
        {error ? (
          <>
            <p className="text-red-400 font-semibold mb-2">Apple login failed</p>
            <p className="text-steam-secondary text-sm mb-4">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="px-4 py-2 rounded-lg bg-steam-accent text-white font-semibold"
            >
              Back to login
            </button>
          </>
        ) : (
          <>
            <p className="text-steam-text font-semibold">Finalizing login...</p>
            <p className="text-steam-secondary text-sm mt-2">Please wait a moment.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
