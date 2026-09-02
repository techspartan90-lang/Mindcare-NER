import { SupportedLanguage } from '../types';

export type VoiceState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'MUTED';

export interface VoiceCommandResult {
  transcript: string;
  intent:
    | 'PLAY_GAME'
    | 'CHECK_MEDICINE'
    | 'DRINK_WATER'
    | 'CALL_CAREGIVER'
    | 'READ_ROUTINE'
    | 'PEACEFUL_SOUNDS'
    | 'SHOW_PROGRESS'
    | 'GO_HOME'
    | 'READ_PAGE'
    | 'HELP'
    | 'STOP'
    | 'REPEAT'
    | 'CONFIRM_ACTION'
    | 'CANCEL_ACTION'
    | 'GENERAL_TALK';
  replyText: string;
  requiresConfirmation?: boolean;
  actionPayload?: any;
}

export interface VoiceSettings {
  enabled: boolean;
  preferFemaleVoice: boolean;
  speechRate: number; // 0.7 - 1.1 (default 0.85 for senior clarity)
  pitch: number; // 0.8 - 1.2 (default 1.0)
  volume: number; // 0 - 1.0 (default 0.9)
  language: SupportedLanguage;
}

type VoiceStateListener = (state: VoiceState) => void;
type VoiceVolumeListener = (volumeLevel: number) => void;

