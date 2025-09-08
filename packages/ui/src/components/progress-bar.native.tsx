import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface ProgressBarNativeProps {
  progress: number; // 0-100
  label?: string;
  color?: string;
  showPercentage?: boolean;
  animated?: boolean;
  style?: any;
}

/**
 * Progress Bar component for React Native
 * Shows animated progress with optional labels
 */
export const ProgressBarNative: React.FC<ProgressBarNativeProps> = ({
  progress,
  label,
  color = '#60A5FA',
  showPercentage = true,
  animated = true,
  style,
}) => {
  const progressWidth = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  React.useEffect(() => {
    if (animated) {
      progressWidth.value = withSpring(Math.min(100, Math.max(0, progress)), {
        damping: 15,
        stiffness: 100,
      });
    } else {
      progressWidth.value = Math.min(100, Math.max(0, progress));
    }
  }, [progress, animated]);

  return (
    <View style={[styles.container, style]}>
      {(label || showPercentage) && (
        <View style={styles.labelContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && (
            <Text style={styles.percentage}>{Math.round(progress)}%</Text>
          )}
        </View>
      )}
      
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarBackground]}>
          <Animated.View
            style={[
              styles.progressBarFill,
              { backgroundColor: color },
              animatedStyle,
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    minWidth: 4, // Ensure visible progress even at low percentages
  },
});