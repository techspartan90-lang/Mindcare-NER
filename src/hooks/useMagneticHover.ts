import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { ANTIGRAVITY_CONFIG } from '../config/antigravity';

export interface UseMagneticHoverOptions {
  strength?: number;
  radius?: number;
  enabled?: boolean;
}

export function useMagneticHover(
  objectRef: React.RefObject<THREE.Object3D | null>,
  options: UseMagneticHoverOptions = {}
) {
  const {
    strength = ANTIGRAVITY_CONFIG.physics.magneticStrength,
    radius = ANTIGRAVITY_CONFIG.physics.magneticRadius,
    enabled = true,
  } = options;

  const { pointer, viewport } = useThree();
  const offset = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    if (!objectRef.current || !enabled) return;

    // Convert normalized pointer [-1, 1] to world coordinates at object z
    const targetX = (pointer.x * viewport.width) / 2;
    const targetY = (pointer.y * viewport.height) / 2;

    const currentPos = objectRef.current.position;
    const dx = targetX - currentPos.x;
    const dy = targetY - currentPos.y;
    const dist = Math.hypot(dx, dy);

    if (dist < radius) {
      const pullFactor = (1 - dist / radius) * strength;
      offset.current.x = THREE.MathUtils.damp(offset.current.x, dx * pullFactor, 6, delta);
      offset.current.y = THREE.MathUtils.damp(offset.current.y, dy * pullFactor, 6, delta);
    } else {
      offset.current.x = THREE.MathUtils.damp(offset.current.x, 0, 8, delta);
      offset.current.y = THREE.MathUtils.damp(offset.current.y, 0, 8, delta);
    }
  });

  return offset;
}
