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
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/panel` 
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-[#1e232b] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 animate-fade-in relative overflow-hidden">
        
        <h2 className="text-2xl font-bold mb-2 text-white text-center">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
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
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-bold transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button 
            onClick={() => handleOAuthLogin('apple')}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 border border-gray-700 text-white py-3 px-4 rounded-xl font-bold transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 384 512">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">or email</span>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        {/* --- FORMULARZ EMAIL --- */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              className="w-full bg-[#14171D] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-[#14171D] border border-gray-700 rounded-xl p-3 pr-10 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* POLE POTWIERDZENIA HASŁA */}
          {isSignUp && (
            <div className="animate-fade-in-up">
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full bg-[#14171D] border border-gray-700 rounded-xl p-3 pr-10 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none transition-colors"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-blue-500/20"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
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