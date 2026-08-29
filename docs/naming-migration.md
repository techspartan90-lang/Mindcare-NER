# MindCare NER — Production Codebase Naming Migration Audit

**Document Version:** 2.0.0  
**Migration Date:** August 2026  
**Scope:** Global Codebase Refactor from Hackathon Naming to Domain-Specific Production Terminology  
**Compliance Standard:** Production Architecture & Domain-Driven Design (DDD)

---

## 1. Executive Summary

This document establishes the systematic mapping and replacement of generic, prototype-era "SIH" (Smart India Hackathon) identifiers with descriptive, domain-specific terminology across the entire MindCare NER codebase.

The migration encompasses:
- React component names and file paths
- TypeScript types, interfaces, and enums
- REST API route schemas and URL parameters
- Database table and column names
- Service classes, helper methods, and state variables
- User-facing UI strings and accessibility landmarks

---

## 2. Global Naming Audit & Migration Mapping

| # | Original Name | New Descriptive Name | Type | Target File(s) | Domain Feature | Migration Justification |
|---|---|---|---|---|---|---|
| 1 | `SIHDemoModal` | `DemonstrationModeModal` | React Component | `src/components/common/DemonstrationModeModal.tsx` | Prototype & Testing | Identifies the component as a controlled evaluation sandbox rather than a hackathon artifact. |
| 2 | `SIHSimulationType` | `SimulationArchetype` | TypeScript Type | `src/types/index.ts` | Simulation & Testing | Standardizes the 4 evaluation archetypes (High Engagement, Moderate, Low Need, Offline) under domain taxonomy. |
| 3 | `isSIHDemoOpen` | `isDemonstrationModeOpen` | State Variable | `src/App.tsx` | Application State | Descriptive boolean flag managing modal presentation state. |
| 4 | `handleApplySIHSimulation` | `handleApplySimulationArchetype` | Function / Handler | `src/App.tsx` | Application State | Descriptive handler for applying patient simulation parameters. |
| 5 | `onOpenSIHDemo` | `onOpenDemonstrationMode` | Prop / Callback | `src/components/common/Header.tsx` | Navigation & Header | Clearly specifies the trigger action for the demonstration evaluation mode. |
| 6 | `open-sih-demo-btn` | `open-demonstration-sandbox-btn` | HTML ID / Selector | `src/components/common/Header.tsx` | Accessibility & UI | Accessible DOM ID reflecting the evaluation sandbox feature. |
| 7 | `sih-demo-modal` | `demonstration-mode-modal` | HTML ID / Selector | `src/components/common/DemonstrationModeModal.tsx` | Accessibility & UI | Unique modal DOM identifier conforming to naming standards. |
| 8 | `SIH 26003 Prototype` | `MindCare NER Production Platform` | UI String / Header | `src/components/common/Header.tsx` | Brand & Header | Reflects official platform name in clinical production deployments. |
| 9 | `SIH Sandbox` | `Demo Sandbox` | UI Badge Text | `src/components/common/Header.tsx` | Evaluation Suite | Clear, non-technical badge label for evaluators and clinicians. |
| 10 | `SIH Evaluator Simulation Sandbox` | `Cognitive Simulation & Evaluation Sandbox` | UI Heading | `src/components/common/DemonstrationModeModal.tsx` | Evaluator Sandbox | Clinically grounded title for the archetype simulator. |
| 11 | `1.0.0-sih26003` | `1.0.0-production` | Server Version Constant | `server.ts` | System Health API | Production semver release identifier for system telemetry. |
| 12 | `SIH 26003 Technical Explorer` | `MindCare NER System Architecture Explorer` | UI String / Section | `src/components/admin/ArchitectureModal.tsx` | System Architecture | Descriptive title for technical architecture inspection view. |
| 13 | `CulturalContentAdmin` | `AdminConsole` / `ContentManagement` | Component / Module | `src/components/admin/AdminConsole.tsx` | Administrative Console | Expands basic cultural admin to complete admin console with game, question, user, and audit management. |
| 14 | `games` / `sih_games` | `cognitive_games` | Database Table & API | `server.ts`, `src/db/schema.ts` | Cognitive Activities | Standardizes activity catalog under clear RESTful `/api/cognitive-games` endpoint. |
| 15 | `alerts` / `sih_alerts` | `caregiver_alerts` | Database Table & API | `server.ts`, `src/db/schema.ts` | Caregiver Safety | Clarifies alerts as belonging to the Caregiver Alert Center subsystem. |
| 16 | `recommendations` | `AdaptiveCognitiveEngine` / `ActivityRecommendationEngine` | Service & API | `src/services/activityPlanService.ts` | AI Recommendation | Establishes a dual-layer adaptive engine with explainable clinical rationale. |
| 17 | `offlineSync` | `OfflineSyncManager` / `SynchronizationService` | Service Class | `src/services/offlineSync.ts` | Offline Edge Resilience | Upgrades offline store to full synchronization engine with conflict detection and retry queue. |

---

## 3. Structural Conventions Enforced

- **React Components:** PascalCase (e.g., `DemonstrationModeModal`, `CaregiverAlertCenter`, `AdminConsole`, `MemoryGarden`)
- **TypeScript Types & Interfaces:** PascalCase (e.g., `SimulationArchetype`, `DailyActivityPlan`, `CaregiverAlert`, `MemoryAlbum`)
- **Variables & Functions:** camelCase (e.g., `isDemonstrationModeOpen`, `handleApplySimulationArchetype`, `syncPendingQueue`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `SIMULATION_ARCHETYPES`, `MAX_SYNC_RETRY_COUNT`)
- **Database Tables:** snake_case (e.g., `memory_albums`, `memory_items`, `caregiver_alerts`, `garden_progress`, `audit_logs`)
- **Database Columns:** snake_case (e.g., `patient_id`, `created_at`, `is_completed`, `resolved_by`)
- **API Endpoints:** kebab-case REST resources (e.g., `/api/cognitive-games`, `/api/caregiver/alerts`, `/api/activity-plan`)
- **File Names:** kebab-case for docs/utilities, PascalCase for React components.

---

## 4. Verification Checklist

- [x] Zero accidental `SIH` strings in source code files (`src/**`, `server.ts`).
- [x] All imports and exports updated cleanly.
- [x] RESTful API endpoints updated with backwards compatibility.
- [x] Database migrations created with non-destructive versioning.
- [x] Automated test runner validating 0 remaining SIH references in production code.
