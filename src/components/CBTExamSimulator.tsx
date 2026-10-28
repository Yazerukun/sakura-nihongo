import React, { useState, useEffect } from 'react';
import { CBTQuestion, LevelType, ExamHistoryRecord, UserProfile } from '../types';
import jftCbtExams from '../data/jft_cbt_exams.json';
import jlptN4CbtExams from '../data/jlpt_n4_cbt_exams.json';
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
  Printer, 
  Headphones, 
  FileText, 
  Sparkles,
  BookOpen,
  Heart,
  Grid,
  ShieldCheck
} from 'lucide-react';

interface CBTExamSimulatorProps {
  level: LevelType;
  user?: UserProfile | null;
  onFinish?: () => void;
}

export const CBTExamSimulator: React.FC<CBTExamSimulatorProps> = ({ level, user }) => {
  const [activeExamType, setActiveExamType] = useState<'JFT' | 'N4'>(level === 'N4' ? 'N4' : 'JFT');
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [questions, setQuestions] = useState<CBTQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [selectedSimulationTest, setSelectedSimulationTest] = useState(1);
  const [finalScore, setFinalScore] = useState<any>(null);
  const [showReviewPaletteModal, setShowReviewPaletteModal] = useState(false);
  const [audioPlayCount, setAudioPlayCount] = useState<Record<number, number>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Sync activeExamType when level changes externally
  useEffect(() => {
    setActiveExamType(level === 'N4' ? 'N4' : 'JFT');
  }, [level]);

  // Initialize questions based on activeExamType & selected test
  useEffect(() => {
    loadExamQuestions();
  }, [activeExamType, selectedSimulationTest]);

  const loadExamQuestions = () => {
    if (activeExamType === 'JFT') {
      const jftList = (jftCbtExams as CBTQuestion[]).filter(
        q => q.testNum === selectedSimulationTest
      );
      setQuestions(jftList.length > 0 ? jftList : (jftCbtExams as CBTQuestion[]).slice(0, 60));
    } else {
      const n4List = (jlptN4CbtExams as CBTQuestion[]).filter(
        q => q.testNum === selectedSimulationTest
      );
      setQuestions(n4List.length > 0 ? n4List : (jlptN4CbtExams as CBTQuestion[]).slice(0, 60));
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
    setAudioPlayCount({});
    setCurrentIndex(0);
    setTimeLeft(3600); // 60 mins continuous proctored clock
    setExamStarted(true);
    setExamCompleted(false);
    setFinalScore(null);
    setShowReviewPaletteModal(false);
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
    setShowReviewPaletteModal(false);
    const duration = 3600 - timeLeft;
    const studyMinutes = Math.max(1, Math.round(duration / 60));

    let correctCount = 0;
    const sectionBreakdown: Record<string, { correct: number; total: number }> = {
      'Script and Vocabulary (文字・語彙)': { correct: 0, total: 0 },
      'Conversation and Expression (会話・表現)': { correct: 0, total: 0 },
      'Grammar and Expressions (文法・表現)': { correct: 0, total: 0 },
      'Listening Comprehension (聴解)': { correct: 0, total: 0 },
      'Reading Comprehension (読解)': { correct: 0, total: 0 }
    };

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

    if (activeExamType === 'JFT') {
      // JFT-Basic Official IRT Scaled Score: 10 to 250 points, pass threshold = 200
      scaledScore = Math.round(10 + (correctCount / totalQuestions) * 240);
      maxScore = 250;
      passed = scaledScore >= 200;
    } else {
      // JLPT N4 official: 0 to 180 points, passing mark = 90
      scaledScore = Math.round((correctCount / totalQuestions) * 180);
      maxScore = 180;
      passed = scaledScore >= 90;
    }

    const resultRecord: ExamHistoryRecord = {
      id: `exam_${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      examType: activeExamType === 'JFT' ? 'JFT' : 'JLPT',
      level: activeExamType,
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
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f43f5e', '#fbbf24', '#38bdf8']
      });
    }
  };

  const playQuestionAudio = () => {
    if (!questions[currentIndex]) return;
    const text = (questions[currentIndex] as any).audioText || questions[currentIndex].question;
    
    setIsPlayingAudio(true);
    setAudioPlayCount(prev => ({
      ...prev,
      [currentIndex]: (prev[currentIndex] || 0) + 1
    }));

    japaneseVoice.speak(text).finally(() => {
      setTimeout(() => setIsPlayingAudio(false), 2500);
    });
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];
  const isListeningSec = currentQ?.sectionName.includes('Listening') || currentQ?.sectionId === 3;
  const isReadingSec = currentQ?.sectionName.includes('Reading') || currentQ?.sectionId === 4;

  // -------------------------------------------------------------
  // VIEW 1: START SCREEN (Dual JFT-Basic & JLPT N4 Selector)
  // -------------------------------------------------------------
  if (!examStarted && !examCompleted) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
          {/* Top Live Indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-4 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="tracking-wide uppercase font-mono">
              Live Prometric CBT Terminal Connected • リアルタイム本番公式CBT
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white font-japanese mb-2">
            {activeExamType === 'JFT' 
              ? 'Japan Foundation Test for Basic Japanese (JFT-Basic A2)' 
              : 'JLPT N4 Official Real-Time Examination (日本語能力試験 N4)'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-6">
            Dedicated proctored environment mirroring the official Prometric test center. Features live 60-minute countdown, native listening audio dialogues, authentic reading texts, and official CEFR A2 / JLPT scaled grading.
          </p>

          {/* Exam Type Switcher: JFT-Basic A2 vs JLPT N4 */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              onClick={() => {
                setActiveExamType('JFT');
                setSelectedSimulationTest(1);
              }}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeExamType === 'JFT'
                  ? 'bg-sakura-500 text-white shadow-lg shadow-sakura-500/30 scale-102 ring-2 ring-sakura-400/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>🌸 JFT-Basic A2 (国際交流基金)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20">6 Exams</span>
            </button>

            <button
              onClick={() => {
                setActiveExamType('N4');
                setSelectedSimulationTest(1);
              }}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeExamType === 'N4'
                  ? 'bg-sakura-500 text-white shadow-lg shadow-sakura-500/30 scale-102 ring-2 ring-sakura-400/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>🌸 JLPT N4 (公式本番試験)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20">6 Exams</span>
            </button>
          </div>

          {/* Test Selector Grid */}
          <div className="mb-8">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Select {activeExamType === 'JFT' ? 'JFT-Basic A2' : 'JLPT N4'} Examination Set:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 max-w-3xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map(testNum => (
                <button
                  key={testNum}
                  onClick={() => setSelectedSimulationTest(testNum)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    selectedSimulationTest === testNum
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 shadow-md font-bold scale-102'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs">Exam #{testNum}</div>
                  <div className="text-[10px] opacity-80 font-mono">60 Questions</div>
                </button>
              ))}
            </div>
          </div>

          {/* Exam Structure Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8 text-left">
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Section 1: 15 Qs</span>
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-white">文字・語彙</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Kanji & Vocab</div>
            </div>

            <div className="p-4 rounded-2xl bg-sakura-50/70 dark:bg-slate-800/60 border border-sakura-100 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sakura-700 dark:text-sakura-400 mb-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Section 2: 15 Qs</span>
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-white">会話・表現 / 文法</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Grammar & Dialogues</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-100 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                <Headphones className="w-3.5 h-3.5" />
                <span>Section 3: 15 Qs</span>
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-white">聴解 (音声再生)</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Listening with Audio</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Section 4: 15 Qs</span>
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-white">読解 (掲示・文書)</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Reading & Retrieval</div>
            </div>
          </div>

          {/* Start CTA */}
          <button
            onClick={startExam}
            className="px-10 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-sakura-500 via-rose-500 to-indigo-600 hover:from-sakura-600 hover:to-indigo-700 shadow-xl shadow-sakura-500/25 active:scale-95 transition-all inline-flex items-center gap-3"
          >
            <Timer className="w-5 h-5" />
            <span>Launch {activeExamType === 'JFT' ? 'JFT-Basic' : 'JLPT N4'} Live Exam #{selectedSimulationTest} (本番試験を開始する)</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: OFFICIAL RESULTS CERTIFICATE (判定結果通知書)
  // -------------------------------------------------------------
  if (examCompleted && finalScore) {
    const isPassed = finalScore.passed;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
        {/* Certificate Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-4 border-double border-amber-300 dark:border-amber-700/80 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Watermark Sakura Seal */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sakura-100/40 dark:text-slate-800/20 text-9xl pointer-events-none select-none font-japanese font-black">
            桜合格
          </div>

          {/* Certificate Header */}
          <div className="text-center pb-6 border-b-2 border-slate-200 dark:border-slate-800 relative z-10">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Official Examination Results • 判定結果通知書
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white font-japanese mt-1">
              {activeExamType === 'JFT' ? '国際交流基金 日本語基礎テスト (JFT-Basic)' : '日本語能力試験 N4 (JLPT N4)'}
            </h2>
            <div className="text-xs text-slate-500 mt-1">
              Certificate of Test Result • Real-Time Computer-Based Test
            </div>
          </div>

          {/* Candidate & Determination Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 text-center relative z-10">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-400">Examinee Name (受験者)</div>
              <div className="text-lg font-bold text-slate-800 dark:text-white font-japanese">
                {user?.displayName || 'Mariel (マリエル)'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">ID: {activeExamType}-2026-8892</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-400">Scaled Score (得点)</div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {finalScore.score} <span className="text-sm font-normal text-slate-400">/ {finalScore.maxScore}</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {activeExamType === 'JFT' ? 'Passing Mark: 200 pts' : 'Passing Mark: 90 / 180 pts'}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isPassed 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300'
            }`}>
              <div className="text-xs font-semibold">Determination (判定結果)</div>
              <div className="text-2xl font-black font-japanese mt-0.5">
                {isPassed ? '【合格】 PASSED' : '【不合格】 KEEP FIGHTING'}
              </div>
              <div className="text-[10px] font-mono mt-0.5">
                {activeExamType === 'JFT' ? (isPassed ? 'CEFR A2.2 Certified' : 'Below 200 threshold') : (isPassed ? 'JLPT N4 Certified' : 'Below 90 threshold')}
              </div>
            </div>
          </div>

          {/* Section Breakdown Bars */}
          <div className="space-y-3 mb-8 relative z-10">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sectional Competency Evaluation:
            </div>
            {Object.entries(finalScore.sectionScores || {}).filter(([_, val]: [string, any]) => val.total > 0).map(([secName, val]: [string, any]) => {
              const secPct = val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0;
              return (
                <div key={secName} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">{secName}</span>
                    <span className="font-mono text-slate-500">{val.correct} / {val.total} ({secPct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        secPct >= 75 ? 'bg-emerald-500' : secPct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${secPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sweet Encouragement Note */}
          <div className="p-5 rounded-2xl bg-sakura-50/80 dark:bg-slate-800/80 border border-sakura-200 dark:border-slate-700 text-center relative z-10 mb-8">
            <Heart className="w-5 h-5 text-sakura-500 fill-sakura-500 mx-auto mb-1 animate-pulse" />
            <div className="font-bold text-sm text-sakura-900 dark:text-sakura-200 font-japanese">
              {user?.username === 'mariel' 
                ? "To Ian's Beloved Mariel (マリエルへ):" 
                : `To ${user?.displayName || 'Examinee'}:`}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-lg mx-auto leading-relaxed">
              {isPassed 
                ? (user?.username === 'mariel' 
                    ? "Mariel, you did so extraordinarily well! Ian is so immensely proud of you. With scores like this, the official 2025/2026 examination will be a breeze for you! 🌸❤️" 
                    : "You did extraordinarily well! With scores like this, the official 2025/2026 examination will be a breeze! 🌸")
                : (user?.username === 'mariel' 
                    ? "Do not be discouraged at all, Mariel! Every question you practice today makes you stronger tomorrow. Ian believes in you 100% and will support you every single step! 🌸💪" 
                    : "Do not be discouraged at all! Every question you practice today makes you stronger tomorrow. Keep up the great effort! 🌸💪")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Certificate (印刷・PDF保存)</span>
            </button>

            <button
              onClick={startExam}
              className="px-5 py-2.5 rounded-xl bg-sakura-500 hover:bg-sakura-600 text-white font-bold text-xs flex items-center gap-2 shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Examination (再受験)</span>
            </button>

            <button
              onClick={() => {
                setExamStarted(false);
                setExamCompleted(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
            >
              Back to Test Selection (試験一覧に戻る)
            </button>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">
            Full Question Review (全問解説と正解)
          </h3>
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctAnswerIndex;
              return (
                <div 
                  key={q.id || idx}
                  className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm ${
                    isCorrect ? 'border-emerald-200 dark:border-emerald-900/50' : 'border-rose-200 dark:border-rose-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <span className="font-bold text-slate-500">
                      Q{idx + 1} • {q.sectionName}
                    </span>
                    <span className={`font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <div className="text-sm font-japanese font-medium text-slate-800 dark:text-slate-100 whitespace-pre-line mb-3">
                    {q.question}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isKey = optIdx === q.correctAnswerIndex;
                      const isUser = optIdx === userAns;
                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between ${
                            isKey 
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 font-bold text-emerald-900 dark:text-emerald-200' 
                              : isUser && !isKey
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-900 dark:text-rose-200 line-through'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <span>{opt}</span>
                          {isKey && <span className="text-[10px] text-emerald-700 font-bold">Key ✓</span>}
                          {isUser && !isKey && <span className="text-[10px] text-rose-600 font-bold">Your answer</span>}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
                      💡 {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: LIVE REAL-TIME CBT EXAM RUNNER
  // -------------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fadeIn">
      {/* Official Prometric CBT Top Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg mb-6 sticky top-16 z-30 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Examinee & Test Information */}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Prometric Live CBT Proctored Session
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Examinee: {user?.displayName || 'Mariel (マリエル様)'}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              {activeExamType === 'JFT' ? `JFT-Basic Official Exam #${selectedSimulationTest}` : `JLPT N4 Official Exam #${selectedSimulationTest}`}
              <span className="text-xs font-normal text-slate-400 ml-2">
                (Question {currentIndex + 1} of {questions.length})
              </span>
            </div>
          </div>

          {/* Countdown & Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Review Grid Palette Trigger */}
            <button
              onClick={() => setShowReviewPaletteModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Grid className="w-3.5 h-3.5 text-amber-400" />
              <span>Question Palette (一覧)</span>
            </button>

            {/* Countdown Clock */}
            <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold border ${
              timeLeft < 300 
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse' 
                : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}>
              <Timer className="w-4 h-4 text-sakura-400" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            {/* Finish Exam */}
            <button
              onClick={handleSubmitExam}
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-sm"
            >
              Finish Exam (終了)
            </button>
          </div>
        </div>

        {/* 4 Section Navigator Indicators (Mobile 2x2, Desktop 4x1) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px] font-semibold">
          {[
            { id: 1, name: '1. 文字・語彙 (Vocab)', range: [0, 14] },
            { id: 2, name: '2. 文法・表現 (Grammar)', range: [15, 29] },
            { id: 3, name: '3. 聴解 (Listening)', range: [30, 44] },
            { id: 4, name: '4. 読解 (Reading)', range: [45, 59] }
          ].map(sec => {
            const isActiveSec = currentIndex >= sec.range[0] && currentIndex <= sec.range[1];
            return (
              <button
                key={sec.id}
                onClick={() => setCurrentIndex(sec.range[0])}
                className={`py-2 px-2.5 rounded-xl text-center transition-all truncate text-xs ${
                  isActiveSec 
                    ? 'bg-sakura-500 text-white font-bold shadow-md shadow-sakura-500/25' 
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {sec.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main CBT Screen */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
        {/* Top Control Bar inside Question */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold flex items-center justify-center text-sm">
              {currentIndex + 1}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              {currentQ?.sectionName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Play Audio Button */}
            <button
              onClick={playQuestionAudio}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isPlayingAudio
                  ? 'bg-sakura-500 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-sakura-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
              title="Stream authentic native Japanese audio via Cloudflare Edge Neural TTS"
            >
              <Volume2 className="w-4 h-4 text-sakura-500" />
              <span>{isPlayingAudio ? 'Playing...' : 'Play Audio (音声再生)'}</span>
              {audioPlayCount[currentIndex] && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/30 text-white font-mono">
                  {audioPlayCount[currentIndex]}x
                </span>
              )}
            </button>

            {/* Flag Checkbox */}
            <button
              onClick={handleToggleFlag}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                flagged[currentIndex]
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-amber-50'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${flagged[currentIndex] ? 'fill-amber-500' : ''}`} />
              <span>{flagged[currentIndex] ? 'Review Later (要確認)' : 'Flag for Review'}</span>
            </button>
          </div>
        </div>

        {/* Listening Comprehension Soundwave Box when in Section 3 */}
        {isListeningSec && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-sakura-500/10 to-indigo-500/10 border border-amber-300/40 dark:border-amber-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <Headphones className="w-6 h-6 text-amber-600 animate-bounce shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-white">
                  Section 3: Audio Dialogue Listening Task (聴解音声課題)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Click "Play Audio" to listen to the dialogue in authentic native Japanese.
                </div>
              </div>
            </div>

            <button
              onClick={playQuestionAudio}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingAudio ? 'Audio Playing...' : 'Listen to Audio'}</span>
            </button>
          </div>
        )}

        {/* Question Prompt */}
        <div className="mb-6">
          <div className="text-base sm:text-lg font-japanese font-medium text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 shadow-inner">
            {currentQ?.question}
          </div>
        </div>

        {/* 4 Choices */}
        <div className="space-y-3 mb-8">
          {currentQ?.options.map((opt, optIdx) => {
            const isSelected = userAnswers[currentIndex] === optIdx;
            return (
              <button
                key={optIdx}
                onClick={() => handleSelectAnswer(optIdx)}
                className={`w-full min-h-[56px] p-4 rounded-2xl text-left text-sm font-medium transition-all duration-200 flex items-center justify-between border cursor-pointer select-none active:scale-[0.985] ${
                  isSelected
                    ? 'bg-gradient-to-r from-sakura-500/10 via-sakura-50/50 to-pink-500/10 dark:from-sakura-950/40 dark:to-pink-950/30 border-sakura-500 text-slate-900 dark:text-white shadow-3d-sakura ring-2 ring-sakura-400/40 translate-y-[-1px]'
                    : 'bg-white/90 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/80 hover:border-sakura-300 dark:hover:border-sakura-700 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3.5 pr-2">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-transform ${
                      isSelected
                        ? 'bg-gradient-to-br from-sakura-500 to-pink-600 text-white shadow-md shadow-sakura-500/30 scale-105'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="font-japanese text-sm sm:text-base leading-relaxed">{opt}</span>
                </div>
                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-sakura-500 shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 opacity-40" />
                )}
              </button>
            );
          })}
        </div>

        {/* Prometric Bottom Navigation Bar */}
        <div className="flex items-center justify-between gap-2 pt-5 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex-1 sm:flex-initial px-4 sm:px-5 py-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
            <span className="hidden sm:inline">(前へ)</span>
          </button>

          <button
            onClick={() => setShowReviewPaletteModal(true)}
            className="text-xs font-mono text-slate-500 hover:text-sakura-500 transition-colors py-2 px-2 text-center"
          >
            <span className="font-bold text-slate-800 dark:text-white">{currentIndex + 1}</span>
            <span className="text-slate-400">/{questions.length}</span>
            <span className="hidden sm:inline text-slate-400"> • Review Grid</span>
          </button>

          <button
            onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentIndex === questions.length - 1}
            className="flex-1 sm:flex-initial px-4 sm:px-5 py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 disabled:opacity-40 transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md"
          >
            <span>Next</span>
            <span className="hidden sm:inline">(次へ)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Review Palette Modal */}
      {showReviewPaletteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-scaleUp max-h-[85vh] flex flex-col">
            {/* Mobile Drag Indicator */}
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4 shrink-0">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  Question Palette & Status Grid (問題一覧)
                </h3>
                <p className="text-xs text-slate-400">
                  Answered: {Object.keys(userAnswers).length} / {questions.length} • Click any question number to jump directly.
                </p>
              </div>

              <button
                onClick={() => setShowReviewPaletteModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 overflow-y-auto p-1 scrollbar-thin flex-1">
              {questions.map((_, idx) => {
                const isAnswered = userAnswers[idx] !== undefined;
                const isFlag = flagged[idx];
                const isCurrent = currentIndex === idx;

                let btnBg = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
                if (isAnswered) btnBg = 'bg-emerald-500 text-white font-bold';
                if (isFlag) btnBg = 'bg-amber-400 text-slate-900 font-bold';

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowReviewPaletteModal(false);
                    }}
                    className={`h-11 sm:h-10 rounded-xl text-xs font-mono transition-all flex items-center justify-center relative active:scale-95 ${btnBg} ${
                      isCurrent ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                    }`}
                  >
                    {idx + 1}
                    {isFlag && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" /> Answered
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" /> Unanswered
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400" /> Flagged
                </span>
              </div>

              <button
                onClick={() => setShowReviewPaletteModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs active:scale-95"
              >
                Close Palette (閉じる)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
