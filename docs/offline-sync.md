# MindCare NER — Offline Synchronization & Edge Engine

**Subsystem:** `OfflineSyncManager` & `SynchronizationService`  
**Purpose:** Resilient edge computing for intermittent 2G/3G/Zero connectivity across the 8 North Eastern states of India.

---

## 1. Offline Philosophy

In remote hilly terrains (such as Dima Hasao in Assam, Ukhrul in Manipur, or West Khasi Hills in Meghalaya), cellular data fluctuates continuously. MindCare NER operates under a **100% Offline-First Contract**:

1. **All core cognitive activities run strictly client-side** using deterministic rule engines and synthesized Web Audio.
2. **Mutations write immediately to local persistent storage** (`localStorage` / IndexedDB).
3. **Network availability is passively monitored** via `navigator.onLine` and lightweight health pings.
4. **When connectivity resumes, an idempotent batch sync occurs automatically** via `POST /api/sync`.

---

## 2. Synchronization Lifecycle

```
[User Action: Game Complete / Med Taken]
               │
               ▼
[OfflineSyncManager.saveLocalSession()] ────► [Write to Local Storage]
               │
               ├── (Is Network Online?)
               │
      NO ──────┴────── YES
      │                │
      ▼                ▼
[Add to SyncQueue]  [Execute POST /api/sync Batch]
[Status: PENDING]      │
                       ├── (Server Response 200 OK)
                       │
              YES ─────┴───── NO (Timeout / 500)
              │               │
              ▼               ▼
        [Mark SYNCED]   [Increment retryCount]
        [Remove Item]   [Schedule Exponential Backoff]
```

---

## 3. Conflict Resolution Strategy

- **Game Sessions:** Append-only architecture with globally unique UUIDs (`sess_<timestamp>_<rand>`). Conflict impossible because sessions are discrete immutable historical records.
- **Reminder / Schedule Status:** **Timestamp-biased LWW (Last-Write-Wins)**. If the caregiver marks a medicine as "Assisted/Given" at 8:05 AM and the patient marks it as "Taken" at 8:04 AM, the later verified caregiver timestamp takes precedence.
- **Accessibility & Language Settings:** Client settings take priority during local usage, and push updates upstream upon reconnect.

---

## 4. Telemetry & User Feedback

- The application header displays real-time connection status:
  - 🟢 **Online (Cloud Sync Active)**
  - 🟡 **Offline Edge Active (N pending sync items)**
- One-tap manual sync button triggers immediate queue flush when signal improves.
