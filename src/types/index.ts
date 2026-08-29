export type UserRole = 'AWARENESS' | 'PATIENT' | 'CAREGIVER' | 'HEALTHCARE_WORKER' | 'ADMIN';

export type SupportedLanguage = 'en' | 'as' | 'bn' | 'mni' | 'lus' | 'kha' | 'hi';

export type AccessibilityMode =
  | 'STANDARD'
  | 'LARGE_TEXT'
  | 'HIGH_CONTRAST'
  | 'VOICE_FIRST'
  | 'REDUCED_MOTION'
  | 'LOW_LITERACY';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  language: SupportedLanguage;
  avatar?: string;
  patientId?: string;
  caregiverId?: string;
}

export interface PatientProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  location: string;
  primaryLanguage: SupportedLanguage;
  dementiaStage: 'Mild Cognitive Impairment' | 'Early Stage' | 'Moderate' | 'Supportive Monitoring';
  caregiverName: string;
  caregiverPhone: string;
  caregiverRelationship: string;
  assignedDoctor: string;
  doctorHospital: string;
  lastActive: string;
  batteryLevel?: number;
  isDeviceOnline: boolean;
  lastSyncedAt: string;
  accessibilityMode?: AccessibilityMode;
  accessibilitySettings: {
    fontSize: 'normal' | 'large' | 'extra-large';
    highContrast: boolean;
    voicePrompts: boolean;
    reducedMotion: boolean;
    lowLiteracyMode?: boolean;
    voiceFirstMode?: boolean;
  };
  preferredCategories?: string[];
  voiceUsageCount?: number;
  dailyStreak?: number;
}

export type GameCategory = 
  | 'MEMORY' 
  | 'ATTENTION' 
  | 'PATTERN' 
  | 'DAILY_RECALL' 
  | 'OBJECT_RECOGNITION'
  | 'SOUND_RECOGNITION'
  | 'FAMILY_MEMORY'
  | 'STORY_MODE';

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface CognitiveGame {
  id: string;
  title: string;
  category: GameCategory;
  description: string;
  targetSkill: string;
  culturalTheme: string;
  iconName: string;
  estimatedMinutes: number;
  minDifficulty: GameDifficulty;
  maxDifficulty: GameDifficulty;
  instructions: {
    en: string;
    as: string;
    bn: string;
    mni: string;
    lus: string;
    kha: string;
    hi: string;
  };
}

export interface GameSessionResult {
  id: string;
  patientId: string;
  gameId: string;
  gameTitle: string;
  category: GameCategory;
  difficulty: GameDifficulty;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  score: number; // 0 - 100
  accuracy: number; // percentage 0 - 100
  attempts: number;
  responseTimeMs: number;
  synced: boolean;
  notes?: string;
}

export interface AIRecommendation {
  id: string;
  patientId: string;
  recommendedGameId: string;
  recommendedGameTitle: string;
  recommendedDifficulty: GameDifficulty;
  reason: string;
  detailedExplanation?: string;
  confidenceScore: number;
  performanceTrend: 'improving' | 'stable' | 'needs_gentle_support';
  generatedAt: string;
  aiModelUsed: string;
  suggestedTimeOfDay?: 'morning' | 'afternoon' | 'evening';
}

export type ReminderType = 
  | 'MEDICINE' 
  | 'HYDRATION' 
  | 'DAILY_ROUTINE' 
  | 'APPOINTMENT' 
  | 'FAMILY_CALL' 
  | 'COGNITIVE_GAME';

export type ReminderStatus = 'UPCOMING' | 'COMPLETED' | 'SNOOZED' | 'MISSED';

