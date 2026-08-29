# MindCare NER — Feature & Route Mapping Matrix

## 1. Feature to Component Mapping

| Feature # | Feature Name | Core Component / Source File | Target User Role |
|---|---|---|---|
| 01 | 3D Central Nexus | `src/components/canvas/MindCare3DHub.tsx` | All Users / Public |
| 02 | Public Complete Journey | `src/components/sections/MindCareCompletePlatform.tsx` | Awareness & Community |
| 03 | Senior Patient Dashboard | `src/components/patient/PatientDashboard.tsx` | Patient (Senior) |
| 04 | Cognitive Games Suite | `src/components/games/GameContainer.tsx` | Patient / Senior |
| 05 | Daily Routine & Meds | `src/components/reminders/RemindersView.tsx` | Patient / Caregiver |
| 06 | Family Connect & Photos | `src/components/patient/FamilyConnect.tsx` | Patient / Family |
| 07 | Peaceful Music & River | `src/components/patient/MusicTherapy.tsx` | Patient / Senior |
| 08 | Voice Assistant Modal | `src/components/patient/VoiceAssistantModal.tsx` | Patient / All |
| 09 | Caregiver Live Dashboard | `src/components/caregiver/CaregiverDashboard.tsx` | Family Caregiver |
| 10 | Caregiver Alerts Center | `src/components/caregiver/CaregiverAlertCenter.tsx` | Family Caregiver |
| 11 | Clinician Telemetry | `src/components/doctor/DoctorDashboard.tsx` | Clinician / Doctor |
| 12 | System Administrator | `src/components/admin/AdminConsole.tsx` | System Administrator |
| 13 | Cultural Content Admin | `src/components/admin/CulturalContentAdmin.tsx` | Administrator / Content Lead |
| 14 | Architecture Modal | `src/components/admin/ArchitectureModal.tsx` | Stakeholder / Architect |
| 15 | Accessibility Drawer | `src/components/common/AccessibilityDrawer.tsx` | All Users |
| 16 | Privacy & DPDP Center | `src/components/common/PrivacyCenterModal.tsx` | All Users |
| 17 | Demonstration Sandbox | `src/components/common/DemonstrationModeModal.tsx` | Evaluator / Clinician |
| 18 | Offline Synchronization | `src/services/offlineSync.ts` | Background Service |
| 19 | Acoustic & Voice Engine | `src/services/voice.ts` & `src/services/sound.ts` | Background Service |
| 20 | Multilingual i18n Engine | `src/services/i18n.ts` | Universal Localization |

---

## 2. Route & State Mapping

* **`currentRole = 'AWARENESS'`** $\rightarrow$ Renders `MindCareCompletePlatform.tsx` (Complete 30-module public ecosystem, 3D Central Nexus, Hero, Problem, Features, AI Lab, Cultural Map, Timeline, FAQ, Contact).
* **`currentRole = 'PATIENT'`** $\rightarrow$ Renders `PatientDashboard.tsx` with sub-views:
  * `dashboard`: Senior Home Hub (Greetings, quick launch, daily routine summary).
  * `games`: Full interactive Cognitive Games Suite (`GameContainer.tsx`).
  * `reminders`: Daily Medication & Hydration Schedule (`RemindersView.tsx`).
  * `family`: Family Memory Album & Audio Notes (`FamilyConnect.tsx`).
  * `music`: Peaceful Brahmaputra River Flutes & Soundscapes (`MusicTherapy.tsx`).
* **`currentRole = 'CAREGIVER'`** $\rightarrow$ Renders `CaregiverDashboard.tsx` (Real-time telemetry, missed dose alerts, mood tracking, voice dispatcher).
* **`currentRole = 'HEALTHCARE_WORKER'`** $\rightarrow$ Renders `DoctorDashboard.tsx` (MoCA/MMSE domain trajectories, patient roster, ABDM export).
* **`currentRole = 'ADMIN'`** $\rightarrow$ Renders `AdminConsole.tsx` (System telemetry, language pack updates, DPDP compliance logs).
