import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Settings2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  PhoneCall,
  Brain,
  Clock,
  Heart,
  Music,
  BarChart3,
  Sliders,
  ChevronDown,
  Info,
} from 'lucide-react';
import { voice, VoiceState, VoiceSettings } from '../../services/voice';
import { sound } from '../../services/sound';
import { SupportedLanguage } from '../../types';

interface MindCareVoiceAssistantWidgetProps {
  currentLang: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onNavigateSection?: (sectionId: string) => void;
  onOpenGames?: () => void;
  onOpenRoutine?: () => void;
  onOpenFamily?: () => void;
  onOpenSounds?: () => void;
  onOpenProgress?: () => void;
  onOpenGeminiAssistant?: (mode?: 'CHAT' | 'LIVE') => void;
}

export const MindCareVoiceAssistantWidget: React.FC<MindCareVoiceAssistantWidgetProps> = ({
  currentLang,
  onLanguageChange,
  onNavigateSection,
  onOpenGames,
  onOpenRoutine,
  onOpenFamily,
  onOpenSounds,
  onOpenProgress,
  onOpenGeminiAssistant,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState(
    'Welcome to MindCare. You can explore your daily routine, play a cognitive activity, or connect with family.',
  );
  const [showSettings, setShowSettings] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(voice.getSettings());
  const [isListening, setIsListening] = useState(false);
  const [confirmationPrompt, setConfirmationPrompt] = useState<{
    text: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null>(null);

  // Canvas ref for 3D Orb shader / Canvas rendering
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubState = voice.subscribeState(setVoiceState);
    const unsubVol = voice.subscribeVolume(setVolumeLevel);
    return () => {
      unsubState();
      unsubVol();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Sync initial welcome
  useEffect(() => {
    if (isOpen) {
      voice.speak(assistantReply, currentLang);
    }
  }, [isOpen]);

  // 3D Visual Orb Canvas Rendering (IDLE, LISTENING, THINKING, SPEAKING, MUTED)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Base orb radius
      let radius = 24;
      let primaryColor = 'rgba(25, 195, 177, 0.9)'; // Teal
      let glowColor = 'rgba(56, 217, 197, 0.4)';

      if (voiceState === 'LISTENING') {
        radius = 26 + Math.sin(time * 6) * 4;
        primaryColor = 'rgba(91, 167, 255, 0.95)'; // Calming blue
        glowColor = 'rgba(91, 167, 255, 0.5)';

        // Expanding sound wave rings
        for (let i = 1; i <= 3; i++) {
          const ringRadius = (radius + (time * 30 + i * 20) % 36);
          const opacity = Math.max(0, 1 - ringRadius / 60);
          ctx.beginPath();
          ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(91, 167, 255, ${opacity * 0.6})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      } else if (voiceState === 'THINKING') {
        radius = 24;
        primaryColor = 'rgba(244, 183, 64, 0.95)'; // Amber
        glowColor = 'rgba(244, 183, 64, 0.4)';

        // Slow rotating light ring
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * 2);
        ctx.beginPath();
        ctx.arc(0, 0, radius + 8, 0, Math.PI * 1.3);
        ctx.strokeStyle = 'rgba(244, 183, 64, 0.8)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      } else if (voiceState === 'SPEAKING') {
        radius = 24 + volumeLevel * 8;
        primaryColor = 'rgba(53, 208, 127, 0.95)'; // Green vitality
        glowColor = 'rgba(53, 208, 127, 0.5)';

        // Waveform pulses around the perimeter
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.2) {
          const wave = Math.sin(a * 8 + time * 8) * (volumeLevel * 6);
          const r = radius + wave;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(53, 208, 127, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (voiceState === 'MUTED' || !voiceSettings.enabled) {
        radius = 22;
        primaryColor = 'rgba(127, 145, 166, 0.8)'; // Neutral slate
        glowColor = 'rgba(127, 145, 166, 0.2)';
      } else {
        // IDLE: gentle breathing
        radius = 24 + Math.sin(time * 2) * 2;
      }

      // Outer soft glow halo
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius * 1.8);
      grad.addColorStop(0, primaryColor);
      grad.addColorStop(0.6, glowColor);
      grad.addColorStop(1, 'rgba(7, 17, 31, 0)');

      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Inner 3D spherical core
      const innerGrad = ctx.createRadialGradient(
        cx - radius * 0.3,
        cy - radius * 0.3,
        2,
        cx,
        cy,
        radius,
      );
      innerGrad.addColorStop(0, '#FFFFFF');
      innerGrad.addColorStop(0.3, primaryColor);
      innerGrad.addColorStop(1, '#07111F');

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = innerGrad;
      ctx.fill();

      // Delicate specular highlight
      ctx.beginPath();
      ctx.arc(cx - radius * 0.35, cy - radius * 0.35, radius * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [voiceState, volumeLevel, voiceSettings.enabled]);

  // Voice Listening trigger
  const handleStartListening = () => {
    sound.playClick();
    setIsListening(true);
    setTranscript('Listening... Speak now...');

    voice.listen(
      currentLang,
      (text) => {
        setIsListening(false);
        setTranscript(`"${text}"`);
        handleProcessVoiceCommand(text);
      },
      (err) => {
        setIsListening(false);
        setTranscript(err);
        voice.speak("I couldn't hear that clearly. Please choose an option on screen.", currentLang);
      },
      () => {
        setIsListening(true);
      },
    );
  };

  const handleProcessVoiceCommand = (commandText: string) => {
    const result = voice.parseCommand(commandText, currentLang);
    setAssistantReply(result.replyText);

    if (result.requiresConfirmation) {
      setConfirmationPrompt({
        text: result.replyText,
        onConfirm: () => {
          setConfirmationPrompt(null);
          executeIntentAction(result.intent);
        },
        onCancel: () => {
          setConfirmationPrompt(null);
          voice.speak('Action cancelled. What would you like to do next?', currentLang);
        },
      });
      voice.speak(result.replyText, currentLang);
    } else {
      executeIntentAction(result.intent);
      voice.speak(result.replyText, currentLang);
    }
  };

  const executeIntentAction = (intent: string) => {
    switch (intent) {
      case 'PLAY_GAME':
        if (onOpenGames) onOpenGames();
        else if (onNavigateSection) onNavigateSection('section-cognitive-activities');
        break;
      case 'READ_ROUTINE':
      case 'CHECK_MEDICINE':
      case 'DRINK_WATER':
        if (onOpenRoutine) onOpenRoutine();
        else if (onNavigateSection) onNavigateSection('section-routine-3d');
        break;
      case 'CALL_CAREGIVER':
        if (onOpenFamily) onOpenFamily();
        else if (onNavigateSection) onNavigateSection('section-family-3d');
        break;
      case 'PEACEFUL_SOUNDS':
        if (onOpenSounds) onOpenSounds();
        else if (onNavigateSection) onNavigateSection('section-sounds-3d');
        break;
      case 'SHOW_PROGRESS':
        if (onOpenProgress) onOpenProgress();
        else if (onNavigateSection) onNavigateSection('section-progress-3d');
        break;
      case 'GO_HOME':
        if (onNavigateSection) onNavigateSection('section-hero');
        break;
      default:
        break;
    }
  };

  const handleQuickCommand = (label: string, intent: any, replyText: string) => {
    sound.playClick();
    setTranscript(`"${label}"`);
    setAssistantReply(replyText);
    voice.speak(replyText, currentLang, () => {
      executeIntentAction(intent);
    });
  };

  return (
    <>
      {/* Floating 3D Voice Orb in Bottom-Right Corner */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Helper speech bubble when closed */}
        {!isOpen && (
          <button
            onClick={() => {
              sound.playClick();
              setIsOpen(true);
            }}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#101F31]/90 backdrop-blur-md border border-[#243A50] hover:border-[#19C3B1] text-[#F4F8FC] text-xs font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-[#19C3B1] animate-ping" />
            <span>Talk to MindCare</span>
          </button>
        )}

        {/* 3D Voice Orb Button */}
        <button
          id="btn-voice-assistant-orb"
          onClick={() => {
            sound.playClick();
            setIsOpen((prev) => !prev);
          }}
          aria-label="MindCare Voice Assistant"
          className="relative w-16 h-16 rounded-full bg-[#101F31] border-2 border-[#243A50] hover:border-[#19C3B1] flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer overflow-hidden group"
        >
          <canvas
            ref={canvasRef}
            width={72}
            height={72}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
          <div className="relative z-10 text-[#F4F8FC] pointer-events-none">
            {voiceState === 'LISTENING' ? (
              <Mic className="w-6 h-6 text-[#5BA7FF] animate-pulse" />
            ) : voiceState === 'SPEAKING' ? (
              <Volume2 className="w-6 h-6 text-[#35D07F] animate-bounce" />
            ) : voiceState === 'THINKING' ? (
              <Sparkles className="w-6 h-6 text-[#F4B740] animate-spin" />
            ) : !voiceSettings.enabled ? (
              <VolumeX className="w-6 h-6 text-[#7F91A6]" />
            ) : (
              <Mic className="w-6 h-6 text-[#38D9C5]" />
            )}
          </div>
        </button>
      </div>

      {/* Expanded Senior-First Voice Assistant Drawer / Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#07111F]/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="voice-assistant-heading"
        >
          <div className="bg-[#101F31] border-t sm:border border-[#243A50] rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#F4F8FC]">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[#243A50] bg-[#14283D] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#101F31] border border-[#243A50] flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#19C3B1] animate-pulse" />
                </div>
                <div>
                  <h3 id="voice-assistant-heading" className="text-lg font-black text-[#F4F8FC]">
                    MindCare Voice Companion
                  </h3>
                  <p className="text-xs text-[#38D9C5] font-semibold">
                    Gentle, Indian English female cadence • Senior-Safe
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings((prev) => !prev)}
                  aria-label="Voice settings"
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    showSettings
                      ? 'bg-[#19C3B1] text-[#07111F] border-[#19C3B1]'
                      : 'bg-[#101F31] text-[#B7C5D6] border-[#243A50] hover:text-[#F4F8FC]'
                  }`}
                >
                  <Settings2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    voice.stopSpeaking();
                    setIsOpen(false);
                  }}
                  aria-label="Close voice companion"
                  className="p-2 rounded-xl bg-[#101F31] border border-[#243A50] text-[#B7C5D6] hover:text-[#F4F8FC] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {/* Settings Panel (Collapsible) */}
              {showSettings && (
                <div className="p-4 rounded-2xl bg-[#14283D] border border-[#243A50] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#F4F8FC]">Voice Settings</span>
                    <button
                      onClick={() => {
                        const updated = { ...voiceSettings, enabled: !voiceSettings.enabled };
                        setVoiceSettings(updated);
                        voice.updateSettings(updated);
                        if (!updated.enabled) voice.stopSpeaking();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                        voiceSettings.enabled
                          ? 'bg-[#19C3B1] text-[#07111F] border-[#19C3B1]'
                          : 'bg-[#101F31] text-[#7F91A6] border-[#243A50]'
                      }`}
                    >
                      {voiceSettings.enabled ? 'Voice Enabled' : 'Voice Muted'}
                    </button>
                  </div>

                  {/* Female Voice Preference */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#B7C5D6]">Female Voice Cadence (Calm Indian English)</span>
                    <button
                      onClick={() => {
                        const updated = {
                          ...voiceSettings,
                          preferFemaleVoice: !voiceSettings.preferFemaleVoice,
                        };
                        setVoiceSettings(updated);
                        voice.updateSettings(updated);
                        voice.speak('Voice profile updated. How does this sound?', currentLang);
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold border cursor-pointer ${
                        voiceSettings.preferFemaleVoice
                          ? 'bg-[#38D9C5] text-[#07111F] border-[#38D9C5]'
                          : 'bg-[#101F31] text-[#B7C5D6] border-[#243A50]'
                      }`}
                    >
                      {voiceSettings.preferFemaleVoice ? 'Active' : 'Default'}
                    </button>
                  </div>

                  {/* Speech Rate Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#B7C5D6]">
                      <span>Speaking Speed (Senior Pace)</span>
                      <span className="font-bold text-[#38D9C5]">
                        {voiceSettings.speechRate <= 0.75
                          ? 'Very Slow'
                          : voiceSettings.speechRate <= 0.9
                          ? 'Calm & Slow'
                          : 'Standard'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.65"
                      max="1.05"
                      step="0.05"
                      value={voiceSettings.speechRate}
                      onChange={(e) => {
                        const rate = parseFloat(e.target.value);
                        const updated = { ...voiceSettings, speechRate: rate };
                        setVoiceSettings(updated);
                        voice.updateSettings(updated);
                      }}
                      className="w-full accent-[#19C3B1] cursor-pointer"
                    />
                  </div>

                  {/* Replay / Test Voice Button */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      voice.repeatLast();
                    }}
                    className="w-full py-2 bg-[#101F31] border border-[#243A50] hover:border-[#19C3B1] rounded-xl text-xs font-bold text-[#38D9C5] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay Last Message</span>
                  </button>
                </div>
              )}

              {/* Central Voice Status Card */}
              <div className="p-6 rounded-3xl bg-[#14283D] border border-[#243A50] text-center space-y-4 shadow-inner relative overflow-hidden">
                {/* Assistant Speech Bubble */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#38D9C5] bg-[#101F31] px-3 py-1 rounded-full border border-[#243A50] inline-block">
                    MindCare Companion
                  </span>
                  <p className="text-base sm:text-lg font-bold text-[#F4F8FC] leading-relaxed">
                    "{assistantReply}"
                  </p>
                </div>

                {/* User Transcript */}
                {transcript && (
                  <div className="p-3 rounded-xl bg-[#101F31] border border-[#243A50] text-xs text-[#B7C5D6] italic">
                    You asked: {transcript}
                  </div>
                )}

                {/* Safety Confirmation Prompt for critical actions */}
                {confirmationPrompt && (
                  <div className="p-4 rounded-2xl bg-[#243A50] border-2 border-[#F4B740] space-y-3 animate-in fade-in">
                    <p className="text-sm font-black text-[#F4F8FC]">
                      {confirmationPrompt.text}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          sound.playClick();
                          confirmationPrompt.onConfirm();
                        }}
                        className="px-5 py-2.5 bg-[#35D07F] text-[#07111F] font-black rounded-xl text-xs cursor-pointer hover:bg-[#35D07F]/90"
                      >
                        Yes, Please
                      </button>
                      <button
                        onClick={() => {
                          sound.playClick();
                          confirmationPrompt.onCancel();
                        }}
                        className="px-5 py-2.5 bg-[#101F31] text-[#F4F8FC] border border-[#7F91A6] font-bold rounded-xl text-xs cursor-pointer"
                      >
                        No, Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Big Primary Push-to-Talk Button (64px Tactile Target) */}
                <div className="pt-2 flex flex-col items-center gap-2">
                  <button
                    onClick={handleStartListening}
                    disabled={isListening}
                    className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all cursor-pointer transform active:scale-95 ${
                      isListening
                        ? 'bg-[#5BA7FF] text-[#07111F] ring-8 ring-[#5BA7FF]/30 scale-105 animate-pulse'
                        : 'bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F]'
                    }`}
                  >
                    <Mic className="w-8 h-8" />
                    <span className="text-[11px] font-black uppercase tracking-wider mt-1">
                      {isListening ? 'Listening' : 'Tap to Speak'}
                    </span>
                  </button>
                  <p className="text-[11px] text-[#7F91A6]">
                    Say: “Play a memory game” or “Show my routine”
                  </p>
                </div>
              </div>

              {/* Gemini Multimodal Assistant Card */}
              {onOpenGeminiAssistant && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0B2524] to-[#101F31] border border-[#19C3B1]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#19C3B1]/20 text-[#38D9C5] flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#F4F8FC]">Gemini Multimodal AI Assistant</h4>
                        <p className="text-[10px] text-[#7F91A6]">Search Grounding • Maps • Live Voice</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#19C3B1] text-[#07111F]">
                      NEW
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsOpen(false);
                        onOpenGeminiAssistant('CHAT');
                      }}
                      className="px-3 py-2 rounded-xl bg-[#14283D] hover:bg-[#19C3B1] hover:text-[#07111F] text-[#38D9C5] border border-[#243A50] text-xs font-black transition-all cursor-pointer text-center"
                    >
                      💬 Multimodal Chat
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsOpen(false);
                        onOpenGeminiAssistant('LIVE');
                      }}
                      className="px-3 py-2 rounded-xl bg-[#14283D] hover:bg-[#5BA7FF] hover:text-[#07111F] text-[#5BA7FF] border border-[#243A50] text-xs font-black transition-all cursor-pointer text-center"
                    >
                      🎙️ Live Voice API
                    </button>
                  </div>
                </div>
              )}

              {/* Senior-Friendly Quick Action Chips (Large Tactile Buttons) */}
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#7F91A6]">
                  Or tap an option below:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      handleQuickCommand(
                        'Play brain memory game',
                        'PLAY_GAME',
                        'Opening your cognitive memory activity now. Have fun!',
                      )
                    }
                    className="p-4 rounded-2xl bg-[#14283D] border border-[#243A50] hover:border-[#19C3B1] text-left flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#101F31] text-[#38D9C5] border border-[#243A50] flex items-center justify-center text-xl shrink-0">
                      🎮
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-[#F4F8FC] group-hover:text-[#38D9C5]">
                        Play a Memory Game
                      </h4>
                      <p className="text-[11px] text-[#B7C5D6]">Calm cultural exercises</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7F91A6] group-hover:text-[#38D9C5]" />
                  </button>

                  <button
                    onClick={() =>
                      handleQuickCommand(
                        'Show today routine',
                        'READ_ROUTINE',
                        'Here is your daily routine for today: tea, walking, and medicine check.',
                      )
                    }
                    className="p-4 rounded-2xl bg-[#14283D] border border-[#243A50] hover:border-[#F4B740] text-left flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#101F31] text-[#F4B740] border border-[#243A50] flex items-center justify-center text-xl shrink-0">
                      🕐
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-[#F4F8FC] group-hover:text-[#F4B740]">
                        Show Today's Routine
                      </h4>
                      <p className="text-[11px] text-[#B7C5D6]">Medicine & hydration</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7F91A6] group-hover:text-[#F4B740]" />
                  </button>

                  <button
                    onClick={() =>
                      handleQuickCommand(
                        'Connect with family',
                        'CALL_CAREGIVER',
                        'Opening the family connect hub to reach Priyanka.',
                      )
                    }
                    className="p-4 rounded-2xl bg-[#14283D] border border-[#243A50] hover:border-[#35D07F] text-left flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#101F31] text-[#35D07F] border border-[#243A50] flex items-center justify-center text-xl shrink-0">
                      👨‍👩‍👧
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-[#F4F8FC] group-hover:text-[#35D07F]">
                        Contact Family
                      </h4>
                      <p className="text-[11px] text-[#B7C5D6]">Priyanka & family notes</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7F91A6] group-hover:text-[#35D07F]" />
                  </button>

                  <button
                    onClick={() =>
                      handleQuickCommand(
                        'Play peaceful sounds',
                        'PEACEFUL_SOUNDS',
                        'Playing calming Brahmaputra river and morning flute sounds.',
                      )
                    }
                    className="p-4 rounded-2xl bg-[#14283D] border border-[#243A50] hover:border-[#8B7CFF] text-left flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#101F31] text-[#8B7CFF] border border-[#243A50] flex items-center justify-center text-xl shrink-0">
                      🔊
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-[#F4F8FC] group-hover:text-[#8B7CFF]">
                        Play Peaceful Sounds
                      </h4>
                      <p className="text-[11px] text-[#B7C5D6]">River & gentle rain</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7F91A6] group-hover:text-[#8B7CFF]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="p-4 bg-[#14283D] border-t border-[#243A50] text-center text-xs text-[#7F91A6] flex items-center justify-center gap-2">
              <Info className="w-3.5 h-3.5 text-[#38D9C5]" />
              <span>
                MindCare Assistant is a supportive companion and does not replace medical advice.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
