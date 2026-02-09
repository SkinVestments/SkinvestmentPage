import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { 
  ChevronLeft, ChevronRight, ArrowUpDown, Loader2, 
  TrendingUp, Package, Plus, CheckCircle, Wallet 
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

// --- TYPY DANYCH ---
interface CS2Item {
  id: string;
  market_hash_name: string;
  icon_url: string | null;
  price: number;
  rarity: string | null;
}

interface PortfolioItem {
  id: string;
  quantity: number;
  buy_price: number;
  acquired_at: string;
  cs2_items: CS2Item;
}

// Dane do wykresu (Mockup - w przyszłości można pobierać z bazy historii)
const mockChartData = [
  { name: 'Mon', value: 310 },
  { name: 'Tue', value: 325 },
  { name: 'Wed', value: 318 },
  { name: 'Thu', value: 330 },
  { name: 'Fri', value: 335 },
  { name: 'Sat', value: 338 },
  { name: 'Sun', value: 342 },
];

const ITEMS_PER_PAGE = 5; // Mniej wierszy na stronę, bo mamy dashboard

// Funkcja stylizująca kolory Rarity
const getRarityStyle = (rarity: string | null | undefined) => {
  if (!rarity) return { border: 'border-gray-600', text: 'text-gray-400', shadow: '' };
  
  const r = rarity.toLowerCase();
  
  if (r.includes('contraband')) return { border: 'border-yellow-500', text: 'text-yellow-500', shadow: 'shadow-yellow-500/20' };
  if (r.includes('covert')) return { border: 'border-red-500', text: 'text-red-500', shadow: 'shadow-red-500/20' };
  if (r.includes('classified')) return { border: 'border-pink-500', text: 'text-pink-500', shadow: 'shadow-pink-500/20' };
  if (r.includes('restricted')) return { border: 'border-purple-500', text: 'text-purple-500', shadow: 'shadow-purple-500/20' };
  if (r.includes('mil-spec')) return { border: 'border-blue-600', text: 'text-blue-500', shadow: 'shadow-blue-500/20' };
  if (r.includes('industrial')) return { border: 'border-sky-400', text: 'text-sky-400', shadow: 'shadow-sky-400/20' };
  if (r.includes('consumer')) return { border: 'border-gray-400', text: 'text-gray-400', shadow: 'shadow-gray-400/20' };

  return { border: 'border-gray-600', text: 'text-gray-400', shadow: '' };
};

const Panel = () => {
  const { user } = useAuth();
  
  // Stan danych
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [investmentsValue, setInvestmentsValue] = useState(0);
  
  // Paginacja i sortowanie tabeli
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState<string>('acquired_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Funkcja pobierająca dane
  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      if (!user) return;

      // 1. Pobierz statystyki ogólne (wszystkie itemy dla usera, żeby policzyć sumę wartości)
      const { data: allItems } = await supabase
        .from('portfolio_items')
        .select('quantity, cs2_items(price)')
        .eq('user_id', user.id);

      if (allItems) {
        const total = allItems.reduce((acc, item: any) => {
          return acc + (item.quantity * (item.cs2_items?.price || 0));
        }, 0);
        setTotalValue(total);
        setInvestmentsValue(total); // Tutaj możesz później rozdzielić na "Investments" i "Playskins"
      }

      // 2. Pobierz dane do tabeli "Recent Inventory" (z paginacją i sortowaniem)
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('portfolio_items')
        .select(`
          *,
          cs2_items (
            id,
            market_hash_name,
            icon_url,
            price,
            rarity
          )
        `, { count: 'exact' })
        .eq('user_id', user.id)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);

      if (error) throw error;

      if (data) setItems(data as any);
      if (count) setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [user, page, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="text-white animate-fade-in pb-10">
      
      {/* === HEADER DASHBOARDU === */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-1">Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, <span className="text-white font-medium">{user?.email}</span>
          </p>
        </div>
        
        <button className="bg-steam-accent hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Quick Add
        </button>
      </div>

      {/* === GRID GŁÓWNY === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* KOLUMNA 1 i 2: WYKRES + STATYSTYKI */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* KARTA GŁÓWNA - WARTOŚĆ PORTFOLIO */}
          <div className="bg-[#1e232b] rounded-2xl p-6 border border-gray-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="w-40 h-40 text-steam-accent" />
            </div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total Portfolio Value</h2>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold text-white tracking-tight">{formatCurrency(totalValue)}</span>
                  <span className="text-red-400 bg-red-500/10 px-2 py-1 rounded-md text-sm font-bold border border-red-500/20 flex items-center gap-1">
                    ▼ 50.8%
                  </span>
                </div>
              </div>
              
              {/* Przełącznik czasu (wizualny) */}
              <div className="flex bg-[#14171D] rounded-lg p-1 border border-white/5">
                {['24H', '7D', '1M', 'All'].map((t) => (
                  <button key={t} className={`px-3 py-1 text-xs font-bold rounded ${t === 'All' ? 'bg-steam-accent text-white' : 'text-gray-400 hover:text-white'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* WYKRES (Recharts) */}
            <div className="h-[220px] mt-6 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#171a21', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ color: '#60a5fa' }}
                    cursor={{ stroke: '#374151', strokeWidth: 1 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SIATKA MNIEJSZYCH STATYSTYK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1e232b] rounded-2xl p-6 border border-gray-800 flex items-center gap-5 hover:border-steam-accent/30 transition-colors">
              <div className="p-4 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Investments</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(investmentsValue)}</p>
              </div>
            </div>
            
            <div className="bg-[#1e232b] rounded-2xl p-6 border border-gray-800 flex items-center gap-5 hover:border-steam-accent/30 transition-colors">
              <div className="p-4 bg-gray-700/30 rounded-xl text-gray-400 border border-white/5">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Inventory</p>
                <p className="text-2xl font-bold text-white">$0.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* KOLUMNA 3: DROPY I KOLEKCJE */}
        <div className="space-y-6">
          
          {/* WEEKLY DROP - Wersja Estetyczna */}
          <div className="bg-[#1e232b] rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
            
            {/* Subtelna poświata w tle */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent opacity-50"></div>

            <div className="relative z-10 p-6 md:p-8">
              <div className="flex items-center gap-2 text-steam-accent mb-3">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                  <Package className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs uppercase tracking-widest">Weekly Drop</span>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Resets in 1 day</h3>
              <p className="text-gray-400 text-sm mb-8 max-w-[60%] leading-relaxed">
                Make sure to earn enough XP to claim your weekly rewards pool.
              </p>
              
              {/* Przycisk - teraz niebieski i bardziej wyrazisty */}
              <button className="bg-steam-accent hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 border border-blue-400/20">
                <CheckCircle className="w-5 h-5" /> 
                <span>Log Drop Information</span>
              </button>
            </div>
            
            {/* Prawdziwy obrazek skrzynki z folderu public */}
            {/* Upewnij się, że plik case.png jest w folderze public! */}
            <img 
              src="images\case.webp" 
              className="absolute -right-12 -bottom-8 w-64 md:w-72 opacity-90 rotate-[3deg] drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:scale-105 group-hover:rotate-[0deg] group-hover:-translate-y-2"              
              alt="CS2 Case Reward" 
            />
          </div>

          {/* KOLEKCJE */}
          <div>
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="font-bold text-lg text-white">Collections</h3>
              <button className="text-steam-accent text-xs font-bold flex items-center gap-1 hover:text-white transition-colors uppercase tracking-wider">
                <Plus className="w-3 h-3" /> New
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Karta kolekcji 1 */}
              <div className="bg-[#1e232b] p-5 rounded-xl border border-gray-800 hover:border-steam-accent/50 transition-all cursor-pointer group relative overflow-hidden">
                 <div className="absolute right-0 top-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <Wallet className="w-32 h-32" />
                 </div>
                 <div className="flex items-center gap-2 mb-3 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <Package className="w-3 h-3" /> 6 Items
                 </div>
                 <h4 className="font-bold text-xl mb-1 text-white group-hover:text-steam-accent transition-colors">Unassigned Items</h4>
                 <p className="text-gray-400 font-mono text-sm">{formatCurrency(totalValue * 0.4)}</p>
              </div>

              {/* Karta kolekcji 2 */}
              <div className="bg-[#1e232b] p-5 rounded-xl border border-gray-800 hover:border-steam-accent/50 transition-all cursor-pointer group relative overflow-hidden">
                 <div className="absolute right-0 top-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <Wallet className="w-32 h-32" />
                 </div>
                 <div className="flex items-center gap-2 mb-3 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <Package className="w-3 h-3" /> 2 Items
                 </div>
                 <h4 className="font-bold text-xl mb-1 text-white group-hover:text-steam-accent transition-colors">Main Vault</h4>
                 <p className="text-gray-400 font-mono text-sm">{formatCurrency(totalValue * 0.6)}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* === TABELA (OSTATNIE PRZEDMIOTY) === */}
      <div className="bg-[#1e232b] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#1b2028]">
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300">Recent Inventory</h3>
          <span className="text-xs text-gray-500 font-medium bg-gray-800 px-2 py-1 rounded">Last added items</span>
        </div>

        {loading ? (
          <div className="p-20 flex justify-center text-steam-accent">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <p className="text-lg mb-2">No items found.</p>
            <p className="text-sm">Add items to see them here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#171a21] text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-800">
                  <th className="p-5 pl-6">Item</th>
                  <th 
                    className="p-5 cursor-pointer hover:text-steam-accent transition-colors"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center gap-1">
                      Qty
                      {sortBy === 'quantity' && <ArrowUpDown className="w-3 h-3" />}
                    </div>
                  </th>
                  <th className="p-5">Price</th>
                  <th className="p-5">Value</th>
                  <th className="p-5 text-right pr-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 text-sm">
                {items.map((item) => {
                   const currentPrice = item.cs2_items?.price || 0;
                   const rarityStyle = getRarityStyle(item.cs2_items?.rarity);
                   return (
                    <tr key={item.id} className="hover:bg-[#252b36] transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className={`
                            relative w-16 h-12 bg-gradient-to-b from-[#1a1d24] to-[#141619] 
                            rounded-md flex items-center justify-center p-1 
                            border-b-[3px] ${rarityStyle.border} ${rarityStyle.shadow}
                            transition-all duration-300 group-hover:scale-105
                          `}>
                            <img 
                              src={item.cs2_items?.icon_url || ''} 
                              alt="" 
                              className="w-full h-full object-contain drop-shadow-md" 
                            />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-bold text-gray-200 group-hover:text-white truncate max-w-[150px]">{item.cs2_items?.market_hash_name}</span>
                             <span className={`text-[10px] uppercase font-bold tracking-wider ${rarityStyle.text}`}>{item.cs2_items?.rarity || 'Common'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-400">{item.quantity}</td>
                      <td className="p-4 text-gray-400 font-mono">{formatCurrency(currentPrice)}</td>
                      <td className="p-4 font-bold text-white font-mono">{formatCurrency(currentPrice * item.quantity)}</td>
                      <td className="p-4 text-right pr-6 text-gray-500 text-xs">{new Date(item.acquired_at).toLocaleDateString()}</td>
                    </tr>
                   )
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Paginacja */}
        <div className="bg-[#1b2028] px-6 py-4 border-t border-gray-800 flex justify-between items-center">
           <button 
             disabled={page===1} 
             onClick={()=>setPage(p=>p-1)} 
             className="text-gray-400 hover:text-white disabled:opacity-30 flex items-center gap-1 text-sm font-bold transition-colors"
           >
             <ChevronLeft className="w-4 h-4"/> Previous
           </button>
           
           <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
             Page <span className="text-white text-sm">{page}</span> of {totalPages || 1}
           </span>
           
           <button 
             disabled={page>=totalPages} 
             onClick={()=>setPage(p=>p+1)} 
             className="text-gray-400 hover:text-white disabled:opacity-30 flex items-center gap-1 text-sm font-bold transition-colors"
           >
             Next <ChevronRight className="w-4 h-4"/>
           </button>
        </div>
      </div>

    </div>
  );
};

export default Panel;