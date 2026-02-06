import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Przewija na samą górę po zmianie ścieżki
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};