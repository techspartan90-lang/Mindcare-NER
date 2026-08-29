import { SupportedLanguage } from '../types';

export interface VoiceCommandResult {
  transcript: string;
  intent: 'PLAY_GAME' | 'CHECK_MEDICINE' | 'DRINK_WATER' | 'CALL_CAREGIVER' | 'READ_ROUTINE' | 'HELP' | 'GENERAL_TALK';
  replyText: string;
  actionPayload?: any;
}

class VoiceService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isSupported: boolean = false;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.isSupported = true;
      }
    }
  }

  public getIsSupported(): boolean {
    return this.isSupported;
  }

  public speak(text: string, lang: SupportedLanguage = 'en', onEnd?: () => void) {
    if (typeof window === 'undefined' || !this.synth) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.synth.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Slightly slower, calm pace for elderly comprehension
      utterance.pitch = 1.0;

      // Map language code to standard locale
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

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      this.isSpeaking = true;
      this.synth.speak(utterance);
    } catch {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
  }

  public listen(
    lang: SupportedLanguage = 'en',
    onResult: (transcript: string) => void,
    onError: (err: string) => void,
    onStart?: () => void,
  ) {
    if (!this.recognition) {
      onError('Speech recognition is not available in this browser. Please use quick voice chips.');
      return;
    }

    try {
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
        if (onStart) onStart();
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        onError(event.error || 'Could not understand audio');
      };

      this.recognition.start();
    } catch (e: any) {
      onError(e?.message || 'Voice listening failed');
    }
  }

  // Fast offline/local intent parser with conversational fallback
  public parseLocalIntent(transcript: string, lang: SupportedLanguage): VoiceCommandResult {
    const lower = transcript.toLowerCase();

    if (
      lower.includes('game') ||
      lower.includes('play') ||
      lower.includes('খেল') ||
      lower.includes('memory') ||
      lower.includes('খেলা') ||
      lower.includes('shanba')
    ) {
      return {
        transcript,
        intent: 'PLAY_GAME',
        replyText: 'Opening your cognitive memory activity now. Have fun!',
      };
    }

    if (
      lower.includes('medicine') ||
      lower.includes('pill') ||
      lower.includes('দৰব') ||
      lower.includes('ঔষধ') ||
      lower.includes('hidak') ||
      lower.includes('dawai') ||
      lower.includes('दवा')
    ) {
      return {
        transcript,
        intent: 'CHECK_MEDICINE',
        replyText: 'You took your morning Blood Pressure medicine. Next is your memory support tablet at 2:00 PM.',
      };
    }

    if (
      lower.includes('water') ||
      lower.includes('drink') ||
      lower.includes('পানী') ||
      lower.includes('জল') ||
      lower.includes('eshing') ||
      lower.includes('tui') ||
      lower.includes('पानी')
    ) {
      return {
        transcript,
        intent: 'DRINK_WATER',
        replyText: 'Logged 1 glass of fresh water! You have had 5 glasses today. Staying hydrated helps your mind stay fresh.',
      };
    }

    if (
      lower.includes('daughter') ||
      lower.includes('caregiver') ||
      lower.includes('priyanka') ||
      lower.includes('call') ||
      lower.includes('ফোন') ||
      lower.includes('family') ||
      lower.includes('সাহায্য')
    ) {
      return {
        transcript,
        intent: 'CALL_CAREGIVER',
        replyText: 'Connecting to your daughter Priyanka Borah now.',
      };
    }

    if (
      lower.includes('routine') ||
      lower.includes('today') ||
      lower.includes('schedule') ||
      lower.includes('আজি') ||
      lower.includes('আজকে')
    ) {
      return {
        transcript,
        intent: 'READ_ROUTINE',
        replyText: 'Today you have morning walking at 7:30 AM, tea at 9 AM, and Dr. Barman appointment tomorrow.',
      };
    }

    return {
      transcript,
      intent: 'GENERAL_TALK',
      replyText: 'I am here with you, Dhiren-da. Remember you can play a game, check your medicines, or call Priyanka anytime.',
    };
  }
}

export const voice = new VoiceService();
