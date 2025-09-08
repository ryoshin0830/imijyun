import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
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

// 新しいカラーパレット - より洗練された色合い
const ENHANCED_COLORS = {
  subject: {
    main: '#60A5FA',
    light: '#93BBFC',
    dark: '#3B82F6',
    gradient: ['#60A5FA', '#3B82F6'],
  },
  verb: {
    main: '#F472B6',
    light: '#F8A5D0',
    dark: '#EC4899',
    gradient: ['#F472B6', '#EC4899'],
  },
  object: {
    main: '#FBBF24',
    light: '#FCD34D',
    dark: '#F59E0B',
    gradient: ['#FBBF24', '#F59E0B'],
  },
  place: {
    main: '#34D399',
    light: '#6EE7B7',
    dark: '#10B981',
    gradient: ['#34D399', '#10B981'],
  },
  time: {
    main: '#A78BFA',
    light: '#C4B5FD',
    dark: '#8B5CF6',
    gradient: ['#A78BFA', '#8B5CF6'],
  },
};

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [boxStates, setBoxStates] = useState<BoxState[]>([]);
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Animated values for feedback and UI
  const feedbackOpacity = useSharedValue(0);
  const confettiScale = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const scoreScale = useSharedValue(1);

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

  useEffect(() => {
    // プログレスバーのアニメーション
    const filledBoxes = boxStates.filter(box => box.word !== null).length;
    const totalBoxes = boxStates.length;
    const progress = totalBoxes > 0 ? (filledBoxes / totalBoxes) * 100 : 0;
    progressWidth.value = withSpring(progress, {
      damping: 15,
      stiffness: 100,
    });
  }, [boxStates]);

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
      // スコア計算
      const baseScore = 100;
      const attemptPenalty = Math.max(0, (attempts - 1) * 10);
      const earnedScore = Math.max(baseScore - attemptPenalty, 50);
      setScore(prev => prev + earnedScore);
      setStreak(prev => prev + 1);
      
      // スコアアニメーション
      scoreScale.value = withSequence(
        withSpring(1.3, { damping: 5 }),
        withSpring(1, { damping: 10 })
      );
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      confettiScale.value = withSpring(1, {
        damping: 8,
        stiffness: 100,
      });
    } else {
      setStreak(0);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

    feedbackOpacity.value = withTiming(1, { duration: 300 }, () => {
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

  // プログレスバーのアニメーションスタイル
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const scoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
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
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Enhanced Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Svg width="24" height="24" viewBox="0 0 24 24">
                <Path
                  d="M15 18l-6-6 6-6"
                  stroke="#6b7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </Svg>
            </TouchableOpacity>
            
            <View style={styles.scoreContainer}>
              <Animated.View style={scoreAnimatedStyle}>
                <Text style={styles.scoreLabel}>スコア</Text>
                <Text style={styles.scoreValue}>{score}</Text>
              </Animated.View>
              {streak > 1 && (
                <View style={styles.streakBadge}>
                  <Text style={styles.streakText}>🔥 {streak}連続</Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity style={styles.resetButton} onPress={resetLesson}>
              <Svg width="20" height="20" viewBox="0 0 24 24">
                <Path
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  stroke="#92400e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, progressAnimatedStyle]}>
                <LinearGradient
                  colors={['#60A5FA', '#3B82F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFillObject}
                />
              </Animated.View>
            </View>
            <Text style={styles.progressText}>
              {boxStates.filter(b => b.word).length} / {boxStates.length} 完了
            </Text>
          </View>

          {/* Lesson Info */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{lesson.title}</Text>
            <Text style={styles.description}>{lesson.description}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>試行回数</Text>
                <Text style={styles.statValue}>{attempts}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>残り単語</Text>
                <Text style={styles.statValue}>{availableWords.length}</Text>
              </View>
            </View>
          </View>

          {/* Enhanced Imijun Boxes */}
          <View style={styles.boxesContainer}>
            {boxStates.map((box, index) => (
              <ImijunDropBox
                key={box.type}
                boxState={box}
                index={index}
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

          {/* Enhanced Word Bank */}
          <View style={styles.wordBank}>
            <View style={styles.wordBankHeader}>
              <Text style={styles.wordBankTitle}>単語バンク</Text>
              <View style={styles.wordCountBadge}>
                <Text style={styles.wordCountText}>{availableWords.length}</Text>
              </View>
            </View>
            <Text style={styles.wordBankSubtitle}>
              単語を上のボックスにドラッグしてください
            </Text>
            <View style={styles.wordsContainer}>
              {availableWords.map((word, index) => (
                <DraggableWordChip
                  key={word.id}
                  word={word}
                  index={index}
                  dropZones={dropZones}
                  onDrop={handleDrop}
                />
              ))}
            </View>
          </View>

          {/* Enhanced Hint */}
          {lesson.hint && (
            <LinearGradient
              colors={['#fff7ed', '#fef3c7']}
              style={styles.hintContainer}
            >
              <View style={styles.hintIcon}>
                <Text style={styles.hintEmoji}>💡</Text>
              </View>
              <View style={styles.hintContent}>
                <Text style={styles.hintLabel}>ヒント</Text>
                <Text style={styles.hintText}>{lesson.hint}</Text>
              </View>
            </LinearGradient>
          )}
        </ScrollView>

        {/* Enhanced Feedback Modal */}
        {showFeedback && (
          <Animated.View style={[styles.feedback, feedbackAnimatedStyle]}>
            <LinearGradient
              colors={isCorrect ? ['#dcfce7', '#bbf7d0'] : ['#fee2e2', '#fecaca']}
              style={styles.feedbackGradient}
            >
              {isCorrect && (
                <View style={styles.confettiContainer}>
                  {[...Array(6)].map((_, i) => (
                    <Animated.View
                      key={i}
                      style={[
                        styles.confetti,
                        {
                          backgroundColor: ['#60A5FA', '#F472B6', '#FBBF24', '#34D399', '#A78BFA', '#F87171'][i],
                          transform: [
                            {
                              translateY: confettiScale.value * interpolate(
                                Math.random(),
                                [0, 1],
                                [-100, -300]
                              ),
                            },
                            {
                              translateX: interpolate(
                                Math.random(),
                                [0, 1],
                                [-50, 50]
                              ),
                            },
                            { rotate: `${Math.random() * 360}deg` },
                          ],
                        },
                      ]}
                    />
                  ))}
                </View>
              )}
              
              <Text style={[
                styles.feedbackEmoji,
                { fontSize: isCorrect ? 60 : 50 }
              ]}>
                {isCorrect ? '🎉' : '💪'}
              </Text>
              
              <Text style={[
                styles.feedbackText,
                { color: isCorrect ? '#16a34a' : '#dc2626' }
              ]}>
                {isCorrect ? '素晴らしい！正解です！' : 'もう少し！頑張って！'}
              </Text>
              
              {isCorrect && lesson.explanation && (
                <Text style={styles.explanationText}>
                  {lesson.explanation}
                </Text>
              )}
              
              <View style={styles.feedbackActions}>
                {isCorrect ? (
                  <TouchableOpacity style={styles.successButton} onPress={goBack}>
                    <LinearGradient
                      colors={['#22c55e', '#16a34a']}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>次のレッスンへ</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.retryButton} onPress={hideFeedback}>
                    <Text style={styles.retryButtonText}>もう一度</Text>
                  </TouchableOpacity>
                )}
              </View>
            </LinearGradient>
          </Animated.View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

// Enhanced Draggable Word Chip Component
const DraggableWordChip: React.FC<{
  word: Word;
  index: number;
  dropZones: DropZone[];
  onDrop: (word: Word, boxType: BoxType) => void;
}> = ({ word, index, dropZones, onDrop }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // 初期アニメーション
  useEffect(() => {
    scale.value = withDelay(
      index * 50,
      withSpring(1, {
        damping: 10,
        stiffness: 100,
      })
    );
  }, []);

  const pan = Gesture.Pan()
    .onStart((event) => {
      'worklet';
      startX.value = event.absoluteX - event.translationX;
      startY.value = event.absoluteY - event.translationY;
      scale.value = withSpring(1.2, {
        damping: 10,
        stiffness: 200,
      });
      rotation.value = withSpring(5);
      opacity.value = withTiming(0.95);
      if (Platform.OS !== 'web') {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
    })
    .onUpdate((event) => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      // 軽い傾き効果
      rotation.value = interpolate(
        event.velocityX,
        [-500, 0, 500],
        [-10, 0, 10]
      );
    })
    .onEnd((event) => {
      'worklet';
      const dropX = startX.value + event.translationX;
      const dropY = startY.value + event.translationY;
      
      const dropZone = dropZones.find((zone) => {
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

      // スムーズなリセットアニメーション
      translateX.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
      scale.value = withSpring(1, {
        damping: 10,
        stiffness: 100,
      });
      rotation.value = withSpring(0);
      opacity.value = withTiming(1);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
    zIndex: translateX.value !== 0 || translateY.value !== 0 ? 1000 : 1,
  }));

  const colorScheme = ENHANCED_COLORS[word.type];

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.wordChipWrapper, animatedStyle]}>
        <LinearGradient
          colors={colorScheme.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.wordChip}
        >
          <Text style={styles.wordText}>{word.text}</Text>
          <View style={styles.wordTypeIndicator}>
            <Text style={styles.wordTypeText}>
              {IMIJUN_LABELS[word.type][0]}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
};

// Enhanced Drop Box Component
const ImijunDropBox: React.FC<{
  boxState: BoxState;
  index: number;
  onRemoveWord: () => void;
  onLayout: (event: any) => void;
}> = ({ boxState, index, onRemoveWord, onLayout }) => {
  const colorScheme = ENHANCED_COLORS[boxState.type];
  const japaneseLabel = IMIJUN_LABELS[boxState.type];
  const englishLabel = ENGLISH_LABELS[boxState.type];
  
  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(2);
  const glowOpacity = useSharedValue(0);

  // 初期アニメーション
  useEffect(() => {
    scale.value = withDelay(
      index * 100,
      withSpring(1, {
        damping: 12,
        stiffness: 100,
      })
    );
  }, []);

  // 単語が配置された時のアニメーション
  useEffect(() => {
    if (boxState.word) {
      scale.value = withSequence(
        withSpring(1.1, { damping: 5 }),
        withSpring(1, { damping: 10 })
      );
      glowOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0.3, { duration: 300 })
      );
    }
  }, [boxState.word]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View style={[styles.dropBoxWrapper, animatedStyle]} onLayout={onLayout}>
      {/* グロー効果 */}
      <Animated.View style={[styles.dropBoxGlow, glowStyle]}>
        <LinearGradient
          colors={[colorScheme.light + '40', colorScheme.main + '20']}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
      
      {/* メインボックス */}
      <LinearGradient
        colors={boxState.word 
          ? [colorScheme.light + '30', colorScheme.main + '20']
          : ['#ffffff', '#f9fafb']
        }
        style={styles.dropBox}
      >
        {/* ボーダー */}
        <View style={[
          styles.dropBoxBorder,
          {
            borderColor: colorScheme.main,
            borderStyle: boxState.isHighlighted ? 'dashed' : 'solid',
            borderWidth: boxState.word ? 2.5 : 2,
          }
        ]} />
        
        {/* ラベル */}
        <View style={styles.labelContainer}>
          <LinearGradient
            colors={colorScheme.gradient}
            style={styles.labelBadge}
          >
            <Text style={styles.japaneseLabel}>{japaneseLabel}</Text>
            <Text style={styles.englishLabel}>{englishLabel}</Text>
          </LinearGradient>
        </View>
        
        {/* 配置された単語またはプレースホルダー */}
        <TouchableOpacity
          style={styles.wordContainer}
          onPress={boxState.word ? onRemoveWord : undefined}
          disabled={!boxState.word}
          activeOpacity={0.7}
        >
          {boxState.word ? (
            <View style={styles.placedWordContainer}>
              <Text style={[styles.placedWordText, { color: colorScheme.dark }]}>
                {boxState.word.text}
              </Text>
              <View style={styles.removeIcon}>
                <Svg width="16" height="16" viewBox="0 0 24 24">
                  <Path
                    d="M6 18L18 6M6 6l12 12"
                    stroke={colorScheme.main}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </Svg>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Svg width="24" height="24" viewBox="0 0 24 24" opacity={0.3}>
                <Path
                  d="M12 5v14m-7-7h14"
                  stroke={colorScheme.main}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </Svg>
              <Text style={[styles.placeholderText, { color: colorScheme.main + '80' }]}>
                ドロップ
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resetButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  streakBadge: {
    position: 'absolute',
    top: -5,
    right: -30,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400e',
  },
  
  // Progress Bar Styles
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  
  // Title Section Styles
  titleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e5e7eb',
  },
  
  // Boxes Container Styles
  boxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 24,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  
  // Drop Box Styles
  dropBoxWrapper: {
    width: screenWidth * 0.28,
    height: 110,
    margin: 8,
  },
  dropBoxGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 16,
  },
  dropBox: {
    flex: 1,
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  dropBoxBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 2,
  },
  labelContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  labelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  japaneseLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  englishLabel: {
    fontSize: 10,
    color: '#ffffff',
    opacity: 0.9,
  },
  wordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  placedWordContainer: {
    alignItems: 'center',
  },
  placedWordText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  removeIcon: {
    marginTop: 4,
    opacity: 0.5,
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 11,
    marginTop: 4,
  },
  
  // Word Bank Styles
  wordBank: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  wordBankHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordBankTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginRight: 8,
  },
  wordCountBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  wordCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
  },
  wordBankSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  
  // Word Chip Styles
  wordChipWrapper: {
    margin: 6,
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
  
  // Hint Styles
  hintContainer: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  hintIcon: {
    marginRight: 12,
  },
  hintEmoji: {
    fontSize: 24,
  },
  hintContent: {
    flex: 1,
  },
  hintLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 4,
  },
  hintText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 20,
  },
  
  // Feedback Modal Styles
  feedback: {
    position: 'absolute',
    top: screenHeight * 0.25,
    left: 20,
    right: 20,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  feedbackGradient: {
    padding: 32,
    alignItems: 'center',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  feedbackEmoji: {
    marginBottom: 16,
  },
  feedbackText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  explanationText: {
    fontSize: 15,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  feedbackActions: {
    width: '100%',
  },
  successButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  retryButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#dc2626',
  },
  retryButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  
  // Error Styles
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