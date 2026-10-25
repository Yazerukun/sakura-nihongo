import { ExamHistoryRecord, StudyStats } from '../types';

const STORAGE_KEY_STATS = 'sakura_study_stats';
const STORAGE_KEY_EXAM_HISTORY = 'sakura_exam_history';
const STORAGE_KEY_BOOKMARKS = 'sakura_bookmarks';
const STORAGE_KEY_SRS = 'sakura_srs_boxes';

export const DAILY_QUOTES = [
  { japanese: "七転び八起き (ななころびやおき)", romaji: "Nanakorobi yaoki", meaning: "Fall seven times, stand up eight. Never give up!" },
  { japanese: "継続は力なり (けいぞくはちからなり)", romaji: "Keizoku wa chikara nari", meaning: "Continuity is power. Consistency beats intensity." },
  { japanese: "初心忘るべからず (しょしんわするべからず)", romaji: "Shoshin wasuru bekarazu", meaning: "Never forget your beginner's enthusiasm." },
  { japanese: "一期一会 (いちごいちえ)", romaji: "Ichigo ichie", meaning: "Treasure every single moment, for it will never recur." },
  { japanese: "雨降って地固まる (あめふってじかたまる)", romaji: "Ame futte ji katamaru", meaning: "After rain, the earth hardens. Adversity builds strength." },
  { japanese: "千里の道も一歩から (せんりのみちもいっぽから)", romaji: "Senri no michi mo ippo kara", meaning: "A journey of a thousand miles begins with a single step." },
  { japanese: "夢は逃げない。逃げるのはいつも自分だ。", romaji: "Yume wa nigenai. Nigeru no wa itsumo jibun da.", meaning: "Dreams don't run away. It's always us who run away." }
];

export function getTodayQuote() {
  const dayIndex = new Date().getDate() % DAILY_QUOTES.length;
  return DAILY_QUOTES[dayIndex];
}

export function getStudyStats(): StudyStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATS);
    if (!raw) {
      return {
        totalMinutesStudied: 15,
        questionsAnswered: 24,
        correctAnswers: 21,
        cardsMastered: 18,
        streakDays: 3,
        lastStudyDate: new Date().toISOString().split('T')[0]
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      totalMinutesStudied: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      cardsMastered: 0,
      streakDays: 1,
      lastStudyDate: new Date().toISOString().split('T')[0]
    };
  }
}

export function recordStudySession(minutes: number, questions: number, correct: number): StudyStats {
  const stats = getStudyStats();
  const today = new Date().toISOString().split('T')[0];

  stats.totalMinutesStudied += minutes;
  stats.questionsAnswered += questions;
  stats.correctAnswers += correct;

  if (stats.lastStudyDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (stats.lastStudyDate === yesterday) {
      stats.streakDays += 1;
    } else {
      stats.streakDays = 1;
    }
    stats.lastStudyDate = today;
  }

  localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  return stats;
}

export function getExamHistory(): ExamHistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EXAM_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveExamResult(record: ExamHistoryRecord): void {
  const history = getExamHistory();
  history.unshift(record);
  // Keep last 30 exam records
  localStorage.setItem(STORAGE_KEY_EXAM_HISTORY, JSON.stringify(history.slice(0, 30)));
}

export function getBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function toggleBookmark(id: string): boolean {
  const bookmarks = getBookmarks();
  const exists = bookmarks.includes(id);
  let updated: string[];
  if (exists) {
    updated = bookmarks.filter(b => b !== id);
  } else {
    updated = [...bookmarks, id];
  }
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
  return !exists;
}

export function getSRSBoxes(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SRS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function updateSRSBox(cardId: string, delta: number): number {
  const boxes = getSRSBoxes();
  const current = boxes[cardId] || 0;
  const next = Math.max(0, Math.min(5, current + delta));
  boxes[cardId] = next;
  localStorage.setItem(STORAGE_KEY_SRS, JSON.stringify(boxes));
  return next;
}
