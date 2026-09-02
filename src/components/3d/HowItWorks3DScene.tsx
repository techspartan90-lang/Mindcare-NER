import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface StepConfig {
  id: number;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  color: string;
  accentColor: string;
  glowColor: string;
  position: [number, number, number];
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  details: {
    highlight: string;
    clinicalNote: string;
    metrics: string[];
    actionLabel: string;
  };
}

export const HOW_IT_WORKS_STEPS: StepConfig[] = [
  {
    id: 1,
    stepNumber: '01',
    title: 'Family Setup',
    subtitle: 'Caregiver Configuration',
    description: 'Caregiver configures patient profile, language, and medication schedule.',
    category: 'Onboarding & Profile',
    color: '#19C3B1',
    accentColor: '#38D9C5',
    glowColor: 'rgba(25, 195, 177, 0.4)',
    position: [-4.0, 0, 0],
    cameraPos: [-4.0, 0, 3.5],
    cameraTarget: [-4.0, 0, 0],
    details: {
      highlight: 'Single-session setup under 3 minutes with regional language selector.',
      clinicalNote: 'Calibrates medication reminder windows and establishes family contact hierarchy.',
      metrics: ['7 Regional Languages', 'Medication Windows', 'Family Speed-Dial'],
      actionLabel: 'Explore Caregiver Setup',
    },
  },
  {
    id: 2,
    stepNumber: '02',
    title: 'Senior Tablet Placement',
    subtitle: 'Ergonomic Stand & Magnetic Dock',
    description: 'Tablet sits on magnetic charging dock with high-contrast home display.',
    category: 'Hardware & Accessibility',
    color: '#38D9C5',
    accentColor: '#21D4FD',
    glowColor: 'rgba(33, 212, 253, 0.4)',
    position: [-2.0, 0.2, 0.3],
    cameraPos: [-2.0, 0.2, 3.5],
    cameraTarget: [-2.0, 0.2, 0.3],
    details: {
      highlight: 'Zero-effort drop-in magnetic charging eliminates tiny cable frustrations.',
      clinicalNote: 'Matte high-contrast screen prevents glare in hill verandas with 64px+ tactile targets.',
      metrics: ['Magnetic Drop-in Dock', 'WCAG AAA Contrast', 'Tremor Shield UI'],
      actionLabel: 'Inspect Tablet Dock',
    },
  },
  {
    id: 3,
    stepNumber: '03',
    title: 'Daily Voice Guidance',
    subtitle: 'Native Dialect Speech',
    description: 'Tablet speaks in Assamese or native dialect reminding elder of tasks.',
    category: 'Acoustic Support',
    color: '#5BA7FF',
    accentColor: '#60A5FA',
    glowColor: 'rgba(91, 167, 255, 0.4)',
    position: [0, 0.3, -0.1],
    cameraPos: [0, 0.3, 3.5],
    cameraTarget: [0, 0.3, -0.1],
    details: {
      highlight: 'Gentle, respectful elder prosody that feels like a caring family member.',
      clinicalNote: 'Reduces morning confusion and provides repetitive reassurance without anxiety.',
      metrics: ['Assamese, Mizo, Khasi & more', 'Paced Elder Prosody', 'Two-Way Voice Recall'],
      actionLabel: 'Listen to Voice Guidance',
    },
  },
  {
    id: 4,
    stepNumber: '04',
    title: 'Adaptive Play',
    subtitle: '10-Minute Neuroplasticity',
    description: '10-minute daily memory games stimulate neural plasticity.',
    category: 'Cognitive Engagement',
    color: '#F4B740',
    accentColor: '#FBBF24',
    glowColor: 'rgba(244, 183, 64, 0.4)',
    position: [2.0, 0.2, 0.3],
    cameraPos: [2.0, 0.2, 3.5],
    cameraTarget: [2.0, 0.2, 0.3],
    details: {
      highlight: 'Dynamic Difficulty Adjustment prevents frustration by detecting cognitive fatigue.',
      clinicalNote: 'Stimulates autobiographical memory, spatial orientation, and fine-motor coordination.',
      metrics: ['10-Min Paced Sessions', 'Cultural Motifs', 'Zero-Frustration DDA'],
      actionLabel: 'Preview Cognitive Games',
    },
  },
  {
    id: 5,
    stepNumber: '05',
    title: 'Longitudinal Care',
    subtitle: 'Clinical Trajectory Insights',
    description: 'Family and treating doctor receive 30-day stability insights.',
    category: 'Longitudinal Telemetry',
    color: '#8B7CFF',
    accentColor: '#A78BFA',
    glowColor: 'rgba(139, 124, 255, 0.4)',
    position: [4.0, 0, 0],
    cameraPos: [4.0, 0, 3.5],
    cameraTarget: [4.0, 0, 0],
    details: {
      highlight: 'Continuous MoCA-aligned telemetry without anxiety-inducing clinical tests.',
      clinicalNote: 'Early detection of cognitive deceleration allows proactive clinical interventions.',
      metrics: ['30-Day Stability Curves', 'Clinician PDF Export', 'Medication Adherence Correlation'],
      actionLabel: 'View Analytics Summary',
    },
  },
];

