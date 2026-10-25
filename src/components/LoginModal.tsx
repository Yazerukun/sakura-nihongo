import React, { useState } from 'react';
import { authenticate } from '../utils/auth';
import { UserProfile } from '../types';
import { KeyRound, Sparkles, User, Eye, EyeOff, Heart, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onSuccess: (profile: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onSuccess }) => {
  const [username, setUsername] = useState('sakura@study.jp');
  const [password, setPassword] = useState('sakura2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const user = authenticate(username, password);
      if (user) {
        onSuccess(user);
      } else {
        setError('Invalid credentials. Check the hint below or use Quick Demo Login.');
      }
      setIsSubmitting(false);
    }, 300);
  };

  const handleQuickDemo = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError('');
    const profile = authenticate(user, pass);
    if (profile) {
      onSuccess(profile);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-sakura-100 dark:border-slate-800 p-8 overflow-hidden transform transition-all animate-float">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sakura-300 via-sakura-500 to-aizome-500" />
        
        {/* Subtle Japanese Watermark */}
        <div className="absolute -right-6 -bottom-6 text-8xl font-serif text-sakura-100/30 dark:text-slate-800/20 select-none pointer-events-none">
          桜
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sakura-50 dark:bg-slate-800 text-sakura-500 mb-3 shadow-inner">
            <span className="text-3xl">🌸</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-white">
            Sakura Nihongo
          </h2>
          <p className="text-xs uppercase tracking-widest text-sakura-600 dark:text-sakura-400 font-medium mt-1">
            桜日本語 • Study & Reviewer Portal
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400 bg-sakura-50/60 dark:bg-slate-800/60 py-1.5 px-3 rounded-full mx-auto w-fit">
            <Heart className="w-3.5 h-3.5 text-sakura-500 fill-sakura-500" />
            <span>Dedicated with love for Ian's girlfriend</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Username / Email
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="sakura@study.jp or girlfriend"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2.5 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 rounded-lg border border-rose-200 dark:border-rose-900">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-sakura-500 to-sakura-600 hover:from-sakura-600 hover:to-sakura-700 shadow-lg shadow-sakura-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Entering Garden...' : 'Enter Study Portal (ログイン)'}</span>
          </button>
        </form>

        {/* Quick 1-Click Login Hints */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 text-center mb-2.5">
            ✨ Quick 1-Click Access for Testing:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('sakura@study.jp', 'sakura2026')}
              className="p-2 text-left bg-sakura-50/70 hover:bg-sakura-100/70 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl border border-sakura-100 dark:border-slate-700 transition-all text-xs group"
            >
              <div className="flex items-center gap-1.5 font-bold text-sakura-700 dark:text-sakura-300">
                <span>🌸 Sakura-chan</span>
                <CheckCircle2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                pass: sakura2026
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('ian', 'love2026')}
              className="p-2 text-left bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 transition-all text-xs group"
            >
              <div className="flex items-center gap-1.5 font-bold text-aizome-700 dark:text-aizome-300">
                <span>👑 Ian (Admin)</span>
                <CheckCircle2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                pass: love2026
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
