import React, { useState, useEffect } from 'react';
import { LevelType } from '../types';
import jftVocab from '../data/jft_vocab.json';
import jlptN4Vocab from '../data/jlpt_n4_vocab.json';
import jlptN5Vocab from '../data/jlpt_n5_vocab.json';
import { japaneseVoice } from '../utils/audio';
import { updateSRSBox, getSRSBoxes, recordStudySession } from '../utils/storage';
import { 
  Volume2, 
  RotateCw, 
  Shuffle, 
  Eye, 
  EyeOff, 
  Check, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Bookmark
} from 'lucide-react';

interface FlashcardDeckProps {
  level: LevelType;
}

interface CardItem {
  id: string;
  kanji: string;
  furigana: string;
  meaning: string;
  category: string;
  level: string;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ level }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFurigana, setShowFurigana] = useState(true);
  const [srsBoxes, setSrsBoxes] = useState<Record<string, number>>({});
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadDeck();
    setSrsBoxes(getSRSBoxes());
  }, [level]);

  const loadDeck = () => {
    let items: CardItem[] = [];

    if (level === 'JFT') {
      items = (jftVocab as any[]).map(v => ({
        id: v.id,
        kanji: v.kanji,
        furigana: v.furigana,
        meaning: v.meaning_id,
        category: v.category || 'JFT A2',
        level: 'JFT-A2'
      }));
    } else if (level === 'N4') {
      items = (jlptN4Vocab as any[]).map((v, i) => ({
        id: v.id || `jlpt_n4_${i}`,
        kanji: v.japanese,
        furigana: v.reading,
        meaning: v.meanings.join(', '),
        category: v.type || 'JLPT N4 Core',
        level: 'N4'
      }));
    } else {
      items = (jlptN5Vocab as any[]).map((v, i) => ({
        id: `jlpt_n5_${i}`,
        kanji: v.japanese,
        furigana: v.reading,
        meaning: v.meanings.join(', '),
        category: v.tags?.join(' ') || 'JLPT N5 Core',
        level: v.jlpt_level || 'N5'
      }));
    }

    setCards(items);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleShuffle = () => {
    setCards(prev => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpeech = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentCard) return;
    japaneseVoice.speak(currentCard.kanji || currentCard.furigana);
  };

  const handleSRS = (delta: number) => {
    if (!currentCard) return;
    const newBox = updateSRSBox(currentCard.id, delta);
    setSrsBoxes(prev => ({ ...prev, [currentCard.id]: newBox }));
    recordStudySession(0.5, 1, delta > 0 ? 1 : 0);

    // Next card
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % cards.length);
    }, 150);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.key === '1') {
        handleSRS(-1);
      } else if (e.key === '2') {
        handleSRS(1);
      } else if (e.key === '3') {
        handleSRS(2);
      } else if (e.key === '4') {
        handleSRS(3);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => (prev + 1) % cards.length);
        setIsFlipped(false);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
        setIsFlipped(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards, currentIndex]);

  if (!currentCard) {
    return (
      <div className="text-center py-16 text-slate-400">
        Loading study cards...
      </div>
    );
  }

  const currentBox = srsBoxes[currentCard.id] || 0;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Controls Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">
            Card {currentIndex + 1} of {cards.length}
          </span>
          {/* SRS Box Level */}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sakura-100 dark:bg-sakura-900/40 text-sakura-700 dark:text-sakura-300">
            SRS Box {currentBox}/5
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Furigana Toggle */}
          <button
            onClick={() => setShowFurigana(!showFurigana)}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showFurigana
                ? 'bg-sakura-100 text-sakura-700 dark:bg-sakura-900/40 dark:text-sakura-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
            title="Toggle Furigana (reading guide)"
          >
            {showFurigana ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Furigana</span>
          </button>

          {/* Shuffle Button */}
          <button
            onClick={handleShuffle}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sakura-600 transition-colors"
            title="Shuffle Deck"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        className="w-full h-80 sm:h-96 rounded-3xl cursor-pointer select-none perspective-1000 group relative transition-transform duration-200 active:scale-[0.99]"
      >
        <div
          className={`relative w-full h-full rounded-3xl shadow-xl transition-all duration-500 transform-style-3d border ${
            isFlipped
              ? 'bg-gradient-to-tr from-sakura-500 to-sakura-600 border-sakura-600 text-white'
              : 'bg-white dark:bg-slate-900 border-sakura-100 dark:border-slate-800 text-slate-800 dark:text-white'
          } p-8 flex flex-col justify-between overflow-hidden`}
        >
          {/* Subtle background calligraphy watermark */}
          <div className="absolute right-4 bottom-2 text-7xl font-serif opacity-5 pointer-events-none select-none">
            {currentCard.kanji}
          </div>

          {/* Card Top Meta */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <span
              className={`px-2.5 py-1 rounded-full ${
                isFlipped
                  ? 'bg-white/20 text-white'
                  : 'bg-sakura-50 dark:bg-slate-800 text-sakura-600 dark:text-sakura-400'
              }`}
            >
              {currentCard.category}
            </span>

            {/* Audio Button */}
            <button
              onClick={handleSpeech}
              className={`p-2 rounded-full transition-colors ${
                isFlipped
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-slate-100 hover:bg-sakura-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              title="Play Pronunciation"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Card Center Content */}
          <div className="text-center my-auto">
            {!isFlipped ? (
              <>
                {/* Furigana */}
                {showFurigana && currentCard.furigana && (
                  <div className="text-sm sm:text-base font-serif text-sakura-500 dark:text-sakura-400 mb-2 tracking-widest">
                    {currentCard.furigana}
                  </div>
                )}
                {/* Kanji / Main Prompt */}
                <div className="text-4xl sm:text-6xl font-serif font-black tracking-tight mb-3">
                  {currentCard.kanji}
                </div>
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                  <RotateCw className="w-3 h-3" />
                  <span>Click or press Space to reveal meaning</span>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="text-sm font-serif opacity-80 tracking-widest">
                  {currentCard.furigana}
                </div>
                <div className="text-2xl sm:text-4xl font-sans font-bold leading-snug">
                  {currentCard.meaning}
                </div>
                <div className="text-xs opacity-75 font-mono">
                  {currentCard.kanji}
                </div>
              </div>
            )}
          </div>

          {/* Card Bottom Helper */}
          <div className="text-center text-[11px] opacity-60">
            {isFlipped ? 'How well did you know this word?' : 'Hint: Press Space to flip • 1-4 for SRS rating'}
          </div>
        </div>
      </div>

      {/* SRS Rating Buttons (Visible when flipped or ready) */}
      <div className="mt-6 grid grid-cols-4 gap-2">
        <button
          onClick={() => handleSRS(-1)}
          className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all text-center"
        >
          <div className="text-sm font-mono">1</div>
          <div>Again (重)</div>
        </button>

        <button
          onClick={() => handleSRS(1)}
          className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold transition-all text-center"
        >
          <div className="text-sm font-mono">2</div>
          <div>Hard (難)</div>
        </button>

        <button
          onClick={() => handleSRS(2)}
          className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/50 border border-sky-200 dark:border-sky-900 text-sky-700 dark:text-sky-300 text-xs font-bold transition-all text-center"
        >
          <div className="text-sm font-mono">3</div>
          <div>Good (良)</div>
        </button>

        <button
          onClick={() => handleSRS(3)}
          className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all text-center"
        >
          <div className="text-sm font-mono">4</div>
          <div>Easy (易)</div>
        </button>
      </div>

      {/* Prev / Next Deck arrows */}
      <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
        <button
          onClick={() => {
            setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
            setIsFlipped(false);
          }}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Card</span>
        </button>

        <button
          onClick={() => {
            setCurrentIndex(prev => (prev + 1) % cards.length);
            setIsFlipped(false);
          }}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
        >
          <span>Next Card</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
