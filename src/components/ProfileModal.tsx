import React, { useState } from 'react';
import { UserProfile, LevelType } from '../types';
import { updateProfile } from '../utils/auth';
import { X, Sparkles, Heart, Save } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onProfileUpdated: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onProfileUpdated
}) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [avatar, setAvatar] = useState(user.avatar);
  const [targetLevel, setTargetLevel] = useState<LevelType>(user.targetLevel);
  const [examDate, setExamDate] = useState(user.examTargetDate);
  const [dailyCards, setDailyCards] = useState(user.dailyGoalCards);
  const [dailyMins, setDailyMins] = useState(user.dailyGoalMinutes);
  const [sweetNote, setSweetNote] = useState(user.sweetNote);

  if (!isOpen) return null;

  const avatars = ['🌸', '🦊', '🍵', '🍡', '🐱', '👑', '🍙', '✨', '👘', '🎋'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      displayName,
      avatar,
      targetLevel,
      examTargetDate: examDate,
      dailyGoalCards: Number(dailyCards),
      dailyGoalMinutes: Number(dailyMins),
      sweetNote
    };
    updateProfile(updated);
    onProfileUpdated(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-sakura-100 dark:border-slate-800 p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{avatar}</span>
            <div>
              <h3 className="text-xl font-bold font-serif text-slate-800 dark:text-white">
                Study Profile Settings
              </h3>
              <p className="text-xs text-slate-500">Personalize your study experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Choose Avatar
            </label>
            <div className="flex flex-wrap gap-2">
              {avatars.map(a => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`w-10 h-10 rounded-2xl text-xl flex items-center justify-center border transition-all ${
                    avatar === a
                      ? 'bg-sakura-100 border-sakura-500 scale-110 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400"
              required
            />
          </div>

          {/* Target Exam & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Target Exam
              </label>
              <select
                value={targetLevel}
                onChange={e => setTargetLevel(e.target.value as LevelType)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400"
              >
                <option value="JFT">JFT-Basic 2026 (A2)</option>
                <option value="N5">JLPT N5 (Beginner)</option>
                <option value="N4">JLPT N4 (Basic)</option>
                <option value="N3">JLPT N3 (Intermediate)</option>
                <option value="N2">JLPT N2 (Upper-Int)</option>
                <option value="N1">JLPT N1 (Master)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Target Exam Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400"
              />
            </div>
          </div>

          {/* Goals */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Daily Cards Goal
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={dailyCards}
                onChange={e => setDailyCards(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Daily Study Minutes
              </label>
              <input
                type="number"
                min="5"
                max="180"
                value={dailyMins}
                onChange={e => setDailyMins(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400"
              />
            </div>
          </div>

          {/* Sweet Motivation Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-sakura-500 fill-sakura-500" />
              <span>Personal Sweet Encouragement Note</span>
            </label>
            <textarea
              rows={2}
              value={sweetNote}
              onChange={e => setSweetNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-sakura-500 hover:bg-sakura-600 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
