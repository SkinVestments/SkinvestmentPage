import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      
      <div className="text-steam-accent mb-6 animate-pulse">
        <AlertTriangle className="w-24 h-24 mx-auto opacity-80" />
      </div>
      
      <h1 className="text-7xl font-bold text-white mb-4 tracking-tighter drop-shadow-lg">
        404
      </h1>
      
      <h2 className="text-2xl font-bold text-gray-300 mb-6 uppercase tracking-wider">
        Page Not Found
      </h2>
      
      <p className="text-gray-500 max-w-md mb-10">
        It looks like you've wandered into the unknown. The page you are looking for doesn't exist, has been moved, or you don't have access to it.
      </p>
      
      <Link 
        to="/" 
        className="bg-steam-accent hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 uppercase tracking-wide"
      >
        <Home className="w-5 h-5" />
        Return to Home
      </Link>
      
    </div>
  );
};

export default NotFound;