/**
 * SimpleGestureWord Component
 * 
 * PanResponderを使用したシンプルで安定したドラッグ実装
 * Expo Goでクラッシュしない設計
 */
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Word, IMIJUN_LABELS } from '@imijun/core';

interface SimpleGestureWordProps {
  word: Word;
  colorScheme: {
    main: string;
    light: string;
    dark: string;
    gradient: string[];
  };
  onDragEnd?: (word: Word, x: number, y: number) => void;
}

const SimpleGestureWord: React.FC<SimpleGestureWordProps> = ({
  word,
  colorScheme,
  onDragEnd,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: () => {
        // ドラッグ開始
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1.1,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      },
      
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      
      onPanResponderRelease: (evt, gestureState) => {
        // ドラッグ終了
        const dropX = evt.nativeEvent.pageX;
        const dropY = evt.nativeEvent.pageY;
        
        console.log(`[SimpleGestureWord] Drop "${word.text}" at:`, { dropX, dropY });
        
        if (onDragEnd) {
          onDragEnd(word, dropX, dropY);
        }
        
        // 元の位置に戻す
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.wordWrapper,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scale },
          ],
          opacity: opacity,
        },
      ]}
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
  );
};

const styles = StyleSheet.create({
  wordWrapper: {
    margin: 6,
    zIndex: 1000,
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

export default SimpleGestureWord;