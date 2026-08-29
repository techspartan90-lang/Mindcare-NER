export type PerformanceMode = 'FULL_3D' | 'LITE_3D' | '2D_MODE';

export type ZoneCategory =
  | 'cognitive'
  | 'routine'
  | 'memory'
  | 'family'
  | 'caregiver'
  | 'clinician'
  | 'ai'
  | 'language'
  | 'security';

export interface SpatialZoneConfig {
  id: string;
  name: string;
  category: ZoneCategory;
  emoji: string;
  color: string;
  accentColor: string;
  glowColor: string;
  tagline: string;
  shortDesc: string;
  fullDesc: string;
  keyMetric: string;
  targetSectionId: string;
  position: [number, number, number];
  orbitRadius: number;
  angle: number;
  rotationSpeed?: number;
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export type ZoneInteractionState = 'idle' | 'hover' | 'focused' | 'selected' | 'disabled';
