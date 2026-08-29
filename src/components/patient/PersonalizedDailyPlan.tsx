import React, { useState } from 'react';
import {
  CalendarCheck,
  Sparkles,
  Play,
  CheckCircle,
  HelpCircle,
  Sun,
  Sunrise,
  Sunset,
  ArrowRight,
  Clock,
} from 'lucide-react';
import {
  SupportedLanguage,
  DailyActivityPlanItem,
  AIRecommendation,
  CognitiveGame,
} from '../../types';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';

interface PersonalizedDailyPlanProps {
  currentLang: SupportedLanguage;
  patientName: string;
  recommendation?: AIRecommendation | null;
  onLaunchGame: (gameId: string, difficulty?: 'easy' | 'medium' | 'hard') => void;
}

const DEFAULT_PLAN: DailyActivityPlanItem[] = [
  {
    id: 'plan_1',
    timeSlot: 'MORNING',
    scheduledTime: '09:00 AM',
    title: 'Morning Awakening & Familiar Sound Recall',
    description: 'Calm sensory activation with regional sounds (Bihu Dhol, Temple Bell).',
    category: 'SOUND_RECOGNITION',
    gameId: 'game_familiar_sounds',
    targetSkill: 'Auditory Gnosia & Attention',
    isCompleted: true,
    recommendedDifficulty: 'easy',
    whyRecommended:
      'Past logs show highest attention alertness in the morning; familiar acoustic cues stimulate cognitive warmth.',
  },
  {
    id: 'plan_2',
    timeSlot: 'AFTERNOON',
    scheduledTime: '02:30 PM',
    title: 'Cultural Memory Match & Object Recognition',
    description: 'Pairing Assam cultural motifs and household tools.',
    category: 'MEMORY',
    gameId: 'game_memory_match',
    targetSkill: 'Visual Working Memory & Patterning',
    isCompleted: false,
    recommendedDifficulty: 'easy',
    whyRecommended:
      'Maintains active recall stability post-lunch with gentle 2x3 cards and soothing visual feedback.',
  },
  {
    id: 'plan_3',
    timeSlot: 'EVENING',
    scheduledTime: '06:30 PM',
    title: 'Family Album Quiz & Story Mode Reminiscence',
    description: 'Engage with photos of daughter Priyanka and nostalgic Assam stories.',
    category: 'FAMILY_MEMORY',
    gameId: 'game_family_memory',
    targetSkill: 'Episodic Long-Term Memory & Emotional Well-Being',
    isCompleted: false,
    recommendedDifficulty: 'easy',
    whyRecommended:
      'Evening reminiscence strengthens social connection, reduces sundowning anxiety, and elevates mood.',
  },
];

export const PersonalizedDailyPlan: React.FC<PersonalizedDailyPlanProps> = ({
  currentLang,
  patientName,
  recommendation,
  onLaunchGame,
}) => {
  const [planItems, setPlanItems] = useState<DailyActivityPlanItem[]>(DEFAULT_PLAN);
  const [expandedExplanationId, setExpandedExplanationId] = useState<string | null>(null);

  const handleStartActivity = (item: DailyActivityPlanItem) => {
    sound.playClick();
    if (item.gameId) {
      onLaunchGame(item.gameId, item.recommendedDifficulty);
    }
  };

  const toggleExplanation = (id: string) => {
    sound.playClick();
    setExpandedExplanationId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      id="personalized-daily-plan"
      className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#dae1ff] shadow-md space-y-6 text-left"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-[#dae1ff] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#006767] text-white flex items-center justify-center font-bold">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-[#006767] uppercase tracking-wider">
              Personalized Activity Schedule
            </span>
            <span className="bg-[#f0fdf4] text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Adaptive Engine Active
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#001849]">
            Today's Gentle Activity Sequence
          </h2>

          <p className="text-xs sm:text-sm font-semibold text-[#455f88] max-w-2xl">
            Custom-tailored daily cognitive engagement designed around your natural circadian rhythm and past activity trends.
          </p>
        </div>

        {/* Status Tracker */}
        <div className="flex items-center gap-2 bg-[#f2f4fc] px-4 py-2 rounded-2xl border border-[#dae1ff]">
          <span className="text-xs font-extrabold text-[#001849]">1 of 3 Completed</span>
          <div className="w-20 bg-slate-200 rounded-full h-2.5">
            <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '33%' }} />
          </div>
        </div>
      </div>

      {/* Sequence Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {planItems.map((item) => {
          const isExpanded = expandedExplanationId === item.id;
          const slotIcon =
            item.timeSlot === 'MORNING' ? (
              <Sunrise className="w-5 h-5 text-amber-500" />
            ) : item.timeSlot === 'AFTERNOON' ? (
              <Sun className="w-5 h-5 text-orange-500" />
            ) : (
              <Sunset className="w-5 h-5 text-indigo-500" />
            );

          return (
            <div
              key={item.id}
              className={`rounded-2xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 shadow-2xs ${
                item.isCompleted
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : 'bg-[#fafbff] border-[#dae1ff] hover:border-[#006767]'
              }`}
            >
              <div className="space-y-3">
                {/* Slot Tag & Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-xs text-[#001849]">
                    {slotIcon}
                    <span>{item.timeSlot} • {item.scheduledTime}</span>
                  </div>

                  {item.isCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold text-[#006767] bg-[#e6f5f5] px-2 py-0.5 rounded-full">
                      Up Next
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-base font-black text-[#001849] line-clamp-1">{item.title}</h4>
                  <p className="text-xs font-semibold text-[#455f88] line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                {/* Target Skill Tag */}
                <div className="text-[11px] font-bold text-[#006767] flex items-center gap-1">
                  <span>🎯 Target: {item.targetSkill}</span>
                </div>
              </div>

              {/* Action Area & AI Explanation Toggle */}
              <div className="space-y-2 pt-2 border-t border-[#dae1ff]/70">
                {!item.isCompleted ? (
                  <button
                    id={`start-plan-${item.id}`}
                    onClick={() => handleStartActivity(item)}
                    className="w-full min-h-[44px] bg-[#006767] hover:bg-[#004d4d] text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Activity Now</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartActivity(item)}
                    className="w-full min-h-[40px] bg-white text-[#006767] border border-[#dae1ff] hover:bg-[#f2f4fc] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Replay for Enjoyment</span>
                  </button>
                )}

                <button
                  onClick={() => toggleExplanation(item.id)}
                  className="w-full text-center text-[11px] font-bold text-[#455f88] hover:text-[#006767] flex items-center justify-center gap-1 py-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{isExpanded ? 'Hide reason' : 'Why recommended?'}</span>
                </button>

                {isExpanded && (
                  <div className="bg-white p-3 rounded-xl border border-[#dae1ff] text-[11px] font-medium text-[#455f88] shadow-2xs">
                    💡 <span className="font-bold">AI Rationale:</span> {item.whyRecommended}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
