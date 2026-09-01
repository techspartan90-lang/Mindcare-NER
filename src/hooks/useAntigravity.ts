import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ANTIGRAVITY_CONFIG } from '../config/antigravity';

export interface UseAntigravityOptions {
  amplitude?: number;
  speed?: number;
  rotationSpeed?: number;
  drift?: number;
  driftSpeed?: number;
  damping?: number;
  phase?: number;
  enabled?: boolean;
  basePosition?: [number, number, number];
  baseRotation?: [number, number, number];
}

/**
 * useAntigravity Hook
 * Provides high-performance, organic multi-axis floating, drift, and damping physics
 * by directly manipulating Three.js Object3D references on the frame loop without setState.
 */
export function useAntigravity(
  objectRef: React.RefObject<THREE.Object3D | null>,
  options: UseAntigravityOptions = {}
) {
  const {
    amplitude = ANTIGRAVITY_CONFIG.physics.floatAmplitude,
    speed = ANTIGRAVITY_CONFIG.physics.floatSpeed,
    rotationSpeed = ANTIGRAVITY_CONFIG.physics.rotationSpeed,
    drift = ANTIGRAVITY_CONFIG.physics.driftAmount,
    driftSpeed = ANTIGRAVITY_CONFIG.physics.driftSpeed,
    damping = ANTIGRAVITY_CONFIG.physics.damping,
    phase = 0,
    enabled = true,
    basePosition = [0, 0, 0],
    baseRotation = [0, 0, 0],
  } = options;

  const currentOffset = useRef(new THREE.Vector3(0, 0, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const dragOffset = useRef(new THREE.Vector3(0, 0, 0));
  const isBeingDragged = useRef(false);

  useFrame((state, delta) => {
    if (!objectRef.current || !enabled) return;

    const time = state.clock.elapsedTime;
    const obj = objectRef.current;

    // Organic sinusoidal float & drift
    const targetY = basePosition[1] + Math.sin(time * speed + phase) * amplitude;
    const targetX = basePosition[0] + Math.sin(time * driftSpeed + phase * 1.3) * drift;
    const targetZ = basePosition[2] + Math.cos(time * driftSpeed * 0.8 + phase * 0.7) * (drift * 0.6);

    if (isBeingDragged.current) {
      // While dragging, apply external drag displacement
      obj.position.x = targetX + dragOffset.current.x;
      obj.position.y = targetY + dragOffset.current.y;
      obj.position.z = targetZ + dragOffset.current.z;
    } else {
      // Spring return & settle with damping
      dragOffset.current.multiplyScalar(damping);
      obj.position.x = THREE.MathUtils.damp(obj.position.x, targetX + dragOffset.current.x, 8, delta);
      obj.position.y = THREE.MathUtils.damp(obj.position.y, targetY + dragOffset.current.y, 8, delta);
      obj.position.z = THREE.MathUtils.damp(obj.position.z, targetZ + dragOffset.current.z, 8, delta);
    }

    // Slow organic axial rotation breathing
    obj.rotation.y = baseRotation[1] + Math.sin(time * rotationSpeed + phase) * 0.15;
    obj.rotation.x = baseRotation[0] + Math.cos(time * rotationSpeed * 0.7 + phase) * 0.08;
    obj.rotation.z = baseRotation[2] + Math.sin(time * rotationSpeed * 0.5 + phase) * 0.05;
  });

  const setDragDisplacement = (offset: THREE.Vector3, dragging: boolean) => {
    dragOffset.current.copy(offset);
    isBeingDragged.current = dragging;
  };

  return {
    velocity,
    dragOffset,
    setDragDisplacement,
  };
}
