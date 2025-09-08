import type { Lesson } from '@imijun/core';

// Additional lessons for mobile app
export const MOBILE_LESSONS: Lesson[] = [
  // Beginner Level - Additional
  {
    id: "lesson6",
    title: "基本動詞：好きなもの",
    level: "beginner",
    description: "好きなものについて話してみましょう",
    words: [
      { id: "23", text: "I", type: "subject" },
      { id: "24", text: "like", type: "verb" },
      { id: "25", text: "music", type: "object" },
    ],
    correctAnswer: "I like music",
    hint: "「私は」「好き」「音楽が」の順番です",
    explanation: "likeは「好き」を表す動詞です。英語では「私は音楽が好き」も「I like music」の順番になります。"
  },
  {
    id: "lesson7",
    title: "家族について",
    level: "beginner",
    description: "家族について紹介してみましょう",
    words: [
      { id: "26", text: "My sister", type: "subject" },
      { id: "27", text: "is", type: "verb" },
      { id: "28", text: "a teacher", type: "object" },
    ],
    correctAnswer: "My sister is a teacher",
    hint: "「私の妹は」「です」「先生」",
    explanation: "家族を紹介する時も意味順は同じです。「My sister」がひとつの主語になります。"
  },
  {
    id: "lesson8",
    title: "できること",
    level: "beginner",
    description: "できることを表現してみましょう",
    words: [
      { id: "29", text: "He", type: "subject" },
      { id: "30", text: "can swim", type: "verb" },
      { id: "31", text: "fast", type: "object" },
    ],
    correctAnswer: "He can swim fast",
    hint: "「彼は」「泳げる」「速く」",
    explanation: "canは「できる」を表す助動詞です。動詞と一緒に使います。"
  },
  
  // Intermediate Level - Additional
  {
    id: "lesson9",
    title: "現在進行形",
    level: "intermediate",
    description: "今していることを表現しましょう",
    words: [
      { id: "32", text: "She", type: "subject" },
      { id: "33", text: "is reading", type: "verb" },
      { id: "34", text: "a book", type: "object" },
      { id: "35", text: "in the library", type: "place" },
    ],
    correctAnswer: "She is reading a book in the library",
    hint: "「彼女は」「読んでいる」「本を」「図書館で」",
    explanation: "現在進行形（〜している）でも意味順は変わりません。"
  },
  {
    id: "lesson10",
    title: "予定を伝える",
    level: "intermediate",
    description: "予定について話してみましょう",
    words: [
      { id: "36", text: "We", type: "subject" },
      { id: "37", text: "are going to", type: "verb" },
      { id: "38", text: "the beach", type: "object" },
      { id: "39", text: "tomorrow", type: "time" },
    ],
    correctAnswer: "We are going to the beach tomorrow",
    hint: "「私たちは」「行く予定」「ビーチに」「明日」",
    explanation: "be going toは「〜する予定」を表します。未来の予定を話す時に使います。"
  },
  {
    id: "lesson11",
    title: "比較の文",
    level: "intermediate",
    description: "比較を使って表現してみましょう",
    words: [
      { id: "40", text: "This car", type: "subject" },
      { id: "41", text: "is", type: "verb" },
      { id: "42", text: "faster than", type: "object" },
      { id: "43", text: "that one", type: "object" },
    ],
    correctAnswer: "This car is faster than that one",
    hint: "「この車は」「です」「より速い」「あの車より」",
    explanation: "比較級を使った文も意味順に従います。thanは「〜より」を表します。"
  },
  {
    id: "lesson12",
    title: "経験を語る",
    level: "intermediate",
    description: "経験について話してみましょう",
    words: [
      { id: "44", text: "I", type: "subject" },
      { id: "45", text: "have visited", type: "verb" },
      { id: "46", text: "Paris", type: "object" },
      { id: "47", text: "three times", type: "time" },
    ],
    correctAnswer: "I have visited Paris three times",
    hint: "「私は」「訪れたことがある」「パリを」「3回」",
    explanation: "現在完了形（have + 過去分詞）で経験を表現できます。"
  },
  
  // Advanced Level - Additional
  {
    id: "lesson13",
    title: "受動態",
    level: "advanced",
    description: "受動態を使った文を作りましょう",
    words: [
      { id: "48", text: "This book", type: "subject" },
      { id: "49", text: "was written", type: "verb" },
      { id: "50", text: "by Shakespeare", type: "object" },
      { id: "51", text: "in 1600", type: "time" },
    ],
    correctAnswer: "This book was written by Shakespeare in 1600",
    hint: "「この本は」「書かれた」「シェイクスピアによって」「1600年に」",
    explanation: "受動態（〜される）の文も意味順は同じです。byは「〜によって」を表します。"
  },
  {
    id: "lesson14",
    title: "仮定法",
    level: "advanced",
    description: "もし〜なら、という文を作りましょう",
    words: [
      { id: "52", text: "If I", type: "subject" },
      { id: "53", text: "had", type: "verb" },
      { id: "54", text: "more time", type: "object" },
      { id: "55", text: "I would study", type: "subject" },
      { id: "56", text: "harder", type: "object" },
    ],
    correctAnswer: "If I had more time I would study harder",
    hint: "「もし私に」「あれば」「もっと時間が」「私は勉強するのに」「もっと一生懸命」",
    explanation: "仮定法は「もし〜なら」を表現します。If節とwould節の2つの意味順があります。"
  },
  {
    id: "lesson15",
    title: "関係代名詞",
    level: "advanced",
    description: "関係代名詞を使った複雑な文",
    words: [
      { id: "57", text: "The man", type: "subject" },
      { id: "58", text: "who lives", type: "verb" },
      { id: "59", text: "next door", type: "place" },
      { id: "60", text: "is", type: "verb" },
      { id: "61", text: "a doctor", type: "object" },
    ],
    correctAnswer: "The man who lives next door is a doctor",
    hint: "「その男性」「住んでいる」「隣に」「です」「医者」",
    explanation: "関係代名詞whoは「〜する人」を表します。2つの文が1つになっています。"
  },
  {
    id: "lesson16",
    title: "完了進行形",
    level: "advanced",
    description: "継続している動作を表現",
    words: [
      { id: "62", text: "They", type: "subject" },
      { id: "63", text: "have been working", type: "verb" },
      { id: "64", text: "on this project", type: "object" },
      { id: "65", text: "for two years", type: "time" },
    ],
    correctAnswer: "They have been working on this project for two years",
    hint: "「彼らは」「取り組んでいる」「このプロジェクトに」「2年間」",
    explanation: "現在完了進行形は「ずっと〜している」を表します。継続を強調する表現です。"
  }
];

