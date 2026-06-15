import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { X, Search, CheckCircle, Folder, TrendingUp, Loader2, Box, AlertCircle } from 'lucide-react';
import { ItemImage } from '@/components/ui/ItemImage';
import { CustomSelect } from '@/components/ui/CustomSelect';

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = String((err as { message?: string }).message);
    if (msg) return msg;
  }
  return fallback;
};

interface DropItem {
  id: string;
  name: string;
  price: number;
  icon: string;
}

interface SearchResultDB {
  id: string;
  name: string;
  photo: string;
  price: number;
  category: string;
  rarity: string;
}

interface LogDropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LogDropModal = ({ isOpen, onClose, onSuccess }: LogDropModalProps) => {
  const { user } = useAuth();

  const [casePool, setCasePool] = useState<DropItem[]>([]);
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DropItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedCase, setSelectedCase] = useState<DropItem | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<DropItem | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [addToInvestments, setAddToInvestments] = useState(true);

  const [loadingPool, setLoadingPool] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalValue = useMemo(
    () => (selectedCase?.price ?? 0) + (selectedWeapon?.price ?? 0),
    [selectedCase, selectedWeapon],
  );

  const canSubmit = Boolean(selectedCase && selectedWeapon && user);

  useEffect(() => {
    if (!isOpen) return;
    void fetchInitialData();
    setSearchQuery('');
    setSearchResults([]);
    setSelectedCase(null);
    setSelectedWeapon(null);
    setSubmitError(null);
  }, [isOpen]);

  const fetchInitialData = async () => {
    setLoadingPool(true);
    try {
      const { data: poolData } = await supabase
        .from('active_drop_pool')
        .select(`
          item_id,
          cs2_items ( id, market_hash_name, price, icon_url )
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (poolData) {
        setCasePool(
          poolData
            .map((row: {
              item_id?: string;
              cs2_items?: {
                id?: string;
                market_hash_name?: string;
                price?: number;
                icon_url?: string;
              } | null;
            }) => ({
              id: row.cs2_items?.id ?? row.item_id ?? '',
              name: row.cs2_items?.market_hash_name ?? 'Unknown',
              price: row.cs2_items?.price ?? 0,
              icon: row.cs2_items?.icon_url ?? '',
            }))
            .filter((item) => Boolean(item.id)),
        );
      }

      if (user) {
        const { data: colData } = await supabase
          .from('collections')
          .select('id, name')
          .eq('user_id', user.id);
        setCollections(colData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingPool(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase.rpc('search_cs2_items', {
          search_query: searchQuery,
        });

        if (error) throw error;

        if (data) {
          const dbResults = data as SearchResultDB[];
          setSearchResults(
            dbResults.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price || 0,
              icon: item.photo,
            })),
          );
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectCase = (item: DropItem) => {
    setSelectedCase(item);
    setSubmitError(null);
  };

  const handleSelectWeapon = (item: DropItem) => {
    setSelectedWeapon(item);
    setSearchResults([]);
    setSearchQuery(item.name);
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    if (!canSubmit || !selectedCase || !selectedWeapon || !user) return;

    setSubmitting(true);
    setSubmitError(null);

    const dropAt = new Date().toISOString();
    const baseTx = {
      quantity: 1,
      price: 0,
      type: 'DROP' as const,
      is_investment: addToInvestments,
      transaction_date: dropAt,
      collection_id: selectedCollectionId || '',
      fee_deducted: 0,
      realized_profit: 0,
    };

    try {
      const { data, error } = await supabase.rpc('add_transactions_bulk', {
        p_user_id: user.id,
        p_transactions: [
          { ...baseTx, item_id: selectedCase.id },
          { ...baseTx, item_id: selectedWeapon.id },
        ],
      });

      if (error) throw error;

      if (data && typeof data === 'object' && 'success' in data && data.success === false) {
        const msg =
          'message' in data && data.message
            ? String(data.message)
            : 'Drop was rejected by the server.';
        throw new Error(msg);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding drop:', error);
      setSubmitError(getErrorMessage(error, 'Failed to log drop. Try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-steam-bg/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-steam-bg w-full max-w-lg rounded-2xl border border-steam-border shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-steam-border flex justify-between items-center bg-steam-elevated">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-steam-accent border border-blue-500/20">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-steam-text leading-tight">Weekly Drop</h2>
              <p className="text-xs text-steam-secondary">Select your case and skin / graffiti</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-steam-secondary hover:text-steam-text transition-colors p-1 hover:bg-steam-hover rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {loadingPool ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-steam-accent" />
            </div>
          ) : (
            <>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-steam-text uppercase tracking-wider">
                    1. Case Drop
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded border ${
                      selectedCase
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {selectedCase ? 'SELECTED' : 'REQUIRED'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {casePool.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectCase(item)}
                      className={`
                        cursor-pointer rounded-xl p-3 border transition-all relative group overflow-hidden flex flex-col items-center text-center
                        ${
                          selectedCase?.id === item.id
                            ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                            : 'bg-steam-card border-steam-border hover:border-steam-border hover:bg-steam-hover'
                        }
                      `}
                    >
                      <div className="h-20 w-full flex items-center justify-center mb-3">
                        <ItemImage
                          src={item.icon}
                          alt={item.name}
                          className="max-h-full max-w-full drop-shadow-lg object-contain"
                          wrapperClassName="h-20 w-full"
                        />
                      </div>
                      <p className="text-xs font-bold text-steam-text line-clamp-2 h-8 leading-tight">
                        {item.name}
                      </p>
                      <p className="text-xs text-green-400 font-mono mt-2 font-bold">
                        ${item.price.toFixed(2)}
                      </p>

                      {selectedCase?.id === item.id && (
                        <div className="absolute top-2 right-2 text-blue-400 bg-blue-500/20 rounded-full p-0.5">
                          <CheckCircle className="w-4 h-4 fill-blue-500 text-steam-text" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-steam-secondary uppercase tracking-wider">
                    2. Weapon / Graffiti
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded border ${
                      selectedWeapon
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {selectedWeapon ? 'SELECTED' : 'REQUIRED'}
                  </span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (selectedWeapon && e.target.value !== selectedWeapon.name) {
                        setSelectedWeapon(null);
                      }
                    }}
                    placeholder="Search e.g. 'Fade', 'Graffiti'..."
                    className={`
                      w-full bg-steam-card border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-steam-accent transition-colors
                      ${selectedWeapon ? 'border-blue-500 text-blue-400 font-bold' : 'border-steam-border text-steam-text'}
                    `}
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-steam-accent" />
                  )}

                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-steam-elevated border border-steam-border rounded-xl shadow-2xl max-h-60 overflow-y-auto z-20 custom-scrollbar">
                      {searchResults.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectWeapon(item)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-steam-hover cursor-pointer transition-colors border-b border-steam-border last:border-0 text-left"
                        >
                          <ItemImage
                            src={item.icon}
                            alt={item.name}
                            className="w-10 h-8 object-contain"
                            wrapperClassName="w-10 h-8 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-steam-text truncate">{item.name}</p>
                            <p className="text-xs text-green-400 font-mono">${item.price.toFixed(2)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedWeapon && (
                    <div className="mt-3 flex items-center gap-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl animate-fade-in relative">
                      <ItemImage
                        src={selectedWeapon.icon}
                        alt={selectedWeapon.name}
                        className="w-16 h-12 object-contain drop-shadow-md"
                        wrapperClassName="w-16 h-12 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-steam-text truncate">{selectedWeapon.name}</p>
                        <p className="text-xs text-green-400 font-mono font-bold">
                          ${selectedWeapon.price.toFixed(2)}
                        </p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                    </div>
                  )}
                </div>
              </div>

              {(selectedCase || selectedWeapon) && (
                <div className="rounded-xl border border-steam-border/60 bg-steam-elevated/30 p-3 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-steam-tertiary">
                    This week&apos;s drop
                  </p>
                  <div className="flex flex-col gap-1.5 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-steam-secondary truncate">
                        {selectedCase ? `Case · ${selectedCase.name}` : 'Case · not selected'}
                      </span>
                      <span className="font-mono text-steam-tertiary shrink-0">
                        {selectedCase ? `+$${selectedCase.price.toFixed(2)}` : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-steam-secondary truncate">
                        {selectedWeapon
                          ? `Skin · ${selectedWeapon.name}`
                          : 'Weapon / graffiti · not selected'}
                      </span>
                      <span className="font-mono text-steam-tertiary shrink-0">
                        {selectedWeapon ? `+$${selectedWeapon.price.toFixed(2)}` : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-2 border-t border-steam-border">
                <div className="space-y-2 p-1">
                  <div className="flex items-center gap-3 text-steam-secondary">
                    <Folder className="w-5 h-5 text-steam-tertiary shrink-0" />
                    <span className="text-sm font-medium">Add to vault</span>
                  </div>
                  {collections.length > 0 ? (
                    <CustomSelect
                      value={selectedCollectionId}
                      onChange={setSelectedCollectionId}
                      options={collections.map((col) => ({ value: col.id, label: col.name }))}
                      placeholder="Choose vault…"
                      aria-label="Collection vault"
                      className="w-full"
                    />
                  ) : (
                    <p className="text-xs text-steam-tertiary">No collections</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setAddToInvestments(!addToInvestments)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-steam-hover cursor-pointer transition-colors -mx-2"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        addToInvestments
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-steam-elevated/60 text-steam-tertiary'
                      }`}
                    >
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p
                        className={`text-sm font-bold transition-colors ${
                          addToInvestments ? 'text-steam-text' : 'text-steam-secondary'
                        }`}
                      >
                        Track as Investment
                      </p>
                      <p className="text-xs text-steam-tertiary">Applies to both drops</p>
                    </div>
                  </div>

                  <div
                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 shrink-0 ${
                      addToInvestments ? 'bg-steam-accent' : 'bg-steam-elevated'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-steam-card border border-steam-border shadow-md transition-all duration-300 ${
                        addToInvestments ? 'left-7' : 'left-1'
                      }`}
                    />
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        <div className="p-5 border-t border-steam-border bg-steam-elevated">
          <div className="flex justify-between items-center mb-4">
            <span className="text-steam-secondary text-sm">Estimated Value</span>
            <span
              className={`text-lg font-bold font-mono transition-colors ${
                totalValue > 0 ? 'text-green-400' : 'text-steam-tertiary'
              }`}
            >
              +${totalValue.toFixed(2)}
            </span>
          </div>

          {!canSubmit && !submitting && (
            <p className="text-xs text-amber-400/90 mb-3 text-center">
              Pick a case and a weapon / graffiti to continue.
            </p>
          )}

          {submitError && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={handleSubmit}
            className="w-full bg-steam-accent hover:opacity-90 hover:theme-shadow-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-white font-bold py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 text-sm uppercase tracking-wide"
          >
            {submitting ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            Confirm Drop
          </button>
        </div>
      </div>
    </div>
  );
};
