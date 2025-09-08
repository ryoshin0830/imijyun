import React from 'react';
import { Container, Text, Button } from '../primitives';
import { ProgressBar } from './progress-bar';
import { type Lesson, type LessonProgress } from '@imijun/core';

export interface LessonCardProps {
  lesson: Lesson;
  progress?: LessonProgress;
  onStart?: () => void;
  onContinue?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Lesson Card component for displaying lesson information and progress
 * Cross-platform compatible with consistent styling
 */
export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  progress,
  onStart,
  onContinue,
  className = '',
  style,
}) => {
  const isCompleted = progress?.completed ?? false;
  const hasStarted = progress && progress.attempts > 0;
  
  const getLevelColor = (level: Lesson['level']) => {
    switch (level) {
      case 'beginner':
        return '#10b981'; // green
      case 'intermediate':
        return '#f59e0b'; // amber
      case 'advanced':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const getLevelText = (level: Lesson['level']) => {
    switch (level) {
      case 'beginner':
        return '初級';
      case 'intermediate':
        return '中級';
      case 'advanced':
        return '上級';
      default:
        return level;
    }
  };

  const getProgressPercentage = (): number => {
    if (isCompleted) return 100;
    if (hasStarted) return 50;
    return 0;
  };

  const handleAction = () => {
    if (isCompleted || hasStarted) {
      onContinue?.();
    } else {
      onStart?.();
    }
  };

  return (
    <Container
      className={className}
      style={style}
      background="white"
      padding="md"
      radius="lg"
      shadow="md"
      border
    >
      <Container style={{ marginBottom: 12 }}>
        <Container flex direction="row" justify="space-between" align="center" style={{ marginBottom: 8 }}>
          <Text variant="heading" color="primary" size="lg" weight="semibold">
            {lesson.title}
          </Text>
          
          <Container
            padding="xs"
            radius="sm"
            style={{
              backgroundColor: getLevelColor(lesson.level),
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Text
              variant="caption"
              size="xs"
              weight="medium"
              style={{ color: 'white' }}
            >
              {getLevelText(lesson.level)}
            </Text>
          </Container>
        </Container>

        <Text variant="body" color="secondary" size="sm" style={{ marginBottom: 12 }}>
          {lesson.description}
        </Text>

        {progress && (
          <Container style={{ marginBottom: 12 }}>
            <ProgressBar
              progress={getProgressPercentage()}
              showLabel
              color={isCompleted ? 'success' : 'primary'}
            />
          </Container>
        )}

        {progress && (
          <Container flex direction="row" justify="space-between" style={{ marginBottom: 16 }}>
            <Text variant="caption" color="muted" size="sm">
              試行回数: {progress.attempts}
            </Text>
            {progress.score > 0 && (
              <Text variant="caption" color="muted" size="sm">
                スコア: {progress.score}点
              </Text>
            )}
          </Container>
        )}
      </Container>

      <Button
        variant={isCompleted ? 'secondary' : 'primary'}
        size="md"
        onPress={handleAction}
      >
        {isCompleted 
          ? 'もう一度挑戦' 
          : hasStarted 
          ? '続ける' 
          : 'レッスンを始める'}
      </Button>
    </Container>
  );
};