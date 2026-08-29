// Database schema definition for MindCare NER
// Compatible with PostgreSQL / Supabase Relational Engine

export interface UserEntity {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'PATIENT' | 'CAREGIVER' | 'HEALTHCARE_WORKER' | 'ADMIN';
  language: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientProfileEntity {
  id: string;
  user_id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  primary_language: string;
  dementia_stage: string;
  caregiver_name?: string;
  caregiver_phone?: string;
  caregiver_relationship?: string;
  assigned_doctor?: string;
  doctor_hospital?: string;
  battery_level: number;
  is_device_online: boolean;
  last_active: string;
  last_synced_at: string;
  accessibility_settings: Record<string, any>;
  created_at: string;
}

export interface CognitiveGameEntity {
  id: string;
  title: string;
  category: string;
  description: string;
  target_skill: string;
  cultural_theme: string;
  icon_name: string;
  estimated_minutes: number;
  min_difficulty: string;
  max_difficulty: string;
  instructions: Record<string, string>;
  is_active: boolean;
  created_at: string;
}

export interface GameSessionEntity {
  id: string;
  patient_id: string;
  game_id: string;
  game_title: string;
  category: string;
  difficulty: string;
  started_at: string;
  completed_at: string;
  duration_seconds: number;
  score: number;
  accuracy: number;
  attempts: number;
  response_time_ms: number;
  synced: boolean;
  created_at: string;
}

export interface MemoryAlbumEntity {
  id: string;
  patient_id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface MemoryItemEntity {
  id: string;
  album_id: string;
  patient_id: string;
  type: 'PERSON' | 'PLACE' | 'MILESTONE' | 'OBJECT';
  title: string;
  subtitle?: string;
  image_url: string;
  audio_prompt_url?: string;
  voice_note_text?: string;
  question: string;
  options: string[];
  correct_option_index: number;
  hint?: string;
  approved_by_caregiver: boolean;
  created_at: string;
}

export interface MemoryActivityLinkEntity {
  id: string;
  memory_item_id: string;
  patient_id: string;
  times_presented: number;
  times_correct: number;
  last_presented_at?: string;
}

export interface CaregiverAlertEntity {
  id: string;
  patient_id: string;
  type: 'MISSED_MEDICINE' | 'PROLONGED_INACTIVITY' | 'COGNITIVE_DROP' | 'DEVICE_OFFLINE' | 'SYNC_DELAY' | 'ASSISTANCE_REQUEST' | 'DAILY_SUMMARY';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  status: 'UNREAD' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

export interface GardenProgressEntity {
  patient_id: string;
  total_flowers: number;
  total_plants: number;
  total_butterflies: number;
  tree_growth_stage: number;
  last_bloom_date: string;
  updated_at: string;
}

export interface GardenItemEntity {
  id: string;
  patient_id: string;
  type: 'FLOWER' | 'PLANT' | 'BUTTERFLY' | 'TREE';
  name: string;
  cultural_name: string;
  earned_by: string;
  stage: number;
  color: string;
  earned_date: string;
}

export interface AuditLogEntity {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  action: string;
  resource: string;
  resource_id: string;
  metadata?: Record<string, any>;
  timestamp: string;
}
