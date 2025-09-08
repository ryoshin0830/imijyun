import React from 'react';
import { Platform } from './platform';
import { Text } from './text';
import { Container } from './container';
import { IMIJUN_COLORS } from '@imijun/core';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Cross-platform Button component
 * Provides consistent button styling and behavior
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
  className = '',
  style,
}) => {
  const sizeStyles = {
    sm: {
      padding: '8px 12px',
      fontSize: 14,
    },
    md: {
      padding: '12px 16px',
      fontSize: 16,
    },
    lg: {
      padding: '16px 24px',
      fontSize: 18,
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: IMIJUN_COLORS.verb,
      color: 'white',
      borderColor: IMIJUN_COLORS.verb,
    },
    secondary: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      borderColor: '#e5e7eb',
    },
    outline: {
      backgroundColor: 'transparent',
      color: IMIJUN_COLORS.verb,
      borderColor: IMIJUN_COLORS.verb,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: IMIJUN_COLORS.verb,
      borderColor: 'transparent',
    },
  };

  const baseStyles: React.CSSProperties = {
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    fontWeight: '500',
    textAlign: 'center',
    transition: Platform.select({
      web: 'all 0.2s ease-in-out',
      native: undefined,
    }),
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  const combinedStyles = {
    ...baseStyles,
    ...style,
  };

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  const ButtonContent = () => (
    <Container flex direction="row" align="center" justify="center">
      {loading && (
        <Text color="accent" size="sm" style={{ marginRight: 8 }}>
          ...
        </Text>
      )}
      {typeof children === 'string' ? (
        <Text 
          color={variant === 'primary' ? 'primary' : 'accent'}
          weight="medium"
          style={{ color: variantStyles[variant].color }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Container>
  );

  return Platform.select({
    web: (
      <button
        className={className}
        style={combinedStyles}
        onClick={handlePress}
        disabled={disabled || loading}
      >
        <ButtonContent />
      </button>
    ),
    native: (
      // This would be React Native TouchableOpacity/Pressable in actual implementation
      <button
        className={className}
        style={combinedStyles}
        onClick={handlePress}
        disabled={disabled || loading}
      >
        <ButtonContent />
      </button>
    ),
  });
};