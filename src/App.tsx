import React, { useState, useEffect } from 'react';
import { LevelType, StudyMode, UserProfile, StudentLicenseStatus } from './types';
import { getStoredSession, clearSession } from './utils/auth';
import { getStudyStats } from './utils/storage';
import { checkCurrentLicense } from './utils/licensing';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ModuleHeroHeader } from './components/ModuleHeroHeader';
import { UnifiedTelemetryHUD } from './components/UnifiedTelemetryHUD';
import { SakuraCanvas } from './components/SakuraCanvas';
import { LoginModal } from './components/LoginModal';
import { ProfileModal } from './components/ProfileModal';
import { LicenseActivationModal } from './components/LicenseActivationModal';
import { AdminLicensingView } from './components/AdminLicensingView';
import { MobileBottomDock } from './components/MobileBottomDock';
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
  
  // Side Panel state: mobile off-canvas drawer & desktop collapse/rail mode
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsedDesktop, setIsSidebarCollapsedDesktop] = useState(false);

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

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpenMobile(prev => !prev);
    } else {
      setIsSidebarCollapsedDesktop(prev => !prev);
    }
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
        <div className="flex flex-col min-h-screen">
          
          {/* Header */}
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
            onToggleSidebar={handleToggleSidebar}
          />

          {/* App Shell: Left Categorized Side Panel + Right Content Stage */}
          <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative">
            
            {/* Categorized Japanese Study Side Panel */}
            <Sidebar
              currentMode={currentMode}
              onSelectMode={mode => setCurrentMode(mode)}
              targetLevel={currentLevel}
              onSelectLevel={lvl => setCurrentLevel(lvl)}
              user={user}
              licenseStatus={licenseStatus}
              streakDays={stats.streakDays}
              isOpenMobile={isSidebarOpenMobile}
              onCloseMobile={() => setIsSidebarOpenMobile(false)}
              isCollapsedDesktop={isSidebarCollapsedDesktop}
              onToggleCollapseDesktop={() => setIsSidebarCollapsedDesktop(prev => !prev)}
              onOpenUpgrade={() => setShowLicenseModal(true)}
              onOpenProfile={() => setShowProfileModal(true)}
            />

            {/* Right Main Stage (Focused Learning Workspace) */}
            <div className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col">
              
              {/* Sleek Unified Telemetry HUD (Cloudflare Edge + Live Timer + License) */}
              <UnifiedTelemetryHUD
                user={user}
                licenseStatus={licenseStatus}
                onOpenUpgrade={() => setShowLicenseModal(true)}
                onOpenAdminHub={() => setCurrentMode('admin-licensing')}
              />

              {/* Active Module Header (Breadcrumbs, Title & Quick Level Switcher) */}
              <ModuleHeroHeader
                currentMode={currentMode}
                currentLevel={currentLevel}
                onSelectLevel={lvl => setCurrentLevel(lvl)}
                isCollapsedDesktop={isSidebarCollapsedDesktop}
                onToggleCollapseDesktop={() => setIsSidebarCollapsedDesktop(prev => !prev)}
              />

              {/* Active Study Tool Module */}
              <main className="flex-grow pb-24 lg:pb-8">
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

            </div>
          </div>

          {/* Mobile Bottom Dock (Instant Thumb Ergonomics on Smartphones) */}
          <MobileBottomDock
            currentMode={currentMode}
            onSelectMode={mode => setCurrentMode(mode)}
            user={user}
            licenseStatus={licenseStatus}
            onOpenUpgrade={() => setShowLicenseModal(true)}
            onOpenSidebar={() => setIsSidebarOpenMobile(true)}
          />

          {/* Romantic & Japanese Footer */}
          <footer className="py-6 border-t border-sakura-100/70 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm text-center text-xs text-slate-500 dark:text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 font-medium">
                <span>Made with</span>
                <Heart className="w-3.5 h-3.5 text-sakura-500 fill-sakura-500 animate-pulse" />
                <span>by Ian for his girlfriend • 桜日本語 Sakura Nihongo 2025-2026</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official JFT-Basic & JLPT N5-N1 Real-Time System • Cloudflare Pages Live
              </p>
            </div>
          </footer>

        </div>
      )}
    </div>
  );
};

export default App;
