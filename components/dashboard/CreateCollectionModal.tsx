import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useSubscriptionPlan } from '@/hooks/useSubscriptionPlan';
import {
  canCreateMoreCollections,
  getCollectionCountLimit,
} from '@/constants/subscriptionPlans';
import { MANAGE_SUBSCRIPTION_SETTINGS_PATH } from '@/constants/settingsLinks';
import { Loader2, Sparkles } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentCount: number;
}

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = String((err as { message?: string }).message);
    if (msg) return msg;
  }
  return fallback;
};

export const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentCount,
}) => {
  const { user } = useAuth();
  const { planId } = useSubscriptionPlan();
  const [collectionName, setCollectionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limit = getCollectionCountLimit(planId);
  const canCreate = canCreateMoreCollections(planId, currentCount);

  useEffect(() => {
    if (isOpen) {
      setCollectionName('');
      setError(null);
    }
  }, [isOpen]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionName.trim() || !user) return;

    if (!canCreate) {
      setError(
        limit == null
          ? 'You have reached the collection limit for your plan. Upgrade to create more vaults.'
          : `Your plan allows ${limit} collections. Upgrade under Settings → Account to create more.`,
      );
      return;
    }

    try {
      setIsCreating(true);
      setError(null);
      const { error: rpcError } = await supabase.rpc('create_collection', {
        p_user_id: user.id,
        p_name: collectionName.trim(),
      });

      if (rpcError) throw rpcError;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating collection:', err);
      setError(
        getErrorMessage(
          err,
          'Could not create this collection. Check the name and try again, or refresh if the limit looks wrong.',
        ),
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Collection"
      description={
        limit == null
          ? 'Organize your inventory into custom vaults.'
          : `Organize your inventory into custom vaults · ${currentCount} / ${limit} used`
      }
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
            disabled={isCreating || !collectionName.trim() || !canCreate}
            className="flex-1 py-3 px-4 rounded-xl bg-steam-accent text-white font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center"
          >
            {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create'}
          </button>
        </>
      }
    >
      {!canCreate && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <p className="text-sm text-amber-100">
            Collection limit reached for your plan ({limit}).
          </p>
          <Link
            to={MANAGE_SUBSCRIPTION_SETTINGS_PATH}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-200 hover:text-white shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" /> Upgrade
          </Link>
        </div>
      )}

      {error && (
        <p className="mb-3 text-sm text-amber-100 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

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
          disabled={!canCreate}
          className="theme-input w-full rounded-xl px-4 py-3 transition-colors disabled:opacity-50"
          autoFocus
        />
      </form>
    </Modal>
  );
};
