# MindCare NER — RESTful API Specification

**Version:** 2.0.0 (Production)  
**Base URL:** `/api`  
**Content-Type:** `application/json`

---

## 1. System & Health Endpoints

### `GET /api/health`
Checks server runtime status and database connectivity.
- **Response `200 OK`**:
  ```json
  {
    "status": "ok",
    "version": "1.0.0-production",
    "appName": "MindCare NER",
    "uptimeSeconds": 1420,
    "timestamp": "2026-08-28T09:30:00.000Z"
  }
  ```

---

## 2. Patient & User Management

### `GET /api/patients/:id`
Retrieves detailed clinical and accessibility profile for a specific patient.

### `PATCH /api/patients/:id`
Updates patient language preferences, accessibility settings, and active status.
- **Request Body**:
  ```json
  {
    "accessibilitySettings": {
      "fontSize": "large",
      "highContrast": true,
      "voicePrompts": true,
      "reducedMotion": false
    },
    "primaryLanguage": "as"
  }
  ```

---

## 3. Cognitive Games & Activities

### `GET /api/cognitive-games`
Returns full catalog of culturally grounded games with multilingual instructions.

### `POST /api/cognitive-games/session`
Records completed cognitive session result with score, accuracy, and response time.
- **Request Body**:
  ```json
  {
    "patientId": "p_dhiren_01",
    "gameId": "game_memory_match",
    "gameTitle": "North East Cultural Memory Match",
    "category": "MEMORY",
    "difficulty": "easy",
    "durationSeconds": 64,
    "score": 95,
    "accuracy": 92,
    "attempts": 4,
    "responseTimeMs": 1820
  }
  ```

### `GET /api/cognitive-games/history/:patientId`
Fetches chronological activity logs for trending and clinician review.

---

## 4. Adaptive Engine & Daily Activity Planner

### `GET /api/adaptive-engine/recommendation/:patientId`
Computes explainable AI/Rule-based game recommendations based on recent accuracy and fatigue.

### `GET /api/activity-plan/:patientId`
Retrieves today's 3-part structured plan (Morning Focus, Afternoon Reminiscence, Evening Relaxation).

### `POST /api/activity-plan/generate`
Forces recalculation of daily plan recommendations.

### `POST /api/activity-plan/item/complete`
Marks a specific routine item in the daily plan as complete and updates the Memory Garden.

---

## 5. Family Memory Album

### `GET /api/memory-albums/:patientId`
Retrieves albums configured for the patient.

### `GET /api/memory-items/:albumId`
Retrieves photo items, captions, and reminiscence questions within an album.

### `POST /api/memory-items`
Uploads a new family memory item (Caregiver authorization required).
- **Request Body**:
  ```json
  {
    "patientId": "p_dhiren_01",
    "albumId": "album_family_01",
    "title": "Granddaughter Bihu Dance",
    "subtitle": "Guwahati Lake Park, 2023",
    "type": "PERSON",
    "imageUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    "question": "Who is dancing in the traditional Muga Mekhela in this photo?",
    "options": ["Priyanka (Daughter)", "Ananya (Granddaughter)", "Neighbor", "Teacher"],
    "correctOptionIndex": 1,
    "hint": "She was born in Guwahati and loves Bihu!"
  }
  ```

### `DELETE /api/memory-items/:id`
Deletes a family memory item (Caregiver/Admin only).

---

## 6. Caregiver Alert Center

### `GET /api/caregiver/alerts`
Retrieves safety and adherence alerts.

### `POST /api/caregiver/alerts/:id/acknowledge`
Transitions alert status to `ACKNOWLEDGED`.

### `POST /api/caregiver/alerts/:id/resolve`
Transitions alert status to `RESOLVED` with resolver metadata.

### `POST /api/caregiver/alerts/trigger`
Creates a manual emergency or check-in alert.

---

## 7. Synchronization & Edge Management

### `POST /api/sync`
Batch ingestion of offline-generated session events.

### `GET /api/sync/status`
Returns server connectivity telemetry and pending queue stats.

---

## 8. Memory Garden & Progression

### `GET /api/garden/:patientId`
Retrieves flower, plant, and tree growth milestones.

### `POST /api/garden/water`
Waters plants upon completing daily routines.

---

## 9. Admin Console Management

### `GET /api/admin/games` & `POST /api/admin/games`
CRUD management of cognitive games.

### `GET /api/admin/questions` & `POST /api/admin/questions`
CRUD management of game question pools.

### `GET /api/admin/regional-content`
Cultural artifact library management across 8 NE states.

### `GET /api/admin/audit-logs`
Security and access compliance audit trail.
