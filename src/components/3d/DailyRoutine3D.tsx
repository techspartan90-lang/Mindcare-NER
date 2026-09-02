import React, { useState, useEffect } from 'react';
import {
  Clock,
  Pill,
  Droplet,
  Coffee,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Volume2,
  RotateCcw,
  Calendar,
  ChevronRight,
  Info,
} from 'lucide-react';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';
import { SupportedLanguage } from '../../types';

interface DailyRoutine3DProps {
  currentLang: SupportedLanguage;
}

export const DailyRoutine3D: React.FC<DailyRoutine3DProps> = ({ currentLang }) => {
  const [selectedPhase, setSelectedPhase] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [waterCount, setWaterCount] = useState(5);
  const [checkedRoutines, setCheckedRoutines] = useState<string[]>(['bp_meds', 'morning_tea']);

  const PHASES = [
    {
      id: 'morning',
      label: 'Morning Awakening',
      time: '6:30 AM – 11:30 AM',
      icon: Sun,
      color: 'text-[#F4B740]',
      items: [
        {
          id: 'bp_meds',
          title: 'Blood Pressure Medication (Amlodipine 5mg)',
          time: '7:00 AM',
          type: 'medicine',
          note: 'Taken with warm water after waking up',
        },
        {
          id: 'morning_tea',
          title: 'Warm Assam Red Tea & Light Biscuit',
          time: '8:00 AM',
          type: 'meal',
          note: 'Enjoyed peacefully on the east balcony',
        },
        {
          id: 'morning_memory',
          title: 'Morning Orchid Memory Blossom Activity',
          time: '10:00 AM',
          type: 'activity',
          note: '10 minutes of gentle memory matching',
        },
      ],
    },
    {
      id: 'afternoon',
      label: 'Afternoon Nourishment',
      time: '12:00 PM – 4:00 PM',
      icon: Coffee,
      color: 'text-[#38D9C5]',
      items: [
        {
          id: 'lunch_meal',
          title: 'Light Traditional Lunch (Bhaat & Masor Tenga)',
          time: '1:00 PM',
          type: 'meal',
          note: 'Balanced mild home meal',
        },
        {
          id: 'memory_vitamin',
          title: 'Memory Support Multivitamin Tablet',
          time: '1:45 PM',
          type: 'medicine',
          note: 'Scheduled with post-lunch glass of water',
        },
        {
          id: 'afternoon_rest',
          title: 'Quiet Rest & Soothing Flute Soundscape',
          time: '2:30 PM',
          type: 'rest',
          note: '30 minutes resting eyes without agitation',
        },
      ],
    },
    {
      id: 'evening',
      label: 'Evening Sunset Pacing',
      time: '4:30 PM – 8:00 PM',
      icon: Moon,
      color: 'text-[#8B7CFF]',
      items: [
        {
          id: 'family_checkin',
          title: 'Family Voice Note & Check-in with Priyanka',
          time: '5:30 PM',
          type: 'family',
          note: 'Daughter voice note check-in',
        },
        {
          id: 'evening_walk',
          title: 'Gentle Corridor Walk & Breathing Balance',
          time: '6:15 PM',
          type: 'activity',
          note: '500 slow steps before dusk',
        },
        {
          id: 'dinner_meal',
          title: 'Warm Soup & Light Dinner',
          time: '7:30 PM',
          type: 'meal',
          note: 'Comforting, low sodium meal',
        },
      ],
    },
    {
      id: 'night',
      label: 'Nighttime Rest',
      time: '8:30 PM – 6:00 AM',
      icon: Moon,
      color: 'text-[#5BA7FF]',
      items: [
        {
          id: 'night_hydration',
          title: 'Warm Water Glass at Bedside',
          time: '9:00 PM',
          type: 'hydration',
          note: 'Hydration tumbler prepped on nightstand',
        },
        {
          id: 'sleep_soundscape',
          title: 'River Rain Calming Soundscape Timer',
          time: '9:30 PM',
          type: 'rest',
          note: 'Auto turns off after 45 minutes',
        },
      ],
    },
  ];

  const handleToggleRoutine = (id: string, title: string) => {
    sound.playClick();
    if (checkedRoutines.includes(id)) {
      setCheckedRoutines((prev) => prev.filter((item) => item !== id));
    } else {
      sound.playSuccess();
      setCheckedRoutines((prev) => [...prev, id]);
      voice.speak(`Marked completed: ${title}.`, currentLang);
    }
  };

  const handleAddWater = () => {
    sound.playSuccess();
    const next = waterCount + 1;
    setWaterCount(next);
    voice.speak(`Logged 1 fresh glass of water. Total today is ${next} glasses.`, currentLang);
  };

  return (
    <section
      id="section-routine-3d"
      className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#243A50] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14283D] border border-[#243A50] text-[#F4B740] text-xs font-black uppercase tracking-wider">
            <Clock className="w-4 h-4 text-[#F4B740]" />
            <span>3D Circadian Routine Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            Daily Routine & Medication Pacing
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6] max-w-2xl">
            A dimensional 24-hour visual schedule connecting medications, hydration reminders,
            gentle walks, and family check-ins to prevent evening anxiety and sundowning.
          </p>
        </div>

        {/* Phase Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#14283D] p-1.5 rounded-2xl border border-[#243A50]">
          {PHASES.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedPhase(p.id as any);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  selectedPhase === p.id
                    ? 'bg-[#F4B740] text-[#07111F] shadow-md font-black'
                    : 'text-[#B7C5D6] hover:text-[#F4F8FC] hover:bg-[#101F31]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Routine Timeline Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 3D Timeline Schedule */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-3xl bg-[#14283D] border border-[#243A50] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#F4F8FC]">
                  {PHASES.find((p) => p.id === selectedPhase)?.label}
                </h3>
                <p className="text-xs text-[#38D9C5] font-semibold">
                  {PHASES.find((p) => p.id === selectedPhase)?.time}
                </p>
              </div>

              <span className="text-xs text-[#7F91A6] font-bold">
                Tap checkbox to confirm step
              </span>
            </div>

            {/* List of Tasks with Color Status */}
            <div className="space-y-3 pt-2">
              {PHASES.find((p) => p.id === selectedPhase)?.items.map((item) => {
                const isDone = checkedRoutines.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleRoutine(item.id, item.title)}
                    className={`p-4 sm:p-5 rounded-2xl border-2 flex items-start justify-between gap-4 transition-all cursor-pointer ${
                      isDone
                        ? 'bg-[#35D07F]/10 border-[#35D07F] text-[#F4F8FC]'
                        : 'bg-[#101F31] border-[#243A50] hover:border-[#F4B740]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 ${
                          isDone
                            ? 'bg-[#35D07F] text-[#07111F]'
                            : 'bg-[#14283D] border border-[#243A50] text-[#F4B740]'
                        }`}
                      >
                        {item.type === 'medicine' ? (
                          <Pill className="w-5 h-5" />
                        ) : item.type === 'meal' ? (
                          <Coffee className="w-5 h-5" />
                        ) : item.type === 'activity' ? (
                          <Sparkles className="w-5 h-5" />
                        ) : (
                          <Droplet className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#38D9C5] bg-[#14283D] px-2 py-0.5 rounded-md border border-[#243A50]">
                            {item.time}
                          </span>
                          <h4 className="text-sm sm:text-base font-black text-[#F4F8FC]">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-xs text-[#B7C5D6]">{item.note}</p>
                      </div>
                    </div>

                    <div className="pt-1">
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-[#35D07F]" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-[#7F91A6]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: 3D Hydration Tracker & Circadian Pacing Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Hydration Tracker Glass */}
          <div className="p-6 rounded-3xl bg-[#14283D] border border-[#243A50] text-center space-y-4 shadow-inner">
            <div className="w-16 h-16 rounded-2xl bg-[#101F31] border border-[#243A50] text-[#5BA7FF] flex items-center justify-center mx-auto text-2xl shadow-md">
              💧
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-[#F4F8FC]">Daily Hydration Pacing</h4>
              <p className="text-xs text-[#B7C5D6]">
                Target: 6–8 glasses to support neurovascular circulation.
              </p>
            </div>

            <div className="p-3 bg-[#101F31] rounded-2xl border border-[#243A50] flex items-center justify-center gap-3">
              <span className="text-2xl font-black text-[#5BA7FF]">{waterCount}</span>
              <span className="text-xs text-[#B7C5D6]">glasses logged today</span>
            </div>

            <button
              onClick={handleAddWater}
              className="w-full py-3 bg-[#5BA7FF] hover:bg-[#5BA7FF]/90 text-[#07111F] font-black text-xs rounded-xl shadow-lg cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Droplet className="w-4 h-4" />
              <span>+ Log 1 Glass of Water</span>
            </button>
          </div>

          {/* Sundowning Guard Card */}
          <div className="p-5 rounded-3xl bg-[#14283D] border border-[#243A50] space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-[#8B7CFF]">
              <Sparkles className="w-4 h-4" />
              <span>Sundowning Prevention Protocol</span>
            </div>
            <p className="text-xs text-[#B7C5D6] leading-relaxed">
              Between 4:00 PM and 7:00 PM, elderly seniors frequently experience confusion and restlessness.
              MindCare automatically prompts familiar family voice notes and dims visual glare.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
