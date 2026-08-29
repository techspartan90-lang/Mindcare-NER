/**
 * MindCare NER 3D Product Animation State & Keyframe Definitions
 * Centralized state and camera/model transforms for scroll-driven storytelling.
 */

export type ProductColorVariant = 'pearl-white' | 'soft-blue' | 'graphite';

export interface ColorVariantConfig {
  id: ProductColorVariant;
  name: string;
  bodyColor: string;
  frameColor: string;
  accentColor: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  description: string;
}

export const COLOR_VARIANTS: Record<ProductColorVariant, ColorVariantConfig> = {
  'pearl-white': {
    id: 'pearl-white',
    name: 'Pearl White',
    bodyColor: '#F4F7F9',
    frameColor: '#D3DCE6',
    accentColor: '#006767',
    roughness: 0.28,
    metalness: 0.15,
    clearcoat: 0.35,
    description: 'Warm, calming matte ceramic finish designed for serene home environments.',
  },
  'soft-blue': {
    id: 'soft-blue',
    name: 'Soft Blue',
    bodyColor: '#DCE7F5',
    frameColor: '#B0C6DF',
    accentColor: '#0284C7',
    roughness: 0.32,
    metalness: 0.20,
    clearcoat: 0.40,
    description: 'Tranquil Brahmaputra river-inspired tone promoting cognitive calm.',
  },
  'graphite': {
    id: 'graphite',
    name: 'Graphite',
    bodyColor: '#2C3440',
    frameColor: '#4A5568',
    accentColor: '#10B981',
    roughness: 0.35,
    metalness: 0.45,
    clearcoat: 0.25,
    description: 'High-contrast, glare-resistant deep matte slate for maximum legibility.',
  },
};

export type ActiveHotspotId =
  | 'cognitive-games'
  | 'voice-assistant'
  | 'adaptive-ai'
  | 'offline-mode'
  | 'caregiver-connection'
  | null;

export interface HotspotData {
  id: ActiveHotspotId;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  position: [number, number, number]; // [x, y, z] in local device coordinate space
  normal: [number, number, number];
  category: 'COGNITIVE' | 'VOICE' | 'AI' | 'OFFLINE' | 'CAREGIVER';
  badge: string;
  actionHint: string;
}

export const PRODUCT_HOTSPOTS: HotspotData[] = [
  {
    id: 'cognitive-games',
    number: 1,
    title: 'Cognitive Activities',
    subtitle: 'Daily Memory & Recall',
    description:
      'Memory, attention, pattern recognition, and daily recall activities culturally localized for North East India elders.',
    position: [-0.65, 0.45, 0.18],
    normal: [0, 0, 1],
    category: 'COGNITIVE',
    badge: '4 Activity Categories',
    actionHint: 'Click to explore activities',
  },
  {
    id: 'voice-assistant',
    number: 2,
    title: 'Voice Assistant',
    subtitle: '7 Regional Languages',
    description:
      'Simple voice interaction for reminders, daily conversations, and guidance in Assamese, Bengali, Manipuri, Mizo, Khasi, Hindi, and English.',
    position: [0.75, 0.95, 0.15],
    normal: [0, 0.5, 0.8],
    category: 'VOICE',
    badge: 'Dual Beamforming Mics',
    actionHint: 'Click to preview voice interaction',
  },
  {
    id: 'adaptive-ai',
    number: 3,
    title: 'Adaptive AI Engine',
    subtitle: 'Dynamic Difficulty Adjustment',
    description:
      'Activity difficulty and routine recommendations adapt dynamically based on recent response speed, error patterns, and daily energy levels.',
    position: [0.65, -0.4, 0.18],
    normal: [0, 0, 1],
    category: 'AI',
    badge: 'On-Device Inference',
    actionHint: 'Click to view adaptive intelligence',
  },
  {
    id: 'offline-mode',
    number: 4,
    title: 'Offline-First Edge Architecture',
    subtitle: 'Zero-Connectivity Resilience',
    description:
      'Activities and local progress continue seamlessly without internet; data automatically synchronizes with AES-256 encryption when network restores.',
    position: [-0.95, -0.85, 0.12],
    normal: [-0.7, -0.5, 0.5],
    category: 'OFFLINE',
    badge: 'Local IndexedDB / SQLite',
    actionHint: 'Click to inspect offline sync mechanism',
  },
  {
    id: 'caregiver-connection',
    number: 5,
    title: 'Caregiver Connection Ecosystem',
    subtitle: 'Family & Doctor Oversight',
    description:
      'Caregivers and physicians can monitor activity adherence, safety alerts, cognitive stability trends, and medication routines remotely.',
    position: [0.0, 0.9, -0.15],
    normal: [0, 0.5, -0.8],
    category: 'CAREGIVER',
    badge: 'DPDPA 2023 Compliant',
    actionHint: 'Click to see caregiver dashboard telemetry',
  },
];

