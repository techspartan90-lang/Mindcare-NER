import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Wifi,
  WifiOff,
  UserCheck,
  CheckCircle,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { SimulationArchetype } from '../../types';
import { sound } from '../../services/sound';

interface DemonstrationModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySimulation: (type: SimulationArchetype) => void;
}

const SIMULATIONS: {
  type: SimulationArchetype;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  keyBehaviors: string[];
  aiAdaptation: string;
}[] = [
  {
    type: 'HIGH_ENGAGEMENT',
    title: 'Profile 1: High Cognitive Engagement & Active Streak',
    badge: 'High Performance Archetype',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description:
      'Patient completes daily activities consistently with 92% accuracy, quick response times, and an 18-day active streak.',
    keyBehaviors: [
      'High accuracy on memory & sequence puzzles',
      'Consistent morning and afternoon participation',
      'Memory Garden blooming at Stage 4 (Nahar Tree full)',
    ],
    aiAdaptation:
      'AI Personalization Engine adapts by unlocking Medium/Hard difficulty, adding complex rhythm sequences, and reducing hint prompts.',
  },
  {
    type: 'MODERATE_ENGAGEMENT',
    title: 'Profile 2: Steady Moderate Engagement',
    badge: 'Standard Baseline Archetype',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    description:
      'Patient engages 3-4 times per week with balanced 75% accuracy and moderate pacing.',
    keyBehaviors: [
      'Enjoys Cultural Memory Match and Daily Routine Sequencing',
      'Occasional reminder snoozes',
      'Stable cognitive trajectory over 30 days',
    ],
    aiAdaptation:
      'AI maintains Easy-Medium difficulty, balances visual and audio games, and optimizes reminder times to 09:00 AM.',
  },
  {
    type: 'LOW_ENGAGEMENT',
    title: 'Profile 3: Gentle Support & High Need (MCI Supportive)',
    badge: 'High Need / Low-Stress Archetype',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description:
      'Patient experiences lower energy, occasional confusion with complex grids, and benefits from voice-first support.',
    keyBehaviors: [
      'Prefers familiar sound recognition and 2x2 memory cards',
      'Frequent voice prompts and audio replay usage',
      'Benefits from emotional check-ins and one-tap caregiver help',
    ],
    aiAdaptation:
      'AI reduces difficulty to Gentle/Easy, activates prominent voice guidance, and prioritizes familiar family album photos.',
  },
  {
    type: 'OFFLINE_MODE',
    title: 'Profile 4: Rural Remote North-East (Full Offline Edge)',
    badge: 'Zero Network Resilience Archetype',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    description:
      'Simulates an elder living in a remote hill district with zero cellular connectivity for 72 hours.',
    keyBehaviors: [
      'All games, voice synthesis, and reminders execute 100% locally',
      'Sessions queued into offline IndexedDB queue (8 items pending)',
      'Simulate auto-sync & conflict resolution upon reconnecting',
    ],
    aiAdaptation:
      'Local rule-based fallback engine operates completely on-device without crashing or stalling.',
  },
];

export const DemonstrationModeModal: React.FC<DemonstrationModeModalProps> = ({
  isOpen,
  onClose,
  onApplySimulation,
}) => {
  const [selectedType, setSelectedType] = useState<SimulationArchetype>('HIGH_ENGAGEMENT');

  if (!isOpen) return null;

  const handleApply = (type: SimulationArchetype) => {
    sound.playClick();
    setSelectedType(type);
    onApplySimulation(type);
    sound.playSuccess();
    onClose();
  };

  return (
    <div
      id="demonstration-mode-modal"
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border-2 border-[#dae1ff] shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dae1ff] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#006767] to-[#001849] text-white flex items-center justify-center font-black shadow-md">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#001849]">
                  Cognitive Simulation & Demonstration Sandbox
                </h3>
                <span className="bg-amber-50 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Evaluation Mode
                </span>
              </div>
              <p className="text-xs font-semibold text-[#455f88]">
                Switch patient archetypes in real-time to evaluate the Adaptive AI Engine & Offline Resilience.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#f2f4fc] hover:bg-[#eaedff] flex items-center justify-center text-[#455f88] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Evaluation Archetype Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SIMULATIONS.map((sim) => {
            const isSelected = selectedType === sim.type;
            return (
              <div
                key={sim.type}
                className={`p-5 rounded-2xl border-2 transition-all space-y-3 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#006767] bg-[#f2f4fc] shadow-md ring-2 ring-[#006767]/20'
                    : 'border-[#dae1ff] bg-white hover:border-[#869fc4]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${sim.badgeColor}`}
                    >
                      {sim.badge}
                    </span>
                    {sim.type === 'OFFLINE_MODE' ? (
                      <WifiOff className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Wifi className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>

                  <h4 className="font-extrabold text-sm text-[#001849]">{sim.title}</h4>
                  <p className="text-xs text-[#455f88] leading-relaxed">{sim.description}</p>

                  <div className="space-y-1 pt-1">
                    <p className="text-[11px] font-bold text-[#001849]">Simulated Behaviors:</p>
                    <ul className="text-[11px] text-[#455f88] space-y-0.5 list-disc list-inside">
                      {sim.keyBehaviors.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#dae1ff]/60 space-y-2">
                  <div className="p-2 bg-white rounded-xl border border-[#dae1ff] text-[11px] text-[#006767] font-medium">
                    <span className="font-bold">Adaptive Action: </span>
                    {sim.aiAdaptation}
                  </div>

                  <button
                    onClick={() => handleApply(sim.type)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#006767] text-white shadow-xs'
                        : 'bg-[#001849] hover:bg-[#002b74] text-white'
                    }`}
                  >
                    <span>Apply Archetype Live</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Notice Banner */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Evaluation Sandbox Notice:</strong> Switching simulation archetypes dynamically adapts local metrics, cognitive streak, and offline edge queues without altering real clinical databases.
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#dae1ff]">
          <p className="text-[11px] text-[#869fc4] font-medium">
            Controlled Demonstration Environment • All simulations adhere strictly to non-diagnostic ethics.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#f2f4fc] hover:bg-[#eaedff] text-[#001849] font-bold text-xs rounded-xl cursor-pointer"
          >
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
};
