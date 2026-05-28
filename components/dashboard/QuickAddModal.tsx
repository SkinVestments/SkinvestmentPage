import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { X, Search, Loader2, Minus, Plus, Calendar, Folder, TrendingUp, Percent } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  
  // Stany formularza
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState<string>(''); // Unit price (String dla inputa)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [collectionId, setCollectionId] = useState<string>('');
  
  // Toggles
  const [isInvestment, setIsInvestment] = useState(true);
  const [applySteamFee, setApplySteamFee] = useState(true);
  
  // Dane z bazy
  const [collections, setCollections] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pobieranie kolekcji
  useEffect(() => {
    const fetchCollections = async () => {
      if (!user || !isOpen) return;
      const { data } = await supabase.rpc('get_collections', { p_user_id: user.id });
      if (data) {
        setCollections(data);
        if (data.length > 0) setCollectionId(data[0].id); // Domyślnie pierwsza kolekcja
      }
    };
    fetchCollections();
  }, [user, isOpen]);

  // Wyszukiwarka (Debounce)
  useEffect(() => {
    const searchItems = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      const { data, error } = await supabase
        .from('cs2_items')
        .select('id, market_hash_name, icon_url, price, rarity')
        .ilike('market_hash_name', `%${searchQuery}%`)
        .limit(5);
        
      if (!error && data) setSearchResults(data);
      setIsSearching(false);
    };

    const delayDebounceFn = setTimeout(() => {
      searchItems();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Reset modala przy otwarciu
  useEffect(() => {
    if (isOpen) {
      handleReset();
    }
  }, [isOpen]);

  const handleReset = () => {
    setType('BUY');
    setSearchQuery('');
    setSelectedItem(null);
    setQuantity(1);
    setPrice('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsInvestment(true);
    setApplySteamFee(true);
  };

  const handleSubmit = async () => {
    if (!user || !selectedItem) return;
    
    const unitPriceNum = parseFloat(price) || 0;
    
    // Obliczanie Steam Fee (tylko poglądowe dla zapisów fee_deducted)
    const fee = (type === 'SELL' && applySteamFee) ? (unitPriceNum * quantity * 0.13) : 0;

    const transaction = {
      item_id: selectedItem.id,
      quantity: quantity,
      price: unitPriceNum,
      type: type,
      is_investment: type === 'BUY' ? isInvestment : false,
      transaction_date: new Date(date).toISOString(),
      collection_id: collectionId || '',
      fee_deducted: fee,
      realized_profit: 0 // Placeholder - można dodać logikę w przyszłości
    };

    try {
      setIsSubmitting(true);
      const { error } = await supabase.rpc('add_transactions_bulk', {
        p_user_id: user.id,
        p_transactions: [transaction]
      });

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Transaction error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const totalValue = (parseFloat(price) || 0) * quantity;
  const isBuy = type === 'BUY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-steam-bg/90 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative z-10 bg-steam-card rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[800px] animate-fade-in-up border border-steam-border">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-steam-border/50">
          <button onClick={onClose} className="p-2 -ml-2 text-steam-secondary hover:text-steam-text transition-colors">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-steam-text">New Transaction</h2>
          <button onClick={handleReset} className="text-sm font-bold text-steam-tertiary hover:text-steam-secondary transition-colors">
            Reset
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          
          {/* Typ transakcji (Pills) */}
          <div className="flex bg-steam-bg p-1 rounded-xl mb-6 border border-steam-border">
            <button 
              onClick={() => setType('BUY')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${isBuy ? 'bg-green-500 text-white shadow-lg' : 'text-steam-tertiary hover:text-steam-secondary'}`}
            >
              BUY
            </button>
            <button 
              onClick={() => setType('SELL')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${!isBuy ? 'bg-red-500 text-white shadow-lg' : 'text-steam-tertiary hover:text-steam-secondary'}`}
            >
              SELL
            </button>
          </div>

          {/* Wybór przedmiotu */}
          <div className="mb-6 relative">
            <label className="block text-[10px] font-bold text-steam-tertiary uppercase tracking-widest mb-2">Item</label>
            {!selectedItem ? (
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-steam-tertiary" />
                <input 
                  type="text" 
                  placeholder="e.g. AK-47 | Redline"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-steam-card border border-steam-border text-steam-text rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-steam-accent transition-colors text-sm"
                />
                
                {/* Wyniki wyszukiwania */}
                {searchQuery.length >= 3 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-steam-card border border-steam-border rounded-xl shadow-2xl overflow-hidden z-20 max-h-60 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-steam-accent" /></div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map(item => (
                        <div 
                          key={item.id} 
                          onClick={() => { setSelectedItem(item); setPrice(item.price?.toString() || ''); setSearchQuery(''); }}
                          className="p-3 flex items-center gap-3 hover:bg-steam-hover cursor-pointer border-b border-steam-border/50 last:border-0"
                        >
                          <img src={item.icon_url} alt="" className="w-10 h-10 object-contain" />
                          <div>
                            <p className="text-sm font-bold text-steam-text truncate">{item.market_hash_name}</p>
                            <p className="text-xs text-steam-tertiary">${item.price}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-steam-tertiary">No items found</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-steam-card border border-steam-border rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={selectedItem.icon_url} alt="" className="w-10 h-10 object-contain" />
                  <div>
                    <p className="text-sm font-bold text-steam-text truncate max-w-[200px]">{selectedItem.market_hash_name}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedItem(null)} className="text-steam-tertiary hover:text-steam-text p-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Szczegóły: Ilość i Cena */}
          <label className="block text-[10px] font-bold text-steam-tertiary uppercase tracking-widest mb-2">Details</label>
          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-steam-card border border-steam-border rounded-xl flex items-center justify-between p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-steam-secondary hover:text-steam-text hover:bg-steam-hover rounded-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-steam-text text-lg font-mono">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 text-steam-secondary hover:text-steam-text hover:bg-steam-hover rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-[1.5] relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-steam-tertiary font-bold">$</span>
              <input 
                type="number" 
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-steam-card border border-steam-border text-steam-text rounded-xl py-3.5 pl-8 pr-4 focus:outline-none focus:border-steam-accent transition-colors font-mono text-lg font-bold text-right"
              />
            </div>
          </div>

          {/* Opcje dodatkowe */}
          <div className="space-y-3 bg-steam-card border border-steam-border rounded-xl p-2">
            
            {/* Data */}
            <div className="flex items-center justify-between p-3 border-b border-steam-border">
              <div className="flex items-center gap-3 text-steam-secondary">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Date</span>
              </div>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-steam-text text-sm font-bold focus:outline-none cursor-pointer"
              />
            </div>

            {/* Kolekcja */}
            <div className="flex items-center justify-between p-3 border-b border-steam-border">
              <div className="flex items-center gap-3 text-steam-secondary">
                <Folder className="w-4 h-4" />
                <span className="text-sm font-medium">Add to collection:</span>
              </div>
              <select 
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="bg-transparent text-steam-text text-sm font-bold focus:outline-none cursor-pointer max-w-[120px] truncate text-right outline-none"
              >
                {/* DODANO KLASY DO OPTION */}
                {collections.map(c => (
                  <option key={c.id} value={c.id} className="bg-steam-card text-steam-text">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Toggles (Dynamicznie od typu) */}
            <div className="flex items-center justify-between p-3">
              {isBuy ? (
                <>
                  <div className="flex items-center gap-3 text-steam-secondary">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Add to Investments</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isInvestment} onChange={() => setIsInvestment(!isInvestment)} />
                    <div className="w-11 h-6 bg-steam-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-steam-card after:border-steam-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-steam-accent"></div>
                  </label>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-steam-secondary">
                    <Percent className="w-4 h-4" />
                    <span className="text-sm font-medium">Steam Fee (13%)</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={applySteamFee} onChange={() => setApplySteamFee(!applySteamFee)} />
                    <div className="w-11 h-6 bg-steam-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-steam-card after:border-steam-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </>
              )}
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-steam-border/50 bg-steam-card">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-steam-tertiary font-bold">Total</span>
            <span className="text-2xl font-bold text-steam-text font-mono">
              ${totalValue.toFixed(2)}
            </span>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={!selectedItem || isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-steam-text transition-colors flex items-center justify-center gap-2
              ${isSubmitting || !selectedItem ? 'opacity-50 cursor-not-allowed bg-steam-elevated' : isBuy ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
            `}
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : isBuy ? 'Confirm Purchase' : 'Confirm Sale'}
          </button>
        </div>

      </div>
    </div>
  );
};