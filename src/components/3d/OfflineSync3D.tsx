import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  Cloud,
  HardDrive,
  ShieldCheck,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';
import { SupportedLanguage } from '../../types';

interface OfflineSync3DProps {
  currentLang: SupportedLanguage;
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const OfflineSync3D: React.FC<OfflineSync3DProps> = ({
  currentLang,
  isOffline,
  onToggleOffline,
}) => {
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);
  const [offlineRecordsCount, setOfflineRecordsCount] = useState(14);

  const handleSimulateSync = () => {
    sound.playClick();
    setIsSimulatingSync(true);
    setTimeout(() => {
      sound.playSuccess();
      setIsSimulatingSync(false);
      setOfflineRecordsCount(0);
      voice.speak(
        'Cellular connection restored. All 14 offline cognitive records synced securely with cloud database.',
        currentLang,
      );
    }, 1500);
  };

  return (
    <section
      id="section-offline-3d"
      className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#243A50] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14283D] border border-[#243A50] text-[#38D9C5] text-xs font-black uppercase tracking-wider">
            <HardDrive className="w-4 h-4 text-[#38D9C5]" />
            <span>100% Offline-First Edge Resilience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            Built for North East Monsoon & Hill Isolation
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6] max-w-2xl">
            MindCare NER embeds an autonomous on-device SQLite database and neural inference pipeline.
            Elderly seniors in Dima Hasao, Tawang, or Majuli experience zero lag and zero interruption,
            even during heavy rainstorm blackouts.
          </p>
        </div>

        {/* Live Simulation Switch */}
        <button
          onClick={() => {
            sound.playClick();
            onToggleOffline();
          }}
          className={`px-4 py-2.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer shadow-lg ${
            isOffline
              ? 'bg-[#E05252]/20 border-[#E05252] text-[#F4F8FC]'
              : 'bg-[#35D07F]/20 border-[#35D07F] text-[#F4F8FC]'
          }`}
        >
          {isOffline ? (
            <WifiOff className="w-5 h-5 text-[#E05252]" />
          ) : (
            <Wifi className="w-5 h-5 text-[#35D07F]" />
          )}
          <div className="text-left text-xs">
            <span className="font-black block">
              {isOffline ? 'Simulating Monsoon Blackout (Offline)' : 'Cellular Connected (Online)'}
            </span>
            <span className="text-[10px] text-[#B7C5D6]">Tap to toggle network state</span>
          </div>
        </button>
      </div>

      {/* 3D Flow Visualization: Home -> Local Device -> Local Processing -> Cloud Sync */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Step 1: Senior Valley Home */}
        <div className="p-5 rounded-3xl bg-[#14283D] border border-[#243A50] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#101F31] border border-[#243A50] text-2xl flex items-center justify-center">
            🏡
          </div>
          <span className="text-xs font-black text-[#38D9C5]">Stage 1 • Local Home</span>
          <h4 className="text-base font-black text-[#F4F8FC]">Senior Interacts</h4>
          <p className="text-xs text-[#B7C5D6] leading-relaxed">
            Senior opens memory activities, logs water, listens to flute melodies on their tablet.
          </p>
        </div>

        {/* Step 2: Edge Database */}
        <div className="p-5 rounded-3xl bg-[#14283D] border border-[#243A50] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#101F31] border border-[#243A50] text-2xl flex items-center justify-center">
            💾
          </div>
          <span className="text-xs font-black text-[#5BA7FF]">Stage 2 • On-Device Engine</span>
          <h4 className="text-base font-black text-[#F4F8FC]">Instant Local Storage</h4>
          <p className="text-xs text-[#B7C5D6] leading-relaxed">
            All latency, response accuracy, and audio alarms process 100% locally in under 4ms.
          </p>
        </div>

        {/* Step 3: Neural Inference */}
        <div className="p-5 rounded-3xl bg-[#14283D] border border-[#243A50] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#101F31] border border-[#243A50] text-2xl flex items-center justify-center">
            🧠
          </div>
          <span className="text-xs font-black text-[#F4B740]">Stage 3 • Edge DDA</span>
          <h4 className="text-base font-black text-[#F4F8FC]">Zero-Cloud AI Pacing</h4>
          <p className="text-xs text-[#B7C5D6] leading-relaxed">
            Dynamic difficulty adjustment eliminates frustration without needing an internet connection.
          </p>
        </div>

        {/* Step 4: Secure Cloud Bridge */}
        <div
          className={`p-5 rounded-3xl border space-y-3 transition-all ${
            isOffline
              ? 'bg-[#14283D]/50 border-dashed border-[#E05252] text-[#B7C5D6]'
              : 'bg-[#14283D] border-[#35D07F] text-[#F4F8FC]'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#101F31] border border-[#243A50] text-2xl flex items-center justify-center">
            {isOffline ? '🌧️' : '☁️'}
          </div>
          <span
            className={`text-xs font-black ${isOffline ? 'text-[#E05252]' : 'text-[#35D07F]'}`}
          >
            Stage 4 • Encrypted Sync
          </span>
          <h4 className="text-base font-black text-[#F4F8FC]">
            {isOffline ? 'Queued On-Device' : 'Live Cloud Sync'}
          </h4>
          <p className="text-xs text-[#B7C5D6] leading-relaxed">
            {isOffline
              ? `${offlineRecordsCount} records safely queued in encrypted memory.`
              : 'Telemetry synchronized with GMCH portal & daughter Priyanka.'}
          </p>
        </div>
      </div>

      {/* Interactive Sync Trigger Banner */}
      <div className="p-6 rounded-3xl bg-[#14283D] border border-[#243A50] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#101F31] border border-[#243A50] text-[#38D9C5] flex items-center justify-center shrink-0">
            <RefreshCw
              className={`w-6 h-6 ${isSimulatingSync ? 'animate-spin text-[#35D07F]' : ''}`}
            />
          </div>
          <div>
            <h4 className="text-base font-black text-[#F4F8FC]">
              {isOffline
                ? 'Offline Queue Active (Safe Local Persistence)'
                : 'All Telemetry In Sync'}
            </h4>
            <p className="text-xs text-[#B7C5D6]">
              {isOffline
                ? 'No internet required. Senior continues normal activities uninterrupted.'
                : 'Zero data packet loss across remote hilly terrain.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulateSync}
          disabled={isSimulatingSync}
          className="px-5 py-3 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] font-black text-xs rounded-xl shadow-lg cursor-pointer transition-all active:scale-95 whitespace-nowrap"
        >
          {isSimulatingSync ? 'Encrypting & Syncing...' : 'Simulate Background Sync'}
        </button>
      </div>
    </section>
  );
};
