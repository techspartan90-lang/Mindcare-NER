import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  Volume2,
  Sparkles,
  Heart,
  RotateCcw,
  Headphones,
  Sliders,
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { getTranslation } from '../../services/i18n';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';

interface Soundscape {
  id: string;
  title: string;
  regionalTitle: string;
  description: string;
  emoji: string;
  region: string;
  bgGradient: string;
  accentColor: string;
  type: 'flute' | 'river' | 'rain' | 'temple_bell' | 'birds';
}

const SOUNDSCAPES: Soundscape[] = [
  {
    id: 'snd_brahmaputra',
    title: 'Brahmaputra River Gentle Waves',
    regionalTitle: 'ব্ৰহ্মপুত্ৰৰ শান্ত ঢৌ',
    description: 'Rhythmic, gentle water ripples flowing past peaceful riverbanks in Assam.',
    emoji: '🌊',
    region: 'Guwahati, Assam',
    bgGradient: 'from-teal-600 to-cyan-800',
    accentColor: 'border-teal-400',
    type: 'river',
  },
  {
    id: 'snd_monsoon',
    title: 'Cherrapunji Forest Rain',
    regionalTitle: 'চেৰাপুঞ্জীৰ শান্ত বৰষুণ',
    description: 'Gentle raindrops falling on broad betel leaves and lush green pine forest.',
    emoji: '🌧️',
    region: 'Meghalaya Hills',
    bgGradient: 'from-slate-700 to-indigo-950',
    accentColor: 'border-indigo-400',
    type: 'rain',
  },
  {
    id: 'snd_bamboo_flute',
    title: 'Morning Bamboo Flute Melody',
    regionalTitle: 'ৰাতিপুৱাৰ বাঁহীৰ সুৰ',
    description: 'Traditional soothing meditative flute melodies to calm anxiety and ease sundowning.',
    emoji: '🎋',
    region: 'Majuli Island',
    bgGradient: 'from-amber-600 to-orange-800',
    accentColor: 'border-amber-400',
    type: 'flute',
  },
  {
    id: 'snd_temple_chimes',
    title: 'Kamakhya Morning Chimes',
    regionalTitle: 'কামাখ্যা মন্দিৰৰ মৃদু ঘণ্টা',
    description: 'Slow, pure harmonic resonance of brass bells for mindful grounding.',
    emoji: '🔔',
    region: 'Nilachal Hill',
    bgGradient: 'from-emerald-700 to-teal-900',
    accentColor: 'border-emerald-400',
    type: 'temple_bell',
  },
];

interface MusicTherapyProps {
  currentLang: SupportedLanguage;
}

