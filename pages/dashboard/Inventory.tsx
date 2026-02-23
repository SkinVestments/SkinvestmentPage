import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, Filter, LayoutGrid, List as ListIcon, 
  Plus, Package, Loader2 
} from 'lucide-react';

// --- TYPY ---
interface InventoryItem {
  id: string;
  quantity: number;
  acquired_at: string;
  cs2_items: {
    market_hash_name: string;
    icon_url: string | null;
    price: number;
    rarity: string | null;
    type: string | null;
  };
}

// Funkcja stylizująca rzadkość
const getRarityStyle = (rarity: string | null | undefined) => {
  if (!rarity) return { border: 'border-gray-600', text: 'text-gray-400', hex: '#9ca3af' };
  const r = rarity.toLowerCase();
  if (r.includes('contraband')) return { border: 'border-yellow-500', text: 'text-yellow-500', hex: '#eab308' };
  if (r.includes('covert')) return { border: 'border-red-500', text: 'text-red-500', hex: '#ef4444' };
  if (r.includes('classified')) return { border: 'border-pink-500', text: 'text-pink-500', hex: '#ec4899' };
  if (r.includes('restricted')) return { border: 'border-purple-500', text: 'text-purple-500', hex: '#a855f7' };
  if (r.includes('mil-spec')) return { border: 'border-blue-600', text: 'text-blue-500', hex: '#3b82f6' };
  if (r.includes('industrial')) return { border: 'border-sky-400', text: 'text-sky-400', hex: '#38bdf8' };
  if (r.includes('consumer')) return { border: 'border-gray-400', text: 'text-gray-400', hex: '#9ca3af' };
  return { border: 'border-gray-600', text: 'text-gray-400', hex: '#9ca3af' };
};

// --- HELPER: PROFESJONALNY GENERATOR WYKRESU (SMOOTH SPARKLINE) ---
const generateSparklinePath = (seedId: string) => {
  // 1. Generowanie realistycznego trendu (Random Walk)
  let hash = 0;
  for (let i = 0; i < seedId.length; i++) hash = seedId.charCodeAt(i) + ((hash << 5) - hash);
  
  const points: [number, number][] = [];
  let currentValue = 50 + ((hash % 20) - 10); // Start w okolicach środka
  const trend = (hash % 7) - 3; // Ogólny trend rosnący lub malejący
  
  const numPoints = 20; // 20 punktów daje bardzo ładne wygładzenie
  for (let i = 0; i < numPoints; i++) {
    // "Szum" giełdowy + trend
    const noise = (((hash * (i + 1)) % 15) - 7.5); 
    currentValue += noise + trend;
    currentValue = Math.max(15, Math.min(85, currentValue)); // Trzymamy z dala od samych krawędzi
    
    const x = (i / (numPoints - 1)) * 100;
    const y = 100 - currentValue;
    points.push([x, y]);
  }
  
  // 2. Wygładzanie krzywych (Cubic Bezier Curves)
  let linePath = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const midX = (curr[0] + next[0]) / 2;
    // Tworzy płynne przejście między punktami (jak w Recharts 'monotone')
    linePath += ` C ${midX},${curr[1]} ${midX},${next[1]} ${next[0]},${next[1]}`;
  }
  
  const areaPath = `${linePath} L 100,100 L 0,100 Z`;
  
  return { linePath, areaPath };
};

