import React, { Suspense, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CentralNexus } from './CentralNexus';
import { NeuralNode } from './NeuralNode';
import { NeuralNetwork } from './NeuralNetwork';
import { ZeroGravityParticles } from './ZeroGravityParticles';
import { SceneLighting } from './SceneLighting';
import { Environment } from './Environment';
import { CameraController } from './CameraController';
import { GravityField } from './GravityField';
import { PerformanceController } from './PerformanceController';
import { SpatialZoneConfig, PerformanceMode } from './types';
import { SPATIAL_ZONES } from './zonesData';
import { ANTIGRAVITY_CONFIG } from '../../config/antigravity';

interface AntigravitySceneProps {
  selectedZone: SpatialZoneConfig | null;
  onSelectZone: (zone: SpatialZoneConfig) => void;
  performanceMode?: PerformanceMode;
  isAutoRotating?: boolean;
  resetTrigger?: number;
  filteredZones?: SpatialZoneConfig[];
}

export const AntigravityScene: React.FC<AntigravitySceneProps> = ({
  selectedZone,
  onSelectZone,
  performanceMode = 'FULL_3D',
  isAutoRotating = true,
  resetTrigger = 0,
  filteredZones = SPATIAL_ZONES,
}) => {
  const [hoveredZoneId, setHoveredZoneId] = useState<string | undefined>(undefined);
  const isLite = performanceMode === 'LITE_3D';

  const particleCount = isLite
    ? ANTIGRAVITY_CONFIG.particles.tabletCount
    : ANTIGRAVITY_CONFIG.particles.desktopCount;

  // Selected target position for smooth camera focus
  const targetCamPos = selectedZone ? selectedZone.position : null;

  return (
    <div className="w-full h-full min-h-[420px] sm:min-h-[500px] relative overflow-hidden select-none">
      <Canvas
        camera={{
          position: ANTIGRAVITY_CONFIG.camera.defaultPosition,
          fov: ANTIGRAVITY_CONFIG.camera.defaultFov,
        }}
        dpr={isLite ? 1 : [1, 2]}
        gl={{
          antialias: !isLite,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <SceneLighting isLiteMode={isLite} />
          <Environment />

          {/* Zero-Gravity Atmospheric Particle System */}
          <ZeroGravityParticles count={particleCount} />

          {/* Gravity Field Buoyancy Container */}
          <GravityField radius={7.5} intensity={0.4}>
            {/* MindCare Central AI Nexus */}
            <CentralNexus
              isSelected={!selectedZone}
              onSelect={() => onSelectZone(SPATIAL_ZONES[0])}
            />

            {/* 9 Floating Spatial Neural Nodes */}
            {filteredZones.map((zone) => (
              <NeuralNode
                key={zone.id}
                zone={zone}
                isSelected={selectedZone?.id === zone.id}
                onSelect={(z) => onSelectZone(z)}
                onHoverChange={(hovered) => setHoveredZoneId(hovered ? zone.id : undefined)}
              />
            ))}

            {/* Optical Waveguides & Pulsing Neural Synapses */}
            <NeuralNetwork
              zones={filteredZones}
              selectedZoneId={selectedZone?.id}
              hoveredZoneId={hoveredZoneId}
            />
          </GravityField>

          {/* Camera Controller & Orbit Interaction */}
          <CameraController
            targetPosition={targetCamPos}
            isAutoRotating={isAutoRotating}
            resetTrigger={resetTrigger}
          />

          {/* Real-Time Frame Telemetry */}
          <PerformanceController />
        </Suspense>
      </Canvas>

      {/* Floating Instructions Pill */}
      <div className="absolute bottom-3 left-3 bg-[#101F31]/85 backdrop-blur-md border border-[#243A50] px-3.5 py-1.5 rounded-full text-[11px] font-bold text-[#B7C5D6] pointer-events-none flex items-center gap-2 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#19C3B1] animate-ping" />
        <span>Drag to orbit • Drag nodes to test antigravity bounce • Click node to focus</span>
      </div>
    </div>
  );
};
