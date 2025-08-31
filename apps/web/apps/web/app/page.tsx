"use client";

import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy,
  arrayMove 
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import ImijunBox from "./components/ImijunBox";
import WordBank from "./components/WordBank";
import HintSystem from "./components/HintSystem";
import { useSessionStore } from "./stores/sessionStore";
import { useUserStore } from "./stores/userStore";
import { sentenceAnalyzer } from "./lib/sentenceAnalyzer";

const INITIAL_PROBLEM = {
  id: "1",
  japanese: "私は毎日学校で英語を勉強します。",
  words: [
    { id: "1", text: "I", type: "subject" as const },
    { id: "2", text: "study", type: "verb" as const },
    { id: "3", text: "English", type: "object" as const },
    { id: "4", text: "at school", type: "place" as const },
    { id: "5", text: "every day", type: "time" as const },
  ],
  targetPattern: "SVO"
};

const BOXES = [
  { id: "who", label: "だれが", color: "bg-imijun-primary", accepts: ["subject"] },
  { id: "do", label: "する（です）", color: "bg-imijun-action", accepts: ["verb"] },
  { id: "what", label: "だれ・なに", color: "bg-imijun-object", accepts: ["object", "complement"] },
  { id: "where", label: "どこ", color: "bg-imijun-place", accepts: ["place"] },
  { id: "when", label: "いつ", color: "bg-imijun-time", accepts: ["time"] },
];

export default function HomePage() {
  const { 
    currentProblem,
    userAnswer,
    availableWords,
    validationStatus,
    setCurrentProblem,
    placeWord,
    resetAnswer,
    setValidationStatus
  } = useSessionStore();

  const {
    progress,
    settings,
    addXP,
    checkAndUpdateStreak
  } = useUserStore();

  const [feedback, setFeedback] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setCurrentProblem(INITIAL_PROBLEM);
    checkAndUpdateStreak();
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const draggedWord = availableWords.find(w => w.id === active.id);
    if (!draggedWord) return;

    if (BOXES.find(box => box.id === over.id)) {
      placeWord(over.id, draggedWord);
    }
  };

  const handleCheck = () => {
    const result = sentenceAnalyzer.analyzeSentence(userAnswer);
    setFeedback(result.feedback);
    setValidationStatus(result.isCorrect ? 'correct' : 'incorrect');
    
    if (result.isCorrect) {
      setShowSuccess(true);
      addXP(10);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleReset = () => {
    resetAnswer();
    setFeedback("");
    setShowSuccess(false);
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header with Progress */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            意味順英語学習
          </h1>
          <p className="text-gray-600 mb-4">
            単語をドラッグして、正しい順番に並べてみましょう
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Level {progress.currentLevel}</span>
              <span>{progress.xp % 100}/100 XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress.xp % 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {progress.streak > 0 && (
              <div className="mt-2 text-orange-500 font-semibold">
                🔥 {progress.streak} day streak!
              </div>
            )}
          </div>
        </header>

        {/* Problem Statement */}
        {currentProblem && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
            <div className="text-lg font-medium text-gray-700 mb-2">
              日本語：
            </div>
            <div className="text-xl text-gray-900">
              {currentProblem.japanese}
            </div>
          </div>
        )}

        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          {/* Imijun Boxes */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {BOXES.map((box) => (
              <ImijunBox
                key={box.id}
                id={box.id}
                label={box.label}
                color={box.color}
                content={userAnswer[box.id as keyof typeof userAnswer]}
              />
            ))}
          </div>

          {/* Word Bank */}
          <WordBank words={availableWords} />
        </DndContext>

        {/* Hint System */}
        <HintSystem />

        {/* Feedback Section */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-6 p-4 rounded-lg ${
                validationStatus === 'correct' 
                  ? 'bg-green-50 border-2 border-green-300' 
                  : validationStatus === 'incorrect'
                  ? 'bg-red-50 border-2 border-red-300'
                  : 'bg-gray-50 border-2 border-gray-300'
              }`}
            >
              <p className={`text-lg font-medium ${
                validationStatus === 'correct' 
                  ? 'text-green-800' 
                  : validationStatus === 'incorrect'
                  ? 'text-red-800'
                  : 'text-gray-800'
              }`}>
                {feedback}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <div className="bg-white rounded-full p-8 shadow-2xl">
                <div className="text-6xl mb-2">🎉</div>
                <div className="text-xl font-bold text-green-600">Perfect!</div>
                <div className="text-sm text-gray-600">+10 XP</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handleCheck}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Check Answer
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </main>
  );
}