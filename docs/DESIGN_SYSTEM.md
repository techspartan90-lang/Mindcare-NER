# MindCare NER — Unified Healthcare UI/UX Design System

## 1. Global Visual Style & Aesthetic Principles

- **Dark Medical Technology**: Calm, trustworthy, clinical-grade, modern, and human-centered.
- **Color Contrast & Readability**: Exceeds WCAG 2.2 AA (minimum 4.5:1 for body, 7:1 for headers).
- **Tactile Senior Affordance**: Minimum 48–64px touch targets on patient interfaces.

---

## 2. Color Palette Tokens

```css
/* Backgrounds */
--bg-primary: #07111F;        /* Deep Space Medical Canvas */
--bg-secondary: #0B1726;      /* Sub-canvas & Sidebar */
--surface: #101F31;           /* Component Surface */
--surface-elevated: #14283D;  /* Hover / Highlight / Topbars */
--card: #162B40;              /* Card Background */
--border: #243A50;            /* Subtle Structure Borders */

/* Brand & Accents */
--primary-teal: #19C3B1;      /* Cognitive Primary Action */
--light-teal: #38D9C5;        /* Glow / Interactive Hover */
--medical-blue: #5BA7FF;      /* Clinical / Caregiver Accent */
--ai-purple: #8B7CFF;         /* AI / Machine Learning Engine */

/* Status Indicators */
--success: #35D07F;           /* Adherence / Online / Completed */
--warning: #F4B740;           /* Missed Window / Caution */
--error: #FF5C6C;             /* Emergency / Critical Alert */

/* Typography */
--text-primary: #F4F8FC;      /* High-contrast headings & labels */
--text-secondary: #B7C5D6;    /* Body text & descriptors */
--text-muted: #7F91A6;        /* Placeholders, hints & timestamps */
```

---

## 3. Typography Hierarchy

| Level | Desktop Marketing | Dashboard Application | Patient Tablet UI |
|---|---|---|---|
| **H1** | 56–72px / Bold 900 | 28–36px / Bold 900 | 32–40px / Bold 900 |
| **H2** | 40–48px / Bold 800 | 22–28px / Bold 800 | 24–30px / Bold 800 |
| **H3** | 28–32px / Bold 700 | 18–22px / Bold 700 | 20–24px / Bold 700 |
| **Body** | 16–18px / Regular 400 | 14–16px / Regular 400 | 18–24px / Bold 600 |
| **Caption/Tag** | 12–14px / Bold 700 | 10–12px / Bold 700 | 14–16px / Bold 700 |

---

## 4. Component Standards

### Buttons
- **Primary**: Solid `#19C3B1` with `#07111F` text, 12px rounded, shadow pulse on hover.
- **Secondary**: Elevated surface `#14283D`, border `#243A50`, text `#F4F8FC`.
- **Danger**: Red `#FF5C6C` with `#2B1218` background on hover.
- **States**: `Default`, `Hover`, `Focus-visible (ring-2)`, `Active (scale-98)`, `Disabled (opacity-50)`.

### Cards & Panels
- Background `#101F31` or `#14283D`
- Border 1px solid `#243A50`
- Border radius: `rounded-2xl` (16px) or `rounded-3xl` (24px)
- Padding: 16px (mobile) to 24px–32px (desktop)
