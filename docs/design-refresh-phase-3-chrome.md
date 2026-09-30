# Phase 3 / PR1 — Sticky chrome materials

## What changed

- CSS tokens `--chrome-bg`, `--chrome-blur`, `--chrome-saturate`, `--chrome-edge-*`, `--chrome-highlight` for dark and light.
- `.chrome-material` + `data-edge="on|off"` scroll-edge fade (no hard border at rest).
- `.chrome-solid` for cookie banner (no blur — avoids frost-on-frost with dashboard chrome).
- Fallbacks: `@supports` without backdrop-filter, `prefers-reduced-transparency`, `prefers-contrast: more`.
- Mobile top bar: sticky inside the main scrollport so content scrolls underneath.
- Desktop sidebar brand strip: sticky frosted header over scrolling nav.
- `hooks/useScrollEdge.ts` — IntersectionObserver on a top sentinel.

## Stacking note

Modal scrim sits above chrome (dim layer). Cookie banner uses solid surface so it does not stack translucent materials with the frosted header.
