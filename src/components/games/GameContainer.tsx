import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Volume2,
  Brain,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Zap,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  CognitiveGame,
  GameDifficulty,
  GameSessionResult,
  PatientProfile,
  SupportedLanguage,
  GameCategory,
} from '../../types';
import { getTranslation } from '../../services/i18n';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';
import { offlineSync } from '../../services/offlineSync';
import { COGNITIVE_GAMES, getGameById } from '../../data/games';
import { MemoryMatchGame } from './MemoryMatchGame';
import { ObjectRecallGame } from './ObjectRecallGame';
import { OddOneOutGame } from './OddOneOutGame';
import { RhythmPatternGame } from './RhythmPatternGame';
import { DailyRoutineGame } from './DailyRoutineGame';
import { ObjectRecognitionGame } from './ObjectRecognitionGame';
import { FamiliarSoundGame } from './FamiliarSoundGame';
import { FamilyMemoryAlbum } from '../patient/FamilyMemoryAlbum';
import { PersonalStoryMode } from '../patient/PersonalStoryMode';
import { GameCompletionModal } from './GameCompletionModal';

export interface GameContainerProps {
  game?: CognitiveGame;
  initialGameId?: string;
  patient: PatientProfile;
  initialDifficulty?: GameDifficulty;
  currentLang: SupportedLanguage;
  onBack?: () => void;
  onBackToDashboard?: () => void;
  onSelectNextGame?: (nextGameId?: string) => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  game,
  initialGameId,
  patient,
  initialDifficulty = 'easy',
  currentLang,
  onBack,
  onBackToDashboard,
  onSelectNextGame,
}) => {
  // If a game prop or initialGameId was provided, start in that game; otherwise start in catalog view
  const [selectedGameId, setSelectedGameId] = useState<string | null>(
    game?.id || initialGameId || null,
  );
  const [difficulty, setDifficulty] = useState<GameDifficulty>(initialDifficulty);
  const [completedSession, setCompletedSession] = useState<GameSessionResult | null>(null);
  const [gameKey, setGameKey] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const t = getTranslation(currentLang);
  const activeGame: CognitiveGame | null = selectedGameId ? getGameById(selectedGameId) : null;

  // Update selected game if prop changes
  useEffect(() => {
    if (game?.id) {
      setSelectedGameId(game.id);
    } else if (initialGameId) {
      setSelectedGameId(initialGameId);
    }
  }, [game, initialGameId]);

  // Spoken instructions when an active game loads if voice prompts enabled
  useEffect(() => {
    if (activeGame && patient?.accessibilitySettings?.voicePrompts) {
      const instructionText =
        activeGame.instructions[currentLang] || activeGame.instructions.en;
      voice.speak(instructionText, currentLang);
    }
  }, [activeGame?.id, currentLang]);

  const handleReadInstructions = () => {
    if (!activeGame) return;
    sound.playClick();
    const instructionText =
      activeGame.instructions[currentLang] || activeGame.instructions.en;
    voice.speak(instructionText, currentLang);
  };

  const handleGameComplete = async (
    resultData: Omit<
      GameSessionResult,
      'id' | 'patientId' | 'startedAt' | 'completedAt' | 'synced'
    >,
  ) => {
    const fullSession: GameSessionResult = {
      ...resultData,
      id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      patientId: patient?.id || 'p_dhiren_01',
      startedAt: new Date(
        Date.now() - resultData.durationSeconds * 1000,
      ).toISOString(),
      completedAt: new Date().toISOString(),
      synced: offlineSync.isOnline(),
    };

    // Save locally first (offline-first resilience)
    offlineSync.saveLocalSession(fullSession);

    // If online, send to server
    if (offlineSync.isOnline()) {
      try {
        await fetch('/api/games/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullSession),
        });
      } catch (err) {
        console.warn('Game session queued locally due to network:', err);
      }
    }

    setCompletedSession(fullSession);
  };

  const handlePlayAgain = () => {
    setCompletedSession(null);
    setGameKey((k) => k + 1);
  };

  const handleSelectGame = (gameId: string) => {
    sound.playClick();
    setSelectedGameId(gameId);
    setCompletedSession(null);
    setGameKey((k) => k + 1);
  };

  const handleNextActivity = () => {
    setCompletedSession(null);
    if (!activeGame) {
      setSelectedGameId(COGNITIVE_GAMES[0].id);
      return;
    }
    const currentIndex = COGNITIVE_GAMES.findIndex((g) => g.id === activeGame.id);
    const nextIndex = (currentIndex + 1) % COGNITIVE_GAMES.length;
    const nextGame = COGNITIVE_GAMES[nextIndex];
    setSelectedGameId(nextGame.id);
    setGameKey((k) => k + 1);
    if (onSelectNextGame) {
      onSelectNextGame(nextGame.id);
    }
  };

  const handleBack = () => {
    sound.playClick();
    voice.stopSpeaking();
    if (selectedGameId) {
      // Go back to the games catalog first
      setSelectedGameId(null);
    } else if (onBackToDashboard) {
      onBackToDashboard();
    } else if (onBack) {
      onBack();
    }
  };

  const renderActiveGame = () => {
    if (!activeGame) return null;

    switch (activeGame.id) {
      case 'game_memory_match':
        return (
          <MemoryMatchGame
            key={gameKey}
            difficulty={difficulty}
            onComplete={handleGameComplete}
          />
        );
      case 'game_object_recall':
        return (
          <ObjectRecallGame
            key={gameKey}
            difficulty={difficulty}
            onComplete={handleGameComplete}
          />
        );
      case 'game_attention_odd_one':
        return (
          <OddOneOutGame
            key={gameKey}
            difficulty={difficulty}
            onComplete={handleGameComplete}
          />
        );
      case 'game_pattern_rhythm':
        return (
          <RhythmPatternGame
            key={gameKey}
            difficulty={difficulty}
            onComplete={handleGameComplete}
          />
        );
      case 'game_daily_routine_recall':
        return (
          <DailyRoutineGame
            key={gameKey}
            difficulty={difficulty}
            onComplete={handleGameComplete}
          />
        );
      case 'game_object_recognition':
        return (
          <ObjectRecognitionGame
            key={gameKey}
            difficulty={difficulty}
            onComplete={handleGameComplete}
          />
        );
      case 'game_familiar_sounds':
        return (
          <FamiliarSoundGame
            key={gameKey}
            currentLang={currentLang}
            difficulty={difficulty}
            onComplete={(score, accuracy, attempts) =>
              handleGameComplete({
                gameId: 'game_familiar_sounds',
                gameTitle: 'Familiar Sound & Audio Recognition',
                category: 'SOUND_RECOGNITION',
                difficulty,
                durationSeconds: 90,
                score,
                accuracy,
                attempts,
                responseTimeMs: 1400,
              })
            }
          />
        );
      case 'game_family_memory':
        return (
          <FamilyMemoryAlbum
            key={gameKey}
            currentLang={currentLang}
            currentRole="PATIENT"
            patientName={patient.name}
            onQuizComplete={(score) =>
              handleGameComplete({
                gameId: 'game_family_memory',
                gameTitle: 'Family Memory Album Quiz',
                category: 'FAMILY_MEMORY',
                difficulty: 'easy',
                durationSeconds: 120,
                score: 100,
                accuracy: 100,
                attempts: 4,
                responseTimeMs: 1200,
              })
            }
          />
        );
      case 'game_personal_story':
        return (
          <PersonalStoryMode
            key={gameKey}
            currentLang={currentLang}
            patientName={patient.name}
            onComplete={(score) =>
              handleGameComplete({
                gameId: 'game_personal_story',
                gameTitle: 'Personal Story & Reminiscence Journey',
                category: 'STORY_MODE',
                difficulty: 'easy',
                durationSeconds: 150,
                score: 100,
                accuracy: 100,
                attempts: 2,
                responseTimeMs: 1600,
              })
            }
          />
        );
      default:
        return (
          <MemoryMatchGame
            key={gameKey}
            difficulty={difficulty}
            onComplete={handleGameComplete}
          />
        );
    }
  };

  // -------------------------------------------------------------
  // CATALOG VIEW (If no game is currently selected)
  // -------------------------------------------------------------
  if (!activeGame) {
    const filteredGames =
      categoryFilter === 'ALL'
        ? COGNITIVE_GAMES
        : COGNITIVE_GAMES.filter((g) => g.category === categoryFilter);

    return (
      <div id="games-catalog-view" className="space-y-6 pb-12 text-[#F4F8FC]">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#101F31] to-[#14283D] rounded-3xl p-6 text-[#F4F8FC] border border-[#243A50] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101F31] border border-[#243A50] text-[#38D9C5] text-xs font-black">
              <Brain className="w-3.5 h-3.5 text-[#38D9C5]" />
              <span>North East Cognitive Rehabilitation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F4F8FC]">
              {t.playAndRemember || 'Play & Strengthen Memory'}
            </h2>
            <p className="text-[#B7C5D6] text-sm max-w-xl">
              Gentle, culturally grounded memory games designed for relaxation, focus, and daily brain vitality.
            </p>
          </div>

          {onBackToDashboard && (
            <button
              id="back-to-home-btn"
              onClick={onBackToDashboard}
              className="px-4 py-2.5 bg-[#101F31] hover:bg-[#162B40] text-[#F4F8FC] rounded-2xl text-xs font-black border border-[#243A50] flex items-center gap-2 transition-all shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: `All Activities (${COGNITIVE_GAMES.length})` },
            { id: 'MEMORY', label: 'Memory' },
            { id: 'SOUND_RECOGNITION', label: 'Familiar Sounds' },
            { id: 'FAMILY_MEMORY', label: 'Family Album' },
            { id: 'STORY_MODE', label: 'Story Mode' },
            { id: 'ATTENTION', label: 'Attention' },
            { id: 'PATTERN', label: 'Pattern & Rhythm' },
            { id: 'DAILY_RECALL', label: 'Daily Routine' },
            { id: 'OBJECT_RECOGNITION', label: 'Tool Recognition' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setCategoryFilter(cat.id);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                  : 'bg-[#101F31] text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC] border border-[#243A50]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGames.map((g) => (
            <div
              key={g.id}
              id={`game-card-${g.id}`}
              className="bg-[#101F31] rounded-3xl p-6 border border-[#243A50] hover:border-[#19C3B1] hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#14283D] text-[#38D9C5] border border-[#243A50] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {g.category}
                  </span>
                  <div className="flex items-center gap-1 text-[#7F91A6] text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{g.estimatedMinutes} mins</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-[#F4F8FC] group-hover:text-[#38D9C5] transition-colors leading-snug">
                  {g.title}
                </h3>

                <p className="text-xs font-semibold text-[#B7C5D6] line-clamp-2 leading-relaxed">
                  {g.description}
                </p>

                <div className="bg-[#14283D] p-3 rounded-2xl border border-[#243A50] space-y-1">
                  <div className="text-[10px] font-black text-[#38D9C5] uppercase">
                    Cultural Motif:
                  </div>
                  <div className="text-xs font-bold text-[#F4F8FC] line-clamp-1">
                    {g.culturalTheme}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#243A50] flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-[#7F91A6]">
                  Skill: {g.targetSkill.split('&')[0]}
                </span>
                <button
                  id={`play-btn-${g.id}`}
                  onClick={() => handleSelectGame(g.id)}
                  className="px-5 py-2.5 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] font-black text-xs rounded-2xl flex items-center gap-2 shadow-xs transition-transform active:scale-95 shrink-0 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-[#07111F]" />
                  <span>Play</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE GAME PLAYER VIEW
  // -------------------------------------------------------------
  return (
    <div id="game-active-container" className="space-y-6 pb-12 text-[#F4F8FC]">
      {/* Top Header Controls */}
      <div className="bg-[#101F31] rounded-3xl p-5 border border-[#243A50] shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Back button & Game Title */}
        <div className="flex items-center gap-3">
          <button
            id="back-to-catalog-btn"
            onClick={handleBack}
            className="w-12 h-12 rounded-2xl bg-[#14283D] hover:bg-[#162B40] text-[#38D9C5] border border-[#243A50] flex items-center justify-center transition-all shadow-xs cursor-pointer"
            title="Back to games catalog"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#F4F8FC]">
                {activeGame.title}
              </h2>
              <span className="bg-[#14283D] text-[#38D9C5] border border-[#243A50] text-xs font-bold px-2.5 py-0.5 rounded-full hidden sm:inline">
                {activeGame.category}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#B7C5D6] line-clamp-1">
              {activeGame.culturalTheme}
            </p>
          </div>
        </div>

        {/* Difficulty Selector & Voice Instructions Reader */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Difficulty Chips */}
          <div className="flex items-center bg-[#14283D] p-1 rounded-2xl border border-[#243A50]">
            {(['easy', 'medium', 'hard'] as GameDifficulty[]).map((lvl) => (
              <button
                key={lvl}
                id={`difficulty-btn-${lvl}`}
                onClick={() => {
                  sound.playClick();
                  setDifficulty(lvl);
                  setGameKey((k) => k + 1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                  difficulty === lvl
                    ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                    : 'text-[#B7C5D6] hover:bg-[#162B40] hover:text-[#F4F8FC]'
                }`}
              >
                {lvl === 'easy' ? t.easy || 'Easy' : lvl === 'medium' ? t.medium || 'Medium' : t.hard || 'Hard'}
              </button>
            ))}
          </div>

          {/* Reset / Retry Button */}
          <button
            id="retry-game-btn"
            onClick={() => {
              sound.playClick();
              setGameKey((k) => k + 1);
            }}
            className="w-10 h-10 rounded-2xl bg-[#14283D] hover:bg-[#162B40] text-[#38D9C5] border border-[#243A50] flex items-center justify-center transition-all shadow-xs cursor-pointer"
            title="Restart current activity"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Voice Prompt Reader Button */}
          <button
            id="read-instructions-voice-btn"
            onClick={handleReadInstructions}
            className="px-4 py-2 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Volume2 className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Read Instructions</span>
          </button>
        </div>
      </div>

      {/* Spoken Instructions Banner */}
      <div className="bg-[#14283D] border border-[#243A50] p-4 rounded-2xl flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-full bg-[#19C3B1] text-[#07111F] flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-black text-[#38D9C5] uppercase block mb-0.5">
            How to Play:
          </span>
          <p className="text-base font-semibold text-[#F4F8FC] leading-snug">
            {activeGame.instructions[currentLang] || activeGame.instructions.en}
          </p>
        </div>
      </div>

      {/* Render Active Game */}
      {renderActiveGame()}

      {/* Completion Modal */}
      <GameCompletionModal
        session={completedSession}
        onPlayAgain={handlePlayAgain}
        onNextActivity={handleNextActivity}
        onBackToHome={() => {
          setSelectedGameId(null);
          if (onBackToDashboard) onBackToDashboard();
        }}
        currentLang={currentLang}
      />
    </div>
  );
};
