import React, { useState, useEffect } from 'react';
import {
  Layers,
  ShieldCheck,
  Wifi,
  Database,
  Cpu,
  Mic,
  Activity,
  CheckCircle2,
  Lock,
  RefreshCw,
  Server,
  FileCode,
} from 'lucide-react';
import { AuditLog } from '../../types';
import { sound } from '../../services/sound';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    'diagram' | 'sync' | 'voice' | 'security' | 'audit'
  >('diagram');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/audit-logs')
        .then((r) => r.json())
        .then((res) => {
          if (res.data) setAuditLogs(res.data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="architecture-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto border border-[#dae1ff]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dae1ff] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006767] text-white flex items-center justify-center shadow-xs">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#e2e7ff] text-[#002b74] px-2 py-0.5 rounded-md">
                  PRODUCTION ARCHITECTURE
                </span>
                <span className="text-xs font-bold text-[#455f88]">
                  Technical Architecture Explorer
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#001849]">
                MindCare NER System Blueprint
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#f2f3ff] text-[#001849] font-bold flex items-center justify-center hover:bg-[#eaedff]"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#dae1ff]">
          {[
            { id: 'diagram', label: '1. Full Stack Architecture' },
            { id: 'sync', label: '2. Offline Sync Protocol' },
            { id: 'voice', label: '3. Voice AI Pipeline' },
            { id: 'security', label: '4. Security & RBAC' },
            { id: 'audit', label: '5. Live Audit Trail' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#006767] text-white shadow-xs'
                  : 'bg-[#f2f3ff] text-[#455f88] hover:bg-[#eaedff]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Tabs */}
        {activeTab === 'diagram' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-black text-sm text-[#001849]">
              High-Level Multi-Tier Architectural Topology
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tier 1: Client PWA */}
              <div className="p-4 rounded-2xl bg-[#faf8ff] border-2 border-[#dae1ff] space-y-2">
                <div className="flex items-center gap-2 text-[#006767] font-black uppercase">
                  <Cpu className="w-4 h-4" /> Client App (PWA)
                </div>
                <ul className="space-y-1 text-[#001849] font-medium">
                  <li>• React 19 + TypeScript 5.8</li>
                  <li>• Tailwind CSS Design System</li>
                  <li>• Web Audio API Soundscapes</li>
                  <li>• LocalStorage FIFO Sync Queue</li>
                  <li>• Web Speech API (7 NER Langs)</li>
                </ul>
              </div>

              {/* Tier 2: Edge / Express Backend */}
              <div className="p-4 rounded-2xl bg-[#eef7ff] border-2 border-[#b6d0ff] space-y-2">
                <div className="flex items-center gap-2 text-blue-800 font-black uppercase">
                  <Server className="w-4 h-4" /> Express 4 Backend
                </div>
                <ul className="space-y-1 text-[#001849] font-medium">
                  <li>• Batch Sync Reconciliation</li>
                  <li>• RBAC Authorization Guard</li>
                  <li>• Telemetry & Audit Ingestion</li>
                  <li>• Clinical Report Formatter</li>
                  <li>• Vite Production Bundle Proxy</li>
                </ul>
              </div>

              {/* Tier 3: AI Intelligence Engine */}
              <div className="p-4 rounded-2xl bg-[#f0fdf4] border-2 border-[#86efac] space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-black uppercase">
                  <Cpu className="w-4 h-4" /> Gemini 3.7 Flash Engine
                </div>
                <ul className="space-y-1 text-[#001849] font-medium">
                  <li>• Adaptive Game Difficulty Engine</li>
                  <li>• Conversational Care Companion</li>
                  <li>• Multilingual Translation Synthesizer</li>
                  <li>• Non-Diagnostic Trajectory Notes</li>
                  <li>• Strict System Instructions</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-black text-sm text-[#001849]">
              Offline-First Synchronization Protocol
            </h3>
            <p className="text-[#455f88] leading-relaxed">
              Designed specifically for hilly and remote terrain in the North Eastern Region where mobile networks fluctuate frequently.
            </p>

            <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#dae1ff] space-y-3 font-mono">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <span>[Client Action]</span> ➔ Patient completes Memory Game offline
              </div>
              <div className="flex items-center gap-2 text-blue-700 font-bold pl-4">
                <span>↓</span> Encrypted item stored in Local Queue (Key: mindcare_sync_queue)
              </div>
              <div className="flex items-center gap-2 text-amber-700 font-bold pl-8">
                <span>↓</span> Network Listener detects reconnection (navigator.onLine)
              </div>
              <div className="flex items-center gap-2 text-purple-700 font-bold pl-12">
                <span>↓</span> POST /api/sync with batch items
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-bold pl-16">
                <span>↓</span> Server reconciles idempotently & updates lastSyncedAt
              </div>
            </div>
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-black text-sm text-[#001849]">
              Multilingual Voice Assistant Architecture
            </h3>
            <p className="text-[#455f88]">
              Supports 7 languages across North East India: Assamese, Bengali, Manipuri, Khasi, Mizo, Hindi, and English.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#f2f3ff] rounded-2xl border">
                <span className="font-black text-[#001849] block">Speech Recognition</span>
                <p className="text-[#455f88] mt-1">
                  Browser Web Speech API with fallback intent matcher for regional queries.
                </p>
              </div>
              <div className="p-3.5 bg-[#f2f3ff] rounded-2xl border">
                <span className="font-black text-[#001849] block">Gemini Natural Language</span>
                <p className="text-[#455f88] mt-1">
                  Gemini 3.7 Flash responds with respectful, culturally grounded 2-sentence voice answers.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-black text-sm text-[#001849]">
              Security & Role-Based Access Control (RBAC)
            </h3>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#dae1ff] text-[#455f88] font-bold">
                  <th className="pb-2">Capability</th>
                  <th className="pb-2">Patient</th>
                  <th className="pb-2">Caregiver</th>
                  <th className="pb-2">Doctor</th>
                  <th className="pb-2">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dae1ff] font-medium">
                <tr>
                  <td className="py-2">Play Cognitive Games</td>
                  <td className="text-emerald-700 font-bold">✓ Full</td>
                  <td>View</td>
                  <td>View</td>
                  <td>View</td>
                </tr>
                <tr>
                  <td className="py-2">Manage Reminders</td>
                  <td>Acknowledge</td>
                  <td className="text-emerald-700 font-bold">✓ Edit/Add</td>
                  <td className="text-emerald-700 font-bold">✓ Prescribe</td>
                  <td>Full</td>
                </tr>
                <tr>
                  <td className="py-2">Export Clinical Reports</td>
                  <td>No</td>
                  <td>Summary</td>
                  <td className="text-emerald-700 font-bold">✓ Full PDF</td>
                  <td>Full</td>
                </tr>
                <tr>
                  <td className="py-2">Geofence Safe-Zone Config</td>
                  <td>No</td>
                  <td className="text-emerald-700 font-bold">✓ Configure</td>
                  <td>View</td>
                  <td>Full</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-black text-sm text-[#001849]">
              Live Immutable Audit Trail Logs
            </h3>
            <div className="max-h-60 overflow-y-auto divide-y divide-[#dae1ff] border border-[#dae1ff] rounded-2xl">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-white flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#001849]">{log.action}</span>
                    <p className="text-[11px] text-[#455f88]">
                      By {log.userName} ({log.userRole}) • {log.resource} ({log.resourceId})
                    </p>
                  </div>
                  <span className="text-[11px] text-[#455f88]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
