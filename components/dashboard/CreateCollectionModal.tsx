import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [collectionName, setCollectionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCollectionName('');
    }
  }, [isOpen]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionName.trim() || !user) return;

    try {
      setIsCreating(true);
      const { error } = await supabase.rpc('create_collection', {
        p_user_id: user.id,
        p_name: collectionName.trim(),
      });

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating collection:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Collection"
      description="Organize your inventory into custom vaults."
      maxWidth="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-steam-border text-steam-secondary font-bold hover:bg-steam-hover transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-collection-form"
            disabled={isCreating || !collectionName.trim()}
            className="flex-1 py-3 px-4 rounded-xl bg-steam-accent text-white font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center"
          >
            {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create'}
          </button>
        </>
      }
    >
      <form id="create-collection-form" onSubmit={handleCreate}>
        <label className="block text-xs font-bold text-steam-tertiary uppercase tracking-wider mb-2">
          Collection Name
        </label>
        <input
          type="text"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          placeholder="e.g. Sticker Investments"
          maxLength={30}
          className="theme-input w-full rounded-xl px-4 py-3 transition-colors"
          autoFocus
        />
      </form>
    </Modal>
  );
};
