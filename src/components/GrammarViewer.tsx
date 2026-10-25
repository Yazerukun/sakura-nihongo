import React, { useState } from 'react';
import { LevelType, GrammarItem } from '../types';
import jlptGrammar from '../data/jlpt_grammar.json';
import { japaneseVoice } from '../utils/audio';
import { Search, Volume2, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface GrammarViewerProps {
  currentLevel: LevelType;
}

export const GrammarViewer: React.FC<GrammarViewerProps> = ({ currentLevel }) => {
  const [selectedLvl, setSelectedLvl] = useState<string>(currentLevel === 'JFT' ? 'N5' : currentLevel);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const grammarBank = (jlptGrammar as Record<string, GrammarItem[]>)[selectedLvl] || [];

  const filtered = grammarBank.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.pattern.toLowerCase().includes(q) ||
      item.meaning.toLowerCase().includes(q) ||
      item.romanization.toLowerCase().includes(q)
    );
  });

  const handleSpeak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    japaneseVoice.speak(text);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header and Level selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif font-black text-slate-800 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-sakura-500" />
            <span>Grammar Pattern Library (文法)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rules, sentence structures, and native example sentences with audio
          </p>
        </div>

        {/* Level Selector */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          {['N5', 'N4', 'N3', 'N2', 'N1'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLvl(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedLvl === lvl
                  ? 'bg-sakura-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={`Search ${selectedLvl} grammar patterns, meanings, or romaji (e.g. "must not", "kara", "te-form")...`}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400 shadow-sm"
        />
      </div>

      {/* Grammar Cards List */}
      <div className="space-y-4">
        {filtered.map(item => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:border-sakura-300 dark:hover:border-slate-700 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sakura-100 dark:bg-sakura-900/40 text-sakura-700 dark:text-sakura-300">
                      {item.jlpt_level}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {item.romanization}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-black text-slate-800 dark:text-white">
                    {item.pattern}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
                    {item.meaning}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={e => handleSpeak(item.pattern, e)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-sakura-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    title="Pronounce pattern"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Examples */}
              {isExpanded && item.examples && item.examples.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Example Sentences (例文):
                  </div>

                  {item.examples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="p-3.5 rounded-2xl bg-washi-50/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-serif font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                          {ex.japanese}
                        </div>
                        <button
                          onClick={e => handleSpeak(ex.japanese, e)}
                          className="p-1 rounded-lg text-slate-400 hover:text-sakura-500 transition-colors"
                          title="Listen to sentence"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        {ex.english}
                      </div>

                      {ex.breakdown && (
                        <div className="text-[11px] text-sakura-600 dark:text-sakura-400/90 font-mono">
                          💡 {ex.breakdown}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No grammar patterns match your search query.
          </div>
        )}
      </div>
    </div>
  );
};
