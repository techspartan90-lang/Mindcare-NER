import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  RotateCcw,
  Sparkles,
  ChevronRight,
  Compass,
  Sliders,
  Eye,
  Layers,
} from 'lucide-react';
import { AntigravityScene } from './AntigravityScene';
import { WebGLFallback } from './WebGLFallback';
import { SPATIAL_ZONES } from './zonesData';
import { SpatialZoneConfig, PerformanceMode } from './types';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { sound } from '../../services/sound';

interface MindCare3DSceneProps {
  onNavigateSection: (sectionId: string) => void;
  onSelectZone?: (zone: SpatialZoneConfig) => void;
  performanceMode?: PerformanceMode;
  onTogglePerformanceMode?: (mode: PerformanceMode) => void;
}

export const MindCare3DScene: React.FC<MindCare3DSceneProps> = ({
  onNavigateSection,
  onSelectZone,
  performanceMode = 'FULL_3D',
  onTogglePerformanceMode,
}) => {
  const [selectedZone, setSelectedZone] = useState<SpatialZoneConfig | null>(SPATIAL_ZONES[0]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, default to 2D Mode for comfort
  const effectiveMode: PerformanceMode = prefersReducedMotion ? '2D_MODE' : performanceMode;

  // Handle category filtering
  const filteredZones = useMemo(() => {
    if (activeCategoryFilter === 'all') return SPATIAL_ZONES;
    return SPATIAL_ZONES.filter((z) => z.category === activeCategoryFilter);
  }, [activeCategoryFilter]);

  const handleSelectZone = useCallback(
    (zone: SpatialZoneConfig) => {
      setSelectedZone(zone);
      if (onSelectZone) onSelectZone(zone);
    },
    [onSelectZone]
  );

  const handleResetCamera = () => {
    sound.playClick();
    setSelectedZone(null);
    setResetTrigger((prev) => prev + 1);
  };

  // Keyboard navigation for spatial nodes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
        const currentIndex = filteredZones.findIndex((z) => z.id === selectedZone?.id);
        const nextIndex = (currentIndex + 1) % filteredZones.length;
        handleSelectZone(filteredZones[nextIndex]);
      } else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
        const currentIndex = filteredZones.findIndex((z) => z.id === selectedZone?.id);
        const prevIndex = (currentIndex - 1 + filteredZones.length) % filteredZones.length;
        handleSelectZone(filteredZones[prevIndex]);
      } else if (e.key === 'Escape') {
        handleResetCamera();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredZones, selectedZone, handleSelectZone]);

  return (
    <div
      id="mindcare-3d-scene-container"
      role="region"
      aria-label="MindCare NER Antigravity Spatial Ecosystem"
      className="bg-[#101F31] rounded-3xl border border-[#243A50] shadow-2xl p-4 sm:p-8 space-y-6 text-[#F4F8FC] relative overflow-hidden"
    >
      {/* 3D Scene Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#243A50] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#38D9C5] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#38D9C5]" />
              <span>Antigravity Spatial Ecosystem</span>
            </span>
            <span className="text-xs font-bold text-[#7F91A6]">
              {effectiveMode === 'FULL_3D'
                ? '60 FPS Full 3D'
                : effectiveMode === 'LITE_3D'
                ? 'Lite 3D Mobile'
                : '2D Accessible Mode'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#F4F8FC] mt-1 tracking-tight">
            MindCare NER Antigravity Nexus
          </h2>
          <p className="text-xs sm:text-sm text-[#B7C5D6]">
            Drag to explore the floating neural ecosystem. Click any zone to smoothly navigate and inspect clinical parameters.
          </p>
        </div>

        {/* View Controls & Mode Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Performance Mode Switcher */}
          <div className="flex items-center bg-[#14283D] p-1 rounded-xl border border-[#243A50]">
            {(['FULL_3D', 'LITE_3D', '2D_MODE'] as PerformanceMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  sound.playClick();
                  if (onTogglePerformanceMode) onTogglePerformanceMode(mode);
                }}
                className={`min-h-[40px] px-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  effectiveMode === mode
                    ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                    : 'text-[#B7C5D6] hover:text-[#F4F8FC]'
                }`}
              >
                {mode === 'FULL_3D' ? 'Full 3D' : mode === 'LITE_3D' ? 'Lite 3D' : '2D Mode'}
              </button>
            ))}
          </div>

          {/* Reset Camera View */}
          <button
            onClick={handleResetCamera}
            className="min-h-[40px] px-3 py-2 rounded-xl text-xs font-black bg-[#14283D] border border-[#243A50] hover:border-[#19C3B1] text-[#B7C5D6] hover:text-[#F4F8FC] transition-all cursor-pointer flex items-center gap-1.5"
            title="Reset Camera View to Default"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#38D9C5]" />
            <span>Reset View</span>
          </button>

          {/* Auto Rotation Toggle */}
          {effectiveMode !== '2D_MODE' && (
            <button
              onClick={() => {
                sound.playClick();
                setIsAutoRotating(!isAutoRotating);
              }}
              className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1.5 ${
                isAutoRotating
                  ? 'bg-[#14283D] border-[#19C3B1] text-[#38D9C5]'
                  : 'bg-[#14283D] border-[#243A50] text-[#B7C5D6]'
              }`}
              title="Toggle Auto-Rotation"
            >
              <span className="hidden sm:inline">{isAutoRotating ? 'Rotating' : 'Paused'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Canvas / 2D Fallback View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Canvas Render Area (8 Columns) */}
        <div className="lg:col-span-8 relative bg-[#07111F] rounded-2xl border border-[#243A50] overflow-hidden flex items-center justify-center min-h-[420px] sm:min-h-[500px]">
          {effectiveMode !== '2D_MODE' ? (
            <AntigravityScene
              selectedZone={selectedZone}
              onSelectZone={handleSelectZone}
              performanceMode={effectiveMode}
              isAutoRotating={isAutoRotating}
              resetTrigger={resetTrigger}
              filteredZones={filteredZones}
            />
          ) : (
            <WebGLFallback
              selectedZone={selectedZone}
              onSelectZone={handleSelectZone}
              onNavigateSection={onNavigateSection}
              filteredZones={filteredZones}
            />
          )}
        </div>

        {/* Spatial Zone Details Inspector Card (4 Columns) */}
        <div className="lg:col-span-4 bg-[#14283D] rounded-2xl border border-[#243A50] p-6 space-y-4 text-left">
          {selectedZone ? (
            <>
              <div className="flex items-center justify-between border-b border-[#243A50] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl" aria-hidden="true">
                    {selectedZone.emoji}
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-[#F4F8FC] leading-tight">
                      {selectedZone.name}
                    </h3>
                    <span className="text-xs font-bold text-[#38D9C5] block">
                      {selectedZone.tagline}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-[#7F91A6] block tracking-wider">
                  Clinical Overview:
                </span>
                <p className="text-xs text-[#B7C5D6] leading-relaxed">
                  {selectedZone.fullDesc}
                </p>
              </div>

              <div className="p-3.5 bg-[#101F31] rounded-xl border border-[#243A50] flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#7F91A6]">Key Metric:</span>
                <span className="text-xs font-black text-[#38D9C5]">{selectedZone.keyMetric}</span>
              </div>

              {/* Action Jump to Section CTA */}
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateSection(selectedZone.targetSectionId);
                }}
                className="w-full py-3 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Explore {selectedZone.name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="text-center py-12 text-[#7F91A6] space-y-2">
              <Compass className="w-8 h-8 mx-auto text-[#38D9C5] animate-pulse" />
              <p className="text-xs">Click any node on the Antigravity Nexus to inspect details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
