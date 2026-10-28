import React, { useState, useEffect } from 'react';
import { LevelType, StudyMode, UserProfile, StudentLicenseStatus } from './types';
import { getStoredSession, clearSession } from './utils/auth';
import { getStudyStats } from './utils/storage';
import { checkCurrentLicense } from './utils/licensing';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { SakuraCanvas } from './components/SakuraCanvas';
import { LoginModal } from './components/LoginModal';
import { ProfileModal } from './components/ProfileModal';
import { LicenseActivationModal } from './components/LicenseActivationModal';
import { AdminLicensingView } from './components/AdminLicensingView';
import { RealTimeStudyCountdown } from './components/RealTimeStudyCountdown';
import { CBTExamSimulator } from './components/CBTExamSimulator';
import { LMSReviewer } from './components/LMSReviewer';
import { RealTimeVoiceTrainer } from './components/RealTimeVoiceTrainer';
import { RealTimeAITutor } from './components/RealTimeAITutor';
import { FlashcardDeck } from './components/FlashcardDeck';
import { QuizView } from './components/QuizView';
import { GrammarViewer } from './components/GrammarViewer';
import { VocabExplorer } from './components/VocabExplorer';
import { KanaMaster } from './components/KanaMaster';
import { CheatsheetView } from './components/CheatsheetView';
import { PomodoroTimer } from './components/PomodoroTimer';
import { AnalyticsView } from './components/AnalyticsView';
import { Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState<StudentLicenseStatus>(checkCurrentLicense(null));
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
      setLicenseStatus(checkCurrentLicense(session));
      // STRICT SINGLE ADMIN GATE: Only nihon11 starts in Admin Hub
      if (session.username === 'nihon11') {
        setCurrentMode('admin-licensing');
      } else {
        setCurrentMode('cbt');
      }
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
    setLicenseStatus(checkCurrentLicense(profile));
    // STRICT SINGLE ADMIN GATE: Only nihon11 starts in Admin Hub
    if (profile.username === 'nihon11') {
      setCurrentMode('admin-licensing');
    } else {
      setCurrentMode('cbt');
    }
  };

  // Route security guard: force students out of admin view if attempted
  useEffect(() => {
    if (user && user.username !== 'nihon11' && currentMode === 'admin-licensing') {
      setCurrentMode('cbt');
    }
  }, [user, currentMode]);

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setShowLoginModal(true);
  };

  const handleProfileUpdated = (updated: UserProfile) => {
    setUser(updated);
    setCurrentLevel(updated.targetLevel);
  };

  const handleRefreshLicense = () => {
    setLicenseStatus(checkCurrentLicense(user));
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

      {/* 30-Day Student License Activation Modal */}
      <LicenseActivationModal
        isOpen={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
        user={user}
        onLicenseUpdated={handleRefreshLicense}
      />

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
            onOpenLicensingModal={() => setShowLicenseModal(true)}
            onOpenAdminHub={() => setCurrentMode('admin-licensing')}
            licenseStatus={licenseStatus}
          />

          {/* Real-time Indicator banner */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3">
            <div className="p-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-emerald-200/70 dark:border-emerald-900/50 flex items-center justify-between text-xs shadow-sm">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  Real-Time Mode Active:
                </span>
                <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
                  Live voice speech recognition, real-time AI tutor & official timed CBT testing
                </span>
              </div>
              <div className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                Cloudflare Edge Connected ⚡
              </div>
            </div>
          </div>

          {/* Real-time Running Countdown Study Timer Banner */}
          <RealTimeStudyCountdown
            user={user}
            licenseStatus={licenseStatus}
            onOpenUpgrade={() => setShowLicenseModal(true)}
            onOpenAdminHub={() => setCurrentMode('admin-licensing')}
          />

          {/* Navigation Tabs */}
          <Navigation
            currentMode={currentMode}
            onSelectMode={mode => setCurrentMode(mode)}
            targetLevel={currentLevel}
            user={user}
          />

          {/* Active View */}
          <main className="flex-grow">
            {currentMode === 'admin-licensing' && user.username === 'nihon11' && (
              <AdminLicensingView user={user} />
            )}
            {currentMode === 'lms' && <LMSReviewer level={currentLevel} />}
            {currentMode === 'cbt' && <CBTExamSimulator level={currentLevel} user={user} />}
            {currentMode === 'realtime-voice' && <RealTimeVoiceTrainer level={currentLevel} />}
            {currentMode === 'ai-tutor' && <RealTimeAITutor level={currentLevel} />}
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
                Official JFT-Basic & JLPT N5-N1 Real-Time System • Cloudflare & GitHub Pages Live
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
