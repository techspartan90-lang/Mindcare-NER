import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFloatingMotion } from '../../hooks/useFloatingMotion';

interface FloatingGroupProps {
  speed?: number;
  amplitude?: number;
  floatIntensity?: number;
  rotationIntensity?: number;
  phase?: number;
  children: React.ReactNode;
  position?: [number, number, number];
}

export const FloatingGroup: React.FC<FloatingGroupProps> = ({
  speed = 0.7,
  amplitude = 0.18,
  floatIntensity = 0.25,
  rotationIntensity = 0.08,
  phase = 0,
  position = [0, 0, 0],
  children,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFloatingMotion(groupRef, {
    speed,
    amplitude,
    floatIntensity,
    rotationIntensity,
    phase,
  });

  return (
    <group ref={groupRef} position={position}>
      {children}
    </group>
  );
};
