import { Platform, Dimensions } from 'react-native';
import { IMIJUN_COLORS } from '@imijun/core';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// デバイスサイズ判定
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isTablet = SCREEN_WIDTH >= 768;

// 共通カラー
export const Colors = {
  light: {
    primary: IMIJUN_COLORS.subject,
    secondary: IMIJUN_COLORS.verb,
    accent: IMIJUN_COLORS.object,
    place: IMIJUN_COLORS.place,
    time: IMIJUN_COLORS.time,
    
    background: '#ffffff',
    surface: '#f8f9fa',
    card: '#ffffff',
    
    text: '#1f2937',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    textInverse: '#ffffff',
    
    border: '#e5e7eb',
    divider: '#f3f4f6',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    primary: IMIJUN_COLORS.subject,
    secondary: IMIJUN_COLORS.verb,
    accent: IMIJUN_COLORS.object,
    place: IMIJUN_COLORS.place,
    time: IMIJUN_COLORS.time,
    
    background: '#0f0f10',
    surface: '#1a1a1b',
    card: '#242426',
    
    text: '#f3f4f6',
    textSecondary: '#d1d5db',
    textTertiary: '#9ca3af',
    textInverse: '#1f2937',
    
    border: '#374151',
    divider: '#1f2937',
    
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

// タイポグラフィ
export const Typography = {
  display: {
    fontSize: isSmallDevice ? 32 : 36,
    lineHeight: isSmallDevice ? 40 : 44,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: isSmallDevice ? 28 : 32,
    lineHeight: isSmallDevice ? 36 : 40,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: isSmallDevice ? 24 : 28,
    lineHeight: isSmallDevice ? 32 : 36,
    fontWeight: '700' as const,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: isSmallDevice ? 20 : 24,
    lineHeight: isSmallDevice ? 28 : 32,
    fontWeight: '600' as const,
  },
  h4: {
    fontSize: isSmallDevice ? 18 : 20,
    lineHeight: isSmallDevice ? 24 : 28,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: isSmallDevice ? 14 : 16,
    lineHeight: isSmallDevice ? 20 : 24,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontSize: isSmallDevice ? 14 : 16,
    lineHeight: isSmallDevice ? 20 : 24,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: isSmallDevice ? 12 : 14,
    lineHeight: isSmallDevice ? 16 : 20,
    fontWeight: '400' as const,
  },
  small: {
    fontSize: isSmallDevice ? 11 : 12,
    lineHeight: isSmallDevice ? 14 : 16,
    fontWeight: '400' as const,
  },
};

// スペーシング
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ボーダー半径
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// シャドウスタイル
export const Shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: {
      elevation: 8,
    },
  }),
  xl: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    android: {
      elevation: 12,
    },
  }),
};

// アニメーション設定
export const Animation = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
  spring: {
    damping: 15,
    mass: 1,
    stiffness: 150,
  },
};

// レイアウト定数
export const Layout = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isSmallDevice,
  isTablet,
  tabBarHeight: 60,
  headerHeight: Platform.OS === 'ios' ? 44 : 56,
  statusBarHeight: Platform.OS === 'ios' ? 44 : 0,
  contentPadding: isTablet ? 32 : 20,
};

// アクセシビリティ
export const Accessibility = {
  minTouchTarget: 44,
  focusedOpacity: 0.8,
  disabledOpacity: 0.4,
};