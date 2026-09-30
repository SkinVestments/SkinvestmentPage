# Phase 3 / PR4 - Share and embed skeletons

Replaces centered spinners on `/p/:token` and `/embed/:token` with layout-matched skeletons (header, summary, chart/categories, holdings) to reduce CLS.

- Public: always shows the default-visibility shell (summary + chart + categories + 8 item cards).
- Embed: skeleton follows `?layout=` (`summary` | `top` | `sections`).
- AdSlot unchanged (none on these routes today).
