"use client";

import { useDraggable } from "@dnd-kit/core";

interface Word {
  id: string;
  text: string;
  type: string;
}

interface WordBankProps {
  words: Word[];
}

function DraggableWord({ word }: { word: Word }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: word.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        px-4 py-2 bg-white border-2 border-gray-300 rounded-lg
        cursor-move hover:border-blue-400 hover:shadow-md
        transition-all duration-200
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      <span className="font-medium text-gray-800">{word.text}</span>
    </div>
  );
}

export default function WordBank({ words }: WordBankProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-6 shadow-inner">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        単語バンク
      </h2>
      <div className="flex flex-wrap gap-3">
        {words.map((word) => (
          <DraggableWord key={word.id} word={word} />
        ))}
      </div>
      {words.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          すべての単語が配置されました！
        </p>
      )}
    </div>
  );
}