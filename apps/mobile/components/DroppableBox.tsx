import React, { useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { DraxView, DraxViewDragStatus } from 'react-native-drax';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { BoxState, IMIJUN_LABELS, ENGLISH_LABELS, Word } from '@imijun/core';

interface DroppableBoxProps {
  boxState: BoxState;
  colorScheme: {
    main: string;
    light: string;
    dark: string;
    gradient: string[];
  };
  onReceiveDrop: (word: Word) => void;
  onRemoveWord: () => void;
  index: number;
}

const DroppableBox: React.FC<DroppableBoxProps> = ({
  boxState,
  colorScheme,
  onReceiveDrop,
  onRemoveWord,
  index,
}) => {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const borderWidth = useSharedValue(2);

  const japaneseLabel = IMIJUN_LABELS[boxState.type];
  const englishLabel = ENGLISH_LABELS[boxState.type];

  // 初期アニメーション
  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });
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
    <DraxView
      style={styles.dropBoxWrapper}
      receptive={!boxState.word}
      onReceiveDragEnter={({ dragged: { payload } }) => {
        const word = payload as Word;
        if (word.type === boxState.type) {
          scale.value = withSpring(1.05);
          borderWidth.value = withSpring(3);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
      onReceiveDragExit={() => {
        scale.value = withSpring(1);
        borderWidth.value = withSpring(2);
      }}
      onReceiveDragDrop={({ dragged: { payload } }) => {
        const word = payload as Word;
        if (word.type === boxState.type) {
          onReceiveDrop(word);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          // 間違った配置
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }}
      noHover={true}
      renderContent={({ viewState }) => {
        const isReceiving = viewState?.receivingStatus === 'receiving';
        
        return (
          <Animated.View style={[styles.boxContainer, animatedStyle]}>
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
              style={[
                styles.dropBox,
                isReceiving && styles.dropBoxReceiving,
                { borderColor: colorScheme.main }
              ]}
            >
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
      }}
    />
  );
};

const styles = StyleSheet.create({
  dropBoxWrapper: {
    width: '30%',
    minWidth: 100,
    height: 110,
    margin: 8,
  },
  boxContainer: {
    flex: 1,
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
    borderWidth: 2,
    borderStyle: 'solid',
  },
  dropBoxReceiving: {
    borderWidth: 3,
    borderStyle: 'dashed',
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
});

export default DroppableBox;