// Application Theme Configuration
export const theme = {
  colors: {
    primary: '#2563EB',
    primaryLight: '#EFF6FF',
    primaryDark: '#1D4ED8',
    secondary: '#0F172A',
    accent: '#F59E0B',
    accentLight: '#FEF3C7',
    success: '#10B981',
    successLight: '#D1FAE5',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    warning: '#F97316',
    
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',
    
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    divider: '#E2E8F0',
    
    rating: '#FBBF24',
    badge: '#EF4444',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  
  shadows: {
    small: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  typography: {
    h1: { fontSize: 26, fontWeight: '700', lineHeight: 32 },
    h2: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
    h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    subtitle1: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
    subtitle2: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
    body1: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
    body2: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
    caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
    button: { fontSize: 15, fontWeight: '600' },
  },
};
