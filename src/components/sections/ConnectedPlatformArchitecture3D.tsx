import React, { useState, useEffect, useCallback } from 'react';
import {
  Gamepad2,
  Sparkles,
  Volume2,
  Clock,
  HeartHandshake,
  WifiOff,
  ChevronRight,
  CheckCircle2,
  X,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Zap,
  Radio,
  Eye,
  Layers,
  HelpCircle,
  VolumeX,
  Compass,
  ArrowRight,
  Activity,
  UserCheck,
  CloudRain,
  Wifi,
  Sun,
  Moon,
  Pill,
  Droplets,
  Utensils,
  Dumbbell,
} from 'lucide-react';
import {
  ConnectedPillars3DCanvas,
  SIX_PILLARS,
  PillarData,
} from '../3d/ConnectedPillars3DCanvas';
import { sound } from '../../services/sound';
import { SupportedLanguage, UserRole } from '../../types';

interface ConnectedPlatformArchitecture3DProps {
  onSelectRole?: (role: UserRole) => void;
  onOpenVoiceAssistant?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  currentLang?: SupportedLanguage;
}

export const ConnectedPlatformArchitecture3D: React.FC<ConnectedPlatformArchitecture3DProps> = ({
  onSelectRole,
  onOpenVoiceAssistant,
  onNavigateSection,
  currentLang = 'en',
}) => {
  const [activePillarId, setActivePillarId] = useState<number | null>(null);
  const [hoveredPillarId, setHoveredPillarId] = useState<number | null>(null);
  const [is2DMode, setIs2DMode] = useState<boolean>(false);
  const [inspectorPillar, setInspectorPillar] = useState<PillarData | null>(null);

  // Live Interactive Demo States for each pillar
  // Pillar 1: Mini Memory Match Demo
  const [gameTiles, setGameTiles] = useState([
    { id: 1, icon: '🌿', label: 'Tea Leaf', matched: false, flipped: false },
    { id: 2, icon: '🥁', label: 'Dhol', matched: false, flipped: false },
    { id: 3, icon: '🌿', label: 'Tea Leaf', matched: false, flipped: false },
    { id: 4, icon: '🥁', label: 'Dhol', matched: false, flipped: false },
  ]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  // Pillar 2: Fatigue Slider
  const [fatigueLevel, setFatigueLevel] = useState<number>(30);

  // Pillar 3: Audio Dialect Preview
  const [playingVoiceLang, setPlayingVoiceLang] = useState<string | null>(null);

  // Pillar 4: Circadian Step
  const [activeTimeOfDay, setActiveTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  // Pillar 5: Caregiver Alert Simulation
  const [simulatedAlertSent, setSimulatedAlertSent] = useState(false);

  // Pillar 6: Offline Simulator
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(true);

  // Keyboard Navigation for accessibility (1-6 keys, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setInspectorPillar(null);
      }
      if (!inspectorPillar) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 6) {
          const target = SIX_PILLARS.find((p) => p.id === num);
          if (target) {
            handleOpenInspector(target);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectorPillar]);

  const handleOpenInspector = (pillar: PillarData) => {
    sound.playClick();
    setActivePillarId(pillar.id);
    setInspectorPillar(pillar);
  };

  const handleCloseInspector = () => {
    sound.playClick();
    setInspectorPillar(null);
  };

  // Mini Memory Tile Flip Logic
  const handleTileClick = (index: number) => {
    if (flippedIndices.length === 2 || gameTiles[index].flipped || gameTiles[index].matched) return;
    sound.playClick();

    const nextTiles = [...gameTiles];
    nextTiles[index].flipped = true;
    setGameTiles(nextTiles);

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      const [first, second] = nextFlipped;
      if (gameTiles[first].icon === gameTiles[second].icon) {
        setTimeout(() => {
          sound.playSuccess();
          const matchedTiles = [...gameTiles];
          matchedTiles[first].matched = true;
          matchedTiles[second].matched = true;
          setGameTiles(matchedTiles);
          setFlippedIndices([]);
        }, 500);
      } else {
        setTimeout(() => {
          const resetTiles = [...gameTiles];
          resetTiles[first].flipped = false;
          resetTiles[second].flipped = false;
          setGameTiles(resetTiles);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  const resetGameDemo = () => {
    sound.playClick();
    setGameTiles([
      { id: 1, icon: '🌿', label: 'Tea Leaf', matched: false, flipped: false },
      { id: 2, icon: '🥁', label: 'Dhol', matched: false, flipped: false },
      { id: 3, icon: '🌿', label: 'Tea Leaf', matched: false, flipped: false },
      { id: 4, icon: '🥁', label: 'Dhol', matched: false, flipped: false },
    ]);
    setFlippedIndices([]);
  };

  // Helper icons for pillars
  const getPillarIcon = (key: string, className = 'w-7 h-7') => {
    switch (key) {
      case 'cognitive_games':
        return <Gamepad2 className={className} />;
      case 'ai_engine':
        return <Sparkles className={className} />;
      case 'voice_multilingual':
        return <Volume2 className={className} />;
      case 'routine_pacing':
        return <Clock className={className} />;
      case 'caregiver_portal':
        return <HeartHandshake className={className} />;
      case 'offline_sync':
        return <WifiOff className={className} />;
      default:
        return <Activity className={className} />;
    }
  };

  return (
    <section
      id="section-features"
      className="relative bg-gradient-to-b from-[#081827] via-[#0A1D30] to-[#081827] rounded-3xl border border-[#243A50] p-5 sm:p-8 lg:p-12 shadow-2xl text-[#F4F8FC] scroll-mt-24 overflow-hidden"
      aria-label="Connected Platform Architecture - Six Pillars of Everyday Cognitive Support"
    >
      {/* Subtle Spatial Ambient Background Glows */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 bg-[#12C8B8]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#A855F7]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* =========================================================================
            HEADER (DIMENSIONAL PILL + BOLD HIGH-CONTRAST READABLE HEADINGS)
            ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#243A50] pb-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10263A] border border-[#243A50] shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-[#12C8B8] animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-[#38D9C5]">
                CONNECTED PLATFORM ARCHITECTURE
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F4F8FC] tracking-tight leading-tight">
              Six Pillars of Everyday Cognitive Support
            </h2>

            <p className="text-base sm:text-lg text-[#B7C5D6] leading-relaxed font-medium">
              “Engineered with senior tactile affordance, zero-frustration algorithms, and complete
              family integration.”
            </p>
          </div>

          {/* Quick Accessibility & Display Toggles */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => {
                sound.playClick();
                setIs2DMode(!is2DMode);
              }}
              className="min-h-[48px] px-4 py-2 rounded-2xl bg-[#10263A] hover:bg-[#142F47] border border-[#243A50] text-xs font-black text-[#B7C5D6] hover:text-[#F4F8FC] flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
              aria-label={is2DMode ? 'Switch to 3D Spatial Canvas' : 'Switch to 2D High-Contrast Grid'}
            >
              {is2DMode ? <Layers className="w-4 h-4 text-[#12C8B8]" /> : <Eye className="w-4 h-4 text-[#12C8B8]" />}
              <span>{is2DMode ? 'Switch to 3D View' : '2D High-Contrast Mode'}</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            3D SPATIAL ECOSYSTEM CANVAS (OR 2D FALLBACK)
            ========================================================================= */}
        <div className="bg-[#0B1E32] rounded-3xl border border-[#243A50] relative overflow-hidden shadow-2xl">
          {is2DMode ? (
            <div className="p-6 sm:p-10 space-y-6">
              <div className="flex items-center justify-between border-b border-[#243A50] pb-4">
                <div className="flex items-center gap-2 text-[#38D9C5]">
                  <Layers className="w-5 h-5" />
                  <h3 className="font-black text-sm uppercase tracking-wider text-[#F4F8FC]">
                    2D Accessible Architectural Overview
                  </h3>
                </div>
                <span className="text-xs text-[#8CA0B8]">
                  Select any card below to view 3-question senior breakdown
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SIX_PILLARS.map((pillar) => (
                  <button
                    key={pillar.id}
                    onClick={() => handleOpenInspector(pillar)}
                    className="p-5 rounded-2xl bg-[#10263A] border border-[#243A50] hover:border-[#12C8B8] text-left space-y-3 transition-all cursor-pointer hover:bg-[#142F47] group shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#38D9C5] bg-[#081827] px-2.5 py-1 rounded-lg border border-[#243A50]">
                        {pillar.number}
                      </span>
                      <div className="p-2 rounded-xl bg-[#081827] text-[#38D9C5] border border-[#243A50]">
                        {getPillarIcon(pillar.key, 'w-5 h-5')}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-[#F4F8FC] group-hover:text-[#38D9C5] transition-colors">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-[#8CA0B8] mt-1 line-clamp-2">
                        {pillar.description}
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#12C8B8] border-t border-[#243A50]">
                      <span>{pillar.bottomLabel}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ConnectedPillars3DCanvas
              activePillarId={activePillarId}
              onSelectPillar={(id) => {
                const p = SIX_PILLARS.find((item) => item.id === id);
                if (p) handleOpenInspector(p);
              }}
              hoveredPillarId={hoveredPillarId}
              setHoveredPillarId={setHoveredPillarId}
            />
          )}
        </div>

        {/* =========================================================================
            SIX DIMENSIONAL INTERACTIVE HEALTHCARE PANELS (DESKTOP & MOBILE GRID)
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SIX_PILLARS.map((pillar) => {
            const isHovered = hoveredPillarId === pillar.id;
            const isActive = activePillarId === pillar.id;

            return (
              <div
                key={pillar.id}
                onMouseEnter={() => setHoveredPillarId(pillar.id)}
                onMouseLeave={() => setHoveredPillarId(null)}
                className={`p-6 sm:p-7 rounded-3xl bg-[#10263A] border transition-all duration-300 flex flex-col justify-between space-y-5 shadow-xl relative group ${
                  isActive
                    ? 'border-[#12C8B8] ring-2 ring-[#12C8B8]/30 bg-[#122E48]'
                    : isHovered
                    ? 'border-[#38D9C5] -translate-y-1 bg-[#142F47]'
                    : 'border-[#243A50] hover:border-[#12C8B8]/60'
                }`}
              >
                {/* Module Header & Icon */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-14 h-14 rounded-2xl bg-[#081827] border border-[#243A50] flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
                      style={{ color: pillar.color }}
                    >
                      {getPillarIcon(pillar.key, 'w-7 h-7')}
                    </div>
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-[#081827] border border-[#243A50] text-[#8CA0B8]">
                      Pillar {pillar.number}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#38D9C5]">
                      {pillar.category}
                    </span>
                    <h3 className="text-xl font-black text-[#F4F8FC] tracking-tight mt-0.5">
                      {pillar.title}
                    </h3>
                  </div>

                  <p className="text-sm text-[#B7C5D6] leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>

                {/* Tactile Action Button */}
                <div className="pt-3 border-t border-[#243A50]">
                  <button
                    onClick={() => handleOpenInspector(pillar)}
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#081827] hover:bg-[#12C8B8] text-[#F4F8FC] hover:text-[#081827] font-black text-sm border border-[#243A50] hover:border-[#12C8B8] flex items-center justify-between transition-all cursor-pointer shadow-sm group-hover:shadow-md active:scale-98"
                    aria-label={`Inspect ${pillar.title} details`}
                  >
                    <span>{pillar.bottomLabel}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            FINAL CTA PANEL (WIDE DIMENSIONAL HEALTHCARE PANEL)
            ========================================================================= */}
        <div className="mt-12 bg-gradient-to-r from-[#10263A] via-[#142F47] to-[#10263A] rounded-3xl border border-[#243A50] p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081827] border border-[#243A50] text-xs font-black text-[#38D9C5]">
              <ShieldCheck className="w-4 h-4 text-[#12C8B8]" />
              <span>Dignity & Cognitive Autonomy</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F4F8FC] tracking-tight">
              A Smarter Way to Support Every Day
            </h3>
            <p className="text-base sm:text-lg text-[#B7C5D6] font-medium">
              Connected tools for seniors, families, and care teams.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => {
                sound.playSuccess();
                if (onSelectRole) onSelectRole('PATIENT');
              }}
              className="w-full sm:w-auto min-h-[56px] px-8 py-3.5 rounded-2xl bg-[#12C8B8] hover:bg-[#38D9C5] text-[#081827] font-black text-base flex items-center justify-center gap-2.5 shadow-lg hover:shadow-[#12C8B8]/30 transition-all cursor-pointer active:scale-95"
            >
              <Compass className="w-5 h-5" />
              <span>Explore MindCare</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                if (onNavigateSection) {
                  onNavigateSection('section-how-it-works');
                } else {
                  const el = document.getElementById('section-how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto min-h-[56px] px-8 py-3.5 rounded-2xl bg-[#081827] hover:bg-[#10263A] text-[#F4F8FC] font-black text-base border border-[#243A50] hover:border-[#12C8B8] flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-95"
            >
              <span>See How It Works</span>
              <ArrowRight className="w-5 h-5 text-[#38D9C5]" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SENIOR UX DETAIL INSPECTOR MODAL (ANSWERS 3 CRUCIAL QUESTIONS)
          ========================================================================= */}
      {inspectorPillar && (
        <div
          className="fixed inset-0 z-50 bg-[#05101B]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="inspector-title"
        >
          <div className="bg-[#10263A] border-2 border-[#12C8B8] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-[#F4F8FC] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#243A50] pb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl bg-[#081827] border border-[#243A50] flex items-center justify-center text-[#38D9C5] shadow-inner"
                  style={{ color: inspectorPillar.color }}
                >
                  {getPillarIcon(inspectorPillar.key, 'w-7 h-7')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#38D9C5] bg-[#081827] px-2.5 py-0.5 rounded-md border border-[#243A50]">
                      PILLAR {inspectorPillar.number}
                    </span>
                    <span className="text-xs font-bold text-[#8CA0B8]">
                      {inspectorPillar.details.clinicalBadge}
                    </span>
                  </div>
                  <h3 id="inspector-title" className="text-2xl sm:text-3xl font-black text-[#F4F8FC] mt-0.5">
                    {inspectorPillar.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={handleCloseInspector}
                className="min-h-[44px] min-w-[44px] p-2 rounded-2xl bg-[#081827] hover:bg-[#142F47] border border-[#243A50] text-[#B7C5D6] hover:text-[#F4F8FC] flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close details"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* THREE SENIOR QUESTIONS BREAKDOWN (HIGH READABILITY MIN 18PX) */}
            <div className="space-y-4 bg-[#081827] p-5 sm:p-6 rounded-2xl border border-[#243A50]">
              {/* Question 1: WHAT IS IT? */}
              <div className="space-y-1.5 border-b border-[#243A50] pb-3.5">
                <div className="flex items-center gap-2 text-[#38D9C5] font-black text-sm uppercase tracking-wide">
                  <HelpCircle className="w-4 h-4" />
                  <span>1. What is it?</span>
                </div>
                <p className="text-base sm:text-lg text-[#F4F8FC] leading-relaxed font-medium">
                  {inspectorPillar.details.whatIsIt}
                </p>
              </div>

              {/* Question 2: WHAT DOES IT DO? */}
              <div className="space-y-1.5 border-b border-[#243A50] pb-3.5">
                <div className="flex items-center gap-2 text-[#35D07F] font-black text-sm uppercase tracking-wide">
                  <Zap className="w-4 h-4" />
                  <span>2. What does it do?</span>
                </div>
                <p className="text-base sm:text-lg text-[#F4F8FC] leading-relaxed font-medium">
                  {inspectorPillar.details.whatDoesItDo}
                </p>
              </div>

              {/* Question 3: WHY DOES IT HELP ME? */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#F4B740] font-black text-sm uppercase tracking-wide">
                  <HeartHandshake className="w-4 h-4" />
                  <span>3. Why does it help me?</span>
                </div>
                <p className="text-base sm:text-lg text-[#F4F8FC] leading-relaxed font-medium">
                  {inspectorPillar.details.whyDoesItHelpMe}
                </p>
              </div>
            </div>

            {/* LIVE INTERACTIVE DEMO ACCORDING TO PILLAR */}
            <div className="bg-[#0E2235] p-5 rounded-2xl border border-[#243A50] space-y-3">
              <div className="flex items-center justify-between text-xs font-black text-[#38D9C5] uppercase tracking-wider">
                <span>Interactive Live Demonstration</span>
                <span className="text-[#8CA0B8]">Try It Below</span>
              </div>

              {inspectorPillar.id === 1 && (
                // Game Tile Match Live Widget
                <div className="space-y-3">
                  <p className="text-xs text-[#B7C5D6]">
                    Tap two matching cultural tiles below to test gentle cognitive recall:
                  </p>
                  <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
                    {gameTiles.map((tile, idx) => (
                      <button
                        key={tile.id}
                        onClick={() => handleTileClick(idx)}
                        className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-black text-2xl transition-all cursor-pointer ${
                          tile.matched
                            ? 'bg-[#12C8B8]/30 border-[#12C8B8] text-[#38D9C5]'
                            : tile.flipped
                            ? 'bg-[#142F47] border-[#38D9C5]'
                            : 'bg-[#081827] border-[#243A50] hover:border-[#12C8B8]'
                        }`}
                      >
                        {tile.flipped || tile.matched ? (
                          <>
                            <span>{tile.icon}</span>
                            <span className="text-[10px] font-bold text-[#F4F8FC] mt-1">{tile.label}</span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-[#8CA0B8]">?</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="text-center">
                    <button
                      onClick={resetGameDemo}
                      className="text-xs font-bold text-[#38D9C5] hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Tile Match</span>
                    </button>
                  </div>
                </div>
              )}

              {inspectorPillar.id === 2 && (
                // AI Fatigue & DDA Slider Demo
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm font-bold text-[#F4F8FC]">
                    <span>Senior Evening Fatigue Level:</span>
                    <span className="text-[#35D07F] font-black">{fatigueLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={fatigueLevel}
                    onChange={(e) => setFatigueLevel(parseInt(e.target.value, 10))}
                    className="w-full h-3 bg-[#081827] rounded-lg appearance-none cursor-pointer accent-[#35D07F]"
                  />
                  <div className="p-3 rounded-xl bg-[#081827] border border-[#243A50] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#8CA0B8] block">AI Auto-Response:</span>
                      <span className="font-black text-[#F4F8FC]">
                        {fatigueLevel > 60
                          ? '🌟 Calming Mode: Simplified 2-choice questions, soft chime reminders'
                          : '⚡ Active Mode: Full 4-choice recall with regional audio storytelling'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {inspectorPillar.id === 3 && (
                // Voice Dialect Preview Demo
                <div className="space-y-3">
                  <p className="text-xs text-[#B7C5D6]">
                    Select a regional dialect to hear elder-calibrated speaking cadence:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { code: 'as', label: 'Assamese (অসমীয়া)' },
                      { code: 'bn', label: 'Bengali (বাংলা)' },
                      { code: 'mni', label: 'Meiteilon (মৈতৈলোন্)' },
                      { code: 'lus', label: 'Mizo ṭawng' },
                      { code: 'kha', label: 'Khasi' },
                      { code: 'hi', label: 'Hindi (हिन्दी)' },
                      { code: 'en', label: 'English (Elder Paced)' },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          sound.playClick();
                          setPlayingVoiceLang(lang.code);
                          setTimeout(() => setPlayingVoiceLang(null), 2500);
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                          playingVoiceLang === lang.code
                            ? 'bg-[#12C8B8] text-[#081827] border-[#12C8B8]'
                            : 'bg-[#081827] text-[#F4F8FC] border-[#243A50] hover:bg-[#142F47]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {playingVoiceLang === lang.code ? (
                            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-[#38D9C5]" />
                          )}
                          <span>{lang.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {inspectorPillar.id === 4 && (
                // Circadian Pacing Schedule Demo
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {(['morning', 'afternoon', 'evening'] as const).map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          sound.playClick();
                          setActiveTimeOfDay(time);
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          activeTimeOfDay === time
                            ? 'bg-[#F4B740] text-[#081827]'
                            : 'bg-[#081827] text-[#B7C5D6] border border-[#243A50]'
                        }`}
                      >
                        {time === 'morning' && '☀️ Morning (8 AM)'}
                        {time === 'afternoon' && '🌤️ Afternoon (1 PM)'}
                        {time === 'evening' && '🌙 Evening (7 PM)'}
                      </button>
                    ))}
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#081827] border border-[#243A50] space-y-2">
                    {activeTimeOfDay === 'morning' && (
                      <div className="flex items-center gap-3 text-xs text-[#F4F8FC]">
                        <Pill className="w-5 h-5 text-[#F4B740]" />
                        <span>Blood Pressure & Thyroid Medication with warm water</span>
                      </div>
                    )}
                    {activeTimeOfDay === 'afternoon' && (
                      <div className="flex items-center gap-3 text-xs text-[#F4F8FC]">
                        <Utensils className="w-5 h-5 text-[#38D9C5]" />
                        <span>Lunch milestone followed by 10-minute tea leaf memory game</span>
                      </div>
                    )}
                    {activeTimeOfDay === 'evening' && (
                      <div className="flex items-center gap-3 text-xs text-[#F4F8FC]">
                        <Moon className="w-5 h-5 text-[#A855F7]" />
                        <span>Calming audio story & family voice check-in notification</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {inspectorPillar.id === 5 && (
                // Caregiver Alert Simulator
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#B7C5D6]">Daughter / Son Remote Phone View:</span>
                    <button
                      onClick={() => {
                        sound.playSuccess();
                        setSimulatedAlertSent(true);
                        setTimeout(() => setSimulatedAlertSent(false), 4000);
                      }}
                      className="px-3 py-1 rounded-lg bg-[#A855F7] text-[#F4F8FC] font-bold text-xs hover:bg-[#C084FC] cursor-pointer"
                    >
                      Simulate Medication Check-in
                    </button>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#081827] border border-[#243A50] flex items-center gap-3 text-xs">
                    <HeartHandshake className="w-6 h-6 text-[#A855F7] shrink-0" />
                    <div>
                      <p className="font-bold text-[#F4F8FC]">
                        {simulatedAlertSent
                          ? '✅ Telemetry Update: Morning BP medicine logged on senior tablet at 8:12 AM.'
                          : 'Dhiren Borah (Father) — 100% adherence this week. Last active 12 mins ago.'}
                      </p>
                      <span className="text-[#8CA0B8] text-[11px]">Encrypted Caregiver Channel</span>
                    </div>
                  </div>
                </div>
              )}

              {inspectorPillar.id === 6 && (
                // 100% Offline Edge Sync Demo
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#B7C5D6]">Network Connectivity Simulation:</span>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsSimulatedOffline(!isSimulatedOffline);
                      }}
                      className="px-3 py-1 rounded-lg bg-[#38BDF8] text-[#081827] font-bold text-xs hover:bg-[#7DD3FC] cursor-pointer"
                    >
                      Toggle {isSimulatedOffline ? 'Online Wi-Fi' : 'Heavy Monsoon Storm'}
                    </button>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#081827] border border-[#243A50] flex items-center gap-3 text-xs">
                    {isSimulatedOffline ? (
                      <CloudRain className="w-6 h-6 text-[#38BDF8] shrink-0" />
                    ) : (
                      <Wifi className="w-6 h-6 text-[#35D07F] shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-[#F4F8FC]">
                        {isSimulatedOffline
                          ? '⚡ Heavy Monsoon Storm (No Internet) — All games, voice recognition & schedules running 100% locally.'
                          : '🌐 Internet Restored — All local memory scores silently synced to family portal in 0.4 seconds.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#243A50]">
              <div className="flex items-center gap-2 text-xs text-[#8CA0B8]">
                <CheckCircle2 className="w-4 h-4 text-[#12C8B8]" />
                <span>WCAG 2.2 AAA Compliant Cognitive Design</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleCloseInspector}
                  className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-[#081827] hover:bg-[#142F47] border border-[#243A50] text-[#F4F8FC] font-black text-sm cursor-pointer transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleCloseInspector();
                    if (inspectorPillar.id === 1 || inspectorPillar.id === 2 || inspectorPillar.id === 4) {
                      if (onSelectRole) onSelectRole('PATIENT');
                    } else if (inspectorPillar.id === 3) {
                      if (onOpenVoiceAssistant) onOpenVoiceAssistant();
                    } else if (inspectorPillar.id === 5) {
                      if (onSelectRole) onSelectRole('CAREGIVER');
                    }
                  }}
                  className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-[#12C8B8] hover:bg-[#38D9C5] text-[#081827] font-black text-sm flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
                >
                  <span>{inspectorPillar.details.actionLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
