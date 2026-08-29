# MindCare NER — 3D Architecture & Spatial Nexus

## 1. Executive Summary
The **MindCare NER** immersive landing page features a real-time interactive 3D WebGL / Canvas hybrid environment called the **Central Nexus**. It visually represents the holistic cognitive-care ecosystem across North East India, linking 9 interactive spatial zones with the central intelligence core.

---

## 2. Spatial Scene Topology & Coordinates

```
                         [ 3D Central Nexus ]
                                  ◉
             🧠 Cognitive         |        🌿 Memory Garden
           [0, 1.2, 4.0]          |          [4.0, 0.4, 0]
                 \                |               /
                  \      👨‍👩‍👧 Family Connect     /
                   \     [2.8, 0.2, -2.8]       /
                    \             |            /
                     📅 Routine --+-- 👩‍⚕️ Caregiver
                   [2.8, 0.8, 2.8] |   [0, 0.6, -4.0]
                                  |
                           🩺 Clinician
                         [-2.8, 0.8, -2.8]
                                  |
                             🤖 AI Core
                           [-4.0, 0.5, 0]
                                  |
                        🌐 Multilingual Voice
                          [-2.8, 1.2, 2.8]
                                  |
                           🔒 Security Vault
                          [-1.4, -0.6, 3.6]
```

### Zone Coordinates Table

| Zone ID | Spatial Zone | Category | Coordinate [X, Y, Z] | Target Anchor |
| :--- | :--- | :--- | :--- | :--- |
| `zone-cognitive` | 🧠 Cognitive Activities | Cognitive | `[0, 1.2, 4.0]` | `#section-cognitive-activities` |
| `zone-routine` | 📅 Daily Routine | Routine | `[2.8, 0.8, 2.8]` | `#section-daily-routine` |
| `zone-memory` | 🌿 Memory Garden | Memory | `[4.0, 0.4, 0]` | `#section-memory-garden` |
| `zone-family` | 👨‍👩‍👧 Family Connect | Family | `[2.8, 0.2, -2.8]` | `#section-family-connect` |
| `zone-caregiver` | 👩‍⚕️ Caregiver Portal | Care | `[0, 0.6, -4.0]` | `#section-caregiver` |
| `zone-clinician` | 🩺 Clinician Telemetry | Clinical | `[-2.8, 0.8, -2.8]` | `#section-clinician` |
| `zone-ai` | 🤖 AI Personalization | AI | `[-4.0, 0.5, 0]` | `#section-ai-intelligence` |
| `zone-language` | 🌐 Languages & Dialects | System | `[-2.8, 1.2, 2.8]` | `#section-voice-language` |
| `zone-security` | 🔒 Security & Privacy Vault | System | `[-1.4, -0.6, 3.6]` | `#section-security` |

---

## 3. Materials, Lighting & Shading Model

- **Metallic:** Central Nexus outer platform rings and planetary orbits.
- **Glass / Translucent:** Floating UI inspection cards and background ambient glow.
- **Emissive:** Interactive zone beacons with pulsing alpha glows.
- **Lighting Model:**
  - *Ambient / Hemisphere:* Soft deep navy base illumination (`#0B1726`).
  - *Key Directional:* Cool teal overhead light (`#19C3B1`) casting soft procedural shadows.
  - *Zone Point Lights:* Subtle localized color beacons matched to zone thematic colors.

---

## 4. Camera Modes & Interaction Controls

1. **Orbit Camera:** Dragging rotates the spatial nexus smoothly around the central core.
2. **Parallax Camera:** Mouse movement displaces the perspective by ±18px on X and ±12px on Y.
3. **Zoom System:** Pinch-to-zoom and mouse wheel adjust orbital scale from 0.8x to 1.4x.
4. **Zone Focus:** Clicking any spatial node centers the camera and opens the contextual telemetry card.
5. **Auto-Rotation:** Gentle 0.35 deg/frame rotation with pause/resume toggle.

---

## 5. Performance Modes & WebGL Fallback

- **Full 3D Mode:** 60 FPS on modern desktop GPUs with particle simulation and dynamic glow.
- **Lite 3D Mode:** Optimized mobile/tablet rendering with reduced particle count and touch optimization.
- **2D Mode:** Accessible high-contrast card grid for reduced motion users (`prefers-reduced-motion: reduce`) or systems without WebGL support.
