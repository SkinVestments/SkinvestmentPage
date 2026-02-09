import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { X, Search, CheckCircle, Folder, TrendingUp, Loader2, Box, Package } from 'lucide-react';

// --- TYPY DANYCH ---

// Typ wewnętrzny komponentu (ujednolicony)
interface DropItem {
  id: string;
  name: string;
  price: number;
  icon: string;
}

// Typ zwracany przez Twoją funkcję SQL (search_cs2_items)
interface SearchResultDB {
  id: string;
  name: string;
  photo: string;    // W SQL nazwałeś to 'photo'
  price: number;
  category: string; // W SQL nazwałeś to 'category'
  rarity: string;
}

interface LogDropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LogDropModal = ({ isOpen, onClose, onSuccess }: LogDropModalProps) => {
  const { user } = useAuth();
  
  // --- STANY DANYCH ---
  const [casePool, setCasePool] = useState<DropItem[]>([]);
  const [collections, setCollections] = useState<{id: string, name: string}[]>([]);
  
  // --- STANY WYSZUKIWARKI ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DropItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSearchItem, setSelectedSearchItem] = useState<DropItem | null>(null);

  // --- STANY WYBORU ---
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [addToInvestments, setAddToInvestments] = useState(true);
  
  const [loadingPool, setLoadingPool] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reset przy otwarciu
  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
      setSearchQuery('');
      setSearchResults([]);
      setSelectedSearchItem(null);
      setSelectedItemId(null);
      setSelectedPrice(0);
    }
  }, [isOpen]);

  // --- 1. POBIERANIE DANYCH POCZĄTKOWYCH ---
  const fetchInitialData = async () => {
    setLoadingPool(true);
    try {
      // Active Pool (Skrzynki)
      const { data: poolData } = await supabase
        .from('active_drop_pool')
        .select(`
          item_id,
          cs2_items ( id, market_hash_name, price, icon_url )
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (poolData) {
        setCasePool(poolData.map((row: any) => ({
          id: row.cs2_items?.id,
          name: row.cs2_items?.market_hash_name,
          price: row.cs2_items?.price || 0,
          icon: row.cs2_items?.icon_url
        })));
      }

      // Kolekcje
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

  // --- 2. LOGIKA WYSZUKIWARKI (POPRAWIONA) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // === TU JEST KLUCZOWA ZMIANA ===
        // Używamy nazwy parametru 'search_query', tak jak w Twoim SQL
        const { data, error } = await supabase
          .rpc('search_cs2_items', { search_query: searchQuery }); 

        if (error) throw error;

        // Mapowanie wyników z Twojej funkcji SQL na format komponentu
        if (data) {
          // Rzutujemy na SearchResultDB, żeby TypeScript wiedział o polach 'photo' i 'name'
          const dbResults = data as SearchResultDB[];
          
          setSearchResults(dbResults.map((item) => ({
            id: item.id,
            name: item.name,        // Z SQL: i.name
            price: item.price || 0, // Z SQL: i.price
            icon: item.photo        // Z SQL: i.icon_url as photo
          })));
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);


  // --- HANDLERS ---

  const handleSelectCase = (item: DropItem) => {
    setSelectedItemId(item.id);
    setSelectedPrice(item.price);
    setSelectedSearchItem(null); 
    setSearchQuery('');
  };

  const handleSelectSearchedItem = (item: DropItem) => {
    setSelectedSearchItem(item);
    setSelectedItemId(item.id);
    setSelectedPrice(item.price);
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    if (!selectedItemId || !user) return;
    setSubmitting(true);

    try {
      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        item_id: selectedItemId,
        type: 'DROP',
        quantity: 1,
        price: 0,
        is_investment: addToInvestments,
        collection_id: selectedCollectionId || null,
        created_at: new Date().toISOString(),
        transaction_date: new Date().toISOString()
      });

      if (error) throw error;
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding drop:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#14171D] w-full max-w-lg rounded-2xl border border-gray-800 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#1b2028]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-steam-accent border border-blue-500/20">
               <Box className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">Weekly Drop</h2>
              <p className="text-xs text-gray-400">Log your rewards</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {loadingPool ? (
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-steam-accent"/></div>
          ) : (
            <>
              {/* === SECTION 1: CASE DROP === */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Case Drop</h3>
                  <span className="text-[10px] font-bold bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                    ACTIVE POOL
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {casePool.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleSelectCase(item)}
                      className={`
                        cursor-pointer rounded-xl p-3 border transition-all relative group overflow-hidden flex flex-col items-center text-center
                        ${selectedItemId === item.id 
                          ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                          : 'bg-[#1e232b] border-gray-700 hover:border-gray-500 hover:bg-[#252b36]'}
                      `}
                    >
                      <div className="h-20 w-full flex items-center justify-center mb-3">
                        <img src={item.icon} alt={item.name} className="max-h-full max-w-full drop-shadow-lg object-contain" />
                      </div>
                      <p className="text-xs font-bold text-gray-200 line-clamp-2 h-8 leading-tight">{item.name}</p>
                      <p className="text-xs text-green-400 font-mono mt-2 font-bold">${item.price.toFixed(2)}</p>
                      
                      {selectedItemId === item.id && (
                        <div className="absolute top-2 right-2 text-blue-400 bg-blue-500/20 rounded-full p-0.5">
                          <CheckCircle className="w-4 h-4 fill-blue-500 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* === SECTION 2: WEAPON DROP (SEARCH) === */}
              <div>
                <div className="flex justify-between items-center mb-3">
                   <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Weapon / Graffiti</h3>
                   <span className="text-[10px] font-bold bg-gray-700 text-gray-400 px-2 py-1 rounded">SEARCH</span>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={selectedSearchItem ? selectedSearchItem.name : "Search e.g. 'Fade', 'Graffiti'..."}
                    className={`
                      w-full bg-[#1e232b] border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors
                      ${selectedSearchItem ? 'border-blue-500 text-blue-400 font-bold' : 'border-gray-700 text-gray-200'}
                    `}
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-steam-accent" />
                  )}

                  {/* Wyniki Wyszukiwania */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1b2028] border border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-20 custom-scrollbar">
                      {searchResults.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => handleSelectSearchedItem(item)}
                          className="flex items-center gap-3 p-3 hover:bg-[#252b36] cursor-pointer transition-colors border-b border-gray-800 last:border-0"
                        >
                          <img src={item.icon} alt="" className="w-10 h-8 object-contain" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-200 truncate">{item.name}</p>
                            <p className="text-xs text-green-400 font-mono">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Wybrany przedmiot z wyszukiwarki */}
                  {selectedSearchItem && (
                    <div className="mt-3 flex items-center gap-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl animate-fade-in relative">
                       <img src={selectedSearchItem.icon} alt="" className="w-16 h-12 object-contain drop-shadow-md" />
                       <div>
                          <p className="text-sm font-bold text-white">{selectedSearchItem.name}</p>
                          <p className="text-xs text-green-400 font-mono font-bold">${selectedSearchItem.price.toFixed(2)}</p>
                       </div>
                       <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                       </div>
                    </div>
                  )}
                </div>
              </div>

              {/* === SECTION 3: SETTINGS === */}
              <div className="space-y-3 pt-2 border-t border-gray-800">
                
                {/* Collection Select */}
                <div className="flex items-center justify-between p-1">
                   <div className="flex items-center gap-3 text-gray-300">
                      <Folder className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium">Add to collection:</span>
                   </div>
                   <select 
                      value={selectedCollectionId}
                      onChange={(e) => setSelectedCollectionId(e.target.value)}
                      className="bg-[#1e232b] border border-gray-700 hover:border-gray-500 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                   >
                      <option value="">Unassigned</option>
                      {collections.map(col => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                      ))}
                   </select>
                </div>

                {/* Investment Toggle */}
                <div 
                  onClick={() => setAddToInvestments(!addToInvestments)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors -mx-2"
                >
                   <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg transition-colors ${addToInvestments ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700/30 text-gray-500'}`}>
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold transition-colors ${addToInvestments ? 'text-white' : 'text-gray-400'}`}>Track as Investment</p>
                        <p className="text-xs text-gray-500">Enable profit/loss tracking</p>
                      </div>
                   </div>
                   
                   <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${addToInvestments ? 'bg-steam-accent' : 'bg-gray-700'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${addToInvestments ? 'left-7' : 'left-1'}`} />
                   </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-800 bg-[#1b2028]">
           <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 text-sm">Estimated Value</span>
              <span className={`text-lg font-bold font-mono transition-colors ${selectedPrice > 0 ? 'text-green-400' : 'text-gray-600'}`}>
                +${selectedPrice.toFixed(2)}
              </span>
           </div>
           
           <button 
             disabled={!selectedItemId || submitting}
             onClick={handleSubmit}
             className="w-full bg-steam-accent hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-white font-bold py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 text-sm uppercase tracking-wide"
           >
             {submitting ? <Loader2 className="animate-spin w-5 h-5"/> : <CheckCircle className="w-5 h-5" />}
             Confirm Drop
           </button>
        </div>
      </div>
    </div>
  );
};