# FreightIQ — APL Cargo Inc.

AI Freight Orchestration & Decision Intelligence Platform — demo build.

## Run

```bash
npm install        # one time
npm run dev        # http://localhost:5173 (or 5174 if 5173 is taken)
npm run build      # type-check + production bundle into ./dist
npm run preview    # serve the production bundle locally
npm run typecheck  # types only
```

Open the dashboard at `http://localhost:5173/dashboard`.

## What's built

- **Executive Dashboard** — fully composed: KPI strip · live operations map · AI insights feed · at-risk loads table · 30-day performance trends · exceptions preview · agentic workflows · Copilot prompt bar · AI-recommendation modal.
- **App shell** — sidebar (with active accent, badges, "Coming soon" pill, AI accent on Copilot) · topbar (search + ⌘K · Ask Copilot · notifications · avatar) · Copilot FAB (bottom-right, on every authed screen).
- **Stub pages** for the remaining 9 routes — clicking any sidebar item lands on a polished placeholder, so the demo never breaks.

## Stack

React 18 · TypeScript · Vite · Tailwind 3 · Radix Primitives · Recharts · React Router 6 · lucide-react.

Fonts: Inter (UI) · Fraunces (display) · JetBrains Mono (numerics, IDs).

## Design tokens

All colors, type scale, radii, shadows, and animations live in `tailwind.config.ts` + `src/styles/globals.css`. Status colors come from `src/lib/status.ts` — never hardcoded.

## Mock data

`src/mocks/seed/*` — KPIs, loads, trucks, insights, exceptions, performance series. Hand-authored hero records (Unit #217 / M. Garza / Walmart DC, Laredo–Memphis lane) for a coherent demo narrative.
