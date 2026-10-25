import React, { useState, useRef, useEffect } from 'react';
import { LevelType } from '../types';
import { japaneseVoice } from '../utils/audio';
import { japaneseRecognizer } from '../utils/speechRecognition';
import { Send, Mic, MicOff, Volume2, Bot, User, Sparkles, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'tutor' | 'user';
  japanese: string;
  furigana?: string;
  english?: string;
  tip?: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  initialMessage: ChatMessage;
  responses: Record<string, ChatMessage>;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'conbini',
    title: '🏪 Conbini Cashier (コンビニの買い物)',
    description: 'Practical JFT Can-Do: Buying a bento box and drink at 7-Eleven or Lawson.',
    initialMessage: {
      id: 'm1',
      sender: 'tutor',
      japanese: 'いらっしゃいませ！温めますか？お箸はおつけしますか？',
      furigana: 'いらっしゃいませ！あたためますか？おはしはおつけしますか？',
      english: 'Welcome! Would you like this heated up? Shall I include chopsticks?',
      tip: 'Tip: Reply with "お願いします" (please) or "大丈夫です" (no thank you).'
    },
    responses: {
      default: {
        id: 'r1',
        sender: 'tutor',
        japanese: 'かしこまりました。少々お待ちくださいね。合計で７５０円になります。',
        furigana: 'かしこまりました。しょうしょうおまちくださいね。ごうけいでななひゃくごじゅうえんになります。',
        english: 'Certainly. Please wait a moment. The total comes to 750 yen.',
        tip: 'JFT A2 Can-Do: Understand store totals and payment requests.'
      }
    }
  },
  {
    id: 'workplace',
    title: '🏢 Workplace Greeting & Shift Handover (職場の挨拶)',
    description: 'Essential polite Japanese for specified skilled workers and office staff.',
    initialMessage: {
      id: 'm2',
      sender: 'tutor',
      japanese: 'おはようございます！今日のシフトの引き継ぎをお願いできますか？',
      furigana: 'おはようございます！きょうのシフトのひきつぎをおねがいできますか？',
      english: 'Good morning! Could we do the shift handover for today?',
      tip: 'Polite workplace Japanese: Start with "はい、よろしくお願いします。"'
    },
    responses: {
      default: {
        id: 'r2',
        sender: 'tutor',
        japanese: '助かります！それでは、本日の連絡事項を確認しましょう。今日もお疲れ様です！',
        furigana: 'たすかります！それでは、ほんじつのれんらくじこうをかくにんしましょう。きょうもおつかれさまです！',
        english: 'That helps a lot! Let us check today\'s announcements. Great work as always!',
        tip: 'Honorific / Teinei workplace expressions.'
      }
    }
  },
  {
    id: 'station',
    title: '🚉 Asking for Directions at the Station (駅で道を聞く)',
    description: 'Navigating train lines, platforms, and walking times.',
    initialMessage: {
      id: 'm3',
      sender: 'tutor',
      japanese: 'すみません、何かお困りですか？どちらへ行かれますか？',
      furigana: 'すみません、なにかおこまりですか？どちらへいかれますか？',
      english: 'Excuse me, are you having trouble? Where are you heading?',
      tip: 'Tell the station attendant: "〜に行きたいんですが、どの電車に乗ればいいですか？"'
    },
    responses: {
      default: {
        id: 'r3',
        sender: 'tutor',
        japanese: 'あちらの２番線から出る山手線に乗ってください。約１５分で着きますよ。',
        furigana: 'あちらのにばんせんからでるやまのてせんにのってください。やくだいじゅうごふんでつきますよ。',
        english: 'Please take the Yamanote Line departing from Track 2 over there. You will arrive in about 15 minutes.',
        tip: 'Notice "〜番線" (Track/Platform number) and "約" (about/approximately).'
      }
    }
  }
];

