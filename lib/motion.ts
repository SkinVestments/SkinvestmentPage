import type { Transition } from 'motion/react';

/**
 * Named Motion presets for Skinvestments.
 * Components must import transitions from here — no inline spring configs.
 *
 * Phase 2 uses `springDefault` only. `springMomentum` is reserved for
 * flick / drag-release (sheets) in a later phase.
 */

/** Critically damped — no overshoot. Default for modals, drawers, chrome. */
export const springDefault: Transition = {
  type: 'spring',
  bounce: 0,
  duration: 0.35,
};

/** Under-damped — slight bounce. Only for momentum / flick handoff. Unused in phase 2. */
export const springMomentum: Transition = {
  type: 'spring',
  bounce: 0.2,
  duration: 0.35,
};

/** Reduced-motion / non-transform fallback (opacity cross-fade). */
export const fadeCross: Transition = {
  type: 'tween',
  duration: 0.2,
  ease: 'easeOut',
};
