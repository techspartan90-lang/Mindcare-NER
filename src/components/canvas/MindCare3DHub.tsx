import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Brain,
  Sparkles,
  HeartHandshake,
  Stethoscope,
  Clock,
  Volume2,
  Bell,
  WifiOff,
  Shield,
  HelpCircle,
  Flower2,
  Gamepad2,
  Sliders,
  BarChart3,
  Maximize2,
  RotateCcw,
  Eye,
  Info,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { sound } from '../../services/sound';

export interface PavilionZone {
  id: string;
  number: number;
  name: string;
  category: 'core' | 'patient' | 'care' | 'clinical' | 'system';
  icon: any;
  color: string;
  accentColor: string;
  glowColor: string;
  tag: string;
  shortDesc: string;
  fullDesc: string;
  keyMetric: string;
  targetSectionId: string;
  position: [number, number, number]; // 3D coordinates
  orbitRadius: number;
  angle: number;
}

export const PAVILION_ZONES: PavilionZone[] = [
  {
    id: 'zone-patient',
    number: 1,
    name: 'Patient Pavilion',
    category: 'patient',
    icon: Brain,
    color: '#006767',
    accentColor: '#004d4d',
    glowColor: 'rgba(0, 103, 103, 0.4)',
    tag: 'Dignified Living',
    shortDesc: 'Calm, tactile home interface for senior cognitive comfort and independence.',
    fullDesc: 'Dedicated senior-first operating environment with high-contrast typography, large touch targets (64px+), audio greetings, and zero frustration navigation.',
    keyMetric: '99.4% Senior Usability Score',
    targetSectionId: 'section-hero',
    position: [0, 1.2, 3.8],
    orbitRadius: 4.0,
    angle: 0,
  },
  {
    id: 'zone-games',
    number: 2,
    name: 'Cognitive Games Pavilion',
    category: 'patient',
    icon: Gamepad2,
    color: '#0284c7',
    accentColor: '#0369a1',
    glowColor: 'rgba(2, 132, 199, 0.4)',
    tag: 'MoCA Calibrated',
    shortDesc: 'Culturally rooted memory, attention, pattern, and sound exercises.',
    fullDesc: 'Interactive games incorporating Assam tea leaf sorting, Bihu dhol rhythm matching, Khasi spice recall, and Mizo textile sequences to stimulate neural plasticity.',
    keyMetric: '6 Cognitive Domains',
    targetSectionId: 'section-cognitive-activities',
    position: [2.8, 1.0, 2.8],
    orbitRadius: 4.2,
    angle: 45,
  },
  {
    id: 'zone-routine',
    number: 3,
    name: 'Daily Routine Pavilion',
    category: 'patient',
    icon: Clock,
    color: '#d97706',
    accentColor: '#b45309',
    glowColor: 'rgba(217, 119, 6, 0.4)',
    tag: 'Circadian Pacing',
    shortDesc: 'Structured daily timeline for medication, hydration, and nutrition.',
    fullDesc: 'Paced daily schedule with morning medication, hydration water tracking, midday cognitive exercise, doctor tele-appointments, and evening calming routines.',
    keyMetric: '92% Medication Adherence',
    targetSectionId: 'section-daily-routine',
    position: [4.0, 0.5, 0],
    orbitRadius: 4.0,
    angle: 90,
  },
  {
    id: 'zone-caregiver',
    number: 4,
    name: 'Caregiver Pavilion',
    category: 'care',
    icon: HeartHandshake,
    color: '#16a34a',
    accentColor: '#15803d',
    glowColor: 'rgba(22, 163, 74, 0.4)',
    tag: 'Remote Peace of Mind',
    shortDesc: 'Real-time telemetry and peace-of-mind alerts for working families.',
    fullDesc: 'Enables daughters, sons, and family members living in Guwahati, Bengaluru, or Delhi to track elder medication status, mood stability, and send one-click voice notes.',
    keyMetric: 'Real-Time Family Sync',
    targetSectionId: 'section-caregiver',
    position: [2.8, 0.2, -2.8],
    orbitRadius: 4.2,
    angle: 135,
  },
  {
    id: 'zone-clinician',
    number: 5,
    name: 'Clinician Pavilion',
    category: 'clinical',
    icon: Stethoscope,
    color: '#7c3aed',
    accentColor: '#6d28d9',
    glowColor: 'rgba(124, 58, 237, 0.4)',
    tag: 'Clinical Telemetry',
    shortDesc: 'Longitudinal MoCA/MMSE stability curves and clinical reports.',
    fullDesc: 'Neurologists and medical officers at GMCH or district health centers access 30-day cognitive retention curves, response latency drifts, and exportable ABDM clinical summaries.',
    keyMetric: 'MoCA & MMSE Mapped',
    targetSectionId: 'section-clinician',
    position: [0, 0.6, -4.0],
    orbitRadius: 4.0,
    angle: 180,
  },
  {
    id: 'zone-ai',
    number: 6,
    name: 'AI Intelligence Lab',
    category: 'core',
    icon: Sparkles,
    color: '#06b6d4',
    accentColor: '#0891b2',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    tag: 'Adaptive DDA',
    shortDesc: 'Dynamic difficulty adaptation and circadian sundowning anticipation.',
    fullDesc: 'Ethical on-device machine learning that adjusts exercise difficulty dynamically to eliminate user frustration, and detects early evening restlessness patterns.',
    keyMetric: 'Zero Frustration DDA',
    targetSectionId: 'section-ai-intelligence',
    position: [-2.8, 0.8, -2.8],
    orbitRadius: 4.2,
    angle: 225,
  },
  {
    id: 'zone-analytics',
    number: 7,
    name: 'Analytics Dome',
    category: 'clinical',
    icon: BarChart3,
    color: '#2563eb',
    accentColor: '#1d4ed8',
    glowColor: 'rgba(37, 99, 235, 0.4)',
    tag: '30-Day Trends',
    shortDesc: 'Multivariate cognitive stability, attention span, and recall curves.',
    fullDesc: 'Detailed comparative telemetry filtering across 7, 14, and 30 days for clinical insight into executive function, attention endurance, and visual memory.',
    keyMetric: '30-Day Trajectory Curves',
    targetSectionId: 'section-analytics-dome',
    position: [-4.0, 0.5, 0],
    orbitRadius: 4.0,
    angle: 270,
  },
  {
    id: 'zone-memory-garden',
    number: 8,
    name: 'Memory Garden',
    category: 'patient',
    icon: Flower2,
    color: '#ec4899',
    accentColor: '#db2777',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    tag: 'Digital Sanctuary',
    shortDesc: '18 digital memory blossoms preserving cherished life stories.',
    fullDesc: 'Reminiscence sanctuary where family wedding photos, Brahmaputra river trips, and ancestral village moments bloom as interactive blossoms with soothing audio.',
    keyMetric: '18 Animated Blossoms',
    targetSectionId: 'section-memory-garden',
    position: [-2.8, 1.2, 2.8],
    orbitRadius: 4.2,
    angle: 315,
  },
  {
    id: 'zone-voice',
    number: 9,
    name: 'Voice Assistant Hub',
    category: 'core',
    icon: Volume2,
    color: '#0d9488',
    accentColor: '#0f766e',
    glowColor: 'rgba(13, 148, 136, 0.4)',
    tag: '7 Dialects',
    shortDesc: 'Native dialect voice AI speaking Assamese, Bengali, Meitei, Mizo & Khasi.',
    fullDesc: 'Speech synthesis and acoustic analysis engineered for senior voice cadences, background noise resilience, and low-literacy elder accessibility.',
    keyMetric: '7 Regional Languages',
    targetSectionId: 'section-voice-language',
    position: [1.8, 2.0, 1.8],
    orbitRadius: 2.8,
    angle: 30,
  },
  {
    id: 'zone-reminders',
    number: 10,
    name: 'Reminders Hub',
    category: 'patient',
    icon: Bell,
    color: '#f97316',
    accentColor: '#ea580c',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    tag: 'Family Voice Alarms',
    shortDesc: 'Medicine and hydration alerts spoken in daughters and grandsons voices.',
    fullDesc: 'Replaces harsh alarm beeps with familiar, comforting voice prompts that reduce senior agitation and ensure high medication compliance.',
    keyMetric: 'Warm Voice Chimes',
    targetSectionId: 'section-features',
    position: [2.5, -0.6, 1.0],
    orbitRadius: 2.9,
    angle: 75,
  },
  {
    id: 'zone-offline',
    number: 11,
    name: 'Offline Sync Station',
    category: 'system',
    icon: WifiOff,
    color: '#059669',
    accentColor: '#047857',
    glowColor: 'rgba(5, 150, 105, 0.4)',
    tag: '100% Zero Bandwidth',
    shortDesc: 'Edge SQLite engine functioning seamlessly through monsoon blackouts.',
    fullDesc: 'Local-first architecture that runs all games, alarms, and music on-device. Silently queues encrypted delta sync logs when cellular connectivity drops.',
    keyMetric: 'Zero Data Loss on Edge',
    targetSectionId: 'section-offline-mode',
    position: [0, -1.2, -2.5],
    orbitRadius: 2.7,
    angle: 190,
  },
  {
    id: 'zone-accessibility',
    number: 12,
    name: 'Accessibility Center',
    category: 'system',
    icon: Sliders,
    color: '#6366f1',
    accentColor: '#4f46e5',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    tag: 'WCAG 2.2 AAA',
    shortDesc: 'Voice-first navigation, high-contrast themes, and tremor compensation.',
    fullDesc: 'Senior-first interface adjustments including font magnification, high-contrast yellow-on-black mode, reduced motion, and tactile confirmation triggers.',
    keyMetric: 'WCAG AAA Compliant',
    targetSectionId: 'section-accessibility',
    position: [-2.2, 1.8, 1.2],
    orbitRadius: 2.8,
    angle: 300,
  },
  {
    id: 'zone-security',
    number: 13,
    name: 'Security Center',
    category: 'system',
    icon: Shield,
    color: '#0284c7',
    accentColor: '#0369a1',
    glowColor: 'rgba(2, 132, 199, 0.4)',
    tag: 'DPDP & ABDM Ready',
    shortDesc: 'AES-256 encrypted on-device health vault with granular RBAC.',
    fullDesc: 'Strict adherence to the Indian Digital Personal Data Protection Act 2023. End-to-end encrypted logs, immutable audit trails, and zero commercial data sharing.',
    keyMetric: 'AES-256 On-Device Vault',
    targetSectionId: 'section-security',
    position: [-2.5, -0.8, -1.2],
    orbitRadius: 3.0,
    angle: 210,
  },
  {
    id: 'zone-support',
    number: 14,
    name: 'Help & Support Hub',
    category: 'care',
    icon: HelpCircle,
    color: '#475569',
    accentColor: '#334155',
    glowColor: 'rgba(71, 85, 105, 0.4)',
    tag: 'Regional Care Guides',
    shortDesc: 'Toll-free helpline, ASHA worker training, and hardware warranty support.',
    fullDesc: 'Comprehensive support network for families and rural primary healthcare centers across all 8 North Eastern states.',
    keyMetric: '24/7 Regional Helpline',
    targetSectionId: 'section-faq',
    position: [1.2, -1.5, 2.0],
    orbitRadius: 2.8,
    angle: 110,
  },
];

