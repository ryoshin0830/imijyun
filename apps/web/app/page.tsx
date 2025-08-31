"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy,
  arrayMove 
} from "@dnd-kit/sortable";
import ImijunBox from "./components/ImijunBox";
import WordBank from "./components/WordBank";

const INITIAL_WORDS = [
  { id: "1", text: "I", type: "subject" },
  { id: "2", text: "study", type: "verb" },
  { id: "3", text: "English", type: "object" },
  { id: "4", text: "at school", type: "place" },
  { id: "5", text: "every day", type: "time" },
];

const BOXES = [
  { id: "who", label: "だれが", color: "bg-imijun-primary", accepts: ["subject"] },
  { id: "do", label: "する（です）", color: "bg-imijun-action", accepts: ["verb"] },
  { id: "what", label: "だれ・なに", color: "bg-imijun-object", accepts: ["object"] },
  { id: "where", label: "どこ", color: "bg-imijun-place", accepts: ["place"] },
  { id: "when", label: "いつ", color: "bg-imijun-time", accepts: ["time"] },
];

export default function HomePage() {
  const [availableWords, setAvailableWords] = useState(INITIAL_WORDS);
  const [boxContents, setBoxContents] = useState<Record<string, any>>({
    who: null,
    do: null,
    what: null,
    where: null,
    when: null,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const draggedWord = availableWords.find(w => w.id === active.id);
    if (!draggedWord) return;

    if (BOXES.find(box => box.id === over.id)) {
      setBoxContents(prev => ({
        ...prev,
        [over.id]: draggedWord,
      }));
      setAvailableWords(prev => prev.filter(w => w.id !== active.id));
    }
  };

  const handleReset = () => {
    setAvailableWords(INITIAL_WORDS);
    setBoxContents({
      who: null,
      do: null,
      what: null,
      where: null,
      when: null,
    });
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            意味順英語学習
          </h1>
          <p className="text-gray-600">
            単語をドラッグして、正しい順番に並べてみましょう
          </p>
        </header>

        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-5 gap-4 mb-12">
            {BOXES.map((box) => (
              <ImijunBox
                key={box.id}
                id={box.id}
                label={box.label}
                color={box.color}
                content={boxContents[box.id]}
              />
            ))}
          </div>

          <WordBank words={availableWords} />
        </DndContext>

        <div className="mt-8 text-center">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            リセット
          </button>
        </div>
      </div>
    </main>
  );
}