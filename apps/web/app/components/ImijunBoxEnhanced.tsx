"use client";

import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";

interface ImijunBoxEnhancedProps {
  id: string;
  label: string;
  color: string;
  content: any;
  isHighlighted?: boolean;
  isCorrect?: boolean;
  isWrongType?: boolean;
}

export default function ImijunBoxEnhanced({
  id,
  label,
  color,
  content,
  isHighlighted = false,
  isCorrect,
  isWrongType = false,
}: ImijunBoxEnhancedProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <motion.div
      id={`box-${id}`}
      ref={setNodeRef}
      animate={{
        scale: isHighlighted ? 1.05 : 1,
        boxShadow: isHighlighted ? "0 0 20px rgba(59, 130, 246, 0.5)" : "none",
      }}
      transition={{ duration: 0.3 }}
      className={`
        relative rounded-xl shadow-lg transition-all duration-300
        ${color} ${isOver ? "ring-4 ring-blue-400 scale-105" : ""}
        ${isCorrect === true ? "ring-4 ring-green-400" : ""}
        ${isCorrect === false ? "ring-4 ring-red-400" : ""}
        ${isWrongType ? "ring-4 ring-orange-400" : ""}
      `}
    >
      <div className="p-2 text-center">
        <div className="text-white text-sm font-bold mb-1">{label}</div>
        <div className="min-h-[80px] bg-white bg-opacity-90 rounded-lg p-3 flex items-center justify-center">
          {content ? (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-gray-800 font-semibold text-lg"
            >
              {content.text}
            </motion.div>
          ) : (
            <div className="text-gray-400 text-sm">
              ここにドロップ
            </div>
          )}
        </div>
      </div>
      
      {isHighlighted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-2 -right-2"
        >
          <div className="bg-yellow-400 text-yellow-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold animate-pulse">
            !
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}