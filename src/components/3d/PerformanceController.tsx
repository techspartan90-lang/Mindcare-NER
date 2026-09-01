import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

interface PerformanceControllerProps {
  onFpsReport?: (fps: number) => void;
  onLowPerformance?: () => void;
}

export const PerformanceController: React.FC<PerformanceControllerProps> = ({
  onFpsReport,
  onLowPerformance,
}) => {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const lowFpsStrikeCount = useRef(0);

  useFrame(() => {
    frameCount.current += 1;
    const now = performance.now();
    const elapsed = now - lastTime.current;

    // Sample every 1000ms
    if (elapsed >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / elapsed);
      frameCount.current = 0;
      lastTime.current = now;

      if (onFpsReport) onFpsReport(fps);

      if (fps < 30) {
        lowFpsStrikeCount.current += 1;
        if (lowFpsStrikeCount.current >= 3 && onLowPerformance) {
          onLowPerformance();
        }
      } else {
        lowFpsStrikeCount.current = 0;
      }
    }
  });

  return null;
};
