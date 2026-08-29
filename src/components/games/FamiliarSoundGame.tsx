import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, CheckCircle, RefreshCw, Sparkles, Music } from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { getTranslation } from '../../services/i18n';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';

interface FamiliarSoundGameProps {
  currentLang: SupportedLanguage;
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number, accuracy: number, attempts: number) => void;
}

interface SoundQuestion {
  id: string;
  name: string;
  regionalName: Record<SupportedLanguage, string>;
  category: 'CULTURAL' | 'HOUSEHOLD' | 'NATURE';
  soundType: 'bihu_dhol' | 'tea_kettle' | 'tin_roof_rain' | 'temple_bell' | 'hornbill_bird' | 'ferry_horn';
  icon: string;
  options: {
    id: string;
    label: Record<SupportedLanguage, string>;
    icon: string;
    isCorrect: boolean;
  }[];
}

const SOUND_QUESTIONS: SoundQuestion[] = [
  {
    id: 'snd_1',
    name: 'Bihu Dhol (Traditional Drum)',
    regionalName: {
      en: 'Bihu Dhol (Assam Folk Drum)',
      as: 'বিহু ঢোলৰ মাত',
      bn: 'বিহু ঢোলের বাদ্য',
      mni: 'বিহু দ্রুম',
      lus: 'Bihu khuang',
      kha: 'Ka ksing Bihu',
      hi: 'बिहू ढोल की थाप',
    },
    category: 'CULTURAL',
    soundType: 'bihu_dhol',
    icon: '🥁',
    options: [
      {
        id: 'opt_dhol',
        label: {
          en: 'Bihu Dhol (Assam Drum)',
          as: 'বিহু ঢোল',
          bn: 'বিহু ঢোল',
          mni: 'বিহু দ্রুম',
          lus: 'Bihu khuang',
          kha: 'Ka ksing Bihu',
          hi: 'बिहू ढोल',
        },
        icon: '🥁',
        isCorrect: true,
      },
      {
        id: 'opt_bell',
        label: {
          en: 'Brass Temple Bell',
          as: 'মন্দিৰৰ কাঁহ-ঘণ্টা',
          bn: 'মন্দিরের কাঁসা ঘণ্টা',
          mni: 'লাইশঙগী ঘন্তা',
          lus: 'Biakin dar',
          kha: 'Ka shakuriaw mandir',
          hi: 'मंदिर का पीतल घंटा',
        },
        icon: '🔔',
        isCorrect: false,
      },
      {
        id: 'opt_rain',
        label: {
          en: 'Rain on Tin Roof',
          as: 'টিনৰ চালত বৰষুণৰ শব্দ',
          bn: 'টিনের চালে বৃষ্টি',
          mni: 'নন অমুক নোং চুরবা',
          lus: 'Rangva chunga ruah tla',
          kha: 'Ka slap ha tnum tin',
          hi: 'टिन की छत पर बारिश',
        },
        icon: '🌧️',
        isCorrect: false,
      },
    ],
  },
  {
    id: 'snd_2',
    name: 'Whistling Tea Kettle',
    regionalName: {
      en: 'Boiling Tea Kettle Whistle',
      as: 'চাহৰ কেটলীৰ হুইচেল',
      bn: 'চায়ের কেটলির শিষ',
      mni: 'চা পুংগী হুইসেল',
      lus: 'Thingpui bel sa ri',
      kha: 'Ka kettle sha kaba pyrkhah',
      hi: 'चाय की केतली की सीटी',
    },
    category: 'HOUSEHOLD',
    soundType: 'tea_kettle',
    icon: '🫖',
    options: [
      {
        id: 'opt_kettle',
        label: {
          en: 'Boiling Tea Kettle',
          as: 'গৰম চাহৰ কেটলী',
          bn: 'ফুটন্ত চায়ের কেটলি',
          mni: 'চা পুং',
          lus: 'Thingpui bel so',
          kha: 'Ka kettle sha',
          hi: 'उबलती चाय की केतली',
        },
        icon: '🫖',
        isCorrect: true,
      },
      {
        id: 'opt_bird',
        label: {
          en: 'Great Hornbill Chirp',
          as: 'ধনেশ পক্ষীৰ মাত',
          bn: 'ধনেশ পাখির ডাক',
          mni: 'উচেক খোন্থাং',
          lus: 'Vapual ri',
          kha: 'Ka sim Hornbill',
          hi: 'धनेश पक्षी की आवाज',
        },
        icon: '🦜',
        isCorrect: false,
      },
      {
        id: 'opt_ferry',
        label: {
          en: 'Brahmaputra Ferry Horn',
          as: 'ব্ৰহ্মপুত্ৰৰ ফেৰীৰ ভুভুৰী',
          bn: 'ব্রহ্মপুত্র ফেরির হর্ন',
          mni: 'হীগী হর্ন',
          lus: 'Lui lawng horn',
          kha: 'Ka horn jhad um',
          hi: 'ब्रह्मपुत्र नौका का हॉर्न',
        },
        icon: '⛴️',
        isCorrect: false,
      },
    ],
  },
  {
    id: 'snd_3',
    name: 'Rain on Assam Tin Roof',
    regionalName: {
      en: 'Rain on Assam Tin Roof',
      as: 'টিনৰ চালত বৰষুণৰ টুপ-টুপ শব্দ',
      bn: 'টিনের চালে মিষ্টি বৃষ্টির শব্দ',
      mni: 'নোংগী মখোল',
      lus: 'Ruah sur ri',
      kha: 'Ka jingriew slap ha tnum',
      hi: 'टिन की छत पर वर्षा की बूंदें',
    },
    category: 'NATURE',
    soundType: 'tin_roof_rain',
    icon: '🌧️',
    options: [
      {
        id: 'opt_rain_roof',
        label: {
          en: 'Monsoon Rain on Tin Roof',
          as: 'বৰষুণৰ টুপ-টুপ শব্দ',
          bn: 'টিনের চালে বৃষ্টি',
          mni: 'নোংগী মখোল',
          lus: 'Rangva chunga ruah',
          kha: 'Ka slap ha tnum',
          hi: 'छत पर बारिश की रिमझिम',
        },
        icon: '🌧️',
        isCorrect: true,
      },
      {
        id: 'opt_dhol_2',
        label: {
          en: 'Bihu Dhol & Pepa',
          as: 'বিহু পেঁপা',
          bn: 'বিহু পেপা বাদ্য',
          mni: 'বিহু পেপা',
          lus: 'Bihu rimawi',
          kha: 'Ka jingtem Bihu',
          hi: 'बिहू पेपा',
        },
        icon: '🎺',
        isCorrect: false,
      },
      {
        id: 'opt_bell_2',
        label: {
          en: 'Temple Brass Gong',
          as: 'মন্দিৰৰ কাঁহ',
          bn: 'মন্দিরের কাঁসা',
          mni: 'লাইশঙগী কাঁহ',
          lus: 'Dar ri',
          kha: 'Ka shakuriaw kynja',
          hi: 'मंदिर की घंटी',
        },
        icon: '🔔',
        isCorrect: false,
      },
    ],
  },
  {
    id: 'snd_4',
    name: 'Temple Brass Bell Chime',
    regionalName: {
      en: 'Temple Brass Bell Chime',
      as: 'মন্দিৰৰ কাঁহ-ঘণ্টাৰ ধ্বনি',
      bn: 'মন্দিরের মঙ্গল ঘণ্টা',
      mni: 'লাইশঙগী ঘন্তা',
      lus: 'Biakin dar ri mawi',
      kha: 'Ka shakuriaw mandir kaba jam',
      hi: 'मंदिर का पवित्र घंटा',
    },
    category: 'CULTURAL',
    soundType: 'temple_bell',
    icon: '🔔',
    options: [
      {
        id: 'opt_bell_ans',
        label: {
          en: 'Temple Brass Bell',
          as: 'মন্দিৰৰ কাঁহ-ঘণ্টা',
          bn: 'মন্দিরের ঘণ্টা',
          mni: 'লাইশঙগী ঘন্তা',
          lus: 'Biakin dar',
          kha: 'Ka shakuriaw',
          hi: 'मंदिर का घंटा',
        },
        icon: '🔔',
        isCorrect: true,
      },
      {
        id: 'opt_kettle_2',
        label: {
          en: 'Boiling Kettle',
          as: 'চাহৰ কেটলী',
          bn: 'চায়ের কেটলি',
          mni: 'চা পুং',
          lus: 'Thingpui bel',
          kha: 'Ka kettle sha',
          hi: 'चाय की केतली',
        },
        icon: '🫖',
        isCorrect: false,
      },
      {
        id: 'opt_bird_2',
        label: {
          en: 'Morning Songbird',
          as: 'ৰাতিপুৱাৰ চৰাইৰ কাকলি',
          bn: 'ভোরের পাখির গান',
          mni: 'অয়ুক্কী উচেক',
          lus: 'Zing sava ri',
          kha: 'Ka sim kaba rwai',
          hi: 'सुबह की चिड़िया',
        },
        icon: '🐦',
        isCorrect: false,
      },
    ],
  },
];

