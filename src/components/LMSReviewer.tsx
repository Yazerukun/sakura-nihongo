import React, { useState, useEffect, useMemo } from 'react';
import { LMSPattern, LMSQuestion, LMSMockExam, LevelType } from '../types';
import patternData from '../data/pattern_drills.json';
import { japaneseVoice } from '../utils/audio';
import { recordStudySession, saveExamResult } from '../utils/storage';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  Target, 
  BookOpen, 
  Star, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Timer, 
  Award, 
  Shuffle, 
  Filter, 
  Sparkles, 
  HelpCircle, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface LMSReviewerProps {
  level: LevelType;
}

export const LMSReviewer: React.FC<LMSReviewerProps> = ({ level }) => {
  const patterns: LMSPattern[] = patternData.patterns;
  const allQuestions: LMSQuestion[] = patternData.questions as LMSQuestion[];
  const mockExams: LMSMockExam[] = patternData.mockExams as LMSMockExam[];

  // Top sub-mode: 'patterns' | 'mocks' | 'starred'
  const [activeTab, setActiveTab] = useState<'patterns' | 'mocks' | 'starred'>('patterns');

  // Starred / Bookmarked questions in localStorage
  const [starredIds, setStarredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sakura_lms_starred');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleStar = (id: string) => {
    setStarredIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('sakura_lms_starred', JSON.stringify(next));
      return next;
    });
  };

  // -------------------------------------------------------------
  // PATTERN DRILLS STATE
  // -------------------------------------------------------------
  const [selectedPatternId, setSelectedPatternId] = useState<string>('all');
  const [currentPatternQIndex, setCurrentPatternQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [drillScore, setDrillScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  // Filter questions for Pattern Drills
  const filteredPatternQuestions = useMemo(() => {
    if (activeTab === 'starred') {
      return allQuestions.filter(q => starredIds.includes(q.id));
    }
    if (selectedPatternId === 'all') {
      return allQuestions;
    }
    return allQuestions.filter(q => q.patternId === selectedPatternId);
  }, [allQuestions, selectedPatternId, activeTab, starredIds]);

  // Current Question in Pattern Drill
  const currentDrillQ = filteredPatternQuestions[currentPatternQIndex] || filteredPatternQuestions[0];

  // Reset answer when switching question
  const handleSelectPattern = (patternId: string) => {
    setSelectedPatternId(patternId);
    setCurrentPatternQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentDrillQ.correctAnswerIndex;
    setDrillScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (isCorrect) {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#f43f5e', '#ec4899', '#fb7185']
      });
    }
  };

  const handleNextDrillQ = () => {
    if (currentPatternQIndex < filteredPatternQuestions.length - 1) {
      setCurrentPatternQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handlePrevDrillQ = () => {
    if (currentPatternQIndex > 0) {
      setCurrentPatternQIndex(prev => prev - 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleShuffleDrill = () => {
    if (filteredPatternQuestions.length <= 1) return;
    const nextIdx = Math.floor(Math.random() * filteredPatternQuestions.length);
    setCurrentPatternQIndex(nextIdx);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  // -------------------------------------------------------------
  // MOCK EXAM STATE
  // -------------------------------------------------------------
  const [activeMockExam, setActiveMockExam] = useState<LMSMockExam | null>(null);
  const [mockQIndex, setMockQIndex] = useState<number>(0);
  const [mockUserAnswers, setMockUserAnswers] = useState<{ [qId: string]: number }>({});
  const [mockFlagged, setMockFlagged] = useState<{ [qId: string]: boolean }>({});
  const [mockTimeRemaining, setMockTimeRemaining] = useState<number>(35 * 60);
  const [mockFinished, setMockFinished] = useState<boolean>(false);
  const [mockFilterReview, setMockFilterReview] = useState<'all' | 'wrong' | 'flagged'>('all');

  // Start a Mock Exam
  const handleStartMockExam = (exam: LMSMockExam) => {
    setActiveMockExam(exam);
    setMockQIndex(0);
    setMockUserAnswers({});
    setMockFlagged({});
    setMockTimeRemaining(exam.timeLimitMinutes * 60);
    setMockFinished(false);
  };

  // Mock Timer effect
  useEffect(() => {
    if (!activeMockExam || mockFinished) return;

    const timer = setInterval(() => {
      setMockTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitMockExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeMockExam, mockFinished]);

  // Submit Mock Exam
  const handleSubmitMockExam = () => {
    if (!activeMockExam) return;
    setMockFinished(true);

    const examQuestions = activeMockExam.questionIds.map(id => allQuestions.find(q => q.id === id)!).filter(Boolean);
    let correctCount = 0;
    examQuestions.forEach(q => {
      if (mockUserAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / examQuestions.length) * 100);
    const passed = percentage >= activeMockExam.passingScore;

    // Record stats
    recordStudySession(
      Math.round((activeMockExam.timeLimitMinutes * 60 - mockTimeRemaining) / 60) || 1,
      examQuestions.length,
      correctCount
    );

    // Save history record
    saveExamResult({
      id: `lms_${activeMockExam.testId}_${Date.now()}`,
      date: new Date().toISOString(),
      examType: 'JLPT',
      level: level,
      score: correctCount,
      maxScore: examQuestions.length,
      passed: passed,
      percentage: percentage,
      durationSeconds: activeMockExam.timeLimitMinutes * 60 - mockTimeRemaining
    });

    // Celebrate if passed
    if (passed) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f43f5e', '#fbbf24', '#38bdf8']
      });
    }
  };

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Speak helper
  const handlePlayAudio = (text?: string) => {
    if (!text) return;
    japaneseVoice.speak(text);
  };

  // -------------------------------------------------------------
  // RENDER: ACTIVE MOCK EXAM RUNNER
  // -------------------------------------------------------------
  if (activeMockExam && !mockFinished) {
    const examQuestions = activeMockExam.questionIds.map(id => allQuestions.find(q => q.id === id)!).filter(Boolean);
    const currentQ = examQuestions[mockQIndex];
    const answeredCount = Object.keys(mockUserAnswers).length;
    const progressPercent = Math.round((answeredCount / examQuestions.length) * 100);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
        {/* Proctored Top Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-lg border border-slate-200/80 dark:border-slate-800 mb-6 sticky top-20 z-20 backdrop-blur-md bg-white/90 dark:bg-slate-900/90">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sakura-100 dark:bg-sakura-900/60 text-sakura-600 dark:text-sakura-400">
                  {activeMockExam.japaneseTitle}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeMockExam.targetLevel}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
                {activeMockExam.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Countdown Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-bold text-base transition-colors ${
                mockTimeRemaining < 300 
                  ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 text-rose-600 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}>
                <Timer className="w-5 h-5 text-sakura-500" />
                <span>{formatTime(mockTimeRemaining)}</span>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitMockExam}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                Submit Exam (採点する)
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
              <span>Answered: {answeredCount} / {examQuestions.length} ({progressPercent}%)</span>
              <span>Passing Score: {activeMockExam.passingScore}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sakura-500 to-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Exam Grid: Question Area + Question Palette */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Viewer (3 columns) */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 relative">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-sakura-100 dark:bg-sakura-900/60 text-sakura-600 dark:text-sakura-400 font-mono font-bold flex items-center justify-center text-sm">
                    {mockQIndex + 1}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    {currentQ.patternName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Audio Button */}
                  {currentQ.audioText && (
                    <button
                      onClick={() => handlePlayAudio(currentQ.audioText)}
                      className="p-2 rounded-xl text-slate-400 hover:text-sakura-500 hover:bg-sakura-50 dark:hover:bg-slate-800 transition-colors"
                      title="Listen with native speech"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  )}

                  {/* Flag / Bookmark Button */}
                  <button
                    onClick={() => {
                      setMockFlagged(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      mockFlagged[currentQ.id]
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-amber-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${mockFlagged[currentQ.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>{mockFlagged[currentQ.id] ? 'Flagged' : 'Review Later'}</span>
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="my-6">
                <div className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line font-japanese">
                  {currentQ.question}
                </div>
              </div>

              {/* 4 Choices */}
              <div className="space-y-3 mt-6">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = mockUserAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setMockUserAnswers(prev => ({ ...prev, [currentQ.id]: idx }));
                      }}
                      className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-sakura-500 bg-sakura-50/70 dark:bg-sakura-950/30 text-sakura-900 dark:text-sakura-200 ring-2 ring-sakura-400/40'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full font-mono text-xs font-bold flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-sakura-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-base font-japanese font-medium">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Question Navigation Footer */}
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100 dark:border-slate-800">
                <button
                  disabled={mockQIndex === 0}
                  onClick={() => setMockQIndex(prev => prev - 1)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    mockQIndex === 0
                      ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="text-xs font-mono text-slate-400">
                  Question {mockQIndex + 1} of {examQuestions.length}
                </span>

                <button
                  disabled={mockQIndex === examQuestions.length - 1}
                  onClick={() => setMockQIndex(prev => prev + 1)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    mockQIndex === examQuestions.length - 1
                      ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Palette Sidebar (1 column) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 sticky top-48">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Question Palette (問題一覧)
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {examQuestions.map((q, idx) => {
                  const isCurrent = mockQIndex === idx;
                  const isAnsweredQ = mockUserAnswers[q.id] !== undefined;
                  const isFlaggedQ = mockFlagged[q.id];

                  let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
                  if (isAnsweredQ) {
                    bgClass = 'bg-sakura-500 text-white font-bold';
                  }
                  if (isFlaggedQ) {
                    bgClass = 'bg-amber-400 text-slate-900 font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setMockQIndex(idx)}
                      className={`h-9 rounded-xl text-xs font-mono transition-all flex items-center justify-center relative ${bgClass} ${
                        isCurrent ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-105' : 'hover:opacity-80'
                      }`}
                    >
                      {idx + 1}
                      {isFlaggedQ && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-1 ring-white" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sakura-500" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <span>Unanswered ({examQuestions.length - answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span>Flagged for Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: POST-EXAM RESULTS VIEW
  // -------------------------------------------------------------
  if (activeMockExam && mockFinished) {
    const examQuestions = activeMockExam.questionIds.map(id => allQuestions.find(q => q.id === id)!).filter(Boolean);
    let correctCount = 0;
    examQuestions.forEach(q => {
      if (mockUserAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / examQuestions.length) * 100);
    const passed = percentage >= activeMockExam.passingScore;

    const filteredReviewQuestions = examQuestions.filter(q => {
      if (mockFilterReview === 'wrong') return mockUserAnswers[q.id] !== q.correctAnswerIndex;
      if (mockFilterReview === 'flagged') return mockFlagged[q.id];
      return true;
    });

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
        {/* Scorecard Hero */}
        <div className={`rounded-3xl p-8 text-center text-white shadow-xl relative overflow-hidden ${
          passed
            ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-700'
            : 'bg-gradient-to-br from-rose-600 via-sakura-600 to-purple-800'
        }`}>
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm mb-3">
              Official Exam Scorecard • {activeMockExam.japaneseTitle}
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-japanese mb-2">
              {passed ? '🎉 合格！ Congratulations!' : '🌸 あと一歩！ Keep Fighting!'}
            </h1>

            <p className="text-white/80 text-sm max-w-lg mx-auto">
              {passed 
                ? 'You surpassed the official 75% threshold! You are completely on track to ace your JFT-Basic & JLPT!' 
                : 'Great practice session! Review your weak questions below and try again to cement your memory.'}
            </p>

            <div className="flex items-center justify-center gap-8 my-6">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold font-mono">{percentage}%</div>
                <div className="text-xs uppercase text-white/70 mt-1">Accuracy</div>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold font-mono">{correctCount}/{examQuestions.length}</div>
                <div className="text-xs uppercase text-white/70 mt-1">Correct Answers</div>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold font-mono">
                  {formatTime(activeMockExam.timeLimitMinutes * 60 - mockTimeRemaining)}
                </div>
                <div className="text-xs uppercase text-white/70 mt-1">Time Spent</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => handleStartMockExam(activeMockExam)}
                className="px-5 py-2.5 rounded-2xl bg-white text-slate-800 font-bold text-sm shadow hover:bg-slate-100 transition-transform active:scale-95 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Exam (再受験)</span>
              </button>
              <button
                onClick={() => setActiveMockExam(null)}
                className="px-5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm backdrop-blur-sm transition-transform active:scale-95"
              >
                Back to Mock Suite (模試一覧に戻る)
              </button>
            </div>
          </div>
        </div>

        {/* Question Review Drawer */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Detailed Question Review (解答と解説)
              </h3>
              <p className="text-xs text-slate-400">
                Study the exact reasoning, grammar rules, and audio for each question.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMockFilterReview('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  mockFilterReview === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                All ({examQuestions.length})
              </button>
              <button
                onClick={() => setMockFilterReview('wrong')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  mockFilterReview === 'wrong'
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Mistakes ({examQuestions.length - correctCount})
              </button>
              <button
                onClick={() => setMockFilterReview('flagged')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  mockFilterReview === 'flagged'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Flagged ({Object.values(mockFlagged).filter(Boolean).length})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReviewQuestions.map((q, qIndex) => {
              const userChoice = mockUserAnswers[q.id];
              const isCorrect = userChoice === q.correctAnswerIndex;
              const isFlagged = mockFlagged[q.id];

              return (
                <div 
                  key={q.id}
                  className={`p-6 rounded-3xl border bg-white dark:bg-slate-900 shadow-sm transition-all ${
                    isCorrect 
                      ? 'border-emerald-200/80 dark:border-emerald-950/80' 
                      : 'border-rose-200/80 dark:border-rose-950/80'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-full text-xs font-bold font-mono flex items-center justify-center text-white ${
                        isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}>
                        {qIndex + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {q.patternName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-rose-500">
                          <XCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )}

                      {q.audioText && (
                        <button
                          onClick={() => handlePlayAudio(q.audioText)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sakura-500 hover:bg-sakura-50 dark:hover:bg-slate-800"
                          title="Listen with native speech"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="mt-4 text-base font-japanese text-slate-800 dark:text-slate-100 whitespace-pre-line">
                    {q.question}
                  </div>

                  {/* Options Review */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    {q.options.map((opt, optIdx) => {
                      const isOptionCorrect = optIdx === q.correctAnswerIndex;
                      const isOptionUser = optIdx === userChoice;

                      let optClass = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300';
                      if (isOptionCorrect) {
                        optClass = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold';
                      } else if (isOptionUser && !isCorrect) {
                        optClass = 'border-rose-400 bg-rose-50/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 line-through';
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-xl border text-sm flex items-center justify-between ${optClass}`}>
                          <span>{opt}</span>
                          {isOptionCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          {isOptionUser && !isCorrect && <XCircle className="w-4 h-4 text-rose-500" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Card */}
                  <div className="mt-4 p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700/60 text-xs">
                    <div className="font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Rule & Formula: {q.patternRule}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: DEFAULT VIEW (Mode Switcher + Patterns & Mocks tabs)
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Hero Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white shadow-xl relative overflow-hidden mb-8 border border-indigo-800/40">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sakura-500/20 text-sakura-300 border border-sakura-500/30">
              Official 2025/2026 Curriculum
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              JFT-Basic A2 • JLPT N5–N1
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-japanese">
            LMS Reviewer & 10 Mock Examination Suite
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Master the 9 official exam patterns (including Star ★ sentence ordering, orthography, and information retrieval) alongside 10 full-length timed mock exams.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
            <div>
              <div className="text-2xl font-bold font-mono text-sakura-400">9 Patterns</div>
              <div className="text-xs text-slate-400">Targeted Drills</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-emerald-400">10 Mock Exams</div>
              <div className="text-xs text-slate-400">Full Timed Tests</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-sky-400">160+ Questions</div>
              <div className="text-xs text-slate-400">Curated 2025/2026 Bank</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-amber-400">Edge Audio</div>
              <div className="text-xs text-slate-400">Neural Pronunciation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
        <button
          onClick={() => setActiveTab('patterns')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'patterns'
              ? 'bg-sakura-500 text-white shadow-md shadow-sakura-500/20 scale-102'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Pattern Mastery (パターン別特訓)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 text-white">
            {patterns.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mocks')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'mocks'
              ? 'bg-sakura-500 text-white shadow-md shadow-sakura-500/20 scale-102'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>10 Full Mock Exams (第1回〜第10回 総合模試)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 text-white">
            10
          </span>
        </button>

        <button
          onClick={() => setActiveTab('starred')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'starred'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-102'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Star className={`w-4 h-4 ${activeTab === 'starred' ? 'fill-white' : ''}`} />
          <span>Starred / Weak Questions (お気に入り)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {starredIds.length}
          </span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1 & 3: PATTERN MASTERY DRILLS & STARRED */}
      {/* ------------------------------------------------------------- */}
      {(activeTab === 'patterns' || activeTab === 'starred') && (
        <div className="space-y-6">
          {/* Pattern Selector Bar (Only in patterns tab) */}
          {activeTab === 'patterns' && (
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Select Exam Pattern to Drill:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                <button
                  onClick={() => handleSelectPattern('all')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedPatternId === 'all'
                      ? 'border-sakura-500 bg-sakura-50/70 dark:bg-sakura-950/40 text-sakura-900 dark:text-sakura-200 ring-2 ring-sakura-400/40'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">All 9 Patterns</div>
                  <div className="text-[11px] text-slate-400">{allQuestions.length} Questions</div>
                </button>

                {patterns.map(pat => {
                  const isSelected = selectedPatternId === pat.id;
                  const count = allQuestions.filter(q => q.patternId === pat.id).length;
                  return (
                    <button
                      key={pat.id}
                      onClick={() => handleSelectPattern(pat.id)}
                      className={`p-3 rounded-2xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-sakura-500 bg-sakura-50/70 dark:bg-sakura-950/40 text-sakura-900 dark:text-sakura-200 ring-2 ring-sakura-400/40'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                          {pat.badge}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{count} Qs</span>
                      </div>
                      <div className="text-xs font-bold line-clamp-1">{pat.title.split(':')[1] || pat.title}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Strategy Tip Alert */}
          {selectedPatternId !== 'all' && activeTab === 'patterns' && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-amber-900 dark:text-amber-200">
                  {patterns.find(p => p.id === selectedPatternId)?.title} Strategy:
                </span>
                <p className="text-amber-800/90 dark:text-amber-300/80 mt-0.5">
                  {patterns.find(p => p.id === selectedPatternId)?.strategy}
                </p>
              </div>
            </div>
          )}

          {/* Question Practice Box */}
          {filteredPatternQuestions.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
              <Star className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                No Starred Questions Yet
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                While practicing, click the Star icon on any question to bookmark it here for targeted revision!
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
              {/* Question Top Meta */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sakura-100 dark:bg-sakura-900/60 text-sakura-600 dark:text-sakura-400">
                    Question {currentPatternQIndex + 1} of {filteredPatternQuestions.length}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {currentDrillQ.patternName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Audio */}
                  {currentDrillQ.audioText && (
                    <button
                      onClick={() => handlePlayAudio(currentDrillQ.audioText)}
                      className="p-2 rounded-xl text-slate-400 hover:text-sakura-500 hover:bg-sakura-50 dark:hover:bg-slate-800 transition-colors"
                      title="Listen with native speech"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  )}

                  {/* Bookmark Toggle */}
                  <button
                    onClick={() => toggleStar(currentDrillQ.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      starredIds.includes(currentDrillQ.id)
                        ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                        : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="Bookmark this question"
                  >
                    <Star className={`w-5 h-5 ${starredIds.includes(currentDrillQ.id) ? 'fill-amber-500' : ''}`} />
                  </button>

                  {/* Shuffle Button */}
                  <button
                    onClick={handleShuffleDrill}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Random Question"
                  >
                    <Shuffle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Question Prompt */}
              <div className="my-6">
                <div className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line font-japanese">
                  {currentDrillQ.question}
                </div>
              </div>

              {/* 4 Interactive Choices */}
              <div className="space-y-3 mt-6">
                {currentDrillQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentDrillQ.correctAnswerIndex;

                  let optClass = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200';

                  if (isAnswered) {
                    if (isCorrect) {
                      optClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-400/40';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 line-through';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${optClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full font-mono text-xs font-bold flex items-center justify-center transition-colors ${
                          isAnswered && isCorrect 
                            ? 'bg-emerald-500 text-white'
                            : isAnswered && isSelected && !isCorrect
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-base font-japanese font-medium">{opt}</span>
                      </div>

                      {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Solution Drawer when Answered */}
              {isAnswered && (
                <div className="mt-6 p-5 rounded-2xl bg-indigo-50/60 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700/60 animate-fadeIn">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        selectedOption === currentDrillQ.correctAnswerIndex
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'
                      }`}>
                        {selectedOption === currentDrillQ.correctAnswerIndex ? '正解！ Correct!' : '残念！ Incorrect'}
                      </span>
                      <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                        {currentDrillQ.patternRule}
                      </span>
                    </div>

                    {currentDrillQ.audioText && (
                      <button
                        onClick={() => handlePlayAudio(currentDrillQ.audioText)}
                        className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Re-listen</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line mt-2 font-japanese">
                    {currentDrillQ.explanation}
                  </p>
                </div>
              )}

              {/* Action Navigation Footer */}
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100 dark:border-slate-800">
                <button
                  disabled={currentPatternQIndex === 0}
                  onClick={handlePrevDrillQ}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    currentPatternQIndex === 0
                      ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="text-xs text-slate-400 font-mono">
                  Score: {drillScore.correct} / {drillScore.total}
                </div>

                <button
                  disabled={currentPatternQIndex === filteredPatternQuestions.length - 1}
                  onClick={handleNextDrillQ}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    currentPatternQIndex === filteredPatternQuestions.length - 1
                      ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                      : 'bg-sakura-500 hover:bg-sakura-600 text-white shadow-sm'
                  }`}
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: 10 FULL MOCK EXAMS (第1回〜第10回 総合模擬試験) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'mocks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Official 2025/2026 Mock Exam Series (全10回)
              </h3>
              <p className="text-xs text-slate-400">
                Each mock exam contains 18 balanced pattern questions and a 35-minute countdown clock. Passing grade is 75%.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockExams.map(exam => {
              return (
                <div 
                  key={exam.testId}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-sakura-100 dark:bg-sakura-900/60 text-sakura-600 dark:text-sakura-400">
                        {exam.japaneseTitle}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Pass Mark: {exam.passingScore}%
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
                      {exam.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                      {exam.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 font-mono mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{exam.totalQuestions} Questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{exam.timeLimitMinutes} Minutes</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartMockExam(exam)}
                    className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98"
                  >
                    <span>Start Mock Exam #{exam.testNumber}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
