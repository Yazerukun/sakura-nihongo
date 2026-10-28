import React from 'react';
import { LevelType, UserProfile, StudentLicenseStatus } from '../types';
import { Flame, Moon, Sun, Flower2, Volume2, LogOut, Heart, ShieldCheck, Sparkles } from 'lucide-react';
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
  const levels: { id: LevelType; label: string; badge: string }[] = [
    { id: 'JFT', label: 'JFT A2', badge: 'Prometric' },
    { id: 'N5', label: 'JLPT N5', badge: 'Beginner' },
    { id: 'N4', label: 'JLPT N4', badge: 'Official N4' },
    { id: 'N3', label: 'JLPT N3', badge: 'Intermediate' },
    { id: 'N2', label: 'JLPT N2', badge: 'Business' },
    { id: 'N1', label: 'JLPT N1', badge: 'Master' }
  ];

  const handleTestAudio = () => {
    japaneseVoice.speak('桜日本語へようこそ！一緒に勉強しましょう！');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-sakura-100 dark:border-slate-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-sakura-500 to-sakura-400 text-white shadow-md shadow-sakura-500/20">
            <span className="text-xl">🌸</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif font-black text-lg text-slate-800 dark:text-white tracking-tight">
                桜 Sakura Nihongo
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sakura-100 dark:bg-sakura-900/40 text-sakura-700 dark:text-sakura-300">
                2025-2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Japanese Study & JFT/JLPT Master Reviewer
            </p>
          </div>
        </div>

        {/* Level Switcher pills */}
        <div className="hidden md:flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          {levels.map((lvl) => {
            const isActive = currentLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => onSelectLevel(lvl.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-sakura-500 to-sakura-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{lvl.label}</span>
                <span
                  className={`text-[9px] px-1 py-0.2 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}
                >
                  {lvl.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* User Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* STRICT SINGLE ADMIN: Only nihon11 gets the Admin Hub button */}
          {user.username === 'nihon11' ? (
            <button
              onClick={onOpenAdminHub}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-sakura-500 to-pink-600 hover:from-sakura-600 hover:to-pink-700 text-white text-xs font-bold shadow-md shadow-sakura-500/20 active:scale-95 transition-all"
              title="Open Mariel's Student Licensing Hub"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Hub</span>
            </button>
          ) : (
            <button
              onClick={onOpenLicensingModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
                licenseStatus?.hasValidLicense
                  ? licenseStatus.isTrial
                    ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  : 'bg-sakura-500 hover:bg-sakura-600 text-white shadow-sakura-500/25 animate-pulse'
              }`}
              title="View or Activate 30-Day VIP Pass"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">
                {licenseStatus?.hasValidLicense
                  ? licenseStatus.isTrial
                    ? `Trial: ${licenseStatus.timeRemaining?.formatted || '24h'}`
                    : `VIP: ${licenseStatus.timeRemaining?.formatted || `${licenseStatus.daysRemaining}d`}`
                  : 'Get VIP (₱199)'}
              </span>
            </button>
          )}

          {/* Streak Badge */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-sm"
            title="Current Daily Study Streak"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streakDays}d Streak</span>
          </div>

          {/* Test TTS Sound */}
          <button
            onClick={handleTestAudio}
            className="hidden sm:flex p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sakura-600 dark:hover:text-sakura-400 transition-colors"
            title="Test Japanese Voice (TTS)"
            aria-label="Test Japanese audio"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Petals Toggle */}
          <button
            onClick={onTogglePetals}
            className={`hidden sm:flex p-2 rounded-xl transition-colors ${
              petalsActive
                ? 'bg-sakura-100 dark:bg-sakura-900/40 text-sakura-600 dark:text-sakura-300'
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
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sakura-600 dark:hover:text-sakura-400 transition-colors"
            title={isDarkMode ? 'Light Mode (昼桜)' : 'Dark Mode (夜桜)'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-2xl bg-sakura-50 hover:bg-sakura-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-sakura-100 dark:border-slate-700 transition-all text-xs font-semibold"
          >
            <span className="text-base">{user.avatar}</span>
            <span className="text-slate-800 dark:text-slate-200 hidden sm:inline max-w-[90px] truncate">
              {user.displayName.split(' ')[0]}
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Level Switcher */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 gap-1.5 scrollbar-none">
        {levels.map((lvl) => {
          const isActive = currentLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              onClick={() => onSelectLevel(lvl.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-sakura-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {lvl.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
