import React, { useState, useEffect } from 'react';
import { UserProfile, StudentLicenseStatus } from '../types';
import { getTimeRemainingDetailed } from '../utils/licensing';
import { 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Zap, 
  ChevronUp, 
  ChevronDown,
  Wifi,
  Sparkle
} from 'lucide-react';

interface UnifiedTelemetryHUDProps {
  user: UserProfile;
  licenseStatus: StudentLicenseStatus;
  onOpenUpgrade: () => void;
  onOpenAdminHub?: () => void;
}

export const UnifiedTelemetryHUD: React.FC<UnifiedTelemetryHUDProps> = ({
  user,
  licenseStatus,
  onOpenUpgrade,
  onOpenAdminHub
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [, setTick] = useState(0);

  // High-precision live ticker updating every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isAdmin = user.username === 'nihon11';

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

  const isTrial = licenseStatus.isTrial;
  const isExpired = timeDetail.isExpired || (!licenseStatus.hasValidLicense && !isTrial);
  const isLifetime = (licenseStatus.daysRemaining && licenseStatus.daysRemaining > 365) || (licenseStatus.license?.planDurationDays && licenseStatus.license.planDurationDays >= 900);
  const isOneWeek = !isLifetime && !isTrial && licenseStatus.license?.planDurationDays === 7;
  const isTwoWeeks = !isLifetime && !isTrial && licenseStatus.license?.planDurationDays === 14;

  // Minimized Compact Ribbon
  if (isMinimized) {
    return (
      <div className="mb-4 animate-fadeIn select-none">
        <div className="px-3.5 py-1.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
              {isAdmin ? '👑 Admin Active' : isLifetime ? '👑 Lifetime VIP' : isExpired ? '⚠️ Access Expired' : `⏳ ${timeDetail.formatted} remaining`}
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">• Cloudflare Edge ⚡</span>
          </div>

          <div className="flex items-center gap-2">
            {!isAdmin && !isLifetime && (
              <button
                onClick={onOpenUpgrade}
                className="text-[11px] font-bold text-sakura-600 dark:text-sakura-400 hover:underline"
              >
                {isExpired ? 'Renew Pass (₱100)' : 'Extend Pass'}
              </button>
            )}
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Expand telemetry panel"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin View (nihon11)
  if (isAdmin) {
    return (
      <div className="mb-4 sm:mb-5 animate-fadeIn select-none">
        <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-sakura-500/10 to-indigo-500/10 dark:from-pink-950/40 dark:to-indigo-950/40 border border-pink-200/80 dark:border-pink-900/60 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800 dark:text-white">
                  Administrator Authority: Mariel (nihon11)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300">
                  Full Licensing Access
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Generate 30-day student VIP passes, manage device locks, and review real-time student activity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdminHub}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-sakura-600 text-white text-xs font-bold shadow-sm hover:from-pink-700 hover:to-sakura-700 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Licensing Hub</span>
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Minimize banner"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Student Telemetry Bar
  return (
    <div className="mb-4 sm:mb-5 animate-fadeIn select-none">
      <div
        className={`p-3 sm:p-3.5 rounded-2xl border shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
          isExpired
            ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-900/60'
            : isLifetime
            ? 'bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-indigo-500/10 dark:from-amber-950/30 dark:to-indigo-950/30 border-amber-300/80 dark:border-amber-700/60'
            : isTrial
            ? 'bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 dark:from-amber-950/30 dark:to-orange-950/20 border-amber-200/80 dark:border-amber-800/60'
            : 'bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-emerald-50/90 dark:from-emerald-950/30 dark:to-teal-950/20 border-emerald-200/80 dark:border-emerald-800/60'
        }`}
      >
        {/* Left Side: Status & Edge Connectivity */}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
              isExpired
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300'
                : isLifetime
                ? 'bg-gradient-to-tr from-amber-400 to-amber-500 text-white shadow-sm'
                : isTrial
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300'
            }`}
          >
            {isLifetime ? <Sparkles className="w-4 h-4" /> : <Clock className="w-4 h-4 animate-pulse" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isExpired ? 'bg-rose-400' : isLifetime ? 'bg-amber-400' : isTrial ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isExpired ? 'bg-rose-500' : isLifetime ? 'bg-amber-500' : isTrial ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
              </span>

              <span
                className={`text-xs font-black uppercase tracking-wider ${
                  isExpired
                    ? 'text-rose-700 dark:text-rose-300'
                    : isLifetime
                    ? 'text-amber-800 dark:text-amber-300'
                    : isTrial
                    ? 'text-amber-800 dark:text-amber-300'
                    : 'text-emerald-800 dark:text-emerald-300'
                }`}
              >
                {isExpired
                  ? 'Access Expired'
                  : isLifetime
                  ? '👑 Lifetime VIP Pass Active'
                  : isOneWeek
                  ? '⚡ 1-Week Sprint Pass'
                  : isTwoWeeks
                  ? '⚡ 2-Week Exam Rush Pass'
                  : isTrial
                  ? '⚡ 24-Hour Instant Access'
                  : '🌸 1-Month VIP Pass'}
              </span>

              <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                Target: {user.targetLevel}
              </span>

              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold hidden sm:inline">
                ⚡ Cloudflare Edge
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              {isExpired
                ? 'Your access has ended. Contact Mariel on Messenger to renew your VIP Pass (from ₱100).'
                : isLifetime
                ? 'Permanent unrestricted access across all Prometric CBT tests, 9 LMS patterns & AI Sensei.'
                : isTrial
                ? 'Real-time countdown ticking! Upgrade to VIP (from ₱100) for unlimited CBT exams & audio.'
                : `Student: ${user.displayName} • Single-device protected session.`}
            </p>
          </div>
        </div>

        {/* Right Side: Countdown Clock & Action Button */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 pt-2 sm:pt-0 border-t border-slate-200/50 dark:border-slate-800/50 md:border-t-0">
          {!isExpired && (
            isLifetime ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white font-mono shadow-xs text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>∞ Permanent</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700/80 font-mono shadow-2xs text-xs font-black text-slate-800 dark:text-white">
                {timeDetail.days > 0 && (
                  <span className="text-sakura-600 dark:text-sakura-400 font-extrabold mr-1">
                    {timeDetail.days}d
                  </span>
                )}
                <span>{timeDetail.hours.toString().padStart(2, '0')}</span>
                <span className="text-slate-300 dark:text-slate-600">:</span>
                <span>{timeDetail.minutes.toString().padStart(2, '0')}</span>
                <span className="text-slate-300 dark:text-slate-600">:</span>
                <span className="text-sakura-500 dark:text-sakura-400 font-extrabold">
                  {timeDetail.seconds.toString().padStart(2, '0')}
                </span>
              </div>
            )
          )}

          {/* Upgrade / Manage Button */}
          <button
            onClick={onOpenUpgrade}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5 ${
              isExpired
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : isTrial || !licenseStatus.hasValidLicense
                ? 'bg-gradient-to-r from-sakura-500 to-rose-600 text-white shadow-sakura-500/20'
                : 'bg-white dark:bg-slate-800 hover:bg-sakura-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{isExpired ? 'Renew VIP (₱100)' : !licenseStatus.hasValidLicense || isTrial ? 'Get VIP (₱100)' : 'Manage'}</span>
          </button>

          {/* Minimize button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Minimize banner"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
