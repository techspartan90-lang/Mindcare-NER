import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Mic,
  MicOff,
  Send,
  Sparkles,
  MapPin,
  Search,
  Radio,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  ExternalLink,
  Bot,
  User,
  Zap,
  Brain,
  Layers,
  ChevronDown,
  Navigation,
  Compass,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Loader2,
  Info,
} from 'lucide-react';
import {
  geminiClient,
  ChatMessage,
  GeminiChatModel,
  GeminiToolMode,
  GroundingPlace,
  GroundingWebSource,
  LiveVoiceSession,
} from '../../services/geminiClient';
import { PatientProfile, SupportedLanguage } from '../../types';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';

interface MindCareGeminiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: PatientProfile;
  currentLang?: SupportedLanguage;
  initialMode?: 'CHAT' | 'LIVE';
  rolePerspective?: 'PATIENT' | 'CAREGIVER' | 'CLINICIAN';
  onNavigateSection?: (sectionId: string) => void;
}

const NORTH_EAST_CITIES = [
  { name: 'Guwahati, Assam', lat: 26.1445, lng: 91.7362 },
  { name: 'Shillong, Meghalaya', lat: 25.5788, lng: 91.8933 },
  { name: 'Dibrugarh, Assam', lat: 27.4728, lng: 94.912 },
  { name: 'Imphal, Manipur', lat: 24.817, lng: 93.9368 },
  { name: 'Agartala, Tripura', lat: 23.8315, lng: 91.2868 },
  { name: 'Aizawl, Mizoram', lat: 23.7271, lng: 92.7176 },
  { name: 'Kohima, Nagaland', lat: 25.6751, lng: 94.1086 },
  { name: 'Silchar, Assam', lat: 24.8333, lng: 92.7789 },
  { name: 'Jorhat, Assam', lat: 26.7509, lng: 94.2037 },
];

