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
  | 'analytics'
  | 'admin-licensing';

export interface LicenseRecord {
  id: string;
  code: string;
  studentName: string;
  planDurationDays: number;
  pricePaid: number;
  status: 'active' | 'unused' | 'expired' | 'revoked';
  createdAt: string;
  activatedAt?: string;
  expiresAt?: string;
  boundDeviceId?: string;
  boundDeviceName?: string;
  notes?: string;
}

export interface TimeRemainingDetail {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
  formatted: string;
}

export interface StudentLicenseStatus {
  hasValidLicense: boolean;
  isTrial?: boolean;
  license?: LicenseRecord;
  daysRemaining: number;
  timeRemaining?: TimeRemainingDetail;
  isExpired: boolean;
  isLockedToOtherDevice: boolean;
  lockedDeviceName?: string;
  expiresAt?: string;
}

export interface LicensingStats {
  totalLicenses: number;
  activeLicenses: number;
  unusedLicenses: number;
  expiredLicenses: number;
  estimatedRevenue: number;
}

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
  registeredAt?: string;
  trialExpiresAt?: string;
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

