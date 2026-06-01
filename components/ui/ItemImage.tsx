import React, { useEffect, useState } from 'react';
import { Package } from 'lucide-react';

export interface ItemImageProps {
  src?: string | null;
  alt?: string;
  /** Classes on the <img> when loaded */
  className?: string;
  /** Classes on the outer wrapper (always applied) */
  wrapperClassName?: string;
}

const wrapperBase = 'flex items-center justify-center overflow-hidden';

export const ItemImage: React.FC<ItemImageProps> = ({
  src,
  alt = '',
  className = 'max-w-full max-h-full object-contain',
  wrapperClassName = '',
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const trimmed = src?.trim();
  const showPlaceholder = !trimmed || failed;
  const wrapperClass = [wrapperBase, wrapperClassName].filter(Boolean).join(' ');

  if (showPlaceholder) {
    return (
      <div
        className={`bg-steam-elevated border border-steam-border/60 ${wrapperClass}`}
        role="img"
        aria-label={alt ? `${alt} (no image)` : 'Item image unavailable'}
      >
        <Package
          className="w-[45%] h-[45%] max-w-10 max-h-10 text-steam-tertiary opacity-50 shrink-0"
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <img
        src={trimmed}
        alt={alt}
        className={className}
        onError={() => setFailed(true)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};