export const FamiliarSoundGame: React.FC<FamiliarSoundGameProps> = ({
  currentLang,
  difficulty,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = SOUND_QUESTIONS[currentIndex % SOUND_QUESTIONS.length];

  // Synthesize realistic regional sound using Web Audio API
  const playSynthesizedSound = (type: string) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      setIsPlayingAudio(true);

      if (type === 'bihu_dhol') {
        // Dhol drum pattern: Boom-da-boom
        const playBeat = (time: number, freq: number, decay: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
          osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + time + decay);
          gain.gain.setValueAtTime(0.8, ctx.currentTime + time);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + decay);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + time);
          osc.stop(ctx.currentTime + time + decay);
        };
        playBeat(0.0, 160, 0.4);
        playBeat(0.3, 140, 0.3);
        playBeat(0.6, 200, 0.25);
        playBeat(0.85, 150, 0.5);
        setTimeout(() => setIsPlayingAudio(false), 1400);
      } else if (type === 'temple_bell') {
        // Brass bell with shimmer
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.8);
        gain.gain.setValueAtTime(0.7, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 2.0);
        setTimeout(() => setIsPlayingAudio(false), 2000);
      } else if (type === 'tea_kettle') {
        // Kettle whistle rising pitch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.5);
        setTimeout(() => setIsPlayingAudio(false), 1600);
      } else if (type === 'tin_roof_rain') {
        // Rain droplets
        for (let i = 0; i < 15; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200 + Math.random() * 800, ctx.currentTime + i * 0.1);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + i * 0.1 + 0.08);
        }
        setTimeout(() => setIsPlayingAudio(false), 1800);
      } else {
        sound.playBell();
        setTimeout(() => setIsPlayingAudio(false), 1000);
      }
    } catch {
      sound.playBell();
      setIsPlayingAudio(false);
    }
  };

  useEffect(() => {
    // Auto-play sound on question load
    const timer = setTimeout(() => {
      playSynthesizedSound(currentQuestion.soundType);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handlePlayAudio = () => {
    sound.playClick();
    playSynthesizedSound(currentQuestion.soundType);
  };

  const handleSelectOption = (option: any) => {
    sound.playClick();
    setSelectedOptionId(option.id);
    setAttempts((prev) => prev + 1);

    if (option.isCorrect) {
      setIsCorrect(true);
      sound.playSuccess();
      setCorrectCount((prev) => prev + 1);

      voice.speak(
        currentLang === 'as'
          ? 'অতি সুন্দৰ! আপুনি শুদ্ধ শব্দটো চিনাক্ত কৰিছে।'
          : currentLang === 'bn'
          ? 'চমৎকার! আপনি সঠিক শব্দ শনাক্ত করেছেন।'
          : 'Wonderful! You identified the correct sound.',
        currentLang,
      );

      setTimeout(() => {
        if (currentIndex < SOUND_QUESTIONS.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOptionId(null);
          setIsCorrect(null);
        } else {
          // Finished game
          const accuracy = Math.round(((correctCount + 1) / (attempts + 1)) * 100);
          const finalScore = Math.min(100, Math.max(70, accuracy + 10));
          onComplete(finalScore, accuracy, attempts + 1);
        }
      }, 1600);
    } else {
      setIsCorrect(false);
      sound.playError();
      voice.speak(
        currentLang === 'as'
          ? 'এইটো নহয়, অনুগ্ৰহ কৰি শব্দটো আকৌ শুনি চাওক।'
          : currentLang === 'bn'
          ? 'এটি নয়, শব্দটি আবার শুনুন।'
          : 'Not quite, listen to the sound once again.',
        currentLang,
      );
    }
  };

  return (
    <div
      id="familiar-sound-game"
      className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#dae1ff] shadow-md space-y-6 text-center"
    >
      {/* Progress & Header */}
      <div className="flex items-center justify-between border-b border-[#dae1ff] pb-4">
        <div className="flex items-center gap-2 text-left">
          <div className="w-10 h-10 rounded-2xl bg-[#006767] text-white flex items-center justify-center font-bold">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black text-[#006767] uppercase tracking-wider">
              Auditory Recognition & Focus
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#001849]">
              What sound do you hear?
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-[#455f88] block">Question</span>
          <span className="text-lg font-black text-[#001849]">
            {currentIndex + 1} / {SOUND_QUESTIONS.length}
          </span>
        </div>
      </div>

      {/* Main Sound Listening Stage */}
      <div className="bg-[#f2f4fc] p-8 rounded-3xl border-2 border-[#dae1ff] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
        <div
          className={`w-28 h-28 rounded-full flex items-center justify-center cursor-pointer transition-all ${
            isPlayingAudio
              ? 'bg-[#006767] text-white scale-110 shadow-lg ring-8 ring-[#a3e4d7]'
              : 'bg-white text-[#006767] border-4 border-[#006767] hover:scale-105 shadow-md'
          }`}
          onClick={handlePlayAudio}
          role="button"
          tabIndex={0}
        >
          <Volume2 className={`w-12 h-12 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
        </div>

        <div className="space-y-1 text-center">
          <button
            id="replay-sound-btn"
            onClick={handlePlayAudio}
            className="min-h-[44px] px-6 py-2 bg-[#006767] hover:bg-[#004d4d] text-white font-extrabold text-sm sm:text-base rounded-2xl flex items-center gap-2 shadow-xs transition-all mx-auto active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isPlayingAudio ? 'animate-spin' : ''}`} />
            <span>{isPlayingAudio ? 'Listening...' : '🔊 Tap to Listen Again'}</span>
          </button>
          <p className="text-xs font-semibold text-[#455f88]">
            Close your eyes, listen gently, and identify the familiar source.
          </p>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {currentQuestion.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          let btnStyle = 'bg-white border-2 border-[#dae1ff] text-[#001849] hover:border-[#006767]';

          if (isSelected) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-100 border-2 border-emerald-600 text-emerald-900 shadow-md';
            } else if (isCorrect === false) {
              btnStyle = 'bg-rose-100 border-2 border-rose-600 text-rose-900';
            }
          }

          return (
            <button
              key={opt.id}
              id={`sound-option-${opt.id}`}
              onClick={() => handleSelectOption(opt)}
              className={`min-h-[90px] p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-extrabold text-sm sm:text-base transition-all shadow-xs active:scale-95 cursor-pointer ${btnStyle}`}
            >
              <span className="text-3xl">{opt.icon}</span>
              <span className="text-center font-bold line-clamp-2">
                {opt.label[currentLang] || opt.label.en}
              </span>
            </button>
          );
        })}
      </div>

      {/* Encouragement Banner */}
      <div className="bg-[#fafbff] p-3.5 rounded-2xl border border-[#dae1ff] flex items-center justify-between text-xs text-[#455f88] font-semibold">
        <span>🎧 Comforting sounds from North East daily life</span>
        <span className="font-extrabold text-[#006767]">Non-timed relaxing exercise</span>
      </div>
    </div>
  );
};
