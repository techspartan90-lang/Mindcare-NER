# MindCare NER — Dark Visual Design System

## 1. Color Palette Tokens

```css
:root {
  --bg-primary: #07111F;
  --bg-secondary: #0B1726;
  --surface: #101F31;
  --surface-elevated: #14283D;
  --surface-card: #162B40;
  
  --teal-primary: #19C3B1;
  --teal-secondary: #38D9C5;
  --blue-accent: #5BA7FF;
  --purple-accent: #8B7CFF;
  
  --success: #35D07F;
  --warning: #F4B740;
  --danger: #FF5C6C;
  
  --text-primary: #F4F8FC;
  --text-secondary: #B7C5D6;
  --text-muted: #7F91A6;
  
  --border: #243A50;
}
```

---

## 2. Typography Guidelines
- **Primary Headings:** Sans-serif bold/black weight with tight tracking (`-0.02em`).
- **Body & Subtitles:** Regular/medium weight (`#B7C5D6`) with 1.6 line height for senior legibility.
- **Microcopy & Metadata:** Uppercase tracking (`0.05em`) with muted `#7F91A6` tone.

---

## 3. Interactive Component States
- **Default:** Clean `#101F31` or `#14283D` card with subtle `#243A50` border.
- **Hover:** Border shifts to `#19C3B1` / `#38D9C5` with soft 12px shadow elevation.
- **Active / Pressed:** `scale(0.98)` or `scale(0.95)` with tactile audio feedback (`sound.playClick()`).
- **Focused:** 2px high-contrast outline (`#19C3B1`) ensuring keyboard navigability.
