import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Home,
  CheckCircle2,
  Clock,
  Target,
  Zap,
} from 'lucide-react';
import { GameSessionResult, SupportedLanguage } from '../../types';
import { getTranslation } from '../../services/i18n';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';

interface GameCompletionModalProps {
  session: GameSessionResult | null;
  onPlayAgain: () => void;
  onNextActivity: () => void;
  onBackToHome: () => void;
  currentLang: SupportedLanguage;
}

export const GameCompletionModal: React.FC<GameCompletionModalProps> = ({
  session,
  onPlayAgain,
  onNextActivity,
  onBackToHome,
  currentLang,
}) => {
  const t = getTranslation(currentLang);

  useEffect(() => {
    if (session) {
      sound.playCelebration();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#006767', '#208181', '#455f88', '#f59e0b', '#10b981'],
        });
      } catch {}

      // Spoken encouraging voice congratulation
      const verbalFeedback =
        currentLang === 'as'
          ? 'বৰ সুন্দৰ! আপুনি এই কাৰ্য্য অতি নিখুঁতভাৱে সম্পূৰ্ণ কৰিলে।'
          : currentLang === 'bn'
          ? 'চমৎকার! আপনি খুব সুন্দরভাবে খেলাটি সম্পন্ন করেছেন।'
          : currentLang === 'hi'
          ? 'बहुत बढ़िया! आपने यह गतिविधि बहुत अच्छे से पूरी की।'
          : 'Wonderful effort! You completed this activity with great focus and care.';

      voice.speak(verbalFeedback, currentLang);
    }
  }, [session, currentLang]);

  if (!session) return null;

  return (
    <div
      id="game-completion-backdrop"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="game-completion-dialog"
        className="bg-[#faf8ff] w-full max-w-lg rounded-3xl shadow-2xl border-4 border-[#006767] overflow-hidden p-6 sm:p-8 text-center space-y-6 animate-in fade-in zoom-in duration-200"
      >
        {/* Celebration Trophy Badge */}
        <div className="relative inline-block mx-auto">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#006767] to-[#208181] text-white flex items-center justify-center shadow-xl ring-8 ring-teal-100">
            <Trophy className="w-12 h-12 text-yellow-300" />
          </div>
          <Sparkles className="w-8 h-8 text-amber-400 absolute -top-1 -right-1 animate-bounce" />
        </div>

        {/* Title & Affirming Message */}
        <div>
          <span className="bg-[#b6d0ff] text-[#002b74] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {session.gameTitle}
          </span>
          <h2 className="text-3xl font-extrabold text-[#001849] mt-2 mb-1">
            {t.activityComplete}
          </h2>
          <p className="text-lg font-medium text-[#455f88] leading-relaxed">
            {t.greatJob}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-[#dae1ff] shadow-xs">
          <div className="p-3 bg-[#f2f3ff] rounded-xl">
            <div className="flex items-center justify-center gap-1 text-[#006767] mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">{t.accuracy}</span>
            </div>
            <span className="text-2xl font-black text-[#001849]">
              {session.accuracy}%
            </span>
          </div>

          <div className="p-3 bg-[#f2f3ff] rounded-xl">
            <div className="flex items-center justify-center gap-1 text-[#455f88] mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">{t.score}</span>
            </div>
            <span className="text-2xl font-black text-[#001849]">
              {session.score}
            </span>
          </div>

          <div className="p-3 bg-[#f2f3ff] rounded-xl">
            <div className="flex items-center justify-center gap-1 text-[#8a4c27] mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">{t.duration}</span>
            </div>
            <span className="text-2xl font-black text-[#001849]">
              {session.durationSeconds}s
            </span>
          </div>
        </div>

        {/* Action Buttons (Large, high-contrast) */}
        <div className="space-y-3 pt-2">
          <button
            id="continue-next-activity-btn"
            onClick={() => {
              sound.playClick();
              onNextActivity();
            }}
            className="w-full min-h-[60px] bg-[#006767] hover:bg-[#208181] text-white text-lg font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
          >
            <span>{t.continueNext}</span>
            <ArrowRight className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              id="replay-game-btn"
              onClick={() => {
                sound.playClick();
                onPlayAgain();
              }}
              className="min-h-[52px] bg-white hover:bg-[#eaedff] text-[#001849] border-2 border-[#dae1ff] text-base font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-5 h-5 text-[#455f88]" />
              <span>{t.playAgain}</span>
            </button>

            <button
              id="back-home-game-btn"
              onClick={() => {
                sound.playClick();
                onBackToHome();
              }}
              className="min-h-[52px] bg-white hover:bg-[#eaedff] text-[#001849] border-2 border-[#dae1ff] text-base font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <Home className="w-5 h-5 text-[#006767]" />
              <span>{t.backToHome}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
