import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthClass = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-steam-bg/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`relative z-10 bg-steam-card border border-steam-border rounded-2xl w-full ${maxWidthClass[maxWidth]} max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-fade-in`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-steam-border shrink-0">
          <div>
            <h3 id="modal-title" className="text-xl font-bold text-steam-text">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-steam-secondary mt-1">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-steam-tertiary hover:text-steam-text hover:bg-steam-hover transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 sm:p-6 text-steam-text">{children}</div>

        {footer && (
          <div className="flex flex-col-reverse sm:flex-row gap-3 p-5 sm:p-6 border-t border-steam-border shrink-0 bg-steam-elevated/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
