import React from 'react';
import { UserProfile, ExamHistoryRecord, StudyStats } from '../types';
import { getStudyStats, getExamHistory } from '../utils/storage';
import { Flame, Clock, Award, CheckCircle2, XCircle, TrendingUp, Calendar } from 'lucide-react';

interface AnalyticsViewProps {
  user: UserProfile;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ user }) => {
  const stats: StudyStats = getStudyStats();
  const examHistory: ExamHistoryRecord[] = getExamHistory();

  const totalAnswered = stats.questionsAnswered || 0;
  const accuracy = totalAnswered > 0 ? Math.round((stats.correctAnswers / totalAnswered) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Overview Headline */}
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-black text-slate-800 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-sakura-500" />
          <span>Study Analytics & Exam History</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tracking your daily progress towards passing {user.targetLevel}!
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <Flame className="w-5 h-5 fill-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-white font-mono">
            {stats.streakDays} <span className="text-sm font-sans text-slate-400 font-normal">days</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sakura-500 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Time</span>
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-white font-mono">
            {stats.totalMinutesStudied} <span className="text-sm font-sans text-slate-400 font-normal">mins</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Accuracy</span>
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-white font-mono">
            {accuracy}%
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-aizome-500 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Answered</span>
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-white font-mono">
            {totalAnswered}
          </div>
        </div>
      </div>

      {/* Target Exam Goal Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sakura-500 to-sakura-600 text-white shadow-lg shadow-sakura-500/20 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-white/80 mb-1">
            🎯 Target Examination
          </div>
          <div className="text-2xl font-serif font-black">
            {user.targetLevel === 'JFT' ? 'JFT-Basic 2026 (A2.2)' : `JLPT ${user.targetLevel} Official Exam`}
          </div>
          <div className="text-xs text-white/90 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Target Exam Date: {user.examTargetDate || 'Summer 2026'}</span>
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl text-center">
          <div className="text-[11px] uppercase tracking-wider text-white/80">Daily Goal</div>
          <div className="text-xl font-black">{user.dailyGoalCards} cards / {user.dailyGoalMinutes}m</div>
        </div>
      </div>

      {/* Exam Simulation History */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <span>📜 CBT Exam Simulation Records</span>
        </h3>

        {examHistory.length > 0 ? (
          <div className="space-y-3">
            {examHistory.map(record => (
              <div
                key={record.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        record.passed
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {record.passed ? 'PASSED (合格)' : 'NOT YET (不合格)'}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      {record.examType === 'JFT' ? 'JFT-Basic' : `JLPT ${record.level}`}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Date: {record.date} • Duration: {Math.round(record.durationSeconds / 60)} mins
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-mono font-black text-slate-800 dark:text-white">
                    {record.score}{' '}
                    <span className="text-sm font-sans text-slate-400 font-normal">/ {record.maxScore}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">
                    {record.percentage}% accuracy
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm">
            No exams taken yet. Start with the <strong className="text-sakura-500">CBT Simulator</strong> tab!
          </div>
        )}
      </div>
    </div>
  );
};
