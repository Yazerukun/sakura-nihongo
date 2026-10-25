import React, { useState, useEffect } from 'react';
import { LevelType, JLPTQuizQuestion } from '../types';
import jlptQuizzes from '../data/jlpt_quizzes.json';
import jftCbtExams from '../data/jft_cbt_exams.json';
import { japaneseVoice } from '../utils/audio';
import { recordStudySession } from '../utils/storage';
import { 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizViewProps {
  level: LevelType;
}

export const QuizView: React.FC<QuizViewProps> = ({ level }) => {
  const [questions, setQuestions] = useState<JLPTQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    loadQuizData();
  }, [level]);

  const loadQuizData = () => {
    let pool: JLPTQuizQuestion[] = [];
    if (level === 'JFT') {
      pool = (jftCbtExams as any[]).map(q => ({
        id: q.id,
        level: 'JFT-A2',
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation || 'JFT practical Japanese question'
      }));
    } else {
      pool = (jlptQuizzes as Record<string, any[]>)[level] || [];
    }

    // Shuffle and pick 15
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 15);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const currentQ = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctAnswerIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    recordStudySession(0.3, 1, isCorrect ? 1 : 0);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      if (score >= questions.length * 0.7) {
        confetti({ particleCount: 50, spread: 60 });
      }
    }
  };

  const handleSpeak = () => {
    if (!currentQ) return;
    japaneseVoice.speak(currentQ.question);
  };

  if (!currentQ) {
    return (
      <div className="text-center py-16 text-slate-400">
        Loading quiz bank...
      </div>
    );
  }

  if (quizFinished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sakura-100 dark:border-slate-800 p-8 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-sakura-50 dark:bg-slate-800 text-sakura-500 mx-auto flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-slate-800 dark:text-white mb-1">
            Drill Complete! お疲れ様でした！
          </h2>
          <p className="text-xs text-slate-400 mb-6">Daily rapid revision finished.</p>

          <div className="text-5xl font-black font-mono text-slate-800 dark:text-white mb-2">
            {score} <span className="text-2xl text-slate-400">/ {questions.length}</span>
          </div>
          <div className="text-sm font-bold text-sakura-600 dark:text-sakura-400 mb-8">
            {pct}% Correct
          </div>

          <button
            onClick={loadQuizData}
            className="px-6 py-3 rounded-2xl bg-sakura-500 hover:bg-sakura-600 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Another Set</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Quiz Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-bold text-slate-500">
          Question {currentIndex + 1} of {questions.length} • {level} Drill
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
            Score: {score}
          </span>
          <button
            onClick={handleSpeak}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sakura-500 transition-colors"
            title="Read out loud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-sakura-400 to-sakura-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sakura-100 dark:border-slate-800 p-6 sm:p-8 shadow-lg mb-6">
        <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-800 dark:text-white whitespace-pre-line leading-relaxed mb-6">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, i) => {
            const isKey = currentQ.correctAnswerIndex === i;
            const isUser = selectedOption === i;

            let btnStyle = 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sakura-300';
            if (isAnswered) {
              if (isKey) {
                btnStyle = 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold';
              } else if (isUser && !isKey) {
                btnStyle = 'bg-rose-100 dark:bg-rose-950/50 border-rose-400 text-rose-900 dark:text-rose-200';
              } else {
                btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => handleSelect(i)}
                className={`w-full p-3.5 rounded-2xl text-left text-sm font-medium border transition-all flex items-center justify-between ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white/70 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-serif">{opt}</span>
                </div>

                {isAnswered && isKey && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {isAnswered && isUser && !isKey && <XCircle className="w-5 h-5 text-rose-600" />}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation */}
        {isAnswered && (
          <div className="mt-6 p-4 rounded-2xl bg-sakura-50/60 dark:bg-slate-800/60 border border-sakura-100 dark:border-slate-700 text-xs leading-relaxed">
            <div className="font-bold text-sakura-700 dark:text-sakura-300 flex items-center gap-1.5 mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Explanation:</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {/* Next Question Button */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-sakura-500 hover:bg-sakura-600 shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>{currentIndex + 1 === questions.length ? 'See Final Score' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
