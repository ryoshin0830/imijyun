import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import {
  IMIJUN_COLORS,
  IMIJUN_LABELS,
  ENGLISH_LABELS,
  BOX_ORDER,
  TUTORIAL_LESSON,
  type Word,
  type BoxType,
  type BoxState,
} from '@imijun/core';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface DropZone {
  id: BoxType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function LessonScreen() {
  const [lesson] = useState(TUTORIAL_LESSON);
  const [boxStates, setBoxStates] = useState<BoxState[]>(
    BOX_ORDER.map(type => ({
      type,
      word: null,
      isHighlighted: false,
    }))
  );
  const [availableWords, setAvailableWords] = useState<Word[]>(lesson.words);
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Animated values for feedback
  const feedbackOpacity = useSharedValue(0);
  const confettiScale = useSharedValue(0);

  const checkAnswer = () => {
    const placedWords = boxStates
      .filter(box => box.word !== null)
      .map(box => box.word!.text)
      .join(' ');
    
    const correct = placedWords === lesson.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      confettiScale.value = withSpring(1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    feedbackOpacity.value = withTiming(1, {}, () => {
      runOnJS(hideFeedback)();
    });
  };

  const hideFeedback = () => {
    setTimeout(() => {
      feedbackOpacity.value = withTiming(0);
      confettiScale.value = withTiming(0);
      setShowFeedback(false);
    }, 2000);
  };

  const handleDrop = (word: Word, boxType: BoxType) => {
    // Check if word type matches box type
    if (word.type === boxType) {
      // Correct placement
      setBoxStates(prev =>
        prev.map(box =>
          box.type === boxType
            ? { ...box, word, isHighlighted: false }
            : box
        )
      );
      
      setAvailableWords(prev => prev.filter(w => w.id !== word.id));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Auto-check answer if all boxes are filled
      const updatedBoxes = boxStates.map(box =>
        box.type === boxType ? { ...box, word } : box
      );
      
      if (updatedBoxes.every(box => box.word !== null)) {
        setTimeout(checkAnswer, 500);
      }
    } else {
      // Wrong placement - shake animation and return word
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        '間違いです',
        `"${word.text}"は「${IMIJUN_LABELS[word.type]}」のボックスに入れてください。`,
        [{ text: 'OK' }]
      );
    }
  };

  const removeWordFromBox = (boxType: BoxType) => {
    const box = boxStates.find(b => b.type === boxType);
    if (box && box.word) {
      setAvailableWords(prev => [...prev, box.word!]);
      setBoxStates(prev =>
        prev.map(b =>
          b.type === boxType
            ? { ...b, word: null, isHighlighted: false }
            : b
        )
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const feedbackAnimatedStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
    transform: [{ scale: confettiScale.value }],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.description}>{lesson.description}</Text>
        </View>

        {/* Imijun Boxes */}
        <View style={styles.boxesContainer}>
          {boxStates.map((box, index) => (
            <ImijunDropBox
              key={box.type}
              boxState={box}
              onDrop={(word) => handleDrop(word, box.type)}
              onRemoveWord={() => removeWordFromBox(box.type)}
              onLayout={(event) => {
                const { x, y, width, height } = event.nativeEvent.layout;
                setDropZones(prev => {
                  const newZones = [...prev];
                  newZones[index] = { id: box.type, x, y, width, height };
                  return newZones;
                });
              }}
            />
          ))}
        </View>

        {/* Word Bank */}
        <View style={styles.wordBank}>
          <Text style={styles.wordBankTitle}>単語を選んでください</Text>
          <View style={styles.wordsContainer}>
            {availableWords.map((word) => (
              <DraggableWordChip
                key={word.id}
                word={word}
                dropZones={dropZones}
                onDrop={handleDrop}
              />
            ))}
          </View>
        </View>

        {/* Hint */}
        {lesson.hint && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintLabel}>ヒント:</Text>
            <Text style={styles.hintText}>{lesson.hint}</Text>
          </View>
        )}

        {/* Feedback */}
        {showFeedback && (
          <Animated.View style={[styles.feedback, feedbackAnimatedStyle]}>
            <Text style={[
              styles.feedbackText,
              { color: isCorrect ? '#22c55e' : '#ef4444' }
            ]}>
              {isCorrect ? '正解です！🎉' : 'もう一度挑戦してみてください'}
            </Text>
            {isCorrect && lesson.explanation && (
              <Text style={styles.explanationText}>
                {lesson.explanation}
              </Text>
            )}
          </Animated.View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

// Individual Draggable Word Chip Component
const DraggableWordChip: React.FC<{
  word: Word;
  dropZones: DropZone[];
  onDrop: (word: Word, boxType: BoxType) => void;
}> = ({ word, dropZones, onDrop }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const pan = Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(1.1);
      opacity.value = withTiming(0.9);
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      const dropZone = dropZones.find((zone) => {
        const dropX = event.absoluteX;
        const dropY = event.absoluteY;
        return (
          dropX >= zone.x &&
          dropX <= zone.x + zone.width &&
          dropY >= zone.y &&
          dropY <= zone.y + zone.height
        );
      });

      if (dropZone) {
        runOnJS(onDrop)(word, dropZone.id);
      }

      // Reset position
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      opacity.value = withTiming(1);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyle}>
        <View style={[
          styles.wordChip,
          { backgroundColor: IMIJUN_COLORS[word.type] }
        ]}>
          <Text style={styles.wordText}>{word.text}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

// Individual Drop Box Component
const ImijunDropBox: React.FC<{
  boxState: BoxState;
  onDrop: (word: Word) => void;
  onRemoveWord: () => void;
  onLayout: (event: any) => void;
}> = ({ boxState, onRemoveWord, onLayout }) => {
  const boxColor = IMIJUN_COLORS[boxState.type];
  const japaneseLabel = IMIJUN_LABELS[boxState.type];
  const englishLabel = ENGLISH_LABELS[boxState.type];

  return (
    <View
      style={[
        styles.dropBox,
        {
          backgroundColor: boxState.word ? `${boxColor}20` : 'transparent',
          borderColor: boxColor,
          borderStyle: boxState.isHighlighted ? 'dashed' : 'solid',
        },
      ]}
      onLayout={onLayout}
    >
      <View style={styles.labelContainer}>
        <Text style={[styles.japaneseLabel, { color: boxColor }]}>
          {japaneseLabel}
        </Text>
        <Text style={[styles.englishLabel, { color: boxColor }]}>
          {englishLabel}
        </Text>
      </View>
      
      <View style={styles.wordContainer}>
        {boxState.word ? (
          <Text
            style={[styles.placedWordText, { color: boxColor }]}
            onPress={onRemoveWord}
          >
            {boxState.word.text}
          </Text>
        ) : (
          <Text style={styles.placeholderText}>タップして配置</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  boxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropBox: {
    width: screenWidth * 0.28,
    height: 100,
    borderWidth: 2,
    borderRadius: 12,
    margin: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelContainer: {
    alignItems: 'center',
  },
  japaneseLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  englishLabel: {
    fontSize: 10,
    opacity: 0.7,
  },
  wordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placedWordText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  wordBank: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  wordBankTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wordChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  wordText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  hintContainer: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  hintLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  hintText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 20,
  },
  feedback: {
    position: 'absolute',
    top: screenHeight * 0.4,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  explanationText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});