import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { SpatialZoneConfig } from './types';
import { SPATIAL_ZONES } from './zonesData';
import { sound } from '../../services/sound';

interface WebGLFallbackProps {
  selectedZone: SpatialZoneConfig | null;
  onSelectZone: (zone: SpatialZoneConfig) => void;
  onNavigateSection: (sectionId: string) => void;
  filteredZones?: SpatialZoneConfig[];
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = ({
  selectedZone,
  onSelectZone,
  onNavigateSection,
  filteredZones = SPATIAL_ZONES,
}) => {
  return (
    <div
      role="region"
      aria-label="MindCare NER 2D Spatial Overview"
      className="w-full p-4 sm:p-6 space-y-6 bg-[#07111F] rounded-2xl border border-[#243A50]"
    >
      <div className="flex items-center justify-between border-b border-[#243A50] pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#38D9C5]" />
          <h3 className="text-sm font-black uppercase text-[#F4F8FC] tracking-wider">
            Accessible Spatial Map (2D Mode)
          </h3>
        </div>
        <span className="text-[11px] font-bold text-[#7F91A6]">
          {filteredZones.length} Connected Cognitive Zones
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredZones.map((zone) => {
          const isSelected = selectedZone?.id === zone.id;

          return (
            <div
              key={zone.id}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              aria-label={`${zone.name}: ${zone.tagline}`}
              onClick={() => {
                sound.playClick();
                onSelectZone(zone);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  sound.playClick();
                  onSelectZone(zone);
                }
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer text-left space-y-2 focus:outline-none focus:ring-2 focus:ring-[#19C3B1] ${
                isSelected
                  ? 'bg-[#14283D] border-[#19C3B1] shadow-md shadow-[#19C3B1]/10'
                  : 'bg-[#101F31] border-[#243A50] hover:bg-[#14283D] hover:border-[#38D9C5]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl" aria-hidden="true">
                    {zone.emoji}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#F4F8FC]">{zone.name}</h4>
                    <span className="text-[10px] font-bold text-[#38D9C5]">{zone.tagline}</span>
                  </div>
                </div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: zone.color }}
                  aria-hidden="true"
                />
              </div>

              <p className="text-xs text-[#B7C5D6] leading-relaxed line-clamp-2">
                {zone.shortDesc}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-[#243A50]/60">
                <span className="text-[10px] font-black text-[#7F91A6]">
                  {zone.keyMetric}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    onNavigateSection(zone.targetSectionId);
                  }}
                  className="text-xs font-bold text-[#38D9C5] hover:text-[#F4F8FC] flex items-center gap-1 cursor-pointer focus:underline"
                >
                  <span>Open</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