export const MindCareGeminiAssistantModal: React.FC<MindCareGeminiAssistantModalProps> = ({
  isOpen,
  onClose,
  patient,
  currentLang = 'en',
  initialMode = 'CHAT',
  rolePerspective = 'PATIENT',
  onNavigateSection,
}) => {
  // Navigation / View Tabs: 'CHAT' | 'LIVE'
  const [activeTab, setActiveTab] = useState<'CHAT' | 'LIVE'>(initialMode);

  // Model Selection state:
  // - gemini-3.1-pro-preview (Complex tasks)
  // - gemini-3.5-flash (General tasks & Grounding)
  // - gemini-3.1-flash-lite (Fast tasks)
  const [selectedModel, setSelectedModel] = useState<GeminiChatModel>('gemini-3.5-flash');

  // Tool Mode: 'none' | 'search' (Search Grounding) | 'maps' (Maps Grounding)
  const [toolMode, setToolMode] = useState<GeminiToolMode>('none');

  // Location for Maps Grounding
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [useDeviceLocation, setUseDeviceLocation] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  // Multi-turn Chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content:
        `Namaskar! I am your MindCare NER AI Assistant, powered by Google Gemini. ` +
        `I am here to assist with daily memory routines, cognitive exercises, finding geriatric medical centers in North East India, ` +
        `and answering eldercare questions in English, Assamese, Bengali, or Hindi. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Audio Transcription state (gemini-3.5-transcribe)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);

  // Live Voice API state (gemini-3.1-flash-live-preview)
  const [liveState, setLiveState] = useState<'IDLE' | 'CONNECTING' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'CLOSED' | 'ERROR'>('IDLE');
  const [liveVolume, setLiveVolume] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState<Array<{ speaker: 'user' | 'model'; text: string }>>([]);
  const [liveError, setLiveError] = useState<string | null>(null);
  const liveSessionRef = useRef<LiveVoiceSession | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'CHAT') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending, activeTab]);

  // Request device location if toggled
  useEffect(() => {
    if (useDeviceLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoordinates({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn('Geolocation declined or unavailable:', err);
          setUseDeviceLocation(false);
        },
      );
    } else {
      const city = NORTH_EAST_CITIES[selectedCityIndex];
      setUserCoordinates({ latitude: city.lat, longitude: city.lng });
    }
  }, [useDeviceLocation, selectedCityIndex]);

  // Cleanup on unmount or close
  useEffect(() => {
    if (!isOpen) {
      stopRecording();
      stopLiveSession();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // Multi-Turn Chat Handlers
  // -------------------------------------------------------------
  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputText).trim();
    if (!text || isSending) return;

    sound.playClick();
    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsSending(true);

    try {
      const response = await geminiClient.sendChat({
        messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
        model: selectedModel,
        toolMode,
        userLocation: toolMode === 'maps' && userCoordinates ? userCoordinates : undefined,
        language: currentLang,
        patientContext: {
          name: patient?.name || 'Dhiren Borah',
          dementiaStage: patient?.dementiaStage || 'Mild Cognitive Impairment',
          location: patient?.location || 'Guwahati, Assam',
          caregiverName: patient?.caregiverName || 'Priyanka Borah',
        },
        rolePerspective,
      });

      const assistantMessage: ChatMessage = {
        id: `msg_asst_${Date.now()}`,
        role: 'assistant',
        content: response.data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: response.data.modelUsed,
        toolUsed: response.data.toolUsed,
        groundingChunks: response.data.groundingChunks,
        searchQueries: response.data.searchQueries,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content:
          `I apologize, but I encountered an issue: ${err?.message || 'Please check connection'}. ` +
          `You can also verify your GEMINI_API_KEY in Settings > Secrets to ensure active access.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  // -------------------------------------------------------------
  // Audio Transcription Handlers (gemini-3.5-transcribe)
  // -------------------------------------------------------------
  const startRecording = async () => {
    sound.playClick();
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleTranscribeBlob(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      recordTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone access is required for audio transcription. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
        recordTimerRef.current = null;
      }
    }
  };

  const handleTranscribeBlob = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const result = await geminiClient.transcribeAudio(blob);
      if (result.text) {
        setInputText((prev) => (prev ? `${prev} ${result.text}` : result.text));
      }
    } catch (err: any) {
      console.error('Transcription error:', err);
      alert(`Transcription error: ${err?.message || 'Could not transcribe'}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  // -------------------------------------------------------------
  // Live Voice Conversation Handlers (gemini-3.1-flash-live-preview)
  // -------------------------------------------------------------
  const startLiveSession = async () => {
    sound.playClick();
    setLiveError(null);
    setLiveTranscript([]);

    const session = new LiveVoiceSession({
      onStateChange: (st) => setLiveState(st),
      onVolumeChange: (vol) => setLiveVolume(vol),
      onTranscriptChunk: (text, speaker) => {
        setLiveTranscript((prev) => [...prev, { speaker, text }]);
      },
      onError: (msg) => {
        setLiveError(msg);
      },
    });

    liveSessionRef.current = session;
    await session.start();
  };

  const stopLiveSession = () => {
    if (liveSessionRef.current) {
      liveSessionRef.current.stop();
      liveSessionRef.current = null;
    }
    setLiveState('IDLE');
  };

  // Quick Preset Queries
  const quickPrompts = [
    {
      label: '📍 Find Nearby Memory Clinics',
      action: () => {
        setToolMode('maps');
        setSelectedModel('gemini-3.5-flash');
        handleSendMessage('Find geriatric memory clinics and dementia neurology hospitals near me in North East India.');
      },
    },
    {
      label: '🔍 Search Latest NE Dementia Care News',
      action: () => {
        setToolMode('search');
        setSelectedModel('gemini-3.5-flash');
        handleSendMessage('What are the latest Alzheimer and dementia healthcare updates or senior care initiatives in North East India?');
      },
    },
    {
      label: '🧠 Clinical Assessment Guide',
      action: () => {
        setToolMode('none');
        setSelectedModel('gemini-3.1-pro-preview');
        handleSendMessage('Explain a structured clinical care plan for a senior in Guwahati with Mild Cognitive Impairment.');
      },
    },
    {
      label: '⚡ Quick Medication Reassurance',
      action: () => {
        setToolMode('none');
        setSelectedModel('gemini-3.1-flash-lite');
        handleSendMessage('Did I take my morning medicine today? Give me a warm, quick 2-sentence reassurance.');
      },
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#040810]/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gemini-assistant-title"
    >
      <div className="relative w-full max-w-4xl h-[90vh] max-h-[820px] bg-[#07111F] border border-[#243A50] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* HEADER BAR */}
        <div className="px-5 py-3.5 bg-[#0C1827] border-b border-[#243A50] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#19C3B1]/20 to-[#38D9C5]/10 border border-[#19C3B1]/40 flex items-center justify-center text-[#19C3B1] shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="gemini-assistant-title" className="text-base sm:text-lg font-black text-[#F4F8FC] tracking-tight">
                  MindCare <span className="text-[#38D9C5]">Gemini Assistant</span>
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#14283D] text-[#38D9C5] border border-[#19C3B1]/30">
                  NER Multimodal
                </span>
              </div>
              <p className="text-xs text-[#7F91A6]">
                Multi-Turn Chat • Maps & Search Grounding • Speech Transcribe • Live Voice
              </p>
            </div>
          </div>

          {/* MODE TABS (CHAT vs LIVE VOICE) */}
          <div className="flex items-center gap-2">
            <div className="bg-[#101F31] p-1 rounded-xl border border-[#243A50] flex items-center">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('CHAT');
                  stopLiveSession();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'CHAT'
                    ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                    : 'text-[#B7C5D6] hover:text-[#F4F8FC]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('LIVE');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'LIVE'
                    ? 'bg-[#38D9C5] text-[#07111F] shadow-xs font-black'
                    : 'text-[#B7C5D6] hover:text-[#F4F8FC]'
                }`}
              >
                <Radio className="w-3.5 h-3.5 animate-pulse text-[#F4B740]" />
                <span>Live Voice (Live API)</span>
              </button>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-[#7F91A6] hover:text-[#F4F8FC] hover:bg-[#14283D] transition-all cursor-pointer"
              aria-label="Close Gemini Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SUB-HEADER / CONTROLS (Only in Chat Mode) */}
        {activeTab === 'CHAT' && (
          <div className="px-5 py-2.5 bg-[#0A1422] border-b border-[#243A50] flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Model Selector Bar */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#7F91A6] font-bold text-[11px] mr-1">Model:</span>
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedModel('gemini-3.1-flash-lite');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                  selectedModel === 'gemini-3.1-flash-lite'
                    ? 'bg-[#14283D] border-[#F4B740] text-[#F4B740]'
                    : 'border-[#243A50] text-[#7F91A6] hover:text-[#B7C5D6]'
                }`}
                title="Use gemini-3.1-flash-lite for tasks that should happen fast"
              >
                <Zap className="w-3 h-3" />
                <span>Fast (3.1 Lite)</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedModel('gemini-3.5-flash');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                  selectedModel === 'gemini-3.5-flash'
                    ? 'bg-[#14283D] border-[#19C3B1] text-[#38D9C5]'
                    : 'border-[#243A50] text-[#7F91A6] hover:text-[#B7C5D6]'
                }`}
                title="Use gemini-3.5-flash for general tasks, Search & Maps Grounding"
              >
                <Sparkles className="w-3 h-3" />
                <span>General (3.5 Flash)</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedModel('gemini-3.1-pro-preview');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                  selectedModel === 'gemini-3.1-pro-preview'
                    ? 'bg-[#14283D] border-[#818CF8] text-[#818CF8]'
                    : 'border-[#243A50] text-[#7F91A6] hover:text-[#B7C5D6]'
                }`}
                title="Use gemini-3.1-pro-preview for particularly complex tasks"
              >
                <Brain className="w-3 h-3" />
                <span>Complex (3.1 Pro)</span>
              </button>
            </div>

            {/* Grounding Mode Toggle (None / Google Search / Google Maps) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#7F91A6] font-bold text-[11px] mr-1">Grounding:</span>
              <button
                onClick={() => {
                  sound.playClick();
                  setToolMode(toolMode === 'maps' ? 'none' : 'maps');
                  if (toolMode !== 'maps') setSelectedModel('gemini-3.5-flash');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  toolMode === 'maps'
                    ? 'bg-[#102B26] border-[#19C3B1] text-[#38D9C5]'
                    : 'border-[#243A50] text-[#7F91A6] hover:text-[#B7C5D6]'
                }`}
                title="Use Google Maps Grounding with gemini-3.5-flash"
              >
                <MapPin className="w-3 h-3 text-[#19C3B1]" />
                <span>Google Maps</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setToolMode(toolMode === 'search' ? 'none' : 'search');
                  if (toolMode !== 'search') setSelectedModel('gemini-3.5-flash');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  toolMode === 'search'
                    ? 'bg-[#14243A] border-[#3B82F6] text-[#60A5FA]'
                    : 'border-[#243A50] text-[#7F91A6] hover:text-[#B7C5D6]'
                }`}
                title="Use Google Search Grounding with gemini-3.5-flash"
              >
                <Search className="w-3 h-3 text-[#3B82F6]" />
                <span>Google Search</span>
              </button>

              {/* City selector if Maps Grounding is on */}
              {toolMode === 'maps' && (
                <div className="flex items-center gap-1 bg-[#101F31] border border-[#243A50] rounded-lg px-2 py-0.5">
                  <Compass className="w-3 h-3 text-[#19C3B1]" />
                  <select
                    value={selectedCityIndex}
                    onChange={(e) => setSelectedCityIndex(Number(e.target.value))}
                    className="bg-transparent text-[11px] text-[#F4F8FC] focus:outline-none cursor-pointer"
                  >
                    {NORTH_EAST_CITIES.map((c, idx) => (
                      <option key={c.name} value={idx} className="bg-[#0C1827] text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MAIN BODY: EITHER MULTI-TURN CHAT OR LIVE VOICE */}
        {activeTab === 'CHAT' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                const mapsPlaces = msg.groundingChunks ? geminiClient.extractMapsPlaces(msg.groundingChunks) : [];
                const webSources = msg.groundingChunks ? geminiClient.extractWebSources(msg.groundingChunks) : [];

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    {/* Avatar Icon */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black ${
                        isUser
                          ? 'bg-[#19C3B1] text-[#07111F]'
                          : 'bg-[#14283D] border border-[#19C3B1]/40 text-[#38D9C5]'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Message Card */}
                    <div className="space-y-2">
                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-[#14283D] border border-[#19C3B1]/40 text-[#F4F8FC] rounded-tr-xs'
                            : 'bg-[#101F31] border border-[#243A50] text-[#F4F8FC] rounded-tl-xs'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>

                        {/* Audio Read-out Button for accessibility */}
                        {!isUser && (
                          <div className="mt-2.5 pt-2 border-t border-[#243A50]/60 flex items-center justify-between text-[10px] text-[#7F91A6]">
                            <button
                              onClick={() => voice.speak(msg.content, currentLang)}
                              className="flex items-center gap-1 hover:text-[#38D9C5] transition-colors cursor-pointer"
                              title="Listen to this reply"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Listen aloud</span>
                            </button>
                            {msg.modelUsed && (
                              <span className="font-mono bg-[#14283D] px-2 py-0.5 rounded text-[9px] text-[#38D9C5] border border-[#243A50]">
                                {msg.modelUsed}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Google Maps Place Cards */}
                      {mapsPlaces.length > 0 && (
                        <div className="p-3 bg-[#081820] border border-[#19C3B1]/30 rounded-xl space-y-2">
                          <div className="flex items-center gap-1.5 text-[11px] font-black text-[#38D9C5]">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Verified Google Maps Locations</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {mapsPlaces.map((place, pIdx) => (
                              <a
                                key={pIdx}
                                href={place.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 bg-[#0D222A] hover:bg-[#122D37] border border-[#19C3B1]/30 hover:border-[#19C3B1] rounded-lg text-xs transition-all flex items-start justify-between gap-2 group cursor-pointer"
                              >
                                <div>
                                  <span className="font-bold text-[#F4F8FC] group-hover:text-[#38D9C5] transition-colors block">
                                    {place.title}
                                  </span>
                                  {place.snippets && place.snippets.length > 0 && (
                                    <p className="text-[10px] text-[#7F91A6] line-clamp-2 mt-1">
                                      {place.snippets[0]}
                                    </p>
                                  )}
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-[#38D9C5] shrink-0 mt-0.5" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Google Search Web Citations */}
                      {webSources.length > 0 && (
                        <div className="p-2.5 bg-[#0C1A2E] border border-[#3B82F6]/30 rounded-xl space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#60A5FA]">
                            <Search className="w-3 h-3" />
                            <span>Google Search Grounding Sources</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {webSources.map((src, sIdx) => (
                              <a
                                key={sIdx}
                                href={src.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-[#14243A] hover:bg-[#1E3A5F] border border-[#3B82F6]/40 rounded-md text-[10px] text-[#B7C5D6] hover:text-[#F4F8FC] flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <span className="truncate max-w-[200px]">{src.title}</span>
                                <ExternalLink className="w-2.5 h-2.5 text-[#60A5FA]" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <span className="text-[10px] text-[#7F91A6] px-1 block">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isSending && (
                <div className="flex gap-3 mr-auto items-center text-xs text-[#7F91A6] bg-[#101F31] border border-[#243A50] px-4 py-2.5 rounded-2xl">
                  <Loader2 className="w-4 h-4 animate-spin text-[#19C3B1]" />
                  <span>
                    Thinking with <strong className="text-[#38D9C5]">{selectedModel}</strong>...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* QUICK PRESET PROMPTS */}
            <div className="px-4 py-2 bg-[#0A1422] border-t border-[#243A50] overflow-x-auto flex items-center gap-2 text-xs scrollbar-none">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#7F91A6] shrink-0">
                Quick Prompts:
              </span>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={p.action}
                  className="px-2.5 py-1 rounded-lg bg-[#101F31] hover:bg-[#14283D] border border-[#243A50] hover:border-[#19C3B1] text-[#B7C5D6] hover:text-[#F4F8FC] text-xs shrink-0 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* INPUT BAR WITH AUDIO TRANSCRIBE & SEND */}
            <div className="p-3 sm:p-4 bg-[#0C1827] border-t border-[#243A50]">
              {/* Recording / Transcribing Banner */}
              {isRecording && (
                <div className="mb-2 p-2 rounded-xl bg-red-950/60 border border-red-800 text-red-200 flex items-center justify-between text-xs animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span>Recording user speech... ({recordingSeconds}s)</span>
                  </div>
                  <button
                    onClick={stopRecording}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs cursor-pointer"
                  >
                    Done (Transcribe with gemini-3.5-transcribe)
                  </button>
                </div>
              )}

              {isTranscribing && (
                <div className="mb-2 p-2 rounded-xl bg-[#14283D] border border-[#19C3B1] text-[#38D9C5] flex items-center gap-2 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transcribing spoken audio via <strong>gemini-3.5-transcribe</strong>...</span>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Microphone / Transcribe Button */}
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                    isRecording
                      ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                      : 'bg-[#14283D] text-[#38D9C5] border-[#243A50] hover:border-[#19C3B1]'
                  }`}
                  title={isRecording ? 'Stop Recording' : 'Speak into Microphone (gemini-3.5-transcribe)'}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Input text box */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    toolMode === 'maps'
                      ? 'Ask about hospitals, clinics, or centers (Google Maps Grounded)...'
                      : toolMode === 'search'
                      ? 'Ask with latest Google Search data...'
                      : 'Ask about routines, memory games, medicines, or medical advice...'
                  }
                  className="flex-1 bg-[#101F31] border border-[#243A50] focus:border-[#19C3B1] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#F4F8FC] placeholder-[#7F91A6] focus:outline-none transition-all"
                />

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="px-4 sm:px-5 py-3 rounded-2xl bg-[#19C3B1] hover:bg-[#38D9C5] disabled:opacity-50 disabled:cursor-not-allowed text-[#07111F] font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-md shadow-[#19C3B1]/20"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* LIVE VOICE INTERACTION TAB (gemini-3.1-flash-live-preview) */
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 space-y-6 text-center overflow-y-auto">
            <div className="max-w-md space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#102B26] text-[#38D9C5] border border-[#19C3B1]/30">
                Gemini Live API
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#F4F8FC]">
                Real-Time Spoken Conversation
              </h3>
              <p className="text-xs sm:text-sm text-[#7F91A6]">
                Powered by <strong className="text-[#38D9C5]">gemini-3.1-flash-live-preview</strong>.
                Speak naturally with your microphone. Live API responds with low-latency spoken audio and adapts to interruptions.
              </p>
            </div>

            {/* Visual Animated Voice Orb */}
            <div className="relative flex items-center justify-center my-4">
              {/* Outer Pulse Rings */}
              {liveState === 'LISTENING' && (
                <>
                  <div className="absolute w-44 h-44 rounded-full border-2 border-[#19C3B1]/30 animate-ping" />
                  <div className="absolute w-36 h-36 rounded-full border border-[#38D9C5]/40 animate-pulse" />
                </>
              )}
              {liveState === 'SPEAKING' && (
                <>
                  <div className="absolute w-44 h-44 rounded-full border-2 border-[#818CF8]/40 animate-ping" />
                  <div className="absolute w-36 h-36 rounded-full border border-[#818CF8]/50 animate-pulse" />
                </>
              )}

              {/* Core Orb */}
              <div
                className={`w-28 h-28 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                  liveState === 'SPEAKING'
                    ? 'bg-linear-to-tr from-[#6366F1] to-[#A855F7] shadow-[#6366F1]/50 scale-110'
                    : liveState === 'LISTENING'
                    ? 'bg-linear-to-tr from-[#0D9488] to-[#14B8A6] shadow-[#14B8A6]/50 scale-105'
                    : liveState === 'CONNECTING'
                    ? 'bg-linear-to-tr from-[#F59E0B] to-[#FBBF24] shadow-[#F59E0B]/40 animate-pulse'
                    : 'bg-linear-to-tr from-[#1E293B] to-[#334155] border border-[#475569]'
                }`}
                style={{
                  transform: liveState === 'LISTENING' ? `scale(${1 + liveVolume * 0.4})` : undefined,
                }}
              >
                {liveState === 'SPEAKING' ? (
                  <Volume2 className="w-12 h-12 text-white animate-bounce" />
                ) : liveState === 'LISTENING' ? (
                  <Mic className="w-12 h-12 text-white" />
                ) : liveState === 'CONNECTING' ? (
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                ) : (
                  <Radio className="w-10 h-10 text-[#94A3B8]" />
                )}
              </div>
            </div>

            {/* Current State Status */}
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#7F91A6]">
                Status
              </span>
              <div className="text-base font-bold text-[#F4F8FC]">
                {liveState === 'IDLE' && 'Ready to Start Conversation'}
                {liveState === 'CONNECTING' && 'Connecting to Gemini Live API WebSocket...'}
                {liveState === 'LISTENING' && 'Listening to you... (Speak freely)'}
                {liveState === 'SPEAKING' && 'Gemini is speaking... (You can interrupt anytime)'}
                {liveState === 'THINKING' && 'Processing cognitive response...'}
                {liveState === 'ERROR' && 'Connection error or key required'}
                {liveState === 'CLOSED' && 'Voice call ended'}
              </div>
              {liveError && (
                <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-200 max-w-md mx-auto">
                  {liveError}
                </div>
              )}
            </div>

            {/* Live Call Control Action Button */}
            <div className="flex items-center gap-3">
              {liveState === 'IDLE' || liveState === 'CLOSED' || liveState === 'ERROR' ? (
                <button
                  onClick={startLiveSession}
                  className="px-8 py-4 rounded-2xl bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] font-black text-sm transition-all shadow-lg shadow-[#19C3B1]/25 flex items-center gap-2.5 cursor-pointer"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>Start Live Voice Conversation</span>
                </button>
              ) : (
                <button
                  onClick={stopLiveSession}
                  className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm transition-all shadow-lg shadow-red-600/30 flex items-center gap-2.5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                  <span>End Voice Conversation</span>
                </button>
              )}
            </div>

            {/* Realtime Live Transcript Feed */}
            {liveTranscript.length > 0 && (
              <div className="w-full max-w-lg bg-[#0C1827] border border-[#243A50] rounded-2xl p-4 text-left max-h-40 overflow-y-auto space-y-2">
                <span className="text-[10px] font-mono text-[#7F91A6] uppercase tracking-wider block">
                  Live Spoken Stream
                </span>
                {liveTranscript.map((t, i) => (
                  <div key={i} className="text-xs text-[#B7C5D6]">
                    <strong className="text-[#38D9C5]">
                      {t.speaker === 'user' ? 'You: ' : 'Gemini: '}
                    </strong>
                    {t.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
