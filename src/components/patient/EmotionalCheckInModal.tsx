import React, { useState } from 'react';
import { Heart, Sparkles, AlertCircle, PhoneCall, CheckCircle2, X } from 'lucide-react';
import { SupportedLanguage, EmotionType, EmotionalCheckInRecord } from '../../types';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';

interface EmotionalCheckInModalProps {
  isOpen: boolean;
  currentLang: SupportedLanguage;
  patientName: string;
  onClose: () => void;
  onSelectNeedHelp: () => void;
}

const EMOTIONS: {
  type: EmotionType;
  label: Record<SupportedLanguage, string>;
  emoji: string;
  color: string;
  description: string;
}[] = [
  {
    type: 'HAPPY',
    label: {
      en: 'Happy & Peaceful',
      as: 'আনন্দিত আৰু শান্ত',
      bn: 'আনন্দিত ও শান্ত',
      mni: 'হরাওবা অমসুং শান্ত',
      lus: 'Hlim leh thlamuang',
      kha: 'Kmen bad suk',
      hi: 'खुश और शांत',
    },
    emoji: '😊',
    color: 'bg-emerald-50 border-emerald-300 text-emerald-950',
    description: 'Feeling energized and pleasant today.',
  },
  {
    type: 'OKAY',
    label: {
      en: 'Calm & Steady',
      as: 'স্বাভাৱিক আৰু ঠিক আছোঁ',
      bn: 'শান্ত ও স্বাভাবিক',
      mni: 'চপ চাভা',
      lus: 'Tha pangngai',
      kha: 'Bha beit',
      hi: 'शांत और सामान्य',
    },
    emoji: '😌',
    color: 'bg-blue-50 border-blue-300 text-blue-950',
    description: 'Feeling steady and going with the flow.',
  },
  {
    type: 'TIRED',
    label: {
      en: 'A Bit Tired',
      as: 'অলপ ভাগৰুৱা',
      bn: 'একটু ক্লান্ত',
      mni: 'থোরোই থোরোই তৌবা',
      lus: 'Chauh deuh',
      kha: 'Thait khyndiat',
      hi: 'थोड़ा थका हुआ',
    },
    emoji: '🥱',
    color: 'bg-amber-50 border-amber-300 text-amber-950',
    description: 'Would like gentle, restful activities today.',
  },
  {
    type: 'WORRIED',
    label: {
      en: 'A Bit Uneasy',
      as: 'অলপ চিন্তিত বা খেলিমেলি',
      bn: 'একটু চিন্তিত',
      mni: 'নুংশিবা তৌবা',
      lus: 'Mangan deuh',
      kha: 'Duh jingkyrmen',
      hi: 'थोड़ा चिंतित या असमंजस',
    },
    emoji: '😟',
    color: 'bg-purple-50 border-purple-300 text-purple-950',
    description: 'Feeling a little confused or unsure.',
  },
  {
    type: 'NEED_HELP',
    label: {
      en: 'I Need Help',
      as: 'মোক সহায় লাগে',
      bn: 'আমার সাহায্য প্রয়োজন',
      mni: 'ঐঙোন্দা মতেং মথৌ তাই',
      lus: 'Puihna ka mamawh',
      kha: 'Nga donkam jingiarap',
      hi: 'मुझे सहायता चाहिए',
    },
    emoji: '🆘',
    color: 'bg-rose-50 border-rose-400 text-rose-950',
    description: 'Connect directly with Priyanka (daughter).',
  },
];

export const EmotionalCheckInModal: React.FC<EmotionalCheckInModalProps> = ({
  isOpen,
  currentLang,
  patientName,
  onClose,
  onSelectNeedHelp,
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (emotion: EmotionType) => {
    sound.playClick();
    setSelectedEmotion(emotion);

    if (emotion === 'NEED_HELP') {
      onSelectNeedHelp();
      onClose();
      return;
    }

    const record: EmotionalCheckInRecord = {
      id: `em_${Date.now()}`,
      patientId: 'p_dhiren_01',
      emotion,
      timestamp: new Date().toISOString(),
      helpRequested: false,
    };

    try {
      const existing = JSON.parse(localStorage.getItem('mindcare_emotion_logs') || '[]');
      localStorage.setItem('mindcare_emotion_logs', JSON.stringify([record, ...existing]));
    } catch {
      // ignore
    }

    setSubmitted(true);
    sound.playSuccess();

    voice.speak(
      currentLang === 'as'
        ? 'আপোনাৰ অনুভৱ আমাক জনোৱাৰ বাবে ধন্যবাদ। আমি আপোনাৰ বাবে সহজ আৰু শান্ত কাম বাছি দিছোঁ।'
        : currentLang === 'bn'
        ? 'আপনার অনুভূতি জানানোর জন্য ধন্যবাদ।'
        : 'Thank you for sharing how you feel today. We will keep your activities calm and pleasant.',
      currentLang,
    );

    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setSelectedEmotion(null);
    }, 1800);
  };

  return (
    <div
      id="emotional-checkin-modal"
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border-2 border-[#dae1ff] shadow-2xl space-y-6 text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dae1ff] pb-4">
          <div className="flex items-center gap-2 text-left">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-rose-600 uppercase tracking-wider">
                Daily Wellness Check-In
              </span>
              <h3 className="text-xl font-black text-[#001849]">
                How are you feeling today, {patientName}?
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-[#f2f4fc] hover:bg-[#eaedff] flex items-center justify-center text-[#455f88] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-emerald-950">Thank you, {patientName}!</h4>
            <p className="text-xs sm:text-sm font-semibold text-[#455f88]">
              Your activity recommendations have been gently adapted to match your energy.
            </p>
          </div>
        ) : (
          <>
            {/* Emotion Option Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {EMOTIONS.map((item) => {
                const isSelected = selectedEmotion === item.type;
                return (
                  <button
                    key={item.type}
                    id={`emotion-btn-${item.type}`}
                    onClick={() => handleSelect(item.type)}
                    className={`min-h-[72px] p-4 rounded-2xl border-2 flex items-center gap-3.5 text-left transition-all shadow-2xs hover:scale-[1.02] active:scale-95 cursor-pointer ${
                      item.color
                    } ${isSelected ? 'ring-4 ring-[#006767]' : ''}`}
                  >
                    <span className="text-3xl">{item.emoji}</span>
                    <div className="flex-1">
                      <span className="font-extrabold text-sm sm:text-base block">
                        {item.label[currentLang] || item.label.en}
                      </span>
                      <span className="text-[11px] font-semibold opacity-80 block">
                        {item.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Non-Diagnostic Disclaimer */}
            <div className="bg-[#fafbff] p-3.5 rounded-2xl border border-[#dae1ff] text-[11px] text-[#455f88] font-medium text-left">
              🛡️ <span className="font-bold">Non-Diagnostic Check:</span> Used solely to provide gentle personalized activity pacing and caregiver awareness.
            </div>
          </>
        )}
      </div>
    </div>
  );
};
