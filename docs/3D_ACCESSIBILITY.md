# MindCare NER — 3D Accessibility & Inclusive Design (WCAG 2.2)

## Inclusive Design Philosophy

3D graphics must **never** be an obstacle to elderly patients, visually impaired caregivers, or clinicians working on assistive hardware. MindCare NER implements a dual-layer architectural approach ensuring that all information and interactions in 3D are mirrored with semantic HTML equivalents.

---

## 1. Reduced Motion Compliance (`prefers-reduced-motion`)

The platform listens for system-level reduced motion preferences via `useReducedMotion()`:
- When active, the system automatically defaults to **2D Accessible Mode**.
- Floating animations, camera orbit transitions, parallax drift, and pulse oscillations are safely bypassed.

---

## 2. Keyboard Navigation & Focus Matrix

All 9 spatial zones support keyboard navigation without requiring mouse or touch input:

| Key Binding | Action |
|---|---|
| `Tab` / `Shift + Tab` | Navigate interactive HUD controls & fallback cards |
| `Arrow Right` / `Arrow Down` | Select next spatial zone and smoothly focus camera |
| `Arrow Left` / `Arrow Up` | Select previous spatial zone |
| `Enter` / `Space` | Inspect selected zone / activate CTA |
| `Escape` | Reset camera view and return to overview |

---

## 3. High-Contrast & Screen-Reader Equivalents

- Every 3D node has a companion HTML description rendered inside the Right-hand Inspector Card with high contrast ratios (> 7:1) meeting WCAG AAA guidelines.
- `WebGLFallback` provides ARIA roles (`role="region"`, `aria-label`, `role="button"`, `aria-pressed`) ensuring screen readers like NVDA, JAWS, and VoiceOver announce zone details, metrics, and navigation actions accurately.
