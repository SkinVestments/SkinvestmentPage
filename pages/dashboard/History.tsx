import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Loader2, ArrowDownUp, Calendar, Package, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency, getRarityStyle } from '@/utils/display';
import { ItemImage } from '@/components/ui/ItemImage';

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

  return (
    <div className="text-steam-text animate-fade-in pb-10 min-w-0 overflow-x-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-steam-text mb-1">Transaction History</h1>
          <p className="text-steam-secondary">Track your drops, purchases, and sales.</p>
        </div>
        
        {/* Filtry */}
        <div className="flex bg-steam-card p-1 rounded-xl border border-steam-border shadow-sm w-full sm:w-auto overflow-x-auto">
          {(['ALL', 'DROP', 'BUY', 'SELL'] as const).map((type) => (
            <button
              key={type}
              onClick={() => { setFilterType(type); setPage(1); }}
              className={`px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all uppercase tracking-wide whitespace-nowrap shrink-0 ${
                filterType === type 
                  ? 'bg-steam-accent text-white shadow-md sm:scale-105' 
                  : 'text-steam-secondary hover:text-steam-text hover:bg-steam-hover'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-steam-card rounded-2xl border border-steam-border shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center text-steam-accent">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-20 text-center text-steam-secondary">
            <div className="w-16 h-16 bg-steam-elevated rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-lg font-medium">No transactions found.</p>
            <p className="text-sm opacity-60">Change filters or add items to your portfolio.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-steam-surface text-steam-tertiary text-xs font-bold uppercase tracking-wider border-b border-steam-border">
                  <th className="p-5 pl-8">Type</th>
                  <th className="p-5">Item Details</th>
                  <th className="p-5 text-right">Unit Price</th>
                  <th className="p-5 text-right">Total / Profit</th>
                  <th className="p-5 text-right pr-8">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steam-border/50 text-sm">
                {transactions.map((tx) => {
                  const rarityStyle = getRarityStyle(tx.cs2_items?.rarity);
                  const totalValue = tx.quantity * tx.price;
                  
                  return (
                    <tr key={tx.id} className="hover:bg-steam-hover transition-colors group">
                      
                      {/* 1. Typ Transakcji */}
                      <td className="p-5 pl-8">
                        <span className={`
                          inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-wider
                          ${tx.type === 'DROP' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                          ${tx.type === 'BUY' ? 'bg-steam-elevated/60 text-steam-secondary border-steam-border/30' : ''}
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
                             w-16 h-12 bg-gradient-to-b from-steam-elevated to-steam-bg rounded flex items-center justify-center p-1 border-b-2
                             ${rarityStyle.border} ${rarityStyle.shadow}
                          `}>
                            <ItemImage
                              src={tx.cs2_items?.icon_url}
                              alt={tx.cs2_items?.market_hash_name ?? ''}
                              className="w-full h-full object-contain drop-shadow-md"
                              wrapperClassName="w-full h-full"
                            />
                          </div>
                          {/* Tekst */}
                          <div>
                             <div className="font-bold text-steam-text group-hover:text-steam-text transition-colors">
                                {tx.cs2_items?.market_hash_name}
                             </div>
                             <div className="text-xs text-steam-tertiary flex items-center gap-2 mt-0.5">
                                <span className={`${rarityStyle.text} font-bold uppercase tracking-wider text-[10px]`}>
                                    {tx.cs2_items?.rarity || 'Common'}
                                </span>
                                {tx.quantity > 1 && (
                                    <span className="bg-steam-elevated text-steam-text px-1.5 rounded text-[10px]">x{tx.quantity}</span>
                                )}
                             </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. Cena Jednostkowa */}
                      <td className="p-5 text-right font-mono text-steam-secondary">
                        {tx.type === 'DROP' ? (
                          <span className="text-steam-accent font-bold text-xs uppercase">Free Drop</span>
                        ) : (
                          formatCurrency(tx.price)
                        )}
                      </td>

                      {/* 4. Suma / Profit */}
                      <td className="p-5 text-right font-mono">
                        <div className="font-bold text-steam-text">
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
                             <div className="text-[10px] text-steam-tertiary mt-0.5">
                                Fee: {formatCurrency(tx.fee_deducted)}
                             </div>
                        )}
                      </td>

                      {/* 5. Data */}
                      <td className="p-5 pr-8 text-right text-steam-tertiary text-xs">
                        <div className="flex flex-col items-end gap-1">
                            <span className="font-medium text-steam-secondary">{new Date(tx.transaction_date).toLocaleDateString()}</span>
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
        <div className="bg-steam-elevated px-6 py-4 border-t border-steam-border flex justify-between items-center">
            <button 
                disabled={page===1 || loading} 
                onClick={()=>setPage(p=>p-1)}
                className="text-steam-secondary hover:text-steam-text disabled:opacity-30 text-sm font-bold flex items-center gap-1"
            >
                Previous
            </button>
            <span className="text-xs text-steam-tertiary font-bold uppercase tracking-widest">
                Page <span className="text-steam-text text-sm">{page}</span> of {totalPages || 1}
            </span>
            <button 
                disabled={page>=totalPages || loading} 
                onClick={()=>setPage(p=>p+1)}
                className="text-steam-secondary hover:text-steam-text disabled:opacity-30 text-sm font-bold flex items-center gap-1"
            >
                Next
            </button>
        </div>
      </div>
    </div>
  );
};

export default History;