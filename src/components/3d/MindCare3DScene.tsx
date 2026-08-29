import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Brain,
  Sparkles,
  HeartHandshake,
  Stethoscope,
  Clock,
  Volume2,
  Bell,
  WifiOff,
  Shield,
  HelpCircle,
  Flower2,
  Gamepad2,
  Sliders,
  BarChart3,
  Maximize2,
  RotateCcw,
  Eye,
  Info,
  ChevronRight,
  Zap,
  Layers,
  Compass,
} from 'lucide-react';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';
import { SPATIAL_ZONES } from './zonesData';
import { SpatialZoneConfig, PerformanceMode } from './types';

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
  const [hoveredZone, setHoveredZone] = useState<SpatialZoneConfig | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [tiltOffset, setTiltOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-rotation loop
  useEffect(() => {
    if (!isAutoRotating || isDragging || performanceMode === '2D_MODE') return;
    const speed = performanceMode === 'LITE_3D' ? 0.2 : 0.35;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + speed) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging, performanceMode]);

  // Handle category filtering
  const filteredZones = useMemo(() => {
    if (activeCategoryFilter === 'all') return SPATIAL_ZONES;
    return SPATIAL_ZONES.filter((z) => z.category === activeCategoryFilter);
  }, [activeCategoryFilter]);

  // Mouse Parallax Effect
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (performanceMode === '2D_MODE' || isDragging) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      setTiltOffset({ x: normX * 18, y: normY * 12 });
    },
    [performanceMode, isDragging]
  );

  // Drag-to-Rotate handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setIsAutoRotating(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    setRotationAngle((prev) => (prev + deltaX * 0.4) % 360);
    setDragStartX(e.clientX);
  };

  // Touch drag support for mobile / tablets
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStartX(e.touches[0].clientX);
      setIsAutoRotating(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartX;
    setRotationAngle((prev) => (prev + deltaX * 0.5) % 360);
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Render 3D Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || performanceMode === '2D_MODE') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2 + tiltOffset.x;
      const centerY = height / 2 + tiltOffset.y;

      ctx.clearRect(0, 0, width, height);

      // Deep Space Radial Background
      const bgGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        15,
        centerX,
        centerY,
        width * 0.48
      );
      bgGradient.addColorStop(0, 'rgba(25, 195, 177, 0.15)');
      bgGradient.addColorStop(0.4, 'rgba(91, 167, 255, 0.08)');
      bgGradient.addColorStop(0.8, 'rgba(139, 124, 255, 0.04)');
      bgGradient.addColorStop(1, 'rgba(7, 17, 31, 0)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Render Concentric Orbital Waveguide Rings
      const orbits = [110, 175, 245];
      orbits.forEach((radius, idx) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * zoomLevel, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 1 ? 'rgba(25, 195, 177, 0.3)' : 'rgba(56, 217, 197, 0.15)';
        ctx.lineWidth = idx === 1 ? 2 : 1.2;
        ctx.setLineDash(idx === 1 ? [6, 8] : [4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Ambient Particle Field (Procedural Sparkles)
      if (performanceMode === 'FULL_3D') {
        const time = Date.now() * 0.001;
        for (let i = 0; i < 28; i++) {
          const pAngle = i * 0.22 + time * 0.15;
          const pDist = (100 + (i % 7) * 22) * zoomLevel;
          const px = centerX + Math.cos(pAngle) * pDist;
          const py = centerY + Math.sin(pAngle) * pDist * 0.72;
          const pAlpha = 0.25 + Math.sin(time * 2 + i) * 0.2;

          ctx.beginPath();
          ctx.arc(px, py, 1.8 * zoomLevel, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 217, 197, ${pAlpha})`;
          ctx.fill();
        }
      }

      // Draw Central Nexus Core Platform
      const coreRadius = 54 * zoomLevel;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        coreRadius
      );
      coreGradient.addColorStop(0, '#101F31');
      coreGradient.addColorStop(0.7, '#0B1726');
      coreGradient.addColorStop(1, '#07111F');
      ctx.fillStyle = coreGradient;
      ctx.shadowColor = 'rgba(25, 195, 177, 0.6)';
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Pulsing Metallic Core Outer Ring
      const pulse = Math.sin(Date.now() / 400) * 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, (64 + pulse) * zoomLevel, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(25, 195, 177, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Central Nexus Wordmark
      ctx.fillStyle = '#F4F8FC';
      ctx.font = `900 ${Math.max(10, 11 * zoomLevel)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MINDCARE NER', centerX, centerY - 6 * zoomLevel);
      ctx.fillStyle = '#38D9C5';
      ctx.font = `800 ${Math.max(8, 9 * zoomLevel)}px sans-serif`;
      ctx.fillText('CENTRAL NEXUS', centerX, centerY + 8 * zoomLevel);

      // Render 9 Spatial Zones and Optical Waveguide Beams
      filteredZones.forEach((zone) => {
        const rad = ((zone.angle + rotationAngle) * Math.PI) / 180;
        const dist = zone.orbitRadius * 48 * zoomLevel;
        const x = centerX + Math.cos(rad) * dist;
        const y = centerY + Math.sin(rad) * dist * 0.72; // 3D perspective foreshortening

        const isSelected = selectedZone?.id === zone.id;
        const isHovered = hoveredZone?.id === zone.id;

        // Optical Waveguide Beam Line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = isSelected
          ? 'rgba(25, 195, 177, 0.8)'
          : isHovered
          ? 'rgba(56, 217, 197, 0.6)'
          : 'rgba(36, 58, 80, 0.5)';
        ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1.2;
        ctx.stroke();

        // Spatial Node Sphere
        const nodeRadius = (isSelected ? 22 : isHovered ? 18 : 15) * zoomLevel;
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = zone.color;
        ctx.shadowColor = zone.glowColor;
        ctx.shadowBlur = isSelected ? 28 : isHovered ? 20 : 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = isSelected ? '#38D9C5' : '#F4F8FC';
        ctx.lineWidth = isSelected ? 3.5 : 2;
        ctx.stroke();

        // Node Emoji
        ctx.font = `${Math.max(12, 14 * zoomLevel)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(zone.emoji, x, y);

        // Node Label
        ctx.fillStyle = isSelected ? '#38D9C5' : isHovered ? '#F4F8FC' : '#B7C5D6';
        ctx.font = `${isSelected ? 'bold' : '600'} ${Math.max(9, 10 * zoomLevel)}px sans-serif`;
        ctx.fillText(zone.name, x, y + nodeRadius + 12 * zoomLevel);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    rotationAngle,
    zoomLevel,
    selectedZone,
    hoveredZone,
    filteredZones,
    tiltOffset,
    performanceMode,
  ]);

  // Click on Canvas to Select / Navigate Zone
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2 + tiltOffset.x;
    const centerY = height / 2 + tiltOffset.y;

    let clicked: SpatialZoneConfig | null = null;
    let minDist = 32;

    filteredZones.forEach((zone) => {
      const rad = ((zone.angle + rotationAngle) * Math.PI) / 180;
      const dist = zone.orbitRadius * 48 * zoomLevel;
      const x = centerX + Math.cos(rad) * dist;
      const y = centerY + Math.sin(rad) * dist * 0.72;

      const d = Math.hypot(clickX - x, clickY - y);
      if (d < minDist) {
        minDist = d;
        clicked = zone;
      }
    });

    if (clicked) {
      sound.playClick();
      setSelectedZone(clicked);
      if (onSelectZone) onSelectZone(clicked);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      id="mindcare-3d-scene-container"
      className="bg-[#101F31] rounded-3xl border border-[#243A50] shadow-2xl p-4 sm:p-8 space-y-6 text-[#F4F8FC] relative overflow-hidden"
    >
      {/* 3D Scene Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#243A50] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#38D9C5] bg-[#14283D] px-3 py-1 rounded-full border border-[#243A50]">
              Interactive Spatial Nexus
            </span>
            <span className="text-xs font-bold text-[#7F91A6]">
              {performanceMode === 'FULL_3D'
                ? '60 FPS Full 3D'
                : performanceMode === 'LITE_3D'
                ? 'Lite 3D Mobile'
                : '2D Accessible Mode'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#F4F8FC] mt-1">
            MindCare NER Spatial Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-[#B7C5D6]">
            Drag to rotate the central core or click any of the 9 spatial zones to explore its dedicated environment.
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
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  performanceMode === mode
                    ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                    : 'text-[#B7C5D6] hover:text-[#F4F8FC]'
                }`}
              >
                {mode === 'FULL_3D' ? 'Full 3D' : mode === 'LITE_3D' ? 'Lite 3D' : '2D Mode'}
              </button>
            ))}
          </div>

          {/* Auto Rotation Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setIsAutoRotating(!isAutoRotating);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1.5 ${
              isAutoRotating
                ? 'bg-[#14283D] border-[#19C3B1] text-[#38D9C5]'
                : 'bg-[#14283D] border-[#243A50] text-[#B7C5D6]'
            }`}
            title="Toggle Auto-Rotation"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isAutoRotating ? 'Rotating' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas / 2D Fallback View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Canvas Render Area (8 Columns) */}
        <div className="lg:col-span-8 relative bg-[#07111F] rounded-2xl border border-[#243A50] overflow-hidden flex items-center justify-center p-2 min-h-[420px] sm:min-h-[480px]">
          {performanceMode !== '2D_MODE' ? (
            <>
              <canvas
                ref={canvasRef}
                width={680}
                height={480}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleCanvasMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={handleCanvasClick}
                className="w-full h-auto max-w-[680px] max-h-[480px] cursor-grab active:cursor-grabbing touch-none select-none"
              />
              <div className="absolute bottom-3 left-3 bg-[#101F31]/80 backdrop-blur-xs border border-[#243A50] px-3 py-1 rounded-full text-[10px] font-bold text-[#7F91A6] pointer-events-none">
                💡 Drag to rotate scene • Click node to focus
              </div>
            </>
          ) : (
            /* 2D Fallback Grid for Accessibility & Reduced Motion */
            <div className="w-full p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredZones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedZone(z);
                    if (onSelectZone) onSelectZone(z);
                  }}
                  className={`p-4 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                    selectedZone?.id === z.id
                      ? 'bg-[#14283D] border-[#19C3B1] text-[#38D9C5]'
                      : 'bg-[#101F31] border-[#243A50] text-[#B7C5D6] hover:bg-[#14283D]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{z.emoji}</span>
                    <h4 className="font-black text-xs text-[#F4F8FC] truncate">{z.name}</h4>
                  </div>
                  <span className="text-[10px] text-[#7F91A6] block">{z.tagline}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Spatial Zone Details Inspector Card (4 Columns) */}
        <div className="lg:col-span-4 bg-[#14283D] rounded-2xl border border-[#243A50] p-6 space-y-4 text-left">
          {selectedZone ? (
            <>
              <div className="flex items-center justify-between border-b border-[#243A50] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{selectedZone.emoji}</span>
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
                <span className="text-[10px] font-black uppercase text-[#7F91A6] block">
                  Overview:
                </span>
                <p className="text-xs text-[#B7C5D6] leading-relaxed">
                  {selectedZone.fullDesc}
                </p>
              </div>

              <div className="p-3 bg-[#101F31] rounded-xl border border-[#243A50] flex items-center justify-between">
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
              <p className="text-xs">Click any node on the 3D Nexus to inspect details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
