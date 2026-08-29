import React from 'react';
import { Cpu, TrendingUp, Sparkles, Sliders, ShieldCheck } from 'lucide-react';

export const AdaptiveAI3DSection: React.FC = () => {
  return (
    <div
      id="product-story-ai-section"
      className="relative min-h-[80vh] flex flex-col justify-center px-4 sm:px-8 py-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-6 text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf5ff] border border-[#e9d5ff] text-[#9333ea] text-xs font-black uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-[#9333ea]" />
            <span>On-Device Neural Engine</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001849] tracking-tight">
              Adaptive AI
            </h2>
            <p className="text-lg sm:text-xl font-bold text-[#006767]">
              Continuous micro-calibration to prevent anxiety and cognitive fatigue.
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#3e4948] leading-relaxed">
            Every elderly patient has unique good days and fatigue days. Our lightweight on-device
            neural algorithm evaluates reaction time variability, error patterns, and voice hesitation
            in real time—seamlessly scaling game complexity up or down to keep sessions uplifting and rewarding.
          </p>

          {/* Real-time Dynamic Adjustment Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 bg-white rounded-2xl border border-[#dae1ff] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-[#006767]">
                <Sliders className="w-4 h-4" />
                <h4 className="font-extrabold text-sm text-[#001849]">Zero-Frustration Guard</h4>
              </div>
              <p className="text-xs text-[#455f88] leading-relaxed">
                If an elder hesitates for over 4 seconds, the system provides gentle visual and auditory hints automatically.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#dae1ff] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-[#0284c7]">
                <TrendingUp className="w-4 h-4" />
                <h4 className="font-extrabold text-sm text-[#001849]">Latency Drift Detection</h4>
              </div>
              <p className="text-xs text-[#455f88] leading-relaxed">
                Tracks subtle month-over-month motor and cognitive changes to assist doctors in early MCI intervention.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#dae1ff] shadow-xs space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#001849]">Personalized Routine Matrix</span>
                <span className="text-[11px] font-bold text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded-full">
                  Updated Hourly
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#455f88] bg-[#f8f9ff] p-2.5 rounded-xl">
                <Sparkles className="w-4 h-4 text-[#006767] shrink-0" />
                <span>
                  Morning: High-contrast visual focus • Afternoon: Nostalgic melody recall • Evening: Calming river soundscape
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 hidden lg:block" />
      </div>
    </div>
  );
};