export interface ProductStoryStage {
  progressStart: number;
  progressEnd: number;
  name: string;
  tagline: string;
  headline: string;
  description: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  deviceRotation: [number, number, number]; // Euler angles [x, y, z] in radians
  devicePosition: [number, number, number];
  deviceScale: number;
  fov: number;
  screenContent: 'hero' | 'games' | 'voice' | 'adaptive' | 'offline' | 'caregiver' | 'final';
  activeHotspot: ActiveHotspotId;
}

export const STORY_STAGES: ProductStoryStage[] = [
  {
    progressStart: 0.0,
    progressEnd: 0.12,
    name: 'Hero Overview',
    tagline: 'MINDCARE NER SMART COGNITIVE CARE TABLET',
    headline: 'Remember. Engage. Connect.',
    description:
      'A purpose-built smart cognitive care tablet engineered for elderly individuals in North East India experiencing memory loss or early dementia.',
    cameraPosition: [0, 0, 4.2],
    cameraTarget: [0, 0, 0],
    deviceRotation: [0.08, 0, 0],
    devicePosition: [0, -0.05, 0],
    deviceScale: 1.0,
    fov: 38,
    screenContent: 'hero',
    activeHotspot: null,
  },
  {
    progressStart: 0.12,
    progressEnd: 0.26,
    name: 'Ergonomic Simplicity',
    tagline: 'DESIGNED FOR ACCESSIBILITY',
    headline: 'Designed for simplicity.',
    description:
      'Large high-contrast display, tactile safety boundaries, gentle rounded edges, and high-legibility typography crafted for senior hands and vision.',
    cameraPosition: [0.8, 0.4, 3.8],
    cameraTarget: [0, 0, 0],
    deviceRotation: [0.12, -0.38, 0.04],
    devicePosition: [-0.15, -0.05, 0],
    deviceScale: 1.05,
    fov: 36,
    screenContent: 'hero',
    activeHotspot: 'cognitive-games',
  },
  {
    progressStart: 0.26,
    progressEnd: 0.42,
    name: 'Cognitive Activities',
    tagline: 'EVIDENCE-BASED STIMULATION',
    headline: 'Cognitive Activities',
    description:
      'Structured daily stimulation across Memory, Attention, Patterns, and Daily Recall—grounded in regional heritage and familiar local sounds.',
    cameraPosition: [0, 0.1, 2.5],
    cameraTarget: [0, 0.05, 0.1],
    deviceRotation: [0.02, 0.05, 0],
    devicePosition: [0.35, 0, 0.1],
    deviceScale: 1.18,
    fov: 32,
    screenContent: 'games',
    activeHotspot: 'cognitive-games',
  },
  {
    progressStart: 0.42,
    progressEnd: 0.56,
    name: 'Voice Assistant',
    tagline: 'NATURAL SPEECH INTERACTION',
    headline: 'Voice Assistant',
    description:
      'Dual high-sensitivity beamforming microphones with on-device noise reduction let elders speak naturally in their native mother tongue.',
    cameraPosition: [2.2, 0.6, 2.4],
    cameraTarget: [0.2, 0.4, 0],
    deviceRotation: [0.1, 1.45, -0.05],
    devicePosition: [-0.25, 0, 0],
    deviceScale: 1.15,
    fov: 34,
    screenContent: 'voice',
    activeHotspot: 'voice-assistant',
  },
  {
    progressStart: 0.56,
    progressEnd: 0.70,
    name: 'Adaptive AI Engine',
    tagline: 'PERSONALIZED COGNITIVE CARE',
    headline: 'Adaptive AI',
    description:
      'Personalized task calibration algorithms dynamically adjust difficulty, preventing frustration while preserving active cognitive pathways.',
    cameraPosition: [-0.4, 0.2, 2.7],
    cameraTarget: [0, 0, 0],
    deviceRotation: [-0.08, -0.22, 0.02],
    devicePosition: [0.3, 0, 0],
    deviceScale: 1.15,
    fov: 34,
    screenContent: 'adaptive',
    activeHotspot: 'adaptive-ai',
  },
  {
    progressStart: 0.70,
    progressEnd: 0.84,
    name: 'Offline Resilience',
    tagline: 'HILL & VALLEY RESILIENCE',
    headline: 'Works with limited connectivity.',
    description:
      'Engineered for remote North Eastern terrains. Full offline game loop, local encrypted telemetry storage, and auto-sync on Wi-Fi/cellular.',
    cameraPosition: [-1.8, 0.8, 3.2],
    cameraTarget: [-0.1, 0, 0],
    deviceRotation: [0.25, -2.85, 0.1],
    devicePosition: [-0.25, 0, 0],
    deviceScale: 1.08,
    fov: 36,
    screenContent: 'offline',
    activeHotspot: 'offline-mode',
  },
  {
    progressStart: 0.84,
    progressEnd: 0.94,
    name: 'Connected Ecosystem',
    tagline: '360° CARE CIRCLE',
    headline: 'Caregiver Ecosystem',
    description:
      'Seamlessly bridges the elderly user with family caregivers and attending clinicians through real-time safety logs and cognitive trend reports.',
    cameraPosition: [0, 1.2, 4.6],
    cameraTarget: [0, 0, 0],
    deviceRotation: [0.35, 0.45, -0.1],
    devicePosition: [0, -0.2, 0],
    deviceScale: 0.95,
    fov: 40,
    screenContent: 'caregiver',
    activeHotspot: 'caregiver-connection',
  },
  {
    progressStart: 0.94,
    progressEnd: 1.0,
    name: 'Final Hero Composition',
    tagline: 'MINDCARE NER',
    headline: 'Remember. Engage. Connect.',
    description:
      'Empowering elders across Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, and Sikkim with dignified cognitive care.',
    cameraPosition: [0, 0.1, 4.0],
    cameraTarget: [0, 0, 0],
    deviceRotation: [0.08, -0.15, 0.02],
    devicePosition: [0, 0, 0],
    deviceScale: 1.0,
    fov: 38,
    screenContent: 'final',
    activeHotspot: null,
  },
];