export interface ReminderItem {
  id: string;
  patientId: string;
  type: ReminderType;
  title: string;
  description: string;
  scheduledTime: string; // e.g. "08:00 AM" or ISO string
  recurrence: 'daily' | 'hourly' | 'weekdays' | 'once';
  status: ReminderStatus;
  completedAt?: string;
  snoozedUntil?: string;
  dosageOrDetails?: string;
  iconColor?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export type AlertPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type AlertState = 'UNREAD' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';

export type AlertCategory =
  | 'MISSED_MEDICINE'
  | 'PROLONGED_INACTIVITY'
  | 'COGNITIVE_DROP'
  | 'DEVICE_OFFLINE'
  | 'SYNC_DELAY'
  | 'ASSISTANCE_REQUEST'
  | 'DAILY_SUMMARY';

export interface AlertItem {
  id: string;
  patientId: string;
  patientName: string;
  caregiverId: string;
  type: AlertCategory;
  severity: 'low' | 'medium' | 'high' | 'critical';
  priority?: AlertPriority;
  title: string;
  description: string;
  status: AlertState;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  actionRequired?: string;
}

export interface SyncQueueItem {
  id: string;
  patientId: string;
  deviceId: string;
  entityType: 'GAME_SESSION' | 'REMINDER_STATUS' | 'HYDRATION_LOG' | 'SETTINGS' | 'EMOTION_LOG' | 'GARDEN_UPDATE' | 'MEMORY_ITEM';
  entityId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  status: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
  createdAt: string;
  syncedAt?: string;
  retryCount: number;
  conflictResolved?: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface CaregiverNote {
  id: string;
  patientId: string;
  authorName: string;
  authorRole: string;
  date: string;
  content: string;
  category: 'Mood' | 'Physical' | 'Cognitive' | 'Routine';
}

// ----------------------------------------------------
// ADVANCED MINDCARE NER MODULES
// ----------------------------------------------------

export type EmotionType = 'HAPPY' | 'OKAY' | 'TIRED' | 'WORRIED' | 'NEED_HELP';

export interface EmotionalCheckInRecord {
  id: string;
  patientId: string;
  emotion: EmotionType;
  note?: string;
  timestamp: string;
  helpRequested: boolean;
  resolvedByCaregiver?: boolean;
}

export type GardenElementType = 'FLOWER' | 'PLANT' | 'BUTTERFLY' | 'TREE';

export interface MemoryGardenItem {
  id: string;
  type: GardenElementType;
  name: string;
  culturalName: string;
  earnedBy: string; // e.g. "Completed Cultural Memory Match"
  earnedDate: string;
  icon: string;
  stage: number; // 1-3 for growth
  color: string;
}

export interface MemoryGardenState {
  patientId: string;
  totalFlowers: number;
  totalPlants: number;
  totalButterflies: number;
  treeGrowthStage: number; // 1 to 5 (Sapling to Majestic Nahar / Banyan)
  items: MemoryGardenItem[];
  lastBloomDate: string;
}

export interface MemoryAlbum {
  id: string;
  patientId: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  createdBy: string;
  createdAt: string;
  itemCount: number;
}

export interface FamilyMemoryItem {
  id: string;
  patientId: string;
  albumId?: string;
  type: 'PERSON' | 'PLACE' | 'MILESTONE' | 'OBJECT';
  title: string;
  subtitle: string;
  imageUrl: string;
  audioPromptUrl?: string;
  voiceNoteText?: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  hint: string;
  approvedByCaregiver: boolean;
  createdAt: string;
}

export interface PersonalStoryCard {
  id: string;
  title: string;
  culturalRegion: string;
  snippet: string;
  imageUrl: string;
  audioNarrationText: string;
  reflectionQuestion: string;
  options: string[];
  correctAnswer: string;
  positiveReinforcement: string;
}

export interface DailyActivityPlanItem {
  id: string;
  timeSlot: 'MORNING' | 'AFTERNOON' | 'EVENING';
  scheduledTime: string;
  title: string;
  description: string;
  category: GameCategory | 'ROUTINE' | 'HYDRATION';
  gameId?: string;
  targetSkill: string;
  isCompleted: boolean;
  recommendedDifficulty: GameDifficulty;
  whyRecommended: string;
}

export interface CognitiveEngagementProfile {
  patientId: string;
  overallEngagementScore: number; // 0-100
  recentActivityCompletionRate: number; // percentage
  weeklyStreakDays: number;
  memoryVitalityScore: number;
  attentionFocusScore: number;
  patternRecognitionScore: number;
  dailyRoutineRecallScore: number;
  objectRecognitionScore: number;
  soundRecognitionScore: number;
  preferredCategories: GameCategory[];
  voiceGuidancePreference: 'high' | 'medium' | 'minimal';
  activityTrend: 'improving' | 'stable' | 'needs_gentle_support';
  lastCalculatedAt: string;
}

export interface CaregiverPermissions {
  viewPatientProfile: boolean;
  viewActivities: boolean;
  manageReminders: boolean;
  viewAnalytics: boolean;
  viewAlerts: boolean;
  manageMemoryAlbum: boolean;
  accessLocation: boolean;
  contactPatient: boolean;
}

export interface PrivacyCenterConfig {
  patientId: string;
  voiceRecordingEnabled: boolean;
  storeAudioLocallyOnly: boolean;
  locationSharingEnabled: boolean;
  analyticsSharingApproved: boolean;
  doctorAccessApproved: boolean;
  dataRetentionDays: number;
  lastDataExportedAt?: string;
}

// Renamed from SIHSimulationType to SimulationArchetype for production domain terminology
export type SimulationArchetype = 
  | 'HIGH_ENGAGEMENT' 
  | 'MODERATE_ENGAGEMENT' 
  | 'LOW_ENGAGEMENT' 
  | 'OFFLINE_MODE';

// Backward compatibility alias during transition
export type SIHSimulationType = SimulationArchetype;

export interface CulturalItem {
  id: string;
  name: string;
  englishName: string;
  state: 'Assam' | 'Meghalaya' | 'Manipur' | 'Mizoram' | 'Nagaland' | 'Tripura' | 'Arunachal';
  category: 'CRAFT' | 'CLOTHING' | 'FOOD' | 'FESTIVAL' | 'NATURE' | 'MUSIC';
  description: string;
  icon: string;
  soundDescription?: string;
}
