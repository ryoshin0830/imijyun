import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { DraxView } from 'react-native-drax';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Word, IMIJUN_LABELS } from '@imijun/core';

interface DraggableWordProps {
  word: Word;
  colorScheme: {
    main: string;
    light: string;
    dark: string;
    gradient: string[];
  };
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const DraggableWord: React.FC<DraggableWordProps> = ({
  word,
  colorScheme,
  onDragStart,
  onDragEnd,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <DraxView
      style={styles.wordWrapper}
      draggingStyle={styles.dragging}
      dragReleasedStyle={styles.released}
      hoverDraggingStyle={styles.hoverDragging}
      dragPayload={word}
      longPressDelay={0}
      animateSnapback={true}
      snapbackDelay={50}
      snapbackDuration={200}
      noHover={true}
      onDragStart={() => {
        'worklet';
        scale.value = withSpring(1.1);
        opacity.value = withTiming(0.9);
        if (onDragStart) {
          onDragStart();
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      onDragEnd={() => {
        'worklet';
        scale.value = withSpring(1);
        opacity.value = withTiming(1);
        if (onDragEnd) {
          onDragEnd();
        }
      }}
      renderContent={({ viewState }) => {
        const isDragging = viewState?.dragStatus === 'dragging';
        
        return (
          <Animated.View style={animatedStyle}>
            <LinearGradient
              colors={colorScheme.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.wordChip,
                isDragging && styles.wordChipDragging,
              ]}
            >
              <Text style={styles.wordText}>{word.text}</Text>
              <View style={styles.wordTypeIndicator}>
                <Text style={styles.wordTypeText}>
                  {IMIJUN_LABELS[word.type][0]}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  wordWrapper: {
    margin: 6,
  },
  dragging: {
    opacity: 0.2,
  },
  released: {
    opacity: 1,
  },
  hoverDragging: {
    opacity: 0.8,
  },
  wordChip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  wordChipDragging: {
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  wordText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    marginRight: 8,
  },
  wordTypeIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  wordTypeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default DraggableWord;