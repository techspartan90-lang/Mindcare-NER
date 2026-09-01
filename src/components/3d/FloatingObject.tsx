import React, { useRef } from 'react';
import * as THREE from 'three';
import { FloatingObjectProps } from './types';
import { useAntigravity } from '../../hooks/useAntigravity';

/**
 * Reusable FloatingObject Component
 * Wraps any 3D geometry or group with natural multi-axis organic antigravity motion.
 */
export const FloatingObject: React.FC<FloatingObjectProps> = ({
  amplitude = 0.25,
  speed = 0.8,
  rotationSpeed = 0.15,
  drift = 0.1,
  driftSpeed = 0.45,
  damping = 0.9,
  phase = 0,
  enabled = true,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  children,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useAntigravity(groupRef, {
    amplitude,
    speed,
    rotationSpeed,
    drift,
    driftSpeed,
    damping,
    phase,
    enabled,
    basePosition: position,
    baseRotation: rotation,
  });

  return (
    <group ref={groupRef} scale={scale} position={position} rotation={rotation}>
      {children}
    </group>
  );
};
