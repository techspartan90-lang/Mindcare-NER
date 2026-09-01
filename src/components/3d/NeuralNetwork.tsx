import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SpatialZoneConfig } from './types';

interface NeuralNetworkProps {
  zones: SpatialZoneConfig[];
  selectedZoneId?: string;
  hoveredZoneId?: string;
}

export const NeuralNetwork: React.FC<NeuralNetworkProps> = ({
  zones,
  selectedZoneId,
  hoveredZoneId,
}) => {
  const pulseSpheresRef = useRef<(THREE.Mesh | null)[]>([]);

  // Build quadratic bezier curves from Central Nexus [0, 0, 0] to each zone
  const curves = useMemo(() => {
    const origin = new THREE.Vector3(0, 0, 0);
    return zones.map((zone) => {
      const target = new THREE.Vector3(...zone.position);
      // Midpoint pulled slightly downward/upward for natural arch
      const mid = new THREE.Vector3()
        .addVectors(origin, target)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(0, -0.2, 0));

      const curve = new THREE.QuadraticBezierCurve3(origin, mid, target);
      const points = curve.getPoints(24);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return { id: zone.id, curve, geometry, color: zone.accentColor };
    });
  }, [zones]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    curves.forEach((c, idx) => {
      const mesh = pulseSpheresRef.current[idx];
      if (mesh) {
        // Compute traveling pulse progress (looping 0 -> 1)
        const progress = ((t * 0.45 + (idx * 0.15)) % 1);
        const pt = c.curve.getPoint(progress);
        mesh.position.copy(pt);
      }
    });
  });

  return (
    <group>
      {curves.map((item, idx) => {
        const isSelected = selectedZoneId === item.id;
        const isHovered = hoveredZoneId === item.id;

        return (
          <group key={item.id}>
            {/* Curved Optical Waveguide Spline */}
            <primitive object={new THREE.Line(
              item.geometry,
              new THREE.LineBasicMaterial({
                color: isSelected ? '#38D9C5' : isHovered ? '#19C3B1' : '#243A50',
                transparent: true,
                opacity: isSelected ? 0.95 : isHovered ? 0.7 : 0.35,
                linewidth: isSelected ? 3 : 1,
              })
            )} />

            {/* Traveling Energy Pulse Packet */}
            <mesh
              ref={(el) => (pulseSpheresRef.current[idx] = el)}
            >
              <sphereGeometry args={[isSelected ? 0.09 : 0.05, 12, 12]} />
              <meshBasicMaterial
                color={isSelected ? '#38D9C5' : item.color}
                transparent
                opacity={isSelected ? 1.0 : 0.8}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
