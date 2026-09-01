import { useState, useEffect } from 'react';
import { DeviceTier, PerformanceMode } from '../components/3d/types';
import { ANTIGRAVITY_CONFIG } from '../config/antigravity';

/**
 * Hook to assess hardware capabilities and live frame rates,
 * classifying client device into HIGH, MEDIUM, LOW, or 2D.
 */
export function useDevicePerformance(manualMode?: PerformanceMode) {
  const [tier, setTier] = useState<DeviceTier>('HIGH');
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [currentFps, setCurrentFps] = useState<number>(60);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        setHasWebGL(false);
        setTier('2D');
        return;
      }
    } catch {
      setHasWebGL(false);
      setTier('2D');
      return;
    }

    // 2. Hardware heuristic assessment
    const isMobile = window.innerWidth <= ANTIGRAVITY_CONFIG.responsive.mobileBreakpoint;
    const isTablet =
      window.innerWidth > ANTIGRAVITY_CONFIG.responsive.mobileBreakpoint &&
      window.innerWidth <= ANTIGRAVITY_CONFIG.responsive.tabletBreakpoint;

    const nav = navigator as any;
    const concurrency = nav.hardwareConcurrency || 4;
    const deviceMemory = nav.deviceMemory || 4;

    if (concurrency <= 2 || deviceMemory <= 2) {
      setTier('LOW');
    } else if (isMobile || concurrency <= 4 || deviceMemory <= 4) {
      setTier('MEDIUM');
    } else {
      setTier('HIGH');
    }
  }, []);

  // Map tier to active configuration presets
  const effectiveMode: PerformanceMode = manualMode
    ? manualMode
    : tier === '2D'
    ? '2D_MODE'
    : tier === 'LOW' || tier === 'MEDIUM'
    ? 'LITE_3D'
    : 'FULL_3D';

  const particleCount =
    effectiveMode === '2D_MODE'
      ? 0
      : effectiveMode === 'LITE_3D'
      ? ANTIGRAVITY_CONFIG.particles.tabletCount
      : ANTIGRAVITY_CONFIG.particles.desktopCount;

  return {
    tier,
    effectiveMode,
    hasWebGL,
    currentFps,
    setCurrentFps,
    particleCount,
    isLowTier: tier === 'LOW' || effectiveMode === 'LITE_3D',
  };
}
