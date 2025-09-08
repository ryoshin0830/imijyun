import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import {
  DEMO_LESSONS,
  TUTORIAL_LESSON,
  IMIJUN_COLORS,
  type Lesson,
  type LessonLevel,
} from '@imijun/core';

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
  const allLessons = [TUTORIAL_LESSON, ...DEMO_LESSONS];

  const filteredLessons = selectedLevel === 'all' 
    ? allLessons 
    : allLessons.filter(lesson => lesson.level === selectedLevel);

  const handleLessonPress = (lesson: Lesson) => {
    // Navigate to lesson screen with lesson ID
    router.push({
      pathname: '/lesson/[id]',
      params: { id: lesson.id }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>レッスン選択</Text>
        <Text style={styles.subtitle}>学習したいレッスンを選んでください</Text>
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

      {/* Lessons List */}
      <ScrollView style={styles.lessonsList} showsVerticalScrollIndicator={false}>
        {filteredLessons.map((lesson, index) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            index={index}
            onPress={() => handleLessonPress(lesson)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const LessonCard: React.FC<{
  lesson: Lesson;
  index: number;
  onPress: () => void;
}> = ({ lesson, index, onPress }) => {
  const levelColor = LEVEL_COLORS[lesson.level];
  const levelLabel = LEVEL_LABELS[lesson.level];

  // Generate preview of word types in this lesson
  const wordTypes = [...new Set(lesson.words.map(word => word.type))];
  const previewColors = wordTypes.map(type => IMIJUN_COLORS[type]);

  return (
    <TouchableOpacity style={styles.lessonCard} onPress={onPress}>
      <View style={styles.lessonHeader}>
        <View style={styles.lessonNumber}>
          <Text style={styles.lessonNumberText}>{index + 1}</Text>
        </View>
        <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
          <Text style={styles.levelBadgeText}>{levelLabel}</Text>
        </View>
      </View>

      <Text style={styles.lessonTitle}>{lesson.title}</Text>
      <Text style={styles.lessonDescription}>{lesson.description}</Text>

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

      {/* Progress Indicator (placeholder) */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill,
            { 
              width: lesson.id === 'tutorial' ? '100%' : '0%',
              backgroundColor: IMIJUN_COLORS.subject 
            }
          ]} />
        </View>
        <Text style={styles.progressText}>
          {lesson.id === 'tutorial' ? '完了済み' : '未完了'}
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
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
});