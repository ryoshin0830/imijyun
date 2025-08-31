"use client";

import { useSessionStore } from '../stores/sessionStore';

const HINTS = {
  0: {
    general: "Try to think about the meaning order: Who does what, where, and when.",
    specific: {
      who: "Start with 'who' is doing the action.",
      do: "Add the action word (verb) here.",
      what: "What or whom is affected by the action?",
      where: "Where does this happen?",
      when: "When does this happen?"
    }
  },
  1: {
    general: "Remember: English sentences usually start with the subject.",
    specific: {
      who: "This box needs a subject (like 'I', 'You', 'He', 'She').",
      do: "This box needs a verb (an action word or 'be' verb).",
      what: "This box needs an object or complement.",
      where: "This box needs a place phrase.",
      when: "This box needs a time expression."
    }
  },
  2: {
    general: "Let me give you more specific help.",
    specific: {
      who: "Put the subject word here (the one doing the action).",
      do: "Put the verb here (the action or state).",
      what: "Put the object or complement here.",
      where: "Put the location phrase here.",
      when: "Put the time phrase here."
    }
  },
  3: {
    general: "Here's the answer:",
    specific: {
      who: "The correct word for this box is: ",
      do: "The correct word for this box is: ",
      what: "The correct word for this box is: ",
      where: "The correct word for this box is: ",
      when: "The correct word for this box is: "
    }
  }
};

interface HintSystemProps {
  targetBox?: 'who' | 'do' | 'what' | 'where' | 'when';
}

export default function HintSystem({ targetBox }: HintSystemProps) {
  const { hintLevel, showHint, incrementHintLevel, toggleHint } = useSessionStore();

  if (!showHint) {
    return (
      <div className="flex justify-center mt-4">
        <button
          onClick={() => {
            toggleHint();
            if (hintLevel === 0) incrementHintLevel();
          }}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          💡 Need a hint?
        </button>
      </div>
    );
  }

  const currentHint = HINTS[hintLevel as keyof typeof HINTS];
  const hintText = targetBox 
    ? currentHint.specific[targetBox]
    : currentHint.general;

  return (
    <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-600 text-xl">💡</span>
            <span className="font-semibold text-yellow-800">
              Hint Level {hintLevel}/3
            </span>
          </div>
          <p className="text-gray-700">{hintText}</p>
        </div>
        <button
          onClick={toggleHint}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      
      {hintLevel < 3 && (
        <button
          onClick={incrementHintLevel}
          className="mt-3 px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
        >
          Need more help
        </button>
      )}
    </div>
  );
}