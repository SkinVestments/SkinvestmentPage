import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Loader2, ArrowDownUp, Calendar, Package, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

// --- TYPY ZGODNE Z TWOJĄ BAZĄ ---
type TransactionType = 'DROP' | 'BUY' | 'SELL';

interface Transaction {
  id: string;
  type: TransactionType;
  quantity: number;
  price: number; // Cena jednostkowa
  fee_deducted: number;
  transaction_date: string;
  realized_profit: number; // Tylko dla SELL
  is_investment: boolean;
  cs2_items: {
    market_hash_name: string;
    icon_url: string | null;
    rarity: string | null;
  };
}

const ITEMS_PER_PAGE = 15;

// Helper do kolorów (ten sam co w Panelu)
const getRarityStyle = (rarity: string | null | undefined) => {
  if (!rarity) return { border: 'border-gray-600', text: 'text-gray-400', shadow: '' };
  const r = rarity.toLowerCase();
  if (r.includes('contraband')) return { border: 'border-yellow-500', text: 'text-yellow-500', shadow: 'shadow-yellow-500/20' };
  if (r.includes('covert')) return { border: 'border-red-500', text: 'text-red-500', shadow: 'shadow-red-500/20' };
  if (r.includes('classified')) return { border: 'border-pink-500', text: 'text-pink-500', shadow: 'shadow-pink-500/20' };
  if (r.includes('restricted')) return { border: 'border-purple-500', text: 'text-purple-500', shadow: 'shadow-purple-500/20' };
  if (r.includes('mil-spec')) return { border: 'border-blue-600', text: 'text-blue-500', shadow: 'shadow-blue-500/20' };
  return { border: 'border-gray-600', text: 'text-gray-400', shadow: '' };
};

