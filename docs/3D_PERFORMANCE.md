# MindCare NER — 3D Performance & Optimization Guide

## Performance Targets

- **Desktop (High-Tier)**: Solid **60 FPS** at DPR 1–2 with 250 floating particles, directional soft shadows, and full spline waveguide animation.
- **Mobile / Tablet (Mid/Low-Tier)**: Stable **45–60 FPS** at DPR 1 with 40–100 particles, simplified lighting, and reduced geometry complexity.
- **Low GPU / Fallback**: Immediate graceful fallback to accessible 2D glassmorphic grid without freezing or blocking main UI thread.

---

## Key Optimization Rules Implemented

### 1. Zero `setState` Inside `useFrame` Loops
- React state updates are strictly decoupled from per-frame rendering loops.
- Position, rotation, and scale transformations are applied directly to `Object3D` references using `THREE.MathUtils.damp` and `Vector3.lerp`.

### 2. Single-Buffer GPU Instancing for Particles
- `ZeroGravityParticles` uses a single `BufferGeometry` with interleaved `Float32Array` attributes and points rendering with additive blending, replacing hundreds of individual React mesh nodes with **1 single draw call**.

### 3. Procedural Waveguide Splines
- `NeuralNetwork` precomputes 9 `QuadraticBezierCurve3` paths and reuses geometry across frames, updating only 9 small energy packet pulse sphere positions.

### 4. Dynamic Performance Tiering
- `useDevicePerformance` assesses:
  - WebGL/WebGL2 Context availability
  - `navigator.hardwareConcurrency`
  - `navigator.deviceMemory`
  - Viewport width breakpoints
- `PerformanceController` tracks live FPS and automatically signals throttling if frame rates drop below 30 FPS.

---

## Draw Call & Triangle Budget

| Layer | Triangles | Draw Calls | Texture Memory |
|---|---|---|---|
| Central Nexus & Orbit Rings | ~1,800 | 4 | ~128 KB (Procedural) |
| 9 Neural Nodes & Shields | ~2,400 | 9 | ~0 KB (Standard materials) |
| Waveguide Splines & Pulses | ~600 | 18 | 0 KB |
| Zero-Gravity Particles | 250 points | 1 | 64x64 Canvas Texture |
| Environment & Lighting | ~100 | 2 | 0 KB |
| **Total Scene Budget** | **< 5,000** | **< 35** | **< 500 KB** |