// Combine all lessons for mobile
export const getAllMobileLessons = (): Lesson[] => {
  // Import lessons from core package and add mobile-specific lessons
  return [...MOBILE_LESSONS];
};

// Lesson categories for better organization
export const LESSON_CATEGORIES = {
  basics: {
    title: "基礎編",
    description: "意味順の基本を学ぶ",
    lessonIds: ["tutorial", "lesson1", "lesson6", "lesson7", "lesson8"],
  },
  daily: {
    title: "日常会話編",
    description: "日常生活で使える表現",
    lessonIds: ["lesson2", "lesson9", "lesson10"],
  },
  grammar: {
    title: "文法編",
    description: "様々な文法を意味順で理解",
    lessonIds: ["lesson3", "lesson4", "lesson11", "lesson12"],
  },
  advanced: {
    title: "応用編",
    description: "複雑な文も意味順で",
    lessonIds: ["lesson5", "lesson13", "lesson14", "lesson15", "lesson16"],
  },
} as const;

// Helper function to get lessons by category
export const getLessonsByCategory = (categoryKey: keyof typeof LESSON_CATEGORIES): string[] => {
  return [...LESSON_CATEGORIES[categoryKey].lessonIds];
};

// Get next lesson ID
export const getNextLessonId = (currentLessonId: string): string | null => {
  const allLessonIds = Object.values(LESSON_CATEGORIES)
    .flatMap(category => [...category.lessonIds]);
  
  const currentIndex = allLessonIds.indexOf(currentLessonId as any);
  if (currentIndex === -1 || currentIndex === allLessonIds.length - 1) {
    return null;
  }
  
  return allLessonIds[currentIndex + 1];
};

// Get previous lesson ID
export const getPreviousLessonId = (currentLessonId: string): string | null => {
  const allLessonIds = Object.values(LESSON_CATEGORIES)
    .flatMap(category => [...category.lessonIds]);
  
  const currentIndex = allLessonIds.indexOf(currentLessonId as any);
  if (currentIndex <= 0) {
    return null;
  }
  
  return allLessonIds[currentIndex - 1];
};