const History = () => {
  const { user } = useAuth();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      // Budowanie zapytania
      let query = supabase
        .from('transactions')
        .select(`
          *,
          cs2_items (
            market_hash_name,
            icon_url,
            rarity
          )
        `, { count: 'exact' })
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false }) // Sortowanie po Twojej kolumnie
        .range(from, to);

      if (filterType !== 'ALL') {
        query = query.eq('type', filterType);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      if (data) setTransactions(data as any);
      if (count) setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));

    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user, page, filterType]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="text-white animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-1">Transaction History</h1>
          <p className="text-gray-400">Track your drops, purchases, and sales.</p>
        </div>
        
        {/* Filtry */}
        <div className="flex bg-[#1e232b] p-1 rounded-xl border border-gray-800 shadow-sm">
          {(['ALL', 'DROP', 'BUY', 'SELL'] as const).map((type) => (
            <button
              key={type}
              onClick={() => { setFilterType(type); setPage(1); }}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wide ${
                filterType === type 
                  ? 'bg-steam-accent text-white shadow-md transform scale-105' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-[#1e232b] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center text-steam-accent">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-20 text-center text-gray-400">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-lg font-medium">No transactions found.</p>
            <p className="text-sm opacity-60">Change filters or add items to your portfolio.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#171a21] text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-800">
                  <th className="p-5 pl-8">Type</th>
                  <th className="p-5">Item Details</th>
                  <th className="p-5 text-right">Unit Price</th>
                  <th className="p-5 text-right">Total / Profit</th>
                  <th className="p-5 text-right pr-8">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 text-sm">
                {transactions.map((tx) => {
                  const rarityStyle = getRarityStyle(tx.cs2_items?.rarity);
                  const totalValue = tx.quantity * tx.price;
                  
                  return (
                    <tr key={tx.id} className="hover:bg-[#252b36] transition-colors group">
                      
                      {/* 1. Typ Transakcji */}
                      <td className="p-5 pl-8">
                        <span className={`
                          inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-wider
                          ${tx.type === 'DROP' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                          ${tx.type === 'BUY' ? 'bg-gray-700/30 text-gray-300 border-gray-600/30' : ''}
                          ${tx.type === 'SELL' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                        `}>
                          {tx.type === 'DROP' && <Package className="w-3.5 h-3.5" />}
                          {tx.type === 'BUY' && <ArrowDownUp className="w-3.5 h-3.5 rotate-180" />}
                          {tx.type === 'SELL' && <TrendingUp className="w-3.5 h-3.5" />}
                          {tx.type}
                        </span>
                      </td>

                      {/* 2. Przedmiot */}
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                           {/* Ikona */}
                          <div className={`
                             w-16 h-12 bg-gradient-to-b from-[#1a1d24] to-[#141619] rounded flex items-center justify-center p-1 border-b-2
                             ${rarityStyle.border} ${rarityStyle.shadow}
                          `}>
                            <img 
                              src={tx.cs2_items?.icon_url || ''} 
                              alt="" 
                              className="w-full h-full object-contain drop-shadow-md" 
                            />
                          </div>
                          {/* Tekst */}
                          <div>
                             <div className="font-bold text-gray-200 group-hover:text-white transition-colors">
                                {tx.cs2_items?.market_hash_name}
                             </div>
                             <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                <span className={`${rarityStyle.text} font-bold uppercase tracking-wider text-[10px]`}>
                                    {tx.cs2_items?.rarity || 'Common'}
                                </span>
                                {tx.quantity > 1 && (
                                    <span className="bg-gray-700 text-white px-1.5 rounded text-[10px]">x{tx.quantity}</span>
                                )}
                             </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. Cena Jednostkowa */}
                      <td className="p-5 text-right font-mono text-gray-400">
                        {tx.type === 'DROP' ? (
                          <span className="text-steam-accent font-bold text-xs uppercase">Free Drop</span>
                        ) : (
                          formatCurrency(tx.price)
                        )}
                      </td>

                      {/* 4. Suma / Profit */}
                      <td className="p-5 text-right font-mono">
                        <div className="font-bold text-white">
                            {formatCurrency(totalValue)}
                        </div>
                        
                        {/* Jeśli to sprzedaż, pokaż zysk */}
                        {tx.type === 'SELL' && tx.realized_profit !== null && (
                            <div className={`text-xs mt-1 flex justify-end items-center gap-1 ${tx.realized_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {tx.realized_profit >= 0 ? '+' : ''}{formatCurrency(tx.realized_profit)}
                                <span className={`px-1 py-0.5 rounded text-[9px] ${tx.realized_profit >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                    PROFIT
                                </span>
                            </div>
                        )}
                        
                        {/* Jeśli opłata została pobrana */}
                        {tx.fee_deducted > 0 && tx.type === 'SELL' && (
                             <div className="text-[10px] text-gray-600 mt-0.5">
                                Fee: {formatCurrency(tx.fee_deducted)}
                             </div>
                        )}
                      </td>

                      {/* 5. Data */}
                      <td className="p-5 pr-8 text-right text-gray-500 text-xs">
                        <div className="flex flex-col items-end gap-1">
                            <span className="font-medium text-gray-400">{new Date(tx.transaction_date).toLocaleDateString()}</span>
                            <span>{new Date(tx.transaction_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginacja */}
        <div className="bg-[#1b2028] px-6 py-4 border-t border-gray-800 flex justify-between items-center">
            <button 
                disabled={page===1 || loading} 
                onClick={()=>setPage(p=>p-1)}
                className="text-gray-400 hover:text-white disabled:opacity-30 text-sm font-bold flex items-center gap-1"
            >
                Previous
            </button>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                Page <span className="text-white text-sm">{page}</span> of {totalPages || 1}
            </span>
            <button 
                disabled={page>=totalPages || loading} 
                onClick={()=>setPage(p=>p+1)}
                className="text-gray-400 hover:text-white disabled:opacity-30 text-sm font-bold flex items-center gap-1"
            >
                Next
            </button>
        </div>
      </div>
    </div>
  );
};

export default History;