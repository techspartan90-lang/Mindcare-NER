import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { GameContainer } from './components/games/GameContainer';
import { RemindersView } from './components/reminders/RemindersView';
import { FamilyConnect } from './components/patient/FamilyConnect';
import { MusicTherapy } from './components/patient/MusicTherapy';
import { VoiceAssistantModal } from './components/patient/VoiceAssistantModal';
import { CaregiverDashboard } from './components/caregiver/CaregiverDashboard';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { ArchitectureModal } from './components/admin/ArchitectureModal';
import { AccessibilityDrawer } from './components/common/AccessibilityDrawer';
import { PrivacyCenterModal } from './components/common/PrivacyCenterModal';
import { DemonstrationModeModal } from './components/common/DemonstrationModeModal';
import { AdminConsole } from './components/admin/AdminConsole';
import { MindCareCompletePlatform } from './components/sections/MindCareCompletePlatform';
import { AwarenessPlatformJourney } from './components/sections/AwarenessPlatformJourney';
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

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('AWARENESS');
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('large');
  const [accessibilityMode, setAccessibilityMode] = useState<AccessibilityMode>('STANDARD');
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Active view in Patient flow
  const [patientView, setPatientView] = useState<'dashboard' | 'games' | 'reminders' | 'family' | 'music'>('dashboard');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  
  // Modals state
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

  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setPatientView('games');
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
        voice.speak('Simulation applied: High-Need Profile. Voice-first guidance and simplified tasks enabled.', currentLang);
        break;

      case 'OFFLINE_MODE':
        setPatient((prev) => ({
          ...prev,
          name: 'Dhiren Borah (Remote North-East)',
          location: 'Haflong, Dima Hasao, Assam',
          batteryLevel: 62,
        }));
        setIsOffline(true);
        // Add dummy offline items to queue
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

  // Determine root accessibility styles
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
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        pendingSyncCount={pendingSyncCount}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenAccessibility={() => setIsAccessibilityDrawerOpen(true)}
        onOpenPrivacy={() => setIsPrivacyCenterOpen(true)}
        onOpenDemonstrationMode={() => setIsDemonstrationModeOpen(true)}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        is3DMode={is3DMode}
        onToggle3DMode={() => setIs3DMode((prev) => !prev)}
      />

      {/* Main Role-Based Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* AWARENESS & GUIDED PLATFORM JOURNEY (FULL 30-MODULE ECOSYSTEM) */}
        {currentRole === 'AWARENESS' && (
          <MindCareCompletePlatform
            onSelectRole={(role) => setCurrentRole(role)}
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
        )}

        {/* PATIENT ROLE EXPERIENCE */}
        {currentRole === 'PATIENT' && (
          <div className="space-y-6">
            {/* Sub-Navigation Tabs for Patient */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#243A50]">
              <button
                id="patient-nav-home"
                onClick={() => {
                  sound.playClick();
                  setPatientView('dashboard');
                }}
                className={`px-4 py-2 rounded-2xl font-extrabold text-sm transition-all whitespace-nowrap cursor-pointer ${
                  patientView === 'dashboard'
                    ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                    : 'bg-[#101F31] text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC] border border-[#243A50]'
                }`}
              >
                🏠 Home Hub
              </button>

              <button
                id="patient-nav-games"
                onClick={() => {
                  sound.playClick();
                  setPatientView('games');
                }}
                className={`px-4 py-2 rounded-2xl font-extrabold text-sm transition-all whitespace-nowrap cursor-pointer ${
                  patientView === 'games'
                    ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                    : 'bg-[#101F31] text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC] border border-[#243A50]'
                }`}
              >
                🧩 Cognitive Games & Sounds
              </button>

              <button
                id="patient-nav-reminders"
                onClick={() => {
                  sound.playClick();
                  setPatientView('reminders');
                }}
                className={`px-4 py-2 rounded-2xl font-extrabold text-sm transition-all whitespace-nowrap cursor-pointer ${
                  patientView === 'reminders'
                    ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                    : 'bg-[#101F31] text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC] border border-[#243A50]'
                }`}
              >
                💊 Daily Schedule & Meds
              </button>

              <button
                id="patient-nav-family"
                onClick={() => {
                  sound.playClick();
                  setPatientView('family');
                }}
                className={`px-4 py-2 rounded-2xl font-extrabold text-sm transition-all whitespace-nowrap cursor-pointer ${
                  patientView === 'family'
                    ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                    : 'bg-[#101F31] text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC] border border-[#243A50]'
                }`}
              >
                ❤️ Family Connect
              </button>

              <button
                id="patient-nav-music"
                onClick={() => {
                  sound.playClick();
                  setPatientView('music');
                }}
                className={`px-4 py-2 rounded-2xl font-extrabold text-sm transition-all whitespace-nowrap cursor-pointer ${
                  patientView === 'music'
                    ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                    : 'bg-[#101F31] text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC] border border-[#243A50]'
                }`}
              >
                🌊 Peaceful Music & River
              </button>
            </div>

            {/* Patient Views Switcher */}
            {patientView === 'dashboard' && (
              <PatientDashboard
                patient={patient}
                currentLang={currentLang}
                onOpenGames={() => setPatientView('games')}
                onOpenReminders={() => setPatientView('reminders')}
                onOpenFamily={() => setPatientView('family')}
                onOpenMusic={() => setPatientView('music')}
                onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
                onSelectGame={handleSelectGame}
              />
            )}

            {patientView === 'games' && (
              <GameContainer
                currentLang={currentLang}
                patient={patient}
                initialGameId={selectedGameId || undefined}
                onBackToDashboard={() => setPatientView('dashboard')}
              />
            )}

            {patientView === 'reminders' && (
              <RemindersView currentLang={currentLang} />
            )}

            {patientView === 'family' && (
              <FamilyConnect currentLang={currentLang} />
            )}

            {patientView === 'music' && (
              <MusicTherapy currentLang={currentLang} />
            )}
          </div>
        )}

        {/* CAREGIVER ROLE EXPERIENCE */}
        {currentRole === 'CAREGIVER' && (
          <CaregiverDashboard
            patient={patient}
            currentLang={currentLang}
            onOpenReminders={() => {
              setCurrentRole('PATIENT');
              setPatientView('reminders');
            }}
            onOpenGames={() => {
              setCurrentRole('PATIENT');
              setPatientView('games');
            }}
          />
        )}

        {/* CLINICIAN / DOCTOR ROLE EXPERIENCE */}
        {currentRole === 'HEALTHCARE_WORKER' && (
          <DoctorDashboard
            currentPatient={patient}
            onSelectPatient={(pId) => {
              fetch(`/api/patients/${pId}`)
                .then((r) => r.json())
                .then((res) => {
                  if (res.data) setPatient(res.data);
                })
                .catch(() => {});
            }}
            currentLang={currentLang}
          />
        )}

        {/* ADMIN ROLE EXPERIENCE */}
        {currentRole === 'ADMIN' && (
          <AdminConsole onOpenArchitecture={() => setIsArchitectureOpen(true)} />
        )}
      </main>

      {/* Floating Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        patient={patient}
        currentLang={currentLang}
        onPlayGame={() => {
          setIsVoiceAssistantOpen(false);
          setPatientView('games');
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

      {/* Accessibility Drawer */}
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

      {/* Demonstration Sandbox Modal */}
      <DemonstrationModeModal
        isOpen={isDemonstrationModeOpen}
        onClose={() => setIsDemonstrationModeOpen(false)}
        onApplySimulation={handleApplyDemonstrationMode}
      />
    </div>
  );
}
