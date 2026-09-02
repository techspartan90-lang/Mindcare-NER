import React, { useState, useEffect, Suspense, lazy } from 'react';
import { PublicMarketingHeader } from './components/navigation/PublicMarketingHeader';
import { AuthModal, AuthMode } from './components/auth/AuthModal';
import { VoiceAssistantModal } from './components/patient/VoiceAssistantModal';
import { ArchitectureModal } from './components/admin/ArchitectureModal';
import { AccessibilityDrawer } from './components/common/AccessibilityDrawer';
import { PrivacyCenterModal } from './components/common/PrivacyCenterModal';
import { DemonstrationModeModal } from './components/common/DemonstrationModeModal';
import { MindCareVoiceAssistantWidget } from './components/voice/MindCareVoiceAssistantWidget';
import {
  PatientProfile,
  SupportedLanguage,
  UserRole,
  AccessibilityMode,
  SimulationArchetype,
} from './types';
import { sound } from './services/sound';
import { voice } from './services/voice';
import { offlineSync } from './services/offlineSync';

export type ExperienceMode = 'PUBLIC_MARKETING' | 'AUTHENTICATED_APP';

import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { MindCareCompletePlatform } from './components/sections/MindCareCompletePlatform';

function ExperienceFallback() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      aria-busy="true"
      aria-label="Loading experience"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#19C3B1] border-t-transparent" />
    </div>
  );
}

