"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface TutorialProps {
  onComplete: () => void;
}

const tutorialSteps = [
  {
    title: "意味順メソッドへようこそ！",
    content: "英語を「意味の順番」で理解する革新的な学習法です",
    highlight: null,
  },
  {
    title: "5つのボックス",
    content: "英文を5つの意味のまとまりに分けて考えます",
    highlight: "boxes",
  },
  {
    title: "だれが（主語）",
    content: "文の主役を表します（I, He, She など）",
    highlight: "who",
  },
  {
    title: "する（動詞）",
    content: "動作や状態を表します（eat, play, is など）",
    highlight: "do",
  },
  {
    title: "だれ・なに（目的語）",
    content: "動作の対象を表します（apple, soccer など）",
    highlight: "what",
  },
  {
    title: "どこ（場所）",
    content: "場所を表します（at school, in the park など）",
    highlight: "where",
  },
  {
    title: "いつ（時間）",
    content: "時間を表します（every day, yesterday など）",
    highlight: "when",
  },
];

export default function Tutorial({ onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{step.title}</h2>
            <span className="text-sm text-gray-500">
              {currentStep + 1} / {tutorialSteps.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <p className="text-lg text-gray-700 mb-8">{step.content}</p>

        {step.highlight === "boxes" && (
          <div className="grid grid-cols-5 gap-2 mb-8">
            {["だれが", "する", "だれ・なに", "どこ", "いつ"].map((label, index) => (
              <motion.div
                key={label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  p-3 rounded-lg text-center text-white font-bold
                  ${index === 0 ? "bg-imijun-primary" : ""}
                  ${index === 1 ? "bg-imijun-action" : ""}
                  ${index === 2 ? "bg-imijun-object" : ""}
                  ${index === 3 ? "bg-imijun-place" : ""}
                  ${index === 4 ? "bg-imijun-time" : ""}
                `}
              >
                {label}
              </motion.div>
            ))}
          </div>
        )}

        {step.highlight && step.highlight !== "boxes" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`
              p-6 rounded-lg text-center text-white font-bold text-xl mb-8
              ${step.highlight === "who" ? "bg-imijun-primary" : ""}
              ${step.highlight === "do" ? "bg-imijun-action" : ""}
              ${step.highlight === "what" ? "bg-imijun-object" : ""}
              ${step.highlight === "where" ? "bg-imijun-place" : ""}
              ${step.highlight === "when" ? "bg-imijun-time" : ""}
            `}
          >
            {step.title.split("（")[0]}
          </motion.div>
        )}

        <div className="flex justify-between">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            スキップ
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
          >
            {currentStep < tutorialSteps.length - 1 ? "次へ" : "学習を始める"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}