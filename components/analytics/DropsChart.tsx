import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { AreaChartSkeleton } from './AnalyticsSkeletons';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { ProAnalyticsPaywall } from './ProAnalyticsPaywall';
import {
  chartAxisLineStyle,
  chartAxisTickStyle,
  chartProfitStroke,
  chartTooltipItemStyle,
  chartTooltipStyle,
  formatChartXAxis,
  formatChartYAxis,
} from '@/utils/chartTheme';
import { formatCurrency } from '@/utils/display';

const DROPS_RANGE_OPTIONS = [
  { value: '1M', label: '1 Month' },
  { value: '3M', label: '3 Months' },
  { value: '6M', label: '6 Months' },
  { value: '1Y', label: '1 Year' },
  { value: 'ALL', label: 'All Time' },
];

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
    <div className="dashboard-card-hero p-6 h-full relative overflow-hidden flex flex-col">
      <div className="flex justify-between items-center gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-2 min-w-0">
          <TrendingUp className="w-5 h-5 text-steam-secondary shrink-0" />
          <h3 className="font-bold text-steam-text truncate">Drops Performance</h3>
        </div>
        
        <CustomSelect
          value={timeRange}
          onChange={setTimeRange}
          options={DROPS_RANGE_OPTIONS}
          disabled={!hasPremiumAccess}
          aria-label="Drops chart period"
          className="w-36 shrink-0"
        />
      </div>

      <div className="w-full min-h-[300px] relative">
        {loading ? (
          <AreaChartSkeleton />
        ) : (
          <div className={`w-full min-h-[300px] transition-all duration-500 ${!hasPremiumAccess ? 'blur-md opacity-40 select-none pointer-events-none' : ''}`}>
            <ResponsiveContainer width="100%" height={300} minWidth={0}>
              <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-profit)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-profit)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="chart_date"
                  tick={chartAxisTickStyle}
                  axisLine={chartAxisLineStyle}
                  tickLine={false}
                  tickFormatter={formatChartXAxis}
                  minTickGap={28}
                />
                <YAxis
                  tick={chartAxisTickStyle}
                  axisLine={chartAxisLineStyle}
                  tickLine={false}
                  width={52}
                  tickFormatter={formatChartYAxis}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Value']}
                  labelFormatter={(label) => `Date: ${formatChartXAxis(String(label))}`}
                  contentStyle={chartTooltipStyle}
                  itemStyle={chartTooltipItemStyle}
                  labelStyle={{ color: 'var(--color-text-secondary)', marginBottom: '4px' }}
                  cursor={{ stroke: 'var(--color-card-border)', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="portfolio_value" name="Value" stroke={chartProfitStroke} strokeWidth={3} fillOpacity={1} fill="url(#colorPortfolio)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {!hasPremiumAccess && !loading && (
          <ProAnalyticsPaywall
            from="analytics_drops"
            description="Unlock deep insights into your drop history and advanced portfolio charting."
          />
        )}
      </div>
    </div>
  );
};