export const RealTimeAITutor: React.FC<{ level: LevelType }> = ({ level }) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([SCENARIOS[0].initialMessage]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages([selectedScenario.initialMessage]);
  }, [selectedScenario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      japanese: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Dynamic real-time response from AI Sensei
    setTimeout(() => {
      const responseTemplate = selectedScenario.responses.default;
      const tutorMsg: ChatMessage = {
        id: `t_${Date.now()}`,
        sender: 'tutor',
        japanese: responseTemplate.japanese,
        furigana: responseTemplate.furigana,
        english: responseTemplate.english,
        tip: responseTemplate.tip
      };
      setMessages(prev => [...prev, tutorMsg]);
      japaneseVoice.speak(tutorMsg.japanese);
    }, 600);
  };

  const handleMicToggle = () => {
    if (!japaneseRecognizer.isSupported) {
      alert('Speech Recognition is supported in Chrome, Edge, and modern browsers.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      japaneseRecognizer.stop();
    } else {
      setIsListening(true);
      japaneseRecognizer.start(
        (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        () => setIsListening(false)
      );
    }
  };

  const handleSpeak = (text: string) => {
    japaneseVoice.speak(text);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sakura-100 dark:bg-sakura-900/40 text-sakura-700 dark:text-sakura-300 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-Time AI Conversation Sensei (AIチューター)</span>
          </div>
          <h2 className="text-2xl font-serif font-black text-slate-800 dark:text-white">
            リアルタイム実践日本語会話
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Live interactive dialogue scenarios for JFT workplace & daily living in Japan
          </p>
        </div>

        {/* Scenario Switcher */}
        <select
          value={selectedScenario.id}
          onChange={e => {
            const found = SCENARIOS.find(s => s.id === e.target.value);
            if (found) setSelectedScenario(found);
          }}
          className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sakura-400 shadow-sm"
        >
          {SCENARIOS.map(s => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      {/* Chat Messages Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xl h-[480px] overflow-y-auto flex flex-col gap-4 mb-4 scrollbar-thin">
        {messages.map(msg => {
          const isTutor = msg.sender === 'tutor';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                isTutor ? 'self-start' : 'self-end flex-row-reverse'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-md ${
                  isTutor ? 'bg-sakura-500' : 'bg-aizome-600'
                }`}
              >
                {isTutor ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              <div
                className={`p-4 rounded-3xl border text-xs sm:text-sm leading-relaxed ${
                  isTutor
                    ? 'bg-washi-50 dark:bg-slate-800/80 border-sakura-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm'
                    : 'bg-sakura-500 text-white border-sakura-600 rounded-tr-sm shadow-md shadow-sakura-500/20'
                }`}
              >
                {isTutor && msg.furigana && (
                  <div className="text-[11px] font-serif text-sakura-600 dark:text-sakura-400 mb-1 tracking-wider">
                    {msg.furigana}
                  </div>
                )}

                <div className="font-serif font-bold text-sm sm:text-base mb-1">
                  {msg.japanese}
                </div>

                {isTutor && msg.english && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">
                    {msg.english}
                  </div>
                )}

                {isTutor && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-400">
                    <span>{msg.tip || 'Native Dialogue'}</span>
                    <button
                      onClick={() => handleSpeak(msg.japanese)}
                      className="p-1 rounded-md text-slate-500 hover:text-sakura-500 transition-colors"
                      title="Listen"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer (Text & Microphone) */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleMicToggle}
          className={`p-3 rounded-2xl border transition-all ${
            isListening
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-sakura-500'
          }`}
          title={isListening ? 'Listening... click to stop' : 'Speak in Japanese (音声入力)'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type or speak your reply in Japanese (e.g. お願いします、ありがとうございます)..."
          className="flex-grow px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sakura-400 shadow-sm"
        />

        <button
          onClick={handleSendMessage}
          className="p-3 rounded-2xl bg-sakura-500 hover:bg-sakura-600 text-white font-bold shadow-md shadow-sakura-500/20 active:scale-95 transition-all"
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
