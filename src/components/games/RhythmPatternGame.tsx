import React, { useState, useEffect } from 'react';
import { GameDifficulty, GameSessionResult } from '../../types';
import { sound } from '../../services/sound';
import { Music, Play, CheckCircle2, RotateCcw } from 'lucide-react';

interface ChimeBell {
  id: number;
  name: string;
  color: string;
  activeColor: string;
  freq: number;
  emoji: string;
}

const BELLS: ChimeBell[] = [
  { id: 0, name: 'Amber Bell', color: 'bg-amber-100 border-amber-300 text-amber-900', activeColor: 'bg-amber-400 border-amber-500 text-white ring-4 ring-amber-300 scale-105', freq: 523.25, emoji: '🔔' },
  { id: 1, name: 'Teal Bell', color: 'bg-teal-100 border-teal-300 text-teal-900', activeColor: 'bg-[#006767] border-teal-600 text-white ring-4 ring-teal-300 scale-105', freq: 659.25, emoji: '🎋' },
  { id: 2, name: 'Sky Bell', color: 'bg-sky-100 border-sky-300 text-sky-900', activeColor: 'bg-sky-500 border-sky-600 text-white ring-4 ring-sky-300 scale-105', freq: 783.99, emoji: '🪘' },
  { id: 3, name: 'Rose Bell', color: 'bg-rose-100 border-rose-300 text-rose-900', activeColor: 'bg-rose-500 border-rose-600 text-white ring-4 ring-rose-300 scale-105', freq: 1046.50, emoji: '🌸' },
];

interface RhythmPatternGameProps {
  difficulty: GameDifficulty;
  onComplete: (result: Omit<GameSessionResult, 'id' | 'patientId' | 'startedAt' | 'completedAt' | 'synced'>) => void;
}

export const RhythmPatternGame: React.FC<RhythmPatternGameProps> = ({
  difficulty,
  onComplete,
}) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [activeBellId, setActiveBellId] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [targetRounds] = useState(difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);
  const [startTime] = useState(Date.now());
  const [totalTaps, setTotalTaps] = useState(0);

  // Play audio frequency for a bell
  const playBellSound = (freq: number) => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }
    } catch {}
  };

  const playSequence = (seqToPlay: number[]) => {
    setIsPlayingSeq(true);
    setPlayerInput([]);

    seqToPlay.forEach((bellId, index) => {
      setTimeout(() => {
        setActiveBellId(bellId);
        playBellSound(BELLS[bellId].freq);
        setTimeout(() => setActiveBellId(null), 400);
      }, (index + 1) * 700);
    });

    setTimeout(() => {
      setIsPlayingSeq(false);
    }, (seqToPlay.length + 1) * 700);
  };

  // Start new round
  const startNextRound = (currentSeq: number[]) => {
    const nextBell = Math.floor(Math.random() * 4);
    const newSeq = [...currentSeq, nextBell];
    setSequence(newSeq);
    setTimeout(() => {
      playSequence(newSeq);
    }, 500);
  };

  useEffect(() => {
    setRound(1);
    setTotalTaps(0);
    startNextRound([]);
  }, [difficulty]);

  const handleBellClick = (bellId: number) => {
    if (isPlayingSeq) return;
    setActiveBellId(bellId);
    playBellSound(BELLS[bellId].freq);
    setTimeout(() => setActiveBellId(null), 300);

    const nextInput = [...playerInput, bellId];
    setPlayerInput(nextInput);
    setTotalTaps((t) => t + 1);

    const currentStep = nextInput.length - 1;
    if (nextInput[currentStep] !== sequence[currentStep]) {
      // Mistake: replay current sequence gently
      sound.playReminderBell();
      setTimeout(() => {
        playSequence(sequence);
      }, 700);
      return;
    }

    if (nextInput.length === sequence.length) {
      // Completed this round!
      sound.playSuccess();
      if (round >= targetRounds) {
        // Complete whole game!
        const durationSec = Math.max(10, Math.round((Date.now() - startTime) / 1000));
        const accuracy = Math.min(100, Math.max(80, Math.round(((sequence.length * targetRounds) / (totalTaps + 1)) * 100)));
        const score = Math.min(100, Math.max(85, 95));

        setTimeout(() => {
          onComplete({
            gameId: 'game_pattern_rhythm',
            gameTitle: 'Rhythm & Sound Sequence',
            category: 'PATTERN',
            difficulty,
            durationSeconds: durationSec,
            score,
            accuracy,
            attempts: totalTaps + 1,
            responseTimeMs: Math.round((durationSec * 1000) / (totalTaps + 1)),
          });
        }, 500);
      } else {
        setRound((r) => r + 1);
        setTimeout(() => {
          startNextRound(sequence);
        }, 800);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Game State Header */}
      <div className="bg-white p-4 rounded-2xl border border-[#dae1ff] flex items-center justify-between shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#455f88] uppercase block">Sequence Step</span>
          <span className="text-xl font-black text-[#001849]">
            Level {round} of {targetRounds}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isPlayingSeq ? (
            <span className="bg-[#fff7ed] text-[#ea580c] px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 animate-pulse">
              <Music className="w-4 h-4" />
              Listen carefully...
            </span>
          ) : (
            <span className="bg-[#f0fdf4] text-[#15803d] px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Your turn: tap the bells!
            </span>
          )}
        </div>
      </div>

      {/* 4 Chime Bells Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dae1ff] shadow-sm">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {BELLS.map((bell) => {
            const isActive = activeBellId === bell.id;
            return (
              <button
                key={bell.id}
                id={`rhythm-bell-${bell.id}`}
                onClick={() => handleBellClick(bell.id)}
                disabled={isPlayingSeq}
                className={`min-h-[140px] sm:min-h-[160px] rounded-3xl border-4 font-black text-center flex flex-col items-center justify-center transition-all duration-200 shadow-md ${
                  isActive ? bell.activeColor : bell.color
                }`}
              >
                <span className="text-5xl sm:text-6xl mb-2">{bell.emoji}</span>
                <span className="text-base sm:text-lg">{bell.name}</span>
              </button>
            );
          })}
        </div>

        {/* Replay Sequence Button */}
        <div className="mt-6 text-center">
          <button
            id="replay-sequence-btn"
            onClick={() => playSequence(sequence)}
            disabled={isPlayingSeq}
            className="px-5 py-2.5 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#006767] font-bold text-sm rounded-xl border border-[#dae1ff] inline-flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Hear Rhythm Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
