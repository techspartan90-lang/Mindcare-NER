# MindCare NER — System Architecture & Design Specification

**Platform:** MindCare NER (Cognitive Digital Therapeutics for North East India)  
**Architecture Style:** Offline-First, Privacy-Preserving Full-Stack Micro-Monolith  
**Tech Stack:** React 18 (TypeScript), Vite, Tailwind CSS, Web Audio API, Node.js / Express, PostgreSQL / Supabase, Google GenAI (Gemini 2.5/3.7 Flash)

---

## 1. High-Level System Architecture

MindCare NER is engineered specifically for the challenging healthcare landscape of North East India, characterized by frequent cellular drops, multilingual elderly demographics (8 indigenous languages), and the need for non-stigmatizing, culturally grounded cognitive support.

```
+-----------------------------------------------------------------------------------+
|                              CLIENT-SIDE EDGE APP                                 |
|                                                                                   |
|  +---------------------+  +----------------------+  +--------------------------+  |
|  |  Patient Experience |  | Caregiver Dashboard  |  | Healthcare Worker Portal |  |
|  |  - Cognitive Games  |  | - Alert Center       |  | - Non-Diagnostic Reports|  |
|  |  - Daily Schedule   |  | - Memory Album Mgt   |  | - 30-Day Trend Analysis |  |
|  |  - Memory Garden    |  | - Routine Config     |  | - CSV / Print Export    |  |
|  +----------+----------+  +----------+-----------+  +------------+-------------+  |
|             |                        |                           |                |
|             +------------------------+---------------------------+                |
|                                      |                                            |
|                                      v                                            |
|  +-----------------------------------------------------------------------------+  |
|  |                       OFFLINE PERSISTENCE & SYNC ENGINE                     |  |
|  |  - OfflineSyncManager (IndexedDB / LocalStorage State Storage)              |  |
|  |  - Optimistic Mutation Queue with Exponential Backoff                       |  |
|  |  - Dynamic Network Listener & Conflict Detection (Server Timestamp Bias)    |  |
|  +-----------------------------------+-----------------------------------------+  |
|                                      | (When Online: Batch Sync / REST API)       |
+--------------------------------------|--------------------------------------------+
                                       v
+-----------------------------------------------------------------------------------+
|                              BACKEND SERVICE LAYER                                |
|                                                                                   |
|  +---------------------+  +----------------------+  +--------------------------+  |
|  | Synchronization API |  | ActivityPlanService  |  | CaregiverAlertCenter     |  |
|  | POST /api/sync      |  | - AdaptiveCognitive  |  | - Missed Reminders       |  |
|  | GET  /api/sync/stat |  | - Rule + Gemini Flash|  | - Inactivity / Battery   |  |
|  +----------+----------+  +----------+-----------+  +------------+-------------+  |
|             |                        |                           |                |
|             +------------------------+---------------------------+                |
|                                      |                                            |
|                                      v                                            |
|  +-----------------------------------------------------------------------------+  |
|  |                        DATA ACCESS & STORAGE LAYER                          |  |
|  |  - Relational Database (PostgreSQL / Supabase Schemas)                      |  |
|  |  - Media Storage: Secure Blob Storage for Approved Family Photos & Audio   |  |
|  |  - Audit Log Collector for Role-Based Action Tracking                       |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Subsystems

### 2.1 Adaptive Cognitive Engine (`AdaptiveCognitiveEngine`)
- Evaluates recent session accuracy, response latency, and attempts across 8 cognitive categories.
- Determines whether to increment, maintain, or simplify task difficulty (Gentle, Easy, Medium, Progressive).
- Dual-layer processing:
  1. Deterministic clinical rule matrix ensuring sub-10ms response even completely offline.
  2. Server-side Gemini AI expansion providing compassionate, natural-language caregiver rationales.

### 2.2 Activity Recommendation & Daily Routine Engine (`ActivityPlanService`)
- Architecture:
  ```
  Patient Activity Data
         ↓
  AdaptiveCognitiveEngine (Performance Analysis)
         ↓
  ActivityRecommendationEngine (Balancing Categories & Time Slots)
         ↓
  DailyActivityPlan (Morning Focus, Afternoon Reminiscence, Evening Relaxation)
         ↓
  Patient Dashboard View
  ```

### 2.3 Offline Synchronization Subsystem (`OfflineSyncManager`)
- Guarantees zero data loss during connectivity blackouts.
- All game completions, reminder check-offs, and emotional check-ins write immediately to local storage.
- Synchronization Service performs idempotent batch upserts when network connectivity resumes.

### 2.4 Caregiver Alert & Safety Center (`CaregiverAlertCenter`)
- Real-time triaging of clinical and operational anomalies:
  - `MISSED_MEDICINE`
  - `DEVICE_OFFLINE`
  - `COGNITIVE_DROP`
  - `SYNC_DELAY`
  - `ASSISTANCE_REQUEST`
- Multi-state lifecycle: `UNREAD` -> `ACKNOWLEDGED` -> `RESOLVED`.

---

## 3. Deployment & Runtime Constraints
- **Ingress Port:** 3000 (binds to `0.0.0.0:3000`).
- **Container Target:** Google Cloud Run.
- **Node.js Environment:** ES Module / TypeScript via `tsx` dev server and single-bundle CommonJS production server `dist/server.cjs`.
