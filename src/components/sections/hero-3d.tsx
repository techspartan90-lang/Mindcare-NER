import React from 'react';
import { Brain, Sparkles, Shield, Compass, Heart, ArrowDown } from 'lucide-react';
import { ProductColorVariant } from '../../lib/product-animation';

interface Hero3DProps {
  onScrollDown: () => void;
  onSelectVariant: (v: ProductColorVariant) => void;
  currentVariant: ProductColorVariant;
}

export const Hero3D: React.FC<Hero3DProps> = ({
  onScrollDown,
  onSelectVariant,
  currentVariant,
}) => {
  return (
    <div
      id="product-story-hero-section"
      className="relative min-h-[85vh] flex flex-col justify-center px-4 sm:px-8 py-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Copy Panel */}
        <div className="lg:col-span-6 space-y-6 text-left z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f7f7] border border-[#a2e8e8] text-[#006767] text-xs font-black tracking-wide uppercase shadow-xs">
            <Sparkles className="w-4 h-4 text-[#006767]" />
            <span>Healthcare Electronics • Smart Care Tablet</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#001849] tracking-tight leading-tight">
              MINDCARE <span className="text-[#006767]">NER</span>
            </h1>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#455f88] tracking-tight">
              Remember. Engage. Connect.
            </p>
          </div>

          <p className="text-base sm:text-lg text-[#3e4948] leading-relaxed max-w-xl font-normal">
            A purpose-built smart cognitive care tablet engineered for elderly individuals
            in North East India experiencing memory loss, mild cognitive impairment (MCI),
            or early dementia. Combining tactile ergonomics with clinically guided AI.
          </p>

          {/* Key Hardware & Clinical Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-white rounded-2xl border border-[#dae1ff] shadow-xs space-y-1">
              <span className="text-xs font-bold text-[#006767] uppercase tracking-wider block">Display</span>
              <p className="text-sm font-extrabold text-[#001849]">Anti-Glare IPS</p>
              <span className="text-[11px] text-[#455f88] block">Senior High-Contrast</span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-[#dae1ff] shadow-xs space-y-1">
              <span className="text-xs font-bold text-[#0284c7] uppercase tracking-wider block">Languages</span>
              <p className="text-sm font-extrabold text-[#001849]">7 Regional</p>
              <span className="text-[11px] text-[#455f88] block">Assamese, Mizo, Khasi+</span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-[#dae1ff] shadow-xs space-y-1 col-span-2 sm:col-span-1">
              <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block">Offline</span>
              <p className="text-sm font-extrabold text-[#001849]">Edge Engine</p>
              <span className="text-[11px] text-[#455f88] block">Zero-Network Ready</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              id="hero-scroll-story-btn"
              onClick={onScrollDown}
              className="px-6 py-3.5 bg-[#006767] hover:bg-[#005151] text-white font-extrabold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <span>Explore Features</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-[#dae1ff] shadow-xs">
              <span className="text-xs font-bold text-[#455f88] px-2.5">Finish:</span>
              <button
                onClick={() => onSelectVariant('pearl-white')}
                title="Pearl White Finish"
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  currentVariant === 'pearl-white' ? 'border-[#006767] scale-110 shadow-xs' : 'border-gray-300'
                } bg-[#f4f7f9]`}
              />
              <button
                onClick={() => onSelectVariant('soft-blue')}
                title="Soft Blue Finish"
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  currentVariant === 'soft-blue' ? 'border-[#006767] scale-110 shadow-xs' : 'border-gray-300'
                } bg-[#dce7f5]`}
              />
              <button
                onClick={() => onSelectVariant('graphite')}
                title="Graphite Finish"
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  currentVariant === 'graphite' ? 'border-[#006767] scale-110 shadow-xs' : 'border-gray-300'
                } bg-[#2c3440]`}
              />
            </div>
          </div>
        </div>

        {/* Right Area (Empty placeholder spacing for sticky 3D canvas on desktop) */}
        <div className="lg:col-span-6 hidden lg:block" />
      </div>
    </div>
  );
};
