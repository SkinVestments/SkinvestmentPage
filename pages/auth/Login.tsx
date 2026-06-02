import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false); 
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>(''); 
  
  // Stany dla widoczności haseł
  const [showPassword, setShowPassword] = useState<boolean>(false);   
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false); 
  
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }

        const { error, data } = await signUp({ email, password });
        
        if (error) {
          setError(error.message);
        } else {
          if (!data.session) {
            setMessage('Registration successful! Please check your email to confirm your account.');
          } else {
            navigate('/panel');
          }
        }
      } else {
        try {
          await signIn({ email, password });
          navigate('/panel');
        } catch (signInErr: any) {
          setError(signInErr.message || 'Invalid email or password.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    try {
      setError('');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/panel`,
          queryParams: provider === 'apple' ? { scope: 'name email' } : undefined,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;

      if (!data?.url) {
        throw new Error('OAuth URL was not generated.');
      }

      window.location.assign(data.url);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-steam-card p-8 rounded-2xl shadow-2xl w-full max-w-md border border-steam-border animate-fade-in relative overflow-hidden">
        
        <h2 className="text-2xl font-bold mb-2 text-steam-text text-center">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>
        <p className="text-steam-secondary text-center mb-6 text-sm">
          {isSignUp ? 'Join Skinvestments' : 'Welcome back!'}
        </p>
        
        {/* Obsługa błędów */}
        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm border border-red-500/20 font-medium text-center">
            {error}
          </div>
        )}

        {/* Komunikat sukcesu */}
        {message && (
          <div className="bg-green-500/10 text-green-400 p-3 rounded-lg mb-4 text-sm border border-green-500/20 font-medium text-center">
            {message}
          </div>
        )}

        {/* --- PRZYCISKI GOOGLE I APPLE --- */}
        <div className="flex flex-col gap-3 mb-6">
          <button 
            onClick={() => handleOAuthLogin('google')}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-steam-card border border-steam-border hover:bg-steam-hover text-steam-text py-3 px-4 rounded-xl font-bold transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-steam-border"></div>
          <span className="text-xs font-bold text-steam-tertiary uppercase tracking-widest">or email</span>
          <div className="flex-1 h-px bg-steam-border"></div>
        </div>

        {/* --- FORMULARZ EMAIL --- */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-steam-secondary text-xs font-bold uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              className="theme-input w-full rounded-xl p-3 transition-colors"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-steam-secondary text-xs font-bold uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="theme-input w-full rounded-xl p-3 pr-10 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-steam-tertiary hover:text-steam-secondary focus:outline-none transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* POLE POTWIERDZENIA HASŁA */}
          {isSignUp && (
            <div className="animate-fade-in-up">
              <label className="block text-steam-secondary text-xs font-bold uppercase tracking-wider mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="theme-input w-full rounded-xl p-3 pr-10 transition-colors"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-steam-tertiary hover:text-steam-secondary focus:outline-none transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-steam-accent hover:opacity-90 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-steam-secondary">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setMessage('');
                setConfirmPassword('');
                setShowPassword(false);
                setShowConfirmPassword(false);
              }}
              className="ml-2 text-blue-400 hover:text-blue-300 font-bold transition-colors focus:outline-none"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;