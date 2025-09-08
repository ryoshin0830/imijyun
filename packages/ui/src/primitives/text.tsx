import React from 'react';
import { Platform } from './platform';

export interface TextProps {
  children: React.ReactNode;
  variant?: 'body' | 'heading' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'accent' | 'muted';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Cross-platform Text component
 * Uses platform-specific implementations for optimal rendering
 */
export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color = 'primary',
  size = 'md',
  weight = 'normal',
  align = 'left',
  className = '',
  style,
}) => {
  const baseStyles = Platform.select({
    web: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      margin: 0,
      padding: 0,
    },
    native: {
      fontFamily: 'System',
    },
  });

  const variantStyles = Platform.select({
    web: {
      body: { fontSize: 16, lineHeight: 1.5 },
      heading: { fontSize: 24, lineHeight: 1.3, fontWeight: 'bold' },
      caption: { fontSize: 12, lineHeight: 1.4 },
      label: { fontSize: 14, lineHeight: 1.4, fontWeight: '500' },
    },
    native: {
      body: { fontSize: 16, lineHeight: 22 },
      heading: { fontSize: 24, lineHeight: 30, fontWeight: 'bold' },
      caption: { fontSize: 12, lineHeight: 16 },
      label: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
    },
  })[variant];

  const colorStyles = {
    primary: { color: '#1f2937' },
    secondary: { color: '#6b7280' },
    accent: { color: '#3b82f6' },
    muted: { color: '#9ca3af' },
  }[color];

  const sizeStyles = {
    xs: { fontSize: 12 },
    sm: { fontSize: 14 },
    md: { fontSize: 16 },
    lg: { fontSize: 18 },
    xl: { fontSize: 20 },
  }[size];

  const weightStyles = {
    normal: { fontWeight: 'normal' },
    medium: { fontWeight: '500' },
    semibold: { fontWeight: '600' },
    bold: { fontWeight: 'bold' },
  }[weight];

  const alignStyles = {
    textAlign: align,
  };

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles,
    ...colorStyles,
    ...sizeStyles,
    ...weightStyles,
    ...alignStyles,
    ...style,
  };

  return Platform.select({
    web: (
      <span className={className} style={combinedStyles}>
        {children}
      </span>
    ),
    native: (
      // This would be React Native Text component in actual implementation
      <span className={className} style={combinedStyles}>
        {children}
      </span>
    ),
  });
};