export default function App() {
  // Experience State: Experience 01 (Marketing) vs Experience 02 (Authenticated Dashboard)
  const [experience, setExperience] = useState<ExperienceMode>('PUBLIC_MARKETING');
  const [currentRole, setCurrentRole] = useState<UserRole>('PATIENT');
  const [userName, setUserName] = useState<string>('Dhiren Borah');
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('large');
  const [accessibilityMode, setAccessibilityMode] = useState<AccessibilityMode>('STANDARD');
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Authentication Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<AuthMode>('LOGIN');

  // Global Modals State
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isAccessibilityDrawerOpen, setIsAccessibilityDrawerOpen] = useState(false);
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);
  const [isDemonstrationModeOpen, setIsDemonstrationModeOpen] = useState(false);

  // Patient Profile state
  const [patient, setPatient] = useState<PatientProfile>({
    id: 'p_dhiren_01',
    userId: 'user_dhiren',
    name: 'Dhiren Borah',
    age: 72,
    gender: 'male',
    location: 'Guwahati, Assam',
    primaryLanguage: 'en',
    dementiaStage: 'Mild Cognitive Impairment',
    caregiverName: 'Priyanka Borah',
    caregiverPhone: '+91 94350 12345',
    caregiverRelationship: 'Daughter',
    assignedDoctor: 'Dr. Ananya Sharma',
    doctorHospital: 'Gauhati Medical College & Hospital (GMCH)',
    lastActive: new Date().toISOString(),
    batteryLevel: 82,
    isDeviceOnline: true,
    lastSyncedAt: new Date().toISOString(),
    accessibilitySettings: {
      fontSize: 'large',
      highContrast: false,
      voicePrompts: true,
      reducedMotion: false,
    },
  });

  // Sync listener
  useEffect(() => {
    setPendingSyncCount(offlineSync.getPendingCount());
    const cleanup = offlineSync.subscribe(() => {
      setPendingSyncCount(offlineSync.getPendingCount());
    });
    return cleanup;
  }, []);

  // Fetch patient profile on mount
  useEffect(() => {
    fetch('/api/patients/p_dhiren_01')
      .then((r) => r.json())
      .then((res) => {
        if (res.data) {
          setPatient(res.data);
          if (res.data.primaryLanguage) {
            setCurrentLang(res.data.primaryLanguage as SupportedLanguage);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleOffline = () => {
    const next = !isOffline;
    setIsOffline(next);
    if (!next) {
      offlineSync.syncNow();
    }
  };

  const handleOpenAuth = (mode: AuthMode = 'LOGIN') => {
    sound.playClick();
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthenticate = (role: UserRole, userDisplayName: string) => {
    setCurrentRole(role);
    setUserName(userDisplayName);
    setExperience('AUTHENTICATED_APP');
  };

  const handleLogout = () => {
    sound.playClick();
    setExperience('PUBLIC_MARKETING');
  };

  const handleNavigateMarketingSection = (sectionId: string) => {
    sound.playClick();
    if (experience !== 'PUBLIC_MARKETING') {
      setExperience('PUBLIC_MARKETING');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Demonstration Mode Simulation Handler
  const handleApplyDemonstrationMode = (type: SimulationArchetype) => {
    switch (type) {
      case 'HIGH_ENGAGEMENT':
        setPatient((prev) => ({
          ...prev,
          name: 'Dhiren Borah (High Engagement)',
          dementiaStage: 'Early Stage',
          batteryLevel: 94,
        }));
        setIsOffline(false);
        voice.speak('Simulation applied: High Cognitive Engagement Profile with active streak.', currentLang);
        break;

      case 'MODERATE_ENGAGEMENT':
        setPatient((prev) => ({
          ...prev,
          name: 'Dhiren Borah (Moderate Baseline)',
          dementiaStage: 'Mild Cognitive Impairment',
          batteryLevel: 78,
        }));
        setIsOffline(false);
        voice.speak('Simulation applied: Moderate Steady Baseline Profile.', currentLang);
        break;

      case 'LOW_ENGAGEMENT':
        setPatient((prev) => ({
          ...prev,
          name: 'Dhiren Borah (Gentle High-Need)',
          dementiaStage: 'Supportive Monitoring',
          batteryLevel: 45,
        }));
        setAccessibilityMode('VOICE_FIRST');
        setIsOffline(false);
        voice.speak('Simulation applied: High-Need Profile. Voice-first guidance enabled.', currentLang);
        break;

      case 'OFFLINE_MODE':
        setPatient((prev) => ({
          ...prev,
          name: 'Dhiren Borah (Remote North-East)',
          location: 'Haflong, Dima Hasao, Assam',
          batteryLevel: 62,
        }));
        setIsOffline(true);
        offlineSync.saveLocalSession({
          id: `sess_sim_${Date.now()}`,
          patientId: patient.id,
          gameId: 'game_familiar_sounds',
          gameTitle: 'Familiar Sound Recognition',
          category: 'SOUND_RECOGNITION',
          difficulty: 'easy',
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          durationSeconds: 65,
          score: 95,
          accuracy: 95,
          attempts: 3,
          responseTimeMs: 1420,
          synced: false,
        });
        voice.speak('Simulation applied: Full Offline Edge Mode with 0% cellular connectivity.', currentLang);
        break;
    }
  };

  const isHighContrast = accessibilityMode === 'HIGH_CONTRAST';
  const isReducedMotion = accessibilityMode === 'REDUCED_MOTION';

  return (
    <div
      id="app-root-container"
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isHighContrast
          ? 'bg-black text-yellow-300 contrast-125'
          : 'bg-[#07111F] text-[#F4F8FC]'
      } ${
        fontSize === 'large' || accessibilityMode === 'LARGE_TEXT'
          ? 'text-base'
          : fontSize === 'extra-large'
          ? 'text-lg'
          : 'text-sm'
      } ${isReducedMotion ? 'motion-reduce' : ''}`}
    >
      {/* =========================================================================
          EXPERIENCE 01: PUBLIC MARKETING LANDING WEBSITE
          ========================================================================= */}
      {experience === 'PUBLIC_MARKETING' && (
        <>
          {/* Public Marketing Header Navigation */}
          <PublicMarketingHeader
            currentLang={currentLang}
            onLanguageChange={setCurrentLang}
            onOpenLogin={() => handleOpenAuth('LOGIN')}
            onOpenSignUp={() => handleOpenAuth('SIGNUP')}
            onOpenAccessibility={() => setIsAccessibilityDrawerOpen(true)}
            onNavigateSection={handleNavigateMarketingSection}
          />

          {/* Public Marketing Landing Body (Hero, Trust Bar, 3D Ecosystem, Features, Flow, Security, Footer) */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
            <Suspense fallback={<ExperienceFallback />}>
              <MindCareCompletePlatform
                onSelectRole={(role) => handleAuthenticate(role, patient.name)}
                onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
                onOpenArchitecture={() => setIsArchitectureOpen(true)}
                onOpenPrivacy={() => setIsPrivacyCenterOpen(true)}
                onOpenAccessibility={() => setIsAccessibilityDrawerOpen(true)}
                onOpenDemonstrationMode={() => setIsDemonstrationModeOpen(true)}
                currentLang={currentLang}
                onLanguageChange={setCurrentLang}
                isOffline={isOffline}
                onToggleOffline={handleToggleOffline}
                is3DMode={is3DMode}
                onToggle3DMode={() => setIs3DMode((prev) => !prev)}
              />
            </Suspense>
          </main>
        </>
      )}

      {/* =========================================================================
          EXPERIENCE 02: AUTHENTICATED APPLICATION / DASHBOARD
          ========================================================================= */}
      {experience === 'AUTHENTICATED_APP' && (
        <Suspense fallback={<ExperienceFallback />}>
          <DashboardLayout
            currentRole={currentRole}
            onRoleChange={(role) => setCurrentRole(role)}
            userName={userName}
            patient={patient}
            currentLang={currentLang}
            onLanguageChange={setCurrentLang}
            onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
            onOpenAccessibility={() => setIsAccessibilityDrawerOpen(true)}
            onLogout={handleLogout}
            isOffline={isOffline}
          />
        </Suspense>
      )}

      {/* Authentication Modal Flow */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticate={handleAuthenticate}
        initialMode={authInitialMode}
      />

      {/* Floating Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        patient={patient}
        currentLang={currentLang}
        onLanguageChange={(lang) => setCurrentLang(lang)}
        onPlayGame={() => {
          setIsVoiceAssistantOpen(false);
          setExperience('AUTHENTICATED_APP');
          setCurrentRole('PATIENT');
        }}
        onLoggedWater={() => {}}
        onCallCaregiver={() => {
          voice.speak(`Connecting to caregiver ${patient.caregiverName}`, currentLang);
        }}
      />

      {/* Technical Architecture Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Accessibility Settings Drawer */}
      <AccessibilityDrawer
        isOpen={isAccessibilityDrawerOpen}
        currentMode={accessibilityMode}
        onClose={() => setIsAccessibilityDrawerOpen(false)}
        onSelectMode={(mode) => setAccessibilityMode(mode)}
      />

      {/* Privacy Center Modal */}
      <PrivacyCenterModal
        isOpen={isPrivacyCenterOpen}
        onClose={() => setIsPrivacyCenterOpen(false)}
      />

      {/* Demonstration Simulation Sandbox Modal */}
      <DemonstrationModeModal
        isOpen={isDemonstrationModeOpen}
        onClose={() => setIsDemonstrationModeOpen(false)}
        onApplySimulation={handleApplyDemonstrationMode}
      />

      {/* Persistent Floating 3D Voice Assistant Widget */}
      <MindCareVoiceAssistantWidget
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onNavigateSection={handleNavigateMarketingSection}
        onOpenGames={() => {
          if (experience !== 'AUTHENTICATED_APP') {
            handleAuthenticate('PATIENT', patient.name);
          }
        }}
        onOpenRoutine={() => {
          if (experience === 'AUTHENTICATED_APP') {
            setCurrentRole('PATIENT');
          } else {
            handleNavigateMarketingSection('section-daily-routine');
          }
        }}
        onOpenFamily={() => {
          if (experience === 'AUTHENTICATED_APP') {
            setCurrentRole('CAREGIVER');
          } else {
            handleNavigateMarketingSection('section-caregiver');
          }
        }}
        onOpenSounds={() => {
          handleNavigateMarketingSection('section-voice-language');
        }}
        onOpenProgress={() => {
          if (experience === 'AUTHENTICATED_APP') {
            setCurrentRole('HEALTHCARE_WORKER');
          } else {
            handleNavigateMarketingSection('section-clinician');
          }
        }}
      />
    </div>
  );
}
