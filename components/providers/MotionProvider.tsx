import React from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import { springDefault } from '@/lib/motion';

interface MotionProviderProps {
  children: React.ReactNode;
}

/**
 * App-wide Motion setup:
 * - LazyMotion + domAnimation keeps the feature bundle small; use `m` (not `motion`).
 * - MotionConfig reducedMotion="user" centralizes prefers-reduced-motion.
 * - Default transition is the critically damped spring from lib/motion.ts.
 */
export const MotionProvider: React.FC<MotionProviderProps> = ({ children }) => (
  <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user" transition={springDefault}>
      {children}
    </MotionConfig>
  </LazyMotion>
);
