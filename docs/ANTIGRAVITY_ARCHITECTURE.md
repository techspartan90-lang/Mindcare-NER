# MindCare NER — Antigravity 3D Visual System Architecture

## Overview

The **MindCare NER Antigravity 3D System** is an accessible, medical-grade spatial visualization engine engineered for the MindCare North Eastern Region cognitive-care platform. It represents patients, caregivers, clinicians, AI cognitive models, daily routines, memories, native dialects, and security vaults as an interconnected floating ecosystem.

```
                    MINDCARE NER
             "REMEMBER. ENGAGE. CONNECT."

                       ◉
                CENTRAL AI NEXUS

             ·        |        ·
          🧠          |        🌿
       ACTIVITIES     |      MEMORY

                 \    |    /

             FAMILY — NEXUS — AI

                 /    |    \

            ROUTINE   |   CAREGIVER

                      |
                  CLINICIAN
```

---

## Design Philosophy

- **Calm, Intelligent & Hopeful**: Dark cosmic medical theme (`#07111F`, `#101F31`, `#19C3B1`, `#38D9C5`, `#5BA7FF`, `#8B7CFF`).
- **No Gamified Clutter**: Motion is slow, organic, and comforting—specifically calibrated for elders and families facing neurodegenerative conditions.
- **Zero-Disruption Architecture**: Retains full integration with existing audio services, voice recognition, clinical metrics, and multi-portal routing.

---

## Motion Physics & Mathematical Formulation

Rather than mechanical linear translation, the antigravity engine applies continuous sinusoidal floating layered with horizontal/depth drift, inertia damping, and spring restitution.

### 1. Vertical Floating (sinusoidal levitation)
$$Y(t) = \text{baseY} + \sin(t \cdot \text{speed} + \phi) \cdot \text{amplitude}$$

### 2. Multi-Axis Organic Drift
$$X(t) = \text{baseX} + \sin(t \cdot \text{driftSpeed} + 1.3\phi) \cdot \text{driftAmount}$$
$$Z(t) = \text{baseZ} + \cos(t \cdot 0.8\text{driftSpeed} + 0.7\phi) \cdot (0.6 \cdot \text{driftAmount})$$

### 3. Axial Breathing Rotation
$$\text{Rot}_y(t) = \text{baseRot}_y + \sin(t \cdot \text{rotationSpeed} + \phi) \cdot 0.15$$
$$\text{Rot}_x(t) = \text{baseRot}_x + \cos(t \cdot 0.7\text{rotationSpeed} + \phi) \cdot 0.08$$

### 4. Drag & Spring Bounce-Back
When an object is dragged by the user, displacement is projected onto a camera-parallel plane and clamped:
$$\vec{D}_{\text{clamped}} = \text{clamp}(\vec{D}, 0, 3.5)$$
Upon release, velocity and displacement decay exponentially via damping factor $\delta = 0.9$:
$$\vec{D}_{t+\Delta t} = \vec{D}_t \cdot \text{damping}$$
$$P_{\text{current}} = \text{damp}(P_{\text{current}}, P_{\text{target}} + \vec{D}, 8, \Delta t)$$

---

## Component Topology

```
src/
├── config/
│   └── antigravity.ts            # Central design tokens, physics & camera presets
├── hooks/
│   ├── useAntigravity.ts         # Sinusoidal float + drift + drag bounce-back
│   ├── useFloatingMotion.ts      # Multi-axis spring-float hook
│   ├── useMagneticHover.ts       # Cursor proximity pull with spring damping
│   ├── useReducedMotion.ts       # Prefers-reduced-motion listener
│   ├── useDevicePerformance.ts   # Hardware tier & WebGL capability detection
│   └── useScrollProgress.ts      # Normalized [0, 1] RAF-smoothed scroll interpolation
└── components/3d/
    ├── AntigravityScene.tsx      # R3F Canvas root with Suspense & render loop
    ├── AntigravityObject.tsx     # Drag-and-drop interactive physics wrapper
    ├── FloatingObject.tsx        # Standalone buoyant mesh primitive
    ├── FloatingGroup.tsx         # Buoyant group container
    ├── MagneticObject.tsx        # Cursor-reactive magnetic wrapper
    ├── ZeroGravityParticles.tsx  # Additive blending GPU stardust system
    ├── GravityField.tsx          # Outer force-field ambient bounds
    ├── InteractiveObject.tsx     # Hover & focus scale controller
    ├── ScrollFloatObject.tsx     # Scroll progress transform interpolator
    ├── FloatingText.tsx          # 3D HTML glassmorphism labels
    ├── CentralNexus.tsx          # Core metallic sphere + pulsing emissive rings
    ├── NeuralNode.tsx            # 9 Functional zone nodes with shields
    ├── NeuralNetwork.tsx         # Quadratic bezier waveguides & pulse packets
    ├── SceneLighting.tsx         # Medical teal, blue, and purple illumination
    ├── Environment.tsx           # Cosmic background plane & depth fog
    ├── CameraController.tsx      # OrbitControls, node focusing & view reset
    ├── WebGLFallback.tsx         # Accessible 2D fallback matrix
    ├── PerformanceController.tsx # Real-time FPS telemetry
    ├── types.ts                  # TypeScript spatial definitions
    ├── zonesData.ts              # Spatial zone configuration registry
    └── MindCare3DScene.tsx       # Main UI container bridging 3D and DOM HUD
```
