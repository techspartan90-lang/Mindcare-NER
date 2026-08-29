import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Volume2,
  TreePine,
  Sun,
  Droplets,
  Flower2,
  Sprout,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { SupportedLanguage, MemoryGardenState, MemoryGardenItem } from '../../types';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';

interface MemoryGardenProps {
  currentLang: SupportedLanguage;
  patientName: string;
}

const DEFAULT_GARDEN: MemoryGardenState = {
  patientId: 'p_dhiren_01',
  totalFlowers: 14,
  totalPlants: 8,
  totalButterflies: 6,
  treeGrowthStage: 3, // 1 to 5
  lastBloomDate: new Date().toISOString(),
  items: [
    {
      id: 'g_1',
      type: 'FLOWER',
      name: 'Kopou Phool (Foxtail Orchid)',
      culturalName: 'কপৌ ফুল',
      earnedBy: 'Cultural Memory Match',
      earnedDate: 'Today, 9:30 AM',
      icon: '🌸',
      stage: 3,
      color: '#e879f9',
    },
    {
      id: 'g_2',
      type: 'FLOWER',
      name: 'Tagar (Crape Jasmine)',
      culturalName: 'টগৰ ফুল',
      earnedBy: 'Visual Object Recall',
      earnedDate: 'Yesterday',
      icon: '🌼',
      stage: 3,
      color: '#fef08a',
    },
    {
      id: 'g_3',
      type: 'PLANT',
      name: 'Assam Green Tea Bush',
      culturalName: 'অসমীয়া চাহ গছ',
      earnedBy: 'Daily Routine Recall',
      earnedDate: 'Today, 8:00 AM',
      icon: '🌿',
      stage: 3,
      color: '#22c55e',
    },
    {
      id: 'g_4',
      type: 'BUTTERFLY',
      name: 'Golden Kaiser-i-Hind',
      culturalName: 'সোণালী পখিলা',
      earnedBy: 'Call with Daughter Priyanka',
      earnedDate: 'Today, 11:15 AM',
      icon: '🦋',
      stage: 3,
      color: '#38bdf8',
    },
    {
      id: 'g_5',
      type: 'FLOWER',
      name: 'Nahar Blossom (Ironwood)',
      culturalName: 'নাহৰ ফুল',
      earnedBy: 'Familiar Sound Game',
      earnedDate: '2 days ago',
      icon: '🌺',
      stage: 3,
      color: '#f43f5e',
    },
    {
      id: 'g_6',
      type: 'PLANT',
      name: 'Tulsi & Medicinal Herb Pot',
      culturalName: 'তুলসী গছ',
      earnedBy: 'Morning Hydration Routine',
      earnedDate: 'Today, 7:45 AM',
      icon: '🌱',
      stage: 3,
      color: '#10b981',
    },
    {
      id: 'g_7',
      type: 'BUTTERFLY',
      name: 'Monsoon Peacock Swallowtail',
      culturalName: 'নীল পখিলা',
      earnedBy: 'Family Photo Quiz',
      earnedDate: 'Yesterday',
      icon: '🦋',
      stage: 3,
      color: '#818cf8',
    },
  ],
};

