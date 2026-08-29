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
} from 'lucide-react';
import { SupportedLanguage, PatientProfile } from '../../types';
import { getTranslation } from '../../services/i18n';
import { voice } from '../../services/voice';
import { sound } from '../../services/sound';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  currentLang: SupportedLanguage;
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
    text: 'What is today’s date and time?',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    timeDisplay: '4h ago',
  },
  {
    id: 'cmd_init_5',
    text: 'Call my daughter Priyanka',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    timeDisplay: '6h ago',
  },
];

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  patient,
  currentLang,
  onPlayGame,
  onLoggedWater,
  onCallCaregiver,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [modelBadge, setModelBadge] = useState('Gemini 2.5 Flash');
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
      // Greet patient when opened
      const initialGreeting =
        currentLang === 'as'
          ? `নমস্কাৰ ধীৰেন-দা! মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?`
          : currentLang === 'bn'
          ? `নমস্কার ধীরেনবাবু! আমি আপনাকে কীভাবে সাহায্য করতে পারি?`
          : currentLang === 'hi'
          ? `नमस्ते धीरेन जी! मैं आपकी क्या सहायता कर सकता हूँ?`
          : `Hello Dhiren-da! I am MindCare. How can I help you today?`;

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
      // Filter duplicate of same text if it was immediately recent
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

  if (!isOpen) return null;

  const handleStartListening = () => {
    sound.playClick();
    setIsListening(true);
    setTranscript('');
    voice.stopSpeaking();

    voice.listen(
      currentLang,
      (text) => {
        setIsListening(false);
        setTranscript(text);
        addRecentCommand(text);
        processUserVoice(text);
      },
      () => {
        setIsListening(false);
        const errMsg = 'I could not hear clearly. Please tap one of the friendly buttons below or try speaking again.';
        setReply(errMsg);
        voice.speak(errMsg, currentLang);
      },
      () => {
        setIsListening(true);
      },
    );
  };

  const processUserVoice = async (userText: string) => {
    setIsThinking(true);
    sound.playClick();

    // Check local intents first for immediate actions
    const localIntent = voice.parseLocalIntent(userText, currentLang);

    if (localIntent.intent === 'PLAY_GAME') {
      setReply(localIntent.replyText);
      voice.speak(localIntent.replyText, currentLang, () => {
        onPlayGame();
        onClose();
      });
      setIsThinking(false);
      return;
    }

    if (localIntent.intent === 'DRINK_WATER') {
      setReply(localIntent.replyText);
      onLoggedWater();
      voice.speak(localIntent.replyText, currentLang);
      setIsThinking(false);
      return;
    }

    if (localIntent.intent === 'CALL_CAREGIVER') {
      setReply(localIntent.replyText);
      voice.speak(localIntent.replyText, currentLang, () => {
        onCallCaregiver();
      });
      setIsThinking(false);
      return;
    }

    // Call server-side Gemini for conversational assistant
    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          language: currentLang,
          patientName: patient.name,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantReply = data.data?.reply || localIntent.replyText;
        setReply(assistantReply);
        setModelBadge(data.data?.model || 'Gemini 2.5 Flash');
        voice.speak(assistantReply, currentLang);
      } else {
        setReply(localIntent.replyText);
        voice.speak(localIntent.replyText, currentLang);
      }
    } catch {
      setReply(localIntent.replyText);
      voice.speak(localIntent.replyText, currentLang);
    } finally {
      setIsThinking(false);
    }
  };

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
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="voice-assistant-dialog"
        className="bg-[#faf8ff] w-full max-w-xl rounded-3xl shadow-2xl border-4 border-[#006767] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-[#006767] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t.voiceAssistant}</h2>
              <span className="text-xs text-teal-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                AI Voice Companion • {modelBadge}
              </span>
            </div>
          </div>

          <button
            id="close-voice-modal-btn"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center text-center space-y-6">
          {/* Visual Voice Pulse Microphone Button */}
          <div className="relative my-2">
            {isListening && (
              <>
                <div className="absolute -inset-4 rounded-full bg-teal-300/40 animate-ping"></div>
                <div className="absolute -inset-8 rounded-full bg-teal-200/30 animate-pulse"></div>
              </>
            )}

            <button
              id="voice-mic-main-btn"
              onClick={handleStartListening}
              className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-transform active:scale-95 ${
                isListening
                  ? 'bg-gradient-to-tr from-red-600 to-rose-500 ring-8 ring-red-200 animate-pulse'
                  : 'bg-gradient-to-tr from-[#006767] to-[#208181] hover:brightness-110 ring-8 ring-teal-100'
              }`}
            >
              {isListening ? (
                <>
                  <Mic className="w-12 h-12" />
                  <span className="text-[11px] font-bold mt-1">Listening...</span>
                </>
              ) : (
                <>
                  <Mic className="w-12 h-12" />
                  <span className="text-[11px] font-bold mt-1">Tap to Speak</span>
                </>
              )}
            </button>
          </div>

          {/* Spoken Transcript / Status */}
          <div className="w-full bg-white rounded-2xl p-5 border border-[#dae1ff] shadow-xs text-left">
            {transcript && (
              <div className="mb-3 pb-3 border-b border-gray-100 flex items-start gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase">You said:</span>
                <p className="text-base font-semibold text-[#001849]">"{transcript}"</p>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#e2e7ff] text-[#002b74] flex items-center justify-center shrink-0 mt-0.5">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#006767] uppercase block mb-1">
                  MindCare Voice Reply:
                </span>
                <p className="text-lg font-medium text-[#001849] leading-relaxed">
                  {isThinking ? 'Thinking gently...' : reply}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Commands List (Last 5 interactions) */}
          <div id="recent-commands-container" className="w-full text-left bg-[#f2f4fc] p-4 rounded-2xl border border-[#dae1ff]">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#006767]" />
                <span className="text-xs font-bold text-[#001849] uppercase tracking-wider">
                  Recent Commands
                </span>
              </div>
              <div className="flex items-center gap-2">
                {recentCommands.length > 0 ? (
                  <>
                    <span className="text-[11px] font-semibold text-[#455f88] bg-white px-2 py-0.5 rounded-full border border-[#dae1ff]">
                      Last {recentCommands.length} recognized
                    </span>
                    <button
                      id="clear-recent-commands-btn"
                      onClick={handleClearHistory}
                      className="text-[11px] font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-2xs"
                      title="Clear your voice command history"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear History</span>
                    </button>
                  </>
                ) : (
                  <span className="text-[11px] font-semibold text-[#455f88] bg-white px-2 py-0.5 rounded-full border border-[#dae1ff]">
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
                    className="w-full min-h-[44px] px-3.5 py-2 bg-white hover:bg-[#eaedff] text-[#001849] border border-[#dae1ff] hover:border-[#006767] rounded-xl text-left font-medium text-xs sm:text-sm transition-all flex items-center justify-between gap-3 shadow-2xs group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-[#e2e7ff] text-[#006767] group-hover:bg-[#006767] group-hover:text-white text-[10px] font-extrabold flex items-center justify-center shrink-0 transition-colors">
                        {idx + 1}
                      </span>
                      <span className="truncate text-[#001849] group-hover:text-[#006767] font-semibold">
                        "{cmd.text}"
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-[#455f88] group-hover:text-[#006767]">
                      <span className="text-[10px] font-medium hidden xs:inline">{cmd.timeDisplay}</span>
                      <RotateCcw className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                    </div>
                  </button>
                ))
              ) : (
                <div
                  id="recent-commands-empty-state"
                  className="py-3 px-3.5 text-center text-xs font-semibold text-[#455f88] bg-white/80 rounded-xl border border-dashed border-[#dae1ff]"
                >
                  Voice command history cleared. Your next spoken questions will appear here.
                </div>
              )}
            </div>
          </div>

          {/* Quick Regional Prompt Chips for Elderly Users */}
          <div className="w-full text-left">
            <label className="text-xs font-bold text-[#455f88] uppercase tracking-wider block mb-2">
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
                    className="p-3 bg-white hover:bg-[#eaedff] text-[#001849] border-2 border-[#dae1ff] hover:border-[#006767] rounded-xl text-left font-semibold text-sm transition-all flex items-center gap-2.5 shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#e2e7ff] text-[#006767] flex items-center justify-center shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="line-clamp-1">{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#eaedff] px-6 py-3 border-t border-[#dae1ff] flex items-center justify-between text-xs text-[#3e4948]">
          <span>Speak in English, Assamese, Bengali, Manipuri, Mizo, Khasi, or Hindi.</span>
          <button
            onClick={() => {
              if (reply) voice.speak(reply, currentLang);
            }}
            className="flex items-center gap-1 text-[#006767] font-bold hover:underline"
          >
            <Volume2 className="w-3.5 h-3.5" />
            Repeat Voice
          </button>
        </div>
      </div>
    </div>
  );
};

