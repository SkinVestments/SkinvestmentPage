# Phase 2 / PR1 — Motion setup (no visual changes)

## What landed

- Dependency: `motion@13.4.6`
- `lib/motion.ts` — named presets only (`springDefault`, `springMomentum` reserved, `fadeCross`)
- `components/providers/MotionProvider.tsx` — `LazyMotion` + `domAnimation` + `strict`, `MotionConfig reducedMotion="user"` with `transition={springDefault}`
- Wired at app root in `App.tsx` (inside Theme/Auth, wrapping router)

No UI components animate yet. Later PRs import `m` from `motion/react-m` and presets from `@/lib/motion`.

## Bundle size delta (`vite build`, production)

Measured on `origin/dev` before vs this branch after wiring `MotionProvider`.

| Metric | Before | After | Delta |
| --- | ---: | ---: | ---: |
| Entry `index-*.js` (raw) | 69.25 kB | 138.93 kB | **+69.7 kB** |
| Entry `index-*.js` (gzip, Vite report) | 22.08 kB | 47.52 kB | **+25.4 kB** |
| All `dist/assets/*.js` (raw) | 1552.23 kB | 1623.54 kB | **+71.3 kB** |

Entry absorbs sync `domAnimation` features; other route chunks are unchanged in this PR.

### Notes

- Sync `features={domAnimation}` matches the agreed LazyMotion setup (animations + exit + gestures; not `domMax` / drag).
- Cost is expected until overlays use `m`; there is no separate motion chunk yet because features are provided synchronously at the root.
- If we later need a smaller first paint, we can switch to async `features={() => import(...)}` without changing presets — out of scope for this PR.
