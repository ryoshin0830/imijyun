import React from 'react';
import { Platform } from './platform';

export interface ContainerProps {
  children: React.ReactNode;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'white' | 'gray' | 'primary';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  flex?: boolean;
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Cross-platform Container component
 * Provides consistent layout primitives across platforms
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  padding = 'none',
  margin = 'none',
  background = 'transparent',
  radius = 'none',
  shadow = 'none',
  border = false,
  flex = false,
  direction = 'column',
  align = 'stretch',
  justify = 'flex-start',
  className = '',
  style,
}) => {
  const spacingMap = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  };

  const radiusMap = Platform.select({
    web: {
      none: 0,
      sm: 4,
      md: 8,
      lg: 12,
      full: 9999,
    },
    native: {
      none: 0,
      sm: 4,
      md: 8,
      lg: 12,
      full: 50, // Large enough for most cases
    },
  });

  const backgroundColors = {
    transparent: 'transparent',
    white: '#ffffff',
    gray: '#f9fafb',
    primary: '#f0f9ff',
  };

  const shadowStyles = Platform.select({
    web: {
      none: {},
      sm: { boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
      md: { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
      lg: { boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' },
    },
    native: {
      none: {},
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
      },
    },
  });

  const containerStyles: React.CSSProperties = {
    padding: spacingMap[padding],
    margin: spacingMap[margin],
    backgroundColor: backgroundColors[background],
    borderRadius: radiusMap[radius],
    borderWidth: border ? 1 : 0,
    borderColor: border ? '#e5e7eb' : 'transparent',
    borderStyle: 'solid',
    ...(flex && {
      display: 'flex',
      flexDirection: direction,
      alignItems: align,
      justifyContent: justify,
    }),
    ...shadowStyles[shadow],
    ...style,
  };

  return Platform.select({
    web: (
      <div className={className} style={containerStyles}>
        {children}
      </div>
    ),
    native: (
      // This would be React Native View component in actual implementation
      <div className={className} style={containerStyles}>
        {children}
      </div>
    ),
  });
};