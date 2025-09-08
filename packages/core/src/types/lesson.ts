/**
 * Word types based on the Imijun (Meaning Order) method
 * Maps to Japanese meanings: だれが(subject), する(verb), だれ・なに(object), どこ(place), いつ(time)
 */
export type WordType = "subject" | "verb" | "object" | "place" | "time";

/**
 * Represents a single word unit in the lesson
 */
export interface Word {
  id: string;
  text: string;
  type: WordType;
}

/**
 * Difficulty levels for lessons
 */
export type LessonLevel = "beginner" | "intermediate" | "advanced";

/**
 * Complete lesson structure following the Imijun methodology
 */
export interface Lesson {
  id: string;
  title: string;
  level: LessonLevel;
  description: string;
  words: Word[];
  correctAnswer: string;
  hint?: string;
  explanation?: string;
}

/**
 * Box types corresponding to the Imijun meaning order method
 * Each box represents one of the 5 fundamental sentence elements
 */
export type BoxType = "subject" | "verb" | "object" | "place" | "time";

/**
 * State of a droppable box in the interface
 */
export interface BoxState {
  type: BoxType;
  word: Word | null;
  isHighlighted: boolean;
}

/**
 * User's progress for a specific lesson
 */
export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  attempts: number;
  score: number;
  timeSpent: number; // in seconds
  lastAttemptAt: Date;
}

/**
 * Overall user progress and statistics
 */
export interface UserProgress {
  currentLessonId: string | null;
  totalScore: number;
  streak: number;
  lessonsCompleted: number;
  lessonsProgress: Record<string, LessonProgress>;
  lastActiveAt: Date;
}