export const MemoryGarden: React.FC<MemoryGardenProps> = ({ currentLang, patientName }) => {
  const [garden, setGarden] = useState<MemoryGardenState>(() => {
    try {
      const saved = localStorage.getItem('mindcare_memory_garden');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_GARDEN;
  });

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FLOWER' | 'PLANT' | 'BUTTERFLY'>('ALL');
  const [selectedItem, setSelectedItem] = useState<MemoryGardenItem | null>(null);

  const handleSpeakGarden = () => {
    sound.playClick();
    let text = `Welcome to your Memory Garden, ${patientName}! You have nurtured ${garden.totalFlowers} blooming flowers, ${garden.totalPlants} healthy plants, and welcomed ${garden.totalButterflies} colorful butterflies through your daily activities. Your sacred Nahar tree is growing tall and strong.`;

    if (currentLang === 'as') {
      text = `আপোনাৰ স্মৃতিৰ ফুলনিলৈ স্বাগতম, ${patientName}! আপোনাৰ নিয়মিত কাম-কাজৰ জৰিয়তে ${garden.totalFlowers} পাহ সুন্দৰ ফুল ফুলিছে, ${garden.totalPlants} জোপা সেউজীয়া গছ বাঢ়িছে আৰু ${garden.totalButterflies} জনী পখিলা উৰি আহিছে। আপোনাৰ নাহৰ গছজোপাও দিনক দিনে ডাঙৰ হৈছে।`;
    } else if (currentLang === 'bn') {
      text = `আপনার স্মৃতি বাগানে স্বাগতম, ${patientName}! আপনার দৈনন্দিন অনুশীলনে ${garden.totalFlowers}টি ফুল ফুটেছে, ${garden.totalPlants}টি সুন্দর চারা এবং ${garden.totalButterflies}টি প্রজাপতি এসেছে। আপনার বাগানটি অপূর্ব!`;
    } else if (currentLang === 'hi') {
      text = `आपके स्मृति बगीचे में स्वागत है, ${patientName}! आपकी नियमित गतिविधियों से बगीचे में ${garden.totalFlowers} फूल खिले हैं, ${garden.totalPlants} पौधे लहलहा रहे हैं और ${garden.totalButterflies} तितलियां आई हैं।`;
    }

    voice.speak(text, currentLang);
  };

  const filteredItems =
    activeFilter === 'ALL'
      ? garden.items
      : garden.items.filter((item) => item.type === activeFilter);

  return (
    <div
      id="memory-garden-view"
      className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#dae1ff] shadow-md space-y-6"
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#dae1ff] pb-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
              🌸
            </div>
            <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
              Personal Serene Sanctuary
            </span>
            <span className="bg-emerald-50 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Non-Competitive Growth
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#001849]">
            My Memory Garden & Living Flora
          </h2>

          <p className="text-xs sm:text-sm font-semibold text-[#455f88] max-w-2xl">
            Every brain game you play blooms a native flower, daily tea routines sprout tea plants, and family calls invite gentle butterflies.
          </p>
        </div>

        <button
          id="listen-garden-btn"
          onClick={handleSpeakGarden}
          className="min-h-[44px] px-5 py-2.5 bg-[#006767] hover:bg-[#004d4d] text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen to Garden Story</span>
        </button>
      </div>

      {/* Living Garden Canvas (Scenic Visual Backdrop) */}
      <div
        id="garden-canvas"
        className="relative w-full rounded-3xl p-6 sm:p-10 border-2 border-emerald-200 overflow-hidden min-h-[340px] flex flex-col justify-between"
        style={{
          background: 'linear-gradient(180deg, #dcfce7 0%, #f0fdf4 45%, #bbf7d0 100%)',
        }}
      >
        {/* Sky Elements: Sun & Clouds */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-emerald-200 text-xs font-extrabold text-emerald-900 shadow-2xs">
            <Sun className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '30s' }} />
            <span>Guwahati Morning Sunlight • Mild 24°C</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900">
              <span>🦋 {garden.totalButterflies} Butterflies</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900">
              <span>🌸 {garden.totalFlowers} Blossoms</span>
            </div>
          </div>
        </div>

        {/* Central Garden Centerpiece: The Ancient Nahar / Banyan Tree */}
        <div className="my-6 flex flex-col items-center justify-center text-center relative z-10">
          <div className="relative group cursor-pointer" onClick={() => sound.playBell()}>
            <div className="text-7xl sm:text-8xl drop-shadow-md hover:scale-105 transition-transform">
              🌳
            </div>
            <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
              Stage 3 (Thriving)
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-emerald-950 mt-2">
            Sacred Nahar Tree of Resilience
          </h4>
          <p className="text-xs font-bold text-emerald-800 max-w-md">
            Grows with your 18-day active streak. Deep roots of routine and cognitive wellness.
          </p>
        </div>

        {/* Flora Meadow: Planted Blooms & Tea Shrubs */}
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 sm:gap-3 relative z-10">
          {garden.items.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                sound.playClick();
                setSelectedItem(item);
              }}
              className="bg-white/85 hover:bg-white p-2.5 rounded-2xl border border-emerald-300 shadow-2xs hover:shadow-md transition-all cursor-pointer text-center group flex flex-col items-center justify-center gap-1"
            >
              <span className="text-3xl group-hover:scale-125 transition-transform">{item.icon}</span>
              <span className="text-[11px] font-extrabold text-emerald-950 truncate w-full">
                {item.name.split(' ')[0]}
              </span>
              <span className="text-[9px] font-semibold text-emerald-700 truncate w-full">
                {item.earnedBy.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Flora Item Detail Popover */}
      {selectedItem && (
        <div className="bg-[#f0fdf4] p-5 rounded-2xl border-2 border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{selectedItem.icon}</span>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-emerald-950">{selectedItem.name}</h4>
                <span className="text-xs font-bold text-emerald-700 italic">
                  ({selectedItem.culturalName})
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-800">
                Earned on {selectedItem.earnedDate} by completing{' '}
                <span className="font-extrabold text-[#006767]">{selectedItem.earnedBy}</span>.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedItem(null)}
            className="text-xs font-extrabold text-emerald-900 bg-white px-4 py-2 rounded-xl border border-emerald-300 hover:bg-emerald-50 cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      )}

      {/* How the Garden Blossoms (Encouragement Guide) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
        <div className="bg-[#fafbff] p-3.5 rounded-2xl border border-[#dae1ff] space-y-1">
          <div className="flex items-center gap-2 font-black text-xs text-[#001849]">
            <span>🌸</span>
            <span>Brain Games</span>
          </div>
          <p className="text-[11px] text-[#455f88] font-medium">
            Completing memory matches & recall sprouts native orchids and blossoms.
          </p>
        </div>

        <div className="bg-[#fafbff] p-3.5 rounded-2xl border border-[#dae1ff] space-y-1">
          <div className="flex items-center gap-2 font-black text-xs text-[#001849]">
            <span>🌿</span>
            <span>Daily Routines</span>
          </div>
          <p className="text-[11px] text-[#455f88] font-medium">
            Taking morning tea and hydration plants fresh Assam tea bushes and tulsi.
          </p>
        </div>

        <div className="bg-[#fafbff] p-3.5 rounded-2xl border border-[#dae1ff] space-y-1">
          <div className="flex items-center gap-2 font-black text-xs text-[#001849]">
            <span>🦋</span>
            <span>Family Connection</span>
          </div>
          <p className="text-[11px] text-[#455f88] font-medium">
            Speaking with daughter Priyanka welcomes fluttering Kaiser-i-Hind butterflies.
          </p>
        </div>

        <div className="bg-[#fafbff] p-3.5 rounded-2xl border border-[#dae1ff] space-y-1">
          <div className="flex items-center gap-2 font-black text-xs text-[#001849]">
            <span>🌳</span>
            <span>Weekly Streaks</span>
          </div>
          <p className="text-[11px] text-[#455f88] font-medium">
            Sustained gentle participation strengthens your central sacred tree.
          </p>
        </div>
      </div>
    </div>
  );
};
