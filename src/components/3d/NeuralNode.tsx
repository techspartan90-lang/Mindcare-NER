import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SpatialZoneConfig } from './types';
import { AntigravityObject } from './AntigravityObject';
import { FloatingText } from './FloatingText';

interface NeuralNodeProps {
  zone: SpatialZoneConfig;
  isSelected?: boolean;
  onSelect?: (zone: SpatialZoneConfig) => void;
  onHoverChange?: (hovered: boolean) => void;
}

export const NeuralNode: React.FC<NeuralNodeProps> = ({
  zone,
  isSelected = false,
  onSelect,
  onHoverChange,
}) => {
  const outerShieldRef = useRef<THREE.Mesh>(null);
  const orbitRingRef = useRef<THREE.Group>(null);
  const coreSphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (outerShieldRef.current) {
      outerShieldRef.current.rotation.y = t * 0.35;
      outerShieldRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
    }
    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.z = -t * 0.5;
    }
    if (coreSphereRef.current) {
      const pulse = isSelected ? 1.0 + Math.sin(t * 4.0) * 0.08 : 1.0;
      coreSphereRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <AntigravityObject
      id={zone.id}
      position={zone.position}
      amplitude={0.22}
      speed={0.7 + (zone.angle % 3) * 0.1}
      drift={0.08}
      phase={(zone.angle * Math.PI) / 180}
      isSelected={isSelected}
      onSelect={() => onSelect?.(zone)}
      onHoverChange={onHoverChange}
    >
      {/* Soft Point Light for Selected/Glow Node */}
      {isSelected && (
        <pointLight
          color={zone.accentColor}
          intensity={2.8}
          distance={4.5}
          decay={2}
        />
      )}

      {/* Inner Glowing Core */}
      <mesh ref={coreSphereRef}>
        <sphereGeometry args={[0.36, 32, 32]} />
        <meshStandardMaterial
          color={zone.color}
          emissive={zone.accentColor}
          emissiveIntensity={isSelected ? 1.6 : 0.9}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Outer Translucent Protective Hex Shield */}
      <mesh ref={outerShieldRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color={zone.accentColor}
          wireframe
          transparent
          opacity={isSelected ? 0.6 : 0.25}
          emissive={zone.color}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Mini Node Orbit Ring */}
      <group ref={orbitRingRef}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.7, 0.012, 16, 32]} />
          <meshBasicMaterial
            color={zone.accentColor}
            transparent
            opacity={isSelected ? 0.8 : 0.3}
          />
        </mesh>
      </group>

      {/* 3D Floating Tag Label */}
      <FloatingText
        text={zone.name}
        subtext={zone.tagline}
        emoji={zone.emoji}
        color={zone.accentColor}
        position={[0, 0.9, 0]}
        isSelected={isSelected}
      />
    </AntigravityObject>
  );
};
