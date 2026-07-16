import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (import.meta.env.PROD && window.location.protocol === 'http:') {
      window.location.replace(
        `https://${window.location.host}${pathname}${search}${hash}`,
      );
      return;
    }

    if (pathname.length > 1 && pathname.endsWith('/')) {
      navigate(`${pathname.replace(/\/+$/, '')}${search}${hash}`, { replace: true });
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname, search, hash, navigate]);

  return null;
};
