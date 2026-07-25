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
const HomeBlog = lazy(() =>
  import('../components/HomeBlog').then((m) => ({ default: m.HomeBlog })),
);

export default function Home() {
  usePageSeo(PAGE_SEO.home);

  return (
    <>
      <Hero />
      <Suspense fallback={null}>
        <DeepDive />
        <Features />
        <HomeBlog />
      </Suspense>
    </>
  );
}
