import '@fontsource/outfit/latin-300.css';
import '@fontsource/outfit/latin-400.css';
import '@fontsource/outfit/latin-500.css';
import '@fontsource/outfit/latin-600.css';
import '@fontsource/outfit/latin-700.css';
import '@fontsource/space-grotesk/latin-300.css';
import '@fontsource/space-grotesk/latin-400.css';
import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/space-grotesk/latin-600.css';
import '@fontsource/space-grotesk/latin-700.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { applyThemeToDocument } from './context/ThemeContext';
import { THEME_STORAGE_KEY } from './constants/appTheme';

import { initDeferredAnalytics } from './utils/analytics';

const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
applyThemeToDocument(storedTheme === 'light' ? 'light' : 'dark');

initDeferredAnalytics();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
