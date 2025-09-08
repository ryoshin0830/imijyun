import type { BoxType, WordType } from '../types/lesson';

/**
 * Imijun color palette based on the meaning order method
 * Each color corresponds to a specific element of sentence structure
 */
export const IMIJUN_COLORS = {
  subject: '#60A5FA',   // だれが (Who) - Blue
  verb: '#F472B6',      // する (Do) - Pink
  object: '#FBBF24',    // だれ・なに (What) - Yellow
  place: '#34D399',     // どこ (Where) - Green
  time: '#A78BFA',      // いつ (When) - Purple
} as const;

/**
 * Japanese labels for each box type in the Imijun method
 */
export const IMIJUN_LABELS = {
  subject: 'だれが',
  verb: 'する',
  object: 'だれ・なに',
  place: 'どこ',
  time: 'いつ',
} as const;

/**
 * English labels for each box type
 */
export const ENGLISH_LABELS = {
  subject: 'Who',
  verb: 'Do',
  object: 'What',
  place: 'Where',
  time: 'When',
} as const;

/**
 * Order of boxes in the Imijun method (left to right)
 */
export const BOX_ORDER: BoxType[] = ['subject', 'verb', 'object', 'place', 'time'];

/**
 * Mapping of word types to box types (they are the same in this implementation)
 */
export const WORD_TYPE_TO_BOX_TYPE: Record<WordType, BoxType> = {
  subject: 'subject',
  verb: 'verb',
  object: 'object',
  place: 'place',
  time: 'time',
};

/**
 * Scoring constants
 */
export const SCORING = {
  CORRECT_PLACEMENT: 10,
  PERFECT_LESSON: 50,
  STREAK_BONUS: 5,
  TIME_BONUS_THRESHOLD: 30, // seconds
  TIME_BONUS: 10,
} as const;

/**
 * Animation durations in milliseconds
 */
export const ANIMATION_DURATION = {
  DROP: 300,
  FEEDBACK: 2000,
  CONFETTI: 3000,
  TRANSITION: 200,
} as const;