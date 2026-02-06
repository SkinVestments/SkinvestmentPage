import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "relative px-6 py-3 rounded-md font-semibold transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden tracking-wide";
  
  const variants = {
    primary: "bg-gradient-to-r from-steam-accent to-blue-500 text-white shadow-[0_4px_20px_rgba(102,192,244,0.3)] hover:shadow-[0_4px_25px_rgba(102,192,244,0.5)] hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-steam-light text-white hover:bg-white/10 hover:text-steam-accent border border-transparent",
    outline: "bg-transparent text-steam-secondary border border-steam-secondary/30 hover:border-steam-accent hover:text-steam-accent hover:bg-steam-accent/5",
    ghost: "bg-transparent text-steam-secondary hover:text-white"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
      )}
    </button>
  );
};