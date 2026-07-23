import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { PortfolioSharePanel } from '@/components/dashboard/PortfolioSharePanel';

interface PortfolioShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortfolioShareModal: React.FC<PortfolioShareModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-steam-bg/85 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close share dialog overlay"
      />

      <div
        className="relative z-10 bg-steam-card border border-steam-border rounded-2xl w-full max-w-5xl max-h-[min(92vh,900px)] shadow-2xl flex flex-col animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-share-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-lg text-steam-secondary hover:text-steam-text hover:bg-steam-hover transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1 min-h-0 p-5 sm:p-6 pr-12 sm:pr-14">
          <h2 id="portfolio-share-modal-title" className="sr-only">
            Share portfolio
          </h2>
          <PortfolioSharePanel embedded />
        </div>
      </div>
    </div>
  );
};
