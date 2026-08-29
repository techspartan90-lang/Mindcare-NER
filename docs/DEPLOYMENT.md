# MindCare NER — Production Deployment Guide

## 1. Local Development
```bash
npm install
npm run dev
# App starts at http://localhost:5173
```

---

## 2. Production Build
```bash
npm run build
# Compiles Vite frontend into /dist and bundles server.ts into /dist/server.cjs
```

---

## 3. Production Launch
```bash
npm start
# Launches Express backend serving dist/ on PORT (default: 5173 / 3000)
```
