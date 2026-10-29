import React, { useState, useEffect } from 'react';
import { UserProfile, LicenseRecord, LicensingStats } from '../types';
import { 
  getLicenses, 
  generateLicenseKey, 
  extendLicense, 
  resetDeviceBinding, 
  toggleRevokeLicense, 
  deleteLicense, 
  getLicensingStats,
  getDaysRemaining
} from '../utils/licensing';
import { getRegisteredUsers, RegisteredUserRecord } from '../utils/auth';
import { 
  ShieldCheck, 
  KeyRound, 
  Users, 
  Coins, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Copy, 
  Check, 
  Plus, 
  RotateCcw, 
  Ban, 
  Trash2, 
  Search, 
  Download, 
  Send, 
  Smartphone, 
  Sparkles,
  Calendar,
  UserCheck
} from 'lucide-react';

interface AdminLicensingViewProps {
  user: UserProfile;
}

export const AdminLicensingView: React.FC<AdminLicensingViewProps> = ({ user }) => {
  // STRICT SECURITY GATE: Only nihon11 can ever view or interact with this view
  if (user.username !== 'nihon11') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center space-y-3 animate-fadeIn">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 flex items-center justify-center">
          <Ban className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold font-serif text-rose-900 dark:text-rose-100">
          Access Restricted • Student Account
        </h2>
        <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
          Classmates do not have permission to generate license voucher keys or manage subscriptions. Only the administrator (<strong>nihon11</strong>) can access this center.
        </p>
      </div>
    );
  }

  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [stats, setStats] = useState<LicensingStats>({
    totalLicenses: 0,
    activeLicenses: 0,
    unusedLicenses: 0,
    expiredLicenses: 0,
    estimatedRevenue: 0
  });
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUserRecord[]>([]);

  // Generator form state
  const [studentName, setStudentName] = useState('');
  const [planDays, setPlanDays] = useState(30);
  const [pricePaid, setPricePaid] = useState(199);
  const [notes, setNotes] = useState('');
  
  // UI filter & search state
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'unused' | 'expired'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeViewMode, setActiveViewMode] = useState<'licenses' | 'users'>('licenses');

  // Copy feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedInvite, setCopiedInvite] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<LicenseRecord | null>(null);

  const refreshData = () => {
    const list = getLicenses();
    setLicenses(list);
    setStats(getLicensingStats());
    setRegisteredUsers(getRegisteredUsers());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    const newLic = generateLicenseKey({
      studentName: studentName.trim(),
      durationDays: planDays,
      pricePaid: Number(pricePaid) || 199,
      notes: notes.trim() || `GCash ₱${pricePaid} - 1 Month VIP`,
      adminUser: user
    });

    setNewlyCreatedKey(newLic);
    setStudentName('');
    setNotes('');
    refreshData();
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyMessengerInvite = (lic: LicenseRecord) => {
    const isLife = lic.planDurationDays >= 900;
    const planName = isLife 
      ? '👑 Lifetime VIP Pass (No Expiration)' 
      : lic.planDurationDays === 14 
      ? '⚡ 2-Week Exam Rush Pass' 
      : `${lic.planDurationDays}-Day VIP Access`;

    const inviteText = `🌸 Sakura Nihongo VIP Access 🌸
Hi ${lic.studentName}! Here is your ${planName} Voucher Code:
👉 ${lic.code}

🔗 Website: https://sakura-nihongo.pages.dev
✨ Unlocked Features:
• 720 Authentic Prometric-style CBT Questions (JFT-Basic A2 & JLPT N4)
• Cloudflare Edge Audio Speech for Listening & Pronunciation
• 3D Spaced Repetition (SRS) Flashcards & Cheatsheets
• Official IRT Scaled Scoring & Passing Certificate
${isLife ? '• 👑 Permanent Lifetime Access across all JLPT levels (N5, N4, N3, N2, N1 + JFT)\n' : ''}
Open the link, click "Activate VIP" and paste your code! Ganbatte kudasai! 🎌✨`;

    navigator.clipboard.writeText(inviteText);
    setCopiedInvite(lic.id);
    setTimeout(() => setCopiedInvite(null), 2500);
  };

  const handleExtend = (id: string) => {
    extendLicense(id, 30);
    refreshData();
  };

  const handleResetDevice = (id: string) => {
    if (confirm('Reset device lock for this student? They will be able to bind a new phone/laptop.')) {
      resetDeviceBinding(id);
      refreshData();
    }
  };

  const handleToggleRevoke = (id: string) => {
    toggleRevokeLicense(id);
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Permanently delete this license record?')) {
      deleteLicense(id);
      refreshData();
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Code', 'Student Name', 'Duration (Days)', 'Price (PHP)', 'Status', 'Days Left', 'Bound Device', 'Activated At', 'Expires At', 'Notes'];
    const rows = licenses.map(l => [
      l.id,
      l.code,
      `"${l.studentName.replace(/"/g, '""')}"`,
      l.planDurationDays,
      l.pricePaid,
      l.status,
      getDaysRemaining(l.expiresAt),
      `"${(l.boundDeviceName || 'Unbound').replace(/"/g, '""')}"`,
      l.activatedAt || 'N/A',
      l.expiresAt || 'N/A',
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sakura_nihongo_licenses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered list
  const filteredLicenses = licenses.filter(lic => {
    const matchesSearch = 
      lic.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lic.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lic.notes && lic.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'active') return lic.status === 'active';
    if (activeTab === 'unused') return lic.status === 'unused';
    if (activeTab === 'expired') return lic.status === 'expired' || lic.status === 'revoked';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sakura-600 via-pink-600 to-aizome-600 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
                👑 Admin Licensing Hub
              </span>
              <span className="text-xs text-white/80">
                Logged in as <strong className="underline decoration-sakura-300">{user.username}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
              Mariel's Student Licensing & Business Center
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-2xl">
              Manage 1-month subscriptions, generate Prometric CBT access keys, and monitor active student licenses with device-lock anti-sharing protection.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              title="Download CSV Spreadsheet"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Decorative sakura petals in background */}
        <div className="absolute -right-8 -bottom-10 text-9xl font-serif opacity-15 pointer-events-none select-none">
          桜
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Licenses */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Active Subscribers
            </span>
            <div className="text-2xl font-black text-slate-800 dark:text-white">
              {stats.activeLicenses}
              <span className="text-xs font-normal text-emerald-600 ml-1.5 font-bold">Students</span>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Total Revenue
            </span>
            <div className="text-2xl font-black text-slate-800 dark:text-white">
              ₱{stats.estimatedRevenue.toLocaleString()}
              <span className="text-xs font-normal text-slate-400 ml-1.5 font-medium">PHP</span>
            </div>
          </div>
        </div>

        {/* Unused Keys Ready to Give */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-sakura-200 dark:border-sakura-900/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sakura-50 dark:bg-sakura-950/40 text-sakura-600 dark:text-sakura-400 flex items-center justify-center flex-shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Ready / Unused Keys
            </span>
            <div className="text-2xl font-black text-slate-800 dark:text-white">
              {stats.unusedLicenses}
              <span className="text-xs font-normal text-sakura-600 ml-1.5 font-bold">Available</span>
            </div>
          </div>
        </div>

        {/* Registered Users */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Portal Accounts
            </span>
            <div className="text-2xl font-black text-slate-800 dark:text-white">
              {registeredUsers.length + 3}
              <span className="text-xs font-normal text-indigo-600 ml-1.5 font-bold">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* License Generator Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-sakura-100 dark:border-slate-800 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-sakura-500 text-white flex items-center justify-center shadow-md shadow-sakura-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-800 dark:text-white">
              Generate 1-Month VIP Voucher Code
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create a unique activation key for your classmate upon receiving GCash payment
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerateKey} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Classmate / Student Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Angelica Ramos"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Plan Duration & Tier
            </label>
            <select
              value={planDays}
              onChange={(e) => {
                const days = Number(e.target.value);
                setPlanDays(days);
                if (days === 14) setPricePaid(100);
                else if (days === 30) setPricePaid(199);
                else if (days === 999) setPricePaid(499);
                else if (days === 7) setPricePaid(60);
                else if (days === 60) setPricePaid(349);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400"
            >
              <option value={14}>14 Days (2 Weeks Exam Rush) - ₱100</option>
              <option value={30}>30 Days (1 Month Standard Pass) - ₱199</option>
              <option value={999}>👑 VIP Lifetime Pass (No Expiry) - ₱499</option>
              <option value={7}>7 Days (1 Week Sprint) - ₱60</option>
              <option value={60}>60 Days (2 Months Pass) - ₱349</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Price Paid (PHP)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₱
              </span>
              <input
                type="number"
                value={pricePaid}
                onChange={(e) => setPricePaid(Number(e.target.value))}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              GCash Ref / Note
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. GCash Ref #99102"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-sakura-500 to-sakura-600 hover:from-sakura-600 hover:to-sakura-700 shadow-lg shadow-sakura-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Generate 1-Month VIP Key (₱{pricePaid})</span>
            </button>
          </div>
        </form>

        {/* Newly Generated Key Banner */}
        {newlyCreatedKey && (
          <div className="mt-6 p-5 rounded-2xl bg-sakura-50 dark:bg-sakura-950/40 border border-sakura-200 dark:border-sakura-800/80 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-sakura-700 dark:text-sakura-300 block mb-1">
                  ✨ Key Generated for {newlyCreatedKey.studentName}!
                </span>
                <div className="font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-widest">
                  {newlyCreatedKey.code}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                  30-Day Prometric CBT & Audio Unlocked • Single Device Protection
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(newlyCreatedKey.code)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-sm hover:border-sakura-300 transition-all"
                >
                  {copiedCode === newlyCreatedKey.code ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode === newlyCreatedKey.code ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyMessengerInvite(newlyCreatedKey)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sakura-500 to-sakura-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:from-sakura-600 hover:to-sakura-700 transition-all"
                >
                  {copiedInvite === newlyCreatedKey.id ? <Check className="w-4 h-4 text-white" /> : <Send className="w-4 h-4" />}
                  <span>{copiedInvite === newlyCreatedKey.id ? 'Invite Copied!' : 'Copy Messenger Invite'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Table / Directory */}
      <div className="space-y-4">
        {/* Navigation Switcher: Licenses vs Registered Users */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 w-fit">
            <button
              onClick={() => setActiveViewMode('licenses')}
              className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeViewMode === 'licenses'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>License Keys Directory ({licenses.length})</span>
            </button>
            <button
              onClick={() => setActiveViewMode('users')}
              className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeViewMode === 'users'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Registered Accounts ({registeredUsers.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student or code..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sakura-400 shadow-sm"
            />
          </div>
        </div>

        {/* View Mode: License Keys */}
        {activeViewMode === 'licenses' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Filter Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-3 gap-2 overflow-x-auto scrollbar-none">
              {(['all', 'active', 'unused', 'expired'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-3 text-xs font-bold capitalize border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-sakura-500 text-sakura-600 dark:text-sakura-400'
                      : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  {tab === 'all' && `All (${licenses.length})`}
                  {tab === 'active' && `Active (${stats.activeLicenses})`}
                  {tab === 'unused' && `Unused / Ready (${stats.unusedLicenses})`}
                  {tab === 'expired' && `Expired / Revoked (${stats.expiredLicenses})`}
                </button>
              ))}
            </div>

            {/* Mobile Card List (Thumb-friendly for smartphone screens) */}
            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800 p-4 space-y-4">
              {filteredLicenses.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No licenses found matching your filter.
                </div>
              ) : (
                filteredLicenses.map(lic => {
                  const daysLeft = getDaysRemaining(lic.expiresAt);
                  return (
                    <div
                      key={lic.id}
                      className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3.5 shadow-sm"
                    >
                      {/* Student Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{lic.studentName}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {lic.notes || '1-Month VIP'} • <span className="font-semibold text-emerald-600 dark:text-emerald-400">₱{lic.pricePaid}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {lic.status === 'active' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              {lic.planDurationDays >= 900 ? '👑 Lifetime VIP' : `Active • ${daysLeft}d left`}
                            </span>
                          )}
                          {lic.status === 'unused' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                              Unused / Ready
                            </span>
                          )}
                          {lic.status === 'expired' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                              Expired
                            </span>
                          )}
                          {lic.status === 'revoked' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                              Revoked
                            </span>
                          )}
                        </div>
                      </div>

                      {/* License Key Box with Quick Copy */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 font-mono">
                        <span className="font-bold text-xs tracking-wider text-slate-900 dark:text-slate-100 select-all">
                          {lic.code}
                        </span>
                        <button
                          onClick={() => handleCopy(lic.code)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 active:scale-95 transition-all flex items-center gap-1"
                        >
                          {copiedCode === lic.code ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Device & Expiry Info */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                        <div className="flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[150px]">
                            {lic.boundDeviceId ? (lic.boundDeviceName || 'Locked Device') : '🔓 Any Device (Unbound)'}
                          </span>
                        </div>
                        <div>
                          {lic.planDurationDays >= 900 ? (
                            <span className="text-amber-500 font-bold">👑 Lifetime (No Expiry)</span>
                          ) : lic.expiresAt ? (
                            <span>Exp: {new Date(lic.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          ) : (
                            <span>{lic.planDurationDays}d on activation</span>
                          )}
                        </div>
                      </div>

                      {/* Touch Action Toolbar */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                        <button
                          onClick={() => handleCopyMessengerInvite(lic)}
                          className="w-full py-2.5 rounded-xl bg-sakura-500 hover:bg-sakura-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                        >
                          {copiedInvite === lic.id ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                          <span>{copiedInvite === lic.id ? 'Invite Copied!' : 'Messenger Invite'}</span>
                        </button>

                        <button
                          onClick={() => handleExtend(lic.id)}
                          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5 text-emerald-500" />
                          <span>+30 Days Pass</span>
                        </button>

                        {lic.boundDeviceId && (
                          <button
                            onClick={() => handleResetDevice(lic.id)}
                            className="col-span-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center gap-1 border border-blue-200 dark:border-blue-900 active:scale-95 transition-all"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Device</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleRevoke(lic.id)}
                          className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all border ${
                            lic.boundDeviceId ? 'col-span-1' : 'col-span-2'
                          } ${
                            lic.status === 'revoked'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-200 dark:border-rose-900'
                          }`}
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>{lic.status === 'revoked' ? 'Restore VIP' : 'Revoke Pass'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-6">Student Name & Notes</th>
                    <th className="py-3.5 px-4">License Key</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Days Left</th>
                    <th className="py-3.5 px-4">Bound Device</th>
                    <th className="py-3.5 px-4">Expires On</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                  {filteredLicenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No licenses found matching your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLicenses.map(lic => {
                      const daysLeft = getDaysRemaining(lic.expiresAt);
                      return (
                        <tr key={lic.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-800 dark:text-white">
                              {lic.studentName}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                              {lic.notes || '1-Month VIP'} • ₱{lic.pricePaid}
                            </div>
                          </td>

                          <td className="py-4 px-4 font-mono">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 dark:text-slate-100">
                                {lic.code}
                              </span>
                              <button
                                onClick={() => handleCopy(lic.code)}
                                className="p-1 rounded text-slate-400 hover:text-sakura-600 transition-colors"
                                title="Copy key"
                              >
                                {copiedCode === lic.code ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            {lic.status === 'active' && (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                                Active VIP
                              </span>
                            )}
                            {lic.status === 'unused' && (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                                Unused / Ready
                              </span>
                            )}
                            {lic.status === 'expired' && (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                                Expired (30d)
                              </span>
                            )}
                            {lic.status === 'revoked' && (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                                Revoked
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 font-semibold">
                            {lic.status === 'active' ? (
                              lic.planDurationDays >= 900 ? (
                                <span className="text-amber-500 font-bold">👑 Lifetime</span>
                              ) : (
                                <span className={daysLeft <= 3 ? 'text-rose-500 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold'}>
                                  {daysLeft} days
                                </span>
                              )
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-[11px] text-slate-500 dark:text-slate-400">
                            {lic.boundDeviceId ? (
                              <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                                <span>{lic.boundDeviceName || 'Locked Device'}</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">🔓 Unbound (Any Device)</span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-[11px] text-slate-500 dark:text-slate-400">
                            {lic.planDurationDays >= 900 ? (
                              <span className="text-amber-500 font-bold">👑 No Expiry</span>
                            ) : lic.expiresAt ? (
                              new Date(lic.expiresAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            ) : (
                              <span className="text-slate-400">{lic.planDurationDays}d on activation</span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Messenger Invite */}
                              <button
                                onClick={() => handleCopyMessengerInvite(lic)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-sakura-600 hover:bg-sakura-50 dark:hover:bg-slate-800 transition-colors"
                                title="Copy Messenger Invitation"
                              >
                                {copiedInvite === lic.id ? <Check className="w-4 h-4 text-sakura-500" /> : <Send className="w-4 h-4" />}
                              </button>

                              {/* +30 Days Renewal */}
                              <button
                                onClick={() => handleExtend(lic.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors text-[11px] font-bold"
                                title="Renew / Extend by +30 Days"
                              >
                                +30d
                              </button>

                              {/* Reset Device */}
                              {lic.boundDeviceId && (
                                <button
                                  onClick={() => handleResetDevice(lic.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                                  title="Reset Device Binding (Allow student to switch phone)"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                              )}

                              {/* Revoke */}
                              <button
                                onClick={() => handleToggleRevoke(lic.id)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  lic.status === 'revoked'
                                    ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                                    : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800'
                                }`}
                                title={lic.status === 'revoked' ? 'Restore License' : 'Revoke License'}
                              >
                                <Ban className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(lic.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                                title="Delete Permanently"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Mode: Registered Accounts */}
        {activeViewMode === 'users' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif font-bold text-base text-slate-800 dark:text-white">
                  Student Portal Registrations
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Classmates who registered an account via the login screen
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Built-in mariel */}
              <div className="p-4 rounded-2xl bg-sakura-50/50 dark:bg-slate-800/50 border border-sakura-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌸</span>
                  <div>
                    <div className="font-bold text-sm text-slate-800 dark:text-white">
                      Mariel (マリエル)
                    </div>
                    <div className="text-xs text-slate-500">username: mariel • JFT Target</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sakura-500 text-white">
                  Creator VIP
                </span>
              </div>

              {/* Dynamic registered accounts */}
              {registeredUsers.length === 0 ? (
                <div className="col-span-full py-8 text-center text-xs text-slate-400">
                  No other classmates have registered an account yet. When they click "Create Account" on the login screen, they will appear here!
                </div>
              ) : (
                registeredUsers.map((regUser, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{regUser.profile.avatar || '🌸'}</span>
                      <div>
                        <div className="font-bold text-sm text-slate-800 dark:text-white">
                          {regUser.profile.displayName}
                        </div>
                        <div className="text-xs text-slate-500">
                          @{regUser.username} • {regUser.profile.targetLevel}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newLic = generateLicenseKey({
                          studentName: regUser.profile.displayName,
                          durationDays: 30,
                          pricePaid: 199,
                          notes: `Direct Account Activation: @${regUser.username}`,
                          adminUser: user
                        });
                        setNewlyCreatedKey(newLic);
                        setActiveViewMode('licenses');
                        refreshData();
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-sakura-500 hover:bg-sakura-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Issue 30d</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Security & Anti-Sharing Notice */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-sakura-500 flex-shrink-0" />
          <div>
            <span className="font-bold text-slate-700 dark:text-slate-200 block">
              Automated Single-Device Lock (Anti-Piracy)
            </span>
            <span>
              Each license key binds to the student's unique phone or laptop upon activation. If they share the code with a classmate, the second device will be blocked unless you click "Reset Device".
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
