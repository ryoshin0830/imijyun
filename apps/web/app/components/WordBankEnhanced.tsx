"use client";

import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Word } from "../data/lessons";

interface WordBankEnhancedProps {
  words: Word[];
  showHint?: boolean;
}

function DraggableWord({ word }: { word: Word }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: word.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 1000 : 1,
      }
    : undefined;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "subject": return "border-imijun-primary bg-imijun-primary/10";
      case "verb": return "border-imijun-action bg-imijun-action/10";
      case "object": return "border-imijun-object bg-imijun-object/10";
      case "place": return "border-imijun-place bg-imijun-place/10";
      case "time": return "border-imijun-time bg-imijun-time/10";
      default: return "border-gray-300 bg-gray-50";
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        px-4 py-3 rounded-lg cursor-move font-semibold text-gray-800
        border-2 transition-all
        ${getTypeColor(word.type)}
        ${isDragging ? "opacity-50 shadow-2xl" : "shadow-md hover:shadow-lg"}
      `}
    >
      {word.text}
    </motion.div>
  );
}

export default function WordBankEnhanced({ words, showHint = false }: WordBankEnhancedProps) {
  if (words.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-100 rounded-xl p-8 text-center"
      >
        <p className="text-gray-500 text-lg">
          すべての単語を配置しました！
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">単語バンク</h3>
        <span className="text-sm text-gray-600">
          残り {words.length} 個
        </span>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {words.map((word, index) => (
          <motion.div
            key={word.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <DraggableWord word={word} />
          </motion.div>
        ))}
      </div>
      
      {showHint && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
        >
          <p className="text-sm text-blue-700">
            💡 ヒント: 色が同じボックスに単語を配置してみましょう
          </p>
        </motion.div>
      )}
    </div>
  );
}