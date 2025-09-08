import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lesson, BoxState, BoxType, Word } from '../types/lesson';
import { BOX_ORDER } from '../constants/imijun';

/**
 * Current lesson state interface
 */
export interface LessonState {
  // Current lesson data
  currentLesson: Lesson | null;
  boxes: BoxState[];
  availableWords: Word[];
  
  // Lesson status
  isCompleted: boolean;
  attempts: number;
  startTime: number | null;
  
  // Actions
  setCurrentLesson: (lesson: Lesson) => void;
  dropWordIntoBox: (word: Word, boxType: BoxType) => void;
  removeWordFromBox: (boxType: BoxType) => void;
  resetLesson: () => void;
  completeLesson: () => void;
  incrementAttempts: () => void;
  
  // Helpers
  getBoxByType: (type: BoxType) => BoxState | undefined;
  getCompletedSentence: () => string;
  isLessonComplete: () => boolean;
}

/**
 * Initialize box states for a lesson
 */
const initializeBoxes = (): BoxState[] => {
  return BOX_ORDER.map(type => ({
    type,
    word: null,
    isHighlighted: false,
  }));
};

/**
 * Zustand store for managing current lesson state
 */
export const useLessonStore = create<LessonState>((set, get) => ({
  // Initial state
  currentLesson: null,
  boxes: initializeBoxes(),
  availableWords: [],
  isCompleted: false,
  attempts: 0,
  startTime: null,

  // Actions
  setCurrentLesson: (lesson: Lesson) => {
    set({
      currentLesson: lesson,
      boxes: initializeBoxes(),
      availableWords: [...lesson.words],
      isCompleted: false,
      attempts: 0,
      startTime: Date.now(),
    });
  },

  dropWordIntoBox: (word: Word, boxType: BoxType) => {
    const state = get();
    const boxes = [...state.boxes];
    const availableWords = [...state.availableWords];

    // Find the target box
    const boxIndex = boxes.findIndex(box => box.type === boxType);
    if (boxIndex === -1) return;

    // If box already has a word, return it to available words
    if (boxes[boxIndex].word) {
      availableWords.push(boxes[boxIndex].word!);
    }

    // Place the new word in the box
    boxes[boxIndex] = {
      ...boxes[boxIndex],
      word,
      isHighlighted: false,
    };

    // Remove word from available words
    const wordIndex = availableWords.findIndex(w => w.id === word.id);
    if (wordIndex !== -1) {
      availableWords.splice(wordIndex, 1);
    }

    set({ boxes, availableWords });
  },

  removeWordFromBox: (boxType: BoxType) => {
    const state = get();
    const boxes = [...state.boxes];
    const availableWords = [...state.availableWords];

    const boxIndex = boxes.findIndex(box => box.type === boxType);
    if (boxIndex === -1 || !boxes[boxIndex].word) return;

    // Return word to available words
    availableWords.push(boxes[boxIndex].word!);
    
    // Clear the box
    boxes[boxIndex] = {
      ...boxes[boxIndex],
      word: null,
    };

    set({ boxes, availableWords });
  },

  resetLesson: () => {
    const state = get();
    if (!state.currentLesson) return;

    set({
      boxes: initializeBoxes(),
      availableWords: [...state.currentLesson.words],
      isCompleted: false,
      startTime: Date.now(),
    });
  },

  completeLesson: () => {
    set({ isCompleted: true });
  },

  incrementAttempts: () => {
    set(state => ({ attempts: state.attempts + 1 }));
  },

  // Helpers
  getBoxByType: (type: BoxType) => {
    return get().boxes.find(box => box.type === type);
  },

  getCompletedSentence: () => {
    const boxes = get().boxes;
    return boxes
      .filter(box => box.word !== null)
      .map(box => box.word!.text)
      .join(' ');
  },

  isLessonComplete: () => {
    const state = get();
    const completedSentence = state.getCompletedSentence().trim();
    return completedSentence === state.currentLesson?.correctAnswer?.trim();
  },
}));