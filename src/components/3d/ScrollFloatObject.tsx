import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ScrollFloatObjectProps {
  scrollProgress: number;
  startPos?: [number, number, number];
  endPos?: [number, number, number];
  startRot?: [number, number, number];
  endRot?: [number, number, number];
  children: React.ReactNode;
}

export const ScrollFloatObject: React.FC<ScrollFloatObjectProps> = ({
  scrollProgress,
  startPos = [0, 0, 0],
  endPos = [0, 1.5, 0],
  startRot = [0, 0, 0],
  endRot = [0, Math.PI * 0.25, 0],
  children,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const p = Math.max(0, Math.min(1, scrollProgress));

    const targetX = THREE.MathUtils.lerp(startPos[0], endPos[0], p);
    const targetY = THREE.MathUtils.lerp(startPos[1], endPos[1], p);
    const targetZ = THREE.MathUtils.lerp(startPos[2], endPos[2], p);

    const targetRotX = THREE.MathUtils.lerp(startRot[0], endRot[0], p);
    const targetRotY = THREE.MathUtils.lerp(startRot[1], endRot[1], p);
    const targetRotZ = THREE.MathUtils.lerp(startRot[2], endRot[2], p);

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 8, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 8, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 8, delta);

    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 8, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 8, delta);
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetRotZ, 8, delta);
  });

  return <group ref={groupRef}>{children}</group>;
};
