import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export interface FloatingMotionConfig {
  speed?: number;
  amplitude?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  phase?: number;
}

export function useFloatingMotion(
  ref: React.RefObject<THREE.Object3D | null>,
  config: FloatingMotionConfig = {}
) {
  const {
    speed = 1,
    amplitude = 0.2,
    rotationIntensity = 0.1,
    floatIntensity = 0.2,
    phase = 0,
  } = config;

  const initialPos = useRef<THREE.Vector3 | null>(null);
  const initialRot = useRef<THREE.Euler | null>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const obj = ref.current;

    if (!initialPos.current) {
      initialPos.current = obj.position.clone();
      initialRot.current = obj.rotation.clone();
    }

    const t = state.clock.getElapsedTime() * speed + phase;

    const targetY = initialPos.current.y + Math.sin(t) * amplitude * floatIntensity;
    const targetX = initialPos.current.x + Math.cos(t * 0.8) * (amplitude * 0.4);

    obj.position.y = THREE.MathUtils.damp(obj.position.y, targetY, 6, delta);
    obj.position.x = THREE.MathUtils.damp(obj.position.x, targetX, 6, delta);

    if (initialRot.current) {
      obj.rotation.x = initialRot.current.x + Math.sin(t * 0.6) * (rotationIntensity * 0.05);
      obj.rotation.y = initialRot.current.y + Math.cos(t * 0.4) * (rotationIntensity * 0.08);
    }
  });
}
