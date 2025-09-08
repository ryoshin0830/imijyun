import type { Lesson } from '../types/lesson';

export const TUTORIAL_LESSON: Lesson = {
  id: "tutorial",
  title: "チュートリアル：意味順を学ぼう",
  level: "beginner",
  description: "意味順メソッドの基本を学びます",
  words: [
    { id: "t1", text: "I", type: "subject" },
    { id: "t2", text: "eat", type: "verb" },
    { id: "t3", text: "apples", type: "object" },
  ],
  correctAnswer: "I eat apples",
  hint: "「私は」「食べる」「りんごを」の順番で並べてみましょう",
  explanation: "英語は「だれが→する→なにを」の順番で文を作ります。これが意味順の基本です！"
};

export const DEMO_LESSONS: Lesson[] = [
  {
    id: "lesson1",
    title: "基本文：自己紹介",
    level: "beginner",
    description: "自己紹介の基本文を作ってみましょう",
    words: [
      { id: "1", text: "I", type: "subject" },
      { id: "2", text: "am", type: "verb" },
      { id: "3", text: "a student", type: "object" },
    ],
    correctAnswer: "I am a student",
    hint: "「私は」「です」「学生」の順番です",
    explanation: "be動詞を使った基本文です。「だれが」「です」「なに」の順番を覚えましょう！"
  },
  {
    id: "lesson2",
    title: "日常生活：学校での活動",
    level: "beginner",
    description: "学校での日常を表現してみましょう",
    words: [
      { id: "4", text: "She", type: "subject" },
      { id: "5", text: "studies", type: "verb" },
      { id: "6", text: "math", type: "object" },
      { id: "7", text: "at school", type: "place" },
    ],
    correctAnswer: "She studies math at school",
    hint: "「彼女は」「勉強する」「数学を」「学校で」",
    explanation: "場所を表す「どこで」が加わりました。英語では場所は文の後ろに来ます！"
  },
  {
    id: "lesson3",
    title: "時間を含む文：日課",
    level: "intermediate",
    description: "時間を含む完全な文を作りましょう",
    words: [
      { id: "8", text: "We", type: "subject" },
      { id: "9", text: "play", type: "verb" },
      { id: "10", text: "soccer", type: "object" },
      { id: "11", text: "in the park", type: "place" },
      { id: "12", text: "every Sunday", type: "time" },
    ],
    correctAnswer: "We play soccer in the park every Sunday",
    hint: "「私たちは」「する」「サッカーを」「公園で」「毎週日曜日」",
    explanation: "5つのボックスすべてを使った完全な文です。時間は最後に来ることが多いです！"
  },
  {
    id: "lesson4",
    title: "過去形：昨日の出来事",
    level: "intermediate",
    description: "過去の出来事を表現してみましょう",
    words: [
      { id: "13", text: "They", type: "subject" },
      { id: "14", text: "watched", type: "verb" },
      { id: "15", text: "a movie", type: "object" },
      { id: "16", text: "at home", type: "place" },
      { id: "17", text: "yesterday", type: "time" },
    ],
    correctAnswer: "They watched a movie at home yesterday",
    hint: "動詞が過去形になっていることに注目！",
    explanation: "過去形でも意味順は変わりません。動詞の形が変わるだけです！"
  },
  {
    id: "lesson5",
    title: "応用：複雑な文",
    level: "advanced",
    description: "より複雑な文に挑戦しましょう",
    words: [
      { id: "18", text: "My brother", type: "subject" },
      { id: "19", text: "will visit", type: "verb" },
      { id: "20", text: "his friends", type: "object" },
      { id: "21", text: "in Tokyo", type: "place" },
      { id: "22", text: "next month", type: "time" },
    ],
    correctAnswer: "My brother will visit his friends in Tokyo next month",
    hint: "未来形（will）を使った文です",
    explanation: "未来形でも意味順は同じ！主語が複数の単語でも、ひとつのまとまりとして扱います。"
  }
];

export const getAllLessons = (): Lesson[] => [TUTORIAL_LESSON, ...DEMO_LESSONS];

/**
 * Get a lesson by ID
 */
export const getLessonById = (id: string): Lesson | undefined => {
  return getAllLessons().find(lesson => lesson.id === id);
};

/**
 * Get lessons by level
 */
export const getLessonsByLevel = (level: Lesson['level']): Lesson[] => {
  return getAllLessons().filter(lesson => lesson.level === level);
};