import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { IMIJUN_COLORS, IMIJUN_LABELS, ENGLISH_LABELS, type BoxType, type Word } from '@imijun/core';
import * as Haptics from 'expo-haptics';

export interface ImijunBoxNativeProps {
  type: BoxType;
  word: Word | null;
  isHighlighted?: boolean;
  showLabels?: boolean;
  onWordRemove?: () => void;
  onDrop?: (word: Word) => void;
  style?: any;
}

/**
 * Imijun Box component for React Native
 * Supports drag and drop with visual feedback
 */
export const ImijunBoxNative: React.FC<ImijunBoxNativeProps> = ({
  type,
  word,
  isHighlighted = false,
  showLabels = true,
  onWordRemove,
  onDrop,
  style,
}) => {
  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(2);

  const boxColor = IMIJUN_COLORS[type];
  const japaneseLabel = IMIJUN_LABELS[type];
  const englishLabel = ENGLISH_LABELS[type];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      borderWidth: borderWidth.value,
    };
  });

  // Handle drop gesture (to be implemented with gesture handler)
  const handleDrop = (droppedWord: Word) => {
    // Haptic feedback on successful drop
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    scale.value = withSpring(1.05, {}, () => {
      scale.value = withSpring(1);
    });
    onDrop?.(droppedWord);
  };

  const handleWordRemove = () => {
    if (word && onWordRemove) {
      // Haptic feedback on word removal
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onWordRemove();
    }
  };

  React.useEffect(() => {
    if (isHighlighted) {
      scale.value = withSpring(1.02);
      borderWidth.value = withTiming(3);
    } else {
      scale.value = withSpring(1);
      borderWidth.value = withTiming(2);
    }
  }, [isHighlighted]);

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          backgroundColor: word ? boxColor + '20' : 'transparent',
          borderColor: boxColor,
          borderStyle: isHighlighted ? 'dashed' : 'solid',
          opacity: isHighlighted ? 0.7 : 1,
        },
        style,
      ]}
    >
      {showLabels && (
        <View style={styles.labelContainer}>
          <Text style={styles.japaneseLabel}>{japaneseLabel}</Text>
          <Text style={styles.englishLabel}>{englishLabel}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.contentContainer}
        onPress={handleWordRemove}
        disabled={!word || !onWordRemove}
        activeOpacity={word && onWordRemove ? 0.7 : 1}
      >
        {word ? (
          <Text style={[styles.wordText, { color: boxColor }]}>
            {word.text}
          </Text>
        ) : (
          <Text style={styles.placeholderText}>Drop here</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 80,
    minWidth: 120,
    borderRadius: 8,
    padding: 8,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    marginBottom: 8,
    alignItems: 'center',
  },
  japaneseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
  englishLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
  },
  wordText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#9ca3af',
    opacity: 0.5,
    textAlign: 'center',
  },
});