import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Users,
  Tablet,
  Volume2,
  Brain,
  Activity,
  ArrowRight,
  RotateCcw,
  Play,
  CheckCircle2,
  ChevronRight,
  Layers,
  HeartHandshake,
  Stethoscope,
  ShieldCheck,
  Eye,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HowItWorks3DScene, HOW_IT_WORKS_STEPS, StepConfig } from '../3d/HowItWorks3DScene';
import { WebGLFallback } from '../3d/WebGLFallback';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';
import { UserRole, SupportedLanguage } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface HowMindCareWorks3DProps {
  onSelectRole: (role: UserRole) => void;
  onOpenVoiceAssistant?: () => void;
  currentLang?: SupportedLanguage;
}

export const HowMindCareWorks3D: React.FC<HowMindCareWorks3DProps> = ({
  onSelectRole,
  onOpenVoiceAssistant,
  currentLang = 'en',
}) => {
  const [activeStepId, setActiveStepId] = useState<number | null>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [is2DMode, setIs2DMode] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const activeStep = HOW_IT_WORKS_STEPS.find((s) => s.id === activeStepId) || null;

  // Auto-Tour interval
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStepId((prev) => {
        if (prev === null) return 1;
        if (prev >= 5) return 1;
        return prev + 1;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleStepSelect = (stepId: number | null) => {
    sound.playClick();
    setIsAutoPlaying(false);
    setActiveStepId(stepId);
  };

  const handleNextStep = () => {
    sound.playClick();
    if (activeStepId === null || activeStepId >= 5) {
      setActiveStepId(1);
    } else {
      setActiveStepId(activeStepId + 1);
    }
  };

  const handlePrevStep = () => {
    sound.playClick();
    if (activeStepId === null || activeStepId <= 1) {
      setActiveStepId(5);
    } else {
      setActiveStepId(activeStepId - 1);
    }
  };

  const handlePlayVoiceSample = () => {
    sound.playClick();
    if (activeStepId === 3) {
      voice.speak(
        'নমস্কাৰ ধীৰেন দেউতা! আপোনাৰ পুৱাৰ চাহ আৰু স্মৃতি বাগিচালৈ স্বাগতম।',
        'as'
      );
    } else {
      voice.speak(
        activeStep ? `${activeStep.title}. ${activeStep.description}` : 'MindCare NER onboarding journey.',
        currentLang
      );
    }
  };

  const getStepIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Users className="w-5 h-5" />;
      case 2:
        return <Tablet className="w-5 h-5" />;
      case 3:
        return <Volume2 className="w-5 h-5" />;
      case 4:
        return <Brain className="w-5 h-5" />;
      case 5:
        return <Activity className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section
      id="section-how-it-works"
      role="region"
      aria-label="How MindCare NER Works in Five Simple Steps"
      className="bg-[#07111F] rounded-3xl border border-[#243A50] p-4 sm:p-8 lg:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24 relative overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#19C3B1]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B7CFF]/5 rounded-full blur-3xl pointer-events-none" />

      {/* =========================================================================
          SECTION HEADER: 3D FLOATING BADGE & HIGH-READABILITY HEADINGS
          ========================================================================= */}
      <div className="text-center max-w-4xl mx-auto space-y-4 relative z-10">
        {/* Floating 3D Translucent Healthcare Badge */}
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, -4, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#101F31]/80 backdrop-blur-md border border-[#19C3B1]/40 text-[#38D9C5] text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(25,195,177,0.25)]"
        >
          <span className="w-2 h-2 rounded-full bg-[#19C3B1] animate-pulse" />
          <span>SEAMLESS ONBOARDING</span>
        </motion.div>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F4F8FC] tracking-tight leading-tight">
          How MindCare NER Works in{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#19C3B1] via-[#38D9C5] to-[#5BA7FF]">
            Five Simple Steps
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#B7C5D6] font-medium max-w-2xl mx-auto">
          From unboxing to daily cognitive engagement.
        </p>
      </div>

      {/* =========================================================================
          INTERACTIVE 5-STEP SPATIAL NAVIGATOR BAR
          ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#243A50] py-4 relative z-10">
        {/* Step Buttons: 01 to 05 */}
        <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Onboarding Steps">
          {HOW_IT_WORKS_STEPS.map((step) => {
            const isSelected = activeStepId === step.id;
            return (
              <button
                key={step.id}
                role="tab"
                id={`tab-step-${step.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-step-${step.id}`}
                onClick={() => handleStepSelect(step.id)}
                className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#19C3B1] text-[#07111F] shadow-lg shadow-[#19C3B1]/20 scale-105'
                    : 'bg-[#14283D] text-[#B7C5D6] border border-[#243A50] hover:border-[#19C3B1]/50 hover:text-[#F4F8FC]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isSelected ? 'bg-[#07111F] text-[#19C3B1]' : 'bg-[#101F31] text-[#7F91A6]'
                  }`}
                >
                  {step.stepNumber}
                </span>
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            );
          })}

          {/* Full Pathway Overview Button */}
          <button
            onClick={() => handleStepSelect(null)}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeStepId === null
                ? 'bg-[#8B7CFF] text-[#07111F] shadow-lg'
                : 'bg-[#14283D] text-[#B7C5D6] border border-[#243A50] hover:text-[#F4F8FC]'
            }`}
            title="View entire 5-station ecosystem"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full Overview</span>
          </button>
        </div>

        {/* Tour & View Controls */}
        <div className="flex items-center gap-2">
          {/* Auto-Play Tour Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setIsAutoPlaying(!isAutoPlaying);
            }}
            className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 cursor-pointer ${
              isAutoPlaying
                ? 'bg-[#35D07F]/20 border-[#35D07F] text-[#35D07F]'
                : 'bg-[#14283D] border-[#243A50] text-[#B7C5D6] hover:text-[#F4F8FC]'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isAutoPlaying ? 'fill-current' : ''}`} />
            <span>{isAutoPlaying ? 'Auto Tour: Active' : 'Auto Tour'}</span>
          </button>

          {/* 3D / 2D Switcher */}
          <button
            onClick={() => {
              sound.playClick();
              setIs2DMode(!is2DMode);
            }}
            className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-black bg-[#14283D] border border-[#243A50] text-[#B7C5D6] hover:text-[#F4F8FC] transition-all cursor-pointer flex items-center gap-1.5"
            title="Toggle between 3D Spatial and 2D Accessible Mode"
          >
            <Eye className="w-3.5 h-3.5 text-[#38D9C5]" />
            <span>{is2DMode ? 'Switch to 3D' : '2D Mode'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN 3D SPATIAL STATIONS VIEWPORT + DETAIL INSPECTION CARD
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* 3D Canvas / Spatial Pathway (8 cols on lg) */}
        <div className="lg:col-span-8 bg-[#101F31] rounded-3xl border border-[#243A50] relative overflow-hidden shadow-inner min-h-[420px] sm:min-h-[480px]">
          {is2DMode ? (
            <div className="p-6 sm:p-8 space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-[#243A50] pb-3">
                <div className="flex items-center gap-2 text-[#38D9C5]">
                  <Layers className="w-5 h-5" />
                  <h4 className="font-black text-sm uppercase tracking-wider">
                    2D Accessible Spatial Sequence
                  </h4>
                </div>
                <button
                  onClick={() => setIs2DMode(false)}
                  className="text-xs font-black text-[#19C3B1] hover:underline cursor-pointer"
                >
                  Switch to 3D View ➔
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {HOW_IT_WORKS_STEPS.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepSelect(step.id)}
                    className={`p-3.5 rounded-xl border text-left space-y-1.5 transition-all cursor-pointer ${
                      activeStepId === step.id
                        ? 'bg-[#14283D] border-[#19C3B1] text-[#F4F8FC] ring-2 ring-[#19C3B1]/30'
                        : 'bg-[#0e1e30] border-[#243A50] text-[#B7C5D6] hover:bg-[#14283D]'
                    }`}
                  >
                    <span className="text-xs font-black text-[#38D9C5] block">
                      {step.stepNumber}
                    </span>
                    <p className="text-xs font-bold text-[#F4F8FC] leading-snug">
                      {step.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <HowItWorks3DScene
              activeStep={activeStepId}
              onSelectStep={(id) => handleStepSelect(id)}
            />
          )}

          {/* Canvas Interactive Overlay Prompt */}
          <div className="absolute bottom-3 left-3 bg-[#07111F]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#243A50] text-[11px] text-[#B7C5D6] flex items-center gap-2 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#19C3B1] animate-ping" />
            <span>Click any 3D station or badge to focus & inspect</span>
          </div>

          {/* Camera Stage Navigation Prev/Next Arrows */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-20">
            <button
              onClick={handlePrevStep}
              className="w-9 h-9 rounded-xl bg-[#14283D]/90 hover:bg-[#19C3B1] hover:text-[#07111F] text-[#F4F8FC] border border-[#243A50] flex items-center justify-center text-xs font-black transition-all cursor-pointer"
              title="Previous Step"
            >
              ←
            </button>
            <span className="text-xs font-bold text-[#B7C5D6] px-1">
              {activeStepId ? `0${activeStepId} / 05` : 'Overview'}
            </span>
            <button
              onClick={handleNextStep}
              className="w-9 h-9 rounded-xl bg-[#14283D]/90 hover:bg-[#19C3B1] hover:text-[#07111F] text-[#F4F8FC] border border-[#243A50] flex items-center justify-center text-xs font-black transition-all cursor-pointer"
              title="Next Step"
            >
              →
            </button>
          </div>
        </div>

        {/* Active Step Clinical Detail Card (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <AnimatePresence mode="wait">
            {activeStep ? (
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                id={`panel-step-${activeStep.id}`}
                role="tabpanel"
                aria-labelledby={`tab-step-${activeStep.id}`}
                className="bg-[#14283D] rounded-3xl border-2 border-[#19C3B1]/40 p-6 shadow-xl space-y-5"
              >
                {/* Step Category & Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-[#38D9C5] bg-[#101F31] px-3 py-1 rounded-full border border-[#243A50]">
                    {activeStep.category}
                  </span>
                  <span className="text-xl font-black text-[#19C3B1] bg-[#07111F] w-10 h-10 rounded-2xl flex items-center justify-center border border-[#19C3B1]/30">
                    {activeStep.stepNumber}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-[#F4F8FC]">
                    {activeStep.title}
                  </h3>
                  <p className="text-xs font-bold text-[#38D9C5]">
                    {activeStep.subtitle}
                  </p>
                </div>

                {/* Core Description */}
                <p className="text-sm text-[#F4F8FC] leading-relaxed font-medium">
                  {activeStep.description}
                </p>

                {/* Highlight Box */}
                <div className="p-3.5 bg-[#101F31] rounded-2xl border border-[#243A50] space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#F4B740] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#F4B740]" /> Key Accessibility Highlight
                  </span>
                  <p className="text-xs text-[#B7C5D6]">
                    {activeStep.details.highlight}
                  </p>
                </div>

                {/* Clinical Note */}
                <div className="p-3.5 bg-[#101F31] rounded-2xl border border-[#243A50] space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#35D07F] flex items-center gap-1">
                    <Stethoscope className="w-3 h-3 text-[#35D07F]" /> Clinical Impact
                  </span>
                  <p className="text-xs text-[#B7C5D6]">
                    {activeStep.details.clinicalNote}
                  </p>
                </div>

                {/* Metrics Pill Grid */}
                <div className="flex flex-wrap gap-1.5">
                  {activeStep.details.metrics.map((m, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-bold bg-[#101F31] text-[#B7C5D6] px-2.5 py-1 rounded-lg border border-[#243A50]"
                    >
                      ✓ {m}
                    </span>
                  ))}
                </div>

                {/* Action Row */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handlePlayVoiceSample}
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{activeStepId === 3 ? 'Hear Dialect Audio' : 'Audio Explanation'}</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#101F31] hover:bg-[#162B40] text-[#F4F8FC] font-black text-xs border border-[#243A50] transition-all flex items-center gap-1 cursor-pointer"
                    title="Advance to next step"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4 text-[#38D9C5]" />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Overview Panel when null */
              <div className="bg-[#14283D] rounded-3xl border border-[#243A50] p-6 shadow-xl space-y-4">
                <span className="text-xs font-black uppercase text-[#8B7CFF] bg-[#101F31] px-3 py-1 rounded-full border border-[#243A50]">
                  Full Care Ecosystem
                </span>
                <h3 className="text-2xl font-black text-[#F4F8FC]">
                  Continuous Spatial Journey
                </h3>
                <p className="text-xs sm:text-sm text-[#B7C5D6] leading-relaxed">
                  MindCare NER links family onboarding, senior tablet docking, dialect voice cues, daily cognitive games, and longitudinal neurologist telemetry into one connected loop.
                </p>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handleStepSelect(1)}
                    className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Start Step-by-Step Walkthrough</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* =========================================================================
          ACCESSIBLE 5-CARD GRID (PRESERVES EXACT IA, NUMBERING & DESCRIPTIONS)
          ========================================================================= */}
      <div className="space-y-4 pt-4 border-t border-[#243A50]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-[#F4F8FC] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#19C3B1]" />
            <span>The Five Steps at a Glance</span>
          </h3>
          <span className="text-xs font-bold text-[#7F91A6]">
            Touch any card to jump camera
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {HOW_IT_WORKS_STEPS.map((step) => {
            const isSelected = activeStepId === step.id;
            return (
              <div
                key={step.id}
                onClick={() => handleStepSelect(step.id)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-[#14283D] border-[#19C3B1] shadow-lg shadow-[#19C3B1]/20 scale-[1.02]'
                    : 'bg-[#101F31] border-[#243A50] hover:border-[#19C3B1]/50 hover:bg-[#14283D]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#19C3B1] text-[#07111F]'
                          : 'bg-[#14283D] text-[#38D9C5] border border-[#243A50]'
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <span className="text-[#38D9C5] opacity-80">
                      {getStepIcon(step.id)}
                    </span>
                  </div>

                  <h4 className="font-black text-base text-[#F4F8FC]">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#B7C5D6] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#243A50]/60 flex items-center justify-between text-[11px] font-bold text-[#38D9C5]">
                  <span>{isSelected ? 'Active Station' : 'Select Step'}</span>
                  <span>➔</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          JOURNEY COMPLETION BANNER: "Your MindCare journey continues."
          ========================================================================= */}
      <div className="bg-gradient-to-r from-[#14283D] via-[#102538] to-[#14283D] rounded-3xl border-2 border-[#19C3B1]/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 text-left z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#19C3B1]/20 text-[#38D9C5] text-xs font-black uppercase">
            <HeartHandshake className="w-3.5 h-3.5 text-[#19C3B1]" />
            <span>Lifelong Cognitive Dignity</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#F4F8FC]">
            Your MindCare journey continues.
          </h3>
          <p className="text-xs sm:text-sm text-[#B7C5D6]">
            Whether you are a senior in Assam, a caring daughter in Bengaluru, or a clinician at GMCH, experience how MindCare transforms daily memory care.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => {
              sound.playClick();
              onSelectRole('PATIENT');
            }}
            className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] font-black text-sm shadow-lg shadow-[#19C3B1]/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Senior Tablet Demo</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectRole('CAREGIVER');
            }}
            className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#14283D] hover:bg-[#162B40] text-[#F4F8FC] font-black text-sm border border-[#243A50] hover:border-[#19C3B1] flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Users className="w-4 h-4 text-[#38D9C5]" />
            <span>Caregiver Portal</span>
          </button>
        </div>
      </div>
    </section>
  );
};
