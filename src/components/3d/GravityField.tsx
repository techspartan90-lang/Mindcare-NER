import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface GravityFieldProps {
  intensity?: number;
  radius?: number;
  color?: string;
  children?: React.ReactNode;
}

export const GravityField: React.FC<GravityFieldProps> = ({
  intensity = 0.5,
  radius = 6.0,
  color = '#19C3B1',
  children,
}) => {
  const fieldRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!fieldRef.current) return;
    const t = state.clock.getElapsedTime();
    fieldRef.current.rotation.y = t * 0.05 * intensity;
    fieldRef.current.rotation.x = Math.sin(t * 0.08) * 0.05;
  });

  return (
    <group>
      {/* Subtle outer forcefield sphere wireframe */}
      <mesh ref={fieldRef}>
        <sphereGeometry args={[radius, 16, 12]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.035}
          depthWrite={false}
        />
      </mesh>
      {children}
    </group>
  );
};
