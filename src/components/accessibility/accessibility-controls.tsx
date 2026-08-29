import React from 'react';
import { AccessibilityMode } from '../../types';
import {
  Sliders,
  Type,
  Sun,
  Volume2,
  Minimize2,
  BookOpen,
  Check,
} from 'lucide-react';
import { sound } from '../../services/sound';

interface AccessibilityControlsProps {
  currentMode: AccessibilityMode;
  onSelectMode: (mode: AccessibilityMode) => void;
  fontSize: 'normal' | 'large' | 'extra-large';
  onFontSizeChange: (size: 'normal' | 'large' | 'extra-large') => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  currentMode,
  onSelectMode,
  fontSize,
  onFontSizeChange,
  reducedMotion,
  onToggleReducedMotion,
  highContrast,
  onToggleHighContrast,
}) => {
  return (
    <div
      id="accessibility-quick-bar"
      className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#dae1ff] p-3 shadow-md text-[#001849]"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-[#001849] uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-[#006767]" />
          <span>Accessibility Bar</span>
        </div>
        {reducedMotion && (
          <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
            Reduced Motion Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Large Text */}
        <button
          onClick={() => {
            sound.playClick();
            onFontSizeChange(fontSize === 'large' ? 'normal' : 'large');
          }}
          className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-between cursor-pointer transition-all ${
            fontSize !== 'normal'
              ? 'bg-[#006767] text-white border-[#006767]'
              : 'bg-[#f0f4ff] border-[#dae1ff] text-[#001849] hover:bg-[#eaedff]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" />
            <span>Large Text</span>
          </div>
          {fontSize !== 'normal' && <Check className="w-3.5 h-3.5" />}
        </button>

        {/* High Contrast */}
        <button
          onClick={() => {
            sound.playClick();
            onToggleHighContrast();
          }}
          className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-between cursor-pointer transition-all ${
            highContrast
              ? 'bg-[#001849] text-white border-[#001849]'
              : 'bg-[#f0f4ff] border-[#dae1ff] text-[#001849] hover:bg-[#eaedff]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5" />
            <span>High Contrast</span>
          </div>
          {highContrast && <Check className="w-3.5 h-3.5" />}
        </button>

        {/* Reduced Motion */}
        <button
          onClick={() => {
            sound.playClick();
            onToggleReducedMotion();
          }}
          className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-between cursor-pointer transition-all ${
            reducedMotion
              ? 'bg-[#006767] text-white border-[#006767]'
              : 'bg-[#f0f4ff] border-[#dae1ff] text-[#001849] hover:bg-[#eaedff]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Reduced Motion</span>
          </div>
          {reducedMotion && <Check className="w-3.5 h-3.5" />}
        </button>

        {/* Voice First */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectMode(currentMode === 'VOICE_FIRST' ? 'STANDARD' : 'VOICE_FIRST');
          }}
          className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-between cursor-pointer transition-all ${
            currentMode === 'VOICE_FIRST'
              ? 'bg-[#006767] text-white border-[#006767]'
              : 'bg-[#f0f4ff] border-[#dae1ff] text-[#001849] hover:bg-[#eaedff]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voice First</span>
          </div>
          {currentMode === 'VOICE_FIRST' && <Check className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
