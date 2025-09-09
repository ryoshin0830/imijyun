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
  
  // 初期位置を記録するためのref
  const initialPosition = React.useRef<{ x: number; y: number } | null>(null);
  const viewRef = React.useRef<any>(null);

  // 触覚フィードバック関数
  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  // 初期位置を測定
  const measureInitialPosition = React.useCallback(() => {
    if (viewRef.current) {
      viewRef.current.measureInWindow((x, y, width, height) => {
        initialPosition.current = { x, y };
        console.log(`[GestureWord] Initial position for "${word.text}":`, { x, y, width, height });
      });
    }
  }, [word.text]);

  // ドラッグ開始時のハンドラー
  const handleDragStart = useCallback(() => {
    'worklet';
    scale.value = withSpring(1.1, { damping: 10 });
    opacity.value = withSpring(0.9);
    zIndex.value = 1000;
    
    // 初期位置を測定
    runOnJS(measureInitialPosition)();
    
    if (onDragStart) {
      runOnJS(onDragStart)();
    }
    runOnJS(triggerHaptic)();
  }, [onDragStart, triggerHaptic, scale, opacity, zIndex, measureInitialPosition]);

  // ドラッグ終了時のハンドラー
  const handleDragEndJS = useCallback((x: number, y: number) => {
    console.log(`[GestureWord] Drag end for "${word.text}":`, { x, y });
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
      // ドラッグ開始時に必ず位置を測定
      measureInitialPosition();
      handleDragStart();
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      // 複数の座標取得方法を試す
      const absoluteX = event.absoluteX || 0;
      const absoluteY = event.absoluteY || 0;
      const x = event.x || 0;
      const y = event.y || 0;
      
      console.log(`[GestureWord] onEnd event for "${word.text}":`, {
        absoluteX,
        absoluteY,
        x,
        y,
        translationX: event.translationX,
        translationY: event.translationY,
        velocity: { x: event.velocityX, y: event.velocityY }
      });
      
      // iOS シミュレーターでは absoluteY が正しく取得できない場合がある
      // 初期位置 + 移動量で計算する方法を優先
      let finalX = 0;
      let finalY = 0;
      
      if (initialPosition.current && initialPosition.current.x > 0 && initialPosition.current.y > 0) {
        // 初期位置が取得できている場合は、それを基準に計算
        finalX = initialPosition.current.x + event.translationX;
        finalY = initialPosition.current.y + event.translationY;
        console.log(`[GestureWord] Using initial position + translation:`, { 
          finalX, 
          finalY, 
          initial: initialPosition.current, 
          translation: { x: event.translationX, y: event.translationY }
        });
      } else if (absoluteX > 0 && absoluteY > 0) {
        // absoluteX/Y が利用可能な場合
        finalX = absoluteX;
        finalY = absoluteY;
        console.log(`[GestureWord] Using absolute coordinates:`, { finalX, finalY });
      } else if (x > 0 && y > 0) {
        // x/y が利用可能な場合
        finalX = x;
        finalY = y;
        console.log(`[GestureWord] Using x/y coordinates:`, { finalX, finalY });
      }
      
      console.log(`[GestureWord] Final coordinates:`, { finalX, finalY });
      
      // 座標が有効な場合のみハンドラーを呼び出す
      if (finalX > 0 && finalY > 0) {
        runOnJS(handleDragEndJS)(finalX, finalY);
      } else {
        console.log(`[GestureWord] Invalid coordinates, skipping drop detection`);
      }
      
      // アニメーションで元の位置に戻す
      translateX.value = withSpring(0, { damping: 10 });
      translateY.value = withSpring(0, { damping: 10 });
      scale.value = withSpring(1, { damping: 10 });
      opacity.value = withSpring(1);
      zIndex.value = withSpring(0);
    })
    .onFinalize(() => {
      // ジェスチャーがキャンセルされた場合も元に戻す
      translateX.value = withSpring(0, { damping: 10 });
      translateY.value = withSpring(0, { damping: 10 });
      scale.value = withSpring(1, { damping: 10 });
      opacity.value = withSpring(1);
      zIndex.value = 0;
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
      <Animated.View 
        ref={viewRef}
        style={[styles.wordWrapper, animatedStyle]}
        onLayout={measureInitialPosition}
      >
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