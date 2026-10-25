import React, { useState, useEffect } from 'react';
import { LevelType } from '../types';
import { japaneseVoice } from '../utils/audio';
import { japaneseRecognizer, calculateAccuracy } from '../utils/speechRecognition';
import { Mic, MicOff, Volume2, Sparkles, CheckCircle2, RotateCcw, Award, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VoicePracticePrompt {
  id: string;
  japanese: string;
  furigana: string;
  romaji: string;
  english: string;
  category: string;
}

const VOICE_PROMPTS: Record<string, VoicePracticePrompt[]> = {
  JFT: [
    {
      id: 'v1',
      japanese: 'すみません、これを温めてください。',
      furigana: 'すみません、これをあたためてください。',
      romaji: 'Sumimasen, kore o atatamete kudasai.',
      english: 'Excuse me, please heat this up for me. (Convenience store)',
      category: 'Shopping & Food (買い物)'
    },
    {
      id: 'v2',
      japanese: 'お疲れ様でした。お先に失礼します。',
      furigana: 'おつかれさまでした。おさきにしつれいします。',
      romaji: 'Otsukaresama deshita. Osaki ni shitsurei shimasu.',
      english: 'Thank you for your hard work today. I will leave first.',
      category: 'Workplace Greetings (職場)'
    },
    {
      id: 'v3',
      japanese: '頭が痛いので、少し休んでもいいですか。',
      furigana: 'あたまがいたいので、すこしやすんでもいいですか。',
      romaji: 'Atama ga itai node, sukoshi yasunde mo ii desu ka.',
      english: 'I have a headache, may I rest for a moment?',
      category: 'Health & Permission (体調・許可)'
    },
    {
      id: 'v4',
      japanese: '燃えるゴミの日は何曜日ですか。',
      furigana: 'もえるごみのひはなんようびですか。',
      romaji: 'Moeru gomi no hi wa nan-youbi desu ka.',
      english: 'Which day of the week is burnable garbage day?',
      category: 'Daily Living (生活ルール)'
    },
    {
      id: 'v5',
      japanese: '駅からここまで歩いて十分くらいです。',
      furigana: 'えきからここであるいてじゅっぷんくらいです。',
      romaji: 'Eki kara koko made aruite juppun kurai desu.',
      english: 'It takes about 10 minutes walking from the station to here.',
      category: 'Directions (道案内)'
    }
  ],
  N5: [
    {
      id: 'n5_1',
      japanese: 'はじめまして。よろしくお願いします。',
      furigana: 'はじめまして。よろしくおねがいします。',
      romaji: 'Hajimemashite. Yoroshiku onegaishimasu.',
      english: 'Nice to meet you. Please treat me well.',
      category: 'Introductions'
    },
    {
      id: 'n5_2',
      japanese: '毎朝七時に起きて、朝ごはんを食べます。',
      furigana: 'まいあさしちじにおきて、あさごはんをたべます。',
      romaji: 'Maiasa shichiji ni okite, asagohan o tabemasu.',
      english: 'I wake up at 7:00 every morning and eat breakfast.',
      category: 'Daily Routine'
    },
    {
      id: 'n5_3',
      japanese: '日本で桜を見たいです。',
      furigana: 'にほんでさくらをみたいです。',
      romaji: 'Nihon de sakura o mitai desu.',
      english: 'I want to see the cherry blossoms in Japan.',
      category: 'Desires & Plans'
    }
  ],
  N4: [
    {
      id: 'n4_1',
      japanese: '日本語が上手に話せるようになりたいです。',
      furigana: 'にほんごがじょうずにはなせるようになりたいです。',
      romaji: 'Nihongo ga jouzu ni hanaseru you ni naritai desu.',
      english: 'I want to become able to speak Japanese skillfully.',
      category: 'Ability & Goals'
    },
    {
      id: 'n4_2',
      japanese: '雨が降っても、散歩に行きます。',
      furigana: 'あめがふっても、さんぽにいきます。',
      romaji: 'Ame ga futtemo, sanpo ni ikimasu.',
      english: 'Even if it rains, I will go for a walk.',
      category: 'Conditionals'
    }
  ],
  N3: [
    {
      id: 'n3_1',
      japanese: '将来、日本で働くつもりです。',
      furigana: 'しょうらい、にほんではたらくつもりです。',
      romaji: 'Shourai, nihon de hataraku tsumori desu.',
      english: 'In the future, I intend to work in Japan.',
      category: 'Intentions & Career'
    }
  ],
  N2: [
    {
      id: 'n2_1',
      japanese: '経験を積むにつれて、自信がついてきた。',
      furigana: 'けいけんをつむにつれて、じしんがついてきた。',
      romaji: 'Keiken o tsumu ni tsurete, jishin ga tsuite kita.',
      english: 'As I gained experience, my confidence grew.',
      category: 'Upper-Intermediate'
    }
  ],
  N1: [
    {
      id: 'n1_1',
      japanese: 'いかなる困難があろうとも、最後までやり抜く。',
      furigana: 'いかなるこんなんがあろうとも、さいごまでやりぬく。',
      romaji: 'Ikanaru konnan ga arou tomo, saigo made yarinuku.',
      english: 'No matter what hardships arise, I will persevere until the end.',
      category: 'Advanced Mastery'
    }
  ]
};

export const RealTimeVoiceTrainer: React.FC<{ level: LevelType }> = ({ level }) => {
  const promptList = VOICE_PROMPTS[level] || VOICE_PROMPTS['JFT'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const currentPrompt = promptList[currentIndex] || promptList[0];

  useEffect(() => {
    setCurrentIndex(0);
    setSpokenTranscript('');
    setAccuracy(null);
    setFeedback('');
    setIsRecording(false);
  }, [level]);

  const handleStartSpeaking = () => {
    if (!japaneseRecognizer.isSupported) {
      alert('Speech Recognition is supported in Chrome, Edge, and modern browsers. Please ensure microphone access is permitted.');
      return;
    }

    setSpokenTranscript('');
    setAccuracy(null);
    setFeedback('');
    setIsRecording(true);

    japaneseRecognizer.start(
      (transcript, isFinal) => {
        setSpokenTranscript(transcript);
        if (isFinal) {
          setIsRecording(false);
          evaluateSpeech(transcript);
        }
      },
      (err) => {
        setIsRecording(false);
        console.warn('Voice error:', err);
      }
    );
  };

  const handleStopSpeaking = () => {
    setIsRecording(false);
    japaneseRecognizer.stop();
    if (spokenTranscript) {
      evaluateSpeech(spokenTranscript);
    }
  };

  const evaluateSpeech = (spoken: string) => {
    const target = currentPrompt.japanese;
    const targetFurigana = currentPrompt.furigana;

    // Compare with both kanji and pure hiragana
    const acc1 = calculateAccuracy(spoken, target);
    const acc2 = calculateAccuracy(spoken, targetFurigana);
    const finalScore = Math.max(acc1, acc2);

    setAccuracy(finalScore);

    if (finalScore >= 90) {
      setFeedback('完璧です！ (Perfect pronunciation!) 🎉');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else if (finalScore >= 70) {
      setFeedback('上手ですね！ (Very good, easily understood!) ✨');
    } else {
      setFeedback('もう少し！ Listen to the audio and try once more. 💪');
    }
  };

  const handlePlayAudio = () => {
    japaneseVoice.speak(currentPrompt.japanese);
  };

  const handleNextPrompt = () => {
    setCurrentIndex((prev) => (prev + 1) % promptList.length);
    setSpokenTranscript('');
    setAccuracy(null);
    setFeedback('');
    setIsRecording(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sakura-100 dark:bg-sakura-900/40 text-sakura-700 dark:text-sakura-300 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Voice Recognition & Speaking Assessor</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-800 dark:text-white">
          リアルタイム音声・発音トレーニング
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Speak Japanese directly into your microphone. The AI engine listens in real-time, grades your pronunciation accuracy, and gives immediate feedback!
        </p>
      </div>

      {/* Target Phrase Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sakura-100 dark:border-slate-800 p-6 sm:p-8 shadow-xl text-center relative overflow-hidden mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-4">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {currentPrompt.category}
          </span>
          <span>Phrase {currentIndex + 1} of {promptList.length}</span>
        </div>

        {/* Furigana */}
        <div className="text-sm sm:text-base font-serif text-sakura-500 dark:text-sakura-400 tracking-wider mb-1">
          {currentPrompt.furigana}
        </div>

        {/* Japanese Main */}
        <div className="text-2xl sm:text-4xl font-serif font-black text-slate-800 dark:text-white leading-relaxed my-2">
          {currentPrompt.japanese}
        </div>

        {/* Romaji */}
        <div className="text-xs font-mono text-slate-400 mb-2">
          {currentPrompt.romaji}
        </div>

        {/* English */}
        <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-6">
          "{currentPrompt.english}"
        </div>

        {/* Audio Model Button */}
        <button
          onClick={handlePlayAudio}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-sakura-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm"
        >
          <Volume2 className="w-4 h-4 text-sakura-500" />
          <span>Listen to Native Audio (音声を聞く)</span>
        </button>
      </div>

      {/* Real-time Voice Capture Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-md text-center mb-6">
        <div className="mb-4">
          <button
            onClick={isRecording ? handleStopSpeaking : handleStartSpeaking}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all transform active:scale-95 shadow-xl ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-500/20'
                : 'bg-gradient-to-tr from-sakura-500 to-sakura-600 hover:from-sakura-600 hover:to-sakura-700 text-white shadow-sakura-500/30'
            }`}
            title={isRecording ? 'Click to stop and evaluate' : 'Click and speak in Japanese'}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>

          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-3">
            {isRecording ? (
              <span className="text-rose-500 font-bold flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Listening to your Japanese speech in real-time...
              </span>
            ) : (
              'Click microphone and speak the sentence'
            )}
          </div>
        </div>

        {/* Real-Time Live Transcript */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 min-h-[56px] flex items-center justify-center text-sm font-serif">
          {spokenTranscript ? (
            <span className="text-slate-800 dark:text-slate-100 font-bold">
              "{spokenTranscript}"
            </span>
          ) : (
            <span className="text-slate-400 italic text-xs">
              Spoken words will transcribe here in real-time...
            </span>
          )}
        </div>

        {/* Real-time Scoring Meter */}
        {accuracy !== null && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="text-4xl font-mono font-black mb-1">
              <span
                className={
                  accuracy >= 80 ? 'text-emerald-500' : accuracy >= 60 ? 'text-amber-500' : 'text-rose-500'
                }
              >
                {accuracy}%
              </span>
              <span className="text-xs font-sans text-slate-400 ml-1.5 font-normal">Pronunciation Accuracy</span>
            </div>

            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-4">
              {feedback}
            </p>

            <button
              onClick={handleNextPrompt}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-sakura-500 hover:bg-sakura-600 transition-all shadow-md inline-flex items-center gap-1.5"
            >
              <span>Next Practice Phrase</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
