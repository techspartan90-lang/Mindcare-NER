import React, { useState } from 'react';
import { DashboardSidebar, DashboardViewId } from '../navigation/DashboardSidebar';
import { DashboardHeader } from '../navigation/DashboardHeader';
import { DashboardMobileBottomNav } from '../navigation/DashboardMobileBottomNav';
import { PatientDashboard } from '../patient/PatientDashboard';
import { GameContainer } from '../games/GameContainer';
import { RemindersView } from '../reminders/RemindersView';
import { FamilyConnect } from '../patient/FamilyConnect';
import { MusicTherapy } from '../patient/MusicTherapy';
import { CaregiverDashboard } from '../caregiver/CaregiverDashboard';
import { DoctorDashboard } from '../doctor/DoctorDashboard';
import { AdminConsole } from '../admin/AdminConsole';
import { PatientProfile, SupportedLanguage, UserRole } from '../../types';

interface DashboardLayoutProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  userName: string;
  patient: PatientProfile;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenVoiceAssistant: () => void;
  onOpenGeminiAssistant?: (mode?: 'CHAT' | 'LIVE') => void;
  onOpenAccessibility: () => void;
  onLogout: () => void;
  isOffline: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentRole,
  onRoleChange,
  userName,
  patient,
  currentLang,
  onLanguageChange,
  onOpenVoiceAssistant,
  onOpenGeminiAssistant,
  onOpenAccessibility,
  onLogout,
  isOffline,
}) => {
  const [activeView, setActiveView] = useState<DashboardViewId>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const getPageTitle = () => {
    switch (activeView) {
      case 'activities':
        return 'Cognitive Activities & Exercises';
      case 'routine':
        return 'Daily Routine & Medication Schedule';
      case 'memory':
        return 'Memory Garden Sanctuary';
      case 'family':
        return 'Family Connect Hub';
      case 'messages':
        return 'Voice & Text Messages';
      case 'notifications':
        return 'Notifications & Alerts';
      case 'analytics':
        return 'Cognitive Telemetry & Analytics';
      case 'settings':
        return 'Workspace Settings';
      case 'help':
        return 'Help & Documentation';
      case 'overview':
      default:
        return currentRole === 'PATIENT'
          ? 'Senior Patient Hub'
          : currentRole === 'CAREGIVER'
          ? 'Caregiver Telemetry'
          : currentRole === 'HEALTHCARE_WORKER'
          ? 'Clinician Telemetry & Analytics Dome'
          : 'System Administrator Console';
    }
  };

  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setActiveView('activities');
  };

  return (
    <div className="flex h-screen w-full bg-[#07111F] text-[#F4F8FC] overflow-hidden font-sans">
      {/* 1. Consistent Desktop/Tablet Application Sidebar */}
      <DashboardSidebar
        currentRole={currentRole}
        activeView={activeView}
        onSelectView={(v) => setActiveView(v)}
        onLogout={onLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onRoleSwitch={onRoleChange}
      />

      {/* 2. Main Application Body */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Dashboard Header */}
        <DashboardHeader
          pageTitle={getPageTitle()}
          currentRole={currentRole}
          userName={userName || patient.name}
          currentLang={currentLang}
          onLanguageChange={onLanguageChange}
          onOpenVoiceAssistant={onOpenVoiceAssistant}
          onOpenGeminiAssistant={onOpenGeminiAssistant}
          onOpenAccessibility={onOpenAccessibility}
          onLogout={onLogout}
          isOffline={isOffline}
        />

        {/* Scrollable Main Workspace View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* PATIENT ROLE VIEWS */}
            {currentRole === 'PATIENT' && (
              <>
                {activeView === 'overview' && (
                  <PatientDashboard
                    patient={patient}
                    currentLang={currentLang}
                    onOpenGames={() => setActiveView('activities')}
                    onOpenReminders={() => setActiveView('routine')}
                    onOpenFamily={() => setActiveView('family')}
                    onOpenMusic={() => setActiveView('memory')}
                    onOpenVoiceAssistant={onOpenVoiceAssistant}
                    onSelectGame={handleSelectGame}
                  />
                )}

                {activeView === 'activities' && (
                  <GameContainer
                    currentLang={currentLang}
                    patient={patient}
                    initialGameId={selectedGameId || undefined}
                    onBackToDashboard={() => setActiveView('overview')}
                  />
                )}

                {activeView === 'routine' && (
                  <RemindersView currentLang={currentLang} />
                )}

                {activeView === 'memory' && (
                  <MusicTherapy currentLang={currentLang} />
                )}

                {activeView === 'family' && (
                  <FamilyConnect currentLang={currentLang} />
                )}

                {['messages', 'notifications', 'analytics', 'settings', 'help'].includes(activeView) && (
                  <div className="bg-[#101F31] border border-[#243A50] rounded-3xl p-8 text-center space-y-4">
                    <h3 className="text-xl font-black text-[#F4F8FC] capitalize">{activeView} Workspace</h3>
                    <p className="text-xs text-[#B7C5D6] max-w-md mx-auto">
                      This dedicated patient module is synchronized with your family care circle and local edge database.
                    </p>
                    <button
                      onClick={() => setActiveView('overview')}
                      className="px-5 py-2.5 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] rounded-xl font-black text-xs cursor-pointer shadow-md transition-all"
                    >
                      ← Return to Patient Hub
                    </button>
                  </div>
                )}
              </>
            )}

            {/* CAREGIVER ROLE VIEWS */}
            {currentRole === 'CAREGIVER' && (
              <CaregiverDashboard
                patient={patient}
                currentLang={currentLang}
                onOpenReminders={() => setActiveView('routine')}
                onOpenGames={() => setActiveView('activities')}
              />
            )}

            {/* CLINICIAN / DOCTOR ROLE VIEWS */}
            {currentRole === 'HEALTHCARE_WORKER' && (
              <DoctorDashboard
                currentPatient={patient}
                onSelectPatient={() => {}}
                currentLang={currentLang}
              />
            )}

            {/* ADMIN ROLE VIEWS */}
            {currentRole === 'ADMIN' && (
              <AdminConsole onOpenArchitecture={onOpenAccessibility} />
            )}
          </div>
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation Bar */}
      <DashboardMobileBottomNav
        currentRole={currentRole}
        activeView={activeView}
        onSelectView={(v) => setActiveView(v)}
      />
    </div>
  );
};
