import React from 'react';
import {
  ProductColorVariant,
  COLOR_VARIANTS,
  ColorVariantConfig,
} from '../../lib/product-animation';
import { Palette, Check, Sparkles, Shield, Layers } from 'lucide-react';

interface ProductConfigurationProps {
  currentVariant: ProductColorVariant;
  onSelectVariant: (v: ProductColorVariant) => void;
}

export const ProductConfiguration: React.FC<ProductConfigurationProps> = ({
  currentVariant,
  onSelectVariant,
}) => {
  const activeConfig = COLOR_VARIANTS[currentVariant] || COLOR_VARIANTS['pearl-white'];

  return (
    <div
      id="product-story-config-section"
      className="relative min-h-[75vh] flex flex-col justify-center px-4 sm:px-8 py-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-6 text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f3ff] border border-[#dae1ff] text-[#455f88] text-xs font-black uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5 text-[#006767]" />
            <span>Materials & Finishes</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001849] tracking-tight">
              Premium tactile finishes.
            </h2>
            <p className="text-lg sm:text-xl font-bold text-[#006767]">
              Crafted from antimicrobial, smudge-resistant matte composite.
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#3e4948] leading-relaxed">
            Choose from three distinctive finishes engineered specifically to prevent glare, resist fingerprints,
            and provide a warm, comfortable grip in senior hands.
          </p>

          {/* Color Selection Cards */}
          <div className="space-y-3 pt-2">
            {(Object.values(COLOR_VARIANTS) as ColorVariantConfig[]).map((variant) => {
              const isSelected = currentVariant === variant.id;

              return (
                <button
                  key={variant.id}
                  id={`config-variant-${variant.id}`}
                  onClick={() => onSelectVariant(variant.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#006767] ${
                    isSelected
                      ? 'bg-white border-[#006767] shadow-md ring-2 ring-[#006767]/20 scale-[1.01]'
                      : 'bg-white/80 border-[#dae1ff] hover:bg-white hover:border-[#b6d0ff] shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Swatch Pill with Metallic Border */}
                    <div
                      className="w-10 h-10 rounded-2xl border-2 shadow-xs flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: variant.bodyColor,
                        borderColor: variant.frameColor,
                      }}
                    >
                      {isSelected && (
                        <Check
                          className="w-5 h-5"
                          style={{
                            color: variant.id === 'graphite' ? '#ffffff' : '#006767',
                          }}
                        />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-[#001849]">
                          {variant.name}
                        </h4>
                        {isSelected && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#e6f7f7] text-[#006767]">
                            Active Shader
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#455f88] leading-relaxed">
                        {variant.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Finish Specifications Box */}
          <div className="p-4 bg-[#f8f9ff] rounded-2xl border border-[#dae1ff] space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#455f88] font-bold">
              <span>Selected Finish Specifications</span>
              <span className="text-[#006767]">{activeConfig.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 bg-white rounded-xl border border-[#dae1ff]">
                <span className="text-[10px] text-[#455f88] block">Roughness</span>
                <span className="font-bold text-[#001849]">{activeConfig.roughness * 100}%</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-[#dae1ff]">
                <span className="text-[10px] text-[#455f88] block">Metalness</span>
                <span className="font-bold text-[#001849]">{activeConfig.metalness * 100}%</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-[#dae1ff]">
                <span className="text-[10px] text-[#455f88] block">Clearcoat</span>
                <span className="font-bold text-[#001849]">{activeConfig.clearcoat * 100}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 hidden lg:block" />
      </div>
    </div>
  );
};
