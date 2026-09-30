# Phase 1 screenshots

Captured via `scripts/phase1-screenshots.mjs` at 390px and 1440px, dark and light.

**Auth note:** Without a session, `/panel`, `/history`, and `/inventory` redirect to Sign In. Files named `after-*-{viewport}-{theme}.png` currently show that redirect (useful for theme/viewport chrome only).

For true before/after of Panel and History (tabular nums, skeletons, press), re-run while logged in:

```bash
PHASE1_BASE_URL=http://localhost:3000 node scripts/phase1-screenshots.mjs
```

Or capture manually in the browser after signing in.
