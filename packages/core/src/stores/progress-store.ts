import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress, LessonProgress } from '../types/lesson';
import { SCORING } from '../constants/imijun';

/**
 * Progress store state interface
 */
export interface ProgressState extends UserProgress {
  // Actions
  updateLessonProgress: (lessonId: string, completed: boolean, timeSpent: number) => void;
  addScore: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  setCurrentLesson: (lessonId: string) => void;
  
  // Helpers
  getLessonProgress: (lessonId: string) => LessonProgress | null;
  getTotalTimeSpent: () => number;
  getCompletionRate: () => number;
  canAdvanceToLesson: (lessonId: string) => boolean;
}

/**
 * Create default lesson progress
 */
const createDefaultLessonProgress = (lessonId: string): LessonProgress => ({
  lessonId,
  completed: false,
  attempts: 0,
  score: 0,
  timeSpent: 0,
  lastAttemptAt: new Date(),
});

/**
 * Zustand store for managing user progress with persistence
 */
export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentLessonId: null,
      totalScore: 0,
      streak: 0,
      lessonsCompleted: 0,
      lessonsProgress: {},
      lastActiveAt: new Date(),

      // Actions
      updateLessonProgress: (lessonId: string, completed: boolean, timeSpent: number) => {
        const state = get();
        const existingProgress = state.lessonsProgress[lessonId] || createDefaultLessonProgress(lessonId);
        
        const wasCompletedBefore = existingProgress.completed;
        const updatedProgress: LessonProgress = {
          ...existingProgress,
          completed,
          attempts: existingProgress.attempts + 1,
          timeSpent: existingProgress.timeSpent + timeSpent,
          lastAttemptAt: new Date(),
        };

        // Calculate score
        let scoreToAdd = 0;
        if (completed) {
          scoreToAdd += SCORING.CORRECT_PLACEMENT;
          
          // Perfect lesson bonus (first attempt)
          if (updatedProgress.attempts === 1) {
            scoreToAdd += SCORING.PERFECT_LESSON;
          }
          
          // Time bonus (completed quickly)
          if (timeSpent <= SCORING.TIME_BONUS_THRESHOLD) {
            scoreToAdd += SCORING.TIME_BONUS;
          }
          
          // Streak bonus
          scoreToAdd += state.streak * SCORING.STREAK_BONUS;
        }

        updatedProgress.score += scoreToAdd;

        const newLessonsCompleted = completed && !wasCompletedBefore 
          ? state.lessonsCompleted + 1 
          : state.lessonsCompleted;

        set({
          lessonsProgress: {
            ...state.lessonsProgress,
            [lessonId]: updatedProgress,
          },
          totalScore: state.totalScore + scoreToAdd,
          lessonsCompleted: newLessonsCompleted,
          lastActiveAt: new Date(),
        });

        // Update streak
        if (completed) {
          get().incrementStreak();
        } else {
          get().resetStreak();
        }
      },

      addScore: (points: number) => {
        set(state => ({
          totalScore: state.totalScore + points,
          lastActiveAt: new Date(),
        }));
      },

      incrementStreak: () => {
        set(state => ({
          streak: state.streak + 1,
          lastActiveAt: new Date(),
        }));
      },

      resetStreak: () => {
        set({ 
          streak: 0,
          lastActiveAt: new Date(),
        });
      },

      setCurrentLesson: (lessonId: string) => {
        set({
          currentLessonId: lessonId,
          lastActiveAt: new Date(),
        });
      },

      // Helpers
      getLessonProgress: (lessonId: string) => {
        return get().lessonsProgress[lessonId] || null;
      },

      getTotalTimeSpent: () => {
        const state = get();
        return Object.values(state.lessonsProgress).reduce(
          (total, progress) => total + progress.timeSpent,
          0
        );
      },

      getCompletionRate: () => {
        const state = get();
        const totalLessons = Object.keys(state.lessonsProgress).length;
        if (totalLessons === 0) return 0;
        return (state.lessonsCompleted / totalLessons) * 100;
      },

      canAdvanceToLesson: (lessonId: string) => {
        // For now, all lessons are accessible
        // This can be enhanced to implement sequential unlocking
        return true;
      },
    }),
    {
      name: 'imijun-progress',
      version: 1,
    }
  )
);