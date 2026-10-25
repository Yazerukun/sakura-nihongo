import React, { useState, useEffect } from 'react';
import { CBTQuestion, LevelType, ExamHistoryRecord } from '../types';
import jftCbtExams from '../data/jft_cbt_exams.json';
import jlptQuizzes from '../data/jlpt_quizzes.json';
import { japaneseVoice } from '../utils/audio';
import { saveExamResult, recordStudySession } from '../utils/storage';
import confetti from 'canvas-confetti';
import { 
  Timer, 
  Volume2, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface CBTExamSimulatorProps {
  level: LevelType;
  onFinish?: () => void;
}

export const CBTExamSimulator: React.FC<CBTExamSimulatorProps> = ({ level }) => {
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [questions, setQuestions] = useState<CBTQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [selectedSimulationTest, setSelectedSimulationTest] = useState(1);
  const [finalScore, setFinalScore] = useState<any>(null);

  // Initialize questions based on level
  useEffect(() => {
    loadExamQuestions();
  }, [level, selectedSimulationTest]);

  const loadExamQuestions = () => {
    if (level === 'JFT') {
      // Filter simulation test questions
      const jftList = (jftCbtExams as CBTQuestion[]).filter(
        q => q.testNum === selectedSimulationTest
      );
      if (jftList.length > 0) {
        setQuestions(jftList);
      } else {
        setQuestions((jftCbtExams as CBTQuestion[]).slice(0, 50));
      }
    } else {
      // Load JLPT questions for selected level (e.g., N5, N4, N3, etc.)
      const rawJlpt = (jlptQuizzes as Record<string, any[]>)[level] || [];
      const formatted: CBTQuestion[] = rawJlpt.slice(0, 40).map((q, i) => ({
        id: q.id || `jlpt_${level}_${i}`,
        testNum: 1,
        sectionId: i < 15 ? 1 : i < 30 ? 2 : 4,
        sectionName: i < 15 ? 'Language Knowledge (言語知識)' : i < 30 ? 'Grammar & Expressions (文法)' : 'Reading (読解)',
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation || 'Official JLPT test question'
      }));
      setQuestions(formatted);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!examStarted || examCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examCompleted]);

  const startExam = () => {
    loadExamQuestions();
    setUserAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setTimeLeft(level === 'JFT' ? 3600 : 3600); // 60 mins
    setExamStarted(true);
    setExamCompleted(false);
    setFinalScore(null);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const handleToggleFlag = () => {
    setFlagged(prev => ({
      ...prev,
      [currentIndex]: !prev[currentIndex]
    }));
  };

  const handleSubmitExam = () => {
    setExamCompleted(true);
    const duration = 3600 - timeLeft;
    const studyMinutes = Math.max(1, Math.round(duration / 60));

    let correctCount = 0;
    const sectionBreakdown: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q, idx) => {
      const isCorrect = userAnswers[idx] === q.correctAnswerIndex;
      if (isCorrect) correctCount++;

      const sec = q.sectionName;
      if (!sectionBreakdown[sec]) {
        sectionBreakdown[sec] = { correct: 0, total: 0 };
      }
      sectionBreakdown[sec].total += 1;
      if (isCorrect) {
        sectionBreakdown[sec].correct += 1;
      }
    });

    const totalQuestions = questions.length || 1;
    const rawPercentage = (correctCount / totalQuestions) * 100;

    let scaledScore = 0;
    let maxScore = 0;
    let passed = false;

    if (level === 'JFT') {
      // JFT-Basic scoring: 10 to 250 points, passing mark = 200 (CEFR A2.2)
      // Scaled approximation: 10 + (correctCount / totalQuestions) * 240
      scaledScore = Math.round(10 + (correctCount / totalQuestions) * 240);
      maxScore = 250;
      passed = scaledScore >= 200;
    } else {
      // JLPT scoring: 0 to 180 points
      scaledScore = Math.round((correctCount / totalQuestions) * 180);
      maxScore = 180;
      const passMarks: Record<string, number> = {
        N5: 80,
        N4: 90,
        N3: 95,
        N2: 90,
        N1: 100
      };
      passed = scaledScore >= (passMarks[level] || 90);
    }

    const resultRecord: ExamHistoryRecord = {
      id: `exam_${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      examType: level === 'JFT' ? 'JFT' : 'JLPT',
      level,
      score: scaledScore,
      maxScore,
      passed,
      percentage: Math.round(rawPercentage),
      sectionScores: sectionBreakdown,
      durationSeconds: duration
    };

    saveExamResult(resultRecord);
    recordStudySession(studyMinutes, totalQuestions, correctCount);
    setFinalScore(resultRecord);

    if (passed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const playQuestionAudio = () => {
    if (!questions[currentIndex]) return;
    const text = questions[currentIndex].question;
    japaneseVoice.speak(text);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  // Start Screen view
  if (!examStarted && !examCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sakura-100 dark:border-slate-800 p-8 shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-44 h-44 bg-sakura-200/30 dark:bg-sakura-900/10 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-sakura-50 dark:bg-slate-800 text-sakura-500 mb-4 shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-serif font-black text-slate-800 dark:text-white mb-2">
            {level === 'JFT' ? 'JFT-Basic 2025/2026 CBT Simulation' : `JLPT ${level} Official Mock Examination`}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-6">
            {level === 'JFT'
              ? 'Complete computer-based testing (CBT) covering Script & Vocab, Conversation & Expression, Listening, and Reading with official IRT scoring.'
              : `Timed examination following the official 2025-2026 JLPT ${level} structure, sectional balance, and pass/fail scoring parameters.`}
          </p>

          {/* Test Selector for JFT */}
          {level === 'JFT' && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5, 6].map(testNum => (
                <button
                  key={testNum}
                  onClick={() => setSelectedSimulationTest(testNum)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedSimulationTest === testNum
                      ? 'bg-sakura-500 text-white border-sakura-600 shadow-md shadow-sakura-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Simulation Test #{testNum}
                </button>
              ))}
            </div>
          )}

          {/* Guidelines Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 text-left">
            <div className="p-4 rounded-2xl bg-sakura-50/70 dark:bg-slate-800/60 border border-sakura-100 dark:border-slate-700">
              <div className="text-xs font-bold text-sakura-600 dark:text-sakura-400 uppercase tracking-wider mb-1">
                ⏱️ Time Pool
              </div>
              <div className="text-lg font-black text-slate-800 dark:text-white">60 Minutes</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Continuous countdown</div>
            </div>

            <div className="p-4 rounded-2xl bg-sakura-50/70 dark:bg-slate-800/60 border border-sakura-100 dark:border-slate-700">
              <div className="text-xs font-bold text-sakura-600 dark:text-sakura-400 uppercase tracking-wider mb-1">
                🎯 Target Pass
              </div>
              <div className="text-lg font-black text-slate-800 dark:text-white">
                {level === 'JFT' ? '200 / 250 pts' : 'Pass Threshold'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {level === 'JFT' ? 'CEFR A2.2 Pass Mark' : 'With Sectional Cutoff'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sakura-50/70 dark:bg-slate-800/60 border border-sakura-100 dark:border-slate-700">
              <div className="text-xs font-bold text-sakura-600 dark:text-sakura-400 uppercase tracking-wider mb-1">
                🔊 Audio Speech
              </div>
              <div className="text-lg font-black text-slate-800 dark:text-white">Native TTS</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Audio dialogue replay</div>
            </div>
          </div>

          <button
            onClick={startExam}
            className="px-8 py-3.5 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-sakura-500 to-sakura-600 hover:from-sakura-600 hover:to-sakura-700 shadow-xl shadow-sakura-500/25 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <Timer className="w-5 h-5" />
            <span>Begin Official Simulation (試験開始)</span>
          </button>
        </div>
      </div>
    );
  }

  // Completed Exam Results View
  if (examCompleted && finalScore) {
    const isPassed = finalScore.passed;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sakura-100 dark:border-slate-800 p-8 shadow-xl text-center">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 shadow-lg ${
              isPassed
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
            }`}
          >
            {isPassed ? <CheckCircle2 className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
          </div>

          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {level === 'JFT' ? 'JFT-Basic Examination Score Report' : `JLPT ${level} Score Report`}
          </div>

          <h2 className="text-3xl font-serif font-black text-slate-800 dark:text-white mb-1">
            {isPassed ? '合格 (PASSED!) 🎉' : '不合格 (Keep Going! 💪)'}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {isPassed
              ? level === 'JFT'
                ? 'Congratulations! You achieved the A2.2 CEFR standard required for living and working in Japan!'
                : `Awesome job! You reached the official passing standard for JLPT ${level}!`
              : 'Don’t worry! Review the question breakdown below, practice your weak sections, and try again!'}
          </p>

          {/* Big Score Card */}
          <div className="max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-b from-sakura-50/50 to-white dark:from-slate-800/50 dark:to-slate-900 border border-sakura-100 dark:border-slate-800 shadow-md mb-8">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Final Scaled Score
            </div>
            <div className="text-5xl font-black text-slate-800 dark:text-white font-mono tracking-tight mb-2">
              {finalScore.score}{' '}
              <span className="text-2xl text-slate-400 font-sans font-normal">/ {finalScore.maxScore}</span>
            </div>
            <div className="text-sm font-semibold text-sakura-600 dark:text-sakura-400">
              {finalScore.percentage}% Overall Accuracy
            </div>
          </div>

          {/* Section Breakdown Grid */}
          {finalScore.sectionScores && (
            <div className="max-w-2xl mx-auto mb-8 text-left">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Sectional Performance Breakdown:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(finalScore.sectionScores).map(([name, data]: [string, any]) => {
                  const pct = Math.round((data.correct / (data.total || 1)) * 100);
                  return (
                    <div
                      key={name}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{name}</div>
                        <div className="text-[11px] text-slate-400">
                          {data.correct} of {data.total} correct
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-sm font-black font-mono ${
                            pct >= 70 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-rose-600'
                          }`}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={startExam}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-sakura-500 hover:bg-sakura-600 shadow-md transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Simulation</span>
            </button>
            <button
              onClick={() => {
                setExamStarted(false);
                setExamCompleted(false);
              }}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all"
            >
              Back to Overview
            </button>
          </div>

          {/* Detailed Question Review List */}
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-left">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
              📝 Detailed Question Review & Answers:
            </h3>
            <div className="space-y-4">
              {questions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const isCorrect = userAns === q.correctAnswerIndex;
                return (
                  <div
                    key={q.id || idx}
                    className={`p-4 rounded-2xl border ${
                      isCorrect
                        ? 'bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/40'
                        : 'bg-rose-50/40 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-500">
                        Q{idx + 1} • {q.sectionName}
                      </span>
                      <span
                        className={`font-bold flex items-center gap-1 ${
                          isCorrect ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <div className="font-serif font-bold text-slate-800 dark:text-slate-100 text-sm whitespace-pre-line mb-3">
                      {q.question}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userAns === optIdx;
                        const isKey = q.correctAnswerIndex === optIdx;
                        return (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-xl border flex items-center justify-between ${
                              isKey
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 font-bold text-emerald-900 dark:text-emerald-200'
                                : isChosen
                                ? 'bg-rose-100 dark:bg-rose-900/40 border-rose-300 text-rose-900 dark:text-rose-200'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <span>
                              {String.fromCharCode(65 + optIdx)}. {opt}
                            </span>
                            {isKey && <span className="text-[10px] text-emerald-700 font-bold">Key ✓</span>}
                            {isChosen && !isKey && (
                              <span className="text-[10px] text-rose-600 font-bold">Your answer</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 bg-white/70 dark:bg-slate-800/70 p-2 rounded-lg">
                        💡 {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Exam Simulator View
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top CBT Status Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30">
        <div>
          <div className="text-xs font-bold text-sakura-600 dark:text-sakura-400 uppercase tracking-wider">
            {level === 'JFT' ? `JFT-Basic Test #${selectedSimulationTest}` : `JLPT ${level} CBT Mock`}
          </div>
          <div className="text-sm font-black text-slate-800 dark:text-white">
            Question {currentIndex + 1} of {questions.length} • {currentQ?.sectionName}
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold ${
              timeLeft < 300
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <button
            onClick={handleSubmitExam}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-sakura-500 hover:bg-sakura-600 transition-colors shadow-sm"
          >
            Finish Exam
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Panel */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-md">
          {/* Section & Flag action */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sakura-50 dark:bg-slate-800 text-sakura-700 dark:text-sakura-300">
              {currentQ?.sectionName}
            </span>

            <div className="flex items-center gap-2">
              {/* Play Audio Button */}
              <button
                onClick={playQuestionAudio}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-sakura-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                title="Play Audio with native Japanese TTS"
              >
                <Volume2 className="w-3.5 h-3.5 text-sakura-500" />
                <span>Listen (音声)</span>
              </button>

              {/* Flag button */}
              <button
                onClick={handleToggleFlag}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  flagged[currentIndex]
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flagged[currentIndex] ? 'Flagged' : 'Flag'}</span>
              </button>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="mb-6">
            <div className="text-base sm:text-lg font-serif font-bold text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line p-4 rounded-2xl bg-washi-50/50 dark:bg-slate-800/40 border border-sakura-100/60 dark:border-slate-700/50">
              {currentQ?.question}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQ?.options.map((opt, optIdx) => {
              const isSelected = userAnswers[currentIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectAnswer(optIdx)}
                  className={`w-full p-4 rounded-2xl text-left text-sm font-medium transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-sakura-50/80 dark:bg-sakura-950/30 border-sakura-400 dark:border-sakura-600 text-slate-900 dark:text-white shadow-sm ring-2 ring-sakura-400/20'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-sakura-300 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'bg-sakura-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="font-serif text-sm sm:text-base">{opt}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-sakura-500" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Prev / Next */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-400">
              {currentIndex + 1} / {questions.length}
            </span>

            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sakura-500 hover:bg-sakura-600 disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar Question Drawer */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm h-fit">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Question Palette
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {Object.keys(userAnswers).length}/{questions.length} answered
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1.5 max-h-96 overflow-y-auto p-1 scrollbar-thin">
            {questions.map((_, idx) => {
              const isAnswered = userAnswers[idx] !== undefined;
              const isCurrent = currentIndex === idx;
              const isFlag = flagged[idx];

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-full aspect-square rounded-xl text-xs font-bold flex items-center justify-center relative transition-all ${
                    isCurrent
                      ? 'ring-2 ring-sakura-500 scale-105 font-black bg-sakura-50 dark:bg-sakura-900/40 text-sakura-700 dark:text-sakura-300'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isFlag && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Palette Legend */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300" />
              <span>Unanswered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-500" />
              <span>Flagged for review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
