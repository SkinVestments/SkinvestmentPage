import React, { useEffect, useState } from 'react';
import { Package } from 'lucide-react';

export interface ItemImageProps {
  src?: string | null;
  alt?: string;
  /** Classes on the <img> when loaded */
  className?: string;
  /** Classes on the placeholder wrapper (and outer wrap when image loads) */
  wrapperClassName?: string;
}

export const ItemImage: React.FC<ItemImageProps> = ({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const trimmed = src?.trim();
  const showPlaceholder = !trimmed || failed;

  if (showPlaceholder) {
    return (
      <div
        className={`flex items-center justify-center bg-steam-elevated border border-steam-border/60 ${wrapperClassName} ${className}`}
        role="img"
        aria-label={alt ? `${alt} (no image)` : 'Item image unavailable'}
      >
        <Package className="w-[45%] h-[45%] max-w-10 max-h-10 text-steam-tertiary opacity-50 shrink-0" aria-hidden />
      </div>
    );
  }

  return (
    <img
      src={trimmed}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
    />
  );
};
