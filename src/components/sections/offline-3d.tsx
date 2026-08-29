import React from 'react';
import { WifiOff, Database, RefreshCw, Lock, ShieldCheck, MapPin } from 'lucide-react';

export const Offline3DSection: React.FC = () => {
  return (
    <div
      id="product-story-offline-section"
      className="relative min-h-[80vh] flex flex-col justify-center px-4 sm:px-8 py-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-6 text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff7ed] border border-[#fed7aa] text-[#c2410c] text-xs font-black uppercase tracking-wider">
            <WifiOff className="w-3.5 h-3.5 text-[#c2410c]" />
            <span>Zero-Connectivity Edge Resilience</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001849] tracking-tight">
              Works with limited connectivity.
            </h2>
            <p className="text-lg sm:text-xl font-bold text-[#006767]">
              Offline Mode • Local Activity Storage • Automatic Synchronization
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#3e4948] leading-relaxed">
            In remote hill districts like Dima Hasao, Tawang, or Majuli river islands, cellular networks
            are frequently unavailable. MindCare NER operates 100% locally on the device—storing audio libraries,
            voice prompts, and session results in encrypted internal memory. When Wi-Fi or mobile data reconnects,
            it safely synchronizes with zero data loss.
          </p>

          {/* 3 Core Edge Capabilities */}
          <div className="space-y-3 pt-2">
            <div className="p-4 bg-white rounded-2xl border border-[#dae1ff] shadow-xs flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#fff7ed] text-[#c2410c] shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-[#001849]">
                  Local IndexedDB & SQLite Engine
                </h4>
                <p className="text-xs text-[#455f88] leading-relaxed">
                  Entire game catalogs, patient profiles, memory albums, and sound files are cached locally for zero latency.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#dae1ff] shadow-xs flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#f0fdf4] text-[#16a34a] shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-[#001849]">
                  Silent Background Sync Protocol
                </h4>
                <p className="text-xs text-[#455f88] leading-relaxed">
                  Queued activities, medication confirmations, and safety telemetry upload automatically when network is detected.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#dae1ff] shadow-xs flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#e6f7f7] text-[#006767] shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-[#001849]">
                  AES-256 Client-Side Encryption
                </h4>
                <p className="text-xs text-[#455f88] leading-relaxed">
                  DPDPA 2023 compliant data protection guarantees that all private family photos and health logs remain strictly confidential.
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
