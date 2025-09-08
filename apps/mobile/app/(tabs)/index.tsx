import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { IMIJUN_COLORS } from '@imijun/core';

const { width: screenWidth } = Dimensions.get('window');

// アニメーション用のカスタムコンポーネント
const AnimatedCard = ({ children, delay = 0, style }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const startTutorial = () => {
    router.push({
      pathname: '/lesson/[id]',
      params: { id: 'tutorial' }
    });
  };

  const goToLessons = () => {
    router.push('/(tabs)/lessons');
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView 
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* ヘッダーグラデーション */}
        <Animated.View style={[styles.headerWrapper, { opacity: headerOpacity }]}>
          <LinearGradient
            colors={[IMIJUN_COLORS.subject, IMIJUN_COLORS.verb]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>こんにちは！</Text>
              <Text style={styles.welcomeMessage}>
                今日も意味順で英語を学びましょう
              </Text>
              
              {/* 学習ストリーク */}
              <View style={styles.streakContainer}>
                <Ionicons name="flame" size={24} color="#FFA500" />
                <Text style={styles.streakText}>0日連続</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.content}>
          {/* クイックスタートセクション */}
          <AnimatedCard delay={100} style={styles.section}>
            <Text style={styles.sectionTitle}>クイックスタート</Text>
            <View style={styles.quickStartGrid}>
              <TouchableOpacity 
                style={[styles.quickCard, styles.tutorialCard]} 
                onPress={startTutorial}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[IMIJUN_COLORS.subject, '#5B8DEF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <Ionicons name="school-outline" size={32} color="white" />
                  <Text style={styles.quickCardTitle}>チュートリアル</Text>
                  <Text style={styles.quickCardSubtitle}>基本を学ぶ</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.quickCard, styles.todayCard]} 
                onPress={goToLessons}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[IMIJUN_COLORS.verb, '#E560AA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <Ionicons name="today-outline" size={32} color="white" />
                  <Text style={styles.quickCardTitle}>今日のレッスン</Text>
                  <Text style={styles.quickCardSubtitle}>挑戦しよう</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </AnimatedCard>

          {/* 学習進捗サマリー */}
          <AnimatedCard delay={200} style={styles.section}>
            <Text style={styles.sectionTitle}>学習進捗</Text>
            <View style={styles.statsCard}>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: IMIJUN_COLORS.subject + '20' }]}>
                    <Ionicons name="checkmark-circle" size={24} color={IMIJUN_COLORS.subject} />
                  </View>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>完了レッスン</Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: IMIJUN_COLORS.object + '20' }]}>
                    <Ionicons name="trophy" size={24} color={IMIJUN_COLORS.object} />
                  </View>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>総得点</Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: IMIJUN_COLORS.place + '20' }]}>
                    <Ionicons name="time" size={24} color={IMIJUN_COLORS.place} />
                  </View>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>学習時間(分)</Text>
                </View>
              </View>

              {/* プログレスバー */}
              <View style={styles.progressSection}>
                <Text style={styles.progressTitle}>今週の目標達成率</Text>
                <View style={styles.progressBar}>
                  <Animated.View 
                    style={[
                      styles.progressFill,
                      { width: '0%' }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>0 / 7 レッスン</Text>
              </View>
            </View>
          </AnimatedCard>

          {/* 意味順ボックスの説明 */}
          <AnimatedCard delay={300} style={styles.section}>
            <Text style={styles.sectionTitle}>意味順5つのボックス</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.boxesScroll}
            >
              {[
                { color: IMIJUN_COLORS.subject, label: 'だれが', sublabel: 'Who', icon: 'person' },
                { color: IMIJUN_COLORS.verb, label: 'する', sublabel: 'Do', icon: 'flash' },
                { color: IMIJUN_COLORS.object, label: 'だれ・なに', sublabel: 'What', icon: 'cube' },
                { color: IMIJUN_COLORS.place, label: 'どこ', sublabel: 'Where', icon: 'location' },
                { color: IMIJUN_COLORS.time, label: 'いつ', sublabel: 'When', icon: 'time' },
              ].map((box, index) => (
                <View key={index} style={styles.meaningBox}>
                  <View style={[styles.meaningBoxCard, { backgroundColor: box.color }]}>
                    <Ionicons name={box.icon as any} size={28} color="white" />
                    <Text style={styles.meaningBoxLabel}>{box.label}</Text>
                    <Text style={styles.meaningBoxSublabel}>{box.sublabel}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </AnimatedCard>

          {/* 最近のレッスン履歴 */}
          <AnimatedCard delay={400} style={styles.section}>
            <Text style={styles.sectionTitle}>最近の学習</Text>
            <View style={styles.recentCard}>
              <View style={styles.emptyState}>
                <Ionicons name="book-outline" size={48} color="#d1d5db" />
                <Text style={styles.emptyStateText}>
                  まだ学習履歴がありません
                </Text>
                <TouchableOpacity 
                  style={styles.startButton}
                  onPress={startTutorial}
                  activeOpacity={0.8}
                >
                  <Text style={styles.startButtonText}>学習を始める</Text>
                </TouchableOpacity>
              </View>
            </View>
          </AnimatedCard>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  headerWrapper: {
    marginBottom: -20,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '300',
    color: 'white',
    marginBottom: 8,
  },
  welcomeMessage: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  streakText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  quickStartGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickCard: {
    flex: 1,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  tutorialCard: {
    marginRight: 8,
  },
  todayCard: {
    marginLeft: 8,
  },
  cardGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickCardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  quickCardSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  progressSection: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 16,
  },
  progressTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: IMIJUN_COLORS.subject,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  boxesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  meaningBox: {
    marginRight: 12,
  },
  meaningBoxCard: {
    width: 100,
    height: 120,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  meaningBoxLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  meaningBoxSublabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  recentCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 12,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: IMIJUN_COLORS.subject,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  startButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});