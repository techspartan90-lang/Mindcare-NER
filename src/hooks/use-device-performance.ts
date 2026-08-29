import { useState, useEffect } from 'react';

export type PerformanceTier = 'HIGH' | 'MEDIUM' | 'LOW';

export interface DevicePerformanceState {
  tier: PerformanceTier;
  dpr: number;
  shadowMapSize: number;
  enableContactShadows: boolean;
  enableReflections: boolean;
  isMobile: boolean;
  cores: number;
  memoryEstimate?: number;
}

export function useDevicePerformance(): DevicePerformanceState {
  const [perfState, setPerfState] = useState<DevicePerformanceState>(() => {
    // Initial sensible default before client-side benchmark
    return {
      tier: 'HIGH',
      dpr: 1.5,
      shadowMapSize: 1024,
      enableContactShadows: true,
      enableReflections: true,
      isMobile: false,
      cores: 4,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const nav = navigator as any;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

    const cores = nav.hardwareConcurrency || 4;
    const memory = nav.deviceMemory || 4; // in GB

    let tier: PerformanceTier = 'HIGH';

    // Battery API check (if on battery saving mode or low battery)
    if (isMobile) {
      if (cores <= 4 || memory < 4) {
        tier = 'LOW';
      } else {
        tier = 'MEDIUM';
      }
    } else {
      if (cores <= 2 || memory <= 2) {
        tier = 'LOW';
      } else if (cores <= 4 || memory <= 4) {
        tier = 'MEDIUM';
      } else {
        tier = 'HIGH';
      }
    }

    // Adjust parameters based on tier
    let dpr = 1.5;
    let shadowMapSize = 1024;
    let enableContactShadows = true;
    let enableReflections = true;

    if (tier === 'HIGH') {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      shadowMapSize = 2048;
      enableContactShadows = true;
      enableReflections = true;
    } else if (tier === 'MEDIUM') {
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      shadowMapSize = 1024;
      enableContactShadows = true;
      enableReflections = false;
    } else {
      dpr = 1.0;
      shadowMapSize = 512;
      enableContactShadows = false;
      enableReflections = false;
    }

    setPerfState({
      tier,
      dpr,
      shadowMapSize,
      enableContactShadows,
      enableReflections,
      isMobile,
      cores,
      memoryEstimate: memory,
    });
  }, []);

  return perfState;
}
