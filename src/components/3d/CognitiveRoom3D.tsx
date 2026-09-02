import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  Gamepad2,
  Trophy,
  RotateCcw,
  Volume2,
  Eye,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';
import { SupportedLanguage } from '../../types';

interface CognitiveRoom3DProps {
  currentLang: SupportedLanguage;
  onLaunchFullGame?: (gameId: string) => void;
}

export const CognitiveRoom3D: React.FC<CognitiveRoom3DProps> = ({
  currentLang,
  onLaunchFullGame,
}) => {
  const [activeTab, setActiveTab] = useState<'memory' | 'pattern' | 'sound' | 'recall'>('memory');
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [patternSequence, setPatternSequence] = useState<number[]>([1, 3, 2, 4]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPatternPlaying, setIsPatternPlaying] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // 4 Cultural Memory Tiles
  const MEMORY_TILES = [
    { id: 1, pairId: 1, label: 'Assam Tea Leaf', emoji: '🍃', motif: 'Jorhat Gardens' },
    { id: 2, pairId: 2, label: 'Bihu Dhol Drum', emoji: '🥁', motif: 'Rongali Festive' },
    { id: 3, pairId: 1, label: 'Assam Tea Leaf', emoji: '🍃', motif: 'Jorhat Gardens' },
    { id: 4, pairId: 2, label: 'Bihu Dhol Drum', emoji: '🥁', motif: 'Rongali Festive' },
  ];

  // Flip memory card handler
  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(id) || matchedPairs.includes(id)) {
      return;
    }

    sound.playClick();
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = MEMORY_TILES.find((c) => c.id === newFlipped[0]);
      const card2 = MEMORY_TILES.find((c) => c.id === newFlipped[1]);

      if (card1 && card2 && card1.pairId === card2.pairId) {
        sound.playSuccess();
        setMatchedPairs((prev) => [...prev, card1.id, card2.id]);
        setFlippedCards([]);
        if (matchedPairs.length + 2 >= MEMORY_TILES.length) {
          setGameCompleted(true);
          voice.speak('Nice work! You matched all regional memory cards.', currentLang);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  const handleResetGame = () => {
    sound.playClick();
    setFlippedCards([]);
    setMatchedPairs([]);
    setGameCompleted(false);
  };

  return (
    <section
      id="section-cognitive-room-3d"
      className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#243A50] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14283D] border border-[#243A50] text-[#38D9C5] text-xs font-black uppercase tracking-wider">
            <Brain className="w-4 h-4 text-[#19C3B1]" />
            <span>3D Cognitive Activity Room</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            Culturally Anchored Brain Exercises
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6] max-w-2xl">
            Dimensional memory, attention, and sound activities tailored for senior neural stimulation.
            Calm, encouraging, and free of frustrating time pressure.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#14283D] p-1.5 rounded-2xl border border-[#243A50]">
          {[
            { key: 'memory', label: 'Memory Cards', icon: Eye },
            { key: 'pattern', label: 'Weaving Matrix', icon: Sparkles },
            { key: 'sound', label: 'Regional Sounds', icon: Volume2 },
            { key: 'recall', label: 'Daily Recall', icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.key as any);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-[#19C3B1] text-[#07111F] shadow-md font-black'
                    : 'text-[#B7C5D6] hover:text-[#F4F8FC] hover:bg-[#101F31]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3D Interactive Room Canvas & Activity Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: 3D Game Station Card */}
        <div className="lg:col-span-7 bg-[#14283D] rounded-3xl border border-[#243A50] p-6 sm:p-8 space-y-6 shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#101F31] text-[#38D9C5] border border-[#243A50] flex items-center justify-center font-black">
                {activeTab === 'memory' ? '1' : activeTab === 'pattern' ? '2' : activeTab === 'sound' ? '3' : '4'}
              </div>
              <div>
                <h3 className="text-base font-black text-[#F4F8FC]">
                  {activeTab === 'memory'
                    ? 'Regional Heritage Memory Pair'
                    : activeTab === 'pattern'
                    ? 'Muga Silk Geometric Weaving'
                    : activeTab === 'sound'
                    ? 'Kaziranga & River Sound Resonance'
                    : 'Daily Routine Step Sequence'}
                </h3>
                <p className="text-xs text-[#38D9C5] font-semibold">Active Session: Gentle Difficulty</p>
              </div>
            </div>

            <button
              onClick={handleResetGame}
              aria-label="Reset test board"
              className="p-2.5 rounded-xl bg-[#101F31] border border-[#243A50] text-[#B7C5D6] hover:text-[#F4F8FC] hover:border-[#19C3B1] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Playable 3D Tile Board */}
          {activeTab === 'memory' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {MEMORY_TILES.map((card) => {
                  const isFlipped = flippedCards.includes(card.id) || matchedPairs.includes(card.id);
                  const isMatched = matchedPairs.includes(card.id);

                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      className={`h-32 sm:h-36 rounded-2xl border-2 flex flex-col items-center justify-center p-3 transition-all duration-300 transform active:scale-95 cursor-pointer ${
                        isMatched
                          ? 'bg-[#35D07F]/20 border-[#35D07F] text-[#35D07F] shadow-lg shadow-[#35D07F]/10'
                          : isFlipped
                          ? 'bg-[#101F31] border-[#19C3B1] text-[#F4F8FC] shadow-xl'
                          : 'bg-[#101F31] border-[#243A50] hover:border-[#38D9C5] text-[#7F91A6]'
                      }`}
                    >
                      {isFlipped ? (
                        <div className="space-y-1 text-center animate-in zoom-in-50 duration-200">
                          <span className="text-3xl sm:text-4xl block">{card.emoji}</span>
                          <span className="text-xs font-black text-[#F4F8FC] line-clamp-1">
                            {card.label}
                          </span>
                          <span className="text-[10px] text-[#38D9C5] block">{card.motif}</span>
                        </div>
                      ) : (
                        <div className="space-y-2 text-center">
                          <div className="w-10 h-10 rounded-full bg-[#14283D] border border-[#243A50] flex items-center justify-center mx-auto text-sm font-bold text-[#7F91A6]">
                            ?
                          </div>
                          <span className="text-[11px] font-bold text-[#7F91A6]">Tap to Flip</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {gameCompleted && (
                <div className="p-4 rounded-2xl bg-[#35D07F]/10 border border-[#35D07F] flex items-center justify-between gap-4 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#35D07F] shrink-0" />
                    <div>
                      <h4 className="text-sm font-black text-[#F4F8FC]">Nice Work, Dhiren-da!</h4>
                      <p className="text-xs text-[#B7C5D6]">
                        Memory matching complete. Let's take a peaceful rest or continue.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleResetGame}
                    className="px-4 py-2 bg-[#35D07F] text-[#07111F] font-black text-xs rounded-xl cursor-pointer hover:bg-[#35D07F]/90"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Pattern Weaving Sub-Activity */}
          {activeTab === 'pattern' && (
            <div className="space-y-4 text-center py-4">
              <p className="text-xs text-[#B7C5D6]">
                Observe the handloom diamond rhythm and recreate the sequence:
              </p>
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      sound.playClick();
                      const next = [...userSequence, num];
                      setUserSequence(next);
                      if (next.length === patternSequence.length) {
                        sound.playSuccess();
                        voice.speak('Excellent pattern symmetry. Great focus!', currentLang);
                        setUserSequence([]);
                      }
                    }}
                    className="h-20 rounded-2xl bg-[#101F31] border-2 border-[#243A50] hover:border-[#19C3B1] flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <span className="text-lg">🧵</span>
                    <span className="text-xs font-black text-[#38D9C5]">Tone {num}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sound Resonance Sub-Activity */}
          {activeTab === 'sound' && (
            <div className="space-y-4 py-4 text-center">
              <p className="text-xs text-[#B7C5D6]">
                Listen to the regional resonance and identify the source:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Brahmaputra Waves', emoji: '🌊', sound: 'Gentle River' },
                  { name: 'Kaziranga Bird Chime', emoji: '🐦', sound: 'Morning Song' },
                  { name: 'Bamboo Flute Melody', emoji: '🎋', sound: 'Majuli Folk' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playSuccess();
                      voice.speak(`Identified ${item.name}. Calming and familiar.`, currentLang);
                    }}
                    className="p-4 rounded-2xl bg-[#101F31] border border-[#243A50] hover:border-[#38D9C5] text-center space-y-2 cursor-pointer transition-all active:scale-95"
                  >
                    <span className="text-3xl block">{item.emoji}</span>
                    <h4 className="text-xs font-black text-[#F4F8FC]">{item.name}</h4>
                    <span className="text-[10px] text-[#38D9C5] block">{item.sound}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recall Sub-Activity */}
          {activeTab === 'recall' && (
            <div className="space-y-3 py-4">
              <p className="text-xs text-[#B7C5D6]">
                What did you do first this morning after waking up?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Drank a warm cup of Assam Red Tea ☕',
                  'Took Morning BP Medication 💊',
                  'Watered the Balcony Orchids 🌸',
                  'Walked in the Morning Sunlight 🚶',
                ].map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playSuccess();
                      voice.speak(`Great memory recall. That happened at 7:30 AM.`, currentLang);
                    }}
                    className="p-3.5 rounded-2xl bg-[#101F31] border border-[#243A50] hover:border-[#35D07F] text-left text-xs font-bold text-[#F4F8FC] flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span>{step}</span>
                    <CheckCircle2 className="w-4 h-4 text-[#35D07F]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Clinical & Cognitive Benefits Panel */}
        <div className="lg:col-span-5 space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#38D9C5]">
              Scientifically Calibrated
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#F4F8FC]">
              Why Cultural Cognition Works
            </h3>
            <p className="text-xs sm:text-sm text-[#B7C5D6] leading-relaxed">
              Standard abstract tests can cause confusion and agitation in older adults. By using
              familiar North Eastern landmarks, sounds, and daily tasks, MindCare stimulates autobiographical
              pathways while maintaining calm dignity.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Zero Frustration Guard',
                desc: 'If a senior hesitates or tires, the game dynamically provides gentle hints without timer penalties.',
                icon: Sparkles,
                color: 'text-[#38D9C5]',
              },
              {
                title: 'Sundowning Pacing',
                desc: 'Evening sessions automatically shift to relaxing auditory sounds and lower visual contrast.',
                icon: Brain,
                color: 'text-[#5BA7FF]',
              },
              {
                title: 'Longitudinal Observation',
                desc: 'Response stability is summarized for family and GMCH clinicians without clinical labeling.',
                icon: Trophy,
                color: 'text-[#35D07F]',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#14283D] border border-[#243A50] flex items-start gap-3"
                >
                  <div className={`p-2 rounded-xl bg-[#101F31] border border-[#243A50] ${item.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#F4F8FC]">{item.title}</h4>
                    <p className="text-xs text-[#B7C5D6] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
