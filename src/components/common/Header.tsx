import React, { useState } from 'react';
import {
  Brain,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  UserCheck,
  Globe,
  RefreshCw,
  Sparkles,
  Layers,
  HeartHandshake,
  Stethoscope,
  ShieldCheck,
  Sliders,
  Shield,
  Zap,
} from 'lucide-react';
import { SupportedLanguage, UserRole } from '../../types';
import { LANGUAGE_METADATA, getTranslation } from '../../services/i18n';
import { sound } from '../../services/sound';
import { offlineSync } from '../../services/offlineSync';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  pendingSyncCount: number;
  fontSize: 'normal' | 'large' | 'extra-large';
  onFontSizeChange: (size: 'normal' | 'large' | 'extra-large') => void;
  onOpenArchitecture: () => void;
  onOpenAccessibility?: () => void;
  onOpenPrivacy?: () => void;
  onOpenDemonstrationMode?: () => void;
  onOpenVoiceAssistant?: () => void;
  is3DMode?: boolean;
  onToggle3DMode?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  currentLang,
  onLanguageChange,
  isOffline,
  onToggleOffline,
  pendingSyncCount,
  fontSize,
  onFontSizeChange,
  onOpenArchitecture,
  onOpenAccessibility,
  onOpenPrivacy,
  onOpenDemonstrationMode,
  onOpenVoiceAssistant,
  is3DMode = true,
  onToggle3DMode,
  onNavigateSection,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isSyncing, setIsSyncing] = useState(false);
  const t = getTranslation(currentLang);

  const toggleSound = () => {
    const next = !isMuted;
    sound.setMuted(next);
    setIsMuted(next);
    if (!next) sound.playClick();
  };

  const handleManualSync = async () => {
    sound.playClick();
    setIsSyncing(true);
    await offlineSync.syncNow();
    setTimeout(() => {
      setIsSyncing(false);
      sound.playSuccess();
    }, 600);
  };

  const handleNavClick = (sectionId: string) => {
    sound.playClick();
    if (currentRole !== 'AWARENESS') {
      onRoleChange('AWARENESS');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-app-header"
      className="bg-[#0B1726]/95 backdrop-blur-md border-b border-[#243A50] sticky top-0 z-40 shadow-md text-[#F4F8FC]"
    >
      {/* Top Banner with Role Switcher & System Controls */}
      <div className="bg-[#07111F] px-4 py-2 text-xs border-b border-[#243A50] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#F4F8FC] uppercase tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#19C3B1] animate-pulse"></span>
            MindCare NER Platform
          </span>
          <span className="text-[#7F91A6] hidden sm:inline">|</span>
          <span className="text-[#B7C5D6] font-medium hidden md:inline">
            Elderly Cognitive Assistance Platform (North East Region)
          </span>
        </div>

        {/* Mode & Portal Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {currentRole !== 'AWARENESS' ? (
            /* Dashboard Active: Show Return to Landing Page CTA */
            <button
              id="return-to-landing-btn"
              onClick={() => {
                sound.playClick();
                onRoleChange('AWARENESS');
              }}
              className="px-3 py-1 bg-[#14283D] hover:bg-[#162B40] text-[#38D9C5] border border-[#243A50] hover:border-[#19C3B1] rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <span>← Back to Landing Page</span>
            </button>
          ) : (
            /* Landing Page Active: Show Direct Dashboard Launch CTA */
            <button
              id="launch-dashboard-top-btn"
              onClick={() => {
                sound.playClick();
                onRoleChange('PATIENT');
              }}
              className="px-3.5 py-1 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>🚀 Launch App Dashboard</span>
            </button>
          )}

          {/* Role Selector Pill Tabs */}
          <div className="flex items-center gap-1 bg-[#101F31] p-1 rounded-xl border border-[#243A50]">
            <span className="text-[11px] font-semibold text-[#7F91A6] px-2 hidden xl:inline">
              Portals:
            </span>
            <button
              id="role-btn-awareness"
              onClick={() => {
                sound.playClick();
                onRoleChange('AWARENESS');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'AWARENESS'
                  ? 'bg-gradient-to-r from-[#19C3B1] to-[#38D9C5] text-[#07111F] font-black shadow-xs'
                  : 'text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </button>

            <button
              id="role-btn-patient"
              onClick={() => {
                sound.playClick();
                onRoleChange('PATIENT');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'PATIENT'
                  ? 'bg-[#19C3B1] text-[#07111F] font-black shadow-xs'
                  : 'text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Patient Dashboard</span>
            </button>

            <button
              id="role-btn-caregiver"
              onClick={() => {
                sound.playClick();
                onRoleChange('CAREGIVER');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'CAREGIVER'
                  ? 'bg-[#5BA7FF] text-[#07111F] font-black shadow-xs'
                  : 'text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC]'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Caregiver Portal</span>
            </button>

            <button
              id="role-btn-doctor"
              onClick={() => {
                sound.playClick();
                onRoleChange('HEALTHCARE_WORKER');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'HEALTHCARE_WORKER'
                  ? 'bg-[#8B7CFF] text-[#07111F] font-black shadow-xs'
                  : 'text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC]'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Clinician Telemetry</span>
            </button>

            <button
              id="role-btn-admin"
              onClick={() => {
                sound.playClick();
                onRoleChange('ADMIN');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'ADMIN'
                  ? 'bg-[#F4B740] text-[#07111F] font-black shadow-xs'
                  : 'text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#19C3B1] to-[#0A8E80] text-[#07111F] flex items-center justify-center shadow-xs">
            <Brain className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#F4F8FC] tracking-tight">
                {t.appName}
              </h1>
              <span className="bg-[#14283D] border border-[#243A50] text-[#38D9C5] text-[10px] font-black px-2 py-0.5 rounded-full">
                NER Edition
              </span>
            </div>
            <p className="text-xs font-semibold text-[#B7C5D6] hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls: Language, Font Scale, Sound, Offline Simulator */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 text-[#38D9C5] absolute left-2.5 pointer-events-none" />
            <select
              id="language-selector"
              value={currentLang}
              onChange={(e) => {
                sound.playClick();
                onLanguageChange(e.target.value as SupportedLanguage);
              }}
              className="pl-8 pr-7 py-2 bg-[#101F31] hover:bg-[#14283D] text-[#F4F8FC] text-xs sm:text-sm font-bold rounded-xl border border-[#243A50] focus:outline-none focus:ring-2 focus:ring-[#19C3B1] cursor-pointer appearance-none"
            >
              {(Object.keys(LANGUAGE_METADATA) as SupportedLanguage[]).map((langKey) => (
                <option key={langKey} value={langKey} className="bg-[#101F31] text-[#F4F8FC]">
                  {LANGUAGE_METADATA[langKey].nativeName} ({LANGUAGE_METADATA[langKey].label})
                </option>
              ))}
            </select>
          </div>

          {/* Accessibility Font Size Scaler */}
          <div className="hidden sm:flex items-center bg-[#101F31] rounded-xl p-1 border border-[#243A50]">
            <button
              id="font-size-normal"
              title="Standard Text Size"
              onClick={() => {
                sound.playClick();
                onFontSizeChange('normal');
              }}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fontSize === 'normal'
                  ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                  : 'text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC]'
              }`}
            >
              A
            </button>
            <button
              id="font-size-large"
              title="Large Text for Elderly Reading"
              onClick={() => {
                sound.playClick();
                onFontSizeChange('large');
              }}
              className={`w-7 h-7 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                fontSize === 'large'
                  ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                  : 'text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC]'
              }`}
            >
              A+
            </button>
            <button
              id="font-size-extra-large"
              title="Extra Large High Legibility Text"
              onClick={() => {
                sound.playClick();
                onFontSizeChange('extra-large');
              }}
              className={`w-7 h-7 rounded-lg text-base font-bold transition-all cursor-pointer ${
                fontSize === 'extra-large'
                  ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                  : 'text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC]'
              }`}
            >
              A++
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            title={isMuted ? 'Unmute voice and gentle chimes' : 'Mute audio'}
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              !isMuted
                ? 'bg-[#101F31] border-[#243A50] text-[#38D9C5] hover:bg-[#14283D]'
                : 'bg-red-950/60 border-red-800/80 text-red-300'
            }`}
          >
            {!isMuted ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Network Simulator Badge with Sync Button */}
          <div className="flex items-center gap-1.5">
            <button
              id="network-simulator-toggle"
              onClick={() => {
                sound.playClick();
                onToggleOffline();
              }}
              title={
                isOffline
                  ? 'Currently simulating Offline Mode. Click to reconnect and sync queue.'
                  : 'Currently Online. Click to simulate Offline field conditions.'
              }
              className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                !isOffline
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-amber-950/60 border-amber-800 text-amber-300 hover:bg-amber-900/60'
              }`}
            >
              {!isOffline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">Online Sync</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Offline Mode</span>
                </>
              )}
            </button>

            {/* Sync Status / Trigger */}
            <button
              id="manual-sync-btn"
              onClick={handleManualSync}
              disabled={isOffline || isSyncing}
              title={
                isOffline
                  ? 'Reconnect network to sync'
                  : `${pendingSyncCount} pending records in local queue`
              }
              className={`p-2 rounded-xl border transition-all relative cursor-pointer ${
                isOffline
                  ? 'bg-gray-900 text-gray-600 border-gray-800 cursor-not-allowed'
                  : 'bg-[#101F31] border-[#243A50] text-[#B7C5D6] hover:text-[#19C3B1]'
              }`}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#19C3B1]' : ''}`}
              />
              {pendingSyncCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#F4B740] text-[#07111F] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {pendingSyncCount}
                </span>
              )}
            </button>
          </div>

          {/* Demonstration Mode Simulator Badge Button */}
          {onOpenDemonstrationMode && (
            <button
              id="open-demonstration-sandbox-btn"
              onClick={() => {
                sound.playClick();
                onOpenDemonstrationMode();
              }}
              title="Open Demonstration Mode Sandbox with 4 Patient Archetypes"
              className="px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-[#F4F8FC] text-xs font-black rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer border border-amber-500/40"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">Simulate</span>
            </button>
          )}

          {/* Accessibility Settings Drawer Trigger */}
          {onOpenAccessibility && (
            <button
              id="open-accessibility-drawer-btn"
              onClick={() => {
                sound.playClick();
                onOpenAccessibility();
              }}
              title="Accessibility Modes (Large Text, High Contrast, Voice First, Low Literacy)"
              className="p-2 bg-[#101F31] hover:bg-[#14283D] text-[#38D9C5] border border-[#243A50] rounded-xl flex items-center justify-center transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}

          {/* Voice Assistant Mic Trigger */}
          {onOpenVoiceAssistant && (
            <button
              id="header-voice-assistant-trigger"
              onClick={() => {
                sound.playClick();
                onOpenVoiceAssistant();
              }}
              title="Open Voice Assistant in Native Dialect"
              className="p-2 bg-teal-950/80 hover:bg-teal-900 text-[#38D9C5] border border-teal-700/60 rounded-xl flex items-center justify-center transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}

          {/* Privacy & Permissions Center */}
          {onOpenPrivacy && (
            <button
              id="open-privacy-center-btn"
              onClick={() => {
                sound.playClick();
                onOpenPrivacy();
              }}
              title="Privacy Center & Data Sovereignty"
              className="p-2 bg-[#101F31] hover:bg-[#14283D] text-[#5BA7FF] border border-[#243A50] rounded-xl flex items-center justify-center transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}

          {/* Architecture & Inspector Modal Trigger */}
          <button
            id="open-architecture-btn"
            onClick={() => {
              sound.playClick();
              onOpenArchitecture();
            }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-[#14283D] hover:bg-[#162B40] text-[#38D9C5] border border-[#243A50] text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </button>
        </div>
      </div>

      {/* Primary Platform Navigation Strip (Home, Features, AI, Caregivers, Clinicians, Cultural, FAQ, Contact) */}
      <div className="bg-[#0B1726] border-t border-[#243A50] px-4 sm:px-6 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <nav className="flex items-center gap-1 sm:gap-1.5">
            {[
              { id: 'section-hero', label: 'Home' },
              { id: 'section-problem', label: 'Problem' },
              { id: 'section-3d-hub', label: '3D Central Hub' },
              { id: 'section-features', label: 'Features' },
              { id: 'section-ai-intelligence', label: 'AI Intelligence' },
              { id: 'section-cognitive-activities', label: 'Cognitive Games' },
              { id: 'section-voice-language', label: 'Voice & Dialects' },
              { id: 'section-cultural-map', label: 'Cultural Map' },
              { id: 'section-caregiver', label: 'For Caregivers' },
              { id: 'section-clinician', label: 'For Clinicians' },
              { id: 'section-pricing', label: 'Pricing' },
              { id: 'section-faq', label: 'FAQ' },
              { id: 'section-contact', label: 'Contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#B7C5D6] hover:text-[#19C3B1] hover:bg-[#101F31] transition-all whitespace-nowrap cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Quick 3D Toggle & Clinician Login Action */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {onToggle3DMode && (
              <button
                onClick={() => {
                  sound.playClick();
                  onToggle3DMode();
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                  is3DMode
                    ? 'bg-teal-950/80 text-[#38D9C5] border-teal-700/60'
                    : 'bg-[#101F31] text-[#B7C5D6] border-[#243A50]'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{is3DMode ? '3D Active' : '2D Mode'}</span>
              </button>
            )}

            <button
              id="open-dashboard-taskbar-btn"
              onClick={() => {
                sound.playClick();
                onRoleChange('PATIENT');
              }}
              className="px-3.5 py-1 rounded-lg text-xs font-black bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center gap-1.5"
            >
              <Brain className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Open Dashboard</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onRoleChange('HEALTHCARE_WORKER');
              }}
              className="px-3 py-1 rounded-lg text-xs font-black bg-[#8B7CFF] text-[#07111F] hover:bg-[#7b6cee] shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              Clinician Portal
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
