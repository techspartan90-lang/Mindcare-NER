import React, { useState } from 'react';
import {
  Shield,
  Layers,
  Gamepad2,
  HelpCircle,
  Users,
  Compass,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Search,
  Eye,
  Lock,
} from 'lucide-react';
import { CulturalContentAdmin } from './CulturalContentAdmin';
import { sound } from '../../services/sound';
import { AuditLog, CognitiveGame } from '../../types';

interface AdminConsoleProps {
  onOpenArchitecture: () => void;
}

const INITIAL_GAMES: CognitiveGame[] = [
  {
    id: 'game_memory_match',
    title: 'North East Cultural Memory Match',
    category: 'MEMORY',
    description: 'Match pairs of traditional North Eastern artifacts, flora, and handlooms.',
    targetSkill: 'Visual Working Memory',
    culturalTheme: 'Assam & Nagaland Crafts',
    iconName: 'Sparkles',
    estimatedMinutes: 3,
    minDifficulty: 'easy',
    maxDifficulty: 'hard',
    instructions: {
      en: 'Find matching pairs of traditional artifacts.',
      as: 'পৰম্পৰাগত সামগ্ৰীৰ যোৰা মিলোৱা।',
      bn: 'ঐতিহ্যবাহী জিনিসের জোড়া মেলান।',
      mni: 'লৈহৌবা পোত্থোকশিং জুতি য়েংশিনবিউ।',
      lus: 'Hmanlai thil inrem thliar rawh.',
      kha: 'Pyniah ki jingshna tynrai.',
      hi: 'पारंपरिक कलाकृतियों के जोड़े मिलाएं।',
    },
  },
  {
    id: 'game_familiar_sounds',
    title: 'Regional Familiar Sound Recognition',
    category: 'SOUND_RECOGNITION',
    description: 'Listen to comforting sounds of Bihu Dhol, weaver looms, and forest rains.',
    targetSkill: 'Auditory Memory & Calming Reminiscence',
    culturalTheme: 'North Eastern Acoustic Landscape',
    iconName: 'Volume2',
    estimatedMinutes: 4,
    minDifficulty: 'easy',
    maxDifficulty: 'medium',
    instructions: {
      en: 'Listen to the sound and choose what makes it.',
      as: 'শব্দটো শুনি কি বস্তু চিনাক্ত কৰক।',
      bn: 'শব্দটি শুনে জিনিসটি চিহ্নিত করুন।',
      mni: 'খোনজেল তারগা কনাগীনি খঙদোকউ।',
      lus: 'A ri ngaithla la thil awmzia thlang rawh.',
      kha: 'Sngap ia ka sur bad jied ia ka.',
      hi: 'आवाज सुनकर पहचानें।',
    },
  },
  {
    id: 'game_daily_routine',
    title: 'Daily Routine Step Sequencing',
    category: 'DAILY_RECALL',
    description: 'Re-order morning routines like brushing teeth, morning tea, and medicine.',
    targetSkill: 'Sequential Recall & Reassurance',
    culturalTheme: 'Elder Daily Life in Guwahati',
    iconName: 'Clock',
    estimatedMinutes: 3,
    minDifficulty: 'easy',
    maxDifficulty: 'medium',
    instructions: {
      en: 'Put the daily routine steps in the correct order.',
      as: 'দৈনন্দিন কামবোৰ সঠিক ক্ৰমত সজাওক।',
      bn: 'দৈনন্দিন কাজগুলো সঠিক ক্রমানুসারে সাজান।',
      mni: 'নুমিৎ খুদিংগী থবকশিং অয়াবা মতুংইন্না থম্বিউ।',
      lus: 'Nitip thil tih tur tlar dik rawh.',
      kha: 'Buh ryntih ia ki kam ba man ka sngi.',
      hi: 'दिनचर्या के चरणों को सही क्रम में रखें।',
    },
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_01',
    userId: 'admin_dr_ananya',
    userName: 'Dr. Ananya Goswami',
    userRole: 'ADMIN',
    action: 'CULTURAL_CONTENT_UPDATED',
    resource: 'CulturalItem',
    resourceId: 'cult_1',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    metadata: { state: 'Assam', item: 'Phulam Gamosa' },
  },
  {
    id: 'aud_02',
    userId: 'user_priyanka',
    userName: 'Priyanka Borah',
    userRole: 'CAREGIVER',
    action: 'MEMORY_ITEM_CREATED',
    resource: 'FamilyMemoryItem',
    resourceId: 'fam_4',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    metadata: { type: 'MILESTONE', title: 'Golden Jubilee Bihu' },
  },
  {
    id: 'aud_03',
    userId: 'system_edge_sync',
    userName: 'Offline Edge Daemon',
    userRole: 'ADMIN',
    action: 'OFFLINE_BATCH_SYNC',
    resource: 'GameSession',
    resourceId: 'batch_73',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    metadata: { syncedCount: 3, status: 'SUCCESS' },
  },
];