/**
 * Linear interpolation helper for numbers
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * Math.max(0, Math.min(1, t));
}

/**
 * 3D vector linear interpolation
 */
export function lerpVec3(
  start: [number, number, number],
  end: [number, number, number],
  t: number
): [number, number, number] {
  const factor = Math.max(0, Math.min(1, t));
  return [
    start[0] + (end[0] - start[0]) * factor,
    start[1] + (end[1] - start[1]) * factor,
    start[2] + (end[2] - start[2]) * factor,
  ];
}

/**
 * Calculates current animation transform state from global scroll progress (0..1)
 */
export function getStoryStateAtProgress(progress: number) {
  const clamped = Math.max(0, Math.min(1, progress));

  // Find surrounding stages
  let stageIndex = 0;
  for (let i = 0; i < STORY_STAGES.length; i++) {
    if (clamped >= STORY_STAGES[i].progressStart && clamped <= STORY_STAGES[i].progressEnd) {
      stageIndex = i;
      break;
    }
  }

  const currentStage = STORY_STAGES[stageIndex];
  const nextStage = STORY_STAGES[Math.min(stageIndex + 1, STORY_STAGES.length - 1)];

  const stageSpan = currentStage.progressEnd - currentStage.progressStart;
  const localT = stageSpan > 0 ? (clamped - currentStage.progressStart) / stageSpan : 0;
  // Smooth cubic ease-in-out
  const easedT = localT < 0.5 ? 2 * localT * localT : -1 + (4 - 2 * localT) * localT;

  const cameraPosition = lerpVec3(currentStage.cameraPosition, nextStage.cameraPosition, easedT);
  const cameraTarget = lerpVec3(currentStage.cameraTarget, nextStage.cameraTarget, easedT);
  const deviceRotation = lerpVec3(currentStage.deviceRotation, nextStage.deviceRotation, easedT);
  const devicePosition = lerpVec3(currentStage.devicePosition, nextStage.devicePosition, easedT);
  const deviceScale = lerp(currentStage.deviceScale, nextStage.deviceScale, easedT);
  const fov = lerp(currentStage.fov, nextStage.fov, easedT);

  return {
    stageIndex,
    currentStage,
    cameraPosition,
    cameraTarget,
    deviceRotation,
    devicePosition,
    deviceScale,
    fov,
    screenContent: currentStage.screenContent,
    activeHotspot: currentStage.activeHotspot,
    progress: clamped,
  };
}
