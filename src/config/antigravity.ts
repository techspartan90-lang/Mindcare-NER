/**
 * MINDCARE NER — ANTIGRAVITY 3D SYSTEM CONFIGURATION
 * Centralized design tokens, physics parameters, camera presets,
 * and adaptive performance tier configurations.
 */

export interface AntigravityConfig {
  theme: {
    background: string;
    secondaryBg: string;
    surface: string;
    primaryTeal: string;
    lightTeal: string;
    medicalBlue: string;
    aiPurple: string;
    textPrimary: string;
    textSecondary: string;
    glowTeal: string;
    glowBlue: string;
    glowPurple: string;
  };
  physics: {
    floatAmplitude: number;
    floatSpeed: number;
    rotationSpeed: number;
    driftAmount: number;
    driftSpeed: number;
    magneticStrength: number;
    magneticRadius: number;
    springStrength: number;
    damping: number;
    dragReturnSpeed: number;
  };
  particles: {
    desktopCount: number;
    tabletCount: number;
    mobileCount: number;
    fieldRadius: number;
    speedRange: [number, number];
    sizeRange: [number, number];
  };
  camera: {
    defaultPosition: [number, number, number];
    defaultTarget: [number, number, number];
    defaultFov: number;
    minDistance: number;
    maxDistance: number;
    maxPolarAngle: number;
    minPolarAngle: number;
  };
  performance: {
    targetFPS: number;
    lowFpsThreshold: number;
    highFpsThreshold: number;
    fpsSampleWindow: number;
  };
  responsive: {
    mobileBreakpoint: number;
    tabletBreakpoint: number;
    desktopBreakpoint: number;
    wideBreakpoint: number;
  };
}

export const ANTIGRAVITY_CONFIG: AntigravityConfig = {
  theme: {
    background: '#07111F',
    secondaryBg: '#0B1726',
    surface: '#101F31',
    primaryTeal: '#19C3B1',
    lightTeal: '#38D9C5',
    medicalBlue: '#5BA7FF',
    aiPurple: '#8B7CFF',
    textPrimary: '#F4F8FC',
    textSecondary: '#B7C5D6',
    glowTeal: 'rgba(25, 195, 177, 0.4)',
    glowBlue: 'rgba(91, 167, 255, 0.35)',
    glowPurple: 'rgba(139, 124, 255, 0.35)',
  },
  physics: {
    floatAmplitude: 0.25,
    floatSpeed: 0.8,
    rotationSpeed: 0.15,
    driftAmount: 0.1,
    driftSpeed: 0.45,
    magneticStrength: 0.08,
    magneticRadius: 3.5,
    springStrength: 0.15,
    damping: 0.9,
    dragReturnSpeed: 0.08,
  },
  particles: {
    desktopCount: 250,
    tabletCount: 100,
    mobileCount: 40,
    fieldRadius: 18,
    speedRange: [0.2, 0.6],
    sizeRange: [0.08, 0.22],
  },
  camera: {
    defaultPosition: [0, 2.5, 9.5],
    defaultTarget: [0, 0.2, 0],
    defaultFov: 45,
    minDistance: 4.5,
    maxDistance: 15.0,
    maxPolarAngle: Math.PI / 1.75,
    minPolarAngle: Math.PI / 6,
  },
  performance: {
    targetFPS: 60,
    lowFpsThreshold: 35,
    highFpsThreshold: 55,
    fpsSampleWindow: 60,
  },
  responsive: {
    mobileBreakpoint: 640,
    tabletBreakpoint: 1024,
    desktopBreakpoint: 1280,
    wideBreakpoint: 1920,
  },
};
