// Dual-Engine Japanese Audio Player (Cloudflare Edge Neural TTS + Web Speech API Fallback)

class JapaneseAudioPlayer {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeechSupported = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.isSpeechSupported = true;
      try {
        window.speechSynthesis.getVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
          };
        }
      } catch {}
    }
  }

  /**
   * Main Speak function:
   * 1. Attempts Cloudflare Edge Neural Voice (/api/tts)
   * 2. Falls back automatically to device Web Speech API
   */
  public async speak(text: string, rate: number = 0.9): Promise<void> {
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/---/g, '').trim();
    if (!cleanText) return;

    this.stop();

    // 1. Try Cloudflare Edge Function (/api/tts)
    const playedEdge = await this.playEdgeAudio(cleanText);
    if (playedEdge) return;

    // 2. Fallback to Browser Native SpeechSynthesis
    this.playSpeechSynthesis(cleanText, rate);
  }

  private playEdgeAudio(text: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false);
        return;
      }

      const isLocalOrPages = window.location.hostname.includes('pages.dev') || window.location.hostname === 'localhost';
      const edgeUrl = isLocalOrPages
        ? `/api/tts?text=${encodeURIComponent(text)}`
        : `https://sakura-nihongo.pages.dev/api/tts?text=${encodeURIComponent(text)}`;

      const audio = new Audio();
      audio.preload = 'auto';

      let resolved = false;

      const cleanup = () => {
        audio.oncanplaythrough = null;
        audio.onerror = null;
        audio.onended = null;
      };

      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(false);
        }
      }, 3500);

      audio.oncanplaythrough = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          this.currentAudio = audio;
          audio.play()
            .then(() => resolve(true))
            .catch(() => {
              cleanup();
              resolve(false);
            });
        }
      };

      audio.onended = () => {
        cleanup();
        this.currentAudio = null;
      };

      audio.onerror = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          cleanup();
          resolve(false);
        }
      };

      audio.src = edgeUrl;
      audio.load();
    });
  }

  private playSpeechSynthesis(text: string, rate: number = 0.9) {
    if (!this.isSpeechSupported || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = rate;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find(
        v => v.lang.startsWith('ja') || v.lang.includes('JP') || v.name.includes('Japanese') || v.name.includes('日本語')
      );

      if (jaVoice) {
        utterance.voice = jaVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis fallback error:', e);
    }
  }

  public stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }

    if (this.isSpeechSupported && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }
}

export const japaneseVoice = new JapaneseAudioPlayer();
