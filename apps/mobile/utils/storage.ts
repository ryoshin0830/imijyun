import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const STORAGE_KEYS = {
  LESSON_PROGRESS: '@imijun:lesson_progress',
  USER_STATS: '@imijun:user_stats',
  SETTINGS: '@imijun:settings',
  COMPLETED_LESSONS: '@imijun:completed_lessons',
} as const;

// Types
export interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
  bestScore: number;
  attempts: number;
  completedAt?: string;
  timeSpent?: number; // in seconds
}

export interface UserStats {
  totalScore: number;
  lessonsCompleted: number;
  totalAttempts: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  averageAccuracy: number;
  totalTimeSpent: number; // in seconds
}

export interface Settings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  showHints: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  language: 'ja' | 'en';
}

// Default values
const DEFAULT_USER_STATS: UserStats = {
  totalScore: 0,
  lessonsCompleted: 0,
  totalAttempts: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: new Date().toISOString(),
  averageAccuracy: 0,
  totalTimeSpent: 0,
};

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  hapticEnabled: true,
  showHints: true,
  difficulty: 'normal',
  language: 'ja',
};

// Storage Service
class StorageService {
  // Generic storage methods
  private async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }

  private async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  }

  private async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  // Lesson Progress Methods
  async getLessonProgress(lessonId: string): Promise<LessonProgress | null> {
    try {
      const allProgress = await this.getAllLessonProgress();
      return allProgress[lessonId] || null;
    } catch (error) {
      console.error('Error getting lesson progress:', error);
      return null;
    }
  }

  async getAllLessonProgress(): Promise<Record<string, LessonProgress>> {
    return this.getItem(STORAGE_KEYS.LESSON_PROGRESS, {});
  }

  async saveLessonProgress(progress: LessonProgress): Promise<void> {
    try {
      const allProgress = await this.getAllLessonProgress();
      allProgress[progress.lessonId] = progress;
      await this.setItem(STORAGE_KEYS.LESSON_PROGRESS, allProgress);
    } catch (error) {
      console.error('Error saving lesson progress:', error);
      throw error;
    }
  }

  async markLessonCompleted(
    lessonId: string,
    score: number,
    timeSpent?: number
  ): Promise<void> {
    try {
      const existingProgress = await this.getLessonProgress(lessonId);
      const newProgress: LessonProgress = {
        lessonId,
        isCompleted: true,
        bestScore: Math.max(score, existingProgress?.bestScore || 0),
        attempts: (existingProgress?.attempts || 0) + 1,
        completedAt: new Date().toISOString(),
        timeSpent: (existingProgress?.timeSpent || 0) + (timeSpent || 0),
      };
      
      await this.saveLessonProgress(newProgress);
      
      // Update user stats
      await this.updateUserStatsAfterLesson(score, !existingProgress?.isCompleted, timeSpent);
    } catch (error) {
      console.error('Error marking lesson completed:', error);
      throw error;
    }
  }

  async resetLessonProgress(lessonId: string): Promise<void> {
    try {
      const allProgress = await this.getAllLessonProgress();
      delete allProgress[lessonId];
      await this.setItem(STORAGE_KEYS.LESSON_PROGRESS, allProgress);
    } catch (error) {
      console.error('Error resetting lesson progress:', error);
      throw error;
    }
  }

  async resetAllProgress(): Promise<void> {
    try {
      await this.removeItem(STORAGE_KEYS.LESSON_PROGRESS);
      await this.removeItem(STORAGE_KEYS.USER_STATS);
    } catch (error) {
      console.error('Error resetting all progress:', error);
      throw error;
    }
  }

  // User Stats Methods
  async getUserStats(): Promise<UserStats> {
    return this.getItem(STORAGE_KEYS.USER_STATS, DEFAULT_USER_STATS);
  }

  async updateUserStatsAfterLesson(
    score: number,
    isNewCompletion: boolean,
    timeSpent?: number
  ): Promise<void> {
    try {
      const stats = await this.getUserStats();
      const today = new Date().toISOString().split('T')[0];
      const lastActivityDay = stats.lastActivityDate.split('T')[0];
      
      // Update streak
      if (today !== lastActivityDay) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastActivityDay === yesterdayStr) {
          stats.currentStreak += 1;
        } else {
          stats.currentStreak = 1;
        }
        
        stats.longestStreak = Math.max(stats.currentStreak, stats.longestStreak);
      }
      
      // Update other stats
      stats.totalScore += score;
      stats.totalAttempts += 1;
      stats.lastActivityDate = new Date().toISOString();
      
      if (isNewCompletion) {
        stats.lessonsCompleted += 1;
      }
      
      if (timeSpent) {
        stats.totalTimeSpent += timeSpent;
      }
      
      // Calculate average accuracy (simple formula)
      const accuracy = Math.min(100, (score / 100) * 100);
      stats.averageAccuracy = 
        (stats.averageAccuracy * (stats.totalAttempts - 1) + accuracy) / stats.totalAttempts;
      
      await this.setItem(STORAGE_KEYS.USER_STATS, stats);
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }

  async resetUserStats(): Promise<void> {
    try {
      await this.setItem(STORAGE_KEYS.USER_STATS, DEFAULT_USER_STATS);
    } catch (error) {
      console.error('Error resetting user stats:', error);
      throw error;
    }
  }

  // Settings Methods
  async getSettings(): Promise<Settings> {
    return this.getItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  async updateSettings(settings: Partial<Settings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      await this.setItem(STORAGE_KEYS.SETTINGS, newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  async resetSettings(): Promise<void> {
    try {
      await this.setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  }

  // Utility Methods
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  async exportData(): Promise<string> {
    try {
      const progress = await this.getAllLessonProgress();
      const stats = await this.getUserStats();
      const settings = await this.getSettings();
      
      const exportData = {
        progress,
        stats,
        settings,
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.progress) {
        await this.setItem(STORAGE_KEYS.LESSON_PROGRESS, data.progress);
      }
      
      if (data.stats) {
        await this.setItem(STORAGE_KEYS.USER_STATS, data.stats);
      }
      
      if (data.settings) {
        await this.setItem(STORAGE_KEYS.SETTINGS, data.settings);
      }
      
      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const storage = new StorageService();

// Export types and constants
export { STORAGE_KEYS };