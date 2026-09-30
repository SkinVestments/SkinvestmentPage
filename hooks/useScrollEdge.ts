import { useEffect, useState, type RefObject } from 'react';

/**
 * Observes a sentinel at the top of a scroll root.
 * When the sentinel leaves the root (content scrolled under chrome), returns true.
 */
export function useScrollEdge(
  rootRef: RefObject<HTMLElement | null>,
  sentinelRef: RefObject<HTMLElement | null>,
): boolean {
  const [edged, setEdged] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEdged(!entry?.isIntersecting);
      },
      { root, threshold: 0, rootMargin: '0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [rootRef, sentinelRef]);

  return edged;
}
