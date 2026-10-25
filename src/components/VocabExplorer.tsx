import React, { useState } from 'react';
import { LevelType } from '../types';
import jftVocab from '../data/jft_vocab.json';
import jlptN5Vocab from '../data/jlpt_n5_vocab.json';
import { japaneseVoice } from '../utils/audio';
import { toggleBookmark, getBookmarks } from '../utils/storage';
import { Search, Volume2, Bookmark, Eye, EyeOff, Sparkles, Filter } from 'lucide-react';

interface VocabExplorerProps {
  currentLevel: LevelType;
}

export const VocabExplorer: React.FC<VocabExplorerProps> = ({ currentLevel }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'jft' | 'n5'>('all');
  const [search, setSearch] = useState('');
  const [showFurigana, setShowFurigana] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>(getBookmarks());

  // Combine datasets
  const allVocab = [
    ...(jftVocab as any[]).map(v => ({
      id: v.id,
      kanji: v.kanji,
      furigana: v.furigana,
      meaning: v.meaning_id,
      source: 'JFT-A2 Irodori',
      category: v.category
    })),
    ...(jlptN5Vocab as any[]).map((v, i) => ({
      id: `jlpt_n5_${i}`,
      kanji: v.japanese,
      furigana: v.reading,
      meaning: v.meanings.join(', '),
      source: 'JLPT N5 Core',
      category: v.tags?.[0] || 'N5'
    }))
  ];

  const filtered = allVocab.filter(item => {
    if (activeTab === 'jft' && !item.source.includes('JFT')) return false;
    if (activeTab === 'n5' && !item.source.includes('N5')) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.kanji.toLowerCase().includes(q) ||
      item.furigana.toLowerCase().includes(q) ||
      item.meaning.toLowerCase().includes(q)
    );
  });

  const handleSpeak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    japaneseVoice.speak(text);
  };

  const handleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(id);
    setBookmarks(getBookmarks());
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span>語彙 Explorer • Vocabulary Bank</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            600+ Authentic words from Irodori A2 & JLPT N5 with native audio
          </p>
        </div>

        {/* Source Filter and Furigana Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-sakura-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({allVocab.length})
            </button>
            <button
              onClick={() => setActiveTab('jft')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'jft'
                  ? 'bg-sakura-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              JFT A2 (613)
            </button>
            <button
              onClick={() => setActiveTab('n5')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'n5'
                  ? 'bg-sakura-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              JLPT N5 (250)
            </button>
          </div>

          <button
            onClick={() => setShowFurigana(!showFurigana)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
              showFurigana
                ? 'bg-sakura-100 text-sakura-700 border-sakura-200 dark:bg-sakura-900/40 dark:border-slate-700 dark:text-sakura-300'
                : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle furigana visibility to test yourself"
          >
            {showFurigana ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by Kanji, Hiragana reading, or English meaning (e.g. 魚, さかな, water, eat)..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400 shadow-sm"
        />
      </div>

      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {filtered.slice(0, 150).map(item => {
          const isBookmarked = bookmarks.includes(item.id);
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm hover:border-sakura-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sakura-50 dark:bg-slate-800 text-sakura-700 dark:text-sakura-300">
                    {item.source}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={e => handleBookmark(item.id, e)}
                      className={`p-1 rounded-md transition-colors ${
                        isBookmarked ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
                      }`}
                      title="Bookmark for later review"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>
                    <button
                      onClick={e => handleSpeak(item.kanji || item.furigana, e)}
                      className="p-1 rounded-md text-slate-400 hover:text-sakura-500 hover:bg-sakura-50 dark:hover:bg-slate-800 transition-colors"
                      title="Listen to Japanese audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {showFurigana && (
                  <div className="text-xs font-serif text-sakura-500 dark:text-sakura-400 tracking-wider">
                    {item.furigana}
                  </div>
                )}

                <div className="text-2xl font-serif font-black text-slate-800 dark:text-white my-1">
                  {item.kanji}
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800/80">
                {item.meaning}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length > 150 && (
        <div className="text-center mt-6 text-xs text-slate-400">
          Showing first 150 of {filtered.length} matching words. Type in search to narrow down!
        </div>
      )}
    </div>
  );
};
