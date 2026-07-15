import { useEffect } from 'react';
import { setPageSeo, type PageSeo } from '@/utils/seo';

export function usePageSeo({
  title,
  description,
  path = '/',
  robots = 'index, follow',
  ogImage,
}: PageSeo) {
  useEffect(() => {
    setPageSeo({ title, description, path, robots, ogImage });
  }, [title, description, path, robots, ogImage]);
}
