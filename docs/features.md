# MindCare NER — Comprehensive Feature Specification

---

## 1. Feature Catalog

### 1.1 `FamilyMemoryAlbum`
- **Description:** Private family photo and reminiscence archive.
- **User Problem:** Elderly individuals with dementia experience gradual retrograde memory loss and disorientation regarding family members.
- **Technical Approach:** Authorized caregivers upload tagged photos with names, places, familiar objects, and voice notes. The system auto-generates personalized reminiscence quizzes.
- **Complexity:** Medium-High
- **Dependencies:** Relational database (`memory_albums`, `memory_items`), local audio synthesis.

### 1.2 `ActivityPlanService` & `AdaptiveCognitiveEngine`
- **Description:** Structured 3-slot daily routine generator (Morning, Afternoon, Evening).
- **User Problem:** Lack of structured routine leads to anxiety and under-stimulation.
- **Technical Approach:** Evaluates response latency and accuracy trends to suggest tailored cognitive activities with clear explainable rationales.
- **Complexity:** High
- **Dependencies:** Google GenAI (Gemini 2.5/3.7 Flash) + Deterministic Clinical Rule Matrix.

### 1.3 `CaregiverAlertCenter`
- **Description:** Real-time safety notification hub.
- **User Problem:** Caregivers experience stress not knowing if medicines are taken or if device went offline.
- **Technical Approach:** Categorizes alerts (Missed Reminders, Device Offline, Sync Failures, Assistance Requests) with unread/acknowledged/resolved lifecycles.
- **Complexity:** Medium
- **Dependencies:** `caregiver_alerts` table, notification service.

### 1.4 `OfflineSyncManager`
- **Description:** 100% offline edge execution with automated background synchronization.
- **User Problem:** Rural North East Indian regions experience frequent cellular outages.
- **Technical Approach:** Client-side queue with exponential backoff and Last-Write-Wins conflict resolution.
- **Complexity:** High
- **Dependencies:** Web Storage APIs, `/api/sync` endpoint.

### 1.5 `MemoryGarden`
- **Description:** Non-competitive visual growth progress tracker.
- **User Problem:** Traditional gamification (leaderboards, timer stress) induces agitation in elderly patients.
- **Technical Approach:** Patient actions nurture indigenous flora (Nahar, Kopou Orchid, Muga Silk Cocoon, Rhinoceros Sanctuary).
- **Complexity:** Medium
- **Dependencies:** SVG canvas, Web Audio sound synthesis.

### 1.6 `DemonstrationMode`
- **Description:** Controlled prototype simulation sandbox for evaluators and healthcare workers.
- **User Problem:** Demonstrators need to quickly showcase various patient states (High Engagement, Steady Baseline, High Need, Zero-Network) without polluting real clinical data.
- **Technical Approach:** Sandboxed mock profiles and isolated state mutation handlers.
- **Complexity:** Low-Medium
- **Dependencies:** React context, simulation state manager.

### 1.7 `AdminConsole`
- **Description:** Comprehensive content and user governance system.
- **User Problem:** Clinical teams need to update regional game assets, question pools, and audio prompts without code redeployments.
- **Technical Approach:** Modular admin dashboard covering Games, Questions, Regional Content, Users, and Audit Logs.
- **Complexity:** High
- **Dependencies:** Admin REST APIs.
