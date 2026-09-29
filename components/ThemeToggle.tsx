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
    return (
      <div className={`dashboard-segment w-full ${className}`} role="group" aria-label="Appearance">
        {(['light', 'dark'] as ThemeMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setTheme(mode)}
            aria-pressed={theme === mode}
            className={`dashboard-segment-btn flex-1 capitalize ${
              theme === mode ? 'dashboard-segment-btn-active' : ''
            }`}
          >
            {mode}
          </button>
        ))}
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
