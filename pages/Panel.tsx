import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { ChevronLeft, ChevronRight, ArrowUpDown, Loader2, LogOut } from 'lucide-react';

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

const ITEMS_PER_PAGE = 10;

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
  const { user, signOut } = useAuth();
  
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState<string>('acquired_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
      console.error('Error fetching portfolio:', error);
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
    <div className="min-h-screen bg-[#14171D] text-white pt-24 px-4 pb-10">
      
      <div className="max-w-6xl mx-auto w-full animate-fade-in">
        
        {/* === HEADER === */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Inventory</h1>
            <p className="text-gray-400 text-sm mt-1">
               Account: <span className="text-steam-accent font-medium">{user?.email}</span>
            </p>
          </div>
          
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-2 bg-[#212c3d] hover:bg-red-500/10 text-gray-300 hover:text-red-400 border border-white/5 hover:border-red-500/30 px-5 py-2 rounded transition-all text-sm font-bold uppercase tracking-wider shadow-lg group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Sign Out
          </button>
        </div>

        {/* === TABELA === */}
        <div className="bg-[#1e232b] rounded-lg border border-gray-800 shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-20 flex justify-center text-steam-accent">
              <Loader2 className="animate-spin w-10 h-10" />
            </div>
          ) : items.length === 0 ? (
            <div className="p-16 text-center text-gray-400">
              <p className="text-lg">Your portfolio is currently empty.</p>
              <button className="mt-4 text-steam-accent hover:underline">Add your first item</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#171a21] text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-800">
                    <th className="p-5 pl-6">Item Name</th>
                    <th 
                      className="p-5 cursor-pointer hover:text-steam-accent transition-colors"
                      onClick={() => handleSort('quantity')}
                    >
                      <div className="flex items-center gap-1">
                        Qty
                        {sortBy === 'quantity' && <ArrowUpDown className="w-3 h-3" />}
                      </div>
                    </th>
                    <th 
                      className="p-5 cursor-pointer hover:text-steam-accent transition-colors"
                      onClick={() => handleSort('buy_price')}
                    >
                      <div className="flex items-center gap-1">
                        Buy Price
                        {sortBy === 'buy_price' && <ArrowUpDown className="w-3 h-3" />}
                      </div>
                    </th>
                    <th className="p-5">Current Price</th>
                    <th className="p-5">Total Value</th>
                    <th className="p-5 pr-6 text-right">Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50 text-sm">
                  {items.map((item) => {
                    const currentPrice = item.cs2_items?.price || 0;
                    const totalValue = currentPrice * item.quantity;
                    const totalCost = item.buy_price * item.quantity;
                    const profit = totalValue - totalCost;
                    const profitPercent = totalCost > 0 ? (profit / totalCost) * 100 : 0;
                    const isProfit = profit >= 0;
                    
                    const rarityStyle = getRarityStyle(item.cs2_items?.rarity);

                    return (
                      <tr key={item.id} className="hover:bg-[#252b36] transition-colors group">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-5">
                            {/* --- ZMIANA: WIĘKSZY I SZERSZY KONTENER NA OBRAZEK --- */}
                            <div className={`
                              relative w-24 h-16 bg-gradient-to-b from-[#1a1d24] to-[#141619] 
                              rounded-md flex items-center justify-center p-2
                              border-b-[3px] ${rarityStyle.border} ${rarityStyle.shadow}
                              transition-all duration-300 group-hover:shadow-lg group-hover:scale-105
                            `}>
                              {item.cs2_items?.icon_url ? (
                                <img 
                                  src={item.cs2_items.icon_url} 
                                  alt={item.cs2_items.market_hash_name} 
                                  className="w-full h-full object-contain drop-shadow-md"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-800/50 rounded-sm" />
                              )}
                            </div>
                            {/* --------------------------------------------------- */}
                            
                            <div className="flex flex-col justify-center">
                              <span className="font-semibold text-gray-200 group-hover:text-white truncate max-w-[180px] md:max-w-[300px] text-base">
                                {item.cs2_items?.market_hash_name || 'Unknown Item'}
                              </span>
                              <span className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${rarityStyle.text}`}>
                                {item.cs2_items?.rarity || 'Common'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-gray-300">{item.quantity}</td>
                        <td className="p-4 text-gray-400 font-mono">{formatCurrency(item.buy_price)}</td>
                        <td className="p-4 text-gray-300 font-mono">{formatCurrency(currentPrice)}</td>
                        <td className="p-4">
                          <div className="font-bold text-white font-mono">{formatCurrency(totalValue)}</div>
                          <div className={`text-xs font-medium flex items-center gap-1 mt-1 ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                            {isProfit ? '+' : ''}{formatCurrency(profit)} 
                            <span className={`ml-1 bg-opacity-20 px-1.5 py-0.5 rounded text-[10px] ${isProfit ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                              {isProfit ? '▲' : '▼'} {Math.abs(profitPercent).toFixed(2)}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4 pr-6 text-right text-gray-500 text-xs">
                           {new Date(item.acquired_at).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginacja */}
          <div className="bg-[#171a21] px-6 py-4 border-t border-gray-800 flex justify-between items-center">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="flex items-center gap-2 px-4 py-2 rounded hover:bg-white/5 text-sm font-bold text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
               Page <span className="text-white text-sm">{page}</span> of {totalPages || 1}
            </span>

            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-2 px-4 py-2 rounded hover:bg-white/5 text-sm font-bold text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panel;