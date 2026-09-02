import React, { useState } from 'react';
import {
  Heart,
  PhoneCall,
  Volume2,
  Calendar,
  Sparkles,
  Smile,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Users,
} from 'lucide-react';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';
import { SupportedLanguage } from '../../types';

interface FamilyConnect3DProps {
  currentLang: SupportedLanguage;
}

export const FamilyConnect3D: React.FC<FamilyConnect3DProps> = ({ currentLang }) => {
  const [activeVoiceNoteId, setActiveVoiceNoteId] = useState<string | null>(null);
  const [callModalMember, setCallModalMember] = useState<any | null>(null);

  const FAMILY_NODES = [
    {
      id: 'priyanka',
      name: 'Priyanka Borah',
      role: 'Daughter & Primary Caregiver',
      location: 'Guwahati, Assam (12 km away)',
      avatarEmoji: '👩‍💼',
      avatarColor: 'border-[#38D9C5] bg-[#14283D]',
      status: 'Online • Checked Routine 15m ago',
      lastNote: 'Deuta, hope you drank your afternoon water and enjoyed the garden walk! Love you.',
    },
    {
      id: 'aarav',
      name: 'Aarav Borah',
      role: 'Grandson (Age 9)',
      location: 'Guwahati, Assam',
      avatarEmoji: '👦',
      avatarColor: 'border-[#5BA7FF] bg-[#14283D]',
      status: 'School hours • Sent drawing note',
      lastNote: 'Koka! I drew a picture of a rhino for you in school today. I will bring it tomorrow!',
    },
    {
      id: 'rahul',
      name: 'Rahul Borah',
      role: 'Son (Living in Jorhat)',
      location: 'Jorhat, Assam (Tea Estate)',
      avatarEmoji: '👨‍💼',
      avatarColor: 'border-[#F4B740] bg-[#14283D]',
      status: 'Active • Sent organic tea package',
      lastNote: 'Deuta, how is your health today? I will visit you this coming weekend for Bihu preparations.',
    },
    {
      id: 'dr_sharma',
      name: 'Dr. Ananya Sharma',
      role: 'Geriatric Neurologist, GMCH',
      location: 'Gauhati Medical College Hospital',
      avatarEmoji: '🩺',
      avatarColor: 'border-[#35D07F] bg-[#14283D]',
      status: 'Clinical Telemetry Synchronized',
      lastNote: 'Dhiren-da is maintaining steady cognitive adherence. Next checkup scheduled in 2 weeks.',
    },
  ];

  const handlePlayVoiceNote = (node: any) => {
    sound.playClick();
    setActiveVoiceNoteId(node.id);
    voice.speak(node.lastNote, currentLang, () => {
      setActiveVoiceNoteId(null);
    });
  };

  const handleInitiateCall = (node: any) => {
    sound.playClick();
    setCallModalMember(node);
    voice.speak(`Connecting voice call to ${node.name}`, currentLang);
  };

  return (
    <section
      id="section-family-3d"
      className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#243A50] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14283D] border border-[#243A50] text-[#35D07F] text-xs font-black uppercase tracking-wider">
            <Users className="w-4 h-4 text-[#35D07F]" />
            <span>3D Family Connect Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            You Are Always Connected
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6] max-w-2xl">
            A dimensional network connecting senior, family members, caregivers, and clinicians.
            One-touch voice notes, reassuring presence updates, and peace-of-mind care alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-[#14283D] rounded-2xl border border-[#243A50] text-xs font-bold text-[#35D07F]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#35D07F] animate-pulse" />
          <span>4 Caregivers & Clinicians Connected</span>
        </div>
      </div>

      {/* 3D Connected Family Avatar Network Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {FAMILY_NODES.map((node) => (
          <div
            key={node.id}
            className="p-6 rounded-3xl bg-[#14283D] border border-[#243A50] hover:border-[#19C3B1] space-y-4 shadow-lg transition-all hover:scale-[1.02] flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Avatar Sphere */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl border-2 ${node.avatarColor} flex items-center justify-center text-2xl shadow-inner shrink-0`}
                >
                  {node.avatarEmoji}
                </div>
                <div>
                  <h4 className="text-base font-black text-[#F4F8FC]">{node.name}</h4>
                  <p className="text-xs text-[#38D9C5] font-semibold">{node.role}</p>
                </div>
              </div>

              {/* Status */}
              <div className="p-2.5 rounded-xl bg-[#101F31] border border-[#243A50] text-[11px] text-[#B7C5D6] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#35D07F] shrink-0" />
                <span className="truncate">{node.status}</span>
              </div>

              {/* Last Voice Note Preview */}
              <div className="p-3 rounded-2xl bg-[#101F31] border border-[#243A50] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#7F91A6] font-bold">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-[#38D9C5]" />
                    <span>Recent Voice Note</span>
                  </span>
                  <span>Audio</span>
                </div>
                <p className="text-xs text-[#F4F8FC] italic line-clamp-2">"{node.lastNote}"</p>
                <button
                  onClick={() => handlePlayVoiceNote(node)}
                  className={`w-full py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    activeVoiceNoteId === node.id
                      ? 'bg-[#35D07F] text-[#07111F] font-black'
                      : 'bg-[#14283D] border border-[#243A50] hover:border-[#38D9C5] text-[#38D9C5]'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{activeVoiceNoteId === node.id ? 'Playing...' : 'Listen to Voice'}</span>
                </button>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => handleInitiateCall(node)}
              className="w-full py-2.5 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 mt-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>One-Tap Call {node.name.split(' ')[0]}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Call Simulator Modal */}
      {callModalMember && (
        <div
          className="fixed inset-0 z-50 bg-[#07111F]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#101F31] border border-[#243A50] rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 rounded-full border-4 border-[#35D07F] bg-[#14283D] flex items-center justify-center text-4xl mx-auto animate-pulse">
              {callModalMember.avatarEmoji}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#35D07F]">
                Connecting High-Priority Care Call
              </span>
              <h3 className="text-2xl font-black text-[#F4F8FC]">{callModalMember.name}</h3>
              <p className="text-xs text-[#B7C5D6]">{callModalMember.role}</p>
            </div>

            <p className="text-xs text-[#B7C5D6] bg-[#14283D] p-3 rounded-2xl border border-[#243A50]">
              Dialing via secure regional VoIP bridge with offline automatic fallback.
            </p>

            <button
              onClick={() => {
                sound.playClick();
                setCallModalMember(null);
                voice.speak('Call ended.', currentLang);
              }}
              className="w-full py-3 bg-[#E05252] hover:bg-[#E05252]/90 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
