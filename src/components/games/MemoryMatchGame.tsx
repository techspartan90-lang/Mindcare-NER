import React, { useState, useEffect } from 'react';
import { GameDifficulty, GameSessionResult } from '../../types';
import { sound } from '../../services/sound';

interface MemoryCard {
  id: number;
  pairId: number;
  title: string;
  emoji: string;
  tag: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const NE_CULTURAL_ITEMS = [
  { pairId: 1, title: 'One-Horned Rhino', emoji: '🦏', tag: 'Kaziranga Symbol' },
  { pairId: 2, title: 'Mekhela Chador', emoji: '👗', tag: 'Assam Traditional' },
  { pairId: 3, title: 'Great Hornbill', emoji: '🪶', tag: 'State Bird & Pride' },
  { pairId: 4, title: 'Assam Tea Garden', emoji: '🍃', tag: 'Fresh Green Leaves' },
  { pairId: 5, title: 'Bamboo Japi Craft', emoji: '👒', tag: 'Traditional Hat' },
  { pairId: 6, title: 'Bihu Dhol Drum', emoji: '🪘', tag: 'Folk Rhythm' },
  { pairId: 7, title: 'Loktak Lake Hut', emoji: '🏞️', tag: 'Floating Phumdi' },
  { pairId: 8, title: 'Eri Silk Shawl', emoji: '🧣', tag: 'Warm Natural Fabric' },
];

interface MemoryMatchGameProps {
  difficulty: GameDifficulty;
  onComplete: (result: Omit<GameSessionResult, 'id' | 'patientId' | 'startedAt' | 'completedAt' | 'synced'>) => void;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  difficulty,
  onComplete,
}) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [startTime] = useState(Date.now());
  const [totalPairs, setTotalPairs] = useState(4);

  // Initialize deck based on difficulty
  useEffect(() => {
    let pairCount = 4; // 8 cards (2x4) for easy
    if (difficulty === 'medium') pairCount = 6; // 12 cards
    if (difficulty === 'hard') pairCount = 8; // 16 cards
    setTotalPairs(pairCount);

    const selected = NE_CULTURAL_ITEMS.slice(0, pairCount);
    const deck: MemoryCard[] = [];

    selected.forEach((item, index) => {
      deck.push({
        id: index * 2,
        pairId: item.pairId,
        title: item.title,
        emoji: item.emoji,
        tag: item.tag,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: index * 2 + 1,
        pairId: item.pairId,
        title: item.title,
        emoji: item.emoji,
        tag: item.tag,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
  }, [difficulty]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    sound.playClick();
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // Match found!
        setTimeout(() => {
          sound.playSuccess();
          const matchedDeck = newCards.map((c, i) =>
            i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c,
          );
          setCards(matchedDeck);
          setFlippedIndices([]);
          const newMatchedCount = matchedPairs + 1;
          setMatchedPairs(newMatchedCount);

          if (newMatchedCount === totalPairs) {
            // Game Finished!
            const durationSec = Math.max(10, Math.round((Date.now() - startTime) / 1000));
            const baseMoves = totalPairs;
            const accuracy = Math.min(100, Math.max(70, Math.round((baseMoves / (moves + 1)) * 100)));
            const score = Math.min(100, Math.max(75, 100 - (moves - baseMoves) * 5));

            onComplete({
              gameId: 'game_memory_match',
              gameTitle: 'North East Cultural Memory Match',
              category: 'MEMORY',
              difficulty,
              durationSeconds: durationSec,
              score,
              accuracy,
              attempts: moves + 1,
              responseTimeMs: Math.round((durationSec * 1000) / (moves + 1)),
            });
          }
        }, 300);
      } else {
        // No match, flip back gently
        setTimeout(() => {
          const resetDeck = newCards.map((c, i) =>
            i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c,
          );
          setCards(resetDeck);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Game progress header */}
      <div className="bg-white p-4 rounded-2xl border border-[#dae1ff] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#455f88] uppercase">Matched Pairs:</span>
          <span className="px-3 py-1 bg-[#e2e7ff] text-[#001849] font-extrabold text-base rounded-full">
            {matchedPairs} / {totalPairs}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#455f88] uppercase">Card Turns:</span>
          <span className="px-3 py-1 bg-[#f2f3ff] text-[#001849] font-extrabold text-base rounded-full">
            {moves}
          </span>
        </div>
      </div>

      {/* Responsive Cards Grid */}
      <div
        className={`grid gap-3 sm:gap-4 ${
          totalPairs <= 4
            ? 'grid-cols-2 sm:grid-cols-4'
            : totalPairs <= 6
            ? 'grid-cols-3 sm:grid-cols-4'
            : 'grid-cols-4 sm:grid-cols-4'
        }`}
      >
        {cards.map((card, index) => {
          const isRevealed = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              id={`memory-card-${index}`}
              onClick={() => handleCardClick(index)}
              disabled={card.isMatched}
              className={`min-h-[120px] sm:min-h-[145px] p-3 rounded-2xl font-bold flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 shadow-sm border-2 ${
                card.isMatched
                  ? 'bg-[#e6f4ea] border-[#34a853] text-[#137333] opacity-90'
                  : isRevealed
                  ? 'bg-white border-[#006767] ring-4 ring-teal-100'
                  : 'bg-gradient-to-br from-[#006767] to-[#208181] border-[#004f50] text-white hover:brightness-105'
              }`}
            >
              {isRevealed ? (
                <>
                  <span className="text-4xl sm:text-5xl mb-2">{card.emoji}</span>
                  <span className="text-xs sm:text-sm font-bold text-[#001849] text-center line-clamp-1">
                    {card.title}
                  </span>
                  <span className="text-[10px] text-[#455f88] hidden sm:block">
                    {card.tag}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-black text-teal-100">
                    ?
                  </div>
                  <span className="text-xs text-teal-100 font-semibold">Tap to Reveal</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
