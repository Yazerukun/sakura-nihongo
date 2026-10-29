import React, { useState } from 'react';
import { StudyMode, UserProfile, StudentLicenseStatus } from '../types';
import { 
  Zap, 
  GraduationCap, 
  Layers, 
  Bot, 
  ShieldCheck, 
  Sparkles, 
  MoreHorizontal,
  X,
  BookOpen,
  Languages,
  Grid3X3,
  Bookmark,
  Timer,
  BarChart3,
  Mic,
  Compass,
  LayoutGrid
} from 'lucide-react';

interface MobileBottomDockProps {
  currentMode: StudyMode;
  onSelectMode: (mode: StudyMode) => void;
  user: UserProfile;
  licenseStatus: StudentLicenseStatus;
  onOpenUpgrade: () => void;
  onOpenSidebar?: () => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  currentMode,
  onSelectMode,
  user,
  licenseStatus,
  onOpenUpgrade,
  onOpenSidebar
}) => {
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const isAdmin = user.username === 'nihon11';

  const primaryItems: { id: StudyMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'cbt',
      label: 'CBT Exam',
      icon: <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />,
      badge: '60m'
    },
    {
      id: 'lms',
      label: 'LMS Review',
      icon: <GraduationCap className="w-5 h-5 text-sakura-500 fill-sakura-500" />
    },
    {
      id: 'ai-tutor',
      label: 'AI Sensei',
      icon: <Bot className="w-5 h-5 text-sakura-500" />
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      icon: <Layers className="w-5 h-5 text-indigo-500" />
    }
  ];

  const secondaryItems: { id: StudyMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'realtime-voice',
      label: 'Voice Lab',
      icon: <Mic className="w-5 h-5 text-rose-500" />,
      desc: 'Live microphone speech assessment'
    },
    {
      id: 'grammar',
      label: 'Grammar Library',
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      desc: '200+ Japanese grammar patterns'
    },
    {
      id: 'vocab',
      label: 'Vocab & Kanji',
      icon: <Languages className="w-5 h-5 text-emerald-500" />,
      desc: '1,100+ Irodori & JLPT words'
    },
    {
      id: 'kana',
      label: 'Kana Matrix',
      icon: <Grid3X3 className="w-5 h-5 text-amber-500" />,
      desc: 'Hiragana & Katakana audio chart'
    },
    {
      id: 'cheatsheet',
      label: 'Cheatsheets',
      icon: <Bookmark className="w-5 h-5 text-purple-500" />,
      desc: 'Te-form, particles & counters'
    },
    {
      id: 'pomodoro',
      label: 'Zen Study Timer',
      icon: <Timer className="w-5 h-5 text-teal-500" />,
      desc: '25m focus & calming bell'
    },
    {
      id: 'analytics',
      label: 'Progress & Stats',
      icon: <BarChart3 className="w-5 h-5 text-pink-500" />,
      desc: 'Exams history & score graphs'
    }
  ];

  const handleSelectSecondary = (mode: StudyMode) => {
    onSelectMode(mode);
    setShowMoreSheet(false);
  };

  const handleOpenMore = () => {
    if (onOpenSidebar) {
      onOpenSidebar();
    } else {
      setShowMoreSheet(true);
    }
  };

  return (
    <>
      {/* Floating Bottom Island Dock (Strictly Mobile lg:hidden) */}
      <div className="fixed bottom-3 inset-x-3 z-40 lg:hidden animate-springPop">
        <div className="max-w-md mx-auto bg-white/92 dark:bg-slate-900/92 backdrop-blur-2xl rounded-[28px] p-1.5 shadow-2xl border border-white/60 dark:border-slate-800 flex items-center justify-between gap-1 shadow-sakura-500/10">
          {primaryItems.map((item) => {
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectMode(item.id)}
                className={`relative flex-1 py-2 px-1 flex flex-col items-center justify-center rounded-2xl transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-sakura-500 to-rose-600 text-white shadow-lg shadow-sakura-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="relative">
                  <span className={isActive ? '[&>*]:text-white [&>*]:fill-white' : ''}>
                    {item.icon}
                  </span>
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 text-[8px] font-black px-1 py-0.2 rounded-full bg-emerald-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* 5th slot: Admin Hub if nihon11, or All Modules Drawer Trigger */}
          {isAdmin ? (
            <button
              onClick={() => onSelectMode('admin-licensing')}
              className={`relative flex-1 py-2 px-1 flex flex-col items-center justify-center rounded-2xl transition-all duration-200 active:scale-95 ${
                currentMode === 'admin-licensing'
                  ? 'bg-gradient-to-tr from-pink-600 to-sakura-500 text-white shadow-lg shadow-sakura-500/30'
                  : 'text-sakura-600 dark:text-sakura-400 hover:text-sakura-700'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-sakura-500 fill-sakura-500" />
              <span className="text-[10px] font-black mt-0.5">Admin</span>
            </button>
          ) : (
            <button
              onClick={handleOpenMore}
              className={`relative flex-1 py-2 px-1 flex flex-col items-center justify-center rounded-2xl transition-all duration-200 active:scale-95 ${
                secondaryItems.some(i => i.id === currentMode)
                  ? 'bg-sakura-500 text-white shadow-md shadow-sakura-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="All Study Modules"
            >
              <LayoutGrid className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Modules</span>
            </button>
          )}

        </div>
      </div>

      {/* Fallback Mobile Drawer Sheet ("More Features") */}
      {showMoreSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setShowMoreSheet(false)}
          />

          {/* Bottom Sheet Container */}
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[32px] p-6 shadow-2xl border-t border-slate-200 dark:border-slate-800 z-10 max-h-[80vh] overflow-y-auto animate-springPop">
            {/* Grab Handle */}
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mb-5" />

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif font-black text-lg text-slate-800 dark:text-white">
                  🌸 Study Suite Modules
                </h3>
                <p className="text-xs text-slate-500">Pick a reviewer tool or study guide</p>
              </div>
              <button
                onClick={() => setShowMoreSheet(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 pb-6">
              {secondaryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectSecondary(item.id)}
                  className={`p-3.5 rounded-2xl text-left border flex items-center justify-between transition-all active:scale-98 ${
                    currentMode === item.id
                      ? 'bg-sakura-50 dark:bg-sakura-950/40 border-sakura-400 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-800 dark:text-white block">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-sakura-500">Open →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