export const AdminConsole: React.FC<AdminConsoleProps> = ({ onOpenArchitecture }) => {
  const [activeTab, setActiveTab] = useState<'GAMES' | 'REGIONAL_CONTENT' | 'USERS' | 'AUDIT'>('GAMES');
  const [games, setGames] = useState<CognitiveGame[]>(INITIAL_GAMES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 text-left text-[#F4F8FC]">
      {/* Top Header */}
      <div className="bg-[#101F31] rounded-3xl p-6 sm:p-8 border border-[#243A50] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#14283D] text-[#F4B740] border border-[#243A50] flex items-center justify-center shadow-xs">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#F4F8FC]">
                MindCare NER Management Console
              </h2>
              <span className="bg-[#14283D] text-[#F4B740] border border-[#243A50] text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Admin Control
              </span>
            </div>
            <p className="text-xs font-semibold text-[#B7C5D6]">
              Manage cognitive games, North Eastern cultural repositories, user authorizations, and security audit logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onOpenArchitecture();
            }}
            className="px-4 py-2.5 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] text-xs font-black rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>View Architecture Blueprint</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-[#101F31] p-1.5 rounded-2xl border border-[#243A50]">
        {[
          { id: 'GAMES', label: 'Cognitive Game Catalog', icon: Gamepad2 },
          { id: 'REGIONAL_CONTENT', label: 'North East Cultural Repository', icon: Compass },
          { id: 'USERS', label: 'User & Role Directory', icon: Users },
          { id: 'AUDIT', label: 'Compliance Audit Trail', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#F4B740] text-[#07111F] shadow-xs'
                  : 'text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'GAMES' && (
        <div className="bg-[#101F31] rounded-3xl p-6 sm:p-8 border border-[#243A50] shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#243A50] pb-4">
            <div>
              <h3 className="text-lg font-black text-[#F4F8FC]">Registered Cognitive Games</h3>
              <p className="text-xs text-[#B7C5D6]">
                Multilingual instructional templates and difficulty parameters.
              </p>
            </div>
            <button
              onClick={() => sound.playClick()}
              className="px-3.5 py-2 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] text-xs font-black rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Game Module</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {games.map((g) => (
              <div
                key={g.id}
                className="p-5 rounded-2xl bg-[#14283D] border border-[#243A50] hover:border-[#19C3B1] transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#101F31] text-[#38D9C5] border border-[#243A50]">
                      {g.category}
                    </span>
                    <span className="text-xs text-[#7F91A6] font-semibold">
                      {g.estimatedMinutes} mins
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-[#F4F8FC]">{g.title}</h4>
                  <p className="text-xs text-[#B7C5D6] leading-relaxed">{g.description}</p>
                  <div className="text-[11px] font-semibold text-[#38D9C5] bg-[#101F31] p-2 rounded-lg border border-[#243A50]">
                    Target: {g.targetSkill} • Theme: {g.culturalTheme}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#243A50] flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active in Catalog
                  </span>
                  <button
                    onClick={() => sound.playClick()}
                    className="text-[#B7C5D6] hover:text-[#F4F8FC] font-bold cursor-pointer"
                  >
                    Edit Instructions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'REGIONAL_CONTENT' && <CulturalContentAdmin />}

      {activeTab === 'USERS' && (
        <div className="bg-[#101F31] rounded-3xl p-6 sm:p-8 border border-[#243A50] shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#243A50] pb-4">
            <div>
              <h3 className="text-lg font-black text-[#F4F8FC]">User & Role Permissions Directory</h3>
              <p className="text-xs text-[#B7C5D6]">
                Role-based access matrix across Patients, Caregivers, Healthcare Workers, and Admins.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#243A50] rounded-2xl overflow-hidden">
              <thead className="bg-[#14283D] text-[#F4F8FC] font-black uppercase text-[10px] tracking-wider border-b border-[#243A50]">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">System Role</th>
                  <th className="p-3">Assigned Patient</th>
                  <th className="p-3">Language</th>
                  <th className="p-3">Access Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#243A50]">
                <tr>
                  <td className="p-3 font-bold text-[#F4F8FC]">Dhiren Borah</td>
                  <td className="p-3">
                    <span className="bg-teal-950 text-[#38D9C5] border border-teal-800 px-2 py-0.5 rounded-md font-bold">
                      PATIENT
                    </span>
                  </td>
                  <td className="p-3 text-[#B7C5D6]">Self (Silpukhuri, Guwahati)</td>
                  <td className="p-3 text-[#B7C5D6]">Assamese (as)</td>
                  <td className="p-3 text-emerald-400 font-semibold">Active Session</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#F4F8FC]">Priyanka Borah</td>
                  <td className="p-3">
                    <span className="bg-blue-950 text-[#5BA7FF] border border-blue-800 px-2 py-0.5 rounded-md font-bold">
                      CAREGIVER
                    </span>
                  </td>
                  <td className="p-3 text-[#B7C5D6]">Dhiren Borah (Daughter)</td>
                  <td className="p-3 text-[#B7C5D6]">Assamese & English</td>
                  <td className="p-3 text-emerald-400 font-semibold">Full Family Access</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#F4F8FC]">Dr. Ananya Goswami</td>
                  <td className="p-3">
                    <span className="bg-purple-950 text-[#8B7CFF] border border-purple-800 px-2 py-0.5 rounded-md font-bold">
                      HEALTHCARE_WORKER
                    </span>
                  </td>
                  <td className="p-3 text-[#B7C5D6]">Guwahati Medical College Cohort</td>
                  <td className="p-3 text-[#B7C5D6]">English</td>
                  <td className="p-3 text-emerald-400 font-semibold">Clinical Review & Export</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'AUDIT' && (
        <div className="bg-[#101F31] rounded-3xl p-6 sm:p-8 border border-[#243A50] shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#243A50] pb-4">
            <div>
              <h3 className="text-lg font-black text-[#F4F8FC]">Immutable Security & DPDPA Compliance Logs</h3>
              <p className="text-xs text-[#B7C5D6]">
                Real-time tracking of data modifications, offline edge events, and administrative actions.
              </p>
            </div>
            <button
              onClick={() => sound.playClick()}
              className="p-2 bg-[#14283D] rounded-xl border border-[#243A50] text-[#F4F8FC] hover:bg-[#162B40] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-[#14283D] border border-[#243A50] rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#101F31] rounded-xl border border-[#243A50] text-[#38D9C5]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#F4F8FC]">{log.action}</span>
                      <span className="text-[10px] bg-[#101F31] text-[#38D9C5] border border-[#243A50] px-2 py-0.5 rounded-md font-bold">
                        {log.userRole}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#B7C5D6]">
                      By {log.userName} on {log.resource} ({log.resourceId})
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-[#7F91A6] font-medium">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
