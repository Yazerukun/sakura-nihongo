import React, { useState, useEffect } from 'react';
import { getTodayQuote, recordStudySession } from '../utils/storage';
import { UserProfile } from '../types';
import { Timer, Play, Pause, RotateCcw, Heart, Bell, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PomodoroTimerProps {
  user: UserProfile;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ user }) => {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [isRunning, setIsRunning] = useState(false);
  const quote = getTodayQuote();

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playZenBell();
      if (mode === 'focus') {
        recordStudySession(25, 0, 0);
        confetti({ particleCount: 60, spread: 70 });
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const playZenBell = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, audioCtx.currentTime); // 528 Hz Zen chime
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 2.5);
    } catch {
      // Audio fallback
    }
  };

  const toggleRun = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const total = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progressPct = ((total - timeLeft) / total) * 100;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Daily Kotowaza / Proverb Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-tr from-sakura-50/70 to-washi-50 dark:from-slate-800/60 dark:to-slate-900 border border-sakura-100 dark:border-slate-800 shadow-sm mb-6 text-center">
        <div className="text-[10px] font-bold uppercase tracking-widest text-sakura-600 dark:text-sakura-400 mb-1 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Today's Japanese Proverb • ことわざ</span>
        </div>
        <div className="text-xl font-serif font-black text-slate-800 dark:text-white mb-1">
          {quote.japanese}
        </div>
        <div className="text-xs font-mono text-slate-400 mb-1">{quote.romaji}</div>
        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          "{quote.meaning}"
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xl text-center relative overflow-hidden">
        {/* Mode Selector */}
        <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-fit mx-auto mb-6">
          <button
            onClick={() => switchMode('focus')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'focus'
                ? 'bg-sakura-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            🌸 Focus (25m)
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'break'
                ? 'bg-matcha-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            🍵 Short Break (5m)
          </button>
        </div>

        {/* Circular / Large Digital Clock */}
        <div className="relative my-4">
          <div className="text-6xl sm:text-7xl font-mono font-black text-slate-800 dark:text-white tracking-tight">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
          <div className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-widest">
            {mode === 'focus' ? 'Deep Study Session' : 'Rest your eyes & drink water'}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs mx-auto h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden my-6">
          <div
            className={`h-full transition-all duration-300 ${
              mode === 'focus' ? 'bg-sakura-500' : 'bg-matcha-500'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={toggleRun}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg flex items-center gap-2 transition-all active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                : 'bg-sakura-500 hover:bg-sakura-600 shadow-sakura-500/25'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={playZenBell}
            className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Ring Zen Bell"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {/* Sweet note from Ian */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-sakura-500 fill-sakura-500" />
          <span>{user.sweetNote}</span>
        </div>
      </div>
    </div>
  );
};
