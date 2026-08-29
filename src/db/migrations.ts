// Database Migrations for MindCare NER
// Manages safe additive schema updates and verifies backward compatibility

export interface MigrationStep {
  version: number;
  name: string;
  upSql: string;
  downSql: string;
}

export const MIGRATIONS: MigrationStep[] = [
  {
    version: 1,
    name: '001_initial_core_schema',
    upSql: `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(50),
        role VARCHAR(50) NOT NULL,
        language VARCHAR(10) NOT NULL DEFAULT 'en',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS patient_profiles (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        gender VARCHAR(20) NOT NULL,
        location VARCHAR(255) NOT NULL,
        primary_language VARCHAR(10) NOT NULL DEFAULT 'en',
        dementia_stage VARCHAR(100) NOT NULL,
        accessibility_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
        last_active TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `,
    downSql: `
      DROP TABLE IF EXISTS patient_profiles;
      DROP TABLE IF EXISTS users;
    `,
  },
  {
    version: 2,
    name: '002_family_memory_album_and_alerts',
    upSql: `
      CREATE TABLE IF NOT EXISTS memory_albums (
        id VARCHAR(64) PRIMARY KEY,
        patient_id VARCHAR(64) NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        cover_image_url TEXT,
        created_by VARCHAR(64) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS memory_items (
        id VARCHAR(64) PRIMARY KEY,
        album_id VARCHAR(64) NOT NULL REFERENCES memory_albums(id) ON DELETE CASCADE,
        patient_id VARCHAR(64) NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
        type VARCHAR(32) NOT NULL,
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

      CREATE TABLE IF NOT EXISTS caregiver_alerts (
        id VARCHAR(64) PRIMARY KEY,
        patient_id VARCHAR(64) NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
        type VARCHAR(64) NOT NULL,
        severity VARCHAR(20) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'UNREAD',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        resolved_at TIMESTAMPTZ,
        resolved_by VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS garden_progress (
        patient_id VARCHAR(64) PRIMARY KEY REFERENCES patient_profiles(id) ON DELETE CASCADE,
        total_flowers INT NOT NULL DEFAULT 0,
        total_plants INT NOT NULL DEFAULT 0,
        total_butterflies INT NOT NULL DEFAULT 0,
        tree_growth_stage INT NOT NULL DEFAULT 1,
        last_bloom_date TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `,
    downSql: `
      DROP TABLE IF EXISTS garden_progress;
      DROP TABLE IF EXISTS caregiver_alerts;
      DROP TABLE IF EXISTS memory_items;
      DROP TABLE IF EXISTS memory_albums;
    `,
  },
];
