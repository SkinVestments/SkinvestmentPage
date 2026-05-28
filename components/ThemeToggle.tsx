import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { ThemeMode } from '@/constants/appTheme';

interface ThemeToggleProps {
  /** Icon button for navbar; segmented = Light/Dark pills */
  variant?: 'icon' | 'segmented';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'icon', className = '' }) => {
  const { theme, setTheme, toggleTheme } = useTheme();

  if (variant === 'segmented') {
    const btn = (mode: ThemeMode, label: string) => (
      <button
        key={mode}
        type="button"
        onClick={() => setTheme(mode)}
        className={`flex-1 px-4 py-2 text-xs font-bold rounded-md transition-colors ${
          theme === mode
            ? 'bg-steam-card text-steam-text shadow-md border border-steam-border'
            : 'bg-transparent text-steam-tertiary hover:text-steam-text'
        }`}
        aria-pressed={theme === mode}
      >
        {label}
      </button>
    );

    return (
      <div
        className={`flex bg-steam-elevated rounded-lg p-1 border border-steam-border ${className}`}
        role="group"
        aria-label="Appearance"
      >
        {btn('light', 'Light')}
        {btn('dark', 'Dark')}
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2.5 rounded-lg border border-steam-border bg-steam-surface hover:bg-steam-hover text-steam-secondary hover:text-steam-text transition-colors ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <Sun className="w-4 h-4" aria-hidden /> : <Moon className="w-4 h-4" aria-hidden />}
    </button>
  );
};
