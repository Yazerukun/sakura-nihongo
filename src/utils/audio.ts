// Web Speech API wrapper for Japanese Text-to-Speech

class JapaneseAudioPlayer {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoice();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoice();
      }
    }
  }

  private initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize high-quality Japanese voice (e.g., Kyoko, Otoya, Google 日本語, etc.)
    const jaVoice = voices.find(v => v.lang.startsWith('ja') || v.lang.includes('JP'));
    if (jaVoice) {
      this.voice = jaVoice;
      this.isInitialized = true;
    }
  }

  public speak(text: string, rate: number = 0.9): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        console.warn('Speech synthesis not supported on this browser.');
        resolve();
        return;
      }

      // Stop any ongoing speech
      this.synth.cancel();

      if (!this.isInitialized) {
        this.initVoice();
      }

      // Strip HTML or formatting tags if present
      const cleanText = text.replace(/<[^>]*>/g, '').replace(/---/g, '').trim();
      if (!cleanText) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ja-JP';
      utterance.rate = rate; // slightly slower for learners (0.9 by default)
      utterance.pitch = 1.0;

      if (this.voice) {
        utterance.voice = this.voice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.warn('TTS playback issue:', e);
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const japaneseVoice = new JapaneseAudioPlayer();
