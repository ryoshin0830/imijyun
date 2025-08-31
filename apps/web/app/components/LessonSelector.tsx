"use client";

import { motion } from "framer-motion";
import { Lesson } from "../data/lessons";

interface LessonSelectorProps {
  lessons: Lesson[];
  currentLessonIndex: number;
  completedLessons: Set<string>;
  onSelectLesson: (index: number) => void;
}

export default function LessonSelector({
  lessons,
  currentLessonIndex,
  completedLessons,
  onSelectLesson,
}: LessonSelectorProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "beginner":
        return "初級";
      case "intermediate":
        return "中級";
      case "advanced":
        return "上級";
      default:
        return level;
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4">レッスン選択</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.has(lesson.id);
          const isCurrent = index === currentLessonIndex;
          const isLocked = index > 0 && !completedLessons.has(lessons[index - 1].id) && !isCompleted;

          return (
            <motion.button
              key={lesson.id}
              whileHover={{ scale: isLocked ? 1 : 1.05 }}
              whileTap={{ scale: isLocked ? 1 : 0.95 }}
              onClick={() => !isLocked && onSelectLesson(index)}
              disabled={isLocked}
              className={`
                min-w-[200px] p-4 rounded-xl border-2 transition-all
                ${isCurrent ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}
                ${isCompleted ? "bg-green-50" : ""}
                ${isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-md"}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(lesson.level)}`}>
                  {getLevelLabel(lesson.level)}
                </span>
                {isCompleted && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-500 text-xl"
                  >
                    ✓
                  </motion.span>
                )}
                {isLocked && (
                  <span className="text-gray-400 text-xl">🔒</span>
                )}
              </div>
              <h4 className="font-bold text-gray-800 text-sm text-left mb-1">
                {lesson.title}
              </h4>
              <p className="text-xs text-gray-600 text-left">
                {lesson.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}