import React from 'react';
import { ANTIGRAVITY_CONFIG } from '../../config/antigravity';

interface SceneLightingProps {
  isLiteMode?: boolean;
}

export const SceneLighting: React.FC<SceneLightingProps> = ({ isLiteMode = false }) => {
  return (
    <group>
      {/* Calm Ambient Base */}
      <ambientLight color="#0B1726" intensity={1.2} />

      {/* Atmospheric Hemisphere Light */}
      <hemisphereLight
        color={ANTIGRAVITY_CONFIG.theme.lightTeal}
        groundColor={ANTIGRAVITY_CONFIG.theme.background}
        intensity={0.7}
      />

      {/* Key Directional Illumination */}
      <directionalLight
        position={[6, 8, 5]}
        intensity={1.5}
        color="#F4F8FC"
        castShadow={!isLiteMode}
        shadow-mapSize-width={isLiteMode ? 512 : 1024}
        shadow-mapSize-height={isLiteMode ? 512 : 1024}
      />

      {/* Medical Blue Fill Light */}
      <pointLight
        position={[-6, 4, -4]}
        intensity={1.8}
        color={ANTIGRAVITY_CONFIG.theme.medicalBlue}
        distance={15}
        decay={2}
      />

      {/* AI Purple Soft Rim Light */}
      <pointLight
        position={[0, -4, -6]}
        intensity={1.4}
        color={ANTIGRAVITY_CONFIG.theme.aiPurple}
        distance={12}
        decay={2}
      />
    </group>
  );
};
