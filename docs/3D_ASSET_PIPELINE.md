# MindCare NER — 3D Asset & Shader Pipeline

## Geometry & Material Architecture

To ensure zero bundle bloat and instant loading on slow North East cellular and offline connections (Edge Edge Architecture):

1. **Procedural Geometry**:
   - `CentralNexus`: Procedural `icosahedronGeometry` + `sphereGeometry` + `torusGeometry`.
   - `NeuralNodes`: Procedural `sphereGeometry` and outer wireframe `icosahedronGeometry`.
   - `Waveguides`: Pre-calculated mathematical spline lines with zero network asset download latency.
2. **Procedural Shaders & Canvas Textures**:
   - Particle textures are generated at runtime via off-screen HTML5 Canvas (64x64px radial alpha gradients), avoiding network round-trips for PNGs.
3. **Materials**:
   - `meshStandardMaterial` with tuned `roughness`, `metalness`, and `emissive` values for medical aesthetic.
   - Additive blending (`THREE.AdditiveBlending`) on stardust particles with `depthWrite: false` for transparency efficiency.
