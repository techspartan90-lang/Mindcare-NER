import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { FloatingText } from './FloatingText';
import { ANTIGRAVITY_CONFIG } from '../../config/antigravity';

interface CentralNexusProps {
  onSelect?: () => void;
  isSelected?: boolean;
}

export const CentralNexus: React.FC<CentralNexusProps> = ({ onSelect, isSelected = false }) => {
  const outerSphereRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Subtle breathing float on Nexus core
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.7) * 0.12;
      groupRef.current.rotation.y = time * 0.15;
    }

    // Outer metallic shell slow rotation
    if (outerSphereRef.current) {
      outerSphereRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      outerSphereRef.current.rotation.z = Math.cos(time * 0.25) * 0.1;
    }

    // Inner glowing core pulse (calm "heartbeat" cadence)
    if (innerCoreRef.current) {
      const scale = 1.0 + Math.sin(time * 2.2) * 0.08;
      innerCoreRef.current.scale.set(scale, scale, scale);
    }

    // Gentle soft halo aura that breathes slowly for a reassuring medical glow
    if (haloRef.current) {
      const glow = 0.5 + 0.2 * Math.sin(time * 0.9);
      (haloRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glow;
      const s = 1.0 + 0.03 * Math.sin(time * 0.9);
      haloRef.current.scale.set(s, s, s);
    }

    // Orbital waveguide rings rotating in counter directions
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.35;
      ring1Ref.current.rotation.x = Math.PI / 4 + Math.sin(time * 0.4) * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -time * 0.25;
      ring2Ref.current.rotation.y = Math.PI / 3 + Math.cos(time * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} onClick={onSelect} position={[0, 0, 0]}>
      {/* Soft Teal Point Light inside the Core */}
      <pointLight
        color={ANTIGRAVITY_CONFIG.theme.lightTeal}
        intensity={3.5}
        distance={8}
        decay={2}
      />
      <pointLight color="#5BA7FF" intensity={1.4} distance={6} decay={2} />

      {/* Inner Glowing Energy Core */}
      <mesh ref={innerCoreRef}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color="#19C3B1"
          emissive="#38D9C5"
          emissiveIntensity={1.8}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Reassuring translucent medical aura halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.72, 24, 24]} />
        <meshStandardMaterial
          color="#38D9C5"
          emissive="#19C3B1"
          emissiveIntensity={0.5}
          transparent
          opacity={0.16}
          roughness={0.4}
          metalness={0.1}
          depthWrite={false}
        />
      </mesh>

      {/* Dark Metallic Outer Lattice Shell */}
      <mesh ref={outerSphereRef}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial
          color="#0B1726"
          roughness={0.25}
          metalness={0.88}
          wireframe
          wireframeLinewidth={1.5}
          emissive="#101F31"
        />
      </mesh>

      {/* Concentric Orbital Waveguide Ring 1 */}
      <group ref={ring1Ref}>
        <mesh>
          <torusGeometry args={[1.35, 0.018, 16, 64]} />
          <meshStandardMaterial
            color="#38D9C5"
            emissive="#19C3B1"
            emissiveIntensity={0.8}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Concentric Orbital Waveguide Ring 2 */}
      <group ref={ring2Ref}>
        <mesh>
          <torusGeometry args={[1.65, 0.015, 16, 64]} />
          <meshStandardMaterial
            color="#5BA7FF"
            emissive="#5BA7FF"
            emissiveIntensity={0.6}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Central Nexus Label */}
      <FloatingText
        text="MINDCARE NEXUS"
        subtext="AI Cognitive Core"
        color="#38D9C5"
        position={[0, 1.45, 0]}
        isSelected={isSelected}
      />
    </group>
  );
};
