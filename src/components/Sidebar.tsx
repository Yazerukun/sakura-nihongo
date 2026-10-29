import React from 'react';
import { StudyMode, LevelType, UserProfile, StudentLicenseStatus } from '../types';
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
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Flame,
  ChevronRight,
  User,
  Calendar,
  Sparkle
} from 'lucide-react';

export interface NavItem {
  id: StudyMode;
  label: string;
  japaneseLabel: string;
  icon: React.ReactNode;
  desc: string;
  badge?: string;
  badgeColor?: 'emerald' | 'sakura' | 'indigo' | 'rose' | 'amber' | 'pink';
}

export interface NavCategory {
  title: string;
  japaneseTitle: string;
  items: NavItem[];
}

interface SidebarProps {
  currentMode: StudyMode;
  onSelectMode: (mode: StudyMode) => void;
  targetLevel: LevelType;
  onSelectLevel: (lvl: LevelType) => void;
  user: UserProfile;
  licenseStatus: StudentLicenseStatus;
  streakDays: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsedDesktop: boolean;
  onToggleCollapseDesktop: () => void;
  onOpenUpgrade: () => void;
  onOpenProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentMode,
  onSelectMode,
  targetLevel,
  onSelectLevel,
  user,
  licenseStatus,
  streakDays,
  isOpenMobile,
  onCloseMobile,
  isCollapsedDesktop,
  onToggleCollapseDesktop,
  onOpenUpgrade,
  onOpenProfile
}) => {
  const isAdmin = user.username === 'nihon11';

  const categories: NavCategory[] = [
    {
      title: 'EXAM DRILLS & MOCKS',
      japaneseTitle: '本試験対策',
      items: [
        {
          id: 'cbt',
          label: 'Official CBT Simulator',
          japaneseLabel: '本番 CBT 模擬試験',
          icon: <Zap className="w-4 h-4" />,
          desc: 'Official Prometric 60-min terminal & certificate',
          badge: 'Live CBT',
          badgeColor: 'emerald'
        },
        {
          id: 'lms',
          label: 'LMS Reviewer & Mock Suite',
          japaneseLabel: '傾向対策・出題パターン',
          icon: <GraduationCap className="w-4 h-4" />,
          desc: '9 Exam Patterns & 10 Mock Tests',
          badge: '2025/2026',
          badgeColor: 'sakura'
        }
      ]
    },
    {
      title: 'INTERACTIVE AI & VOICE',
      japaneseTitle: '会話・音声 AI',
      items: [
        {
          id: 'ai-tutor',
          label: 'Real-Time AI Sensei',
          japaneseLabel: 'リアルタイム AI 対話講師',
          icon: <Bot className="w-4 h-4" />,
          desc: 'Interactive live dialogue practice',
          badge: 'Live AI',
          badgeColor: 'sakura'
        },
        {
          id: 'realtime-voice',
          label: 'Voice Pronunciation Lab',
          japaneseLabel: 'リアルタイム発音評価',
          icon: <Mic className="w-4 h-4" />,
          desc: 'Live microphone speech assessment',
          badge: 'Speech AI',
          badgeColor: 'rose'
        }
      ]
    },
    {
      title: 'FOUNDATIONS & DRILLS',
      japaneseTitle: '基礎・反復ドリル',
      items: [
        {
          id: 'flashcards',
          label: 'Flashcard Deck (SRS)',
          japaneseLabel: '3D 暗記カード (SRS)',
          icon: <Layers className="w-4 h-4" />,
          desc: 'Spaced repetition with native audio',
          badge: '3D Audio',
          badgeColor: 'indigo'
        },
        {
          id: 'quiz',
          label: 'Practice Quizzes',
          japaneseLabel: '即時採点クイズ',
          icon: <Sparkles className="w-4 h-4" />,
          desc: 'Instant checks & grammar notes'
        },
        {
          id: 'grammar',
          label: 'Grammar Library',
          japaneseLabel: '文法マスター辞典',
          icon: <BookOpen className="w-4 h-4" />,
          desc: '200+ Patterns, rules & example sentences',
          badge: '200+ Rules'
        },
        {
          id: 'vocab',
          label: 'Vocab & Kanji Vault',
          japaneseLabel: '必須語彙・重要漢字',
          icon: <Languages className="w-4 h-4" />,
          desc: '1,100+ Irodori & JLPT words',
          badge: '1,100+ Words'
        },
        {
          id: 'kana',
          label: 'Kana Audio Matrix',
          japaneseLabel: '五十音表 (音声付き)',
          icon: <Grid3X3 className="w-4 h-4" />,
          desc: 'Interactive Hiragana & Katakana chart'
        },
        {
          id: 'cheatsheet',
          label: 'Quick Cheatsheets',
          japaneseLabel: '文法・助詞早見表',
          icon: <Bookmark className="w-4 h-4" />,
          desc: 'Te-form, particles & number counters'
        }
      ]
    },
    {
      title: 'PERFORMANCE & ZEN',
      japaneseTitle: '集中・学習記録',
      items: [
        {
          id: 'pomodoro',
          label: 'Zen Focus Timer',
          japaneseLabel: '禅ポモドーロ集中タイマー',
          icon: <Timer className="w-4 h-4" />,
          desc: '25m focus sessions & calming temple bell',
          badge: '25m Zen',
          badgeColor: 'amber'
        },
        {
          id: 'analytics',
          label: 'Progress & Streaks',
          japaneseLabel: '成績推移・学習統計',
          icon: <BarChart3 className="w-4 h-4" />,
          desc: 'Historical scores, pass rate & trends'
        }
      ]
    }
  ];

  // Strictly add Admin Hub if nihon11
  if (isAdmin) {
    categories.push({
      title: 'ADMINISTRATION',
      japaneseTitle: '管理者ポータル',
      items: [
        {
          id: 'admin-licensing',
          label: 'Admin Licensing Hub',
          japaneseLabel: 'ライセンス・生徒管理',
          icon: <ShieldCheck className="w-4 h-4" />,
          desc: 'Student keys, device locks & pass distribution',
          badge: '👑 Admin',
          badgeColor: 'pink'
        }
      ]
    });
  }

  const renderBadge = (badge?: string, color?: string, isActive?: boolean) => {
    if (!badge) return null;
    let colorClass = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
    if (isActive) {
      colorClass = 'bg-white/20 text-white';
    } else if (color === 'emerald') {
      colorClass = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
    } else if (color === 'sakura') {
      colorClass = 'bg-sakura-100 text-sakura-700 dark:bg-sakura-900/60 dark:text-sakura-300';
    } else if (color === 'indigo') {
      colorClass = 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300';
    } else if (color === 'rose') {
      colorClass = 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300';
    } else if (color === 'amber') {
      colorClass = 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';
    } else if (color === 'pink') {
      colorClass = 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300';
    }
    return (
      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${colorClass}`}>
        {badge}
      </span>
    );
  };

  const sidebarContent = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full select-none">
      
      {/* Top Header Section */}
      <div className={`p-4 border-b border-sakura-100/70 dark:border-slate-800/80 flex items-center justify-between ${
        !isMobile && isCollapsedDesktop ? 'px-2 py-4 justify-center' : ''
      }`}>
        {(!isCollapsedDesktop || isMobile) ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sakura-500 to-rose-500 text-white flex items-center justify-center text-sm shadow-sm shadow-sakura-500/20">
              🌸
            </div>
            <div>
              <span className="font-serif font-black text-sm text-slate-800 dark:text-white block leading-tight">
                Study Directory
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Japanese Learning Modules
              </span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sakura-500 to-rose-500 text-white flex items-center justify-center text-sm shadow-sm">
            🌸
          </div>
        )}

        {isMobile ? (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 active:scale-95"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onToggleCollapseDesktop}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsedDesktop ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsedDesktop ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-5 scrollbar-thin scrollbar-thumb-sakura-200 dark:scrollbar-thumb-slate-700">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-1">
            {(!isCollapsedDesktop || isMobile) ? (
              <div className="px-2.5 py-1 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {cat.title}
                </span>
                <span className="text-[9px] font-serif text-slate-300 dark:text-slate-600 font-medium">
                  {cat.japaneseTitle}
                </span>
              </div>
            ) : (
              <div className="w-5 h-[1px] bg-slate-200 dark:bg-slate-800 mx-auto my-2" />
            )}

            <div className="space-y-1">
              {cat.items.map((item) => {
                const isActive = currentMode === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectMode(item.id);
                      if (isMobile) onCloseMobile();
                    }}
                    className={`w-full group rounded-xl transition-all duration-200 flex items-center gap-2.5 text-left active:scale-98 ${
                      !isCollapsedDesktop || isMobile ? 'px-2.5 py-2' : 'p-2.5 justify-center'
                    } ${
                      isActive
                        ? 'bg-gradient-to-r from-sakura-500 to-rose-600 text-white shadow-md shadow-sakura-500/25 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-sakura-50/70 dark:hover:bg-slate-800/80 hover:text-sakura-600 dark:hover:text-sakura-400'
                    }`}
                    title={`${item.label} (${item.japaneseLabel}) - ${item.desc}`}
                  >
                    {/* Icon container */}
                    <div
                      className={`p-1.5 rounded-lg flex-shrink-0 transition-transform group-hover:scale-105 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-white dark:bg-slate-800 text-sakura-600 dark:text-sakura-400 shadow-2xs border border-sakura-100/50 dark:border-slate-700/60'
                      }`}
                    >
                      {item.icon}
                    </div>

                    {/* Labels & details */}
                    {(!isCollapsedDesktop || isMobile) && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs truncate font-bold">
                            {item.label}
                          </span>
                          {renderBadge(item.badge, item.badgeColor, isActive)}
                        </div>
                        <span
                          className={`text-[10px] block truncate font-serif ${
                            isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {item.japaneseLabel}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Student Telemetry Capsule */}
      {(!isCollapsedDesktop || isMobile) ? (
        <div className="p-3 border-t border-sakura-100/70 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 m-2 rounded-2xl border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">{user.avatar}</span>
              <div className="min-w-0">
                <span className="text-xs font-black text-slate-800 dark:text-white truncate block">
                  {user.displayName}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5 text-sakura-500" />
                  Target: {targetLevel} Exam
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 text-amber-600 dark:text-amber-400 text-[10px] font-black">
              <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{streakDays}d</span>
            </div>
          </div>

          {/* License Status Pill / CTA */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            {isAdmin ? (
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Authority</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Owner</span>
              </div>
            ) : licenseStatus.hasValidLicense ? (
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Sparkle className="w-3 h-3 fill-emerald-500" />
                  <span>
                    {licenseStatus.isTrial
                      ? `Trial: ${licenseStatus.timeRemaining?.formatted?.split(' ')?.[0] || '24h'}`
                      : licenseStatus.daysRemaining && licenseStatus.daysRemaining > 365
                      ? 'Lifetime VIP'
                      : `VIP: ${licenseStatus.daysRemaining}d left`}
                  </span>
                </span>
                <button
                  onClick={onOpenUpgrade}
                  className="text-[10px] text-sakura-600 dark:text-sakura-400 font-bold hover:underline"
                >
                  Manage
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenUpgrade}
                className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-sakura-500 to-rose-600 text-white text-[11px] font-black shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                <span>Unlock VIP Pass (₱100)</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-sakura-100/70 dark:border-slate-800/80 flex flex-col items-center gap-2">
          <button
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-xl bg-sakura-50 dark:bg-slate-800 flex items-center justify-center text-lg active:scale-95 transition-all"
            title={`${user.displayName} (Profile)`}
          >
            {user.avatar}
          </button>
        </div>
      )}

    </div>
  );

  return (
    <>
      {/* Desktop Sticky Side Panel */}
      <aside
        className={`hidden lg:block sticky top-[57px] h-[calc(100vh-57px)] flex-shrink-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-r border-sakura-100/70 dark:border-slate-800/80 transition-all duration-300 z-30 ${
          isCollapsedDesktop ? 'w-18' : 'w-72'
        }`}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile Off-Canvas Drawer (Slide-Over) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Off-canvas Panel Container */}
          <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-slate-900 shadow-2xl border-r border-sakura-200 dark:border-slate-800 z-10 animate-slideRight">
            {sidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
