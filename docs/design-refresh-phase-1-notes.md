# Design refresh — Phase 1 notes

## Checkout delay (ManageSubscriptionModal)

Git history (`08ee80ba`): the `setTimeout(..., 250)` was artificial UX latency on the **free/local plan select** path after RevenueCat checkout was added. Paid checkout already called `window.open` synchronously in the click handler (required for popup blockers).

**Change:** removed the 250ms delay on free plan select. Paid path unchanged: build URL → `window.open` sync → close. No `upgrade_viewed` / checkout analytics on this clean branch of the modal (those live in uncommitted WIP); when analytics lands, keep firing before/around the sync `window.open`, never after an await that would break the user-gesture chain.

## Phase 1 deliverables

- `.pressable` (scale 0.97) on buttons/chips/tabs/nav/icon buttons; `.pressable-row` tint for dense rows
- `.num` tabular lining on money / % / quantities
- `.dashboard-label` font-size `0.625rem` (was 10px)
- `prefers-reduced-motion` / `reduced-transparency` / `prefers-contrast: more`
- Body theme color transition disabled under reduced motion
- History table + Panel hero/metric skeletons sized to final layout
- History badge PROFIT/LOSS/EVEN is in a separate PR (`fix/history-sell-pnl-badge`); cherry-picked here so History stays consistent
