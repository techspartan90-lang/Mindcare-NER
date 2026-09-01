import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ANTIGRAVITY_CONFIG } from '../../config/antigravity';

interface ZeroGravityParticlesProps {
  count?: number;
  radius?: number;
}

export const ZeroGravityParticles: React.FC<ZeroGravityParticlesProps> = ({
  count = ANTIGRAVITY_CONFIG.particles.desktopCount,
  radius = ANTIGRAVITY_CONFIG.particles.fieldRadius,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle data buffer
  const [positions, speeds, phases, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const phs = new Float32Array(count);
    const scl = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Cylindrical / spherical shell distribution around central core
      const angle = Math.random() * Math.PI * 2;
      const dist = 1.5 + Math.random() * radius;
      const height = (Math.random() - 0.5) * 12;

      pos[i * 3] = Math.cos(angle) * dist;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * dist;

      spd[i] = 0.2 + Math.random() * 0.5;
      phs[i] = Math.random() * Math.PI * 2;
      scl[i] = 0.05 + Math.random() * 0.12;
    }

    return [pos, spd, phs, scl];
  }, [count, radius]);

  // Create glowing circular particle texture
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(56, 217, 197, 1)');
      grad.addColorStop(0.3, 'rgba(25, 195, 177, 0.8)');
      grad.addColorStop(0.7, 'rgba(91, 167, 255, 0.2)');
      grad.addColorStop(1, 'rgba(7, 17, 31, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Gentle upward float
      posArray[idx + 1] += speeds[i] * delta * 0.4;
      // Organic horizontal drift
      posArray[idx] += Math.sin(time * 0.5 + phases[i]) * 0.003;
      posArray[idx + 2] += Math.cos(time * 0.4 + phases[i]) * 0.003;

      // Wrap around vertically to maintain continuous calm atmosphere
      if (posArray[idx + 1] > 6.0) {
        posArray[idx + 1] = -6.0;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        map={particleTexture}
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={new THREE.Color('#38D9C5')}
      />
    </points>
  );
};
