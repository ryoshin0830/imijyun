import type { Word, Lesson, BoxType, WordType } from '../types/lesson';
import { WORD_TYPE_TO_BOX_TYPE, BOX_ORDER } from '../constants/imijun';

/**
 * Check if a word can be placed in a specific box type
 */
export const canWordBePlacedInBox = (word: Word, boxType: BoxType): boolean => {
  return WORD_TYPE_TO_BOX_TYPE[word.type] === boxType;
};

/**
 * Validate if a sentence construction is correct according to the lesson
 */
export const validateSentence = (words: (Word | null)[], lesson: Lesson): boolean => {
  const sentence = words
    .filter(word => word !== null)
    .map(word => word!.text)
    .join(' ')
    .trim();
    
  return sentence === lesson.correctAnswer.trim();
};

/**
 * Calculate completion percentage for a lesson attempt
 */
export const calculateCompletionPercentage = (placedWords: (Word | null)[], totalWords: number): number => {
  const placedCount = placedWords.filter(word => word !== null).length;
  return Math.round((placedCount / totalWords) * 100);
};

/**
 * Generate hint for next word placement
 */
export const generatePlacementHint = (
  placedWords: (Word | null)[],
  availableWords: Word[]
): string | null => {
  // Find the first empty box
  const firstEmptyBoxIndex = placedWords.findIndex(word => word === null);
  if (firstEmptyBoxIndex === -1) return null;

  const targetBoxType = BOX_ORDER[firstEmptyBoxIndex];
  const correctWord = availableWords.find(word => 
    WORD_TYPE_TO_BOX_TYPE[word.type] === targetBoxType
  );

  if (!correctWord) return null;

  const boxNames = {
    subject: 'だれが',
    verb: 'する', 
    object: 'だれ・なに',
    place: 'どこ',
    time: 'いつ',
  };

  return `「${boxNames[targetBoxType]}」のボックスに「${correctWord.text}」を置いてみましょう`;
};

/**
 * Shuffle an array of words for randomized presentation
 */
export const shuffleWords = (words: Word[]): Word[] => {
  const shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Check if all required word types are present in a lesson
 */
export const validateLessonWords = (lesson: Lesson): boolean => {
  const requiredTypes = new Set<WordType>();
  const providedTypes = new Set(lesson.words.map(word => word.type));

  // At minimum, we need subject and verb
  requiredTypes.add('subject');
  requiredTypes.add('verb');

  // Check if all required types are provided
  for (const type of requiredTypes) {
    if (!providedTypes.has(type)) {
      return false;
    }
  }

  return true;
};

/**
 * Format time duration in seconds to human-readable format
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}秒`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    return remainingSeconds > 0 
      ? `${minutes}分${remainingSeconds}秒`
      : `${minutes}分`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return remainingMinutes > 0
    ? `${hours}時間${remainingMinutes}分`
    : `${hours}時間`;
};

/**
 * Calculate lesson difficulty score based on various factors
 */
export const calculateDifficultyScore = (lesson: Lesson): number => {
  let score = 0;
  
  // Base score by level
  const levelScores = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  };
  score += levelScores[lesson.level];
  
  // Add score for number of words
  score += Math.floor(lesson.words.length / 2);
  
  // Add score for sentence complexity (word count in answer)
  const wordCount = lesson.correctAnswer.split(' ').length;
  score += Math.floor(wordCount / 3);
  
  return Math.min(score, 10); // Cap at 10
};