interface HowItWorks3DSceneProps {
  activeStep: number | null;
  onSelectStep: (stepId: number | null) => void;
}

export const HowItWorks3DScene: React.FC<HowItWorks3DSceneProps> = ({
  activeStep,
  onSelectStep,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Spatial Camera and Pan State
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const cameraTargetX = useRef(0);
  const currentCameraX = useRef(0);
  const targetZoom = useRef(1.0);
  const currentZoom = useRef(1.0);
  const mouseParallax = useRef({ x: 0, y: 0 });

  // Update target camera X when active step changes
  useEffect(() => {
    if (activeStep !== null) {
      const step = HOW_IT_WORKS_STEPS.find((s) => s.id === activeStep);
      if (step) {
        cameraTargetX.current = step.position[0];
        targetZoom.current = 1.15;
      }
    } else {
      cameraTargetX.current = 0;
      targetZoom.current = 1.0;
    }
  }, [activeStep]);

  // Pointer Interaction
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    if (!prefersReducedMotion) {
      mouseParallax.current = { x: x * 0.3, y: y * 0.2 };
    }

    // Check hit test for 5 stations
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    let hovered: number | null = null;
    HOW_IT_WORKS_STEPS.forEach((step) => {
      // 3D projected screen coordinates
      const worldX = (step.position[0] - currentCameraX.current) * 110 * currentZoom.current;
      const worldY = (-step.position[1] + mouseParallax.current.y * 30) * 110 * currentZoom.current;
      const sx = centerX + worldX;
      const sy = centerY + worldY;
      const dist = Math.hypot(clickX - sx, clickY - sy);
      if (dist < 48 * currentZoom.current) {
        hovered = step.id;
      }
    });

    setHoveredStep(hovered);
  };

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

    HOW_IT_WORKS_STEPS.forEach((step) => {
      const worldX = (step.position[0] - currentCameraX.current) * 110 * currentZoom.current;
      const worldY = (-step.position[1] + mouseParallax.current.y * 30) * 110 * currentZoom.current;
      const sx = centerX + worldX;
      const sy = centerY + worldY;
      const dist = Math.hypot(clickX - sx, clickY - sy);
      if (dist < 52 * currentZoom.current) {
        onSelectStep(step.id);
      }
    });
  };

  // Main 3D Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.016;

      // Handle canvas resolution
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Smooth Camera Lerp
      currentCameraX.current += (cameraTargetX.current - currentCameraX.current) * 0.08;
      currentZoom.current += (targetZoom.current - currentZoom.current) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Deep Spatial Space Gradient Background
      const bgGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        width * 0.6
      );
      bgGrad.addColorStop(0, '#101F31');
      bgGrad.addColorStop(0.5, '#0B1726');
      bgGrad.addColorStop(1, '#07111F');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Perspective Grid Lines (Depth Horizon)
      ctx.strokeStyle = 'rgba(36, 58, 80, 0.35)';
      ctx.lineWidth = 1;
      const horizonY = centerY + 90 * currentZoom.current;
      for (let i = -6; i <= 6; i++) {
        const gx = centerX + (i * 90 - currentCameraX.current * 40) * currentZoom.current;
        ctx.beginPath();
        ctx.moveTo(centerX, horizonY - 140 * currentZoom.current);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }

      // Draw Continuous 3D Spline Pathway (Connecting Step 1 to Step 5)
      ctx.beginPath();
      const numPathPoints = 60;
      for (let i = 0; i <= numPathPoints; i++) {
        const t = (i / numPathPoints) * 8.0 - 4.0; // from -4 to +4
        const curveY = Math.sin(t * 0.8) * 0.25 - 0.5;
        const wx = (t - currentCameraX.current) * 110 * currentZoom.current;
        const wy = (-curveY + mouseParallax.current.y * 20) * 110 * currentZoom.current;
        const sx = centerX + wx;
        const sy = centerY + wy;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = 'rgba(25, 195, 177, 0.45)';
      ctx.lineWidth = 3.5 * currentZoom.current;
      ctx.stroke();

      // Glowing Path Core
      ctx.strokeStyle = 'rgba(56, 217, 197, 0.8)';
      ctx.lineWidth = 1.5 * currentZoom.current;
      ctx.stroke();

      // Animated Traveling Energy Particles Along Pathway
      const particleCount = 14;
      for (let p = 0; p < particleCount; p++) {
        const pt = ((time * 0.18 + p / particleCount) % 1.0) * 8.0 - 4.0;
        const py = Math.sin(pt * 0.8) * 0.25 - 0.5;
        const px = (pt - currentCameraX.current) * 110 * currentZoom.current;
        const pyScreen = (-py + mouseParallax.current.y * 20) * 110 * currentZoom.current;
        const psx = centerX + px;
        const psy = centerY + pyScreen;

        ctx.beginPath();
        ctx.arc(psx, psy, 3.5 * currentZoom.current, 0, Math.PI * 2);
        ctx.fillStyle = '#38D9C5';
        ctx.shadowColor = '#19C3B1';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Render 5 Connected Healthcare Stations in 3D
      HOW_IT_WORKS_STEPS.forEach((step) => {
        const isActive = activeStep === step.id;
        const isHovered = hoveredStep === step.id;

        const worldX = (step.position[0] - currentCameraX.current) * 110 * currentZoom.current;
        const worldY = (-step.position[1] + mouseParallax.current.y * 30) * 110 * currentZoom.current;
        const sx = centerX + worldX;
        const sy = centerY + worldY;

        // Floating Kinematics (gentle bobbing)
        const bob = Math.sin(time * 2.0 + step.id * 1.2) * 5;
        const stationY = sy + bob;

        // Ambient Aura Glow for Active/Hovered Node
        if (isActive || isHovered) {
          ctx.beginPath();
          ctx.arc(sx, stationY, (58 + Math.sin(time * 3) * 4) * currentZoom.current, 0, Math.PI * 2);
          const auraGrad = ctx.createRadialGradient(sx, stationY, 10, sx, stationY, 60 * currentZoom.current);
          auraGrad.addColorStop(0, step.glowColor);
          auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = auraGrad;
          ctx.fill();
        }

        // 3D Station Base Platform / Pedestal
        ctx.beginPath();
        ctx.ellipse(sx, stationY + 36 * currentZoom.current, 38 * currentZoom.current, 14 * currentZoom.current, 0, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? 'rgba(25, 195, 177, 0.3)' : 'rgba(36, 58, 80, 0.4)';
        ctx.fill();
        ctx.strokeStyle = isActive ? step.color : 'rgba(56, 217, 197, 0.3)';
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.stroke();

        // 3D Station Body / Icon Core
        const coreRadius = (isActive ? 32 : isHovered ? 28 : 24) * currentZoom.current;
        ctx.beginPath();
        ctx.arc(sx, stationY, coreRadius, 0, Math.PI * 2);
        const nodeGrad = ctx.createRadialGradient(
          sx - coreRadius * 0.3,
          stationY - coreRadius * 0.3,
          2,
          sx,
          stationY,
          coreRadius
        );
        nodeGrad.addColorStop(0, isActive ? '#14283D' : '#101F31');
        nodeGrad.addColorStop(0.8, '#0B1726');
        nodeGrad.addColorStop(1, '#07111F');
        ctx.fillStyle = nodeGrad;
        ctx.shadowColor = step.color;
        ctx.shadowBlur = isActive ? 24 : isHovered ? 16 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = isActive ? step.color : isHovered ? step.accentColor : 'rgba(36, 58, 80, 0.9)';
        ctx.lineWidth = isActive ? 3 : 1.5;
        ctx.stroke();

        // Station Distinct Visual Motif
        if (step.id === 1) {
          // Family Setup: User Profiles & Language Grid Motif
          ctx.fillStyle = step.color;
          ctx.beginPath();
          ctx.arc(sx, stationY - 5 * currentZoom.current, 6 * currentZoom.current, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(sx, stationY + 8 * currentZoom.current, 10 * currentZoom.current, Math.PI, 0);
          ctx.fill();
        } else if (step.id === 2) {
          // Tablet Dock: Screen & Charging Stand
          ctx.fillStyle = step.color;
          ctx.fillRect(
            sx - 10 * currentZoom.current,
            stationY - 10 * currentZoom.current,
            20 * currentZoom.current,
            15 * currentZoom.current
          );
          ctx.fillStyle = '#07111F';
          ctx.fillRect(
            sx - 8 * currentZoom.current,
            stationY - 8 * currentZoom.current,
            16 * currentZoom.current,
            11 * currentZoom.current
          );
          ctx.fillStyle = '#38D9C5';
          ctx.fillRect(
            sx - 2 * currentZoom.current,
            stationY + 6 * currentZoom.current,
            4 * currentZoom.current,
            5 * currentZoom.current
          );
        } else if (step.id === 3) {
          // Daily Voice Guidance: Concentric Waveform Rings
          ctx.strokeStyle = step.color;
          ctx.lineWidth = 1.5;
          for (let r = 1; r <= 3; r++) {
            ctx.beginPath();
            ctx.arc(sx, stationY, (7 * r + Math.sin(time * 4) * 2) * currentZoom.current, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.fillStyle = '#F4F8FC';
          ctx.beginPath();
          ctx.arc(sx, stationY, 4 * currentZoom.current, 0, Math.PI * 2);
          ctx.fill();
        } else if (step.id === 4) {
          // Adaptive Play: 4 Cultural Memory Tiles
          const tileSize = 6 * currentZoom.current;
          ctx.fillStyle = '#F4B740';
          ctx.fillRect(sx - 8 * currentZoom.current, stationY - 8 * currentZoom.current, tileSize, tileSize);
          ctx.fillStyle = '#38D9C5';
          ctx.fillRect(sx + 2 * currentZoom.current, stationY - 8 * currentZoom.current, tileSize, tileSize);
          ctx.fillStyle = '#19C3B1';
          ctx.fillRect(sx - 8 * currentZoom.current, stationY + 2 * currentZoom.current, tileSize, tileSize);
          ctx.fillStyle = '#8B7CFF';
          ctx.fillRect(sx + 2 * currentZoom.current, stationY + 2 * currentZoom.current, tileSize, tileSize);
        } else if (step.id === 5) {
          // Longitudinal Care: Sparkline Analytics Curve & 3-Node Stakeholder Ring
          ctx.strokeStyle = '#8B7CFF';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sx - 10 * currentZoom.current, stationY + 4 * currentZoom.current);
          ctx.lineTo(sx - 4 * currentZoom.current, stationY - 2 * currentZoom.current);
          ctx.lineTo(sx + 2 * currentZoom.current, stationY + 2 * currentZoom.current);
          ctx.lineTo(sx + 10 * currentZoom.current, stationY - 8 * currentZoom.current);
          ctx.stroke();
        }

        // Circular Floating Step Badge "01".."05"
        const badgeY = stationY - coreRadius - 16 * currentZoom.current;
        ctx.beginPath();
        ctx.arc(sx, badgeY, 12 * currentZoom.current, 0, Math.PI * 2);
        ctx.fillStyle = '#07111F';
        ctx.fill();
        ctx.strokeStyle = step.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = isActive ? '#38D9C5' : '#F4F8FC';
        ctx.font = `900 ${Math.max(9, 10 * currentZoom.current)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(step.stepNumber, sx, badgeY);

        // Station Title Label below
        ctx.fillStyle = isActive ? '#38D9C5' : '#F4F8FC';
        ctx.font = `bold ${Math.max(10, 11 * currentZoom.current)}px sans-serif`;
        ctx.fillText(step.title, sx, stationY + coreRadius + 16 * currentZoom.current);

        ctx.fillStyle = '#7F91A6';
        ctx.font = `600 ${Math.max(8, 9 * currentZoom.current)}px sans-serif`;
        ctx.fillText(step.category, sx, stationY + coreRadius + 28 * currentZoom.current);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeStep, hoveredStep, prefersReducedMotion]);

  return (
    <div className="w-full h-full min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] relative rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing select-none flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={900}
        height={540}
        onPointerMove={handlePointerMove}
        onClick={handleCanvasClick}
        onPointerLeave={() => {
          setHoveredStep(null);
          mouseParallax.current = { x: 0, y: 0 };
        }}
        className="w-full h-full max-h-[560px] block"
      />

      {/* Floating 3D Interaction Hints */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none text-xs text-[#7F91A6]">
        <span className="bg-[#0B1726]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#243A50]">
          ✨ Click any station (01–05) to inspect clinical details
        </span>
        <span className="hidden sm:inline bg-[#0B1726]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#243A50]">
          ↔ Continuous 3D Medical Onboarding Pathway
        </span>
      </div>
    </div>
  );
};
