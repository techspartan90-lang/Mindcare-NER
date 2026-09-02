import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface PillarData {
  id: number;
  key: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  color: string;
  accentColor: string;
  glowColor: string;
  bottomLabel: string;
  gridPos: { row: number; col: number }; // 0: top row (col 0,1,2), 1: bottom row (col 0,1,2)
  coords: [number, number]; // Normalized coordinate [-1..1, -1..1]
  details: {
    whatIsIt: string;
    whatDoesItDo: string;
    whyDoesItHelpMe: string;
    clinicalBadge: string;
    keyMetrics: string[];
    actionLabel: string;
  };
}

export const SIX_PILLARS: PillarData[] = [
  {
    id: 1,
    key: 'cognitive_games',
    number: '01',
    title: 'Adaptive Cognitive Games',
    subtitle: 'Culturally Anchored Mental Fitness',
    description:
      'Culturally anchored exercises spanning short-term memory, attention endurance, pattern recognition, and familiar regional sound identification.',
    category: 'Memory & Attention',
    color: '#12C8B8',
    accentColor: '#38D9C5',
    glowColor: 'rgba(18, 200, 184, 0.45)',
    bottomLabel: '6 Calibrated Domains →',
    gridPos: { row: 0, col: 0 },
    coords: [-2.8, 1.2],
    details: {
      whatIsIt: 'A daily collection of 6 gentle, culturally familiar brain exercises designed for senior enjoyment and neuroplastic maintenance.',
      whatDoesItDo: 'Activates memory recall, visual attention, and auditory discrimination using local motifs like Assam tea leaves, Bihu dhol drums, and Khasi textiles.',
      whyDoesItHelpMe: 'Helps maintain sharp memory and mental independence in just 10 minutes a day without any confusing gaming rules or stressful timers.',
      clinicalBadge: 'MoCA & HMSE Aligned Telemetry',
      keyMetrics: ['6 Cognitive Domains', '100% Culturally Anchored', 'Dynamic Difficulty (DDA)'],
      actionLabel: 'Launch Cognitive Games',
    },
  },
  {
    id: 2,
    key: 'ai_engine',
    number: '02',
    title: 'AI Personalization Engine',
    subtitle: 'Zero-Frustration Real-Time Calibration',
    description:
      'Dynamic difficulty adjustment (DDA) eliminates frustration by matching real-time senior fatigue, while detecting early circadian sundowning patterns.',
    category: 'Intelligent Calibration',
    color: '#35D07F',
    accentColor: '#4ADE80',
    glowColor: 'rgba(53, 208, 127, 0.45)',
    bottomLabel: 'Zero-Frustration DDA →',
    gridPos: { row: 0, col: 1 },
    coords: [0, 1.2],
    details: {
      whatIsIt: 'An on-device healthcare intelligence engine that gently adjusts game pace and task complexity to match how energetic you feel right now.',
      whatDoesItDo: 'Silently detects hesitation, hand tremor, or evening fatigue (sundowning) and automatically simplifies challenges to keep sessions positive.',
      whyDoesItHelpMe: 'You never experience failure or stress. Every session feels rewarding, encouraging consistent daily engagement.',
      clinicalBadge: 'Circadian Fatigue & Sundowning Shield',
      keyMetrics: ['Zero-Frustration Guarantee', 'Real-Time Tremor Filter', 'Fatigue-Adaptive Pacing'],
      actionLabel: 'Test Personalization Demo',
    },
  },
  {
    id: 3,
    key: 'voice_multilingual',
    number: '03',
    title: 'Voice & Multilingual AI',
    subtitle: 'Elder-Paced Regional Dialogue',
    description:
      'Native speech recognition and warm audio playback across Assamese, Bengali, Meiteilon, Mizo, Khasi, Hindi, and English.',
    category: 'Acoustic Support',
    color: '#5BA7FF',
    accentColor: '#60A5FA',
    glowColor: 'rgba(91, 167, 255, 0.45)',
    bottomLabel: '7 Regional Cadences →',
    gridPos: { row: 0, col: 2 },
    coords: [2.8, 1.2],
    details: {
      whatIsIt: 'A respectful voice companion that speaks and listens in your mother tongue with elder-calibrated speaking speed and natural acoustic pauses.',
      whatDoesItDo: 'Guides you through morning greetings, medication questions, and trivia conversation without requiring you to type on a tiny keyboard.',
      whyDoesItHelpMe: 'Allows effortless touch-free interaction even with poor eyesight or shaky hands, creating a warm, comforting presence at home.',
      clinicalBadge: '7 North-Eastern Dialects Supported',
      keyMetrics: ['Assamese, Mizo, Khasi & more', 'Elder Prosody Pacing', 'Complete Touch-Free Speech'],
      actionLabel: 'Open Voice Assistant',
    },
  },
  {
    id: 4,
    key: 'routine_pacing',
    number: '04',
    title: 'Daily Routine Pacing',
    subtitle: 'Circadian Schedule & Milestones',
    description:
      'Visual and family-recorded audio reminders for morning blood pressure medication, hydration milestones, meals, and gentle exercise.',
    category: 'Daily Living',
    color: '#F4B740',
    accentColor: '#FBBF24',
    glowColor: 'rgba(244, 183, 64, 0.45)',
    bottomLabel: 'Circadian Pacing →',
    gridPos: { row: 1, col: 0 },
    coords: [-2.8, -1.2],
    details: {
      whatIsIt: 'A clear, high-contrast visual and audio daily schedule that helps you effortlessly keep track of meals, hydration, and pills throughout the day.',
      whatDoesItDo: 'Plays personalized family voice reminders ("Papa, it\'s 9 AM, please take your blood pressure medicine") with large, reassuring checkoffs.',
      whyDoesItHelpMe: 'Eliminates anxiety about forgotten medications and brings peace of mind to both you and your loved ones.',
      clinicalBadge: 'Circadian Rhythm Stabilization',
      keyMetrics: ['Family Voice Prompts', 'Hydration & BP Tracking', 'Large 64px Checkoffs'],
      actionLabel: 'View Daily Routine Schedule',
    },
  },
  {
    id: 5,
    key: 'caregiver_portal',
    number: '05',
    title: 'Caregiver Portal & Alerts',
    subtitle: 'Distant Family Peace of Mind',
    description:
      'Remote daughter and son dashboard providing peace-of-mind telemetry, missed medication alerts, mood summaries, and one-tap voice messaging.',
    category: 'Family Care',
    color: '#A855F7',
    accentColor: '#C084FC',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    bottomLabel: 'Remote Peace of Mind →',
    gridPos: { row: 1, col: 1 },
    coords: [0, -1.2],
    details: {
      whatIsIt: 'A secure mobile app for adult children and doctors to see how their elder parents are doing each day, even from across the country.',
      whatDoesItDo: 'Sends instant alerts if morning medication is missed, displays 30-day cognitive stability charts, and allows one-tap audio love notes.',
      whyDoesItHelpMe: 'Ensures seniors are never isolated and families can provide timely medical support while respecting elder dignity and independence.',
      clinicalBadge: 'Clinician Longitudinal Dashboard',
      keyMetrics: ['Missed-Med SMS & WhatsApp', '30-Day Stability Curves', 'Family Voice Messaging'],
      actionLabel: 'Explore Caregiver Portal',
    },
  },
  {
    id: 6,
    key: 'offline_sync',
    number: '06',
    title: '100% Offline Edge Sync',
    subtitle: 'Autonomous On-Device Continuity',
    description:
      'Autonomous on-device engine guaranteeing full functionality in isolated valley homes during heavy storms, silently auto-syncing when restored.',
    category: 'Infrastructure',
    color: '#38BDF8',
    accentColor: '#7DD3FC',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    bottomLabel: 'Monsoon Proof →',
    gridPos: { row: 1, col: 2 },
    coords: [2.8, -1.2],
    details: {
      whatIsIt: 'An all-local healthcare software engine that works 100% without internet or cellular connectivity in remote hilly and rural areas.',
      whatDoesItDo: 'All voice processing, cognitive exercises, and schedule alarms run directly on the senior’s tablet. When power/WiFi returns, it silently syncs.',
      whyDoesItHelpMe: 'Heavy monsoon rains, landslides, or power outages never disrupt your daily care, routines, or cognitive monitoring.',
      clinicalBadge: 'Zero Cloud Dependency at Runtime',
      keyMetrics: ['100% Autonomous On-Device', 'Monsoon-Grade Resilience', 'Encrypted Background Sync'],
      actionLabel: 'Simulate Offline Mode',
    },
  },
];

