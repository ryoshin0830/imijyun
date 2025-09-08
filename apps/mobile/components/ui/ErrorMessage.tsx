import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, BorderRadius, Spacing, Shadows } from '../../theme';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  onDismiss?: () => void;
  onRetry?: () => void;
  dismissible?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  duration?: number; // 自動で消える時間（ミリ秒）
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = 'error',
  onDismiss,
  onRetry,
  dismissible = true,
  icon,
  duration,
}) => {
  const { colors } = useTheme();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  const typeConfig = {
    error: {
      backgroundColor: colors.error,
      icon: icon || 'alert-circle',
      iconColor: '#ffffff',
    },
    warning: {
      backgroundColor: colors.warning,
      icon: icon || 'warning',
      iconColor: '#ffffff',
    },
    info: {
      backgroundColor: colors.info,
      icon: icon || 'information-circle',
      iconColor: '#ffffff',
    },
    success: {
      backgroundColor: colors.success,
      icon: icon || 'checkmark-circle',
      iconColor: '#ffffff',
    },
  };

  const config = typeConfig[type];

  useEffect(() => {
    // アニメーションイン
    translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(1, { duration: 300 });

    // ハプティックフィードバック
    if (type === 'error') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (type === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    // 自動消去
    if (duration && onDismiss) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    'worklet';
    translateY.value = withTiming(-100, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      if (onDismiss) {
        runOnJS(onDismiss)();
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View
        style={[
          styles.content,
          { backgroundColor: config.backgroundColor },
          Shadows.lg,
        ]}
      >
        <View style={styles.messageContainer}>
          <Ionicons
            name={config.icon as any}
            size={24}
            color={config.iconColor}
            style={styles.icon}
          />
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
        </View>

        <View style={styles.actions}>
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              style={styles.actionButton}
              activeOpacity={0.8}
            >
              <Text style={styles.actionText}>再試行</Text>
            </TouchableOpacity>
          )}
          {dismissible && onDismiss && (
            <TouchableOpacity
              onPress={handleDismiss}
              style={styles.closeButton}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={20} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

// トースト通知コンポーネント
interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  position?: 'top' | 'bottom';
  duration?: number;
  onHide?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  position = 'bottom',
  duration = 3000,
  onHide,
}) => {
  const { colors } = useTheme();
  const translateY = useSharedValue(position === 'top' ? -100 : 100);
  const opacity = useSharedValue(0);

  const typeConfig = {
    error: {
      backgroundColor: colors.error,
      icon: 'alert-circle',
    },
    warning: {
      backgroundColor: colors.warning,
      icon: 'warning',
    },
    info: {
      backgroundColor: colors.info,
      icon: 'information-circle',
    },
    success: {
      backgroundColor: colors.success,
      icon: 'checkmark-circle',
    },
  };

  const config = typeConfig[type];

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 300 });

      const timer = setTimeout(() => {
        translateY.value = withTiming(
          position === 'top' ? -100 : 100,
          { duration: 300 }
        );
        opacity.value = withTiming(0, { duration: 300 }, () => {
          if (onHide) {
            runOnJS(onHide)();
          }
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        position === 'top' ? styles.toastTop : styles.toastBottom,
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.toastContent,
          { backgroundColor: config.backgroundColor },
          Shadows.lg,
        ]}
      >
        <Ionicons
          name={config.icon as any}
          size={20}
          color="#ffffff"
          style={styles.toastIcon}
        />
        <Text style={styles.toastMessage} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: Spacing.md,
    paddingTop: 50, // SafeAreaView対応
  },
  content: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: Spacing.sm,
  },
  message: {
    flex: 1,
    color: '#ffffff',
    ...Typography.body,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  actionText: {
    color: '#ffffff',
    ...Typography.caption,
    fontWeight: '600',
  },
  closeButton: {
    padding: Spacing.xs,
  },
  // Toast styles
  toastContainer: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 9999,
  },
  toastTop: {
    top: 50,
  },
  toastBottom: {
    bottom: 100,
  },
  toastContent: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastIcon: {
    marginRight: Spacing.sm,
  },
  toastMessage: {
    flex: 1,
    color: '#ffffff',
    ...Typography.caption,
  },
});