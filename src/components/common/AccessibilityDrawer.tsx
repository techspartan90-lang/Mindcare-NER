import React from 'react';
import {
  Accessibility,
  Eye,
  Type,
  Mic,
  Activity,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { AccessibilityMode } from '../../types';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';

interface AccessibilityDrawerProps {
  isOpen: boolean;
  currentMode: AccessibilityMode;
  onSelectMode: (mode: AccessibilityMode) => void;
  onClose: () => void;
}

const MODES: {
  id: AccessibilityMode;
  name: string;
  description: string;
  icon: any;
  badgeColor: string;
}[] = [
  {
    id: 'STANDARD',
    name: 'Standard Elderly-First UI',
    description: 'Clean high-contrast layout, balanced typography, soft soothing colors.',
    icon: Eye,
    badgeColor: 'bg-slate-100 text-slate-800',
  },
  {
    id: 'LARGE_TEXT',
    name: 'Large Text & High Legibility',
    description: 'Enlarged font scales (1.3x), increased spacing, extra-large touch targets (≥56px).',
    icon: Type,
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'HIGH_CONTRAST',
    name: 'High Contrast Mode',
    description: 'Deep contrast dark navy backgrounds with radiant amber & cyan indicators for visual impairments.',
    icon: Accessibility,
    badgeColor: 'bg-amber-100 text-amber-900',
  },
  {
    id: 'VOICE_FIRST',
    name: 'Voice-First Mode',
    description: 'Continuous voice guidance, auto-narrated instructions, and automatic speech recognition prompt.',
    icon: Mic,
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'REDUCED_MOTION',
    name: 'Reduced Motion Mode',
    description: 'Disables spinning animations, parallax, and transitions for users prone to dizziness or vestibular sensitivity.',
    icon: Activity,
    badgeColor: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'LOW_LITERACY',
    name: 'Low-Literacy & Pictorial Mode',
    description: 'Replaces long text with massive pictorial icons, short verbal audio cues, and zero complex menus.',
    icon: ImageIcon,
    badgeColor: 'bg-rose-100 text-rose-800',
  },
];

export const AccessibilityDrawer: React.FC<AccessibilityDrawerProps> = ({
  isOpen,
  currentMode,
  onSelectMode,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleSelect = (mode: AccessibilityMode) => {
    sound.playClick();
    onSelectMode(mode);
    voice.speak(`Switched to ${mode.replace('_', ' ').toLowerCase()} mode.`, 'en');
  };

  return (
    <div
      id="accessibility-drawer-backdrop"
      className="fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-xs"
    >
      <div
        id="accessibility-drawer-panel"
        className="w-full max-w-md bg-white h-full shadow-2xl p-6 sm:p-7 flex flex-col justify-between overflow-y-auto border-l-2 border-[#dae1ff] text-left"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#dae1ff] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#006767] text-white flex items-center justify-center font-bold">
                <Accessibility className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#001849]">Accessibility Suite</h3>
                <span className="text-xs font-bold text-[#455f88]">
                  Adaptive display & cognitive modes
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#f2f4fc] hover:bg-[#eaedff] flex items-center justify-center text-[#455f88] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Selector List */}
          <div className="space-y-3">
            {MODES.map((item) => {
              const isSelected = currentMode === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  id={`accessibility-mode-btn-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 shadow-2xs active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-[#f0fdf4] border-emerald-600 ring-2 ring-emerald-500'
                      : 'bg-white border-[#dae1ff] hover:border-[#006767]'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-[#f2f4fc] text-[#455f88]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm sm:text-base text-[#001849]">
                        {item.name}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                    </div>
                    <p className="text-xs font-medium text-[#455f88] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-[#dae1ff] text-xs text-[#455f88] font-semibold space-y-2">
          <p>
            💡 <span className="font-bold">Persistent Setting:</span> Your choice is automatically saved and remembered across sessions.
          </p>
          <button
            onClick={onClose}
            className="w-full min-h-[44px] bg-[#001849] hover:bg-[#002b74] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xs"
          >
            Apply & Close Suite
          </button>
        </div>
      </div>
    </div>
  );
};
