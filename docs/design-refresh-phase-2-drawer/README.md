# Phase 2 / PR4 — Mobile drawer

## Behaviour

- Panel slides in from the left and exits to the left (`drawerPanelVariants` + `springDefault`).
- Scrim fades in sync (`drawerScrimVariants` + `fadeCross`).
- Drawer + scrim stay mounted on mobile so reopen mid-close retargets the spring from the live `x` / opacity (interruptible).
- Escape, scrim click, and the X control all call `onMobileClose`.
- Body scroll lock remains in `DashboardLayout` and clears when `mobileOpen` becomes false (including mid-animation).

## Screenshots

Capture logged-in at 390px (drawer open/close) and 1440px (desktop sidebar unchanged):

1. Sign in locally.
2. Open `/panel`, toggle the menu on a 390 viewport, spam open/close + Escape while opening.
3. Drop PNGs or a short recording into this folder (`drawer-390-dark.png`, etc.).

Unauthenticated automation only reaches Sign In; logged-in captures are required for drawer verification.
