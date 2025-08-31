import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  level: number;
}

export interface UserSettings {
  darkMode: boolean;
  audioEnabled: boolean;
  language: 'en' | 'ja';
}

export interface UserProgress {
  currentLevel: number;
  xp: number;
  totalProblemsCompleted: number;
  streak: number;
  lastActivityDate: string | null;
  badges: string[];
  completedLessons: string[];
}

interface UserState {
  // User profile
  userProfile: UserProfile | null;
  
  // Settings
  settings: UserSettings;
  
  // Progress
  progress: UserProgress;
  
  // Actions
  setUserProfile: (profile: UserProfile) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addXP: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  addBadge: (badgeId: string) => void;
  markLessonComplete: (lessonId: string) => void;
  checkAndUpdateStreak: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userProfile: null,
      
      settings: {
        darkMode: false,
        audioEnabled: true,
        language: 'ja',
      },
      
      progress: {
        currentLevel: 1,
        xp: 0,
        totalProblemsCompleted: 0,
        streak: 0,
        lastActivityDate: null,
        badges: [],
        completedLessons: [],
      },

      setUserProfile: (profile) => {
        set({ userProfile: profile });
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      addXP: (points) => {
        set((state) => {
          const newXP = state.progress.xp + points;
          const newLevel = Math.floor(newXP / 100) + 1;
          
          return {
            progress: {
              ...state.progress,
              xp: newXP,
              currentLevel: Math.max(state.progress.currentLevel, newLevel),
              totalProblemsCompleted: state.progress.totalProblemsCompleted + 1,
            },
          };
        });
      },

      incrementStreak: () => {
        set((state) => ({
          progress: {
            ...state.progress,
            streak: state.progress.streak + 1,
            lastActivityDate: new Date().toISOString(),
          },
        }));
      },

      resetStreak: () => {
        set((state) => ({
          progress: {
            ...state.progress,
            streak: 0,
          },
        }));
      },

      addBadge: (badgeId) => {
        set((state) => {
          if (!state.progress.badges.includes(badgeId)) {
            return {
              progress: {
                ...state.progress,
                badges: [...state.progress.badges, badgeId],
              },
            };
          }
          return state;
        });
      },

      markLessonComplete: (lessonId) => {
        set((state) => {
          if (!state.progress.completedLessons.includes(lessonId)) {
            return {
              progress: {
                ...state.progress,
                completedLessons: [...state.progress.completedLessons, lessonId],
              },
            };
          }
          return state;
        });
      },

      checkAndUpdateStreak: () => {
        const state = get();
        const lastActivity = state.progress.lastActivityDate;
        
        if (!lastActivity) {
          state.incrementStreak();
          return;
        }
        
        const lastDate = new Date(lastActivity);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day
          state.incrementStreak();
        } else if (diffDays > 1) {
          // Streak broken
          state.resetStreak();
          state.incrementStreak();
        }
        // If diffDays === 0, it's the same day, don't update streak
      },
    }),
    {
      name: 'imijun-user-storage',
      partialize: (state) => ({
        settings: state.settings,
        progress: state.progress,
      }),
    }
  )
);