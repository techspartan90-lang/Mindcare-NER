import React, { useState, useEffect } from 'react';
import { GameDifficulty, GameSessionResult } from '../../types';
import { sound } from '../../services/sound';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface RoundData {
  baseEmoji: string;
  oddEmoji: string;
  baseTitle: string;
  oddTitle: string;
  gridSize: number; // e.g. 4, 6, 9
}

const ROUNDS_DATABASE: RoundData[] = [
  { baseEmoji: '🍵', oddEmoji: '☕', baseTitle: 'Green Tea', oddTitle: 'Black Tea', gridSize: 6 },
  { baseEmoji: '🌸', oddEmoji: '🌺', baseTitle: 'Kopou Orchid', oddTitle: 'Hibiscus', gridSize: 6 },
  { baseEmoji: '🦏', oddEmoji: '🐘', baseTitle: 'Rhino', oddTitle: 'Elephant', gridSize: 6 },
  { baseEmoji: '🎋', oddEmoji: '🌾', baseTitle: 'Bamboo Shoot', oddTitle: 'Paddy Rice', gridSize: 8 },
  { baseEmoji: '🧣', oddEmoji: '🧵', baseTitle: 'Eri Shawl', oddTitle: 'Spool Thread', gridSize: 8 },
];

interface OddOneOutGameProps {
  difficulty: GameDifficulty;
  onComplete: (result: Omit<GameSessionResult, 'id' | 'patientId' | 'startedAt' | 'completedAt' | 'synced'>) => void;
}

export const OddOneOutGame: React.FC<OddOneOutGameProps> = ({
  difficulty,
  onComplete,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [totalRounds] = useState(difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);
  const [gridItems, setGridItems] = useState<{ id: number; isOdd: boolean; emoji: string }[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [correctHits, setCorrectHits] = useState(0);
  const [startTime] = useState(Date.now());
  const [wrongClickIndex, setWrongClickIndex] = useState<number | null>(null);

  const loadRound = (roundIdx: number) => {
    const roundData = ROUNDS_DATABASE[roundIdx % ROUNDS_DATABASE.length];
    let size = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 9;
    const oddPosition = Math.floor(Math.random() * size);

    const items = [];
    for (let i = 0; i < size; i++) {
      if (i === oddPosition) {
        items.push({ id: i, isOdd: true, emoji: roundData.oddEmoji });
      } else {
        items.push({ id: i, isOdd: false, emoji: roundData.baseEmoji });
      }
    }
    setGridItems(items);
    setWrongClickIndex(null);
  };

  useEffect(() => {
    loadRound(0);
    setCurrentRoundIdx(0);
    setAttempts(0);
    setCorrectHits(0);
  }, [difficulty]);

  const handleItemClick = (index: number, isOdd: boolean) => {
    sound.playClick();
    setAttempts((a) => a + 1);

    if (isOdd) {
      sound.playSuccess();
      const nextCorrect = correctHits + 1;
      setCorrectHits(nextCorrect);

      if (currentRoundIdx + 1 >= totalRounds) {
        // Complete game!
        const durationSec = Math.max(10, Math.round((Date.now() - startTime) / 1000));
        const accuracy = Math.min(100, Math.max(70, Math.round((totalRounds / (attempts + 1)) * 100)));
        const score = Math.min(100, Math.max(80, 100 - (attempts + 1 - totalRounds) * 5));

        setTimeout(() => {
          onComplete({
            gameId: 'game_attention_odd_one',
            gameTitle: 'Spot the Different Motif',
            category: 'ATTENTION',
            difficulty,
            durationSeconds: durationSec,
            score,
            accuracy,
            attempts: attempts + 1,
            responseTimeMs: Math.round((durationSec * 1000) / (attempts + 1)),
          });
        }, 400);
      } else {
        const nextRound = currentRoundIdx + 1;
        setCurrentRoundIdx(nextRound);
        loadRound(nextRound);
      }
    } else {
      // Wrong click shake
      setWrongClickIndex(index);
      setTimeout(() => setWrongClickIndex(null), 600);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Round Header */}
      <div className="bg-white p-4 rounded-2xl border border-[#dae1ff] flex items-center justify-between shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#455f88] uppercase block">Round</span>
          <span className="text-lg font-black text-[#001849]">
            {currentRoundIdx + 1} of {totalRounds}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-[#455f88] uppercase block">Instruction</span>
          <span className="text-sm font-extrabold text-[#006767]">
            Find the ONE symbol that is different!
          </span>
        </div>
      </div>

      {/* Symbol Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dae1ff] shadow-sm">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {gridItems.map((item, index) => {
            const isShake = wrongClickIndex === index;
            return (
              <button
                key={item.id}
                id={`odd-one-item-${index}`}
                onClick={() => handleItemClick(index, item.isOdd)}
                className={`min-h-[105px] rounded-2xl border-2 flex items-center justify-center text-5xl transition-transform active:scale-95 shadow-xs ${
                  isShake
                    ? 'bg-[#ffdad6] border-[#ba1a1a] animate-bounce'
                    : 'bg-[#faf8ff] border-[#dae1ff] hover:border-[#006767] hover:bg-[#eaedff]'
                }`}
              >
                <span>{item.emoji}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
