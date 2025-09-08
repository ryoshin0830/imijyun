import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { IMIJUN_COLORS, type Word } from '@imijun/core';
import * as Haptics from 'expo-haptics';

export interface DraggableWordChipProps {
  word: Word;
  isDisabled?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (success: boolean) => void;
  style?: any;
}

/**
 * Draggable Word Chip component for React Native
 * Uses react-native-gesture-handler and react-native-reanimated for smooth interactions
 */
export const DraggableWordChip: React.FC<DraggableWordChipProps> = ({
  word,
  isDisabled = false,
  onDragStart,
  onDragEnd,
  style,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .enabled(!isDisabled)
    .onStart(() => {
      onDragStart?.();
      // Haptic feedback on drag start
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scale.value = withSpring(1.1);
      opacity.value = withTiming(0.9);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      // Reset position with spring animation
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      opacity.value = withTiming(1);
      
      onDragEnd?.(false); // TODO: Implement drop success detection
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  const wordTypeColor = IMIJUN_COLORS[word.type];

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[animatedStyle, style]}>
          <View
            style={[
              styles.chip,
              {
                backgroundColor: wordTypeColor,
                opacity: isDisabled ? 0.5 : 1,
              },
            ]}
          >
            <Text style={styles.text}>{word.text}</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});