import React, { useState } from 'react';
import {
  Search,
  Bell,
  Globe,
  Sliders,
  Mic,
  ChevronDown,
  User,
  Shield,
  Wifi,
  WifiOff,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { SupportedLanguage, UserRole } from '../../types';
import { LANGUAGE_METADATA } from '../../services/i18n';
import { sound } from '../../services/sound';

interface DashboardHeaderProps {
  pageTitle: string;
  currentRole: UserRole;
  userName: string;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenVoiceAssistant: () => void;
  onOpenGeminiAssistant?: (mode?: 'CHAT' | 'LIVE') => void;
  onOpenAccessibility: () => void;
  onLogout: () => void;
  isOffline: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  pageTitle,
  currentRole,
  userName,
  currentLang,
  onLanguageChange,
  onOpenVoiceAssistant,
  onOpenGeminiAssistant,
  onOpenAccessibility,
  onLogout,
  isOffline,
}) => {
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 bg-[#07111F]/95 backdrop-blur-md border-b border-[#243A50] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* LEFT: Page Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#F4F8FC] tracking-tight leading-none">
            {pageTitle}
          </h1>
          <span className="text-[11px] font-bold text-[#7F91A6] hidden sm:inline">
            MindCare NER Connected Workspace
          </span>
        </div>
      </div>

      {/* CENTER: Quick Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#7F91A6]" />
          <input
            type="text"
            placeholder="Search activities, memories, routines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#101F31] border border-[#243A50] focus:border-[#19C3B1] rounded-xl pl-10 pr-12 py-2 text-xs text-[#F4F8FC] placeholder-[#7F91A6] focus:outline-none transition-all"
          />
          <span className="absolute right-3 top-2.5 px-1.5 py-0.5 bg-[#14283D] border border-[#243A50] rounded text-[10px] font-mono text-[#7F91A6]">
            ⌘K
          </span>
        </div>
      </div>

      {/* RIGHT: Actions, Voice Assistant, Language, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Offline Edge Status Indicator */}
        <div
          className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 ${
            isOffline
              ? 'bg-amber-950/60 border-amber-800 text-[#F4B740]'
              : 'bg-emerald-950/60 border-emerald-800 text-[#35D07F]'
          }`}
          title={isOffline ? 'Offline Edge Mode Active' : 'Connected to MindCare Cloud'}
        >
          {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          <span className="hidden xl:inline">{isOffline ? 'Edge Offline' : 'Live Sync'}</span>
        </div>

        {/* Gemini AI Multimodal Assistant Trigger */}
        {onOpenGeminiAssistant && (
          <button
            onClick={() => {
              sound.playClick();
              onOpenGeminiAssistant('CHAT');
            }}
            className="px-3 py-2 rounded-xl bg-[#102B26] hover:bg-[#153832] text-[#38D9C5] border border-[#19C3B1]/40 hover:border-[#19C3B1] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            title="Open MindCare Gemini Multimodal Assistant"
          >
            <Sparkles className="w-4 h-4 text-[#38D9C5] animate-pulse" />
            <span className="hidden sm:inline text-xs font-black">Gemini AI</span>
          </button>
        )}

        {/* Voice Assistant Microphone Trigger */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenVoiceAssistant();
          }}
          className="p-2.5 rounded-xl bg-[#14283D] hover:bg-[#162B40] text-[#38D9C5] border border-[#243A50] hover:border-[#19C3B1] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          title="Open AI Voice Assistant"
        >
          <Mic className="w-4 h-4 text-[#38D9C5] animate-pulse" />
          <span className="hidden lg:inline text-xs font-black">Voice AI</span>
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold text-[#B7C5D6] bg-[#101F31] border border-[#243A50] hover:text-[#F4F8FC] transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#38D9C5]" />
            <span className="hidden sm:inline">{LANGUAGE_METADATA[currentLang]?.nativeName || 'EN'}</span>
            <ChevronDown className="w-3 h-3 text-[#7F91A6]" />
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#101F31] border border-[#243A50] rounded-2xl shadow-2xl p-2 z-50 space-y-1">
              {Object.entries(LANGUAGE_METADATA).map(([code, meta]) => (
                <button
                  key={code}
                  onClick={() => {
                    sound.playClick();
                    onLanguageChange(code as SupportedLanguage);
                    setLangOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    currentLang === code
                      ? 'bg-[#19C3B1] text-[#07111F]'
                      : 'text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC]'
                  }`}
                >
                  <span>{meta.nativeName}</span>
                  <span className="text-[10px] opacity-70">({meta.label})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Accessibility Drawer Toggle */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenAccessibility();
          }}
          className="p-2 rounded-xl text-[#B7C5D6] hover:text-[#F4F8FC] bg-[#101F31] border border-[#243A50] transition-all cursor-pointer"
          title="Accessibility & Contrast"
        >
          <Sliders className="w-4 h-4 text-[#5BA7FF]" />
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#101F31] border border-[#243A50] hover:border-[#19C3B1] transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#19C3B1] text-[#07111F] font-black text-xs flex items-center justify-center">
              {userName ? userName[0].toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-extrabold text-[#F4F8FC] hidden md:inline truncate max-w-[100px]">
              {userName}
            </span>
            <ChevronDown className="w-3 h-3 text-[#7F91A6]" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#101F31] border border-[#243A50] rounded-2xl shadow-2xl p-3 z-50 space-y-3 text-left">
              <div className="border-b border-[#243A50] pb-2">
                <p className="text-xs font-black text-[#F4F8FC]">{userName}</p>
                <p className="text-[10px] text-[#38D9C5] font-bold uppercase">{currentRole} Active</p>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenAccessibility();
                    setProfileOpen(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#B7C5D6] hover:text-[#F4F8FC] hover:bg-[#14283D] text-left flex items-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#5BA7FF]" />
                  <span>Accessibility</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    onLogout();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-950/40 text-left flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit to Public Site</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
