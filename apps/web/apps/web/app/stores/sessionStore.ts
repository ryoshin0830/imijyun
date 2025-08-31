import { create } from 'zustand';
import { Word } from '../lib/sentenceAnalyzer';

export type HintLevel = 0 | 1 | 2 | 3;
export type ValidationStatus = 'unvalidated' | 'correct' | 'incorrect';

interface SessionState {
  // Current problem data
  currentProblem: {
    id: string;
    japanese: string;
    words: Word[];
    targetPattern: string;
  } | null;
  
  // User's current answer
  userAnswer: {
    who: Word | null;
    do: Word | null;
    what: Word | null;
    where: Word | null;
    when: Word | null;
  };
  
  // Available words in word bank
  availableWords: Word[];
  
  // Validation status
  validationStatus: ValidationStatus;
  
  // Hint system
  hintLevel: HintLevel;
  showHint: boolean;
  
  // Actions
  setCurrentProblem: (problem: SessionState['currentProblem']) => void;
  placeWord: (boxId: string, word: Word) => void;
  removeWord: (boxId: string) => void;
  resetAnswer: () => void;
  incrementHintLevel: () => void;
  toggleHint: () => void;
  setValidationStatus: (status: ValidationStatus) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  currentProblem: null,
  userAnswer: {
    who: null,
    do: null,
    what: null,
    where: null,
    when: null,
  },
  availableWords: [],
  validationStatus: 'unvalidated',
  hintLevel: 0,
  showHint: false,

  setCurrentProblem: (problem) => {
    set({
      currentProblem: problem,
      availableWords: problem ? [...problem.words] : [],
      userAnswer: {
        who: null,
        do: null,
        what: null,
        where: null,
        when: null,
      },
      validationStatus: 'unvalidated',
      hintLevel: 0,
      showHint: false,
    });
  },

  placeWord: (boxId, word) => {
    const state = get();
    const newAnswer = { ...state.userAnswer };
    const newAvailable = state.availableWords.filter(w => w.id !== word.id);
    
    // Remove word from previous position if it exists
    Object.keys(newAnswer).forEach(key => {
      if (newAnswer[key as keyof typeof newAnswer]?.id === word.id) {
        newAnswer[key as keyof typeof newAnswer] = null;
      }
    });
    
    // Place word in new position
    newAnswer[boxId as keyof typeof newAnswer] = word;
    
    set({
      userAnswer: newAnswer,
      availableWords: newAvailable,
      validationStatus: 'unvalidated',
    });
  },

  removeWord: (boxId) => {
    const state = get();
    const word = state.userAnswer[boxId as keyof typeof state.userAnswer];
    
    if (word) {
      const newAnswer = { ...state.userAnswer };
      newAnswer[boxId as keyof typeof newAnswer] = null;
      
      set({
        userAnswer: newAnswer,
        availableWords: [...state.availableWords, word],
        validationStatus: 'unvalidated',
      });
    }
  },

  resetAnswer: () => {
    const state = get();
    if (state.currentProblem) {
      set({
        availableWords: [...state.currentProblem.words],
        userAnswer: {
          who: null,
          do: null,
          what: null,
          where: null,
          when: null,
        },
        validationStatus: 'unvalidated',
        hintLevel: 0,
        showHint: false,
      });
    }
  },

  incrementHintLevel: () => {
    set((state) => ({
      hintLevel: Math.min(3, state.hintLevel + 1) as HintLevel,
      showHint: true,
    }));
  },

  toggleHint: () => {
    set((state) => ({
      showHint: !state.showHint,
    }));
  },

  setValidationStatus: (status) => {
    set({ validationStatus: status });
  },
}));