export const MusicTherapy: React.FC<MusicTherapyProps> = ({ currentLang }) => {
  const [activeSoundscape, setActiveSoundscape] = useState<Soundscape | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorNodeRef = useRef<any>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<any>(null);
  const t = getTranslation(currentLang);

  // Web Audio Synthesizer for natural soothing ambient soundscapes
  const startAmbientSynth = (type: Soundscape['type']) => {
    stopAmbientSynth();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      if (type === 'flute') {
        // Pentatonic peaceful notes sequence
        const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C D E G A C
        let noteIdx = 0;

        const playFluteNote = () => {
          if (!audioContextRef.current) return;
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          osc.type = 'sine';
          const freq = notes[noteIdx % notes.length];
          noteIdx = Math.floor(Math.random() * notes.length);

          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
          noteGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.2);
          noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.8);

          osc.connect(noteGain);
          noteGain.connect(masterGain);
          osc.start();
          osc.stop(ctx.currentTime + 4.0);
        };

        playFluteNote();
        intervalRef.current = setInterval(playFluteNote, 3600);
      } else if (type === 'temple_bell') {
        // Pure harmonic brass bell
        const playBell = () => {
          if (!audioContextRef.current) return;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const bellGain = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz Love/Grounding tone
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1056, ctx.currentTime);

          bellGain.gain.setValueAtTime(0.2, ctx.currentTime);
          bellGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.5);

          osc1.connect(bellGain);
          osc2.connect(bellGain);
          bellGain.connect(masterGain);

          osc1.start();
          osc2.start();
          osc1.stop(ctx.currentTime + 5.0);
          osc2.stop(ctx.currentTime + 5.0);
        };

        playBell();
        intervalRef.current = setInterval(playBell, 4500);
      } else if (type === 'river' || type === 'rain') {
        // Pink noise generator for gentle water/rain
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.06;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = type === 'river' ? 'lowpass' : 'bandpass';
        filter.frequency.setValueAtTime(type === 'river' ? 380 : 800, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
        oscillatorNodeRef.current = whiteNoise;
      }
    } catch (e) {
      console.warn('Web Audio Synth failed:', e);
    }
  };

  const stopAmbientSynth = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientSynth();
    };
  }, []);

  const handleSelectSoundscape = (s: Soundscape) => {
    sound.playClick();
    if (activeSoundscape?.id === s.id && isPlaying) {
      // Pause
      stopAmbientSynth();
      setIsPlaying(false);
    } else {
      setActiveSoundscape(s);
      setIsPlaying(true);
      startAmbientSynth(s.type);
      voice.speak(`Playing ${s.title}`, currentLang);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        newVol * 0.15,
        audioContextRef.current.currentTime,
      );
    }
  };

  return (
    <div id="music-therapy-view" className="space-y-6 text-[#F4F8FC]">
      {/* Header Banner */}
      <div className="bg-[#101F31] rounded-3xl p-6 border border-[#243A50] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#14283D] text-[#38D9C5] border border-[#243A50] flex items-center justify-center shadow-xs">
            <Headphones className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#F4F8FC]">
              Peaceful North East Soundscapes
            </h2>
            <p className="text-sm font-semibold text-[#B7C5D6]">
              Therapeutic audio designed to soothe evening restlessness and sundowning
            </p>
          </div>
        </div>

        {/* Volume Slider */}
        {isPlaying && (
          <div className="flex items-center gap-2 bg-[#14283D] px-4 py-2 rounded-2xl border border-[#243A50]">
            <Volume2 className="w-4 h-4 text-[#38D9C5]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-24 accent-[#19C3B1] cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Currently Playing Hero Card */}
      {activeSoundscape && (
        <div
          className={`rounded-3xl p-6 sm:p-8 text-[#F4F8FC] bg-[#14283D] border-2 border-[#19C3B1] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6`}
        >
          <div className="space-y-2 text-center sm:text-left">
            <span className="bg-[#101F31] text-[#38D9C5] border border-[#243A50] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              {isPlaying ? 'Now Soothing Mind' : 'Paused'}
            </span>
            <h3 className="text-3xl font-black text-[#F4F8FC]">{activeSoundscape.title}</h3>
            <p className="text-[#B7C5D6] text-base max-w-lg">
              {activeSoundscape.description}
            </p>
            <span className="text-xs text-[#7F91A6] block font-bold">
              Origin: {activeSoundscape.region}
            </span>
          </div>

          <button
            id="toggle-playback-btn"
            onClick={() => {
              sound.playClick();
              if (isPlaying) {
                stopAmbientSynth();
                setIsPlaying(false);
              } else {
                startAmbientSynth(activeSoundscape.type);
                setIsPlaying(true);
              }
            }}
            className="w-20 h-20 rounded-full bg-[#19C3B1] text-[#07111F] hover:bg-[#38D9C5] flex items-center justify-center shadow-2xl transition-transform active:scale-95 shrink-0 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-9 h-9 fill-current" />
            ) : (
              <Play className="w-9 h-9 fill-current ml-1" />
            )}
          </button>
        </div>
      )}

      {/* Soundscapes Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SOUNDSCAPES.map((snd) => {
          const isActive = activeSoundscape?.id === snd.id;

          return (
            <div
              key={snd.id}
              id={`soundscape-card-${snd.id}`}
              onClick={() => handleSelectSoundscape(snd)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-md flex items-center justify-between gap-4 ${
                isActive
                  ? 'bg-[#14283D] border-[#19C3B1] ring-2 ring-[#19C3B1]/40'
                  : 'bg-[#101F31] border-[#243A50] hover:border-[#19C3B1] hover:bg-[#14283D]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#14283D] border border-[#243A50] flex items-center justify-center text-3xl shrink-0">
                  {snd.emoji}
                </div>
                <div>
                  <h4 className="font-black text-base text-[#F4F8FC]">
                    {snd.title}
                  </h4>
                  <span className="text-xs font-bold text-[#38D9C5] block">
                    {snd.regionalTitle}
                  </span>
                  <p className="text-xs text-[#B7C5D6] line-clamp-1 mt-0.5">
                    {snd.description}
                  </p>
                </div>
              </div>

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isActive && isPlaying
                    ? 'bg-[#19C3B1] text-[#07111F] animate-pulse'
                    : 'bg-[#14283D] text-[#B7C5D6] border border-[#243A50]'
                }`}
              >
                {isActive && isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
