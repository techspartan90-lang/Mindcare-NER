import React, { useRef } from 'react';
import * as THREE from 'three';
import { useMagneticHover } from '../../hooks/useMagneticHover';

interface MagneticObjectProps {
  strength?: number;
  radius?: number;
  enabled?: boolean;
  children: React.ReactNode;
}

export const MagneticObject: React.FC<MagneticObjectProps> = ({
  strength = 0.08,
  radius = 3.5,
  enabled = true,
  children,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  useMagneticHover(groupRef, { strength, radius, enabled });

  return <group ref={groupRef}>{children}</group>;
};
