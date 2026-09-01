import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { sound } from '../../services/sound';

interface InteractiveObjectProps {
  onSelect?: () => void;
  onHoverChange?: (hovered: boolean) => void;
  isSelected?: boolean;
  isHovered?: boolean;
  hoverScale?: number;
  selectedScale?: number;
  children: React.ReactNode;
}

export const InteractiveObject: React.FC<InteractiveObjectProps> = ({
  onSelect,
  onHoverChange,
  isSelected = false,
  isHovered: externalHovered,
  hoverScale = 1.08,
  selectedScale = 1.15,
  children,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [internalHover, setInternalHover] = useState(false);
  const hovered = externalHovered ?? internalHover;

  const targetScale = isSelected ? selectedScale : hovered ? hoverScale : 1.0;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const curScale = groupRef.current.scale.x;
    const nextScale = THREE.MathUtils.damp(curScale, targetScale, 10, delta);
    groupRef.current.scale.set(nextScale, nextScale, nextScale);
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setInternalHover(true);
    if (onHoverChange) onHoverChange(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setInternalHover(false);
    if (onHoverChange) onHoverChange(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    sound.playClick();
    if (onSelect) onSelect();
  };

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {children}
    </group>
  );
};
