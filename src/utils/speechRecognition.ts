// Web Speech Recognition for Real-time Japanese Voice Recognition

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
      length: number;
    };
    length: number;
  };
}

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class JapaneseSpeechRecognizer {
  private recognition: any = null;
  public isSupported: boolean = false;
  private onResultCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    const win = typeof window !== 'undefined' ? (window as unknown as IWindow) : null;
    const SpeechRecognitionClass = win?.SpeechRecognition || win?.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      this.isSupported = true;
      this.recognition = new SpeechRecognitionClass();
      this.recognition.lang = 'ja-JP';
      this.recognition.interimResults = true;
      this.recognition.continuous = false;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        const isFinal = Boolean(finalTranscript);
        if (this.onResultCallback && text) {
          this.onResultCallback(text, isFinal);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
      };
    }
  }

  public start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ) {
    if (!this.recognition) return;
    this.onResultCallback = onResult;
    this.onErrorCallback = onError || null;
    try {
      this.recognition.start();
    } catch {
      // already active
    }
  }

  public stop() {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch {
      // already stopped
    }
  }
}

// Calculate similarity between spoken Japanese and expected Japanese
export function calculateAccuracy(spoken: string, expected: string): number {
  if (!spoken || !expected) return 0;
  
  // Clean punctuation and whitespace
  const clean = (s: string) => s.replace(/[\s、。！？!?,.]/g, '').toLowerCase();
  const s = clean(spoken);
  const e = clean(expected);

  if (s === e) return 100;
  if (e.includes(s) || s.includes(e)) {
    const minLen = Math.min(s.length, e.length);
    const maxLen = Math.max(s.length, e.length);
    return Math.round((minLen / maxLen) * 95);
  }

  // Levenshtein distance
  const matrix: number[][] = [];
  for (let i = 0; i <= s.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= e.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s.length; i++) {
    for (let j = 1; j <= e.length; j++) {
      if (s[i - 1] === e[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const dist = matrix[s.length][e.length];
  const maxLen = Math.max(s.length, e.length);
  const similarity = Math.max(0, 1 - dist / maxLen);
  return Math.round(similarity * 100);
}

export const japaneseRecognizer = new JapaneseSpeechRecognizer();
