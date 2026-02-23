import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, DollarSign, Activity, Wallet, Loader2 } from 'lucide-react';

export const SummaryCards = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Pobieranie current values (dla przykładu bierzemy 'ALL')
        const { data: currentData } = await supabase.rpc('get_portfolio_current_values', {
          p_user_id: user.id,
          p_time_range: 'ALL'
        });
        
        // Pobieranie lifetime stats
        const { data: statsData } = await supabase.rpc('get_portfolio_stats', {
          p_user_id: user.id
        });

        if (currentData) setData(currentData);
        if (statsData) setStats(statsData[0]); // Zwraca tablicę 1-elementową
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  if (loading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-steam-accent w-8 h-8" /></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-[#1e232b] p-5 rounded-2xl border border-gray-800 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Wallet className="w-6 h-6" /></div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Value</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{formatCurrency(data?.total_portfolio_value)}</h3>
        <p className="text-xs text-gray-400">Inventory: {formatCurrency(data?.inventory_value)}</p>
      </div>

      <div className="bg-[#1e232b] p-5 rounded-2xl border border-gray-800 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-green-500/10 rounded-xl text-green-400"><TrendingUp className="w-6 h-6" /></div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">All-Time ROI</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">
          {data?.period_roi_percentage >= 0 ? '+' : ''}{data?.period_roi_percentage}%
        </h3>
        <p className="text-xs text-gray-400">Profit: {formatCurrency(data?.period_gain_value)}</p>
      </div>

      <div className="bg-[#1e232b] p-5 rounded-2xl border border-gray-800 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><DollarSign className="w-6 h-6" /></div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Invested</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{formatCurrency(stats?.total_invested)}</h3>
        <p className="text-xs text-gray-400">Deposited: {formatCurrency(data?.deposited)}</p>
      </div>

      <div className="bg-[#1e232b] p-5 rounded-2xl border border-gray-800 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400"><Activity className="w-6 h-6" /></div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Transactions</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{stats?.total_transactions || 0}</h3>
        <p className="text-xs text-gray-400">Total Earned: <span className="text-green-400">{formatCurrency(stats?.total_earned)}</span></p>
      </div>
    </div>
  );
};