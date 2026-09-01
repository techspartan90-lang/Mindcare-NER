import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useAntigravity } from '../../hooks/useAntigravity';
import { useMagneticHover } from '../../hooks/useMagneticHover';
import { sound } from '../../services/sound';

interface AntigravityObjectProps {
  id: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  amplitude?: number;
  speed?: number;
  rotationSpeed?: number;
  drift?: number;
  phase?: number;
  isSelected?: boolean;
  onSelect?: () => void;
  onHoverChange?: (hovered: boolean) => void;
  children: React.ReactNode;
}

export const AntigravityObject: React.FC<AntigravityObjectProps> = ({
  id,
  position,
  rotation = [0, 0, 0],
  amplitude = 0.25,
  speed = 0.8,
  rotationSpeed = 0.15,
  drift = 0.1,
  phase = 0,
  isSelected = false,
  onSelect,
  onHoverChange,
  children,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef(new THREE.Vector3());
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const planeIntersection = useRef(new THREE.Vector3());

  const { camera, raycaster } = useThree();

  const { setDragDisplacement } = useAntigravity(groupRef, {
    amplitude,
    speed,
    rotationSpeed,
    drift,
    phase,
    basePosition: position,
    baseRotation: rotation,
    enabled: true,
  });

  useMagneticHover(groupRef, {
    strength: 0.08,
    radius: 3.0,
    enabled: !isDragging,
  });

  // Scale smoothly on hover / selected
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = isSelected ? 1.15 : isHovered ? 1.08 : 1.0;
    const currentScale = groupRef.current.scale.x;
    const s = THREE.MathUtils.damp(currentScale, targetScale, 10, delta);
    groupRef.current.scale.set(s, s, s);
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    // Align drag plane with object position parallel to camera view
    dragPlane.current.setFromNormalAndCoplanarPoint(
      camera.getWorldDirection(new THREE.Vector3()).negate(),
      groupRef.current ? groupRef.current.position : new THREE.Vector3(...position)
    );
    raycaster.ray.intersectPlane(dragPlane.current, dragStartPos.current);
    if (e.target.setPointerCapture) {
      e.target.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging || !groupRef.current) return;
    e.stopPropagation();
    if (raycaster.ray.intersectPlane(dragPlane.current, planeIntersection.current)) {
      const offset = new THREE.Vector3().subVectors(
        planeIntersection.current,
        new THREE.Vector3(...position)
      );
      // Clamp displacement so object never flies off screen
      offset.clampLength(0, 3.5);
      setDragDisplacement(offset, true);
    }
  };

  const handlePointerUp = (e: any) => {
    if (isDragging) {
      setIsDragging(false);
      setDragDisplacement(new THREE.Vector3(0, 0, 0), false);
      if (e.target.releasePointerCapture) {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch {}
      }
    }
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    sound.playClick();
    if (onSelect) onSelect();
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setIsHovered(true);
    if (onHoverChange) onHoverChange(true);
    document.body.style.cursor = 'grab';
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    if (onHoverChange) onHoverChange(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {children}
    </group>
  );
};
