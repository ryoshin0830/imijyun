/**
 * 新しいレッスン詳細画面
 * 
 * react-native-draxの代わりにreact-native-gesture-handlerと
 * react-native-reanimatedを使用した実装
 * 
 * 主な変更点:
 * - DraxProviderを削除
 * - GestureHandlerRootViewを使用
 * - カスタムのGestureWord/GestureDropBoxコンポーネントを使用
 * - 座標ベースのドロップ判定
 */
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
  Modal,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

// カスタムコンポーネント
import SimpleGestureWord from '../../components/SimpleGestureWord';
import GestureDropBox, { checkDropZone } from '../../components/GestureDropBox';

// Core imports
import {
  IMIJUN_COLORS,
  IMIJUN_LABELS,
  BOX_ORDER,
  DEMO_LESSONS,
  TUTORIAL_LESSON,
  type Word,
  type BoxType,
  type BoxState,
  type Lesson,
} from '@imijun/core';
import { MOBILE_LESSONS, getNextLessonId, getPreviousLessonId } from '../../data/lessons';
import { storage } from '../../utils/storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// カラーパレット
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

// ヘルパー関数
const getAllLessons = (): Lesson[] => {
  return [TUTORIAL_LESSON, ...DEMO_LESSONS, ...MOBILE_LESSONS];
};

