import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  DEMO_LESSONS,
  TUTORIAL_LESSON,
  IMIJUN_COLORS,
  type Lesson,
  type LessonLevel,
} from '@imijun/core';
import { MOBILE_LESSONS, LESSON_CATEGORIES } from '../../data/lessons';
import { storage, type LessonProgress, type UserStats } from '../../utils/storage';
import Svg, { Path, Circle } from 'react-native-svg';

const LEVEL_COLORS = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
} as const;

const LEVEL_LABELS = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
} as const;

export default function LessonsScreen() {
  const [selectedLevel, setSelectedLevel] = useState<LessonLevel | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof LESSON_CATEGORIES | 'all'>('all');
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Combine all lessons
  const allLessons = [TUTORIAL_LESSON, ...DEMO_LESSONS, ...MOBILE_LESSONS];

  // Filter lessons based on level and category
  const getFilteredLessons = () => {
    let filtered = allLessons;
    
    // Filter by level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(lesson => lesson.level === selectedLevel);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryLessonIds = LESSON_CATEGORIES[selectedCategory].lessonIds;
      filtered = filtered.filter(lesson => categoryLessonIds.includes(lesson.id));
    }
    
    return filtered;
  };

  const filteredLessons = getFilteredLessons();

  // Load progress data
  const loadProgressData = async () => {
    try {
      const [progress, stats] = await Promise.all([
        storage.getAllLessonProgress(),
        storage.getUserStats(),
      ]);
      setLessonProgress(progress);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProgressData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadProgressData();
  };

  const handleLessonPress = (lesson: Lesson) => {
    // Navigate to lesson screen with lesson ID
    router.push({
      pathname: '/lesson/[id]',
      params: { id: lesson.id }
    });
  };

  const calculateOverallProgress = () => {
    const totalLessons = allLessons.length;
    const completedLessons = Object.values(lessonProgress).filter(p => p.isCompleted).length;
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={IMIJUN_COLORS.subject} />
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Header with Stats */}
      <View style={styles.header}>
        <Text style={styles.title}>レッスン選択</Text>
        <Text style={styles.subtitle}>学習したいレッスンを選んでください</Text>
        
        {/* User Stats Summary */}
        {userStats && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Svg width="24" height="24" viewBox="0 0 24 24">
                <Path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill="#fbbf24"
                />
              </Svg>
              <Text style={styles.statValue}>{userStats.totalScore}</Text>
              <Text style={styles.statLabel}>総スコア</Text>
            </View>
            
            <View style={styles.statCard}>
              <Svg width="24" height="24" viewBox="0 0 24 24">
                <Circle cx="12" cy="12" r="10" fill="#34d399" />
                <Path
                  d="M9 12l2 2 4-4"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </Svg>
              <Text style={styles.statValue}>{userStats.lessonsCompleted}</Text>
              <Text style={styles.statLabel}>完了</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.statValue}>{userStats.currentStreak}</Text>
              <Text style={styles.statLabel}>連続日数</Text>
            </View>
          </View>
        )}
        
        {/* Overall Progress Bar */}
        <View style={styles.overallProgressContainer}>
          <Text style={styles.overallProgressLabel}>
            全体の進捗: {Math.round(calculateOverallProgress())}%
          </Text>
          <View style={styles.overallProgressBar}>
            <LinearGradient
              colors={['#60a5fa', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.overallProgressFill,
                { width: `${calculateOverallProgress()}%` }
              ]}
            />
          </View>
        </View>
      </View>

      {/* Level Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedLevel === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedLevel('all')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedLevel === 'all' && styles.filterButtonTextActive
            ]}>
              すべて
            </Text>
          </TouchableOpacity>
          
          {Object.entries(LEVEL_LABELS).map(([level, label]) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.filterButton,
                selectedLevel === level && styles.filterButtonActive,
                selectedLevel === level && {
                  backgroundColor: LEVEL_COLORS[level as LessonLevel]
                }
              ]}
              onPress={() => setSelectedLevel(level as LessonLevel)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedLevel === level && styles.filterButtonTextActive
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryTab,
            selectedCategory === 'all' && styles.categoryTabActive
          ]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[
            styles.categoryTabText,
            selectedCategory === 'all' && styles.categoryTabTextActive
          ]}>
            すべて
          </Text>
        </TouchableOpacity>
        
        {Object.entries(LESSON_CATEGORIES).map(([key, category]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.categoryTab,
              selectedCategory === key && styles.categoryTabActive
            ]}
            onPress={() => setSelectedCategory(key as keyof typeof LESSON_CATEGORIES)}
          >
            <Text style={[
              styles.categoryTabText,
              selectedCategory === key && styles.categoryTabTextActive
            ]}>
              {category.title}
            </Text>
            {selectedCategory === key && (
              <Text style={styles.categoryDescription}>
                {category.description}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lessons List */}
      <ScrollView 
        style={styles.lessonsList} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[IMIJUN_COLORS.subject]}
            tintColor={IMIJUN_COLORS.subject}
          />
        }
      >
        {filteredLessons.map((lesson, index) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            index={index}
            progress={lessonProgress[lesson.id]}
            onPress={() => handleLessonPress(lesson)}
          />
        ))}
        
        {filteredLessons.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              該当するレッスンがありません
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const LessonCard: React.FC<{
  lesson: Lesson;
  index: number;
  progress?: LessonProgress;
  onPress: () => void;
}> = ({ lesson, index, progress, onPress }) => {
  const levelColor = LEVEL_COLORS[lesson.level];
  const levelLabel = LEVEL_LABELS[lesson.level];

  // Generate preview of word types in this lesson
  const wordTypes = [...new Set(lesson.words.map(word => word.type))];
  const previewColors = wordTypes.map(type => IMIJUN_COLORS[type]);

  // Calculate progress percentage
  const progressPercentage = progress?.isCompleted ? 100 : progress?.attempts ? 50 : 0;

  return (
    <TouchableOpacity style={styles.lessonCard} onPress={onPress}>
      {progress?.isCompleted && (
        <LinearGradient
          colors={['rgba(34, 197, 94, 0.05)', 'rgba(34, 197, 94, 0.02)']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      
      <View style={styles.lessonHeader}>
        <View style={[
          styles.lessonNumber,
          progress?.isCompleted && styles.lessonNumberCompleted
        ]}>
          {progress?.isCompleted ? (
            <Svg width="20" height="20" viewBox="0 0 24 24">
              <Path
                d="M9 12l2 2 4-4"
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          ) : (
            <Text style={styles.lessonNumberText}>{index + 1}</Text>
          )}
        </View>
        <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
          <Text style={styles.levelBadgeText}>{levelLabel}</Text>
        </View>
      </View>

      <Text style={[
        styles.lessonTitle,
        progress?.isCompleted && styles.lessonTitleCompleted
      ]}>
        {lesson.title}
      </Text>
      <Text style={styles.lessonDescription}>{lesson.description}</Text>

      {/* Stats Row */}
      {progress && (
        <View style={styles.statsRow}>
          {progress.bestScore > 0 && (
            <View style={styles.statBadge}>
              <Text style={styles.statBadgeIcon}>⭐</Text>
              <Text style={styles.statBadgeText}>{progress.bestScore}</Text>
            </View>
          )}
          {progress.attempts > 0 && (
            <View style={styles.statBadge}>
              <Text style={styles.statBadgeIcon}>📝</Text>
              <Text style={styles.statBadgeText}>{progress.attempts}回</Text>
            </View>
          )}
          {progress.timeSpent && progress.timeSpent > 0 && (
            <View style={styles.statBadge}>
              <Text style={styles.statBadgeIcon}>⏱</Text>
              <Text style={styles.statBadgeText}>
                {Math.round(progress.timeSpent / 60)}分
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Word Type Preview */}
      <View style={styles.wordTypePreview}>
        <Text style={styles.wordTypeLabel}>使用する要素:</Text>
        <View style={styles.colorDots}>
          {previewColors.map((color, i) => (
            <View
              key={i}
              style={[styles.colorDot, { backgroundColor: color }]}
            />
          ))}
        </View>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={
              progress?.isCompleted 
                ? ['#22c55e', '#16a34a']
                : progressPercentage > 0
                ? ['#60a5fa', '#3b82f6']
                : ['#e5e7eb', '#e5e7eb']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%` }
            ]}
          />
        </View>
        <Text style={[
          styles.progressText,
          progress?.isCompleted && styles.progressTextCompleted
        ]}>
          {progress?.isCompleted 
            ? '完了済み' 
            : progress?.attempts 
            ? `挑戦中 (${progress.attempts}回)` 
            : '未開始'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    minWidth: 90,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  streakEmoji: {
    fontSize: 24,
  },
  overallProgressContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  overallProgressLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  overallProgressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  overallProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#60a5fa',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  lessonsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  lessonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  wordTypePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  wordTypeLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginRight: 8,
  },
  colorDots: {
    flexDirection: 'row',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  progressTextCompleted: {
    color: '#22c55e',
    fontWeight: '600',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryTabActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#60a5fa',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  categoryTabTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  categoryDescription: {
    fontSize: 11,
    color: '#60a5fa',
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  lessonNumberCompleted: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  lessonTitleCompleted: {
    color: '#16a34a',
  },
  statsRow: {
    flexDirection: 'row',
    marginVertical: 8,
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statBadgeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statBadgeText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
});