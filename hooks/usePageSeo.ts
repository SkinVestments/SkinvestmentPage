import { useEffect } from 'react';
import { setPageSeo } from '@/utils/seo';

export function usePageSeo({
  title,
  description,
  path = '/',
  robots = 'index, follow',
}: {
  title: string;
  description: string;
  path?: string;
  robots?: string;
}) {
  useEffect(() => {
    setPageSeo({ title, description, path, robots });
  }, [title, description, path, robots]);
}