interface ConnectedPillars3DCanvasProps {
  activePillarId: number | null;
  onSelectPillar: (id: number) => void;
  hoveredPillarId: number | null;
  setHoveredPillarId: (id: number | null) => void;
}

export const ConnectedPillars3DCanvas: React.FC<ConnectedPillars3DCanvasProps> = ({
  activePillarId,
  onSelectPillar,
  hoveredPillarId,
  setHoveredPillarId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Pointer & Parallax
  const mouseParallax = useRef({ x: 0, y: 0 });
  const cameraLerp = useRef({ x: 0, y: 0, zoom: 1 });
  const targetCamera = useRef({ x: 0, y: 0, zoom: 1 });

  // Update target camera when active pillar changes
  useEffect(() => {
    if (activePillarId !== null) {
      const p = SIX_PILLARS.find((item) => item.id === activePillarId);
      if (p) {
        targetCamera.current = {
          x: p.coords[0] * 0.4,
          y: p.coords[1] * 0.35,
          zoom: 1.12,
        };
      }
    } else {
      targetCamera.current = { x: 0, y: 0, zoom: 1.0 };
    }
  }, [activePillarId]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    if (!prefersReducedMotion) {
      mouseParallax.current = { x: nx * 0.35, y: ny * 0.25 };
    }

    // Hit Testing for 6 dimensional nodes
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    let hit: number | null = null;
    const scale = (w / 960) * cameraLerp.current.zoom;

    SIX_PILLARS.forEach((p) => {
      const px = cx + (p.coords[0] * 125 - cameraLerp.current.x * 60 + mouseParallax.current.x * 25) * scale;
      const py = cy + (-p.coords[1] * 95 - cameraLerp.current.y * 50 + mouseParallax.current.y * 20) * scale;
      const dist = Math.hypot(clickX - px, clickY - py);
      if (dist < 48 * scale) {
        hit = p.id;
      }
    });

    setHoveredPillarId(hit);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = (w / 960) * cameraLerp.current.zoom;

    SIX_PILLARS.forEach((p) => {
      const px = cx + (p.coords[0] * 125 - cameraLerp.current.x * 60 + mouseParallax.current.x * 25) * scale;
      const py = cy + (-p.coords[1] * 95 - cameraLerp.current.y * 50 + mouseParallax.current.y * 20) * scale;
      const dist = Math.hypot(clickX - px, clickY - py);
      if (dist < 54 * scale) {
        onSelectPillar(p.id);
      }
    });
  };

  // Main 3D Spatial Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.016;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Camera lerping
      cameraLerp.current.x += (targetCamera.current.x - cameraLerp.current.x) * 0.08;
      cameraLerp.current.y += (targetCamera.current.y - cameraLerp.current.y) * 0.08;
      cameraLerp.current.zoom += (targetCamera.current.zoom - cameraLerp.current.zoom) * 0.08;

      const scale = (w / 960) * cameraLerp.current.zoom;
      const parallaxX = mouseParallax.current.x * 25 * scale;
      const parallaxY = mouseParallax.current.y * 20 * scale;

      ctx.clearRect(0, 0, w, h);

      // Deep Navy Healthcare Background (#081827 -> #10263A)
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, w * 0.65);
      bgGrad.addColorStop(0, '#10263A');
      bgGrad.addColorStop(0.6, '#081827');
      bgGrad.addColorStop(1, '#05101B');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Soft Translucent Data Rings & Subtle Grid
      ctx.strokeStyle = 'rgba(25, 195, 177, 0.07)';
      ctx.lineWidth = 1;
      for (let r = 1; r <= 3; r++) {
        ctx.beginPath();
        ctx.arc(cx + parallaxX * 0.3, cy + parallaxY * 0.3, (140 * r) * scale, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Grid Perspective Lines
      ctx.strokeStyle = 'rgba(36, 58, 80, 0.25)';
      ctx.lineWidth = 1;
      for (let i = -5; i <= 5; i++) {
        const gx = cx + (i * 90 - cameraLerp.current.x * 40) * scale + parallaxX * 0.4;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }

      // =========================================================================
      // CENTRAL TOP: MINDCARE NER ECOSYSTEM CORE HUB
      // =========================================================================
      const hubX = cx - cameraLerp.current.x * 30 * scale + parallaxX * 0.5;
      const hubY = cy - 200 * scale - cameraLerp.current.y * 30 * scale + parallaxY * 0.5;

      // Hub Outer Aura
      const hubPulse = Math.sin(time * 2.5) * 3;
      ctx.beginPath();
      ctx.arc(hubX, hubY, (36 + hubPulse) * scale, 0, Math.PI * 2);
      const hubAura = ctx.createRadialGradient(hubX, hubY, 4, hubX, hubY, 40 * scale);
      hubAura.addColorStop(0, 'rgba(18, 200, 184, 0.4)');
      hubAura.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = hubAura;
      ctx.fill();

      // Hub Body
      ctx.beginPath();
      ctx.arc(hubX, hubY, 26 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#0E2235';
      ctx.fill();
      ctx.strokeStyle = '#12C8B8';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#12C8B8';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Hub Text Label
      ctx.fillStyle = '#F4F8FC';
      ctx.font = `900 ${Math.max(9, 10 * scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MINDCARE', hubX, hubY - 4 * scale);
      ctx.fillStyle = '#38D9C5';
      ctx.font = `bold ${Math.max(7, 8 * scale)}px sans-serif`;
      ctx.fillText('ECOSYSTEM', hubX, hubY + 7 * scale);

      // =========================================================================
      // CONNECTING SYSTEM: SUBTLE GLOWING PATHS & ANIMATED DATA PARTICLES
      // =========================================================================
      const nodePositions: { [id: number]: { x: number; y: number } } = {};

      SIX_PILLARS.forEach((p) => {
        const px = cx + (p.coords[0] * 125 - cameraLerp.current.x * 60) * scale + parallaxX;
        const py = cy + (-p.coords[1] * 95 - cameraLerp.current.y * 50) * scale + parallaxY;
        const bob = Math.sin(time * 2.0 + p.id * 1.0) * 4 * scale;
        nodePositions[p.id] = { x: px, y: py + bob };
      });

      // 1. Draw Central Hub to Level 1 Nodes (Top 3)
      [1, 2, 3].forEach((id) => {
        const dest = nodePositions[id];
        if (!dest) return;
        const isActive = activePillarId === id || activePillarId === null;
        const isHovered = hoveredPillarId === id;

        ctx.beginPath();
        ctx.moveTo(hubX, hubY + 26 * scale);
        // Bezier curve down to destination
        const midY = (hubY + dest.y) / 2;
        ctx.bezierCurveTo(hubX, midY, dest.x, midY, dest.x, dest.y - 30 * scale);
        ctx.strokeStyle = isActive || isHovered ? 'rgba(18, 200, 184, 0.45)' : 'rgba(36, 58, 80, 0.35)';
        ctx.lineWidth = isActive || isHovered ? 2.5 * scale : 1.5 * scale;
        ctx.stroke();

        // Slow animated particle along path
        if (!prefersReducedMotion) {
          const pt = ((time * 0.25 + id * 0.33) % 1.0);
          const t1 = 1 - pt;
          const px = t1 * t1 * t1 * hubX + 3 * t1 * t1 * pt * hubX + 3 * t1 * pt * pt * dest.x + pt * pt * pt * dest.x;
          const py = t1 * t1 * t1 * (hubY + 26 * scale) + 3 * t1 * t1 * pt * midY + 3 * t1 * pt * pt * midY + pt * pt * pt * (dest.y - 30 * scale);

          ctx.beginPath();
          ctx.arc(px, py, 3 * scale, 0, Math.PI * 2);
          ctx.fillStyle = '#38D9C5';
          ctx.shadowColor = '#12C8B8';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 2. Draw Level 1 to Level 2 Vertical Connections (1->4, 2->5, 3->6)
      [[1, 4], [2, 5], [3, 6]].forEach(([topId, btmId]) => {
        const pTop = nodePositions[topId];
        const pBtm = nodePositions[btmId];
        if (!pTop || !pBtm) return;

        const isLineActive = activePillarId === topId || activePillarId === btmId;
        ctx.beginPath();
        ctx.moveTo(pTop.x, pTop.y + 30 * scale);
        ctx.lineTo(pBtm.x, pBtm.y - 30 * scale);
        ctx.strokeStyle = isLineActive ? 'rgba(56, 217, 197, 0.5)' : 'rgba(36, 58, 80, 0.35)';
        ctx.lineWidth = isLineActive ? 2 * scale : 1 * scale;
        ctx.stroke();

        // Vertical particle
        if (!prefersReducedMotion) {
          const pt = ((time * 0.2 + topId * 0.25) % 1.0);
          const px = pTop.x + (pBtm.x - pTop.x) * pt;
          const py = (pTop.y + 30 * scale) + ((pBtm.y - 30 * scale) - (pTop.y + 30 * scale)) * pt;
          ctx.beginPath();
          ctx.arc(px, py, 2.5 * scale, 0, Math.PI * 2);
          ctx.fillStyle = '#35D07F';
          ctx.fill();
        }
      });

      // 3. Draw Cross Caregiver Spine Connections (4 <- 5 -> 6)
      [[5, 4], [5, 6]].forEach(([centerId, targetId]) => {
        const pCenter = nodePositions[centerId];
        const pTarget = nodePositions[targetId];
        if (!pCenter || !pTarget) return;

        const isLineActive = activePillarId === 5 || activePillarId === targetId;
        ctx.beginPath();
        ctx.moveTo(pCenter.x + (targetId === 6 ? 32 : -32) * scale, pCenter.y);
        ctx.lineTo(pTarget.x + (targetId === 6 ? -32 : 32) * scale, pTarget.y);
        ctx.strokeStyle = isLineActive ? 'rgba(168, 85, 247, 0.45)' : 'rgba(36, 58, 80, 0.3)';
        ctx.lineWidth = 1.5 * scale;
        ctx.stroke();
      });

      // =========================================================================
      // RENDER THE SIX DIMENSIONAL 3D HEALTHCARE MODULE OBJECTS
      // =========================================================================
      SIX_PILLARS.forEach((p) => {
        const pos = nodePositions[p.id];
        if (!pos) return;
        const nx = pos.x;
        const ny = pos.y;

        const isActive = activePillarId === p.id;
        const isHovered = hoveredPillarId === p.id;

        // Base 3D Platform (Soft Pedestal)
        ctx.beginPath();
        ctx.ellipse(nx, ny + 32 * scale, 42 * scale, 15 * scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? 'rgba(18, 200, 184, 0.25)' : 'rgba(16, 38, 58, 0.6)';
        ctx.fill();
        ctx.strokeStyle = isActive ? p.color : 'rgba(36, 58, 80, 0.5)';
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.stroke();

        // Node Glow Aura on Hover / Active
        if (isActive || isHovered) {
          ctx.beginPath();
          ctx.arc(nx, ny, 56 * scale, 0, Math.PI * 2);
          const aura = ctx.createRadialGradient(nx, ny, 10, nx, ny, 56 * scale);
          aura.addColorStop(0, p.glowColor);
          aura.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = aura;
          ctx.fill();
        }

        // Main Dimensional Node Shell
        const coreRadius = (isActive ? 32 : isHovered ? 29 : 26) * scale;
        ctx.beginPath();
        ctx.arc(nx, ny, coreRadius, 0, Math.PI * 2);
        const nodeGrad = ctx.createRadialGradient(
          nx - coreRadius * 0.3,
          ny - coreRadius * 0.3,
          2,
          nx,
          ny,
          coreRadius
        );
        nodeGrad.addColorStop(0, isActive ? '#16314D' : '#10263A');
        nodeGrad.addColorStop(0.8, '#0A1A2A');
        nodeGrad.addColorStop(1, '#081827');
        ctx.fillStyle = nodeGrad;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = isActive ? 20 : isHovered ? 14 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = isActive ? p.color : isHovered ? p.accentColor : 'rgba(36, 58, 80, 0.9)';
        ctx.lineWidth = isActive ? 3 : 1.5;
        ctx.stroke();

        // Distinct 3D Visual Artwork per Module
        if (p.id === 1) {
          // MODULE 1: ADAPTIVE COGNITIVE GAMES (Friendly 3D Tablet with Matching Cards & Progress Arc)
          // Tablet Frame
          ctx.fillStyle = '#081827';
          ctx.fillRect(nx - 14 * scale, ny - 11 * scale, 28 * scale, 20 * scale);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(nx - 14 * scale, ny - 11 * scale, 28 * scale, 20 * scale);

          // 4 Mini Matching Cards inside tablet
          const cardW = 5 * scale;
          const cardH = 6 * scale;
          ctx.fillStyle = '#38D9C5';
          ctx.fillRect(nx - 10 * scale, ny - 8 * scale, cardW, cardH);
          ctx.fillStyle = '#12C8B8';
          ctx.fillRect(nx - 2 * scale, ny - 8 * scale, cardW, cardH);
          ctx.fillStyle = '#F4B740';
          ctx.fillRect(nx - 10 * scale, ny + 1 * scale, cardW, cardH);
          ctx.fillStyle = '#A855F7';
          ctx.fillRect(nx - 2 * scale, ny + 1 * scale, cardW, cardH);

          // Circular progress arc on right
          ctx.beginPath();
          ctx.arc(nx + 8 * scale, ny, 4 * scale, -Math.PI / 2, Math.PI * 0.75);
          ctx.strokeStyle = '#38D9C5';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (p.id === 2) {
          // MODULE 2: AI PERSONALIZATION ENGINE (Friendly Neural Node & DDA Curve)
          // Neural Synapse Nodes
          const nodes = [
            { x: nx - 8 * scale, y: ny - 6 * scale },
            { x: nx + 8 * scale, y: ny - 6 * scale },
            { x: nx, y: ny + 4 * scale },
            { x: nx - 10 * scale, y: ny + 6 * scale },
            { x: nx + 10 * scale, y: ny + 6 * scale },
          ];
          ctx.strokeStyle = 'rgba(53, 208, 127, 0.6)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[0].x, nodes[0].y);
          ctx.lineTo(nodes[2].x, nodes[2].y);
          ctx.lineTo(nodes[1].x, nodes[1].y);
          ctx.lineTo(nodes[4].x, nodes[4].y);
          ctx.moveTo(nodes[2].x, nodes[2].y);
          ctx.lineTo(nodes[3].x, nodes[3].y);
          ctx.stroke();

          nodes.forEach((n) => {
            ctx.beginPath();
            ctx.arc(n.x, n.y, 2.5 * scale, 0, Math.PI * 2);
            ctx.fillStyle = '#4ADE80';
            ctx.fill();
          });

          // Gentle animated pulse on central node
          ctx.beginPath();
          ctx.arc(nodes[2].x, nodes[2].y, (4 + Math.sin(time * 3) * 1.5) * scale, 0, Math.PI * 2);
          ctx.strokeStyle = '#35D07F';
          ctx.stroke();
        } else if (p.id === 3) {
          // MODULE 3: VOICE & MULTILINGUAL AI (Voice Device, Mic & Expanding Acoustic Waveforms)
          // Device Base
          ctx.fillStyle = '#081827';
          ctx.beginPath();
          ctx.arc(nx, ny, 8 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Expanding sound waves
          ctx.strokeStyle = '#60A5FA';
          ctx.lineWidth = 1.5;
          for (let wRing = 1; wRing <= 2; wRing++) {
            const waveR = (9 + wRing * 5 + Math.sin(time * 3 + wRing) * 2) * scale;
            ctx.beginPath();
            ctx.arc(nx, ny, waveR, -Math.PI / 3, Math.PI / 3);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(nx, ny, waveR, (2 * Math.PI) / 3, (4 * Math.PI) / 3);
            ctx.stroke();
          }
          // Microphone Capsule
          ctx.fillStyle = '#F4F8FC';
          ctx.fillRect(nx - 2 * scale, ny - 4 * scale, 4 * scale, 8 * scale);
        } else if (p.id === 4) {
          // MODULE 4: DAILY ROUTINE PACING (Clock Face & 4 Routine Category Motifs)
          // Clock Face
          ctx.beginPath();
          ctx.arc(nx, ny, 11 * scale, 0, Math.PI * 2);
          ctx.fillStyle = '#081827';
          ctx.fill();
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Clock Hands (rotating gently)
          const hourAngle = time * 0.2;
          const minAngle = time * 0.8;
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(nx + Math.cos(hourAngle) * 5 * scale, ny + Math.sin(hourAngle) * 5 * scale);
          ctx.strokeStyle = '#FBBF24';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(nx + Math.cos(minAngle) * 8 * scale, ny + Math.sin(minAngle) * 8 * scale);
          ctx.strokeStyle = '#F4F8FC';
          ctx.lineWidth = 1;
          ctx.stroke();

          // 4 Schedule Dots (Medication, Water, Meal, Exercise)
          ctx.fillStyle = '#F4B740';
          ctx.fillRect(nx - 1 * scale, ny - 15 * scale, 2 * scale, 2 * scale); // Top
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(nx + 13 * scale, ny - 1 * scale, 2 * scale, 2 * scale); // Right
          ctx.fillStyle = '#35D07F';
          ctx.fillRect(nx - 1 * scale, ny + 13 * scale, 2 * scale, 2 * scale); // Bottom
          ctx.fillStyle = '#A855F7';
          ctx.fillRect(nx - 15 * scale, ny - 1 * scale, 2 * scale, 2 * scale); // Left
        } else if (p.id === 5) {
          // MODULE 5: CAREGIVER PORTAL & ALERTS (Smartphone Screen + 3 Connected Avatars)
          // Smartphone Outline
          ctx.fillStyle = '#081827';
          ctx.fillRect(nx - 10 * scale, ny - 12 * scale, 20 * scale, 24 * scale);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(nx - 10 * scale, ny - 12 * scale, 20 * scale, 24 * scale);

          // 3 Connected Care Avatars (Senior, Caregiver, Doctor)
          const avatars = [
            { x: nx - 5 * scale, y: ny - 4 * scale, color: '#38D9C5' }, // Senior
            { x: nx + 5 * scale, y: ny - 4 * scale, color: '#C084FC' }, // Caregiver
            { x: nx, y: ny + 5 * scale, color: '#35D07F' }, // Doctor
          ];
          // Connecting lines
          ctx.beginPath();
          ctx.moveTo(avatars[0].x, avatars[0].y);
          ctx.lineTo(avatars[1].x, avatars[1].y);
          ctx.lineTo(avatars[2].x, avatars[2].y);
          ctx.lineTo(avatars[0].x, avatars[0].y);
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();

          avatars.forEach((a) => {
            ctx.beginPath();
            ctx.arc(a.x, a.y, 2.5 * scale, 0, Math.PI * 2);
            ctx.fillStyle = a.color;
            ctx.fill();
          });
        } else if (p.id === 6) {
          // MODULE 6: 100% OFFLINE EDGE SYNC (House, Local Unit, Cloud Sync & Storm Motif)
          // House Roof & Base
          ctx.fillStyle = '#081827';
          ctx.beginPath();
          ctx.moveTo(nx - 10 * scale, ny - 2 * scale);
          ctx.lineTo(nx, ny - 11 * scale);
          ctx.lineTo(nx + 10 * scale, ny - 2 * scale);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.strokeRect(nx - 8 * scale, ny - 2 * scale, 16 * scale, 12 * scale);
          ctx.fillStyle = '#0E2235';
          ctx.fillRect(nx - 8 * scale, ny - 2 * scale, 16 * scale, 12 * scale);

          // Local Edge Unit Icon (Glowing Chip in House)
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(nx - 3 * scale, ny + 2 * scale, 6 * scale, 5 * scale);

          // Cloud Sync Symbol (top right)
          ctx.beginPath();
          ctx.arc(nx + 9 * scale, ny - 8 * scale, 3 * scale, 0, Math.PI * 2);
          ctx.arc(nx + 12 * scale, ny - 7 * scale, 2 * scale, 0, Math.PI * 2);
          ctx.fillStyle = '#7DD3FC';
          ctx.fill();
        }

        // Top Floating Pill Badge "01" .. "06"
        const badgeY = ny - coreRadius - 16 * scale;
        ctx.beginPath();
        ctx.arc(nx, badgeY, 11 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#081827';
        ctx.fill();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = isActive ? '#38D9C5' : '#F4F8FC';
        ctx.font = `900 ${Math.max(8, 9 * scale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.number, nx, badgeY);

        // Module Title Label Below
        ctx.fillStyle = isActive ? '#38D9C5' : '#F4F8FC';
        ctx.font = `bold ${Math.max(10, 11 * scale)}px sans-serif`;
        ctx.fillText(p.title, nx, ny + coreRadius + 15 * scale);

        ctx.fillStyle = '#8CA0B8';
        ctx.font = `600 ${Math.max(8, 9 * scale)}px sans-serif`;
        ctx.fillText(p.category, nx, ny + coreRadius + 27 * scale);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activePillarId, hoveredPillarId, prefersReducedMotion]);

  return (
    <div className="w-full h-full min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] relative rounded-3xl overflow-hidden cursor-pointer select-none flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={960}
        height={560}
        onPointerMove={handlePointerMove}
        onClick={handleCanvasClick}
        onPointerLeave={() => {
          setHoveredPillarId(null);
          mouseParallax.current = { x: 0, y: 0 };
        }}
        className="w-full h-full max-h-[580px] block"
      />

      {/* Senior Tactile Affordance Floating Legend */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between pointer-events-none gap-2 text-xs text-[#8CA0B8]">
        <div className="flex items-center gap-2 bg-[#081827]/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#243A50]">
          <span className="w-2 h-2 rounded-full bg-[#12C8B8] animate-pulse" />
          <span className="text-[#F4F8FC] font-bold">Interactive 3D Ecosystem:</span>
          <span>Click any of the 6 modules to inspect clinical details</span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-[#081827]/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#243A50]">
          <span className="text-[#38D9C5] font-black">Level 1:</span> Senior AI & Games ➔{' '}
          <span className="text-[#A855F7] font-black">Level 2:</span> Family & Resilience
        </div>
      </div>
    </div>
  );
};
