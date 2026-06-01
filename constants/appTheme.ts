export type ThemeMode = 'dark' | 'light';

export interface AppThemeTokens {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceOverlay: string;
  surfaceHover: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentVariant: string;
  profit: string;
  loss: string;
  success: string;
  warning: string;
  divider: string;
  cardBorder: string;
}

/** SteamTheme — zgodny z mobilną aplikacją (dark) */
export const darkTheme: AppThemeTokens = {
  background: '#14171D',
  surface: '#1B2838',
  surfaceElevated: '#14171F',
  surfaceOverlay: '#1F2937',
  surfaceHover: '#252B36',
  textPrimary: '#FFFFFF',
  textSecondary: '#8B949E',
  textTertiary: '#58606B',
  accent: '#66C0F4',
  accentVariant: '#4FA8E0',
  profit: '#F5A623',
  loss: '#FF5252',
  success: '#4ADE80',
  warning: '#FF9800',
  divider: '#2A3546',
  cardBorder: '#2A3546',
};

/** LightTheme — zgodny z mobilną aplikacją (light) */
export const lightTheme: AppThemeTokens = {
  background: '#F7F7F7',
  surface: '#FFFFFF',
  surfaceElevated: '#F5F5F5',
  surfaceOverlay: '#FFFFFF',
  surfaceHover: '#EBEBEB',
  textPrimary: '#222222',
  textSecondary: '#717171',
  textTertiary: '#B0B0B0',
  accent: '#FF5A5F',
  accentVariant: '#E04E53',
  profit: '#00A699',
  loss: '#FF5A5F',
  success: '#00A699',
  warning: '#FFB400',
  divider: '#E0E0E0',
  cardBorder: '#EBEBEB',
};

export const THEME_STORAGE_KEY = 'skinvestments_theme';

export const getThemeTokens = (mode: ThemeMode): AppThemeTokens =>
  mode === 'light' ? lightTheme : darkTheme;
