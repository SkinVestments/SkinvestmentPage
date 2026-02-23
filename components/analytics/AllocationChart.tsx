import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Loader2, PieChart as PieIcon } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];

export const AllocationChart = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllocation = async () => {
      if (!user) return;
      try {
        const { data: allocData, error } = await supabase.rpc('get_portfolio_allocation', {
          p_user_id: user.id
        });

        if (error) throw error;

        if (allocData && allocData.length > 0) {
          
          const formattedData = allocData.map((item: any) => {
            // ZMIANA: Zmieniliśmy item.cat_value na item.total_value zgodnie z bazą!
            const rawValue = item.total_value !== undefined ? item.total_value : 0;
            const stringValue = String(rawValue).replace(/[^0-9.-]+/g, ""); 
            const parsedValue = parseFloat(stringValue);

            return {
              // ZMIANA: Zmieniliśmy item.cat_name na item.category zgodnie z bazą!
              name: item.category || 'Other', 
              value: isNaN(parsedValue) ? 0 : parsedValue, 
              percentage: parseFloat(item.percentage) || 0
            };
          });

          // Filtrujemy kategorie, które mają wartość > 0
          const validData = formattedData.filter(d => d.value > 0);
          setData(validData);
        }
      } catch (error) {
        console.error('Error fetching allocation:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllocation();
  }, [user]);

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-500 w-8 h-8" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-[#1e232b] p-6 rounded-2xl border border-gray-800 shadow-lg h-full flex flex-col justify-center items-center text-center">
         <PieIcon className="w-8 h-8 text-gray-600 mb-3" />
         <p className="text-gray-400 font-bold">No assets found</p>
         <p className="text-gray-500 text-xs mt-1">Add items to your portfolio to see allocation.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1e232b] p-6 rounded-2xl border border-gray-800 shadow-lg h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <PieIcon className="w-5 h-5 text-gray-400" />
        <h3 className="font-bold text-white">Portfolio Allocation</h3>
      </div>
      
      <div className="flex-1 min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
              contentStyle={{ backgroundColor: '#171a21', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#e5e7eb', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Środek wykresu */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
           <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Categories</span>
           <span className="text-white font-bold text-2xl">{data.length}</span>
        </div>
      </div>

      {/* Legenda pod wykresem */}
      <div className="flex flex-col gap-3 mt-4">
        {data.map((item, index) => (
          <div key={`legend-${item.name}-${index}`} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-gray-300 font-medium capitalize">{item.name}</span>
            </div>
            <span className="font-mono text-gray-400">{item.percentage.toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};