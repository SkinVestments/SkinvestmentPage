import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false); // Mode: false = Login, true = Register
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>(''); // Success message
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
        // --- SIGN UP LOGIC ---
        const { error, data } = await signUp({ email, password });
        
        if (error) {
          setError(error.message);
        } else {
          // Supabase requires email confirmation by default.
          if (!data.session) {
            setMessage('Registration successful! Please check your email to confirm your account.');
          } else {
            // If email confirmation is disabled in Supabase, redirect immediately
            navigate('/panel');
          }
        }
      } else {
        // --- SIGN IN LOGIC ---
        const { error } = await signIn({ email, password });
        if (error) {
          setError('Invalid email or password.');
        } else {
          navigate('/panel');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-[#1e232b] p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-800 animate-fade-in">
        <h2 className="text-2xl font-bold mb-2 text-white text-center">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          {isSignUp ? 'Join Skinvestments' : 'Welcome back!'}
        </p>
        
        {/* Error handling */}
        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-sm border border-red-500/20">
            {error}
          </div>
        )}

        {/* Success message */}
        {message && (
          <div className="bg-green-500/10 text-green-400 p-3 rounded mb-4 text-sm border border-green-500/20">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-[#14171D] border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full bg-[#14171D] border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        {/* Toggle Login / Register */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setMessage('');
              }}
              className="ml-2 text-blue-400 hover:text-blue-300 font-semibold underline transition-colors focus:outline-none"
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