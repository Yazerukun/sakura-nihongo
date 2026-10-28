import React, { useState, useEffect } from 'react';
import { UserProfile, StudentLicenseStatus } from '../types';
import { getTimeRemainingDetailed } from '../utils/licensing';
import { Clock, Sparkles, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

interface RealTimeStudyCountdownProps {
  user: UserProfile;
  licenseStatus: StudentLicenseStatus;
  onOpenUpgrade: () => void;
  onOpenAdminHub?: () => void;
}

export const RealTimeStudyCountdown: React.FC<RealTimeStudyCountdownProps> = ({
  user,
  licenseStatus,
  onOpenUpgrade,
  onOpenAdminHub
}) => {
  const [, setTick] = useState(0);

  // High-precision live ticker updating every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate live countdown based on expiry timestamp
  const targetExpiry = licenseStatus.expiresAt;
  const timeDetail = targetExpiry 
    ? getTimeRemainingDetailed(targetExpiry) 
    : licenseStatus.timeRemaining || {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        isExpired: false,
        formatted: '00:00:00'
      };

  // If user is admin (nihon11)
  if (user.username === 'nihon11') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 animate-fadeIn">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-sakura-500/10 via-pink-500/10 to-indigo-500/10 dark:from-sakura-950/40 dark:to-indigo-950/40 border border-sakura-200/80 dark:border-sakura-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
            </span>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <span>👑 Administrator Control:</span>
                <span className="text-sakura-600 dark:text-sakura-400">Mariel (nihon11)</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Full licensing authority • Classmates cannot generate keys or access admin settings
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAdminHub}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-sakura-500 hover:bg-sakura-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Open Licensing Center</span>
          </button>
        </div>
      </div>
    );
  }

  // If user is a student (classmate)
  const isTrial = licenseStatus.isTrial;
  const isExpired = timeDetail.isExpired || (!licenseStatus.hasValidLicense && !isTrial);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 animate-fadeIn">
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
          isExpired
            ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
            : isTrial
            ? 'bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-amber-50/90 dark:from-amber-950/40 dark:to-orange-950/30 border-amber-200 dark:border-amber-800/60'
            : 'bg-gradient-to-r from-emerald-50/90 via-teal-50/80 to-emerald-50/90 dark:from-emerald-950/40 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800/60'
        }`}
      >
        {/* Left Side: Status & Label */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${
              isExpired
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300'
                : isTrial
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300'
            }`}
          >
            <Clock className="w-5 h-5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isExpired ? 'bg-rose-400' : isTrial ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isExpired ? 'bg-rose-500' : isTrial ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                ></span>
              </span>

              <span
                className={`text-xs font-black uppercase tracking-wider ${
                  isExpired
                    ? 'text-rose-700 dark:text-rose-300'
                    : isTrial
                    ? 'text-amber-800 dark:text-amber-300'
                    : 'text-emerald-800 dark:text-emerald-300'
                }`}
              >
                {isExpired
                  ? 'Access Expired'
                  : isTrial
                  ? '⚡ 24-Hour Instant Access Active'
                  : '🌸 1-Month VIP Pass Active'}
              </span>

              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200/40 dark:border-slate-700/40">
                Target: {user.targetLevel}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              {isExpired
                ? 'Your access has ended. Contact Mariel on Messenger to renew your 30-Day VIP Pass.'
                : isTrial
                ? 'Real-time countdown ticking! Upgrade to 1-Month VIP for unlimited CBT exams & audio.'
                : `Student: ${user.displayName} • Single-device protected access.`}
            </p>
          </div>
        </div>

        {/* Right Side: Live Digital Running Clock & Upgrade Button */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {!isExpired && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700 font-mono shadow-inner text-xs sm:text-sm font-black text-slate-800 dark:text-white">
              {timeDetail.days > 0 && (
                <div className="flex items-baseline">
                  <span className="text-sakura-600 dark:text-sakura-400">{timeDetail.days}</span>
                  <span className="text-[10px] text-slate-400 mr-1.5">d</span>
                </div>
              )}
              <div className="flex items-baseline">
                <span>{timeDetail.hours.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-slate-400 mr-1">h</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">:</span>
              <div className="flex items-baseline">
                <span>{timeDetail.minutes.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-slate-400 mr-1">m</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">:</span>
              <div className="flex items-baseline">
                <span className="text-sakura-500 dark:text-sakura-400 animate-pulse">
                  {timeDetail.seconds.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400">s</span>
              </div>
            </div>
          )}

          <button
            onClick={onOpenUpgrade}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all ${
              isExpired
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : isTrial
                ? 'bg-gradient-to-r from-sakura-500 to-pink-600 hover:from-sakura-600 hover:to-pink-700 text-white shadow-sakura-500/20'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isExpired ? 'Renew Pass (₱199)' : isTrial ? 'Get 30-Day VIP (₱199)' : 'License Details'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
