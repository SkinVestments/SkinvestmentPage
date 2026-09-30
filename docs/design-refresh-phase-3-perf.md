# Phase 3 / PR5 - Performance pass

## Code changes

- `.dashboard-card` explicitly sets `backdrop-filter: none` (frost stays on sticky chrome only).
- Inventory grid cards use `.inventory-grid-card` with `content-visibility: auto` and `contain-intrinsic-size: auto 280px` so off-screen cards skip paint while scrolling large inventories.
- No new filters or blur on inventory rows/cards. Pre-existing item `drop-shadow` on grid thumbnails is unchanged.

## Audit confirmation

| Surface | backdrop-filter / new filters |
| --- | --- |
| Sticky chrome (mobile top bar, sidebar header, Settings tabs) | Yes (`chrome-material` tokens) |
| Inventory grid cards / list rows | None |
| Cookie banner | Solid surface (no frost-on-frost) |

## How to record

With the app running and a logged-in Playwright storage state:

```bash
PHASE3_BASE_URL=http://localhost:3000
PHASE3_STORAGE_STATE=./.auth/storage.json
PHASE3_SHARE_PATH=/p/<real-token>
node scripts/phase3-perf.mjs
node scripts/phase3-screenshots.mjs
```

Outputs:

- `docs/design-refresh-phase-3/perf-summary.json` (scroll sample + Lighthouse Performance / CLS / LCP)
- `docs/design-refresh-phase-3/screenshots/*` including `*-scrolled-*` frost under content

## Recorded results (this PR)

### Inventory 500-card scroll harness (`inventory-scroll-500.json`)

Synthetic grid @ 390×844, production CSS:

| | approx FPS | avg frame ms | frosted cards |
| --- | --- | --- | --- |
| Before `content-visibility` | 62.6 | 15.96 | 0 |
| After `.inventory-grid-card` | 61.7 | 16.20 | 0 |

Confirmation: **0** cards with `backdrop-filter` before and after. Machine was already frame-budgeted on empty cards; containment is for real inventories with images/filters.

### Lighthouse mobile (`perf-summary.json`, preview without auth)

| Route | Performance | CLS | LCP |
| --- | --- | --- | --- |
| `/panel` (redirected to Sign in) | 85 | 0.026 | 4160 ms |
| `/inventory` (redirected to Sign in) | 96 | 0.026 | 2731 ms |
| `/p/demo` (invalid share → unavailable) | 66 | 0.300 | 4990 ms |

Phase 1 Lighthouse baselines were not committed in-repo. Re-run with `PHASE3_STORAGE_STATE` + a real `PHASE3_SHARE_PATH` for dashboard and valid share scores.

Screenshots under `docs/design-refresh-phase-3/screenshots/` need the same auth storage to show frosted chrome with content underneath.
