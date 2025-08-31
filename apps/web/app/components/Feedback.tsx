"use client";

import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

interface FeedbackProps {
  isCorrect: boolean | null;
  message?: string;
  explanation?: string;
  onNext?: () => void;
  onRetry?: () => void;
}

export default function Feedback({
  isCorrect,
  message,
  explanation,
  onNext,
  onRetry,
}: FeedbackProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isCorrect === true) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isCorrect]);

  if (isCorrect === null) return null;

  return (
    <AnimatePresence>
      {isCorrect !== null && (
        <>
          {showConfetti && isCorrect && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={200}
              gravity={0.1}
            />
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
              mt-6 p-6 rounded-xl shadow-lg
              ${isCorrect ? "bg-green-50 border-2 border-green-300" : "bg-red-50 border-2 border-red-300"}
            `}
          >
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-3xl"
              >
                {isCorrect ? "🎉" : "💪"}
              </motion.div>
              
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-2 ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                  {isCorrect ? "素晴らしい！正解です！" : "もう少し！"}
                </h3>
                
                {message && (
                  <p className={`mb-3 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                    {message}
                  </p>
                )}
                
                {explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 0.3 }}
                    className="p-4 bg-white rounded-lg mb-4"
                  >
                    <p className="text-gray-700">
                      <span className="font-bold">ポイント：</span>
                      {explanation}
                    </p>
                  </motion.div>
                )}
                
                <div className="flex gap-3 mt-4">
                  {isCorrect && onNext && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onNext}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
                    >
                      次のレッスンへ
                    </motion.button>
                  )}
                  
                  {!isCorrect && onRetry && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onRetry}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold"
                    >
                      もう一度チャレンジ
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}