import React from 'react';

type ShimmerProps = React.HTMLAttributes<HTMLDivElement>;

export const Shimmer: React.FC<ShimmerProps> = ({ className = '', ...props }) => (
  <div className={`shimmer rounded-lg ${className}`} aria-hidden {...props} />
);
