import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Platform,
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
} from 'react-native-gesture-handler';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  IMIJUN_COLORS,
  IMIJUN_LABELS,
  ENGLISH_LABELS,
  BOX_ORDER,
  getLessonById,
  type Word,
  type BoxType,
  type BoxState,
  type Lesson,
} from '@imijun/core';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface DropZone {
  id: BoxType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [boxStates, setBoxStates] = useState<BoxState[]>([]);
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Animated values for feedback
  const feedbackOpacity = useSharedValue(0);
  const confettiScale = useSharedValue(0);

  useEffect(() => {
    if (id) {
      const foundLesson = getLessonById(id);
      if (foundLesson) {
        setLesson(foundLesson);
        setBoxStates(
          BOX_ORDER.map(type => ({
            type,
            word: null,
            isHighlighted: false,
          }))
        );
        setAvailableWords([...foundLesson.words]);
      }
    }
  }, [id]);

  const checkAnswer = () => {
    if (!lesson) return;

    const placedWords = boxStates
      .filter(box => box.word !== null)
      .map(box => box.word!.text)
      .join(' ');
    
    const correct = placedWords === lesson.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    setAttempts(prev => prev + 1);

    if (correct) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      confettiScale.value = withSpring(1);
    } else {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

    feedbackOpacity.value = withTiming(1, {}, () => {
      runOnJS(() => {
        setTimeout(hideFeedback, correct ? 3000 : 2000);
      })();
    });
  };

  const hideFeedback = () => {
    feedbackOpacity.value = withTiming(0);
    confettiScale.value = withTiming(0);
    setShowFeedback(false);
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
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      // Auto-check answer if all boxes are filled
      const updatedBoxes = boxStates.map(box =>
        box.type === boxType ? { ...box, word } : box
      );
      
      if (updatedBoxes.every(box => box.word !== null)) {
        setTimeout(checkAnswer, 500);
      }
    } else {
      // Wrong placement - show error
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
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
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const resetLesson = () => {
    if (!lesson) return;
    
    setBoxStates(
      BOX_ORDER.map(type => ({
        type,
        word: null,
        isHighlighted: false,
      }))
    );
    setAvailableWords([...lesson.words]);
    setShowFeedback(false);
    setIsCorrect(false);
    feedbackOpacity.value = 0;
    confettiScale.value = 0;
  };

  const goBack = () => {
    router.back();
  };

  const feedbackAnimatedStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
    transform: [{ scale: confettiScale.value * 0.1 + 0.9 }],
  }));

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>レッスンが見つかりません</Text>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>戻る</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>← 戻る</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={resetLesson}>
            <Text style={styles.resetButtonText}>リセット</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.description}>{lesson.description}</Text>
          <Text style={styles.attempts}>試行回数: {attempts}</Text>
        </View>

        {/* Imijun Boxes */}
        <View style={styles.boxesContainer}>
          {boxStates.map((box, index) => (
            <ImijunDropBox
              key={box.type}
              boxState={box}
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
          <Text style={styles.wordBankTitle}>
            単語を選んで上のボックスにドラッグしてください
          </Text>
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
            <Text style={styles.hintLabel}>💡 ヒント:</Text>
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
              {isCorrect ? '🎉 正解です！' : '❌ もう一度挑戦してみてください'}
            </Text>
            {isCorrect && lesson.explanation && (
              <Text style={styles.explanationText}>
                {lesson.explanation}
              </Text>
            )}
            {isCorrect && (
              <TouchableOpacity style={styles.nextButton} onPress={goBack}>
                <Text style={styles.nextButtonText}>レッスン一覧に戻る</Text>
              </TouchableOpacity>
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
      if (Platform.OS !== 'web') {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
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
      
      <TouchableOpacity
        style={styles.wordContainer}
        onPress={boxState.word ? onRemoveWord : undefined}
        disabled={!boxState.word}
      >
        {boxState.word ? (
          <Text style={[styles.placedWordText, { color: boxColor }]}>
            {boxState.word.text}
          </Text>
        ) : (
          <Text style={styles.placeholderText}>ここにドロップ</Text>
        )}
      </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 20,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92400e',
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
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
    marginBottom: 8,
  },
  attempts: {
    fontSize: 12,
    color: '#9ca3af',
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
    width: '100%',
  },
  placedWordText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 10,
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
    fontSize: 14,
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
    top: screenHeight * 0.3,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  explanationText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 20,
  },
});