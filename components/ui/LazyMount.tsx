import React, { useEffect, useRef, useState } from 'react';

interface LazyMountProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
  rootMargin?: string;
}

/** Mount children only when near viewport — avoids Recharts layout reads on initial paint. */
export const LazyMount: React.FC<LazyMountProps> = ({
  children,
  className,
  minHeight = '12rem',
  rootMargin = '200px 0px',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} className={className} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible ? children : null}
    </div>
  );
};
