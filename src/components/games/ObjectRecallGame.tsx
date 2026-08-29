import React, { useState, useEffect } from 'react';
import { GameDifficulty, GameSessionResult } from '../../types';
import { sound } from '../../services/sound';
import { Eye, Check, Clock, AlertCircle } from 'lucide-react';

interface ObjectItem {
  id: string;
  name: string;
  emoji: string;
  hint: string;
}

const POOL_ITEMS: ObjectItem[] = [
  { id: 'item_tea', name: 'Assam Tea Cup', emoji: '☕', hint: 'Morning beverage' },
  { id: 'item_rhino', name: 'Rhino Figurine', emoji: '🦏', hint: 'Kaziranga animal' },
  { id: 'item_hat', name: 'Bamboo Japi Hat', emoji: '👒', hint: 'Traditional headwear' },
  { id: 'item_bell', name: 'Brass Prayer Bell', emoji: '🔔', hint: 'Puja room bell' },
  { id: 'item_stick', name: 'Wooden Walking Stick', emoji: '🦯', hint: 'Garden walk aid' },
  { id: 'item_glasses', name: 'Reading Spectacles', emoji: '👓', hint: 'Newspaper reading' },
  { id: 'item_radio', name: 'Vintage Transistor Radio', emoji: '📻', hint: 'Evening AIR news' },
  { id: 'item_flower', name: 'Kopou Orchids Flower', emoji: '🌸', hint: 'State flower of Assam' },
];

interface ObjectRecallGameProps {
  difficulty: GameDifficulty;
  onComplete: (result: Omit<GameSessionResult, 'id' | 'patientId' | 'startedAt' | 'completedAt' | 'synced'>) => void;
}

export const ObjectRecallGame: React.FC<ObjectRecallGameProps> = ({
  difficulty,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  const [countdown, setCountdown] = useState(8);
  const [targetItems, setTargetItems] = useState<ObjectItem[]>([]);
  const [choicePool, setChoicePool] = useState<ObjectItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    let targetCount = 3;
    if (difficulty === 'medium') targetCount = 4;
    if (difficulty === 'hard') targetCount = 5;

    // Pick target items
    const shuffledPool = [...POOL_ITEMS].sort(() => Math.random() - 0.5);
    const targets = shuffledPool.slice(0, targetCount);
    // Pick 3 distractors
    const distractors = shuffledPool.slice(targetCount, targetCount + 3);
    const choices = [...targets, ...distractors].sort(() => Math.random() - 0.5);

    setTargetItems(targets);
    setChoicePool(choices);
    setPhase('memorize');
    setCountdown(8);
    setSelectedIds([]);
  }, [difficulty]);

  // Countdown timer for memorization phase
  useEffect(() => {
    if (phase !== 'memorize') return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sound.playReminderBell();
          setPhase('recall');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const handleToggleSelect = (item: ObjectItem) => {
    sound.playClick();
    if (selectedIds.includes(item.id)) {
      setSelectedIds((prev) => prev.filter((id) => id !== item.id));
    } else {
      const next = [...selectedIds, item.id];
      setSelectedIds(next);

      // Check if patient selected all target count
      if (next.length === targetItems.length) {
        // Calculate result
        const correctPicks = next.filter((id) => targetItems.some((t) => t.id === id)).length;
        const accuracy = Math.round((correctPicks / targetItems.length) * 100);
        const score = Math.max(60, Math.round((accuracy / 100) * 100));
        const durationSec = Math.max(10, Math.round((Date.now() - startTime) / 1000));

        setTimeout(() => {
          sound.playSuccess();
          onComplete({
            gameId: 'game_object_recall',
            gameTitle: 'Visual Object Recall',
            category: 'MEMORY',
            difficulty,
            durationSeconds: durationSec,
            score,
            accuracy,
            attempts: next.length,
            responseTimeMs: Math.round((durationSec * 1000) / next.length),
          });
        }, 500);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {phase === 'memorize' ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dae1ff] shadow-sm text-center space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#006767]">
              <Eye className="w-6 h-6 animate-pulse" />
              <span className="font-bold text-base uppercase tracking-wider">
                Memorize These {targetItems.length} Objects
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#ffdad6] text-[#ba1a1a] px-3 py-1.5 rounded-full font-extrabold text-sm">
              <Clock className="w-4 h-4" />
              <span>Hiding in {countdown}s</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#f2f3ff] h-3 rounded-full overflow-hidden">
            <div
              className="bg-[#006767] h-full transition-all duration-1000"
              style={{ width: `${(countdown / 8) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {targetItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#f2f3ff] border-2 border-[#006767] p-5 rounded-2xl flex flex-col items-center justify-center space-y-2 shadow-xs"
              >
                <span className="text-6xl">{item.emoji}</span>
                <span className="font-extrabold text-lg text-[#001849]">{item.name}</span>
                <span className="text-xs text-[#455f88]">{item.hint}</span>
              </div>
            ))}
          </div>

          <p className="text-sm font-medium text-[#455f88]">
            Look closely at each item. When the timer ends, you will pick them from a list.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dae1ff] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-[#001849]">
                Which objects did you see?
              </h3>
              <p className="text-sm text-[#455f88]">
                Select {targetItems.length} items ({selectedIds.length} of {targetItems.length} picked)
              </p>
            </div>
            <span className="bg-[#b6d0ff] text-[#002b74] px-3 py-1 rounded-full text-xs font-bold">
              Recall Stage
            </span>
          </div>

          {/* Choice Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {choicePool.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  id={`recall-choice-${item.id}`}
                  onClick={() => handleToggleSelect(item)}
                  className={`min-h-[110px] p-4 rounded-2xl border-2 font-bold flex flex-col items-center justify-center transition-all duration-200 shadow-xs ${
                    isSelected
                      ? 'bg-[#e2e7ff] border-[#006767] ring-4 ring-teal-200 text-[#001849]'
                      : 'bg-[#faf8ff] border-[#dae1ff] hover:border-[#455f88] text-[#001849]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-4xl">{item.emoji}</span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        isSelected
                          ? 'bg-[#006767] border-[#006767] text-white'
                          : 'border-[#dae1ff] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-left w-full line-clamp-1">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
