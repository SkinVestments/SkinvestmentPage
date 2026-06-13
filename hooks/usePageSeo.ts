import { useEffect } from 'react';
import { setPageSeo } from '@/utils/seo';

export function usePageSeo({
  title,
  description,
  path = '/',
}: {
  title: string;
  description: string;
  path?: string;
}) {
  useEffect(() => {
    setPageSeo({ title, description, path });
  }, [title, description, path]);
}
