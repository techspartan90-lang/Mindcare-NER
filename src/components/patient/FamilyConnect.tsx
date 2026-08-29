import React, { useState } from 'react';
import {
  Heart,
  PhoneCall,
  Video,
  Volume2,
  Calendar,
  Sparkles,
  Smile,
  MapPin,
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { getTranslation } from '../../services/i18n';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  location: string;
  avatar: string;
  photoUrl: string;
  memoryTag: string;
  voiceNoteText: string;
}

const FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fam_01',
    name: 'Priyanka Borah',
    relationship: 'Daughter (Caregiver)',
    phone: '+91 94350 12345',
    location: 'Guwahati, Assam',
    avatar: '👩‍💼',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60',
    memoryTag: 'Visited last Sunday with fresh homemade pitha',
    voiceNoteText: 'Deuta, hope you drank your afternoon water and enjoyed the garden walk! Love you.',
  },
  {
    id: 'fam_02',
    name: 'Aarav Borah',
    relationship: 'Grandson (Age 9)',
    phone: '+91 94350 12345',
    location: 'Guwahati, Assam',
    avatar: '👦',
    photoUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=500&auto=format&fit=crop&q=60',
    memoryTag: 'Loves hearing your stories about Kaziranga rhinos',
    voiceNoteText: 'Koka! I drew a picture of a rhino for you in school today. I will bring it tomorrow!',
  },
  {
    id: 'fam_03',
    name: 'Rahul Borah',
    relationship: 'Son',
    phone: '+91 98640 54321',
    location: 'Jorhat, Assam',
    avatar: '👨‍💼',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60',
    memoryTag: 'Sent fresh organic tea leaves from Jorhat estate',
    voiceNoteText: 'Deuta, how is your health today? I will visit you this coming weekend for Bihu preparations.',
  },
];

interface FamilyConnectProps {
  currentLang: SupportedLanguage;
}

export const FamilyConnect: React.FC<FamilyConnectProps> = ({ currentLang }) => {
  const [callingMember, setCallingMember] = useState<FamilyMember | null>(null);
  const [playingVoiceNoteId, setPlayingVoiceNoteId] = useState<string | null>(null);
  const t = getTranslation(currentLang);

  const handleCall = (member: FamilyMember) => {
    sound.playClick();
    setCallingMember(member);
    voice.speak(`Calling ${member.name}`, currentLang);
  };

  const handlePlayVoiceNote = (member: FamilyMember) => {
    sound.playClick();
    setPlayingVoiceNoteId(member.id);
    voice.speak(member.voiceNoteText, currentLang, () => {
      setPlayingVoiceNoteId(null);
    });
  };

  return (
    <div id="family-connect-section" className="space-y-6 text-[#F4F8FC]">
      {/* Header Banner */}
      <div className="bg-[#101F31] rounded-3xl p-6 border border-[#243A50] shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#14283D] text-pink-400 border border-[#243A50] flex items-center justify-center text-2xl shadow-xs">
            ❤️
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#F4F8FC]">
              {t.familyTitle}
            </h2>
            <p className="text-sm font-semibold text-[#B7C5D6]">
              Your loving family is always just one touch away
            </p>
          </div>
        </div>
      </div>

      {/* Family Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FAMILY_MEMBERS.map((member) => (
          <div
            key={member.id}
            id={`family-card-${member.id}`}
            className="bg-[#101F31] rounded-3xl overflow-hidden border border-[#243A50] hover:border-[#19C3B1] shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo Card with Avatar Tag */}
              <div className="relative h-44 bg-[#07111F] overflow-hidden">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#101F31]/90 backdrop-blur-xs border border-[#243A50] px-3 py-1 rounded-full text-xs font-black text-[#F4F8FC] flex items-center gap-1.5 shadow-xs">
                  <span>{member.avatar}</span>
                  <span>{member.relationship}</span>
                </div>
              </div>

              {/* Details & Memory Note */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-xl font-black text-[#F4F8FC]">
                    {member.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-[#B7C5D6] mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#38D9C5]" />
                    <span>{member.location}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#14283D] rounded-2xl border border-[#243A50]">
                  <span className="text-[11px] font-black text-[#F4B740] uppercase block mb-0.5">
                    Recent Memory:
                  </span>
                  <p className="text-xs font-medium text-[#B7C5D6]">
                    "{member.memoryTag}"
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons: Voice Note & Speed Dial Call */}
            <div className="p-5 pt-0 space-y-2.5">
              <button
                id={`listen-voice-note-${member.id}`}
                onClick={() => handlePlayVoiceNote(member)}
                className={`w-full min-h-[48px] py-2.5 px-4 rounded-xl text-xs font-black border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  playingVoiceNoteId === member.id
                    ? 'bg-[#19C3B1] text-[#07111F] border-[#19C3B1] animate-pulse'
                    : 'bg-[#14283D] hover:bg-[#162B40] text-[#38D9C5] border-[#243A50]'
                }`}
              >
                <Volume2 className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {playingVoiceNoteId === member.id
                    ? 'Playing Voice Note...'
                    : 'Listen to Voice Message'}
                </span>
              </button>

              <button
                id={`call-family-${member.id}`}
                onClick={() => handleCall(member)}
                className="w-full min-h-[52px] bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] text-sm font-black rounded-xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 stroke-[2.5]" />
                <span>Call {member.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simulated Call Modal */}
      {callingMember && (
        <div className="fixed inset-0 z-50 bg-[#07111F]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101F31] rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl border border-[#243A50] animate-in fade-in zoom-in duration-200 text-[#F4F8FC]">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-[#19C3B1] shadow-lg animate-pulse">
              <img
                src={callingMember.photoUrl}
                alt={callingMember.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-xs font-black text-[#38D9C5] uppercase tracking-wider block mb-1">
                Connecting Call...
              </span>
              <h3 className="text-2xl font-black text-[#F4F8FC]">
                {callingMember.name}
              </h3>
              <p className="text-sm text-[#B7C5D6]">{callingMember.phone}</p>
            </div>

            <button
              id="end-call-btn"
              onClick={() => {
                sound.playClick();
                voice.stopSpeaking();
                setCallingMember(null);
              }}
              className="w-full min-h-[56px] bg-[#FF5C6C] hover:bg-red-600 text-white font-black text-base rounded-2xl shadow-lg transition-transform active:scale-98 cursor-pointer"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
