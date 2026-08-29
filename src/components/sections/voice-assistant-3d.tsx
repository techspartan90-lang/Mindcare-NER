import React from 'react';
import { Mic, Volume2, Globe, Sparkles, MessageSquare } from 'lucide-react';

export const VoiceAssistant3DSection: React.FC = () => {
  return (
    <div
      id="product-story-voice-section"
      className="relative min-h-[80vh] flex flex-col justify-center px-4 sm:px-8 py-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-6 text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a] text-xs font-black uppercase tracking-wider">
            <Mic className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Dual Beamforming Audio</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001849] tracking-tight">
              Voice Assistant
            </h2>
            <p className="text-lg sm:text-xl font-bold text-[#006767]">
              Natural conversations in 7 indigenous North Eastern languages.
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#3e4948] leading-relaxed">
            For elders who find touchscreen typing exhausting or confusing, MindCare NER’s voice engine
            responds like a compassionate family companion. Top-mounted dual beamforming microphones
            filter out domestic background noise (fans, television, street sounds) for flawless recognition.
          </p>

          {/* Interactive Voice Demonstration Preview */}
          <div className="p-4 bg-white rounded-2xl border border-[#dae1ff] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#455f88] uppercase tracking-wider">
                Live Speech Dialogue Example
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#e6f7f7] text-[#006767]">
                অসমীয়া (Assamese)
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#f8f9ff] border border-[#dae1ff] text-[#001849]">
                <p className="font-bold text-[#006767] mb-0.5">Elder Dhiren:</p>
                <p className="italic">"মই আজি ঔষধ খাইছোঁ নে?" (Did I take my medicine today?)</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#e6f7f7] border border-[#a2e8e8] text-[#001849]">
                <p className="font-bold text-[#006767] mb-0.5">MindCare Voice:</p>
                <p className="font-medium">
                  "নমস্কাৰ ধীৰেন দা! আপুনি ৰাতিপুৱাৰ ঔষধ ৮:৩০ বজাত খাইছে। এতিয়া আবেলিৰ চাহৰ সময়।"
                </p>
                <p className="text-[11px] text-[#455f88] mt-1">
                  (Greetings Dhiren da! You took your morning medication at 8:30 AM. It is now time for afternoon tea.)
                </p>
              </div>
            </div>
          </div>

          {/* 7 Regional Languages Pills */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-[#455f88]">Native Acoustic Support:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'অসমীয়া (Assamese)',
                'বাংলা (Bengali)',
                'মৈতৈলোন্ (Manipuri)',
                'Mizo ṭawng (Mizo)',
                'Ka Ktien Khasi (Khasi)',
                'हिन्दी (Hindi)',
                'English',
              ].map((lang) => (
                <span
                  key={lang}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#dae1ff] text-[11px] font-bold text-[#001849] shadow-2xs"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 hidden lg:block" />
      </div>
    </div>
  );
};
