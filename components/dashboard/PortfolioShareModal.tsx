import React from 'react';
import { X } from 'lucide-react';
import { PortfolioSharePanel } from '@/components/dashboard/PortfolioSharePanel';
import { Modal } from '@/components/ui/Modal';

interface PortfolioShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortfolioShareModal: React.FC<PortfolioShareModalProps> = ({
  isOpen,
  onClose,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Share portfolio"
    maxWidth="5xl"
    zClassName="z-[999]"
    panelClassName="max-h-[min(92vh,900px)]"
    bodyClassName="overflow-y-auto flex-1 min-h-0 p-5 sm:p-6 pr-12 sm:pr-14 text-steam-text"
    header={
      <button
        type="button"
        onClick={onClose}
        className="pressable absolute top-3 right-3 z-20 p-2 rounded-lg text-steam-secondary hover:text-steam-text hover:bg-steam-hover"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    }
  >
    <PortfolioSharePanel embedded />
  </Modal>
);
