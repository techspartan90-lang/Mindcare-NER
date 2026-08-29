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
      className="bg-white border-b border-[#dae1ff] sticky top-0 z-40 shadow-xs"
    >
      {/* Top Banner with Role Switcher & System Controls */}
      <div className="bg-[#eaedff] px-4 py-2 text-xs border-b border-[#dae1ff] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#001849] uppercase tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006767]"></span>
            MindCare NER Production Platform
          </span>
          <span className="text-[#3e4948] hidden sm:inline">|</span>
          <span className="text-[#3e4948] font-medium hidden md:inline">
            Elderly Dementia Cognitive Assistance Platform (North East Region)
          </span>
        </div>

        {/* Role Selector Pill Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#dae1ff]">
          <span className="text-[11px] font-semibold text-[#455f88] px-2 hidden lg:inline">
            Active View:
          </span>
          <button
            id="role-btn-awareness"
            onClick={() => {
              sound.playClick();
              onRoleChange('AWARENESS');
            }}
            className={`px-2.5 py-1 rounded-md font-bold text-xs transition-colors flex items-center gap-1.5 ${
              currentRole === 'AWARENESS'
                ? 'bg-gradient-to-r from-[#004d4d] to-[#006767] text-white shadow-xs ring-2 ring-teal-500/30'
                : 'text-[#004d4d] bg-teal-50/70 hover:bg-teal-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Awareness & Journey</span>
          </button>

          <button
            id="role-btn-patient"
            onClick={() => {
              sound.playClick();
              onRoleChange('PATIENT');
            }}
            className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors flex items-center gap-1.5 ${
              currentRole === 'PATIENT'
                ? 'bg-[#006767] text-white shadow-xs'
                : 'text-[#001849] hover:bg-[#f2f3ff]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Patient (Dhiren, 72)</span>
          </button>

          <button
            id="role-btn-caregiver"
            onClick={() => {
              sound.playClick();
              onRoleChange('CAREGIVER');
            }}
            className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors flex items-center gap-1.5 ${
              currentRole === 'CAREGIVER'
                ? 'bg-[#455f88] text-white shadow-xs'
                : 'text-[#001849] hover:bg-[#f2f3ff]'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Caregiver (Priyanka)</span>
          </button>

          <button
            id="role-btn-doctor"
            onClick={() => {
              sound.playClick();
              onRoleChange('HEALTHCARE_WORKER');
            }}
            className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors flex items-center gap-1.5 ${
              currentRole === 'HEALTHCARE_WORKER'
                ? 'bg-[#059669] text-white shadow-xs'
                : 'text-[#001849] hover:bg-[#f2f3ff]'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinician (Dr. Ananya)</span>
          </button>

          <button
            id="role-btn-admin"
            onClick={() => {
              sound.playClick();
              onRoleChange('ADMIN');
            }}
            className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors flex items-center gap-1.5 ${
              currentRole === 'ADMIN'
                ? 'bg-[#8a4c27] text-white shadow-xs'
                : 'text-[#001849] hover:bg-[#f2f3ff]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin & Architecture</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#006767] to-[#208181] text-white flex items-center justify-center shadow-sm">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#001849] tracking-tight">
                {t.appName}
              </h1>
              <span className="bg-[#b6d0ff] text-[#002b74] text-[11px] font-bold px-2 py-0.5 rounded-full">
                NER Edition
              </span>
            </div>
            <p className="text-xs font-medium text-[#455f88] hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls: Language, Font Scale, Sound, Offline Simulator */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 text-[#455f88] absolute left-2.5 pointer-events-none" />
            <select
              id="language-selector"
              value={currentLang}
              onChange={(e) => {
                sound.playClick();
                onLanguageChange(e.target.value as SupportedLanguage);
              }}
              className="pl-8 pr-7 py-2 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#001849] text-sm font-semibold rounded-xl border border-[#dae1ff] focus:outline-none focus:ring-2 focus:ring-[#006767] cursor-pointer appearance-none"
            >
              {(Object.keys(LANGUAGE_METADATA) as SupportedLanguage[]).map((langKey) => (
                <option key={langKey} value={langKey}>
                  {LANGUAGE_METADATA[langKey].nativeName} ({LANGUAGE_METADATA[langKey].label})
                </option>
              ))}
            </select>
          </div>

          {/* Accessibility Font Size Scaler */}
          <div className="hidden sm:flex items-center bg-[#f2f3ff] rounded-xl p-1 border border-[#dae1ff]">
            <button
              id="font-size-normal"
              title="Standard Text Size"
              onClick={() => {
                sound.playClick();
                onFontSizeChange('normal');
              }}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                fontSize === 'normal'
                  ? 'bg-[#006767] text-white shadow-xs'
                  : 'text-[#455f88] hover:bg-[#eaedff]'
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
              className={`w-7 h-7 rounded-lg text-sm font-bold transition-all ${
                fontSize === 'large'
                  ? 'bg-[#006767] text-white shadow-xs'
                  : 'text-[#455f88] hover:bg-[#eaedff]'
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
              className={`w-7 h-7 rounded-lg text-base font-bold transition-all ${
                fontSize === 'extra-large'
                  ? 'bg-[#006767] text-white shadow-xs'
                  : 'text-[#455f88] hover:bg-[#eaedff]'
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
            className={`p-2.5 rounded-xl border transition-all ${
              !isMuted
                ? 'bg-[#f2f3ff] border-[#dae1ff] text-[#006767] hover:bg-[#eaedff]'
                : 'bg-[#ffdad6] border-[#ffb4ab] text-[#ba1a1a]'
            }`}
          >
            {!isMuted ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
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
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                !isOffline
                  ? 'bg-[#f0fdf4] border-[#86efac] text-[#15803d] hover:bg-[#dcfce7]'
                  : 'bg-[#fff7ed] border-[#fed7aa] text-[#c2410c] hover:bg-[#ffedd5]'
              }`}
            >
              {!isOffline ? (
                <>
                  <Wifi className="w-4 h-4 text-[#15803d]" />
                  <span className="hidden md:inline">Online Sync</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-[#c2410c]" />
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
              className={`p-2 rounded-xl border transition-all relative ${
                isOffline
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-[#f2f3ff] border-[#dae1ff] text-[#455f88] hover:text-[#006767]'
              }`}
            >
              <RefreshCw
                className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#006767]' : ''}`}
              />
              {pendingSyncCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#ea580c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
              className="px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">Demo Sandbox</span>
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
              className="p-2.5 bg-[#f2f4fc] hover:bg-[#eaedff] text-[#001849] border border-[#dae1ff] rounded-xl flex items-center justify-center transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-[#006767]" />
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
              className="p-2.5 bg-teal-50 hover:bg-teal-100 text-[#006767] border border-teal-200 rounded-xl flex items-center justify-center transition-all cursor-pointer"
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
              className="p-2.5 bg-[#f2f4fc] hover:bg-[#eaedff] text-[#001849] border border-[#dae1ff] rounded-xl flex items-center justify-center transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4 text-[#006767]" />
            </button>
          )}

          {/* Architecture & Inspector Modal Trigger */}
          <button
            id="open-architecture-btn"
            onClick={() => {
              sound.playClick();
              onOpenArchitecture();
            }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-[#208181] hover:bg-[#006767] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Arch & Flow</span>
          </button>
        </div>
      </div>

      {/* Primary Platform Navigation Strip (Home, Features, AI, Caregivers, Clinicians, Cultural, FAQ, Contact) */}
      <div className="bg-[#fbfcff] border-t border-[#dae1ff] px-4 sm:px-6 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <nav className="flex items-center gap-1 sm:gap-2">
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
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#455f88] hover:text-[#001849] hover:bg-white transition-all whitespace-nowrap cursor-pointer"
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
                    ? 'bg-teal-50 text-[#006767] border-teal-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{is3DMode ? '3D Active' : '2D Mode'}</span>
              </button>
            )}

            <button
              onClick={() => {
                sound.playClick();
                onRoleChange('HEALTHCARE_WORKER');
              }}
              className="px-3 py-1 rounded-lg text-xs font-black bg-[#7c3aed] text-white hover:bg-[#6d28d9] shadow-2xs transition-all cursor-pointer whitespace-nowrap"
            >
              Clinician Portal
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
