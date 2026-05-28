import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  THEME_STORAGE_KEY,
  ThemeMode,
  AppThemeTokens,
  getThemeTokens,
} from '@/constants/appTheme';

interface ThemeContextValue {
  theme: ThemeMode;
  tokens: AppThemeTokens;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const applyThemeToDocument = (mode: ThemeMode) => {
  const tokens = getThemeTokens(mode);
  const root = document.documentElement;

  root.setAttribute('data-theme', mode);
  root.style.colorScheme = mode;

  const entries: [string, string][] = [
    ['--color-background', tokens.background],
    ['--color-surface', tokens.surface],
    ['--color-surface-elevated', tokens.surfaceElevated],
    ['--color-surface-overlay', tokens.surfaceOverlay],
    ['--color-surface-hover', tokens.surfaceHover],
    ['--color-text-primary', tokens.textPrimary],
    ['--color-text-secondary', tokens.textSecondary],
    ['--color-text-tertiary', tokens.textTertiary],
    ['--color-accent', tokens.accent],
    ['--color-accent-variant', tokens.accentVariant],
    ['--color-profit', tokens.profit],
    ['--color-loss', tokens.loss],
    ['--color-success', tokens.success],
    ['--color-warning', tokens.warning],
    ['--color-divider', tokens.divider],
    ['--color-card-border', tokens.cardBorder],
  ];

  for (const [key, value] of entries) {
    root.style.setProperty(key, value);
  }
};

const readStoredTheme = (): ThemeMode => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* ignore */
  }
  return 'dark';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(readStoredTheme);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    applyThemeToDocument(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      tokens: getThemeTokens(theme),
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
