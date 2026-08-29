# MindCare NER — Database Architecture & Schema Specification

**Database Targets:** PostgreSQL 15+ / Supabase Relational Engine  
**Naming Standard:** `snake_case` tables and columns  
**Migration Paradigm:** Safe additive migrations with backward-compatible aliases

---

## 1. Relational Entity Relationship Model

```
+------------------+         +-----------------------+         +-------------------------+
|     users        | 1 --- * |   patient_profiles    | 1 --- * |     game_sessions       |
+------------------+         +-----------------------+         +-------------------------+
| id (UUID, PK)    |         | id (UUID, PK)         |         | id (UUID, PK)           |
| email (VARCHAR)  |         | user_id (FK -> users) |         | patient_id (FK)         |
| role (ENUM)      |         | dementia_stage (TEXT) |         | game_id (TEXT)          |
| language (VARCHAR)         | caregiver_id (FK)     |         | score (INT)             |
| created_at (TS)  |         | settings (JSONB)      |         | accuracy (INT)          |
+------------------+         +-----------------------+         | duration_seconds (INT)  |
                                    |        |                 | synced (BOOLEAN)        |
                                    |        |                 +-------------------------+
                                    |        |
                                    |        +-----------------+
                                    |                          |
                                    v                          v
                       +-------------------------+   +-------------------+
                       |      memory_albums      |   | caregiver_alerts  |
                       +-------------------------+   +-------------------+
                       | id (UUID, PK)           |   | id (UUID, PK)     |
                       | patient_id (FK)         |   | patient_id (FK)   |
                       | title (VARCHAR)         |   | type (ENUM)       |
                       | created_by (FK)         |   | severity (ENUM)   |
                       +-------------------------+   | status (ENUM)     |
                                    |                | resolved_by (FK)  |
                                    v                +-------------------+
                       +-------------------------+
                       |      memory_items       |
                       +-------------------------+
                       | id (UUID, PK)           |
                       | album_id (FK)           |
                       | type (ENUM)             |
                       | image_url (TEXT)        |
                       | question (TEXT)         |
                       | options (JSONB)         |
                       | correct_index (INT)     |
                       | approved (BOOLEAN)      |
                       +-------------------------+
```

---

## 2. Core Tables Schema Definition

### 2.1 `users`
```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  role VARCHAR(50) NOT NULL CHECK (role IN ('PATIENT', 'CAREGIVER', 'HEALTHCARE_WORKER', 'ADMIN')),
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.2 `patient_profiles`
```sql
CREATE TABLE IF NOT EXISTS patient_profiles (
  id VARCHAR(64) PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL CHECK (age >= 0),
  gender VARCHAR(20) NOT NULL,
  location VARCHAR(255) NOT NULL,
  primary_language VARCHAR(10) NOT NULL DEFAULT 'en',
  dementia_stage VARCHAR(100) NOT NULL,
  caregiver_name VARCHAR(255),
  caregiver_phone VARCHAR(50),
  caregiver_relationship VARCHAR(100),
  assigned_doctor VARCHAR(255),
  doctor_hospital VARCHAR(255),
  battery_level INT DEFAULT 100,
  is_device_online BOOLEAN DEFAULT TRUE,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  accessibility_settings JSONB NOT NULL DEFAULT '{
    "fontSize": "large",
    "highContrast": false,
    "voicePrompts": true,
    "reducedMotion": false
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.3 `memory_albums` & `memory_items`
```sql
CREATE TABLE IF NOT EXISTS memory_albums (
  id VARCHAR(64) PRIMARY KEY,
  patient_id VARCHAR(64) NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  created_by VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS memory_items (
  id VARCHAR(64) PRIMARY KEY,
  album_id VARCHAR(64) NOT NULL REFERENCES memory_albums(id) ON DELETE CASCADE,
  patient_id VARCHAR(64) NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  type VARCHAR(32) NOT NULL CHECK (type IN ('PERSON', 'PLACE', 'MILESTONE', 'OBJECT')),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  image_url TEXT NOT NULL,
  audio_prompt_url TEXT,
  voice_note_text TEXT,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_index INT NOT NULL,
  hint TEXT,
  approved_by_caregiver BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.4 `caregiver_alerts`
```sql
CREATE TABLE IF NOT EXISTS caregiver_alerts (
  id VARCHAR(64) PRIMARY KEY,
  patient_id VARCHAR(64) NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  type VARCHAR(64) NOT NULL CHECK (type IN (
    'MISSED_MEDICINE', 'PROLONGED_INACTIVITY', 'COGNITIVE_DROP',
    'DEVICE_OFFLINE', 'SYNC_DELAY', 'ASSISTANCE_REQUEST'
  )),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(32) NOT NULL CHECK (status IN ('UNREAD', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by VARCHAR(255)
);
```

### 2.5 `garden_progress` & `garden_items`
```sql
CREATE TABLE IF NOT EXISTS garden_progress (
  patient_id VARCHAR(64) PRIMARY KEY REFERENCES patient_profiles(id) ON DELETE CASCADE,
  total_flowers INT NOT NULL DEFAULT 0,
  total_plants INT NOT NULL DEFAULT 0,
  total_butterflies INT NOT NULL DEFAULT 0,
  tree_growth_stage INT NOT NULL DEFAULT 1 CHECK (tree_growth_stage BETWEEN 1 AND 5),
  last_bloom_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS garden_items (
  id VARCHAR(64) PRIMARY KEY,
  patient_id VARCHAR(64) NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  type VARCHAR(32) NOT NULL CHECK (type IN ('FLOWER', 'PLANT', 'BUTTERFLY', 'TREE')),
  name VARCHAR(255) NOT NULL,
  cultural_name VARCHAR(255) NOT NULL,
  earned_by VARCHAR(255) NOT NULL,
  stage INT NOT NULL DEFAULT 1,
  color VARCHAR(32) NOT NULL,
  earned_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.6 `audit_logs`
```sql
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_role VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id VARCHAR(100) NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```
