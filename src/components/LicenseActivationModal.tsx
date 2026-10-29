import React, { useState } from 'react';
import { activateLicense, checkCurrentLicense } from '../utils/licensing';
import { UserProfile, StudentLicenseStatus } from '../types';
import { KeyRound, ShieldCheck, Sparkles, CheckCircle2, AlertCircle, X, Smartphone, Clock, Copy, Check } from 'lucide-react';

interface LicenseActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLicenseUpdated: () => void;
}

export const LicenseActivationModal: React.FC<LicenseActivationModalProps> = ({
  isOpen,
  onClose,
  user,
  onLicenseUpdated
}) => {
  const [code, setCode] = useState('');
  const [studentName, setStudentName] = useState(user?.displayName || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentStatus: StudentLicenseStatus = checkCurrentLicense(user);

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = activateLicense(code, studentName);
      if (res.success) {
        setSuccess(res.message);
        setCode('');
        onLicenseUpdated();
      } else {
        setError(res.message);
      }
      setIsSubmitting(false);
    }, 300);
  };

  const handleCopyCode = (licCode: string) => {
    navigator.clipboard.writeText(licCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-sakura-100 dark:border-slate-800 p-6 sm:p-8 overflow-hidden max-h-[92vh] overflow-y-auto animate-springPop">
        {/* Mobile Grab Handle */}
        <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mb-4 sm:hidden" />

        {/* Top Decorative Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sakura-400 via-pink-500 to-sakura-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sakura-50 dark:bg-slate-800 text-sakura-500 mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-800 dark:text-white">
            Sakura Nihongo VIP License
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official 30-Day Access & Device Security Hub
          </p>
        </div>

        {/* Trial Status Display */}
        {currentStatus.isTrial && currentStatus.hasValidLicense && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
                <span className="font-bold text-sm text-amber-800 dark:text-amber-300">
                  24-Hour Demo Trial Active
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500 text-white">
                {currentStatus.timeRemaining?.formatted || 'Ticking Live'}
              </span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              Your account has 24 hours of real-time trial access. Enter your personal 30-day voucher code below to upgrade to the official 1-Month VIP pass!
            </p>
          </div>
        )}

        {/* Active Status Display */}
        {currentStatus.hasValidLicense && currentStatus.license && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-slate-800 dark:text-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
                  1-Month VIP Pass Active
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white">
                {currentStatus.daysRemaining} Days Left
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-200/60 dark:border-emerald-800/40">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Student:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {currentStatus.license.studentName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Expires On:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {currentStatus.license.expiresAt
                    ? new Date(currentStatus.license.expiresAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : '30 Days'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-mono">
                <span>Code:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {currentStatus.license.code}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyCode(currentStatus.license!.code)}
                className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-300 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Bound Device: {currentStatus.license.boundDeviceName || 'Current Device'}</span>
            </div>
          </div>
        )}

        {/* Device Locked Warning */}
        {currentStatus.isLockedToOtherDevice && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Device Security Lock</span>
            </div>
            <p>
              This license key is locked to another device ({currentStatus.lockedDeviceName || 'Other Device'}).
              To prevent sharing, each 1-month license is bound to one device.
            </p>
            <p className="font-medium text-amber-900 dark:text-amber-100">
              👉 If you switched to a new phone or laptop, please message <strong>Mariel</strong> to reset your device binding.
            </p>
          </div>
        )}

        {/* Error / Success Feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{success}</span>
          </div>
        )}

        {/* Activation / Renewal Form */}
        <form onSubmit={handleActivate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {currentStatus.hasValidLicense ? 'Extend / Enter New License Code' : 'Enter 30-Day License Key'}
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="SAKURA-30D-XXXX-YYYY"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-sakura-400 transition-all"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Format: SAKURA-30D-XXXX-YYYY (Provided by Mariel via Messenger / GCash)
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Your Full Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Angelica Ramos"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sakura-500 to-sakura-600 hover:from-sakura-600 hover:to-sakura-700 shadow-lg shadow-sakura-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Verifying Key...' : currentStatus.hasValidLicense ? 'Extend 30 Days' : 'Activate 30-Day VIP Pass'}</span>
          </button>
        </form>

        {/* Pricing & Onboarding Instructions */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">
              ✨ Official Student VIP Tiers
            </span>
            <span className="text-[11px] text-slate-400">GCash Instant Activation</span>
          </div>

          {/* 3 Tier Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 2 Weeks / ₱100 */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-1.5 shadow-sm">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-white text-xs">2 Weeks Rush</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">14 Days</span>
                </div>
                <div className="font-black text-base text-slate-900 dark:text-white mt-1">
                  ₱100
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  Sprint review right before your CBT exam date
                </p>
              </div>
            </div>

            {/* 1 Month / ₱199 (Popular) */}
            <div className="p-3 rounded-2xl bg-sakura-50/70 dark:bg-sakura-950/30 border-2 border-sakura-400/80 dark:border-sakura-600 flex flex-col justify-between space-y-1.5 shadow-sm relative">
              <span className="absolute -top-2.5 right-3 text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-sakura-500 to-pink-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                Most Popular
              </span>
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sakura-800 dark:text-sakura-200 text-xs">1-Month Pass</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sakura-100 text-sakura-700 dark:bg-sakura-900/60 dark:text-sakura-300">30 Days</span>
                </div>
                <div className="font-black text-base text-sakura-600 dark:text-sakura-400 mt-1">
                  ₱199
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                  Full JFT & N4 mastery with Edge Audio & SRS cards
                </p>
              </div>
            </div>

            {/* Lifetime / ₱499 (Best Value) */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-pink-500/10 to-indigo-500/10 dark:from-amber-950/30 dark:to-indigo-950/30 border-2 border-amber-300/80 dark:border-amber-700/80 flex flex-col justify-between space-y-1.5 shadow-sm relative">
              <span className="absolute -top-2.5 right-3 text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                Best Value
              </span>
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 dark:text-amber-200 text-xs">👑 Lifetime VIP</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">No Expiry</span>
                </div>
                <div className="font-black text-base text-amber-600 dark:text-amber-400 mt-1">
                  ₱499
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                  Permanent access across all levels: N5, N4, N3, N2, N1 & JFT
                </p>
              </div>
            </div>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed pt-1">
            Send <strong>₱100</strong> (2 Weeks), <strong>₱199</strong> (1 Month), or <strong>₱499</strong> (Lifetime) via GCash to <strong>Mariel</strong> on Messenger to receive your personal activation voucher code instantly!
          </p>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span>🌸</span>
              <span><strong>Full JFT-Basic A2 & JLPT N5–N1:</strong> 720+ authentic CBT questions & explanations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🔊</span>
              <span><strong>Cloudflare Edge Audio:</strong> Real-time Japanese listening dialogues & pronunciation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>📜</span>
              <span><strong>Official Certificates:</strong> IRT scoring, single-device lock, & downloadable pass cards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
