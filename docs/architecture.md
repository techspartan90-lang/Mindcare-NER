# MindCare NER — Complete System Architecture

## 1. System Overview
MindCare NER is an AI-enabled cognitive assistance and longitudinal activity monitoring platform built specifically for elderly users, family caregivers, clinicians, and community health workers in North East India.

```mermaid
graph TD
    User([User: Senior / Caregiver / Clinician]) --> PresentationLayer[Presentation & Spatial Layer]
    
    subgraph Presentation & Spatial Layer
        PresentationLayer --> Hub3D[3D Central Nexus / Three.js Canvas]
        PresentationLayer --> Standard2D[High-Contrast 2D Standard View]
        PresentationLayer --> UniversalHeader[Universal Navigation & Role Switcher]
        PresentationLayer --> RolePortals[Senior / Caregiver / Doctor / Admin Portals]
    end

    subgraph Service & Engine Layer
        RolePortals --> AudioEngine[Speech & Voice Engine (7 NE Dialects)]
        RolePortals --> GameEngine[Cognitive Exercises & MoCA Scoring]
        RolePortals --> RoutineEngine[Circadian Pacing & Reminders]
        RolePortals --> SyncEngine[Offline-First Synchronization Service]
        RolePortals --> AIEngine[Dynamic Difficulty Adaptation - DDA]
    end

    subgraph Persistence & Infrastructure Layer
        SyncEngine --> LocalVault[On-Device SQLite / Local Storage]
        SyncEngine --> RESTAPI[Node.js / Express REST Endpoints]
        RESTAPI --> InMemStore[Transactional In-Memory Store & DB Sync]
        RESTAPI --> ABDMBridge[ABDM / FHIR Clinical Export Pipeline]
    end
```

## 2. Core Architecture Tiers

### A. Presentation & Spatial Layer
* **3D Central Nexus:** Powered by Three.js / Canvas, rendering 14+ surrounding spatial pavilions with camera orbit, zoom, pan, and smooth transitions.
* **Standard 2D Interface:** Fully accessible, WCAG 2.2 AAA compliant alternative providing complete feature parity without WebGL dependencies.
* **Role-Based Portals:**
  1. *Patient Experience:* 64px+ oversized touch buttons, voice-guided prompts, morning tea greetings, memory blossoms.
  2. *Caregiver Portal:* Real-time medication verification, mood tracking, daily routine pacing, one-tap voice note dispatcher.
  3. *Clinician Dashboard:* Longitudinal MoCA/MMSE domain analytics, response latency drifts, clinical progress export.
  4. *Admin Console:* Regional language pack management, audit logs, sync queues, system telemetry.

### B. Service & Intelligence Layer
* **Dynamic Difficulty Adaptation (DDA):** Evaluates latency and accuracy on-device to adjust grid size and hints dynamically, eliminating user frustration.
* **Acoustic & Multilingual Engine:** Native speech synthesis and recognition supporting Assamese, Bengali, Meitei, Mizo, Khasi, Hindi, and Indian English.
* **Circadian Pacing:** Time-of-day contextual cues transitioning from morning recall exercises to late-afternoon hydration and evening soothing music.

### C. Offline-First Resilience Layer
* **Local-First SQLite Vault:** Encrypted on-device storage ensuring 100% functionality during mountain weather disruptions and power outages.
* **Silent Background Delta Sync:** Detects cellular/Wi-Fi signal recovery and queues encrypted transactional payloads to the cloud.

---

## 3. Technology Stack Summary
* **Frontend Framework:** React 19, TypeScript, Vite
* **Spatial & 3D:** Three.js, React Three Fiber, Drei, HTML5 Canvas
* **Styling & Design System:** Tailwind CSS, Lucide Icons, Recharts
* **Backend Runtime:** Node.js, Express, TSX
* **AI & Acoustic Services:** On-Device DDA Algorithms, Google GenAI SDK integration, Web Speech API
