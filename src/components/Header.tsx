import React, { useState, useRef, useEffect } from 'react';
import { LevelType, UserProfile, StudentLicenseStatus } from '../types';
import { 
  Flame, 
  Moon, 
  Sun, 
  Flower2, 
  Volume2, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  SlidersHorizontal,
  X,
  User,
  ChevronRight,
  Calendar,
  Zap
} from 'lucide-react';
import { japaneseVoice } from '../utils/audio';

interface HeaderProps {
  user: UserProfile;
  currentLevel: LevelType;
  onSelectLevel: (lvl: LevelType) => void;
  streakDays: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  petalsActive: boolean;
  onTogglePetals: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  onOpenLicensingModal?: () => void;
  onOpenAdminHub?: () => void;
  licenseStatus?: StudentLicenseStatus;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentLevel,
  onSelectLevel,
  streakDays,
  isDarkMode,
  onToggleDarkMode,
  petalsActive,
  onTogglePetals,
  onOpenProfile,
  onLogout,
  onOpenLicensingModal,
  onOpenAdminHub,
  licenseStatus
}) => {
  const [showMobileHub, setShowMobileHub] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mobileRailRef = useRef<HTMLDivElement>(null);

  const levels: { id: LevelType; label: string; shortLabel: string; badge: string; desc: string }[] = [
    { id: 'JFT', label: 'JFT A2', shortLabel: 'JFT A2', badge: 'Prometric', desc: 'Official Prometric CBT' },
    { id: 'N5', label: 'JLPT N5', shortLabel: 'N5', badge: 'Beginner', desc: 'Beginner Foundation' },
    { id: 'N4', label: 'JLPT N4', shortLabel: 'N4', badge: 'Official N4', desc: 'Workplace Ready' },
    { id: 'N3', label: 'JLPT N3', shortLabel: 'N3', badge: 'Intermediate', desc: 'Conversational Fluency' },
    { id: 'N2', label: 'JLPT N2', shortLabel: 'N2', badge: 'Business', desc: 'Professional Japanese' },
    { id: 'N1', label: 'JLPT N1', shortLabel: 'N1', badge: 'Master', desc: 'Advanced Mastery' }
  ];

  const currentLevelObj = levels.find(l => l.id === currentLevel) || levels[0];

  const handleTestAudio = () => {
    setIsPlayingAudio(true);
    japaneseVoice.speak('桜日本語へようこそ！一緒に合格を目指しましょう！');
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 3200);
  };

  // Scroll active level pill into view when level changes on mobile
  useEffect(() => {
    if (mobileRailRef.current) {
      const activeBtn = mobileRailRef.current.querySelector<HTMLButtonElement>(`[data-level-id="${currentLevel}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentLevel]);

  const isAdmin = user.username === 'nihon11';

  return (
    <>
      {/* Top Ambient Sakura Sheen Line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-sakura-400 via-rose-500 to-sakura-400 opacity-90 shadow-xs" />

      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-sakura-100/70 dark:border-slate-800/80 transition-colors shadow-sm shadow-sakura-500/5">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand & Active Level */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-sakura-500 via-rose-500 to-sakura-400 text-white shadow-md shadow-sakura-500/25 flex items-center justify-center ring-2 ring-white/90 dark:ring-slate-800 group-hover:scale-105 active:scale-95 transition-transform">
                <span className="text-lg sm:text-xl transform group-hover:rotate-12 transition-transform select-none">🌸</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif font-black text-base sm:text-lg text-slate-800 dark:text-white tracking-tight leading-none">
                  <span className="text-sakura-600 dark:text-sakura-400 mr-1 hidden xs:inline">桜</span>
                  <span>Sakura Nihongo</span>
                </h1>
                
                {/* Active Level Badge on Mobile (Instant Context) */}
                <span className="md:hidden inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sakura-500 text-white shadow-xs leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {currentLevelObj.shortLabel}
                </span>

                <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sakura-100 dark:bg-sakura-900/40 text-sakura-700 dark:text-sakura-300">
                  2025-2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block mt-0.5">
                Japanese Study & JFT-Basic / JLPT Master Reviewer
              </p>
            </div>
          </div>

          {/* Desktop Level Switcher (Hidden on Mobile) */}
          <div className="hidden md:flex items-center bg-slate-100/90 dark:bg-slate-900/90 p-1 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-inner">
            {levels.map((lvl) => {
              const isActive = currentLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => onSelectLevel(lvl.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-sakura-500 to-rose-600 text-white shadow-md shadow-sakura-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                  title={`${lvl.label} - ${lvl.desc}`}
                >
                  <span>{lvl.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {lvl.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* User Controls & Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* VIP Status / Admin Button */}
            {isAdmin ? (
              <button
                onClick={onOpenAdminHub}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-sakura-500 to-pink-600 hover:from-sakura-600 hover:to-pink-700 text-white text-[11px] sm:text-xs font-bold shadow-md shadow-sakura-500/20 active:scale-95 transition-all"
                title="Open Mariel's Student Licensing Hub"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Admin Hub</span>
                <span className="xs:hidden">Admin</span>
              </button>
            ) : (
              <button
                onClick={onOpenLicensingModal}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold transition-all shadow-sm active:scale-95 ${
                  licenseStatus?.hasValidLicense
                    ? licenseStatus.isTrial
                      ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                    : 'bg-gradient-to-r from-sakura-500 to-rose-600 text-white shadow-md shadow-sakura-500/25 animate-pulse'
                }`}
                title="View or Activate VIP Pass"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono">
                  {licenseStatus?.hasValidLicense ? (
                    licenseStatus.isTrial ? (
                      <>
                        <span className="hidden sm:inline">Trial: </span>
                        <span>{licenseStatus.timeRemaining?.formatted?.split(' ')?.[0] || '24h'}</span>
                      </>
                    ) : licenseStatus.daysRemaining && licenseStatus.daysRemaining > 365 ? (
                      '👑 VIP'
                    ) : (
                      <>
                        <span className="hidden sm:inline">VIP: </span>
                        <span>{licenseStatus.daysRemaining}d</span>
                      </>
                    )
                  ) : (
                    <>
                      <span className="hidden sm:inline">Get VIP (₱100)</span>
                      <span className="sm:hidden">₱100 VIP</span>
                    </>
                  )}
                </span>
              </button>
            )}

            {/* Daily Streak Badge */}
            <div
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-amber-600 dark:text-amber-400 text-[11px] sm:text-xs font-extrabold shadow-2xs select-none"
              title={`${streakDays} Consecutive Days Study Streak`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{streakDays}d<span className="hidden sm:inline font-bold"> Streak</span></span>
            </div>

            {/* Desktop-Only Action Controls */}
            <div className="hidden sm:flex items-center gap-1.5">
              {/* Test Audio Voice */}
              <button
                onClick={handleTestAudio}
                className={`p-2 rounded-xl transition-all duration-200 active:scale-95 ${
                  isPlayingAudio
                    ? 'bg-sakura-500 text-white shadow-md shadow-sakura-500/25 ring-2 ring-sakura-300 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sakura-600 dark:hover:text-sakura-400'
                }`}
                title="Test Japanese Voice (TTS)"
                aria-label="Test Japanese audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              {/* Falling Petals Toggle */}
              <button
                onClick={onTogglePetals}
                className={`p-2 rounded-xl transition-all duration-200 active:scale-95 ${
                  petalsActive
                    ? 'bg-sakura-100 dark:bg-sakura-900/40 text-sakura-600 dark:text-sakura-300 ring-1 ring-sakura-200 dark:ring-sakura-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
                title={petalsActive ? 'Pause falling petals' : 'Enable falling sakura petals'}
                aria-label="Toggle Sakura Petals"
              >
                <Flower2 className="w-4 h-4" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sakura-600 dark:hover:text-sakura-400 transition-all duration-200 active:scale-95"
                title={isDarkMode ? 'Light Mode (昼桜)' : 'Dark Mode (夜桜)'}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Desktop User Avatar Pill */}
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-2xl bg-sakura-50 hover:bg-sakura-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-sakura-100 dark:border-slate-700 transition-all text-xs font-semibold active:scale-95"
                title="Student Profile Settings"
              >
                <span className="text-base">{user.avatar}</span>
                <span className="text-slate-800 dark:text-slate-200 max-w-[85px] truncate">
                  {user.displayName.split(' ')[0]}
                </span>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors active:scale-95"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Student Hub Menu Trigger (Clean, Thumb-Friendly, No Clutter) */}
            <button
              onClick={() => setShowMobileHub(true)}
              className="flex sm:hidden items-center gap-1 pl-1.5 pr-2 py-1 rounded-xl bg-gradient-to-r from-sakura-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/90 border border-sakura-200/80 dark:border-slate-700/80 text-xs font-bold active:scale-95 transition-all shadow-xs"
              aria-label="Open Student Hub and Settings"
              title="Student Settings Hub"
            >
              <span className="text-base leading-none">{user.avatar}</span>
              <SlidersHorizontal className="w-3.5 h-3.5 text-sakura-600 dark:text-sakura-400" />
            </button>

          </div>
        </div>

        {/* Mobile Level Switcher Rail (Segmented Apple-Style Track) */}
        <div className="md:hidden border-t border-sakura-100/60 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-2 py-1.5">
          <div 
            ref={mobileRailRef}
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-none scroll-smooth py-0.5 px-1"
          >
            {levels.map((lvl) => {
              const isActive = currentLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  data-level-id={lvl.id}
                  onClick={() => onSelectLevel(lvl.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-sakura-500 to-rose-600 text-white shadow-md shadow-sakura-500/25 ring-2 ring-sakura-300/40 dark:ring-sakura-700/40'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 hover:border-sakura-200'
                  }`}
                >
                  <span>{lvl.label}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {lvl.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Student Hub Drawer Sheet */}
      {showMobileHub && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:hidden animate-fadeIn">
          {/* Frosted Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMobileHub(false)}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[32px] p-5 shadow-2xl border-t border-sakura-200 dark:border-slate-800 z-10 max-h-[88vh] overflow-y-auto animate-springPop">
            
            {/* Grab Handle */}
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mb-4" />

            {/* Sheet Header: Student Identity */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sakura-500 to-rose-500 text-white flex items-center justify-center text-2xl shadow-md shadow-sakura-500/25 ring-2 ring-white dark:ring-slate-800">
                  {user.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-black text-base text-slate-800 dark:text-white leading-tight">
                      {user.displayName}
                    </h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-sakura-100 dark:bg-sakura-900/40 text-sakura-700 dark:text-sakura-300">
                      @{user.username}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-sakura-500" />
                    Target: {user.targetLevel} Exam ({user.examTargetDate || '2025/2026'})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowMobileHub(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 active:scale-95"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Capsule */}
            <div className="grid grid-cols-2 gap-2.5 my-4">
              <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500">
                  <Flame className="w-5 h-5 fill-amber-500 text-amber-500 animate-pulse" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">Daily Streak</span>
                  <span className="text-sm font-black text-amber-700 dark:text-amber-300">{streakDays} Days</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-sakura-50/80 dark:bg-sakura-950/30 border border-sakura-200/70 dark:border-sakura-800/40 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sakura-500/10 dark:bg-sakura-500/20 flex items-center justify-center text-sakura-500">
                  <Zap className="w-5 h-5 text-sakura-500 fill-sakura-500" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-sakura-600 dark:text-sakura-400 block">Active Exam</span>
                  <span className="text-sm font-black text-sakura-700 dark:text-sakura-300">{currentLevelObj.shortLabel}</span>
                </div>
              </div>
            </div>

            {/* Quick Settings & Tool Switches */}
            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                Student Preferences
              </span>

              {/* Japanese Voice TTS Test */}
              <button
                onClick={handleTestAudio}
                className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all active:scale-98 ${
                  isPlayingAudio
                    ? 'bg-sakura-50 dark:bg-sakura-950/40 border-sakura-400 text-sakura-700 dark:text-sakura-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isPlayingAudio ? 'bg-sakura-500 text-white animate-pulse' : 'bg-white dark:bg-slate-800 text-sakura-600'
                  }`}>
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block">Japanese Voice (TTS)</span>
                    <span className="text-[11px] text-slate-400">
                      {isPlayingAudio ? 'Speaking Japanese audio...' : 'Tap to test native pronunciation'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-sakura-600 dark:text-sakura-400">
                  {isPlayingAudio ? 'Playing 🔊' : 'Test →'}
                </span>
              </button>

              {/* Falling Sakura Petals Toggle */}
              <button
                onClick={onTogglePetals}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-slate-700 dark:text-slate-200 active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    petalsActive ? 'bg-sakura-100 dark:bg-sakura-900/40 text-sakura-600' : 'bg-white dark:bg-slate-800 text-slate-400'
                  }`}>
                    <Flower2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block">Falling Sakura Petals</span>
                    <span className="text-[11px] text-slate-400">Romantic animated cherry blossoms</span>
                  </div>
                </div>
                <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                  petalsActive ? 'bg-sakura-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    petalsActive ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </div>
              </button>

              {/* Theme Toggle (Day / Night Sakura) */}
              <button
                onClick={onToggleDarkMode}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-slate-700 dark:text-slate-200 active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-amber-500">
                    {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block">Theme Mode</span>
                    <span className="text-[11px] text-slate-400">
                      {isDarkMode ? 'Night Sakura (夜桜 Dark)' : 'Day Sakura (昼桜 Light)'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {isDarkMode ? 'Switch to Day ☀️' : 'Switch to Night 🌙'}
                </span>
              </button>

              {/* Edit Profile Action */}
              <button
                onClick={() => {
                  setShowMobileHub(false);
                  onOpenProfile();
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-slate-700 dark:text-slate-200 active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block">Edit Student Profile</span>
                    <span className="text-[11px] text-slate-400">Update avatar, daily goal & target date</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* VIP License Card & Upgrade Section */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sakura-500/10 via-rose-500/10 to-pink-500/10 dark:from-sakura-950/40 dark:to-slate-850 border border-sakura-200 dark:border-slate-800 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sakura-500 animate-pulse" />
                  <span className="text-xs font-black text-slate-800 dark:text-white">
                    {isAdmin ? '👑 Administrator Hub' : '🌸 Sakura VIP Student Pass'}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sakura-100 dark:bg-sakura-900/60 text-sakura-700 dark:text-sakura-300">
                  {licenseStatus?.hasValidLicense ? (licenseStatus.isTrial ? 'Trial Pass' : 'VIP Active') : 'Pass Needed'}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
                {isAdmin
                  ? 'Manage 30-day student license keys, student activations, and anti-piracy device bindings.'
                  : licenseStatus?.hasValidLicense
                  ? `Unlimited Prometric CBT, LMS Reviewer & Live AI Sensei active (${licenseStatus.timeRemaining?.formatted || `${licenseStatus.daysRemaining}d remaining`}).`
                  : 'Unlock complete JFT & JLPT Mock Exams, 9 LMS Patterns, and Real-Time Voice Assessor for only ₱100.'}
              </p>

              {isAdmin ? (
                <button
                  onClick={() => {
                    setShowMobileHub(false);
                    onOpenAdminHub?.();
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sakura-500 to-pink-600 text-white text-xs font-black shadow-md shadow-sakura-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Open Licensing Hub</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowMobileHub(false);
                    onOpenLicensingModal?.();
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sakura-500 to-rose-600 text-white text-xs font-black shadow-md shadow-sakura-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{licenseStatus?.hasValidLicense ? 'Manage VIP License' : 'Get VIP Pass (₱100)'}</span>
                </button>
              )}
            </div>

            {/* Logout Action */}
            <button
              onClick={() => {
                setShowMobileHub(false);
                onLogout();
              }}
              className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200/80 dark:border-rose-900/50 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Sakura Nihongo</span>
            </button>

          </div>
        </div>
      )}
    </>
  );
};
