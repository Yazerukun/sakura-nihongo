import React from 'react';
import { StudyMode, LevelType } from '../types';
import { 
  Zap, 
  GraduationCap, 
  Mic, 
  Bot, 
  Layers, 
  Sparkles, 
  BookOpen, 
  Languages, 
  Grid3X3, 
  Bookmark, 
  Timer, 
  BarChart3, 
  ShieldCheck,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ModuleHeroHeaderProps {
  currentMode: StudyMode;
  currentLevel: LevelType;
  onSelectLevel: (lvl: LevelType) => void;
  isCollapsedDesktop: boolean;
  onToggleCollapseDesktop: () => void;
}

export const ModuleHeroHeader: React.FC<ModuleHeroHeaderProps> = ({
  currentMode,
  currentLevel,
  onSelectLevel,
  isCollapsedDesktop,
  onToggleCollapseDesktop
}) => {
  const moduleMeta: Record<StudyMode, {
    category: string;
    japaneseCategory: string;
    title: string;
    japaneseTitle: string;
    description: string;
    icon: React.ReactNode;
    tag: string;
  }> = {
    cbt: {
      category: 'EXAM DRILLS & MOCKS',
      japaneseCategory: '本試験対策',
      title: 'Official CBT Exam Simulator',
      japaneseTitle: '本番 CBT 模擬試験',
      description: 'Timed 60-minute Prometric test terminal with authentic audio listening and scoring certificate.',
      icon: <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />,
      tag: 'Prometric CBT'
    },
    lms: {
      category: 'EXAM DRILLS & MOCKS',
      japaneseCategory: '本試験対策',
      title: 'LMS Master Reviewer & Mock Suite',
      japaneseTitle: '傾向対策・出題パターン',
      description: 'Master the 9 high-yield Prometric test patterns and 10 full-length mock examinations.',
      icon: <GraduationCap className="w-5 h-5 text-sakura-500 fill-sakura-500" />,
      tag: '2025/2026 Curriculum'
    },
    'realtime-voice': {
      category: 'INTERACTIVE AI & VOICE',
      japaneseCategory: '会話・音声 AI',
      title: 'Voice Pronunciation Assessor',
      japaneseTitle: 'リアルタイム発音評価',
      description: 'Live microphone speech recognition evaluating pitch, accent, and conversational fluency.',
      icon: <Mic className="w-5 h-5 text-rose-500" />,
      tag: 'Neural Speech AI'
    },
    'ai-tutor': {
      category: 'INTERACTIVE AI & VOICE',
      japaneseCategory: '会話・音声 AI',
      title: 'Real-Time AI Sensei',
      japaneseTitle: 'リアルタイム AI 対話講師',
      description: 'Interactive natural Japanese dialogue tutor with instant corrections and vocabulary tips.',
      icon: <Bot className="w-5 h-5 text-sakura-500" />,
      tag: 'Live AI Sensei'
    },
    flashcards: {
      category: 'FOUNDATIONS & DRILLS',
      japaneseCategory: '基礎・反復ドリル',
      title: 'Flashcard Deck (SRS)',
      japaneseTitle: '3D 暗記カード (SRS)',
      description: 'Spaced repetition study cards with 3D physical card flip and authentic native audio.',
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
      tag: 'Spaced Repetition'
    },
    quiz: {
      category: 'FOUNDATIONS & DRILLS',
      japaneseCategory: '基礎・反復ドリル',
      title: 'Practice Quizzes',
      japaneseTitle: '即時採点クイズ',
      description: 'Rapid-fire multiple choice questions with detailed explanation notes on every answer.',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      tag: 'Rapid Fire'
    },
    grammar: {
      category: 'FOUNDATIONS & DRILLS',
      japaneseCategory: '基礎・反復ドリル',
      title: 'Grammar Library',
      japaneseTitle: '文法マスター辞典',
      description: 'Over 200 grammatical patterns, sentence structures, and situational sample dialogues.',
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      tag: 'Bunpou Library'
    },
    vocab: {
      category: 'FOUNDATIONS & DRILLS',
      japaneseCategory: '基礎・反復ドリル',
      title: 'Vocab & Kanji Vault',
      japaneseTitle: '必須語彙・重要漢字',
      description: '1,100+ high-frequency Irodori & JLPT vocabulary items categorized by topic and Kanji.',
      icon: <Languages className="w-5 h-5 text-emerald-500" />,
      tag: '1,100+ Words'
    },
    kana: {
      category: 'FOUNDATIONS & DRILLS',
      japaneseCategory: '基礎・反復ドリル',
      title: 'Kana Audio Matrix',
      japaneseTitle: '五十音表 (音声付き)',
      description: 'Interactive Hiragana and Katakana matrix with clickable native voice audio pronunciation.',
      icon: <Grid3X3 className="w-5 h-5 text-orange-500" />,
      tag: 'Kana Master'
    },
    cheatsheet: {
      category: 'FOUNDATIONS & DRILLS',
      japaneseCategory: '基礎・反復ドリル',
      title: 'Quick Reference Cheatsheets',
      japaneseTitle: '文法・助詞早見表',
      description: 'Essential Te-form conjugation charts, particle usage tables, and number counters.',
      icon: <Bookmark className="w-5 h-5 text-purple-500" />,
      tag: 'Quick Reference'
    },
    pomodoro: {
      category: 'PERFORMANCE & ZEN',
      japaneseCategory: '集中・学習記録',
      title: 'Zen Focus Timer',
      japaneseTitle: '禅ポモドーロ集中タイマー',
      description: '25-minute deep focus study timer with soothing ambient sounds and Japanese bell cues.',
      icon: <Timer className="w-5 h-5 text-teal-500" />,
      tag: 'Deep Focus'
    },
    analytics: {
      category: 'PERFORMANCE & ZEN',
      japaneseCategory: '集中・学習記録',
      title: 'Progress & Analytics',
      japaneseTitle: '成績推移・学習統計',
      description: 'Comprehensive telemetry of mock test scores, study duration, and target exam readiness.',
      icon: <BarChart3 className="w-5 h-5 text-pink-500" />,
      tag: 'Study Telemetry'
    },
    'admin-licensing': {
      category: 'ADMINISTRATION',
      japaneseCategory: '管理者ポータル',
      title: 'Admin Licensing Hub',
      japaneseTitle: 'ライセンス・生徒管理',
      description: 'Sole operator licensing engine: generate 30-day keys, manage activations, and monitor concurrency.',
      icon: <ShieldCheck className="w-5 h-5 text-pink-500" />,
      tag: '👑 Owner Portal'
    }
  };

  const meta = moduleMeta[currentMode] || moduleMeta.cbt;

  const levels: { id: LevelType; label: string }[] = [
    { id: 'JFT', label: 'JFT A2' },
    { id: 'N5', label: 'JLPT N5' },
    { id: 'N4', label: 'JLPT N4' },
    { id: 'N3', label: 'JLPT N3' },
    { id: 'N2', label: 'JLPT N2' },
    { id: 'N1', label: 'JLPT N1' }
  ];

  return (
    <div className="mb-5 sm:mb-6 animate-fadeIn select-none">
      <div className="p-4 sm:p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-sakura-100/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Breadcrumbs & Title */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-sakura-100/60 dark:border-slate-700/60 flex-shrink-0 mt-0.5">
            {meta.icon}
          </div>

          <div>
            {/* Breadcrumb line */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-1 flex-wrap">
              <span>{meta.category}</span>
              <span className="font-serif opacity-70">({meta.japaneseCategory})</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-sakura-600 dark:text-sakura-400 font-extrabold">{meta.tag}</span>
            </div>

            {/* Main Title & Japanese Subtitle */}
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif font-black text-lg sm:text-xl text-slate-800 dark:text-white tracking-tight">
                {meta.title}
              </h2>
              <span className="text-xs font-serif font-semibold text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                {meta.japaneseTitle}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {meta.description}
            </p>
          </div>
        </div>

        {/* Right: Quick Level Switcher & Fullscreen/Zen toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap sm:flex-nowrap">
          
          {/* Quick Level Pill Selector */}
          <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 hidden xs:inline">
              Exam:
            </span>
            <div className="flex items-center gap-0.5">
              {levels.map((lvl) => {
                const isActive = currentLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => onSelectLevel(lvl.id)}
                    className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-sakura-500 to-rose-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {lvl.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Distraction-Free Toggle */}
          <button
            onClick={onToggleCollapseDesktop}
            className="hidden lg:flex items-center gap-1.5 p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-500 hover:text-sakura-600 dark:hover:text-sakura-400 text-xs font-bold transition-all active:scale-95 shadow-2xs"
            title={isCollapsedDesktop ? 'Restore normal sidebar' : 'Expand study workspace (Zen Focus)'}
          >
            {isCollapsedDesktop ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden xl:inline">{isCollapsedDesktop ? 'Side Panel' : 'Zen Focus'}</span>
          </button>

        </div>
      </div>
    </div>
  );
};
