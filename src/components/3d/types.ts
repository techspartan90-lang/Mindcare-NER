import React from 'react';

export type PerformanceMode = 'FULL_3D' | 'LITE_3D' | '2D_MODE';
export type DeviceTier = 'HIGH' | 'MEDIUM' | 'LOW' | '2D';

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
  phaseOffset?: number;
  subNodes?: { label: string; offset: [number, number, number] }[];
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  isFocused?: boolean;
}

export type ZoneInteractionState = 'idle' | 'hover' | 'focused' | 'selected' | 'dragging' | 'disabled';

export interface FloatingObjectProps {
  amplitude?: number;
  speed?: number;
  rotationSpeed?: number;
  drift?: number;
  driftSpeed?: number;
  damping?: number;
  phase?: number;
  enabled?: boolean;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  children: React.ReactNode;
}

export interface NeuralConnectionData {
  id: string;
  source: [number, number, number];
  target: [number, number, number];
  color: string;
  pulseRate: number;
  active: boolean;
}
