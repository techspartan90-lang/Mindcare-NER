import React from 'react';
import { Brain, Sparkles, Music, Grid3X3, Clock, CheckCircle2 } from 'lucide-react';

export const CognitiveGames3DSection: React.FC = () => {
  return (
    <div
      id="product-story-games-section"
      className="relative min-h-[80vh] flex flex-col justify-center px-4 sm:px-8 py-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-6 text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6f7f7] border border-[#a2e8e8] text-[#006767] text-xs font-black uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5 text-[#006767]" />
            <span>Clinical Neurostimulation</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001849] tracking-tight">
              Cognitive Activities
            </h2>
            <p className="text-lg sm:text-xl font-bold text-[#006767]">
              Memory • Attention • Patterns • Daily Recall
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#3e4948] leading-relaxed">
            Every game is co-developed with geriatric neurologists to activate specific neural pathways.
            Rather than generic abstract puzzles, all challenges incorporate nostalgic North Eastern folklore,
            regional flora, tea estate fauna, and traditional handloom motifs to stimulate deep autobiographical memory.
          </p>

          {/* 4 Core Stimulation Pillars */}
          <div className="space-y-3 pt-2">
            <div className="p-3.5 bg-white rounded-2xl border border-[#dae1ff] shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e6f7f7] text-[#006767] flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-sm text-[#001849]">Memory & Reminiscence</h4>
                <p className="text-xs text-[#455f88] leading-relaxed">
                  Family photo albums, Assam orchid garden watering, and ancestral village landmark recall.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-[#dae1ff] shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#eff6ff] text-[#0284c7] flex items-center justify-center shrink-0 font-bold">
                2
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-sm text-[#001849]">Auditory Attention & Focus</h4>
                <p className="text-xs text-[#455f88] leading-relaxed">
                  Bihu dhol rhythm matching, Kaziranga bird call identification, and gentle Brahmaputra soundscapes.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-[#dae1ff] shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#faf5ff] text-[#7c3aed] flex items-center justify-center shrink-0 font-bold">
                3
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-sm text-[#001849]">Pattern & Visuospatial Matrix</h4>
                <p className="text-xs text-[#455f88] leading-relaxed">
                  Muga silk weaving symmetries, Naga shawl geometry, and spatial orientation matching.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-[#dae1ff] shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center shrink-0 font-bold">
                4
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-sm text-[#001849]">Daily Routine Recall</h4>
                <p className="text-xs text-[#455f88] leading-relaxed">
                  Sequencing morning chai, blood pressure medication routines, and prayer time recognition.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 hidden lg:block" />
      </div>
    </div>
  );
};
