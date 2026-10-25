import React, { useState, useEffect } from 'react';
import { LevelType, StudyMode, UserProfile } from './types';
import { getStoredSession, clearSession, DEFAULT_PROFILES } from './utils/auth';
import { getStudyStats } from './utils/storage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { SakuraCanvas } from './components/SakuraCanvas';
import { LoginModal } from './components/LoginModal';
import { ProfileModal } from './components/ProfileModal';
import { CBTExamSimulator } from './components/CBTExamSimulator';
import { FlashcardDeck } from './components/FlashcardDeck';
import { QuizView } from './components/QuizView';
import { GrammarViewer } from './components/GrammarViewer';
import { VocabExplorer } from './components/VocabExplorer';
import { KanaMaster } from './components/KanaMaster';
import { CheatsheetView } from './components/CheatsheetView';
import { PomodoroTimer } from './components/PomodoroTimer';
import { AnalyticsView } from './components/AnalyticsView';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<LevelType>('JFT');
  const [currentMode, setCurrentMode] = useState<StudyMode>('cbt');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [petalsActive, setPetalsActive] = useState(true);
  const [stats, setStats] = useState(getStudyStats());

  // Check auth session & dark mode on mount
  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      setUser(session);
      setCurrentLevel(session.targetLevel || 'JFT');
    } else {
      setShowLoginModal(true);
    }

    const savedTheme = localStorage.getItem('sakura_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sakura_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sakura_theme', 'light');
    }
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    setCurrentLevel(profile.targetLevel || 'JFT');
    setShowLoginModal(false);
    setStats(getStudyStats());
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setShowLoginModal(true);
  };

  const handleProfileUpdated = (updated: UserProfile) => {
    setUser(updated);
    setCurrentLevel(updated.targetLevel);
  };

  return (
    <div className="min-h-screen flex flex-col bg-washi-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 relative selection:bg-sakura-200 selection:text-sakura-900">
      {/* Falling Sakura Petals Canvas */}
      <SakuraCanvas active={petalsActive} />

      {/* Auth Screen Modal */}
      <LoginModal
        isOpen={showLoginModal || !user}
        onSuccess={handleLoginSuccess}
      />

      {/* Profile Settings Modal */}
      {user && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {/* Main Content when Logged In */}
      {user && (
        <>
          <Header
            user={user}
            currentLevel={currentLevel}
            onSelectLevel={lvl => setCurrentLevel(lvl)}
            streakDays={stats.streakDays}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
            petalsActive={petalsActive}
            onTogglePetals={() => setPetalsActive(!petalsActive)}
            onOpenProfile={() => setShowProfileModal(true)}
            onLogout={handleLogout}
          />

          {/* Navigation Tabs */}
          <Navigation
            currentMode={currentMode}
            onSelectMode={mode => setCurrentMode(mode)}
            targetLevel={currentLevel}
          />

          {/* Active View */}
          <main className="flex-grow">
            {currentMode === 'cbt' && <CBTExamSimulator level={currentLevel} />}
            {currentMode === 'flashcards' && <FlashcardDeck level={currentLevel} />}
            {currentMode === 'quiz' && <QuizView level={currentLevel} />}
            {currentMode === 'grammar' && <GrammarViewer currentLevel={currentLevel} />}
            {currentMode === 'vocab' && <VocabExplorer currentLevel={currentLevel} />}
            {currentMode === 'kana' && <KanaMaster />}
            {currentMode === 'cheatsheet' && <CheatsheetView />}
            {currentMode === 'pomodoro' && <PomodoroTimer user={user} />}
            {currentMode === 'analytics' && <AnalyticsView user={user} />}
          </main>

          {/* Romantic & Japanese Footer */}
          <footer className="mt-16 py-8 border-t border-sakura-100 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm text-center text-xs text-slate-500 dark:text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 font-medium">
                <span>Made with</span>
                <Heart className="w-3.5 h-3.5 text-sakura-500 fill-sakura-500 animate-pulse" />
                <span>by Ian for his girlfriend • 桜日本語 Sakura Nihongo 2025-2026</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official JFT-Basic & JLPT N5-N1 Syllabus • Web Speech Audio • Cloudflare & GitHub Pages Ready
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
