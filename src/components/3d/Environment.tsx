import React from 'react';
import { ANTIGRAVITY_CONFIG } from '../../config/antigravity';

export const Environment: React.FC = () => {
  return (
    <group>
      {/* Calm Medical Deep-Navy Scene Fog for depth attenuation */}
      <fog attach="fog" args={[ANTIGRAVITY_CONFIG.theme.background, 8, 26]} />

      {/* Atmospheric Background Ambient Grid Plane */}
      <mesh position={[0, -3.5, -6]} rotation={[-Math.PI / 2.2, 0, 0]}>
        <planeGeometry args={[36, 36, 16, 16]} />
        <meshBasicMaterial
          color="#101F31"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>
    </group>
  );
};
