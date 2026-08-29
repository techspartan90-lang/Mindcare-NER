import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  Volume2,
  Droplet,
  Pill,
  PhoneCall,
  Calendar,
  Sun,
  ShieldAlert,
  Play,
  Heart,
  Headphones,
  CheckCircle2,
  Mic,
  AlertTriangle,
  Smile,
  Flower2,
  BookOpen,
  CalendarCheck,
  Shield,
  HelpCircle,
} from 'lucide-react';
import {
  CognitiveGame,
  PatientProfile,
  SupportedLanguage,
  AIRecommendation,
} from '../../types';
import { getTranslation } from '../../services/i18n';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';
import { offlineSync } from '../../services/offlineSync';
import { CognitiveProgressChart } from './CognitiveProgressChart';
import { EmotionalCheckInModal } from './EmotionalCheckInModal';
import { AssistanceModeModal } from './AssistanceModeModal';
import { PersonalizedDailyPlan } from './PersonalizedDailyPlan';
import { MemoryGarden } from './MemoryGarden';
import { PixelSwap } from '../ui/PixelSwap';

interface PatientDashboardProps {
  patient: PatientProfile;
  currentLang: SupportedLanguage;
  onOpenGames: () => void;
  onOpenReminders: () => void;
  onOpenFamily: () => void;
  onOpenMusic: () => void;
  onOpenVoiceAssistant: () => void;
  onSelectGame: (gameId: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patient,
  currentLang,
  onOpenGames,
  onOpenReminders,
  onOpenFamily,
  onOpenMusic,
  onOpenVoiceAssistant,
  onSelectGame,
}) => {
  const [waterGlasses, setWaterGlasses] = useState(5);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [showEmotionModal, setShowEmotionModal] = useState(false);
  const [showAssistanceModal, setShowAssistanceModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DAILY_PLAN' | 'GARDEN'>('OVERVIEW');

  const t = getTranslation(currentLang);

  // Time & Date updater in local language format
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      );
      setCurrentDateStr(
        now.toLocaleDateString([], {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch AI Recommendation
  useEffect(() => {
    const fetchRec = async () => {
      try {
        const res = await fetch(`/api/recommendations/${patient.id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) setRecommendation(json.data);
        }
      } catch {}
    };
    fetchRec();
  }, [patient.id]);

  const handleAddWater = () => {
    sound.playSuccess();
    const nextCount = waterGlasses + 1;
    setWaterGlasses(nextCount);

    const message =
      currentLang === 'as'
        ? `সুন্দৰ! আপুনি ${nextCount} গিলাচ পানী খালে। শৰীৰ সুস্থ ৰাখক।`
        : currentLang === 'bn'
        ? `চমৎকার! আপনি ${nextCount} গ্লাস জল খেলেন।`
        : `Wonderful! You drank ${nextCount} glasses of water today. Staying hydrated keeps your mind fresh.`;

    voice.speak(message, currentLang);
  };

  const handleReadOrientation = () => {
    sound.playClick();
    const text = `Namaskar ${patient.name}. Today is ${currentDateStr}, and the current time is ${currentTimeStr}. You are safe at home in ${patient.location}.`;
    voice.speak(text, currentLang);
  };

  return (
    <div id="patient-dashboard-container" className="space-y-6 pb-12">
      {/* Friendly Orientation & Welcome Banner */}
      <div className="bg-gradient-to-br from-[#006767] to-[#004f50] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10 text-left">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-teal-100 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-300" />
              {patient.location} • Pleasant & Peaceful
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t.greetingMorning}, {patient.name.split(' ')[0]}-da!
          </h2>

          <p className="text-teal-100 text-lg font-medium flex items-center gap-2 flex-wrap">
            <span>📅 {currentDateStr}</span>
            <span className="opacity-60">•</span>
            <span>⏰ {currentTimeStr}</span>
          </p>
        </div>

        {/* Quick Voice Orientation & Emotional Check-In */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10 w-full md:w-auto">
          <button
            id="read-orientation-btn"
            onClick={handleReadOrientation}
            className="min-h-[44px] px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 border border-white/20 transition-all active:scale-95 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Spoken Time</span>
          </button>

          <button
            id="daily-mood-checkin-btn"
            onClick={() => {
              sound.playClick();
              setShowEmotionModal(true);
            }}
            className="min-h-[44px] px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <Smile className="w-4 h-4" />
            <span>Daily Mood Check-In</span>
          </button>

          <button
            id="contact-caregiver-header-btn"
            onClick={() => {
              sound.playClick();
              setShowAssistanceModal(true);
            }}
            className="min-h-[44px] px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>I Need Help</span>
          </button>
        </div>
      </div>

      {/* Primary Patient Hub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#243A50] pb-2 overflow-x-auto">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('OVERVIEW');
          }}
          className={`min-h-[44px] px-5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'OVERVIEW'
              ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
              : 'bg-[#101F31] text-[#B7C5D6] hover:bg-[#14283D] border border-[#243A50]'
          }`}
        >
          🏠 Main Dashboard
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('DAILY_PLAN');
          }}
          className={`min-h-[44px] px-5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'DAILY_PLAN'
              ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
              : 'bg-[#101F31] text-[#B7C5D6] hover:bg-[#14283D] border border-[#243A50]'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Today's Activity Plan</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('GARDEN');
          }}
          className={`min-h-[44px] px-5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'GARDEN'
              ? 'bg-[#8B7CFF] text-[#07111F] font-black shadow-xs'
              : 'bg-[#101F31] text-[#8B7CFF] border border-[#243A50] hover:bg-[#14283D]'
          }`}
        >
          <Flower2 className="w-4 h-4 text-[#8B7CFF] fill-[#8B7CFF]" />
          <span>My Memory Garden (18 Blossoms)</span>
        </button>
      </div>

      {/* TAB 1: MAIN DASHBOARD */}
      {activeTab === 'OVERVIEW' && (
        <>
          {/* Main 4 Action Tiles Grid (Elderly-First High Contrast Touch Targets) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Tile 1: Cognitive Games */}
            <button
              id="tile-play-games"
              onClick={() => {
                sound.playClick();
                onOpenGames();
              }}
              className="bg-[#101F31] hover:bg-[#14283D] p-6 rounded-3xl border border-[#243A50] hover:border-[#19C3B1] shadow-xl text-left flex flex-col justify-between min-h-[180px] transition-all transform active:scale-98 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-950/80 text-[#38D9C5] group-hover:bg-[#19C3B1] group-hover:text-[#07111F] flex items-center justify-center text-3xl transition-colors shadow-xs border border-teal-800/60">
                🌸
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#F4F8FC] group-hover:text-[#38D9C5]">
                  {t.gamesTitle}
                </h3>
                <p className="text-xs font-semibold text-[#B7C5D6] mt-1">
                  Cultural motifs, audio recognition & stories
                </p>
              </div>
            </button>

            {/* Tile 2: Daily Medicine & Routines */}
            <button
              id="tile-daily-reminders"
              onClick={() => {
                sound.playClick();
                onOpenReminders();
              }}
              className="bg-[#101F31] hover:bg-[#14283D] p-6 rounded-3xl border border-[#243A50] hover:border-[#F4B740] shadow-xl text-left flex flex-col justify-between min-h-[180px] transition-all transform active:scale-98 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-950/80 text-amber-300 group-hover:bg-[#F4B740] group-hover:text-[#07111F] flex items-center justify-center text-3xl transition-colors shadow-xs border border-amber-800/60">
                💊
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#F4F8FC] group-hover:text-[#F4B740]">
                  {t.dailyRoutine}
                </h3>
                <p className="text-xs font-semibold text-[#B7C5D6] mt-1">
                  Morning medicine taken • Next at 5:30 PM
                </p>
              </div>
            </button>

            {/* Tile 3: Call Family */}
            <button
              id="tile-call-family"
              onClick={() => {
                sound.playClick();
                onOpenFamily();
              }}
              className="bg-[#101F31] hover:bg-[#14283D] p-6 rounded-3xl border border-[#243A50] hover:border-[#ec4899] shadow-xl text-left flex flex-col justify-between min-h-[180px] transition-all transform active:scale-98 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-pink-950/80 text-pink-300 group-hover:bg-[#ec4899] group-hover:text-[#07111F] flex items-center justify-center text-3xl transition-colors shadow-xs border border-pink-800/60">
                ❤️
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#F4F8FC] group-hover:text-pink-400">
                  {t.familyTitle}
                </h3>
                <p className="text-xs font-semibold text-[#B7C5D6] mt-1">
                  Priyanka (Daughter) & Arunav (Grandson)
                </p>
              </div>
            </button>

            {/* Tile 4: Soothing Music & River Sounds */}
            <button
              id="tile-peaceful-music"
              onClick={() => {
                sound.playClick();
                onOpenMusic();
              }}
              className="bg-[#101F31] hover:bg-[#14283D] p-6 rounded-3xl border border-[#243A50] hover:border-[#5BA7FF] shadow-xl text-left flex flex-col justify-between min-h-[180px] transition-all transform active:scale-98 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-950/80 text-blue-300 group-hover:bg-[#5BA7FF] group-hover:text-[#07111F] flex items-center justify-center text-3xl transition-colors shadow-xs border border-blue-800/60">
                🌊
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#F4F8FC] group-hover:text-[#5BA7FF]">
                  Peaceful Soundscapes
                </h3>
                <p className="text-xs font-semibold text-[#B7C5D6] mt-1">
                  Brahmaputra waves & soothing bamboo flutes
                </p>
              </div>
            </button>
          </div>

          {/* Interactive Reminiscence Blossom Reveal (PixelSwap Component) */}
          <div className="bg-gradient-to-br from-[#0B1726] to-[#101F31] rounded-3xl p-6 sm:p-8 text-[#F4F8FC] shadow-2xl border border-[#243A50]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-teal-950/80 text-[#38D9C5] text-xs font-black uppercase tracking-wider border border-teal-700/60">
                    ✨ Daily Reminiscence Blossom
                  </span>
                  <span className="text-xs text-[#B7C5D6] font-semibold">
                    Interactive Memory Recall
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 text-[#F4F8FC]">
                  Cherished North East Memory Reveal
                </h3>
              </div>
              <p className="text-xs text-[#38D9C5] font-bold bg-[#14283D] px-4 py-2 rounded-2xl border border-[#243A50]">
                👆 Click or tap the card below to reveal the memory
              </p>
            </div>

            <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-[#243A50]">
              <PixelSwap
                firstContent={
                  <div className="w-full h-full min-h-[180px] bg-[#14283D] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 cursor-pointer select-none border border-[#243A50]">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-[#101F31] text-4xl flex items-center justify-center border border-[#243A50] shrink-0">
                        🌸
                      </div>
                      <div className="text-left space-y-1">
                        <span className="text-xs font-black text-[#38D9C5] uppercase tracking-wide">
                          Cultural Memory Clue #14
                        </span>
                        <h4 className="text-xl sm:text-2xl font-black text-[#F4F8FC]">
                          "Which vibrant purple flower blossoms during Rongali Bihu?"
                        </h4>
                        <p className="text-sm font-semibold text-[#B7C5D6]">
                          Hint: Celebrated across Assam verandas and worn in spring dances. Click to reveal answer!
                        </p>
                      </div>
                    </div>
                    <div className="px-5 py-3 rounded-2xl bg-[#19C3B1] text-[#07111F] font-black text-sm whitespace-nowrap shadow-xs">
                      Reveal Memory ➔
                    </div>
                  </div>
                }
                secondContent={
                  <div className="w-full h-full min-h-[180px] bg-gradient-to-r from-[#101F31] to-[#14283D] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 cursor-pointer select-none border border-[#243A50]">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-fuchsia-950/60 border border-fuchsia-800/60 text-4xl flex items-center justify-center shrink-0">
                        🌺
                      </div>
                      <div className="text-left space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-fuchsia-300 uppercase tracking-wide">
                            Memory Unlocked!
                          </span>
                          <span className="text-xs bg-emerald-950/80 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-800">
                            +10 Garden Points
                          </span>
                        </div>
                        <h4 className="text-xl sm:text-2xl font-black text-[#F4F8FC]">
                          কপৌ ফুল • Kopou Phool (Foxtail Orchid)
                        </h4>
                        <p className="text-sm font-semibold text-[#B7C5D6] max-w-2xl">
                          Worn by Bihu dancers as a symbol of love and fertility. Your daughter Priyanka planted one in your Guwahati home garden in 1988!
                        </p>
                      </div>
                    </div>
                    <div className="px-5 py-3 rounded-2xl bg-[#101F31] hover:bg-[#162B40] text-[#F4F8FC] font-black text-xs whitespace-nowrap border border-[#243A50]">
                      ↺ Flip Back
                    </div>
                  </div>
                }
                pixelSize={48}
                gap={0}
                pixelRadius={0}
                pixelScale={0.35}
                duration={1000}
                pixelDuration={350}
                pattern="center"
                fade={true}
                trigger="click"
                aspectRatio="auto"
                className="w-full"
              />
            </div>
          </div>

          {/* 30-Day Cognitive Progress Visualization (Recharts) */}
          <CognitiveProgressChart patient={patient} currentLang={currentLang} />

          {/* Hydration Tracker & Direct Caregiver Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hydration Widget */}
            <div className="md:col-span-2 bg-[#101F31] rounded-3xl p-6 border border-[#243A50] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-left">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#38D9C5]">
                  <Droplet className="w-6 h-6 text-[#5BA7FF] fill-[#5BA7FF]" />
                  <span className="font-black text-base uppercase tracking-wider">
                    Daily Hydration Care
                  </span>
                </div>
                <h4 className="text-2xl font-black text-[#F4F8FC]">
                  {waterGlasses} of 8 Glasses Drank Today
                </h4>
                <div className="flex items-center gap-2 pt-1">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-7 h-9 rounded-md border flex items-center justify-center text-xs font-bold transition-all ${
                        i < waterGlasses
                          ? 'bg-[#5BA7FF] border-[#5BA7FF] text-[#07111F] shadow-xs'
                          : 'bg-[#14283D] border-[#243A50] text-[#7F91A6]'
                      }`}
                    >
                      💧
                    </div>
                  ))}
                </div>
              </div>

              <button
                id="log-water-glass-btn"
                onClick={handleAddWater}
                className="w-full sm:w-auto min-h-[52px] px-6 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] text-base font-black rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <Droplet className="w-5 h-5 fill-[#07111F]" />
                <span>I Drank a Glass</span>
              </button>
            </div>

            {/* Assistance Mode Box */}
            <div className="bg-rose-950/50 border border-rose-800/80 rounded-3xl p-6 flex flex-col justify-between space-y-4 text-left">
              <div>
                <div className="flex items-center gap-2 text-rose-300">
                  <ShieldAlert className="w-6 h-6" />
                  <span className="font-black text-sm uppercase">Need Help?</span>
                </div>
                <p className="text-xs font-semibold text-rose-200 mt-1">
                  One-tap to contact daughter Priyanka or request immediate assistance.
                </p>
              </div>

              <button
                id="patient-sos-btn"
                onClick={() => {
                  sound.playClick();
                  setShowAssistanceModal(true);
                }}
                className="w-full min-h-[52px] font-black text-base rounded-2xl flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 bg-[#FF5C6C] hover:bg-rose-600 text-[#07111F] cursor-pointer"
              >
                <PhoneCall className="w-5 h-5 fill-[#07111F]" />
                <span>Contact My Caregiver</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: PERSONALIZED DAILY PLAN */}
      {activeTab === 'DAILY_PLAN' && (
        <PersonalizedDailyPlan
          currentLang={currentLang}
          patientName={patient.name}
          recommendation={recommendation}
          onLaunchGame={(gameId) => onSelectGame(gameId)}
        />
      )}

      {/* TAB 3: MEMORY GARDEN */}
      {activeTab === 'GARDEN' && (
        <MemoryGarden currentLang={currentLang} patientName={patient.name} />
      )}

      {/* Modals */}
      <EmotionalCheckInModal
        isOpen={showEmotionModal}
        currentLang={currentLang}
        patientName={patient.name}
        onClose={() => setShowEmotionModal(false)}
        onSelectNeedHelp={() => setShowAssistanceModal(true)}
      />

      <AssistanceModeModal
        isOpen={showAssistanceModal}
        currentLang={currentLang}
        patientName={patient.name}
        caregiverName={patient.caregiverName}
        caregiverPhone={patient.caregiverPhone}
        onClose={() => setShowAssistanceModal(false)}
      />
    </div>
  );
};
