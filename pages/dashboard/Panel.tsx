import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { 
  ChevronLeft, ChevronRight, ArrowUpDown, Loader2, 
  TrendingUp, TrendingDown, Package, Plus, CheckCircle, Wallet, ArrowRight 
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useWeeklyReset } from '@/utils/utils';
import { LogDropModal } from '../../components/dashboard/LogDropModal';
import { CreateCollectionModal } from '../../components/dashboard/CreateCollectionModal';
import { QuickAddModal } from '@/components/dashboard/QuickAddModal';

import { useNavigate } from 'react-router-dom';

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

// Typ dopasowany do odpowiedzi z get_portfolio_current_values
interface PortfolioCurrentValues {
  deposited: number;
  withdrawn: number;
  inventory_value: number;
  investments_value: number;
  period_gain_value: number;
  period_roi_percentage: number;
  total_portfolio_value: number;
}

const ITEMS_PER_PAGE = 5;

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
  const navigate = useNavigate();

  // --- STANY TABELI PORTFOLIO ---
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- STANY WARTOŚCI GŁÓWNYCH (Nowe, z endpointu get_portfolio_current_values) ---
  const [portfolioStats, setPortfolioStats] = useState<PortfolioCurrentValues | null>(null);

  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  
  // --- STANY DLA KOLEKCJI ---
  const [collections, setCollections] = useState<any[]>([]);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  // Paginacja i sortowanie tabeli
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState<string>('acquired_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // --- STANY DLA WYKRESU ---
  const [chartData, setChartData] = useState<any[]>([]);
  const [availablePeriods, setAvailablePeriods] = useState<string[]>(['7D', '1M', 'ALL']); 
  const [chartLoading, setChartLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>('1M'); 

  const resetTime = useWeeklyReset();

  const fetchCollections = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.rpc('get_collections', {
        p_user_id: user.id
      });

      if (error) throw error;
      if (data) setCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchChartData = async () => {
    if (!user) return;
    try {
      setChartLoading(true);
      const { data: response, error } = await supabase.rpc('get_user_performance_chart', {
        target_user_id: user.id,   
        period_text: timeRange     
      });

      if (error) throw error;

      if (response && response.data && response.data.length > 0) {
        const chartPoints = response.data;
        setChartData(chartPoints);
        
        if (response.available_periods) {
          setAvailablePeriods(response.available_periods);
        }
        
      } else {
        setChartData([]);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setChartLoading(false);
    }
  };

  // --- NOWA FUNKCJA: Pobieranie aktualnych wartości portfolio ---
  const fetchPortfolioStats = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.rpc('get_portfolio_current_values', {
        p_user_id: user.id,        
        p_time_range: timeRange
      });
      
      if (error) throw error;
      if (data) {
          setPortfolioStats(data);
      }
    } catch (error) {
      console.error('Error fetching portfolio stats:', error);
    }
  }

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      if (!user) return;

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

  useEffect(() => {
    fetchChartData();
    fetchCollections();
    fetchPortfolioStats(); 
  }, [user, timeRange]);

  const handleDropSuccess = () => {
    fetchPortfolio(); 
    fetchChartData();
    fetchPortfolioStats();
  };

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

  // Używamy danych z portfolioStats (z fallbackami na wypadek, gdy dane jeszcze nie nadeszły)
  const isPositive = (portfolioStats?.period_roi_percentage || 0) >= 0;
  const currentTotalValue = portfolioStats?.total_portfolio_value || 0;
  const currentGainPercent = portfolioStats?.period_roi_percentage || 0;
  const currentGainValue = portfolioStats?.period_gain_value || 0;
  const currentInvestmentsValue = portfolioStats?.investments_value || 0;
  const currentInventoryValue = portfolioStats?.inventory_value || 0;
  const currentDeposited = portfolioStats?.deposited || 0;
  const currentWithdrawn = portfolioStats?.withdrawn || 0;

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
        
        <button 
          onClick={() => setIsQuickAddModalOpen(true)}
          className="bg-steam-accent hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Quick Add
        </button>
      </div>

      {/* === GRID GŁÓWNY (WYKRES + PRAWA KOLUMNA) === */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        
        {/* KOLUMNA 1 (Szeroka): WYKRES */}
        <div className="xl:col-span-2">
          
          <div className="bg-[#1e232b] rounded-2xl p-6 border border-gray-800 shadow-xl relative overflow-hidden group h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="w-40 h-40 text-steam-accent" />
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total Portfolio Value</h2>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold text-white tracking-tight">{formatCurrency(currentTotalValue)}</span>
                  
                  <span className={`px-2 py-1 rounded-md text-sm font-bold border flex items-center gap-1.5 ${
                    isPositive ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'
                  }`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{Math.abs(currentGainPercent).toFixed(2)}%</span>
                    <span className="opacity-70 font-medium">
                      ({isPositive ? '+' : '-'}{formatCurrency(Math.abs(currentGainValue))})
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="flex bg-[#14171D] rounded-lg p-1 border border-white/5 relative z-20">
                {availablePeriods.map((t) => (
                  <button 
                    key={t} 
                    onClick={() => setTimeRange(t)}
                    className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                      timeRange === t ? 'bg-steam-accent text-white shadow-md' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[260px] mt-6 w-full relative">
              {chartLoading ? (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Loader2 className="w-8 h-8 text-steam-accent animate-spin" />
                </div>
              ) : chartData.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm z-10 font-medium">
                  No chart data available for this period.
                </div>
              ) : null}

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} className={chartLoading ? 'opacity-30' : ''}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <XAxis dataKey="chart_date" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'portfolio_value') return [formatCurrency(value), 'Portfolio Value'];
                      if (name === 'invested_value') return [formatCurrency(value), 'Invested Capital'];
                      return [formatCurrency(value), name];
                    }}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ backgroundColor: '#171a21', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    cursor={{ stroke: '#374151', strokeWidth: 1 }}
                  />
                  
                  <Area type="monotone" dataKey="invested_value" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorInvested)" />
                  <Area type="monotone" dataKey="portfolio_value" stroke={isPositive ? "#10b981" : "#ef4444"} strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KOLUMNA 2 (Wąska): STATYSTYKI I DROPY */}
        <div className="space-y-6">
          
          {/* SIATKA MAŁYCH STATYSTYK (2x2) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Investments */}
            <div className="bg-[#1e232b] rounded-2xl p-5 border border-gray-800 hover:border-steam-accent/30 transition-colors">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Investments</p>
              <p className="text-xl font-bold text-white">{formatCurrency(currentInvestmentsValue)}</p>
            </div>
            
            {/* Inventory */}
            <div className="bg-[#1e232b] rounded-2xl p-5 border border-gray-800 hover:border-steam-accent/30 transition-colors">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Inventory</p>
              <p className="text-xl font-bold text-white">{formatCurrency(currentInventoryValue)}</p>
            </div>

            {/* Deposited */}
            <div className="bg-[#1e232b] rounded-2xl p-5 border border-gray-800 hover:border-steam-accent/30 transition-colors">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Deposited</p>
              <p className="text-xl font-bold text-white">{formatCurrency(currentDeposited)}</p>
            </div>

            {/* Withdrawn */}
            <div className="bg-[#1e232b] rounded-2xl p-5 border border-gray-800 hover:border-steam-accent/30 transition-colors">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Withdrawn</p>
              <p className="text-xl font-bold text-white">{formatCurrency(currentWithdrawn)}</p>
            </div>
          </div>

          {/* WEEKLY DROP */}
          <div className="bg-[#1e232b] rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group p-6 flex flex-col justify-between min-h-[220px]">
            {/* Delikatny gradient w tle */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent opacity-50 z-0"></div>
            
            {/* Skrzynka w tle (przesunięta do góry i w prawo) */}
            <img 
              src="/images/case.webp" 
              className="absolute -right-2 top-3 w-40 sm:w-44 opacity-90 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105 z-0"               
              alt="Case Reward" 
            />

            {/* Górna część: Teksty */}
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 text-steam-accent mb-4">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                  <Package className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs uppercase tracking-widest">Weekly Drop</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Resets in {resetTime}</h3>
              <p className="text-gray-400 text-xs leading-relaxed max-w-[65%]">
                Earn enough XP to claim your weekly rewards.
              </p>
            </div>
            
            {/* Dolna część: Przycisk (zawsze na wierzchu) */}
            <div className="relative z-10 mt-6">
              <button 
                className="w-full bg-[#3b82f6] hover:bg-blue-500 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25" 
                onClick={() => setIsDropModalOpen(true)}
              >
                <CheckCircle className="w-4 h-4" /> 
                <span>Log Drop</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === KOLEKCJE (PEŁNA SZEROKOŚĆ) === */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-white">Collections</h3>
            <span className="bg-gray-800 text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full">{collections.length}</span>
          </div>
          <button 
            onClick={() => setIsCollectionModalOpen(true)}
            className="text-steam-accent text-xs font-bold flex items-center gap-1 hover:text-white transition-colors uppercase tracking-wider bg-steam-accent/10 px-3 py-1.5 rounded-lg border border-steam-accent/20"
          >
            <Plus className="w-3 h-3" /> New
          </button>
        </div>
        
        {/* Pozioma siatka z przewijaniem (dla wielu kolekcji) */}
        {collections.length === 0 ? (
          <div className="border border-dashed border-gray-700 bg-[#1e232b]/50 rounded-2xl p-10 text-center text-gray-500 flex flex-col items-center justify-center">
            <Wallet className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-base font-bold text-gray-300">No collections yet</p>
            <p className="text-sm mt-1">Create vaults to organize your inventory and track specific investments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {collections.map((col) => (
              <div key={col.id} 
              onClick={() => navigate(`/collection/${col.id}`)}
              className="bg-[#1e232b] p-5 rounded-2xl border border-gray-800 hover:border-steam-accent/50 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between h-36">
                  {/* Dekoracyjne ikony w tle */}
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:-rotate-12 duration-500">
                    <Wallet className="w-32 h-32" />
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg text-white group-hover:text-steam-accent transition-colors truncate pr-8">
                      {col.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                      <Package className="w-3 h-3" /> {col.total_items_quantity || 0} Items
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <p className="text-gray-300 font-mono text-lg font-bold">
                      {formatCurrency(col.total_value || 0)}
                    </p>
                    <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-steam-accent transition-colors">
                      <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-white" />
                    </div>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === TABELA (OSTATNIE PRZEDMIOTY) === */}
      <div className="bg-[#1e232b] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#1b2028]">
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300">Recent Inventory</h3>
          <button className="text-xs text-steam-accent font-bold hover:text-white transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </button>
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
                      <td className="p-4 font-medium text-gray-400">
                        <span className="bg-gray-800 px-2 py-1 rounded text-xs">{item.quantity}</span>
                      </td>
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
      
      <LogDropModal 
        isOpen={isDropModalOpen}
        onClose={() => setIsDropModalOpen(false)}
        onSuccess={handleDropSuccess}
      />
      <CreateCollectionModal 
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onSuccess={() => {
          fetchCollections();
        }}
      />
      <QuickAddModal 
        isOpen={isQuickAddModalOpen}
        onClose={() => setIsQuickAddModalOpen(false)}
        onSuccess={() => {
          fetchPortfolio();
          fetchChartData();
          fetchCollections();
          fetchPortfolioStats();
        }}
      />
    </div>
  );
};

export default Panel;