// App-wide constants shared between web and mobile

export const APP_NAME = 'Monorepo App';

export const THEME = {
  colors: {
    background: '#0a0a0f',
    surface: '#12121a',
    border: '#1e1e2e',
    text: '#e4e4ed',
    textMuted: '#8888a0',
    accent: '#ff6b35',
    accentGlow: 'rgba(255, 107, 53, 0.3)',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  },
  fonts: {
    mono: 'Space Mono',
    serif: 'Instrument Serif',
  },
} as const;

export const API_CONFIG = {
  // Add any shared API configuration here
  DEFAULT_PAGE_SIZE: 20,
  MAX_MESSAGE_LENGTH: 1000,
  MAX_TASK_LENGTH: 500,
} as const;
