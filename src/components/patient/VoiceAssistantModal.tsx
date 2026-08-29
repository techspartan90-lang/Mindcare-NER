import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  Heart,
  Pill,
  Droplet,
  PhoneCall,
  Brain,
  MessageSquare,
  History,
  Clock,
  RotateCcw,
  Trash2,
  Globe,
} from 'lucide-react';
import { SupportedLanguage, PatientProfile } from '../../types';
import { getTranslation, LANGUAGE_METADATA } from '../../services/i18n';
import { voice } from '../../services/voice';
import { sound } from '../../services/sound';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  currentLang: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onPlayGame: () => void;
  onLoggedWater: () => void;
  onCallCaregiver: () => void;
}

interface RecentVoiceCommand {
  id: string;
  text: string;
  timestamp: string;
  timeDisplay: string;
}

const DEFAULT_RECENT_COMMANDS: RecentVoiceCommand[] = [
  {
    id: 'cmd_init_1',
    text: 'Did I take my medicine today?',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    timeDisplay: '15m ago',
  },
  {
    id: 'cmd_init_2',
    text: 'I drank a glass of water',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    timeDisplay: '45m ago',
  },
  {
    id: 'cmd_init_3',
    text: 'Start my memory game',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    timeDisplay: '2h ago',
  },
  {
    id: 'cmd_init_4',
    text: 'Call my caregiver Priyanka',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    timeDisplay: '5h ago',
  },
];

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  patient,
  currentLang,
  onLanguageChange,
  onPlayGame,
  onLoggedWater,
  onCallCaregiver,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [modelBadge, setModelBadge] = useState('Edge Voice Synthesizer');
  const [recentCommands, setRecentCommands] = useState<RecentVoiceCommand[]>(() => {
    try {
      const saved = localStorage.getItem('mindcare_recent_voice_commands');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 5);
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_RECENT_COMMANDS;
  });
  const t = getTranslation(currentLang);

  useEffect(() => {
    if (isOpen) {
      const initialGreeting =
        currentLang === 'as'
          ? `নমস্কাৰ ধীৰেন-দা! মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?`
          : currentLang === 'bn'
          ? `নমস্কার ধীরেনবাবু! আমি আপনাকে কীভাবে সাহায্য করতে পারি?`
          : currentLang === 'hi'
          ? `नमस्ते धीरेन जी! मैं आपकी क्या सहायता कर सकता हूँ?`
          : `Hello Dhiren! I am MindCare. How can I help you today?`;

      setReply(initialGreeting);
      voice.speak(initialGreeting, currentLang);
    } else {
      voice.stopSpeaking();
      setIsListening(false);
    }
  }, [isOpen, currentLang]);

  const addRecentCommand = (cmdText: string) => {
    if (!cmdText || !cmdText.trim()) return;
    const cleanText = cmdText.trim();
    const newEntry: RecentVoiceCommand = {
      id: `cmd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: cleanText,
      timestamp: new Date().toISOString(),
      timeDisplay: 'Just now',
    };

    setRecentCommands((prev) => {
      const filtered = prev.filter((item) => item.text.toLowerCase() !== cleanText.toLowerCase());
      const updated = [newEntry, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('mindcare_recent_voice_commands', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleStartListening = () => {
    if (isListening) {
      voice.stopSpeaking();
      setIsListening(false);
      return;
    }

    sound.playClick();
    setTranscript('');
    setReply('Listening gently to your voice...');
    setIsListening(true);

    voice.listen(
      currentLang,
      (text) => {
        setIsListening(false);
        setTranscript(text);
        addRecentCommand(text);
        processUserVoice(text);
      },
      (err) => {
        setIsListening(false);
        setReply(err);
      },
      () => {
        setIsListening(true);
      }
    );
  };

  const processUserVoice = async (userText: string) => {
    setIsThinking(true);

    const localIntent = voice.matchIntentOffline(userText, currentLang);

    try {
      const res = await fetch('/api/voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: userText,
          language: currentLang,
          patientContext: {
            name: patient.name,
            medicationTaken: false,
            waterIntake: 3,
            location: patient.location,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsThinking(false);

        if (data.reply) {
          setReply(data.reply);
          voice.speak(data.reply, currentLang);
        } else {
          setReply(localIntent.replyText);
          voice.speak(localIntent.replyText, currentLang);
        }
      } else {
        setIsThinking(false);
        setReply(localIntent.replyText);
        voice.speak(localIntent.replyText, currentLang);
      }
    } catch {
      setIsThinking(false);
      setReply(localIntent.replyText);
      voice.speak(localIntent.replyText, currentLang);
    }

    if (localIntent.intent === 'PLAY_GAME') {
      setTimeout(() => {
        onClose();
        onPlayGame();
      }, 1800);
    } else if (localIntent.intent === 'DRINK_WATER') {
      onLoggedWater();
    } else if (localIntent.intent === 'CALL_CAREGIVER') {
      setTimeout(() => {
        onClose();
        onCallCaregiver();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  const quickPrompts = [
    {
      label: currentLang === 'as' ? 'দৰবৰ সময় হ’লনে?' : currentLang === 'bn' ? 'ওষুধ খাবার সময় হয়েছে?' : 'Did I take my medicine?',
      icon: Pill,
      text: 'Did I take my medicine today?',
    },
    {
      label: currentLang === 'as' ? 'খেল আৰম্ভ কৰা' : currentLang === 'bn' ? 'স্মৃতি খেলা শুরু করুন' : 'Start a brain game',
      icon: Brain,
      text: 'Start my memory game',
    },
    {
      label: currentLang === 'as' ? 'মই পানী খালো' : currentLang === 'bn' ? 'এক গ্লাস জল খেলাম' : 'I drank a glass of water',
      icon: Droplet,
      text: 'I drank a glass of water',
    },
    {
      label: currentLang === 'as' ? 'প্ৰিয়ংকাক ফোন কৰা' : currentLang === 'bn' ? 'প্রিয়ঙ্কাকে কল করুন' : 'Call my daughter Priyanka',
      icon: PhoneCall,
      text: 'Call my caregiver Priyanka',
    },
  ];

  const handleSelectRecentCommand = (cmdText: string) => {
    sound.playClick();
    setTranscript(cmdText);
    addRecentCommand(cmdText);
    processUserVoice(cmdText);
  };

  const handleClearHistory = () => {
    sound.playClick();
    setRecentCommands([]);
    try {
      localStorage.setItem('mindcare_recent_voice_commands', '[]');
    } catch {
      // ignore
    }
  };

  return (
    <div
      id="voice-assistant-overlay"
      className="fixed inset-0 z-50 bg-[#07111F]/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="voice-assistant-dialog"
        className="bg-[#101F31] w-full max-w-xl rounded-3xl shadow-2xl border border-[#243A50] overflow-hidden flex flex-col max-h-[90vh] text-[#F4F8FC]"
      >
        <div className="bg-[#14283D] px-6 py-4 border-b border-[#243A50] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#101F31] border border-[#243A50] flex items-center justify-center text-[#38D9C5]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#F4F8FC]">{t.voiceAssistant}</h2>
              <span className="text-xs text-[#38D9C5] flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F]"></span>
                AI Voice Companion • {LANGUAGE_METADATA[currentLang]?.label || 'English'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onLanguageChange && (
              <div className="relative flex items-center">
                <Globe className="w-3.5 h-3.5 text-[#38D9C5] absolute left-2.5 pointer-events-none" />
                <select
                  value={currentLang}
                  onChange={(e) => {
                    sound.playClick();
                    onLanguageChange(e.target.value as SupportedLanguage);
                  }}
                  className="pl-7 pr-6 py-1.5 bg-[#101F31] text-[#F4F8FC] text-xs font-bold rounded-xl border border-[#243A50] focus:outline-none focus:border-[#19C3B1] cursor-pointer appearance-none"
                >
                  {(Object.keys(LANGUAGE_METADATA) as SupportedLanguage[]).map((k) => (
                    <option key={k} value={k} className="bg-[#101F31] text-[#F4F8FC]">
                      {LANGUAGE_METADATA[k].label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              id="close-voice-modal-btn"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-[#101F31] hover:bg-[#162B40] border border-[#243A50] text-[#B7C5D6] hover:text-[#F4F8FC] flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative my-2">
            {isListening && (
              <>
                <div className="absolute -inset-4 rounded-full bg-[#19C3B1]/40 animate-ping"></div>
                <div className="absolute -inset-8 rounded-full bg-[#38D9C5]/20 animate-pulse"></div>
              </>
            )}

            <button
              id="voice-mic-main-btn"
              onClick={handleStartListening}
              className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center text-[#07111F] shadow-2xl transition-transform active:scale-95 cursor-pointer ${
                isListening
                  ? 'bg-gradient-to-tr from-[#FF5C6C] to-rose-400 ring-8 ring-red-950/60 animate-pulse text-white'
                  : 'bg-gradient-to-tr from-[#19C3B1] to-[#38D9C5] hover:brightness-110 ring-8 ring-[#14283D]'
              }`}
            >
              {isListening ? (
                <>
                  <Mic className="w-10 h-10" />
                  <span className="text-[11px] font-black mt-1">Listening...</span>
                </>
              ) : (
                <>
                  <Mic className="w-10 h-10" />
                  <span className="text-[11px] font-black mt-1">Tap to Speak</span>
                </>
              )}
            </button>
          </div>

          <div className="w-full bg-[#14283D] rounded-2xl p-5 border border-[#243A50] shadow-md text-left">
            {transcript && (
              <div className="mb-3 pb-3 border-b border-[#243A50] flex items-start gap-2">
                <span className="text-xs font-bold text-[#7F91A6] uppercase">You said:</span>
                <p className="text-base font-bold text-[#F4F8FC]">"{transcript}"</p>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#101F31] border border-[#243A50] text-[#38D9C5] flex items-center justify-center shrink-0 mt-0.5">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#38D9C5] uppercase block mb-1">
                  MindCare Voice Reply ({LANGUAGE_METADATA[currentLang]?.label || 'English'}):
                </span>
                <p className="text-base font-medium text-[#F4F8FC] leading-relaxed">
                  {isThinking ? 'Thinking gently...' : reply}
                </p>
              </div>
            </div>
          </div>

          <div id="recent-commands-container" className="w-full text-left bg-[#14283D] p-4 rounded-2xl border border-[#243A50]">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#38D9C5]" />
                <span className="text-xs font-bold text-[#F4F8FC] uppercase tracking-wider">
                  Recent Commands
                </span>
              </div>
              <div className="flex items-center gap-2">
                {recentCommands.length > 0 ? (
                  <>
                    <span className="text-[11px] font-bold text-[#B7C5D6] bg-[#101F31] px-2 py-0.5 rounded-full border border-[#243A50]">
                      Last {recentCommands.length} recognized
                    </span>
                    <button
                      id="clear-recent-commands-btn"
                      onClick={handleClearHistory}
                      className="text-[11px] font-bold text-[#FF5C6C] hover:text-red-400 bg-[#101F31] px-2.5 py-1 rounded-lg border border-[#243A50] flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                      title="Clear your voice command history"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </>
                ) : (
                  <span className="text-[11px] font-semibold text-[#7F91A6] bg-[#101F31] px-2 py-0.5 rounded-full border border-[#243A50]">
                    History cleared
                  </span>
                )}
              </div>
            </div>

            <div id="recent-commands-list" className="space-y-1.5">
              {recentCommands.length > 0 ? (
                recentCommands.map((cmd, idx) => (
                  <button
                    key={cmd.id || idx}
                    id={`recent-command-item-${idx}`}
                    onClick={() => handleSelectRecentCommand(cmd.text)}
                    className="w-full min-h-[40px] px-3.5 py-2 bg-[#101F31] hover:bg-[#162B40] text-[#F4F8FC] border border-[#243A50] hover:border-[#19C3B1] rounded-xl text-left font-medium text-xs sm:text-sm transition-all flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-[#14283D] text-[#38D9C5] group-hover:bg-[#19C3B1] group-hover:text-[#07111F] text-[10px] font-extrabold flex items-center justify-center shrink-0 transition-colors">
                        {idx + 1}
                      </span>
                      <span className="truncate text-[#B7C5D6] group-hover:text-[#F4F8FC] font-semibold">
                        "{cmd.text}"
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-[#7F91A6] group-hover:text-[#38D9C5]">
                      <span className="text-[10px] font-medium hidden xs:inline">{cmd.timeDisplay}</span>
                      <RotateCcw className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                    </div>
                  </button>
                ))
              ) : (
                <div
                  id="recent-commands-empty-state"
                  className="py-3 px-3.5 text-center text-xs font-semibold text-[#7F91A6] bg-[#101F31] rounded-xl border border-dashed border-[#243A50]"
                >
                  Voice command history cleared.
                </div>
              )}
            </div>
          </div>

          <div className="w-full text-left">
            <label className="text-xs font-bold text-[#7F91A6] uppercase tracking-wider block mb-2">
              Or tap a quick question:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quickPrompts.map((chip, idx) => {
                const IconComponent = chip.icon;
                return (
                  <button
                    key={idx}
                    id={`quick-prompt-${idx}`}
                    onClick={() => {
                      setTranscript(chip.label);
                      addRecentCommand(chip.text);
                      processUserVoice(chip.text);
                    }}
                    className="p-3 bg-[#14283D] hover:bg-[#162B40] text-[#F4F8FC] border border-[#243A50] hover:border-[#19C3B1] rounded-xl text-left font-bold text-xs sm:text-sm transition-all flex items-center gap-2.5 shadow-xs cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#101F31] border border-[#243A50] text-[#38D9C5] flex items-center justify-center shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="line-clamp-1">{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-[#14283D] px-6 py-3 border-t border-[#243A50] flex items-center justify-between text-xs text-[#B7C5D6]">
          <span>Default: English. Switch anytime to native dialects.</span>
          <button
            onClick={() => {
              if (reply) voice.speak(reply, currentLang);
            }}
            className="flex items-center gap-1 text-[#19C3B1] hover:text-[#38D9C5] font-black cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            Repeat Voice
          </button>
        </div>
      </div>
    </div>
  );
};

