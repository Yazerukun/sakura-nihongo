import React, { useState } from 'react';
import { TE_FORM_RULES, PARTICLES_LIST, COUNTERS_LIST } from '../data/cheatsheets';
import { japaneseVoice } from '../utils/audio';
import { Bookmark, Volume2, Sparkles, Layers, ListChecks } from 'lucide-react';

export const CheatsheetView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'te-form' | 'particles' | 'counters'>('te-form');

  const handleSpeak = (text: string) => {
    japaneseVoice.speak(text);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-sakura-500" />
            <span>Japanese Cheatsheets & Grammar Matrix</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Conjugation charts, particle rules, and counter references for high-speed review
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('te-form')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'te-form'
                ? 'bg-sakura-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Te-Form Conjugation
          </button>
          <button
            onClick={() => setActiveTab('particles')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'particles'
                ? 'bg-sakura-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Core Particles (助詞)
          </button>
          <button
            onClick={() => setActiveTab('counters')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'counters'
                ? 'bg-sakura-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Counters (助数詞)
          </button>
        </div>
      </div>

      {/* Te-Form Tab */}
      {activeTab === 'te-form' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sakura-50/70 dark:bg-slate-800/60 border border-sakura-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
            💡 <strong>Why Te-form is the key to Japanese:</strong> Te-form connects clauses, asks for permission (〜てもいいですか), gives polite instructions (〜てください), expresses ongoing actions (〜ています), and forms polite prohibitions (〜てはいけません)!
          </div>

          <div className="grid grid-cols-1 gap-4">
            {TE_FORM_RULES.map((rule, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:border-sakura-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sakura-100 dark:bg-sakura-900/40 text-sakura-700 dark:text-sakura-300">
                      {rule.group}
                    </span>
                    <span className="ml-2 font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
                      Endings: {rule.endings}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {rule.rule}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-washi-50/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Dictionary → Te-form:</div>
                    <div className="font-serif font-black text-sm sm:text-base text-slate-800 dark:text-white mt-0.5">
                      {rule.exampleBase} → <span className="text-sakura-600 dark:text-sakura-400">{rule.exampleTe}</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {rule.meaning}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpeak(rule.exampleTe)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-sakura-500 shadow-sm"
                    title="Pronounce"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {rule.note && (
                  <div className="mt-2.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                    {rule.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Particles Tab */}
      {activeTab === 'particles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PARTICLES_LIST.map((p, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-9 h-9 rounded-2xl bg-sakura-500 text-white font-serif font-black text-lg flex items-center justify-center shadow-md shadow-sakura-500/20">
                        {p.particle}
                      </span>
                      <div>
                        <div className="text-xs font-mono font-bold text-slate-400">{p.romaji}</div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white">{p.coreFunction}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSpeak(p.exampleJp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sakura-500 transition-colors"
                      title="Listen"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {p.keyRule}
                  </p>

                  <div className="p-3 rounded-xl bg-washi-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <div className="font-serif font-bold text-slate-800 dark:text-slate-100">
                      {p.exampleJp}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {p.exampleEn}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-rose-600 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-950/30 p-2 rounded-lg">
                  ⚠️ <strong>Pitfall:</strong> {p.commonPitfall}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Counters Tab */}
      {activeTab === 'counters' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {COUNTERS_LIST.map((c, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-serif font-black text-sakura-600 dark:text-sakura-400">
                  {c.counter}
                </span>
                <span className="text-xs font-mono text-slate-400">{c.furigana}</span>
              </div>

              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                Used for: {c.usage}
              </div>

              <div className="space-y-1 text-xs font-serif bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                {c.examples.map((ex, exIdx) => (
                  <div
                    key={exIdx}
                    className="flex items-center justify-between text-slate-600 dark:text-slate-300"
                  >
                    <span>{ex}</span>
                    <button
                      onClick={() => handleSpeak(ex)}
                      className="text-slate-400 hover:text-sakura-500"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
