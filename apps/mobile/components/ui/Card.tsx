import React from 'react';
import {
  View,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { BorderRadius, Spacing, Shadows } from '../../theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  animatePress?: boolean;
  haptic?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'elevated',
  padding = 'medium',
  margin = 'none',
  style,
  animatePress = true,
  haptic = true,
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (animatePress && onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (animatePress && onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const handlePress = () => {
    if (onPress) {
      if (haptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getCardStyle = (): ViewStyle => {
    const paddingMap = {
      none: 0,
      small: Spacing.sm,
      medium: Spacing.md,
      large: Spacing.lg,
    };

    const marginMap = {
      none: 0,
      small: Spacing.sm,
      medium: Spacing.md,
      large: Spacing.lg,
    };

    const variantStyles = {
      elevated: {
        backgroundColor: colors.card,
        ...Shadows.md,
      },
      outlined: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
      },
      filled: {
        backgroundColor: colors.surface,
      },
    };

    return {
      borderRadius: BorderRadius.lg,
      padding: paddingMap[padding],
      margin: marginMap[margin],
      ...variantStyles[variant],
    };
  };

  const cardStyle = [getCardStyle(), style];

  if (onPress) {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[cardStyle, animatedStyle]}
      >
        {children}
      </AnimatedTouchable>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};