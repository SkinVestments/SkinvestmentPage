import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { X } from 'lucide-react';
import {
  fadeCross,
  modalPanelVariants,
  modalRootVariants,
  modalScrimVariants,
  springDefault,
} from '@/lib/motion';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Optional trigger element. When set, the panel scales from that element's
   * center; otherwise origin is the panel center.
   */
  originRef?: React.RefObject<HTMLElement | null>;
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
  originRef,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [transformOrigin, setTransformOrigin] = useState('50% 50%');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock while open; released as soon as close is requested
  // (even if the exit animation is still running or interrupted).
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Remember trigger focus on open; restore when close is requested.
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current =
        (document.activeElement instanceof HTMLElement ? document.activeElement : null) ??
        (originRef?.current ?? null);
      return;
    }
    const toRestore = previousFocusRef.current;
    previousFocusRef.current = null;
    if (toRestore && typeof toRestore.focus === 'function') {
      requestAnimationFrame(() => toRestore.focus({ preventScroll: true }));
    }
  }, [isOpen, originRef]);

  // Move initial focus into the dialog when it opens.
  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      const target = focusables[0] ?? panel;
      target.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  const updateOrigin = useCallback(() => {
    const panel = panelRef.current;
    const trigger = originRef?.current;
    if (!panel || !trigger) {
      setTransformOrigin('50% 50%');
      return;
    }
    const p = panel.getBoundingClientRect();
    const t = trigger.getBoundingClientRect();
    const ox = t.left + t.width / 2 - p.left;
    const oy = t.top + t.height / 2 - p.top;
    setTransformOrigin(`${ox}px ${oy}px`);
  }, [originRef]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updateOrigin();
  }, [isOpen, updateOrigin]);

  // Escape + focus trap — active while open (including mid enter animation).
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.tabIndex !== -1 && el.getClientRects().length > 0,
      );
      if (focusables.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !panel.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <m.div
          key="modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          data-modal-root
          variants={modalRootVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <m.div
            className="absolute inset-0 bg-steam-bg/80 backdrop-blur-sm"
            aria-hidden
            onClick={onClose}
            variants={modalScrimVariants}
            transition={fadeCross}
          />
          <m.div
            ref={panelRef}
            className={`relative z-10 bg-steam-card border border-steam-border rounded-2xl w-full ${maxWidthClass[maxWidth]} max-h-[90vh] overflow-hidden shadow-2xl flex flex-col outline-none`}
            style={{ transformOrigin }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            variants={modalPanelVariants}
            transition={springDefault}
          >
            <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-steam-border shrink-0">
              <div>
                <h3 id={titleId} className="text-xl font-bold text-steam-text">
                  {title}
                </h3>
                {description && (
                  <p id={descriptionId} className="text-sm text-steam-secondary mt-1">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="pressable p-2 rounded-lg text-steam-tertiary hover:text-steam-text hover:bg-steam-hover shrink-0"
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
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};