const Inventory = () => {
  const { user } = useAuth();
  
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'value_desc' | 'value_asc' | 'name' | 'recent'>('value_desc');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const { data, error } = await supabase
        .from('portfolio_items')
        .select(`
          id, quantity, acquired_at,
          cs2_items ( market_hash_name, icon_url, price, rarity, type )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      if (data) setItems(data as any);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [user]);

  const filteredAndSortedItems = items
    .filter(item => 
      item.cs2_items?.market_hash_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const valA = (a.cs2_items?.price || 0) * a.quantity;
      const valB = (b.cs2_items?.price || 0) * b.quantity;
      
      switch (sortBy) {
        case 'value_desc': return valB - valA;
        case 'value_asc': return valA - valB;
        case 'name': return (a.cs2_items?.market_hash_name || '').localeCompare(b.cs2_items?.market_hash_name || '');
        case 'recent': return new Date(b.acquired_at).getTime() - new Date(a.acquired_at).getTime();
        default: return 0;
      }
    });

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalValue = items.reduce((acc, item) => acc + ((item.cs2_items?.price || 0) * item.quantity), 0);
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="text-white animate-fade-in pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-1">Inventory</h1>
          <p className="text-gray-400">Manage and browse your CS2 collection.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-[#1e232b] p-3 rounded-xl border border-gray-800 shadow-lg">
           <div className="px-4 border-r border-gray-700">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Total Items</p>
              <p className="text-xl font-bold text-white">{totalItems}</p>
           </div>
           <div className="px-4">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Total Value</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(totalValue)}</p>
           </div>
           <button className="bg-steam-accent hover:bg-blue-600 text-white p-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all ml-2">
              <Plus className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search your inventory..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e232b] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-steam-accent transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#1e232b] border border-gray-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-steam-accent cursor-pointer"
          >
            <option value="value_desc">Highest Value</option>
            <option value="value_asc">Lowest Value</option>
            <option value="name">Name (A-Z)</option>
            <option value="recent">Recently Added</option>
          </select>

          <button className="bg-[#1e232b] border border-gray-800 p-2.5 rounded-xl text-gray-400 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
          </button>

          <div className="flex bg-[#1e232b] p-1 rounded-xl border border-gray-800">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KONTENT EKWIPUNKU */}
      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-steam-accent" /></div>
      ) : filteredAndSortedItems.length === 0 ? (
        <div className="bg-[#1e232b] rounded-2xl border border-gray-800 p-20 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
            <p className="text-gray-500 text-sm">Your inventory is empty or no items match your search.</p>
        </div>
      ) : (
        <>
          {/* WIDOK SIATKI (GRID) - Z WYKRESEM W TLE */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAndSortedItems.map((item) => {
                const rarityStyle = getRarityStyle(item.cs2_items?.rarity);
                const itemPrice = item.cs2_items?.price || 0;
                const totalVal = itemPrice * item.quantity;
                
                // Generowanie danych wykresu dla tła
                const { linePath, areaPath } = generateSparklinePath(item.id);

                return (
                  <div key={item.id} className="bg-[#1e232b] rounded-xl border border-gray-800 hover:border-gray-600 transition-colors group relative overflow-hidden flex flex-col shadow-lg">
                    
                    {/* Badge Ilości */}
                    {item.quantity > 1 && (
                      <div className="absolute top-2 right-2 bg-[#0B0D12]/90 border border-gray-700 text-white text-[10px] font-bold px-2 py-1 rounded-md z-20">
                        x{item.quantity}
                      </div>
                    )}

                    {/* SEKCJA Z OBRAZKIEM I WYKRESEM */}
                    <div className={`relative h-36 w-full flex items-center justify-center p-4 border-b-[3px] ${rarityStyle.border} bg-[#0B0D12] overflow-hidden`}>
                      
                      {/* Profesjonalny Wykres w tle */}
                      <div className="absolute inset-0 z-0 opacity-50 transition-opacity duration-500 group-hover:opacity-100">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                          <defs>
                            <linearGradient id={`grad-${item.id}`} x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor={rarityStyle.hex} stopOpacity="0.35" />
                              <stop offset="100%" stopColor={rarityStyle.hex} stopOpacity="0.0" />
                            </linearGradient>
                            
                            {/* Efekt delikatnego świecenia linii */}
                            <filter id={`glow-${item.id}`} x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="1.5" result="blur" />
                              <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                          </defs>

                          {/* Subtelna Siatka (Grid) przypominająca analitykę */}
                          <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                          <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

                          {/* Wykres - Wypełnienie i Linia */}
                          <path d={areaPath} fill={`url(#grad-${item.id})`} />
                          <path 
                            d={linePath} 
                            fill="none" 
                            stroke={rarityStyle.hex} 
                            strokeWidth="1.2" 
                            strokeLinecap="round" 
                            filter={`url(#glow-${item.id})`} 
                          />
                        </svg>
                      </div>

                      {/* Obrazek Skina */}
                      <img 
                        src={item.cs2_items?.icon_url || ''} 
                        alt={item.cs2_items?.market_hash_name} 
                        className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-500 group-hover:-translate-y-1"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-3 flex flex-col flex-1 bg-[#1e232b] relative z-20">
                      <p className="text-xs font-bold text-gray-200 line-clamp-2 leading-snug mb-3 flex-1">
                        {item.cs2_items?.market_hash_name}
                      </p>
                      
                      <div className="flex justify-between items-end mt-auto">
                        <div>
                           <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Total Value</p>
                           <p className="text-sm font-bold text-white font-mono">{formatCurrency(totalVal)}</p>
                        </div>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-gray-400 font-mono">({formatCurrency(itemPrice)} ea)</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* WIDOK TABELI (LIST) - BEZ ZMIAN */}
          {viewMode === 'list' && (
            <div className="bg-[#1e232b] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#171a21] text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-800">
                      <th className="p-4 pl-6">Item Details</th>
                      <th className="p-4">Quantity</th>
                      <th className="p-4 text-right">Unit Price</th>
                      <th className="p-4 text-right pr-6">Total Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50 text-sm">
                    {filteredAndSortedItems.map((item) => {
                      const rarityStyle = getRarityStyle(item.cs2_items?.rarity);
                      return (
                        <tr key={item.id} className="hover:bg-[#252b36] transition-colors group">
                          <td className="p-3 pl-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-14 h-10 rounded flex items-center justify-center border-b-2 ${rarityStyle.border} bg-[#141619]`}>
                                <img src={item.cs2_items?.icon_url || ''} alt="" className="max-w-full max-h-full object-contain" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-200">{item.cs2_items?.market_hash_name}</div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider ${rarityStyle.text}`}>
                                  {item.cs2_items?.rarity || 'Common'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="bg-gray-800 px-2 py-1 rounded text-xs font-bold text-gray-300">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="p-4 text-right text-gray-400 font-mono">
                            {formatCurrency(item.cs2_items?.price || 0)}
                          </td>
                          <td className="p-4 text-right pr-6 font-bold text-white font-mono">
                            {formatCurrency((item.cs2_items?.price || 0) * item.quantity)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Inventory;