import React, { useState, useEffect } from 'react';
import { GameDifficulty, GameSessionResult } from '../../types';
import { sound } from '../../services/sound';
import { ArrowUp, ArrowDown, Check, Sun, Coffee, Pill, Trees, Radio } from 'lucide-react';

interface RoutineStep {
  id: number;
  correctOrder: number;
  title: string;
  timeHint: string;
  emoji: string;
  iconBg: string;
}

const MORNING_STEPS: RoutineStep[] = [
  { id: 1, correctOrder: 1, title: 'Wake up & drink fresh warm water', timeHint: '6:30 AM', emoji: '🌅', iconBg: 'bg-amber-100 text-amber-800' },
  { id: 2, correctOrder: 2, title: 'Drink hot Assam tea with toast', timeHint: '7:30 AM', emoji: '☕', iconBg: 'bg-teal-100 text-teal-800' },
  { id: 3, correctOrder: 3, title: 'Take morning Blood Pressure medicine', timeHint: '8:00 AM', emoji: '💊', iconBg: 'bg-emerald-100 text-emerald-800' },
  { id: 4, correctOrder: 4, title: 'Gentle walk in the front garden', timeHint: '8:45 AM', emoji: '🌿', iconBg: 'bg-sky-100 text-sky-800' },
  { id: 5, correctOrder: 5, title: 'Listen to regional AIR morning news', timeHint: '9:30 AM', emoji: '📻', iconBg: 'bg-purple-100 text-purple-800' },
];

interface DailyRoutineGameProps {
  difficulty: GameDifficulty;
  onComplete: (result: Omit<GameSessionResult, 'id' | 'patientId' | 'startedAt' | 'completedAt' | 'synced'>) => void;
}

export const DailyRoutineGame: React.FC<DailyRoutineGameProps> = ({
  difficulty,
  onComplete,
}) => {
  const [steps, setSteps] = useState<RoutineStep[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());
  const [stepCount, setStepCount] = useState(4);

  useEffect(() => {
    const count = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    setStepCount(count);
    const chosen = MORNING_STEPS.slice(0, count);

    // Shuffle into random starting order
    const shuffled = [...chosen].sort(() => Math.random() - 0.5);
    setSteps(shuffled);
    setMoves(0);
  }, [difficulty]);

  const moveStep = (index: number, direction: 'up' | 'down') => {
    sound.playClick();
    setMoves((m) => m + 1);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;
    setSteps(newSteps);

    // Check if sorted
    const isSorted = newSteps.every((step, i) => step.correctOrder === i + 1);
    if (isSorted) {
      sound.playSuccess();
      const durationSec = Math.max(10, Math.round((Date.now() - startTime) / 1000));
      const accuracy = Math.min(100, Math.max(80, Math.round((stepCount / (moves + 1)) * 100)));
      const score = 95;

      setTimeout(() => {
        onComplete({
          gameId: 'game_daily_routine_recall',
          gameTitle: 'Daily Routine Story Sequencing',
          category: 'DAILY_RECALL',
          difficulty,
          durationSeconds: durationSec,
          score,
          accuracy,
          attempts: moves + 1,
          responseTimeMs: Math.round((durationSec * 1000) / (moves + 1)),
        });
      }, 500);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-[#dae1ff] flex items-center justify-between shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#455f88] uppercase block">Goal</span>
          <span className="text-base font-extrabold text-[#001849]">
            Order from First (Top) to Last (Bottom)
          </span>
        </div>
        <div className="bg-[#e2e7ff] text-[#002b74] px-3 py-1 rounded-full text-xs font-bold">
          {moves} Changes
        </div>
      </div>

      {/* Routine Steps List with Move Up/Down Controls */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;
          const isCorrectPosition = step.correctOrder === index + 1;

          return (
            <div
              key={step.id}
              id={`routine-step-${step.id}`}
              className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all bg-white shadow-xs ${
                isCorrectPosition ? 'border-[#006767] bg-[#f8fffe]' : 'border-[#dae1ff]'
              }`}
            >
              {/* Order Number & Icon */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                    isCorrectPosition
                      ? 'bg-[#006767] text-white'
                      : 'bg-[#f2f3ff] text-[#455f88]'
                  }`}
                >
                  {index + 1}
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${step.iconBg}`}>
                  {step.emoji}
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-[#001849]">{step.title}</h4>
                  <span className="text-xs font-semibold text-[#455f88]">
                    Suggested time: {step.timeHint}
                  </span>
                </div>
              </div>

              {/* Up & Down Arrows */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id={`move-up-step-${index}`}
                  onClick={() => moveStep(index, 'up')}
                  disabled={isFirst}
                  title="Move step earlier"
                  className={`p-3 rounded-xl border font-bold transition-all ${
                    !isFirst
                      ? 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#006767] border-[#dae1ff] active:scale-95'
                      : 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-5 h-5" />
                </button>

                <button
                  id={`move-down-step-${index}`}
                  onClick={() => moveStep(index, 'down')}
                  disabled={isLast}
                  title="Move step later"
                  className={`p-3 rounded-xl border font-bold transition-all ${
                    !isLast
                      ? 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#006767] border-[#dae1ff] active:scale-95'
                      : 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                  }`}
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
