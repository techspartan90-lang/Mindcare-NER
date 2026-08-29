# MindCare NER — Performance & Optimization Strategy

## 1. Target Metrics
- **Frame Rate:** Consistent 60 FPS on desktop WebGL; 30+ FPS on mobile devices.
- **Initial Load Time:** Under 1.5 seconds on standard 4G connections.
- **Bundle Size:** Minified JS gzip under 300 kB.

---

## 2. Optimization Techniques
1. **Procedural 3D Geometry:** Minimized external polygon assets to avoid massive GLB network payloads.
2. **Dynamic Level of Detail (LOD):** Reduced particle counts (from 28 to 0) and shadow passes in mobile / Lite 3D mode.
3. **Hardware Acceleration:** Hardware-accelerated CSS transforms (`transform: translate3d`) for zero layout jank.
4. **Debounced Resize & Parallax:** RequestAnimationFrame throttling for smooth mouse tracking and scroll events.
