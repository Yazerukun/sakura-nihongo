export type LevelType = 'JFT' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export type StudyMode = 
  | 'cbt'
  | 'lms'
  | 'realtime-voice'
  | 'ai-tutor'
  | 'flashcards'
  | 'quiz'
  | 'grammar'
  | 'vocab'
  | 'kana'
  | 'cheatsheet'
  | 'pomodoro'
  | 'analytics';

export interface UserProfile {
  username: string;
  displayName: string;
  avatar: string;
  targetLevel: LevelType;
  examTargetDate: string;
  dailyGoalCards: number;
  dailyGoalMinutes: number;
  sweetNote: string;
  role?: 'admin' | 'student';
}

export interface CBTQuestion {
  id: string;
  testNum: number;
  sectionId: number;
  sectionName: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface JLPTQuizQuestion {
  id: string;
  level: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface JFTVocabItem {
  id: string;
  kanji: string;
  furigana: string;
  meaning_id: string;
  category: string;
  level: string;
}

export interface JLPTN5VocabItem {
  japanese: string;
  reading: string;
  meanings: string[];
  jlpt_level: string;
  type?: string;
  romaji?: string;
}

export interface GrammarExample {
  japanese: string;
  english: string;
  breakdown?: string;
  reading?: string;
}

export interface GrammarItem {
  id: string;
  pattern: string;
  romanization: string;
  meaning: string;
  jlpt_level: string;
  examples: GrammarExample[];
}

export interface ExamHistoryRecord {
  id: string;
  date: string;
  examType: 'JFT' | 'JLPT';
  level: LevelType;
  score: number;
  maxScore: number;
  passed: boolean;
  percentage: number;
  sectionScores?: { [sectionName: string]: { correct: number; total: number } };
  durationSeconds: number;
}

export interface StudyStats {
  totalMinutesStudied: number;
  questionsAnswered: number;
  correctAnswers: number;
  cardsMastered: number;
  streakDays: number;
  lastStudyDate: string;
}

export interface LMSPattern {
  id: string;
  title: string;
  examSection: string;
  badge: string;
  description: string;
  strategy: string;
}

export interface LMSQuestion {
  id: string;
  patternId: string;
  patternName: string;
  level: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  patternRule: string;
  audioText?: string;
}

export interface LMSMockExam {
  testId: string;
  testNumber: number;
  title: string;
  japaneseTitle: string;
  targetLevel: string;
  timeLimitMinutes: number;
  totalQuestions: number;
  passingScore: number;
  description: string;
  questionIds: string[];
}

