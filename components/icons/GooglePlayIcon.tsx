import React from 'react';

interface GooglePlayIconProps {
  size?: number;
  className?: string;
}

export const GooglePlayIcon: React.FC<GooglePlayIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.601-.92V2.734a.996.996 0 0 1 .6-.92zm10.89 10.893 2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198 2.807 1.626a1 1 0 0 1 0 1.739l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658 16.8 8.99l-2.302 2.302-8.634-8.634z" />
  </svg>
);
