import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Spacing } from '../../theme';
import { IMIJUN_COLORS } from '@imijun/core';

interface LoadingProps {
  visible?: boolean;
  text?: string;
  fullScreen?: boolean;
  size?: 'small' | 'large';
  variant?: 'spinner' | 'dots' | 'pulse';
}

export const Loading: React.FC<LoadingProps> = ({
  visible = true,
  text,
  fullScreen = false,
  size = 'large',
  variant = 'spinner',
}) => {
  const { colors } = useTheme();

  if (!visible) return null;

  const content = (
    <View style={[styles.container, fullScreen && styles.fullScreenContainer]}>
      {variant === 'spinner' && (
        <ActivityIndicator
          size={size}
          color={colors.primary}
        />
      )}
      {variant === 'dots' && <LoadingDots />}
      {variant === 'pulse' && <LoadingPulse />}
      {text && (
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          {text}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
      >
        <View style={[styles.modalBackdrop, { backgroundColor: colors.overlay }]}>
          {content}
        </View>
      </Modal>
    );
  }

  return content;
};

const LoadingDots: React.FC = () => {
  const { colors } = useTheme();
  const dots = [0, 1, 2];
  
  return (
    <View style={styles.dotsContainer}>
      {dots.map((index) => (
        <AnimatedDot key={index} delay={index * 200} color={colors.primary} />
      ))}
    </View>
  );
};

const AnimatedDot: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 400, easing: Easing.ease }),
        withTiming(1, { duration: 400, easing: Easing.ease })
      ),
      -1,
      false
    );
    
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400, easing: Easing.ease }),
        withTiming(0.3, { duration: 400, easing: Easing.ease })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

const LoadingPulse: React.FC = () => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.5, { duration: 1000, easing: Easing.ease }),
      -1,
      false
    );
    
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 500, easing: Easing.ease }),
        withTiming(0, { duration: 500, easing: Easing.ease })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.pulseContainer}>
      <Animated.View style={[styles.pulseRing, animatedStyle]}>
        <LinearGradient
          colors={[IMIJUN_COLORS.subject, IMIJUN_COLORS.verb]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pulseGradient}
        />
      </Animated.View>
      <View style={styles.pulseCenter}>
        <LinearGradient
          colors={[IMIJUN_COLORS.subject, IMIJUN_COLORS.verb]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pulseCenterGradient}
        />
      </View>
    </View>
  );
};

// スケルトンローディング用コンポーネント
interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.border,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  fullScreenContainer: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: Spacing.md,
    ...Typography.body,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  pulseContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  pulseGradient: {
    flex: 1,
    borderRadius: 40,
  },
  pulseCenter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  pulseCenterGradient: {
    flex: 1,
  },
});