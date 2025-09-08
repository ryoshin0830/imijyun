/**
 * GestureWord Component
 * 
 * Expo Go互換のドラッグ可能な単語コンポーネント
 * react-native-gesture-handlerとreanimatedを使用
 * 
 * 特徴:
 * - Pan Gestureによるドラッグ操作
 * - スムーズなアニメーション
 * - 触覚フィードバック対応
 */
import React, { useCallback } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Word, IMIJUN_LABELS } from '@imijun/core';

interface GestureWordProps {
  word: Word;
  colorScheme: {
    main: string;
    light: string;
    dark: string;
    gradient: string[];
  };
  onDragStart?: () => void;
  onDragEnd?: (word: Word, x: number, y: number) => void;
  onDrop?: (word: Word) => void;
}

const GestureWord: React.FC<GestureWordProps> = ({
  word,
  colorScheme,
  onDragStart,
  onDragEnd,
  onDrop,
}) => {
  // アニメーション用の共有値
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const zIndex = useSharedValue(0);

  // 触覚フィードバック関数
  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  // ドラッグ開始時のハンドラー
  const handleDragStart = useCallback(() => {
    'worklet';
    scale.value = withSpring(1.1, { damping: 10 });
    opacity.value = withSpring(0.9);
    zIndex.value = 1000;
    if (onDragStart) {
      runOnJS(onDragStart)();
    }
    runOnJS(triggerHaptic)();
  }, [onDragStart, triggerHaptic, scale, opacity, zIndex]);

  // ドラッグ終了時のハンドラー
  const handleDragEndJS = useCallback((x: number, y: number) => {
    if (onDragEnd) {
      onDragEnd(word, x, y);
    }
    if (onDrop) {
      onDrop(word);
    }
  }, [word, onDragEnd, onDrop]);

  // Pan Gestureの設定
  const panGesture = Gesture.Pan()
    .onStart(() => {
      handleDragStart();
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      // 絶対座標を計算
      const absoluteX = event.absoluteX;
      const absoluteY = event.absoluteY;
      
      runOnJS(handleDragEndJS)(absoluteX, absoluteY);
      
      // アニメーションで元の位置に戻す
      translateX.value = withSpring(0, { damping: 10 });
      translateY.value = withSpring(0, { damping: 10 });
      scale.value = withSpring(1, { damping: 10 });
      opacity.value = withSpring(1);
      zIndex.value = withSpring(0);
    });

  // アニメーションスタイル
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
    zIndex: zIndex.value,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.wordWrapper, animatedStyle]}>
        <LinearGradient
          colors={colorScheme.gradient as any}
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

const styles = StyleSheet.create({
  wordWrapper: {
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
});

export default GestureWord;