const findLesson = (id: string): Lesson | undefined => {
  return getAllLessons().find(lesson => lesson.id === id);
};

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [boxStates, setBoxStates] = useState<BoxState[]>([]);
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeStarted, setTimeStarted] = useState<number>(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // ドロップゾーンの座標を管理
  const dropZonesRef = useRef<{ [key: string]: { x: number; y: number; width: number; height: number } }>({});

  // アニメーション値
  const feedbackOpacity = useSharedValue(0);
  const confettiScale = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const scoreScale = useSharedValue(1);

  // レッスンの初期化
  useEffect(() => {
    if (id) {
      const foundLesson = findLesson(id);
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
        setTimeStarted(Date.now());
        
        // ドロップゾーンをリセット
        dropZonesRef.current = {};
        console.log(`[Lesson] Lesson loaded: ${foundLesson.title}, drop zones reset`);
        
        // 進捗をロード
        loadLessonProgress(id);
      }
    }
  }, [id]);

  // レッスン進捗のロード
  const loadLessonProgress = async (lessonId: string) => {
    try {
      const progress = await storage.getLessonProgress(lessonId);
      if (progress) {
        setAttempts(progress.attempts || 0);
      }
    } catch (error) {
      console.error('Error loading lesson progress:', error);
    }
  };

  // プログレスバーの更新
  useEffect(() => {
    const filledBoxes = boxStates.filter(box => box.word !== null).length;
    const totalBoxes = boxStates.length;
    const progress = totalBoxes > 0 ? (filledBoxes / totalBoxes) * 100 : 0;
    progressWidth.value = withSpring(progress, {
      damping: 15,
      stiffness: 100,
    });
  }, [boxStates, progressWidth]);

  // ドロップゾーンの座標を登録
  const handleDropZoneMeasure = (id: string, x: number, y: number, width: number, height: number) => {
    dropZonesRef.current[id] = { x, y, width, height };
    const zoneCount = Object.keys(dropZonesRef.current).length;
    console.log(`[Lesson] Drop zone registered - ${id}:`, { x, y, width, height });
    console.log(`[Lesson] All zones (${zoneCount}/5):`, dropZonesRef.current);
    
    // すべてのドロップゾーンが測定完了したらドラッグを有効化
    if (zoneCount === 5) {
      console.log(`[Lesson] All drop zones measured successfully! Drag & drop is ready.`);
    }
  };

  // ドラッグ終了時のハンドラー
  const handleWordDrop = (word: Word, x: number, y: number) => {
    console.log(`[Lesson] handleWordDrop called for "${word.text}" at (${x}, ${y})`);
    
    // ドロップゾーンが初期化されているか確認
    const hasZones = Object.keys(dropZonesRef.current).length > 0;
    console.log(`[Lesson] Has zones:`, hasZones, `Zone count:`, Object.keys(dropZonesRef.current).length);
    
    if (!hasZones) {
      console.log(`[Lesson] No zones available, retrying in 200ms...`);
      // ドロップゾーンがまだ初期化されていない場合は少し待ってリトライ
      setTimeout(() => {
        console.log(`[Lesson] Retrying drop detection...`);
        const droppedZone = checkDropZone(x, y, dropZonesRef.current);
        processDropResult(word, droppedZone);
      }, 200);
      return;
    }
    
    const droppedZone = checkDropZone(x, y, dropZonesRef.current);
    processDropResult(word, droppedZone);
  };

  // ドロップ結果を処理
  const processDropResult = (word: Word, droppedZone: string | null) => {
    console.log(`[Lesson] processDropResult - word: "${word.text}", type: ${word.type}, droppedZone: ${droppedZone}`);
    
    if (droppedZone && droppedZone === word.type) {
      // 正しいボックスにドロップ
      console.log(`[Lesson] Correct drop! Placing ${word.text} in ${droppedZone} box`);
      handleDrop(word, droppedZone as BoxType);
    } else if (droppedZone) {
      // 間違ったボックスにドロップ
      console.log(`[Lesson] Wrong drop! ${word.text} (${word.type}) dropped in ${droppedZone}`);
      Alert.alert(
        '間違いです',
        `"${word.text}"は「${IMIJUN_LABELS[word.type]}」のボックスに入れてください。`,
        [{ text: 'OK' }]
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      console.log(`[Lesson] No drop zone detected for ${word.text}`);
    }
  };

  // 単語をボックスに配置
  const handleDrop = (word: Word, boxType: BoxType) => {
    console.log(`[Lesson] handleDrop - placing "${word.text}" in ${boxType} box`);
    
    // 単語を利用可能リストから削除
    setAvailableWords(prev => prev.filter(w => w.id !== word.id));
    
    // ボックスに単語を配置
    setBoxStates(prev => {
      const newStates = prev.map(box =>
        box.type === boxType
          ? { ...box, word, isHighlighted: false }
          : box
      );
      
      console.log(`[Lesson] Box states updated:`, newStates.map(s => ({ type: s.type, word: s.word?.text || 'empty' })));
      
      // 全てのボックスが埋まったら自動チェック
      if (newStates.every(box => box.word !== null)) {
        console.log(`[Lesson] All boxes filled, checking answer in 500ms...`);
        setTimeout(checkAnswer, 500);
      }
      
      return newStates;
    });
  };

  // ボックスから単語を削除
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
    }
  };

  // 答え合わせ
  const checkAnswer = async () => {
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
      const attemptPenalty = Math.max(0, (attempts) * 10);
      const earnedScore = Math.max(baseScore - attemptPenalty, 50);
      setScore(prev => prev + earnedScore);
      setStreak(prev => prev + 1);
      
      // 時間計算
      const timeSpent = Math.round((Date.now() - timeStarted) / 1000);
      
      // 進捗を保存
      try {
        await storage.markLessonCompleted(lesson.id, earnedScore, timeSpent);
      } catch (error) {
        console.error('Error saving progress:', error);
      }
      
      // アニメーション
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
      
      // 完了モーダル表示
      setTimeout(() => {
        setShowCompletionModal(true);
      }, 2000);
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

  // フィードバックを隠す
  const hideFeedback = () => {
    feedbackOpacity.value = withTiming(0);
    confettiScale.value = withTiming(0);
    setShowFeedback(false);
  };

  // レッスンをリセット
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

  // ナビゲーション
  const goBack = () => {
    router.back();
  };

  const goToNextLesson = () => {
    if (!lesson) return;
    
    const nextLessonId = getNextLessonId(lesson.id);
    if (nextLessonId) {
      router.replace({
        pathname: '/lesson/[id]',
        params: { id: nextLessonId }
      });
      setShowCompletionModal(false);
      resetLesson();
    } else {
      router.replace('/(tabs)/lessons');
    }
  };

  // アニメーションスタイル
  const feedbackAnimatedStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
    transform: [{ scale: confettiScale.value * 0.1 + 0.9 }],
  }));

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
            <Text style={styles.buttonText}>戻る</Text>
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
          {/* ヘッダー */}
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

          {/* プログレスバー */}
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

          {/* レッスン情報 */}
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

          {/* 意味順ボックス */}
          <View style={styles.boxesContainer}>
            {boxStates.map((box, index) => (
              <GestureDropBox
                key={box.type}
                boxState={box}
                colorScheme={ENHANCED_COLORS[box.type]}
                onReceiveDrop={(word) => handleDrop(word, box.type)}
                onRemoveWord={() => removeWordFromBox(box.type)}
                index={index}
                onLayoutMeasure={handleDropZoneMeasure}
              />
            ))}
          </View>

          {/* 単語バンク */}
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
            
            {/* デバッグ情報 */}
            {__DEV__ && (
              <View style={styles.debugInfo}>
                <Text style={styles.debugText}>
                  デバッグ: ドロップゾーン {Object.keys(dropZonesRef.current).length}/5
                </Text>
                {Object.entries(dropZonesRef.current).map(([key, zone]) => (
                  <Text key={key} style={styles.debugText}>
                    {key}: ({Math.round(zone.x)}, {Math.round(zone.y)})
                  </Text>
                ))}
              </View>
            )}
            
            <View style={styles.wordsContainer}>
              {availableWords.map((word) => (
                <SimpleGestureWord
                  key={word.id}
                  word={word}
                  colorScheme={ENHANCED_COLORS[word.type]}
                  onDragEnd={handleWordDrop}
                />
              ))}
            </View>
          </View>

          {/* ヒント */}
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

        {/* 完了モーダル */}
        <Modal
          visible={showCompletionModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCompletionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.completionModal}>
              <LinearGradient
                colors={['#dcfce7', '#bbf7d0']}
                style={styles.completionGradient}
              >
                <Text style={styles.completionEmoji}>🎉</Text>
                <Text style={styles.completionTitle}>レッスン完了！</Text>
                
                <View style={styles.completionStats}>
                  <View style={styles.completionStatCard}>
                    <Text style={styles.completionStatLabel}>スコア</Text>
                    <Text style={styles.completionStatValue}>{score}点</Text>
                  </View>
                  <View style={styles.completionStatCard}>
                    <Text style={styles.completionStatLabel}>試行回数</Text>
                    <Text style={styles.completionStatValue}>{attempts}回</Text>
                  </View>
                  <View style={styles.completionStatCard}>
                    <Text style={styles.completionStatLabel}>連続正解</Text>
                    <Text style={styles.completionStatValue}>{streak}回</Text>
                  </View>
                </View>
                
                <Text style={styles.completionMessage}>
                  {attempts === 1 
                    ? '素晴らしい！一発で正解しました！' 
                    : `よく頑張りました！${attempts}回目で正解です！`}
                </Text>
                
                <View style={styles.completionActions}>
                  <TouchableOpacity 
                    style={styles.nextLessonButton}
                    onPress={goToNextLesson}
                  >
                    <LinearGradient
                      colors={['#60a5fa', '#3b82f6']}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>次のレッスンへ</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.backToListButton}
                    onPress={() => router.replace('/(tabs)/lessons')}
                  >
                    <Text style={styles.backToListText}>レッスン一覧へ</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>
        </Modal>

        {/* フィードバック */}
        {showFeedback && (
          <Animated.View style={[styles.feedback, feedbackAnimatedStyle]}>
            <LinearGradient
              colors={isCorrect ? ['#dcfce7', '#bbf7d0'] : ['#fee2e2', '#fecaca']}
              style={styles.feedbackGradient}
            >
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
            </LinearGradient>
          </Animated.View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

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
  
  // Header
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
  
  // Progress
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
  
  // Title
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
  
  // Boxes
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
  
  // Word Bank
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
  
  // Hint
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
  
  // Feedback
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
  
  // Error
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
  
  // Completion Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionModal: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  completionGradient: {
    padding: 32,
    alignItems: 'center',
  },
  completionEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 24,
  },
  completionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  completionStatCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    minWidth: 80,
  },
  completionStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  completionStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  completionMessage: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  completionActions: {
    width: '100%',
  },
  nextLessonButton: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 12,
  },
  buttonGradient: {
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  backToListButton: {
    paddingVertical: 12,
  },
  backToListText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  
  // Debug styles
  debugInfo: {
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  debugText: {
    fontSize: 10,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
});