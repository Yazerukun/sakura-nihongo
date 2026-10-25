import React, { useState } from 'react';
import { KANA_LIST, KanaChar } from '../data/kana_data';
import { japaneseVoice } from '../utils/audio';
import { Volume2, Sparkles, HelpCircle } from 'lucide-react';

export const KanaMaster: React.FC = () => {
  const [scriptType, setScriptType] = useState<'hiragana' | 'katakana'>('hiragana');
  const [filterGroup, setFilterGroup] = useState<'all' | 'basic' | 'dakuten'>('all');
  const [selectedChar, setSelectedChar] = useState<KanaChar | null>(null);

  const filtered = KANA_LIST.filter(k => {
    if (filterGroup === 'basic') return k.group !== 'dakuten' && k.group !== 'combo';
    if (filterGroup === 'dakuten') return k.group === 'dakuten';
    return true;
  });

  const handleCharClick = (char: KanaChar) => {
    setSelectedChar(char);
    japaneseVoice.speak(char.hiragana);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span>かな Kana Matrix • Hiragana & Katakana</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive sound board, stroke guide, and mnemonic memory hooks
          </p>
        </div>

        {/* Script Type & Group toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Hiragana / Katakana switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setScriptType('hiragana')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                scriptType === 'hiragana'
                  ? 'bg-sakura-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              ひらがな (Hiragana)
            </button>
            <button
              onClick={() => setScriptType('katakana')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                scriptType === 'katakana'
                  ? 'bg-sakura-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              カタカナ (Katakana)
            </button>
          </div>

          {/* Group Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFilterGroup('all')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterGroup === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterGroup('basic')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterGroup === 'basic' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Basic 46
            </button>
            <button
              onClick={() => setFilterGroup('dakuten')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterGroup === 'dakuten' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Tenten (が/ぱ)
            </button>
          </div>
        </div>
      </div>

      {/* Kana Matrix Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-8">
        {filtered.map((item, idx) => {
          const char = scriptType === 'hiragana' ? item.hiragana : item.katakana;
          const isSelected = selectedChar?.romaji === item.romaji;
          return (
            <button
              key={idx}
              onClick={() => handleCharClick(item)}
              className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-between group relative ${
                isSelected
                  ? 'bg-sakura-500 border-sakura-600 text-white shadow-lg shadow-sakura-500/25 scale-105'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-sakura-300 dark:hover:border-slate-700 hover:scale-[1.02] shadow-sm'
              }`}
            >
              <div
                className={`text-2xl sm:text-3xl font-serif font-black mb-1 ${
                  isSelected ? 'text-white' : 'text-slate-800 dark:text-white'
                }`}
              >
                {char}
              </div>

              <div
                className={`text-[11px] font-mono font-bold ${
                  isSelected ? 'text-white/90' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {item.romaji}
              </div>

              {/* Speaker Hover Icon */}
              <div
                className={`absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isSelected ? 'text-white' : 'text-sakura-400'
                }`}
              >
                <Volume2 className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Mnemonic Detail Card */}
      {selectedChar && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sakura-200 dark:border-slate-800 p-6 shadow-md flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sakura-500 to-sakura-400 text-white flex flex-col items-center justify-center shadow-lg shadow-sakura-500/20 flex-shrink-0">
            <div className="text-4xl font-serif font-black">
              {scriptType === 'hiragana' ? selectedChar.hiragana : selectedChar.katakana}
            </div>
            <div className="text-xs font-mono font-bold opacity-90">{selectedChar.romaji}</div>
          </div>

          <div className="flex-grow text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-xs font-bold text-sakura-600 dark:text-sakura-400 uppercase tracking-widest">
                Mnemonic Memory Hook (覚え方)
              </span>
              <button
                onClick={() => japaneseVoice.speak(selectedChar.hiragana)}
                className="p-1 rounded-full bg-sakura-50 dark:bg-slate-800 text-sakura-500 hover:bg-sakura-100 transition-colors"
                title="Hear audio again"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-base font-medium text-slate-800 dark:text-slate-100 mb-2">
              💡 {selectedChar.mnemonic}
            </p>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              Hiragana: <span className="font-serif font-bold text-slate-700 dark:text-slate-200">{selectedChar.hiragana}</span> • Katakana: <span className="font-serif font-bold text-slate-700 dark:text-slate-200">{selectedChar.katakana}</span> • Romaji: <span className="font-mono">{selectedChar.romaji}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
