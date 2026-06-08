import React from 'react';

export const RouteFallback: React.FC = () => (
  <div className="min-h-[40vh] flex items-center justify-center bg-steam-bg">
    <div
      className="w-8 h-8 border-2 border-steam-accent border-t-transparent rounded-full animate-spin"
      role="status"
      aria-label="Loading"
    />
  </div>
);
