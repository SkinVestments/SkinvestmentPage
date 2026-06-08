import React, { lazy, Suspense } from 'react';
import { Hero } from '../components/Hero';

const DeepDive = lazy(() =>
  import('../components/DeepDive').then((m) => ({ default: m.DeepDive })),
);
const Features = lazy(() =>
  import('../components/Features').then((m) => ({ default: m.Features })),
);

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={null}>
        <DeepDive />
        <Features />
      </Suspense>
    </>
  );
}