interface MindCare3DHubProps {
  onNavigateSection: (sectionId: string) => void;
  onSelectZone?: (zone: PavilionZone) => void;
  isInteractive3D?: boolean;
}

export const MindCare3DHub: React.FC<MindCare3DHubProps> = ({
  onNavigateSection,
  onSelectZone,
  isInteractive3D = true,
}) => {
  const [selectedZone, setSelectedZone] = useState<PavilionZone | null>(PAVILION_ZONES[0]);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isCanvasSupported, setIsCanvasSupported] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto rotation loop
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Handle category filtering
  const filteredZones = useMemo(() => {
    if (activeCategoryFilter === 'all') return PAVILION_ZONES;
    return PAVILION_ZONES.filter((z) => z.category === activeCategoryFilter);
  }, [activeCategoryFilter]);

  // 2D Canvas rendering for smooth interactive 3D orb ecosystem
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsCanvasSupported(false);
      return;
    }

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Background Ambient Glow
      const bgGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        width * 0.48
      );
      bgGradient.addColorStop(0, 'rgba(25, 195, 177, 0.12)');
      bgGradient.addColorStop(0.5, 'rgba(91, 167, 255, 0.06)');
      bgGradient.addColorStop(1, 'rgba(7, 17, 31, 0)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw Orbit Pathways
      const orbits = [120, 190, 250];
      orbits.forEach((radius, idx) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * zoomLevel, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 217, 197, ${0.18 - idx * 0.04})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw Central Core: "MINDCARE CENTRAL HUB"
      ctx.beginPath();
      ctx.arc(centerX, centerY, 52 * zoomLevel, 0, Math.PI * 2);
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        52 * zoomLevel
      );
      coreGradient.addColorStop(0, '#101F31');
      coreGradient.addColorStop(0.7, '#0B1726');
      coreGradient.addColorStop(1, '#07111F');
      ctx.fillStyle = coreGradient;
      ctx.shadowColor = 'rgba(25, 195, 177, 0.5)';
      ctx.shadowBlur = 22;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Core Outer Pulsing Ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, (62 + Math.sin(Date.now() / 400) * 3) * zoomLevel, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(25, 195, 177, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Central Hub Label
      ctx.fillStyle = '#F4F8FC';
      ctx.font = `bold ${Math.max(10, 11 * zoomLevel)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MINDCARE', centerX, centerY - 6 * zoomLevel);
      ctx.fillStyle = '#38D9C5';
      ctx.font = `800 ${Math.max(9, 10 * zoomLevel)}px sans-serif`;
      ctx.fillText('CENTRAL HUB', centerX, centerY + 8 * zoomLevel);

      // Render 14 Pavilions & Connecting Pathways
      filteredZones.forEach((zone) => {
        const rad = ((zone.angle + rotationAngle) * Math.PI) / 180;
        const dist = (zone.orbitRadius * 52) * zoomLevel;
        const x = centerX + Math.cos(rad) * dist;
        const y = centerY + Math.sin(rad) * dist * 0.72; // slight 3D perspective foreshortening

        const isSelected = selectedZone?.id === zone.id;

        // Connecting Pathway line from Core to Pavilion
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = isSelected
          ? 'rgba(25, 195, 177, 0.7)'
          : 'rgba(36, 58, 80, 0.6)';
        ctx.lineWidth = isSelected ? 2.5 : 1.2;
        ctx.stroke();

        // Pavilion Node
        const nodeRadius = (isSelected ? 20 : 14) * zoomLevel;
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = zone.color;
        ctx.shadowColor = zone.glowColor;
        ctx.shadowBlur = isSelected ? 25 : 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#F4F8FC';
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.stroke();

        // Node Number
        ctx.fillStyle = '#F4F8FC';
        ctx.font = `bold ${Math.max(9, 10 * zoomLevel)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(zone.number), x, y);

        // Node Label below
        ctx.fillStyle = isSelected ? '#38D9C5' : '#B7C5D6';
        ctx.font = `${isSelected ? 'bold' : '600'} ${Math.max(9, 10 * zoomLevel)}px sans-serif`;
        ctx.fillText(zone.name, x, y + nodeRadius + 11 * zoomLevel);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotationAngle, zoomLevel, selectedZone, filteredZones]);

  // Handle canvas click to select zone
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    let clicked: PavilionZone | null = null;
    let minDist = 30;

    filteredZones.forEach((zone) => {
      const rad = ((zone.angle + rotationAngle) * Math.PI) / 180;
      const dist = (zone.orbitRadius * 52) * zoomLevel;
      const x = centerX + Math.cos(rad) * dist;
      const y = centerY + Math.sin(rad) * dist * 0.72;

      const d = Math.hypot(clickX - x, clickY - y);
      if (d < minDist) {
        minDist = d;
        clicked = zone;
      }
    });

    if (clicked) {
      sound.playClick();
      setSelectedZone(clicked);
      if (onSelectZone) onSelectZone(clicked);
    }
  };

  return (
    <div
      id="mindcare-central-3d-hub"
      className="bg-[#0B1726]/95 backdrop-blur-md rounded-3xl border border-[#243A50] p-6 lg:p-8 shadow-2xl space-y-6 text-[#F4F8FC]"
    >
      {/* Hub Header & Perspective Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#243A50] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-700/60 text-[#38D9C5] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Ecosystem • 14 Pavilions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#F4F8FC] tracking-tight mt-1.5">
            MINDCARE CENTRAL HUB
          </h2>
          <p className="text-sm text-[#B7C5D6] font-medium">
            Explore the connected pavilions powering North East India's cognitive care network.
          </p>
        </div>

        {/* 3D Interaction Control Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setIsAutoRotating(!isAutoRotating);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isAutoRotating
                ? 'bg-teal-950/80 text-[#38D9C5] border-teal-700/60'
                : 'bg-[#101F31] text-[#B7C5D6] border-[#243A50]'
            }`}
            title="Toggle Orbit Rotation"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
            <span>{isAutoRotating ? 'Auto-Orbiting' : 'Orbit Paused'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setZoomLevel((prev) => (prev === 1 ? 1.18 : prev === 1.18 ? 0.85 : 1));
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#101F31] text-[#F4F8FC] border border-[#243A50] hover:bg-[#14283D] flex items-center gap-1.5 cursor-pointer"
            title="Adjust Zoom Perspective"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#19C3B1]" />
            <span>Zoom {Math.round(zoomLevel * 100)}%</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setRotationAngle(0);
              setZoomLevel(1);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#101F31] text-[#B7C5D6] border border-[#243A50] hover:bg-[#14283D] hover:text-[#F4F8FC] cursor-pointer"
            title="Reset Camera View"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-bold text-[#7F91A6] mr-2">Filter Pavilions:</span>
        {[
          { id: 'all', label: 'All 14 Zones' },
          { id: 'patient', label: 'Elder & Patient' },
          { id: 'care', label: 'Caregiver & Family' },
          { id: 'clinical', label: 'Clinician & Analytics' },
          { id: 'core', label: 'AI & Voice' },
          { id: 'system', label: 'Offline & Security' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setActiveCategoryFilter(tab.id);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeCategoryFilter === tab.id
                ? 'bg-[#19C3B1] text-[#07111F] shadow-xs'
                : 'bg-[#101F31] text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC] border border-[#243A50]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main 3D Canvas & Zone Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive 3D Orbit Canvas */}
        <div className="lg:col-span-7 relative bg-gradient-to-b from-[#07111F] via-[#0B1726] to-[#101F31] rounded-2xl border border-[#243A50] overflow-hidden p-2 flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
          <canvas
            ref={canvasRef}
            width={580}
            height={440}
            onClick={handleCanvasClick}
            className="w-full max-w-[580px] h-auto cursor-crosshair select-none"
          />

          <div className="absolute bottom-3 left-3 bg-[#0B1726]/90 backdrop-blur-xs px-3 py-1 rounded-xl text-[11px] font-bold text-[#B7C5D6] border border-[#243A50] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#19C3B1] animate-ping"></span>
            <span>Click any pavilion node to inspect</span>
          </div>
        </div>

        {/* Selected Zone Inspector Panel */}
        <div className="lg:col-span-5 space-y-4">
          {selectedZone ? (
            <div className="bg-[#101F31] rounded-2xl border border-[#243A50] p-6 shadow-xl space-y-4 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full h-1.5"
                style={{ backgroundColor: selectedZone.color }}
              />

              <div className="flex items-center justify-between pt-1">
                <span
                  className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${selectedZone.color}25`,
                    color: selectedZone.color,
                  }}
                >
                  Zone #{selectedZone.number} • {selectedZone.tag}
                </span>
                <span className="text-xs font-extrabold text-[#B7C5D6] bg-[#14283D] px-2 py-0.5 rounded border border-[#243A50]">
                  {selectedZone.keyMetric}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-[#F4F8FC] flex items-center gap-2">
                  <selectedZone.icon className="w-5 h-5" style={{ color: selectedZone.color }} />
                  {selectedZone.name}
                </h3>
                <p className="text-sm font-semibold text-[#38D9C5] mt-0.5">
                  {selectedZone.shortDesc}
                </p>
              </div>

              <p className="text-xs text-[#B7C5D6] leading-relaxed">
                {selectedZone.fullDesc}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigateSection(selectedZone.targetSectionId);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-[#07111F] font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:brightness-110"
                  style={{ backgroundColor: selectedZone.color }}
                >
                  <span>Enter {selectedZone.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    const nextIndex =
                      (PAVILION_ZONES.findIndex((z) => z.id === selectedZone.id) + 1) %
                      PAVILION_ZONES.length;
                    setSelectedZone(PAVILION_ZONES[nextIndex]);
                  }}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#14283D] hover:bg-[#162B40] text-[#F4F8FC] font-bold text-xs border border-[#243A50] whitespace-nowrap cursor-pointer"
                >
                  Next Zone ➔
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-[#101F31] rounded-2xl border border-[#243A50]">
              <p className="text-sm font-bold text-[#B7C5D6]">
                Select any of the 14 surrounding pavilions to view details.
              </p>
            </div>
          )}

          {/* Quick 14-Pavilion Pill Grid for Fast Keyboard & Accessible Navigation */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7F91A6] block">
              Direct Zone Navigation:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
              {PAVILION_ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedZone(zone);
                  }}
                  className={`p-2 rounded-xl text-left text-xs font-bold transition-all truncate border cursor-pointer ${
                    selectedZone?.id === zone.id
                      ? 'bg-[#14283D] border-[#19C3B1] text-[#38D9C5] ring-1 ring-[#19C3B1]'
                      : 'bg-[#101F31] border-[#243A50] text-[#B7C5D6] hover:bg-[#14283D] hover:text-[#F4F8FC]'
                  }`}
                >
                  <span className="text-[10px] opacity-60 mr-1">#{zone.number}</span>
                  <span>{zone.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