class VoiceAssistantService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isSupported: boolean = false;
  private isListeningSupported: boolean = false;
  private currentState: VoiceState = 'IDLE';
  private lastSpokenText: string = '';
  private stateListeners: Set<VoiceStateListener> = new Set();
  private volumeListeners: Set<VoiceVolumeListener> = new Set();
  private availableVoices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private volumeAnalyserInterval: any = null;

  private settings: VoiceSettings = {
    enabled: true,
    preferFemaleVoice: true,
    speechRate: 0.85, // Calm, senior-friendly pace
    pitch: 1.05, // Warm, gentle pitch
    volume: 0.9,
    language: 'en',
  };

  private pendingAction: {
    description: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.isSupported = true;
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      }

      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.isListeningSupported = true;
      }

      // Load saved settings if any
      try {
        const saved = localStorage.getItem('mindcare_voice_settings');
        if (saved) {
          this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
      } catch {}
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.availableVoices = this.synth.getVoices();
    this.findBestFemaleVoice();
  }

  private findBestFemaleVoice() {
    if (!this.availableVoices.length) return;

    // Prioritize natural female Indian English voices, then general female English, then natural voices
    const indianFemale = this.availableVoices.find(
      (v) =>
        (v.lang.includes('en-IN') || v.lang.includes('hi-IN') || v.lang.includes('bn-IN')) &&
        (v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('veena') ||
          v.name.toLowerCase().includes('priya') ||
          v.name.toLowerCase().includes('google hindi') ||
          v.name.toLowerCase().includes('sangeeta')),
    );

    const generalFemale = this.availableVoices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('karen') ||
          v.name.toLowerCase().includes('victoria') ||
          v.name.toLowerCase().includes('moira') ||
          v.name.toLowerCase().includes('natural')),
    );

    const indianAny = this.availableVoices.find((v) => v.lang.includes('IN'));
    const englishAny = this.availableVoices.find((v) => v.lang.startsWith('en'));

    this.selectedVoice = indianFemale || generalFemale || indianAny || englishAny || this.availableVoices[0];
  }

  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem('mindcare_voice_settings', JSON.stringify(this.settings));
    } catch {}
  }

  public getState(): VoiceState {
    return this.currentState;
  }

  public getIsSupported(): boolean {
    return this.isSupported;
  }

  public getIsListeningSupported(): boolean {
    return this.isListeningSupported;
  }

  public subscribeState(listener: VoiceStateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.currentState);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  public subscribeVolume(listener: VoiceVolumeListener): () => void {
    this.volumeListeners.add(listener);
    return () => {
      this.volumeListeners.delete(listener);
    };
  }

  private setState(state: VoiceState) {
    this.currentState = state;
    this.stateListeners.forEach((l) => l(state));
  }

  private emitVolume(val: number) {
    this.volumeListeners.forEach((l) => l(val));
  }

  /**
   * Calm, senior-first Text-To-Speech with natural rhythm and Indian English priority
   */
  public speak(
    text: string,
    lang: SupportedLanguage = this.settings.language,
    onEnd?: () => void,
  ) {
    if (!this.settings.enabled) {
      if (onEnd) onEnd();
      return;
    }

    if (typeof window === 'undefined' || !this.synth) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.stopSpeaking();
      this.lastSpokenText = text;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.settings.speechRate; // e.g. 0.85 for senior clarity
      utterance.pitch = this.settings.pitch;
      utterance.volume = this.settings.volume;

      // Locale mapping
      const localeMap: Record<SupportedLanguage, string> = {
        en: 'en-IN',
        as: 'as-IN',
        bn: 'bn-IN',
        mni: 'mni-IN',
        lus: 'lus-IN',
        kha: 'kha-IN',
        hi: 'hi-IN',
      };
      utterance.lang = localeMap[lang] || 'en-IN';

      if (this.selectedVoice && this.settings.preferFemaleVoice) {
        utterance.voice = this.selectedVoice;
      }

      utterance.onstart = () => {
        this.setState('SPEAKING');
        this.startSimulatedVolumeWave();
      };

      utterance.onend = () => {
        this.stopSimulatedVolumeWave();
        this.setState('IDLE');
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.stopSimulatedVolumeWave();
        this.setState('IDLE');
        if (onEnd) onEnd();
      };

      this.synth.speak(utterance);
    } catch {
      this.stopSimulatedVolumeWave();
      this.setState('IDLE');
      if (onEnd) onEnd();
    }
  }

  private startSimulatedVolumeWave() {
    this.stopSimulatedVolumeWave();
    this.volumeAnalyserInterval = setInterval(() => {
      const simulatedVol = 0.3 + Math.random() * 0.7;
      this.emitVolume(simulatedVol);
    }, 100);
  }

  private stopSimulatedVolumeWave() {
    if (this.volumeAnalyserInterval) {
      clearInterval(this.volumeAnalyserInterval);
      this.volumeAnalyserInterval = null;
    }
    this.emitVolume(0);
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.stopSimulatedVolumeWave();
    if (this.currentState === 'SPEAKING') {
      this.setState('IDLE');
    }
  }

  public repeatLast() {
    if (this.lastSpokenText) {
      this.speak(this.lastSpokenText);
    } else {
      this.speak('I am here to help you. How may I assist your day?');
    }
  }

  /**
   * Speech Recognition listening handler
   */
  public listen(
    lang: SupportedLanguage = this.settings.language,
    onResult: (transcript: string) => void,
    onError: (err: string) => void,
    onStart?: () => void,
  ) {
    if (!this.recognition) {
      onError('Speech recognition is not available in this browser. Please use quick buttons below.');
      return;
    }

    try {
      this.stopSpeaking();
      const localeMap: Record<SupportedLanguage, string> = {
        en: 'en-IN',
        as: 'as-IN',
        bn: 'bn-IN',
        mni: 'mni-IN',
        lus: 'lus-IN',
        kha: 'kha-IN',
        hi: 'hi-IN',
      };
      this.recognition.lang = localeMap[lang] || 'en-IN';

      this.recognition.onstart = () => {
        this.setState('LISTENING');
        if (onStart) onStart();
      };

      this.recognition.onresult = (event: any) => {
        this.setState('THINKING');
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        this.setState('IDLE');
        onError(
          event.error === 'no-speech'
            ? "I couldn't hear that. Please try again or tap an option on screen."
            : 'Could not access microphone. Tap a command below.',
        );
      };

      this.recognition.onend = () => {
        if (this.currentState === 'LISTENING') {
          this.setState('IDLE');
        }
      };

      this.recognition.start();
    } catch (e: any) {
      this.setState('IDLE');
      onError(e?.message || 'Voice listening failed');
    }
  }

  /**
   * Parses natural speech commands safely with senior care guardrails
   */
  public parseCommand(
    transcript: string,
    lang: SupportedLanguage = 'en',
  ): VoiceCommandResult {
    const lower = transcript.toLowerCase().trim();

    // Check if there is a pending confirmation action
    if (this.pendingAction) {
      if (
        lower.includes('yes') ||
        lower.includes('confirm') ||
        lower.includes('sure') ||
        lower.includes('ok') ||
        lower.includes('হয়') ||
        lower.includes('হ্যাঁ') ||
        lower.includes('हाँ')
      ) {
        const action = this.pendingAction;
        this.pendingAction = null;
        action.onConfirm();
        return {
          transcript,
          intent: 'CONFIRM_ACTION',
          replyText: 'Confirmed. Proceeding now.',
        };
      }

      if (
        lower.includes('no') ||
        lower.includes('cancel') ||
        lower.includes('stop') ||
        lower.includes('না') ||
        lower.includes('নাহ') ||
        lower.includes('नहीं')
      ) {
        if (this.pendingAction.onCancel) this.pendingAction.onCancel();
        this.pendingAction = null;
        return {
          transcript,
          intent: 'CANCEL_ACTION',
          replyText: 'Cancelled. What else would you like to do?',
        };
      }
    }

    // 1. Brain / Cognitive Games
    if (
      lower.includes('game') ||
      lower.includes('play') ||
      lower.includes('brain') ||
      lower.includes('memory') ||
      lower.includes('খেল') ||
      lower.includes('খেলা') ||
      lower.includes('puzzle')
    ) {
      return {
        transcript,
        intent: 'PLAY_GAME',
        replyText: 'Opening your cognitive memory activity now. Let us take it slowly and have fun.',
      };
    }

    // 2. Daily Routine / Schedule
    if (
      lower.includes('routine') ||
      lower.includes('today') ||
      lower.includes('schedule') ||
      lower.includes('আজি') ||
      lower.includes('আজকে') ||
      lower.includes('दिनचर्या')
    ) {
      return {
        transcript,
        intent: 'READ_ROUTINE',
        replyText:
          'Here is your daily routine: morning walk at 7:30 AM, memory game at 10:30 AM, and afternoon rest at 2 PM.',
      };
    }

    // 3. Medicine / Prescription Check
    if (
      lower.includes('medicine') ||
      lower.includes('pill') ||
      lower.includes('tablet') ||
      lower.includes('দৰব') ||
      lower.includes('ঔষধ') ||
      lower.includes('dawai') ||
      lower.includes('दवा')
    ) {
      return {
        transcript,
        intent: 'CHECK_MEDICINE',
        replyText:
          'Your morning blood pressure medicine is logged. Your next memory vitamin is scheduled with afternoon lunch at 1:30 PM.',
      };
    }

    // 4. Hydration / Drink Water
    if (
      lower.includes('water') ||
      lower.includes('drink') ||
      lower.includes('পানী') ||
      lower.includes('জল') ||
      lower.includes('पानी')
    ) {
      return {
        transcript,
        intent: 'DRINK_WATER',
        replyText:
          'Wonderful. I have logged 1 glass of water for you. Staying hydrated keeps your mind alert and calm.',
      };
    }

    // 5. Family Connect / Call Daughter or Son
    if (
      lower.includes('family') ||
      lower.includes('call') ||
      lower.includes('daughter') ||
      lower.includes('caregiver') ||
      lower.includes('priyanka') ||
      lower.includes('son') ||
      lower.includes('rahul') ||
      lower.includes('ফোন')
    ) {
      return {
        transcript,
        intent: 'CALL_CAREGIVER',
        requiresConfirmation: true,
        replyText: 'Would you like me to open the family connect screen to reach Priyanka?',
      };
    }

    // 6. Peaceful Sounds / Music
    if (
      lower.includes('sound') ||
      lower.includes('peace') ||
      lower.includes('music') ||
      lower.includes('relax') ||
      lower.includes('flute') ||
      lower.includes('river') ||
      lower.includes('গান') ||
      lower.includes('সঙ্গীত')
    ) {
      return {
        transcript,
        intent: 'PEACEFUL_SOUNDS',
        replyText: 'Playing gentle Brahmaputra river and morning bamboo flute sounds for you.',
      };
    }

    // 7. Show Progress / Cognitive Score
    if (
      lower.includes('progress') ||
      lower.includes('score') ||
      lower.includes('report') ||
      lower.includes('unnoti') ||
      lower.includes('প্রগতি')
    ) {
      return {
        transcript,
        intent: 'SHOW_PROGRESS',
        replyText:
          'Your attention activity has changed a little today. You have completed 4 activities this week with great consistency.',
      };
    }

    // 8. Go Home
    if (
      lower.includes('home') ||
      lower.includes('main') ||
      lower.includes('back') ||
      lower.includes('ঘৰ') ||
      lower.includes('বাড়ি') ||
      lower.includes('घर')
    ) {
      return {
        transcript,
        intent: 'GO_HOME',
        replyText: 'Taking you back to the home care hub.',
      };
    }

    // 9. Stop / Repeat / Help
    if (lower.includes('stop') || lower.includes('quiet') || lower.includes('বন্ধ')) {
      this.stopSpeaking();
      return {
        transcript,
        intent: 'STOP',
        replyText: 'I have paused speaking.',
      };
    }

    if (lower.includes('repeat') || lower.includes('again') || lower.includes('পুনৰ')) {
      return {
        transcript,
        intent: 'REPEAT',
        replyText: this.lastSpokenText || 'I am right here with you.',
      };
    }

    if (lower.includes('help') || lower.includes('সহায়') || lower.includes('সাহায্য') || lower.includes('मदद')) {
      return {
        transcript,
        intent: 'HELP',
        replyText:
          'I am your MindCare Voice Assistant. You can ask me to play a memory game, check your routine, or call your family.',
      };
    }

    // Fallback general supportive response
    return {
      transcript,
      intent: 'GENERAL_TALK',
      replyText:
        'I am listening. You can explore your daily routine, play a cognitive activity, or connect with family.',
    };
  }

  public setPendingConfirmation(
    description: string,
    onConfirm: () => void,
    onCancel?: () => void,
  ) {
    this.pendingAction = { description, onConfirm, onCancel };
    this.speak(`Would you like to ${description}? Please say yes or tap confirm.`);
  }

  public clearPendingConfirmation() {
    this.pendingAction = null;
  }

  public matchIntentOffline(
    transcript: string,
    lang: SupportedLanguage = 'en',
  ): VoiceCommandResult {
    return this.parseCommand(transcript, lang);
  }
}

export const voice = new VoiceAssistantService();
