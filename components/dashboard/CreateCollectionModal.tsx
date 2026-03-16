import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [collectionName, setCollectionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Czyszczenie inputa za każdym razem, gdy otwieramy/zamykamy modala
  useEffect(() => {
    if (isOpen) {
      setCollectionName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionName.trim() || !user) return;
    
    try {
      setIsCreating(true);
      const { data, error } = await supabase.rpc('create_collection', {
        p_user_id: user.id,
        p_name: collectionName.trim()
      });

      if (error) throw error;
      
      console.log('Collection created:', data);
      
      onSuccess(); // Informujemy Panel, że się udało (żeby odświeżył dane)
      onClose();   // Zamykamy modala
    } catch (error) {
      console.error('Error creating collection:', error);
      // Tutaj w przyszłości możesz dodać jakiegoś toasta z errorem
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Tło przyciemniające (Backdrop) */}
      <div 
        className="absolute inset-0 bg-[#0B0D12]/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Okienko Modala */}
      <div className="relative z-10 bg-[#161B24] border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in-up">
        <h3 className="text-xl font-bold text-white mb-2">New Collection</h3>
        <p className="text-sm text-gray-400 mb-6">Organize your inventory into custom vaults.</p>

        <form onSubmit={handleCreate}>
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Collection Name
            </label>
            <input 
              type="text" 
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="e.g. Sticker Investments"
              maxLength={30}
              className="w-full bg-[#0B0D12] border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-steam-accent transition-colors"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-700 text-gray-300 font-bold hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isCreating || !collectionName.trim()}
              className="flex-1 py-3 px-4 rounded-xl bg-steam-accent text-white font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center"
            >
              {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};