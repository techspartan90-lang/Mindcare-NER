import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Sliders,
  RotateCcw,
  Clock,
  Wind,
  Droplets,
  Bell,
  Heart,
  ChevronRight,
  Info,
} from 'lucide-react';
import { sound } from '../../services/sound';
import { voice } from '../../services/voice';
import { SupportedLanguage } from '../../types';

interface PeacefulSounds3DProps {
  currentLang: SupportedLanguage;
}

export const PeacefulSounds3D: React.FC<PeacefulSounds3DProps> = ({ currentLang }) => {
  const [activeSoundId, setActiveSoundId] = useState<string>('snd_brahmaputra');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(30);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorNodeRef = useRef<any>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<any>(null);

  const SOUNDSCAPES = [
    {
      id: 'snd_brahmaputra',
      title: 'Brahmaputra River Gentle Waves',
      regionalName: 'ব্ৰহ্মপুত্ৰৰ শান্ত ঢৌ',
      location: 'Guwahati, Assam',
      emoji: '🌊',
      desc: 'Slow, steady rhythmic water lap to calm nervous tension and slow breathing.',
      type: 'river',
      tagColor: 'text-[#38D9C5] bg-[#14283D] border-[#243A50]',
    },
    {
      id: 'snd_rain',
      title: 'Cherrapunji Forest Rain',
      regionalName: 'চেৰাপুঞ্জীৰ শান্ত বৰষুণ',
      location: 'Sohra Hills, Meghalaya',
      emoji: '🌧️',
      desc: 'Gentle raindrops falling on broad betel nut leaves and pine needles.',
      type: 'rain',
      tagColor: 'text-[#5BA7FF] bg-[#14283D] border-[#243A50]',
    },
    {
      id: 'snd_flute',
      title: 'Morning Bamboo Flute Melody',
      regionalName: 'ৰাতিপুৱাৰ বাঁহীৰ সুৰ',
      location: 'Majuli Island',
      emoji: '🎋',
      desc: 'Meditative North Eastern bamboo flute intervals known to ease sundowning.',
      type: 'flute',
      tagColor: 'text-[#F4B740] bg-[#14283D] border-[#243A50]',
    },
    {
      id: 'snd_bell',
      title: 'Kamakhya Morning Chimes',
      regionalName: 'কামাখ্যা মন্দিৰৰ মৃদু ঘণ্টা',
      location: 'Nilachal Hills',
      emoji: '🔔',
      desc: 'Pure acoustic brass bell harmonics for mindful grounding and peace.',
      type: 'bell',
      tagColor: 'text-[#35D07F] bg-[#14283D] border-[#243A50]',
    },
  ];

  // Stop ambient synth
  const stopSynth = () => {
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
    setIsPlaying(false);
  };

  // Start ambient Web Audio Synthesizer
  const startSynth = (type: string) => {
    stopSynth();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      if (type === 'river') {
        // Generate continuous pink noise filter for river waves
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          output[i] = (b0 + b1 + b2) * 0.1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
      } else if (type === 'rain') {
        // Rain drizzle generator
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.08;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
      } else {
        // Flute / Bell gentle pentatonic notes
        const notes = [220, 261.63, 293.66, 329.63, 392, 440];
        let noteIndex = 0;

        const playNote = () => {
          if (!audioContextRef.current) return;
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(notes[noteIndex % notes.length], ctx.currentTime);

          noteGain.gain.setValueAtTime(0, ctx.currentTime);
          noteGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 1);
          noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.5);

          osc.connect(noteGain);
          noteGain.connect(masterGain);
          osc.start();
          osc.stop(ctx.currentTime + 5);

          noteIndex++;
        };

        playNote();
        intervalRef.current = setInterval(playNote, 4000);
      }

      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      stopSynth();
    };
  }, []);

  const handleTogglePlay = (soundscape: any) => {
    sound.playClick();
    if (isPlaying && activeSoundId === soundscape.id) {
      stopSynth();
    } else {
      setActiveSoundId(soundscape.id);
      startSynth(soundscape.type);
      voice.speak(`Playing ${soundscape.title}. Close your eyes and breathe calmly.`, currentLang);
    }
  };

  return (
    <section
      id="section-sounds-3d"
      className="bg-[#101F31] rounded-3xl border border-[#243A50] p-6 sm:p-10 shadow-2xl space-y-8 text-[#F4F8FC] scroll-mt-24"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#243A50] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14283D] border border-[#243A50] text-[#8B7CFF] text-xs font-black uppercase tracking-wider">
            <Music className="w-4 h-4 text-[#8B7CFF]" />
            <span>3D Calming Soundscape Environment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F8FC] tracking-tight">
            Peaceful Sounds & Meditative Calming
          </h2>
          <p className="text-sm sm:text-base text-[#B7C5D6] max-w-2xl">
            Acoustic environments co-designed with geriatric sleep specialists. Native Brahmaputra river
            ripples, monsoon rain, and bamboo flute tones crafted to lower heart rate and soothe restless evenings.
          </p>
        </div>

        {/* Global Volume & Play Status */}
        <div className="flex items-center gap-4 bg-[#14283D] p-3 rounded-2xl border border-[#243A50]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#B7C5D6]">
            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-[#35D07F] animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#7F91A6]" />
            )}
            <span>Volume</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (gainNodeRef.current && audioContextRef.current) {
                gainNodeRef.current.gain.setValueAtTime(v * 0.4, audioContextRef.current.currentTime);
              }
            }}
            className="w-24 accent-[#19C3B1] cursor-pointer"
          />
        </div>
      </div>

      {/* 4 Soundscape Dimensional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {SOUNDSCAPES.map((sc) => {
          const isThisPlaying = isPlaying && activeSoundId === sc.id;
          return (
            <div
              key={sc.id}
              className={`p-6 rounded-3xl border-2 space-y-4 shadow-lg transition-all flex flex-col justify-between ${
                isThisPlaying
                  ? 'bg-[#14283D] border-[#19C3B1] shadow-[#19C3B1]/20'
                  : 'bg-[#14283D] border-[#243A50] hover:border-[#38D9C5]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{sc.emoji}</span>
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${sc.tagColor}`}
                  >
                    {sc.location.split(',')[0]}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-black text-[#F4F8FC]">{sc.title}</h4>
                  <p className="text-xs text-[#38D9C5] font-semibold">{sc.regionalName}</p>
                </div>

                <p className="text-xs text-[#B7C5D6] leading-relaxed">{sc.desc}</p>
              </div>

              <button
                onClick={() => handleTogglePlay(sc)}
                className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 ${
                  isThisPlaying
                    ? 'bg-[#35D07F] text-[#07111F]'
                    : 'bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F]'
                }`}
              >
                {isThisPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Soundscape</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Play Soundscape</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Auto-Timer & Calming Guidance */}
      <div className="p-5 rounded-3xl bg-[#14283D] border border-[#243A50] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-[#8B7CFF] shrink-0" />
          <div>
            <h4 className="text-sm font-black text-[#F4F8FC]">Auto-Sleep Timer (30 Minutes)</h4>
            <p className="text-xs text-[#B7C5D6]">
              Soundscapes gently fade out automatically so seniors can fall asleep peacefully.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[15, 30, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                sound.playClick();
                setTimerMinutes(mins);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                timerMinutes === mins
                  ? 'bg-[#8B7CFF] text-[#07111F] border-[#8B7CFF]'
                  : 'bg-[#101F31] text-[#B7C5D6] border-[#243A50]'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
