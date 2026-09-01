# AGENTS.md — MindCare NER

MindCare NER is an AI-assisted cognitive care platform for elderly seniors in
North East India. React 19 + TypeScript + Vite frontend, Node/Express backend.

## Commands

- `npm run dev` — start the dev server (tsx server.ts)
- `npm run lint` — `tsc --noEmit` typecheck
- `npm run build` — production build (vite + esbuild server bundle)

## Conventions

- TypeScript strict mode; keep types in `src/types/`.
- Tailwind CSS v4; design tokens are documented in `docs/DESIGN_SYSTEM.md`.
  Core dark theme colors: `#07111F` / `#101F31` / `#19C3B1`.
- Accessibility (WCAG 2.2 AAA) is a hard requirement: 64px tactile targets,
  high-contrast theme, tremor compensation, reduced-motion support.
- Feature code lives in `src/components/`, logic in `src/services/` and
  `src/hooks/`, config in `src/config/`.
- Do not add code comments unless asked; follow existing patterns.
