import React, { useState } from 'react';
import { authenticate, registerUser } from '../utils/auth';
import { activateLicense } from '../utils/licensing';
import { UserProfile, LevelType } from '../types';
import { KeyRound, Sparkles, User, Eye, EyeOff, Heart, UserPlus, LogIn, CheckCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onSuccess: (profile: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login Form State (starts completely blank, no credentials leaked)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLicenseKey, setRegLicenseKey] = useState('');
  const [regTargetLevel, setRegTargetLevel] = useState<LevelType>('JFT');
  const [regAvatar, setRegAvatar] = useState('🌸');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Always reset to clean login view whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      setMode('login');
      setError('');
      setSuccessMsg('');
      setUsername('');
      setPassword('');
      setRegName('');
      setRegUsername('');
      setRegPassword('');
      setRegLicenseKey('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const user = authenticate(username, password);
      if (user) {
        onSuccess(user);
      } else {
        setError('Incorrect username or password. Please try again.');
      }
      setIsSubmitting(false);
    }, 250);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const result = registerUser({
        username: regUsername,
        password: regPassword,
        displayName: regName,
        avatar: regAvatar,
        targetLevel: regTargetLevel
      });

      if (result.success && result.profile) {
        if (regLicenseKey.trim()) {
          activateLicense(regLicenseKey.trim(), regName);
        }
        setSuccessMsg('Account created successfully! Entering portal...');
        setTimeout(() => {
          onSuccess(result.profile!);
        }, 400);
      } else {
        setError(result.error || 'Failed to create account.');
      }
      setIsSubmitting(false);
    }, 250);
  };

  const avatars = ['🌸', '🦊', '🍙', '🍵', '🐱', '🎋', '⛩️', '🍡'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-sakura-100 dark:border-slate-800 p-8 overflow-hidden transition-all max-h-[92vh] overflow-y-auto">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sakura-300 via-sakura-500 to-aizome-500" />
        
        {/* Subtle Japanese Watermark */}
        <div className="absolute -right-6 -bottom-6 text-8xl font-serif text-sakura-100/30 dark:text-slate-800/20 select-none pointer-events-none">
          桜
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sakura-50 dark:bg-slate-800 text-sakura-500 mb-3 shadow-inner">
            <span className="text-3xl">{mode === 'login' ? '🌸' : regAvatar}</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-white">
            Sakura Nihongo
          </h2>
          <p className="text-xs uppercase tracking-widest text-sakura-600 dark:text-sakura-400 font-medium mt-1">
            桜日本語 • Study & Reviewer Portal
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400 bg-sakura-50/60 dark:bg-slate-800/60 py-1.5 px-3 rounded-full mx-auto w-fit">
            <Heart className="w-3.5 h-3.5 text-sakura-500 fill-sakura-500" />
            <span>Dedicated Japanese Learning Platform</span>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 mb-6 relative z-10">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In (ログイン)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account (新規登録)</span>
          </button>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="mb-4 p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-900 font-medium animate-fadeIn">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-900 font-medium flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Mode: Log In Form */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400 transition-all"
                  required
                  autoFocus
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
                  placeholder="Enter your password"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-sakura-500 to-sakura-600 hover:from-sakura-600 hover:to-sakura-700 shadow-lg shadow-sakura-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Entering Portal...' : 'Enter Study Portal (ログイン)'}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="text-xs text-sakura-600 dark:text-sakura-400 hover:underline font-medium"
              >
                Don't have an account? Create one here →
              </button>
            </div>
          </form>
        )}

        {/* Mode: Register New Account Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 relative z-10">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Your Full Name or Nickname
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Maria, Kenji, or Sakura"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Choose Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="e.g. maria2026"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Create Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Enter a secure password"
                  className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Target Exam
                </label>
                <select
                  value={regTargetLevel}
                  onChange={(e) => setRegTargetLevel(e.target.value as LevelType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-sakura-400 transition-all"
                >
                  <option value="JFT">JFT-Basic (A2)</option>
                  <option value="N4">JLPT N4</option>
                  <option value="N5">JLPT N5</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Choose Avatar
                </label>
                <div className="flex gap-1 overflow-x-auto py-1">
                  {avatars.slice(0, 5).map(a => (
                    <button
                      type="button"
                      key={a}
                      onClick={() => setRegAvatar(a)}
                      className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center border transition-all ${
                        regAvatar === a
                          ? 'bg-sakura-100 border-sakura-500 scale-105 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                VIP License Voucher (Optional)
              </label>
              <input
                type="text"
                value={regLicenseKey}
                onChange={(e) => setRegLicenseKey(e.target.value.toUpperCase())}
                placeholder="e.g. SAKURA-30D-XXXX-YYYY (From Mariel)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-sakura-400 transition-all placeholder:font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-3"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering Account...' : 'Create Account & Start Learning'}</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-xs text-slate-500 dark:text-slate-400 hover:underline font-medium"
              >
                Already have an account? Log In →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
