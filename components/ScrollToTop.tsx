import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scroll to top on client-side route changes. Trailing slash / HTTPS redirects are handled server-side. */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
