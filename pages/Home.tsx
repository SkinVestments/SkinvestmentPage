import React, { lazy, Suspense } from 'react';
import { Hero } from '../components/Hero';
import { usePageSeo } from '@/hooks/usePageSeo';
import { PAGE_SEO } from '@/utils/seo';
import { HOME_SEO } from '@/content/seoCopy';
import { SeoContentSection } from '@/components/SeoContentSection';

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
      <SeoContentSection page={HOME_SEO} className="border-t border-steam-border/40" />
    </>
  );
}
