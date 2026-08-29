import React from 'react';
import { Eye, HandMetal, BatteryCharging, ShieldCheck, Heart } from 'lucide-react';

export const ProductIntroduction: React.FC = () => {
  return (
    <div
      id="product-story-intro-section"
      className="relative min-h-[75vh] flex flex-col justify-center px-4 sm:px-8 py-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-6 text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f3ff] border border-[#dae1ff] text-[#455f88] text-xs font-black uppercase tracking-wider">
            <HandMetal className="w-3.5 h-3.5 text-[#006767]" />
            <span>Ergonomic Senior Design</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001849] tracking-tight">
              Designed for simplicity.
            </h2>
            <p className="text-lg sm:text-xl font-bold text-[#006767]">
              Every curve, contrast ratio, and touch target crafted for aging hands and vision.
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#3e4948] leading-relaxed">
            Unlike standard consumer tablets with cluttered home screens and confusing gestures,
            MindCare NER provides a dedicated, calming cognitive interface. Generous negative space,
            zero accidental-close swipe traps, and a tactile distress assistance button guarantee peace of mind.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 bg-white rounded-2xl border border-[#dae1ff] shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[#006767]">
                <Eye className="w-4 h-4" />
                <h4 className="font-extrabold text-sm text-[#001849]">Large High-Contrast Font</h4>
              </div>
              <p className="text-xs text-[#455f88] leading-relaxed">
                WCAG 2.2 AAA compliant typography with 24px+ base touch targets and bold icon indicators.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#dae1ff] shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[#0284c7]">
                <BatteryCharging className="w-4 h-4" />
                <h4 className="font-extrabold text-sm text-[#001849]">Drop-In Magnetic Dock</h4>
              </div>
              <p className="text-xs text-[#455f88] leading-relaxed">
                Effortless charging without struggling with small cables or fragile USB ports.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#dae1ff] shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[#16a34a]">
                <ShieldCheck className="w-4 h-4" />
                <h4 className="font-extrabold text-sm text-[#001849]">Tactile Assist Button</h4>
              </div>
              <p className="text-xs text-[#455f88] leading-relaxed">
                Physical emergency call button with reassuring haptic response directly notifies Priyanka.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#dae1ff] shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[#7c3aed]">
                <Heart className="w-4 h-4" />
                <h4 className="font-extrabold text-sm text-[#001849]">Comfort Matte Grip</h4>
              </div>
              <p className="text-xs text-[#455f88] leading-relaxed">
                Lightweight warm ceramic chassis prevents hand tremors from causing accidental drops.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 hidden lg:block" />
      </div>
    </div>
  );
};
