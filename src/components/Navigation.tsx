import React from 'react';
import { StudyMode, UserProfile } from '../types';
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
  ShieldCheck
} from 'lucide-react';

interface NavigationProps {
  currentMode: StudyMode;
  onSelectMode: (mode: StudyMode) => void;
  targetLevel: string;
  user?: UserProfile | null;
}

export const Navigation: React.FC<NavigationProps> = ({ currentMode, onSelectMode, targetLevel, user }) => {
  const tabs: { id: StudyMode; label: string; icon: React.ReactNode; desc: string; badge?: string }[] = [];

  // STRICT SINGLE ADMIN: Only nihon11 can ever access the Admin Licensing Hub!
  if (user?.username === 'nihon11') {
    tabs.push({
      id: 'admin-licensing',
      label: 'Admin Licensing Hub',
      icon: <ShieldCheck className="w-4 h-4 text-pink-500 fill-pink-500" />,
      desc: '30-Day keys, student subscriptions & anti-piracy',
      badge: '👑 Admin Hub'
    });
  }

  tabs.push(
    {
      id: 'cbt',
      label: 'Real-Time Official CBT Exam',
      icon: <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />,
      desc: 'Official 60-min Prometric terminal with audio & certificate',
      badge: 'Live CBT'
    },
    {
      id: 'lms',
      label: 'LMS Reviewer & Mock Suite',
      icon: <GraduationCap className="w-4 h-4 text-sakura-500 fill-sakura-500" />,
      desc: '9 Patterns & 10 Mock Exams',
      badge: '2025/2026'
    },
    {
      id: 'realtime-voice',
      label: 'Real-Time Voice Assessor',
      icon: <Mic className="w-4 h-4 text-rose-500" />,
      desc: 'Live microphone pronunciation evaluation',
      badge: 'Real-time'
    },
    {
      id: 'ai-tutor',
      label: 'Real-Time AI Sensei',
      icon: <Bot className="w-4 h-4 text-sakura-500" />,
      desc: 'Interactive live dialogue tutor',
      badge: 'Live AI'
    },
    {
      id: 'flashcards',
      label: 'Flashcards (SRS)',
      icon: <Layers className="w-4 h-4" />,
      desc: '3D Flip & Spaced Repetition',
      badge: 'Audio'
    },
    {
      id: 'quiz',
      label: 'Practice Quizzes',
      icon: <Sparkles className="w-4 h-4" />,
      desc: 'Instant answer check & notes'
    },
    {
      id: 'grammar',
      label: 'Grammar Library',
      icon: <BookOpen className="w-4 h-4" />,
      desc: 'Patterns, rules & sentences'
    },
    {
      id: 'vocab',
      label: 'Vocab & Kanji',
      icon: <Languages className="w-4 h-4" />,
      desc: '600+ Irodori & JLPT words'
    },
    {
      id: 'kana',
      label: 'Kana Matrix',
      icon: <Grid3X3 className="w-4 h-4" />,
      desc: 'Hiragana & Katakana'
    },
    {
      id: 'cheatsheet',
      label: 'Cheatsheets',
      icon: <Bookmark className="w-4 h-4" />,
      desc: 'Te-form, particles, counters'
    },
    {
      id: 'pomodoro',
      label: 'Zen Study Timer',
      icon: <Timer className="w-4 h-4" />,
      desc: '25m focus & calming bell'
    },
    {
      id: 'analytics',
      label: 'Progress & Stats',
      icon: <BarChart3 className="w-4 h-4" />,
      desc: 'Score history & streaks'
    }
  );

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-sakura-200 dark:scrollbar-thumb-slate-700">
        {tabs.map((tab) => {
          const isActive = currentMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectMode(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl whitespace-nowrap text-xs font-bold transition-all relative group flex-shrink-0 border ${
                isActive
                  ? 'bg-sakura-500 text-white border-sakura-600 shadow-md shadow-sakura-500/20'
                  : 'bg-white/80 dark:bg-slate-900/80 hover:bg-sakura-50/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/70 dark:border-slate-800 hover:border-sakura-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-sakura-50 dark:bg-slate-800 text-sakura-600 dark:text-sakura-400 group-hover:scale-110 transition-transform'
                }`}
              >
                {tab.icon}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-semibold uppercase ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-sakura-100 dark:bg-sakura-900/50 text-sakura-700 dark:text-sakura-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
