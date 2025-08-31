"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  score: number;
  streak: number;
}

export default function ProgressBar({ current, total, score, streak }: ProgressBarProps) {
  const progress = ((current) / total) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">進捗</p>
          <p className="text-2xl font-bold text-blue-600">
            {current}/{total}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">スコア</p>
          <motion.p
            key={score}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-green-600"
          >
            {score}
          </motion.p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">連続正解</p>
          <motion.p
            key={streak}
            initial={{ scale: streak > 0 ? 1.2 : 1 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-orange-600"
          >
            {streak} 🔥
          </motion.p>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      <div className="mt-2 text-center">
        <p className="text-sm text-gray-600">
          達成率: <span className="font-bold text-blue-600">{Math.round(progress)}%</span>
        </p>
      </div>
    </div>
  );
}