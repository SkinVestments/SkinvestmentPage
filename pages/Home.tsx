import React, { lazy, Suspense } from 'react';
import { Hero } from '../components/Hero';
import { usePageSeo } from '@/hooks/usePageSeo';
import { PAGE_SEO } from '@/utils/seo';

const DeepDive = lazy(() =>
  import('../components/DeepDive').then((m) => ({ default: m.DeepDive })),
);
const Features = lazy(() =>
  import('../components/Features').then((m) => ({ default: m.Features })),
);

export default function Home() {
  usePageSeo(PAGE_SEO.home);

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
