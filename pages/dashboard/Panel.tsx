import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { 
  ChevronLeft, ChevronRight, ArrowUpDown, Loader2, 
  TrendingUp, TrendingDown, Package, Plus, CheckCircle, Wallet, ArrowRight 
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis, Legend } from 'recharts';
import { useWeeklyReset } from '@/utils/utils';
import { formatCurrency, getRarityStyle } from '@/utils/display';
import { LogDropModal } from '../../components/dashboard/LogDropModal';
import { CreateCollectionModal } from '../../components/dashboard/CreateCollectionModal';
import { QuickAddModal } from '@/components/dashboard/QuickAddModal';
import { ItemImage } from '@/components/ui/ItemImage';

import { useNavigate } from 'react-router-dom';
import {
  chartAxisLineStyle,
  chartAxisTickStyle,
  chartTooltipItemStyle,
  chartTooltipStyle,
  formatChartXAxis,
  formatChartYAxis,
} from '@/utils/chartTheme';
import {
  normalizePortfolioCurrentValues,
  type PortfolioCurrentValues,
} from '@/utils/portfolioRpc';
import { AdSlot } from '@/components/ads/AdSlot';

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

const ITEMS_PER_PAGE = 5;

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
        period_text: timeRange
      });
      
      if (error) throw error;
      const stats = normalizePortfolioCurrentValues(data);
      if (stats) setPortfolioStats(stats);
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
    <div className="text-steam-text animate-fade-in pb-10 min-w-0 overflow-x-hidden">
      
      {/* === HEADER DASHBOARDU === */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-steam-text mb-1">Dashboard</h1>
          <p className="text-steam-secondary text-sm sm:text-base break-all sm:break-normal">
            Welcome back, <span className="text-steam-text font-medium">{user?.email}</span>
          </p>
        </div>
        
        <button 
          onClick={() => setIsQuickAddModalOpen(true)}
          className="bg-steam-accent hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg theme-shadow-accent transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Quick Add
        </button>
      </div>

      {/* === GRID GŁÓWNY (WYKRES + PRAWA KOLUMNA) === */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        
        {/* KOLUMNA 1 (Szeroka): WYKRES */}
        <div className="xl:col-span-2">
          
          <div className="bg-steam-card rounded-2xl p-6 border border-steam-border shadow-xl relative overflow-x-hidden group h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="w-40 h-40 text-steam-accent" />
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
              <div className="min-w-0 w-full">
                <h2 className="text-steam-secondary text-xs font-bold uppercase tracking-wider mb-2">Total Portfolio Value</h2>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-steam-text tracking-tight break-all sm:break-normal">{formatCurrency(currentTotalValue)}</span>
                  
                  <span className={`px-2 py-1 rounded-md text-xs sm:text-sm font-bold border flex items-center gap-1.5 w-fit flex-wrap ${
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
              
              <div className="flex bg-steam-bg rounded-lg p-1 border border-steam-border/50 relative z-20">
                {availablePeriods.map((t) => (
                  <button 
                    key={t} 
                    onClick={() => setTimeRange(t)}
                    className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                      timeRange === t ? 'bg-steam-accent text-white shadow-md' : 'text-steam-tertiary hover:text-steam-text'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[320px] mt-6 w-full relative shrink-0">
              {chartLoading ? (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Loader2 className="w-8 h-8 text-steam-accent animate-spin" />
                </div>
              ) : chartData.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-steam-tertiary text-sm z-10 font-medium">
                  No chart data available for this period.
                </div>
              ) : null}

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  className={chartLoading ? 'opacity-30' : ''}
                  margin={{ top: 8, right: 12, left: 8, bottom: 28 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? 'var(--color-profit)' : 'var(--color-loss)'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isPositive ? 'var(--color-profit)' : 'var(--color-loss)'} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="chart_date"
                    tick={chartAxisTickStyle}
                    axisLine={chartAxisLineStyle}
                    tickLine={false}
                    tickFormatter={formatChartXAxis}
                    minTickGap={28}
                    height={50}
                    label={{
                      value: 'Date',
                      position: 'bottom',
                      offset: 0,
                      fill: 'var(--color-text-tertiary)',
                      fontSize: 10,
                    }}
                  />
                  <YAxis
                    tick={chartAxisTickStyle}
                    axisLine={chartAxisLineStyle}
                    tickLine={false}
                    width={52}
                    tickFormatter={formatChartYAxis}
                    domain={['auto', 'auto']}
                    label={{
                      value: 'Value (USD)',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 8,
                      fill: 'var(--color-text-tertiary)',
                      fontSize: 10,
                    }}
                  />

                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'Portfolio Value' || name === 'portfolio_value') {
                        return [formatCurrency(value), 'Portfolio Value'];
                      }
                      if (name === 'Invested Capital' || name === 'invested_value') {
                        return [formatCurrency(value), 'Invested Capital'];
                      }
                      return [formatCurrency(value), name];
                    }}
                    labelFormatter={(label) => `Date: ${formatChartXAxis(String(label))}`}
                    contentStyle={chartTooltipStyle}
                    itemStyle={chartTooltipItemStyle}
                    cursor={{ stroke: 'var(--color-card-border)', strokeWidth: 1 }}
                  />

                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="plainline"
                    iconSize={14}
                    wrapperStyle={{ fontSize: 11, color: 'var(--color-text-secondary)', paddingBottom: 4 }}
                  />

                  <Area
                    type="monotone"
                    name="Invested Capital"
                    dataKey="invested_value"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#colorInvested)"
                  />
                  <Area
                    type="monotone"
                    name="Portfolio Value"
                    dataKey="portfolio_value"
                    stroke={isPositive ? 'var(--color-profit)' : 'var(--color-loss)'}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
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
            <div className="bg-steam-card rounded-2xl p-5 border border-steam-border hover:border-steam-accent/30 transition-colors">
              <p className="text-steam-tertiary text-[10px] font-bold uppercase tracking-wider mb-1">Investments</p>
              <p className="text-xl font-bold text-steam-text">{formatCurrency(currentInvestmentsValue)}</p>
            </div>
            
            {/* Inventory */}
            <div className="bg-steam-card rounded-2xl p-5 border border-steam-border hover:border-steam-accent/30 transition-colors">
              <p className="text-steam-tertiary text-[10px] font-bold uppercase tracking-wider mb-1">Inventory</p>
              <p className="text-xl font-bold text-steam-text">{formatCurrency(currentInventoryValue)}</p>
            </div>

            {/* Deposited */}
            <div className="bg-steam-card rounded-2xl p-5 border border-steam-border hover:border-steam-accent/30 transition-colors">
              <p className="text-steam-tertiary text-[10px] font-bold uppercase tracking-wider mb-1">Deposited</p>
              <p className="text-xl font-bold text-steam-text">{formatCurrency(currentDeposited)}</p>
            </div>

            {/* Withdrawn */}
            <div className="bg-steam-card rounded-2xl p-5 border border-steam-border hover:border-steam-accent/30 transition-colors">
              <p className="text-steam-tertiary text-[10px] font-bold uppercase tracking-wider mb-1">Withdrawn</p>
              <p className="text-xl font-bold text-steam-text">{formatCurrency(currentWithdrawn)}</p>
            </div>
          </div>

          {/* WEEKLY DROP */}
          <div className="bg-steam-card rounded-2xl border border-steam-border/50 shadow-xl relative overflow-hidden group p-6 flex flex-col justify-between min-h-[220px]">
            {/* Delikatny gradient w tle */}
            <div className="absolute inset-0 bg-gradient-to-br from-steam-accent/10 via-transparent to-transparent opacity-50 z-0"></div>
            
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
              
              <h3 className="text-2xl font-bold text-steam-text mb-2 tracking-tight">Resets in {resetTime}</h3>
              <p className="text-steam-secondary text-xs leading-relaxed max-w-[65%]">
                Earn enough XP to claim your weekly rewards.
              </p>
            </div>
            
            {/* Dolna część: Przycisk (zawsze na wierzchu) */}
            <div className="relative z-10 mt-6">
              <button 
                className="w-full bg-steam-accent hover:opacity-90 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg theme-shadow-accent" 
                onClick={() => setIsDropModalOpen(true)}
              >
                <CheckCircle className="w-4 h-4" /> 
                <span>Log Drop</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdSlot slotKey="panel" className="mb-8" />

      {/* === KOLEKCJE (PEŁNA SZEROKOŚĆ) === */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-steam-text">Collections</h3>
            <span className="bg-steam-elevated text-steam-secondary text-xs font-bold px-2 py-0.5 rounded-full">{collections.length}</span>
          </div>
          <button 
            onClick={() => setIsCollectionModalOpen(true)}
            className="text-steam-accent text-xs font-bold flex items-center gap-1 hover:text-steam-text transition-colors uppercase tracking-wider bg-steam-accent/10 px-3 py-1.5 rounded-lg border border-steam-accent/20"
          >
            <Plus className="w-3 h-3" /> New
          </button>
        </div>
        
        {/* Pozioma siatka z przewijaniem (dla wielu kolekcji) */}
        {collections.length === 0 ? (
          <div className="border border-dashed border-steam-border bg-steam-card/50 rounded-2xl p-10 text-center text-steam-tertiary flex flex-col items-center justify-center">
            <Wallet className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-base font-bold text-steam-secondary">No collections yet</p>
            <p className="text-sm mt-1">Create vaults to organize your inventory and track specific investments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {collections.map((col) => (
              <div key={col.id} 
              onClick={() => navigate(`/collection/${col.id}`)}
              className="bg-steam-card p-5 rounded-2xl border border-steam-border hover:border-steam-accent/50 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between h-36">
                  {/* Dekoracyjne ikony w tle */}
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:-rotate-12 duration-500">
                    <Wallet className="w-32 h-32" />
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg text-steam-text group-hover:text-steam-accent transition-colors truncate pr-8">
                      {col.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-steam-tertiary text-[10px] font-bold uppercase tracking-wider">
                      <Package className="w-3 h-3" /> {col.total_items_quantity || 0} Items
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <p className="text-steam-secondary font-mono text-lg font-bold">
                      {formatCurrency(col.total_value || 0)}
                    </p>
                    <div className="w-6 h-6 rounded-full bg-steam-elevated flex items-center justify-center group-hover:bg-steam-accent transition-colors">
                      <ArrowRight className="w-3 h-3 text-steam-secondary group-hover:text-steam-text" />
                    </div>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === TABELA (OSTATNIE PRZEDMIOTY) === */}
      <div className="bg-steam-card rounded-2xl border border-steam-border shadow-xl overflow-hidden">
        <div className="p-5 border-b border-steam-border flex justify-between items-center bg-steam-elevated">
          <h3 className="font-bold text-sm uppercase tracking-wider text-steam-secondary">Recent Inventory</h3>
          <button className="text-xs text-steam-accent font-bold hover:text-steam-text transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {loading ? (
          <div className="p-20 flex justify-center text-steam-accent">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-steam-secondary">
            <p className="text-lg mb-2">No items found.</p>
            <p className="text-sm">Add items to see them here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-steam-surface text-steam-tertiary text-xs font-bold uppercase tracking-wider border-b border-steam-border">
                  <th className="p-5 pl-6 w-[45%]">Item</th>
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
              <tbody className="divide-y divide-steam-border/50 text-sm">
                {items.map((item) => {
                   const currentPrice = item.cs2_items?.price || 0;
                   const rarityStyle = getRarityStyle(item.cs2_items?.rarity);
                   return (
                    <tr key={item.id} className="hover:bg-steam-hover transition-colors group">
                      <td className="p-4 pl-6 w-[45%] max-w-0">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`
                            relative w-16 h-12 shrink-0 bg-gradient-to-b from-steam-elevated to-steam-bg 
                            rounded-md flex items-center justify-center p-1 
                            border-b-[3px] ${rarityStyle.border} ${rarityStyle.shadow}
                            transition-all duration-300 group-hover:scale-105
                          `}>
                            <ItemImage
                              src={item.cs2_items?.icon_url}
                              alt={item.cs2_items?.market_hash_name ?? ''}
                              className="w-full h-full object-contain drop-shadow-md"
                              wrapperClassName="w-full h-full"
                            />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                             <span className="font-bold text-steam-text group-hover:text-steam-text truncate whitespace-nowrap" title={item.cs2_items?.market_hash_name ?? ''}>
                               {item.cs2_items?.market_hash_name}
                             </span>
                             <span className={`text-[10px] uppercase font-bold tracking-wider truncate whitespace-nowrap ${rarityStyle.text}`}>
                               {item.cs2_items?.rarity || 'Common'}
                             </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-steam-secondary">
                        <span className="bg-steam-elevated px-2 py-1 rounded text-xs">{item.quantity}</span>
                      </td>
                      <td className="p-4 text-steam-secondary font-mono">{formatCurrency(currentPrice)}</td>
                      <td className="p-4 font-bold text-steam-text font-mono">{formatCurrency(currentPrice * item.quantity)}</td>
                      <td className="p-4 text-right pr-6 text-steam-tertiary text-xs">{new Date(item.acquired_at).toLocaleDateString()}</td>
                    </tr>
                   )
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Paginacja */}
        <div className="bg-steam-elevated px-6 py-4 border-t border-steam-border flex justify-between items-center">
           <button 
             disabled={page===1} 
             onClick={()=>setPage(p=>p-1)} 
             className="text-steam-secondary hover:text-steam-text disabled:opacity-30 flex items-center gap-1 text-sm font-bold transition-colors"
           >
             <ChevronLeft className="w-4 h-4"/> Previous
           </button>
           
           <span className="text-xs font-bold text-steam-tertiary uppercase tracking-widest">
             Page <span className="text-steam-text text-sm">{page}</span> of {totalPages || 1}
           </span>
           
           <button 
             disabled={page>=totalPages} 
             onClick={()=>setPage(p=>p+1)} 
             className="text-steam-secondary hover:text-steam-text disabled:opacity-30 flex items-center gap-1 text-sm font-bold transition-colors"
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