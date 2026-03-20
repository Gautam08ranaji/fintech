// config/theme.ts

// 🌞 LIGHT THEME
export const lightColors = {
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1E40AF',

  secondary: '#10B981',
  secondaryLight: '#34D399',
  secondaryDark: '#047857',

  success: '#10B981',
  successLight: '#D1FAE5',
  pending: '#FBBF24',
  approved: '#10B981',
  rejected: '#EF4444',

  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  background: '#F9FAFB',
  card: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.5)',

  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#FFFFFF',
  disabled: '#9CA3AF',
  link: '#2563EB',

  border: '#E5E7EB',
  borderDark: '#D1D5DB',
  line: '#E5E7EB',

  shadow: 'rgba(0,0,0,0.1)',
  shadowDark: 'rgba(0,0,0,0.2)',
  modalShadow: 'rgba(0,0,0,0.25)',
};

// 🌙 DARK THEME
export const darkColors = {
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#1D4ED8',

  secondary: '#34D399',
  secondaryLight: '#6EE7B7',
  secondaryDark: '#065F46',

  success: '#34D399',
  successLight: '#064E3B',
  pending: '#FBBF24',
  approved: '#34D399',
  rejected: '#F87171',

  warning: '#FBBF24',
  warningLight: '#78350F',
  error: '#F87171',
  errorLight: '#7F1D1D',
  info: '#60A5FA',
  infoLight: '#1E3A8A',

  background: '#0F172A',   // 🔥 dark background
  card: '#1E293B',         // 🔥 card
  overlay: 'rgba(0,0,0,0.7)',

  text: '#F9FAFB',
  textSecondary: '#94A3B8',
  textLight: '#FFFFFF',
  disabled: '#6B7280',
  link: '#60A5FA',

  border: '#334155',
  borderDark: '#475569',
  line: '#334155',

  shadow: 'rgba(0,0,0,0.5)',
  shadowDark: 'rgba(0,0,0,0.7)',
  modalShadow: 'rgba(0,0,0,0.8)',
};

// ✅ DEFAULT EXPORT (fallback)
export const COLORS = lightColors;