# MindCare NER — Accessibility & Inclusivity Standards (WCAG 2.2 AAA)

## 1. Core Principles for Senior Users
- **Oversized Touch Targets:** Minimum 48px to 64px button dimensions for tremor compensation.
- **High-Contrast Text:** 7:1 contrast ratio against `#07111F` / `#101F31` surfaces.
- **Voice-First Navigation:** Auditory narration and voice prompting across 7 regional dialects.
- **Reduced Motion:** Automatic fallback to 2D card grid when `prefers-reduced-motion: reduce` is active.

---

## 2. Keyboard & Screen Reader Support
- Standard `Tab` and `Shift+Tab` navigates all interactive zones and action CTAs.
- Full ARIA semantics (`role="region"`, `aria-label`, `aria-expanded`).
- No critical information is trapped solely within canvas pixels; all descriptions exist as crawlable semantic HTML.
