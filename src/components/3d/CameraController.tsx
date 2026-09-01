import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ANTIGRAVITY_CONFIG } from '../../config/antigravity';

interface CameraControllerProps {
  targetPosition?: [number, number, number] | null;
  isAutoRotating?: boolean;
  autoRotateSpeed?: number;
  resetTrigger?: number;
  enableOrbit?: boolean;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  targetPosition = null,
  isAutoRotating = true,
  autoRotateSpeed = 0.6,
  resetTrigger = 0,
  enableOrbit = true,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const isTransitioning = useRef(false);
  const desiredCamPos = useRef(new THREE.Vector3(...ANTIGRAVITY_CONFIG.camera.defaultPosition));
  const desiredTarget = useRef(new THREE.Vector3(...ANTIGRAVITY_CONFIG.camera.defaultTarget));

  // Reset to default vantage when resetTrigger increments
  useEffect(() => {
    if (resetTrigger > 0) {
      desiredCamPos.current.set(...ANTIGRAVITY_CONFIG.camera.defaultPosition);
      desiredTarget.current.set(...ANTIGRAVITY_CONFIG.camera.defaultTarget);
      isTransitioning.current = true;
    }
  }, [resetTrigger]);

  // Transition to focused zone node
  useEffect(() => {
    if (targetPosition) {
      const [tx, ty, tz] = targetPosition;
      // Calculate comfortable offset relative to target
      desiredTarget.current.set(tx, ty, tz);
      desiredCamPos.current.set(tx * 0.75, ty + 0.6, tz + 4.2);
      isTransitioning.current = true;
    }
  }, [targetPosition]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioning.current) {
      const step = THREE.MathUtils.clamp(delta * 4, 0, 1);
      // Lerp camera position
      camera.position.lerp(desiredCamPos.current, step);
      // Lerp orbit target
      controlsRef.current.target.lerp(desiredTarget.current, step);
      controlsRef.current.update();

      // Settle condition
      if (
        camera.position.distanceTo(desiredCamPos.current) < 0.05 &&
        controlsRef.current.target.distanceTo(desiredTarget.current) < 0.05
      ) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enableOrbit}
      enableDamping
      dampingFactor={0.06}
      autoRotate={isAutoRotating && !targetPosition && !isTransitioning.current}
      autoRotateSpeed={autoRotateSpeed}
      minDistance={ANTIGRAVITY_CONFIG.camera.minDistance}
      maxDistance={ANTIGRAVITY_CONFIG.camera.maxDistance}
      minPolarAngle={ANTIGRAVITY_CONFIG.camera.minPolarAngle}
      maxPolarAngle={ANTIGRAVITY_CONFIG.camera.maxPolarAngle}
      makeDefault
    />
  );
};
