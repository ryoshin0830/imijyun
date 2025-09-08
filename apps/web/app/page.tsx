"use client";

import { useState, useEffect } from "react";
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  closestCorners,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import Tutorial from "./components/Tutorial";
import LessonSelector from "./components/LessonSelector";
import ImijunBoxEnhanced from "./components/ImijunBoxEnhanced";
import WordBankEnhanced from "./components/WordBankEnhanced";
import Feedback from "./components/Feedback";
import ProgressBar from "./components/ProgressBar";
import { getAllLessons, Lesson, Word } from "./data/lessons";

const BOXES = [
  { id: "who", label: "だれが", color: "bg-imijun-primary", accepts: ["subject"] },
  { id: "do", label: "する（です）", color: "bg-imijun-action", accepts: ["verb"] },
  { id: "what", label: "だれ・なに", color: "bg-imijun-object", accepts: ["object"] },
  { id: "where", label: "どこ", color: "bg-imijun-place", accepts: ["place"] },
  { id: "when", label: "いつ", color: "bg-imijun-time", accepts: ["time"] },
];

export default function HomePage() {
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [boxContents, setBoxContents] = useState<Record<string, Word | null>>({
    who: null,
    do: null,
    what: null,
    where: null,
    when: null,
  });
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean | null;
    message?: string;
  }>({ isCorrect: null });
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const lessons = getAllLessons();
  const currentLesson = lessons[currentLessonIndex];

  useEffect(() => {
    if (currentLesson) {
      resetLesson();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLessonIndex]);

  const resetLesson = () => {
    setAvailableWords([...currentLesson.words]);
    setBoxContents({
      who: null,
      do: null,
      what: null,
      where: null,
      when: null,
    });
    setFeedback({ isCorrect: null });
    setShowHint(false);
    setAttempts(0);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const draggedWord = availableWords.find(w => w.id === active.id);
    if (!draggedWord) return;

    const targetBox = BOXES.find(box => box.id === over.id);
    if (targetBox) {
      // 既存の単語を戻す
      if (boxContents[over.id]) {
        setAvailableWords(prev => [...prev, boxContents[over.id]!]);
      }
      
      setBoxContents(prev => ({
        ...prev,
        [over.id]: draggedWord,
      }));
      setAvailableWords(prev => prev.filter(w => w.id !== active.id));
      
      // 間違った配置の場合は視覚的フィードバック（振動効果）
      if (!targetBox.accepts.includes(draggedWord.type)) {
        const element = document.getElementById(`box-${over.id}`);
        if (element) {
          element.classList.add('shake-animation');
          setTimeout(() => {
            element.classList.remove('shake-animation');
          }, 500);
        }
      }
    }
    
    setActiveId(null);
  };

  const checkAnswer = () => {
    const userAnswer = BOXES
      .map(box => boxContents[box.id]?.text || "")
      .filter(text => text !== "")
      .join(" ");

    const isCorrect = userAnswer === currentLesson.correctAnswer;
    
    if (isCorrect) {
      setFeedback({
        isCorrect: true,
        message: "完璧です！正しい語順で文が作れました。",
      });
      setScore(prev => prev + (attempts === 0 ? 100 : 50));
      setStreak(prev => prev + 1);
      setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
    } else {
      setFeedback({
        isCorrect: false,
        message: attempts === 0 ? "もう一度チャレンジしてみましょう！" : "ヒントを参考にしてみてください。",
      });
      setStreak(0);
      setAttempts(prev => prev + 1);
      if (attempts >= 1) {
        setShowHint(true);
      }
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    }
  };

  const handleRetry = () => {
    resetLesson();
  };

  const handleSelectLesson = (index: number) => {
    setCurrentLessonIndex(index);
  };

  const isAnswerComplete = () => {
    return currentLesson.words.every(word => 
      Object.values(boxContents).some(content => content?.id === word.id)
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AnimatePresence>
        {showTutorial && (
          <Tutorial onComplete={() => setShowTutorial(false)} />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            意味順英語学習アプリ
          </h1>
          <p className="text-gray-600">
            文法用語を使わずに、英語の語順を自然に身につけよう
          </p>
        </motion.header>

        <ProgressBar
          current={completedLessons.size}
          total={lessons.length}
          score={score}
          streak={streak}
        />

        <LessonSelector
          lessons={lessons}
          currentLessonIndex={currentLessonIndex}
          completedLessons={completedLessons}
          onSelectLesson={handleSelectLesson}
        />

        <motion.div
          key={currentLesson.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentLesson.title}
            </h2>
            <p className="text-gray-600">{currentLesson.description}</p>
            {showHint && currentLesson.hint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <p className="text-yellow-800">
                  💡 ヒント: {currentLesson.hint}
                </p>
              </motion.div>
            )}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {BOXES.map((box) => {
                const hasContent = currentLesson.words.some(w => w.type === box.accepts[0]);
                if (!hasContent) return null;
                
                return (
                  <ImijunBoxEnhanced
                    key={box.id}
                    id={box.id}
                    label={box.label}
                    color={box.color}
                    content={boxContents[box.id]}
                    isHighlighted={showHint && !boxContents[box.id]}
                    isCorrect={
                      feedback.isCorrect !== null && boxContents[box.id]
                        ? boxContents[box.id]?.type === box.accepts[0]
                        : undefined
                    }
                    isWrongType={
                      boxContents[box.id] ? !box.accepts.includes(boxContents[box.id]?.type || "") : false
                    }
                  />
                );
              })}
            </div>

            <WordBankEnhanced words={availableWords} showHint={showHint} />
            
            <DragOverlay>
              {activeId ? (
                <motion.div
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1.15 }}
                  className="px-4 py-3 rounded-lg font-semibold text-gray-800 bg-white border-2 border-blue-400 shadow-2xl cursor-grabbing"
                >
                  {availableWords.find(w => w.id === activeId)?.text}
                </motion.div>
              ) : null}
            </DragOverlay>
          </DndContext>

          <div className="mt-6 flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetLesson}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-bold"
            >
              リセット
            </motion.button>
            
            {isAnswerComplete() && feedback.isCorrect === null && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={checkAnswer}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
              >
                答え合わせ
              </motion.button>
            )}
          </div>

          <Feedback
            isCorrect={feedback.isCorrect}
            message={feedback.message}
            explanation={feedback.isCorrect ? currentLesson.explanation : undefined}
            onNext={handleNext}
            onRetry={handleRetry}
          />
        </motion.div>

        {completedLessons.size === lessons.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8 p-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl text-white"
          >
            <h2 className="text-3xl font-bold mb-4">🎊 全レッスン完了！</h2>
            <p className="text-xl mb-2">素晴らしい成果です！</p>
            <p className="text-lg">最終スコア: {score}点</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}