import React from 'react';
import { Html } from '@react-three/drei';

interface FloatingTextProps {
  text: string;
  subtext?: string;
  emoji?: string;
  color?: string;
  position?: [number, number, number];
  isSelected?: boolean;
  isHovered?: boolean;
}

export const FloatingText: React.FC<FloatingTextProps> = ({
  text,
  subtext,
  emoji,
  color = '#38D9C5',
  position = [0, 0, 0],
  isSelected = false,
  isHovered = false,
}) => {
  return (
    <group position={position}>
      <Html
        center
        distanceFactor={12}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          transition: 'all 0.25s ease-out',
        }}
      >
        <div
          className={`flex flex-col items-center px-3 py-1.5 rounded-xl backdrop-blur-md border transition-all ${
            isSelected
              ? 'bg-[#101F31]/90 border-[#19C3B1] shadow-lg shadow-[#19C3B1]/20 scale-110'
              : isHovered
              ? 'bg-[#14283D]/90 border-[#38D9C5] scale-105'
              : 'bg-[#0B1726]/75 border-[#243A50]/60 scale-95 opacity-85'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {emoji && <span className="text-sm">{emoji}</span>}
            <span
              className="font-extrabold text-[11px] tracking-wide"
              style={{ color: isSelected ? '#38D9C5' : '#F4F8FC' }}
            >
              {text}
            </span>
          </div>
          {subtext && (
            <span className="text-[9px] text-[#B7C5D6] font-medium mt-0.5">{subtext}</span>
          )}
        </div>
      </Html>
    </group>
  );
};
