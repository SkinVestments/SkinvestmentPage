import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Lock, TrendingUp } from 'lucide-react';

interface DropsChartProps {
  hasPremiumAccess: boolean;
}

export const DropsChart = ({ hasPremiumAccess }: DropsChartProps) => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('ALL');

  useEffect(() => {
    // Nawet jeśli użytkownik nie ma premium, pobieramy dane z tyłu, żeby rozmazany wykres wyglądał legitnie
    const fetchChart = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data } = await supabase.rpc('get_user_drops_chart', {
          target_user_id: user.id,
          period_text: timeRange
        });
        if (data && data.data) {
          setChartData(data.data);
        }
      } catch (error) {
        console.error('Error fetching drops chart:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChart();
  }, [user, timeRange]);

  return (
    <div className="bg-[#1e232b] p-6 rounded-2xl border border-gray-800 shadow-lg h-full relative overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-400" />
          <h3 className="font-bold text-white">Drops Performance</h3>
        </div>
        
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          disabled={!hasPremiumAccess}
          className="bg-[#14171D] border border-gray-700 text-xs text-white rounded-lg px-2 py-1 focus:outline-none"
        >
          <option value="1M">1 Month</option>
          <option value="3M">3 Months</option>
          <option value="6M">6 Months</option>
          <option value="1Y">1 Year</option>
          <option value="ALL">All Time</option>
        </select>
      </div>

      <div className="flex-1 min-h-[300px] w-full relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-gray-500" /></div>
        ) : (
          <div className={`w-full h-full transition-all duration-500 ${!hasPremiumAccess ? 'blur-md opacity-40 select-none pointer-events-none' : ''}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="chart_date" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171a21', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="portfolio_value" name="Value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPortfolio)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* PAYWALL OVERLAY */}
        {!hasPremiumAccess && !loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#1e232b]/50 rounded-xl">
            <div className="bg-[#14171D] p-6 rounded-2xl border border-gray-700 shadow-2xl text-center max-w-sm w-full mx-4">
               <div className="w-12 h-12 bg-steam-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-steam-accent" />
               </div>
               <h4 className="text-white font-bold text-lg mb-2">Pro Analytics Required</h4>
               <p className="text-sm text-gray-400 mb-6">Unlock deep insights into your drop history and advanced portfolio charting.</p>
               <button className="w-full bg-steam-accent hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors">
                 Upgrade to PRO
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};