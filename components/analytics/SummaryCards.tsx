import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, DollarSign, Activity, Wallet, Loader2, Flame, Dice5 } from 'lucide-react';
import { formatCurrency } from '@/utils/display';
import {
  normalizePortfolioCurrentValues,
  normalizePortfolioStats,
  type PortfolioStats,
} from '@/utils/portfolioRpc';

interface DropsAnalytics {
  current_streak: number;
}

interface LuckScore {
  luck_score: number;
  label: string;
  drops_count: number;
  user_median_drop_value?: number;
  global_median_drop_value?: number;
}

export const SummaryCards = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [dropsAnalytics, setDropsAnalytics] = useState<DropsAnalytics | null>(null);
  const [luck, setLuck] = useState<LuckScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data: currentData, error: currentError } = await supabase.rpc(
          'get_portfolio_current_values',
          { period_text: 'ALL' }
        );
        if (currentError) throw currentError;

        const { data: statsData, error: statsError } = await supabase.rpc('get_portfolio_stats', {
          p_user_id: user.id,
        });
        if (statsError) throw statsError;

        const { data: dropsData, error: dropsError } = await supabase.rpc(
          'get_user_drops_analytics'
        );
        if (dropsError) throw dropsError;

        const { data: luckData, error: luckError } = await supabase.rpc('get_user_luck_score', {
          period_text: 'ALL',
        });
        if (luckError) throw luckError;

        const current = normalizePortfolioCurrentValues(currentData);
        if (current) setData(current);

        const portfolioStats = normalizePortfolioStats(statsData);
        if (portfolioStats) setStats(portfolioStats);

        if (dropsData) {
          setDropsAnalytics({
            current_streak: Number(
              (dropsData as { current_streak?: number }).current_streak ?? 0
            ),
          });
        }

        if (luckData) {
          const r = luckData as Record<string, unknown>;
          setLuck({
            luck_score: Number(r.luck_score ?? 0),
            label: String(r.label ?? 'Average'),
            drops_count: Number(r.drops_count ?? 0),
            user_median_drop_value:
              r.user_median_drop_value == null ? undefined : Number(r.user_median_drop_value),
            global_median_drop_value:
              r.global_median_drop_value == null ? undefined : Number(r.global_median_drop_value),
          });
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-steam-accent w-8 h-8" />
      </div>
    );
  }

  const streakWeeks = dropsAnalytics?.current_streak ?? 0;
  const luckScore = luck?.luck_score ?? 0;
  const luckLabel = luck?.label ?? '—';
  const luckDropsCount = luck?.drops_count ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-steam-tertiary uppercase tracking-wider">
            Total Value
          </span>
        </div>
        <h3 className="text-2xl font-bold text-steam-text mb-1">
          {formatCurrency(data?.total_portfolio_value)}
        </h3>
        <p className="text-xs text-steam-secondary">
          Inventory: {formatCurrency(data?.inventory_value)}
        </p>
      </div>

      <div className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-steam-tertiary uppercase tracking-wider">
            All-Time ROI
          </span>
        </div>
        <h3 className="text-2xl font-bold text-steam-text mb-1">
          {data?.period_roi_percentage >= 0 ? '+' : ''}
          {data?.period_roi_percentage}%
        </h3>
        <p className="text-xs text-steam-secondary">
          Profit: {formatCurrency(data?.period_gain_value)}
        </p>
      </div>

      <div className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-steam-tertiary uppercase tracking-wider">
            Total Invested
          </span>
        </div>
        <h3 className="text-2xl font-bold text-steam-text mb-1">
          {formatCurrency(stats?.total_invested)}
        </h3>
        <p className="text-xs text-steam-secondary">
          Deposited: {formatCurrency(data?.deposited)}
        </p>
      </div>

      <div className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
            <Activity className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-steam-tertiary uppercase tracking-wider">
            Transactions
          </span>
        </div>
        <h3 className="text-2xl font-bold text-steam-text mb-1">
          {stats?.total_transactions || 0}
        </h3>
        <p className="text-xs text-steam-secondary">
          Total Earned:{' '}
          <span className="text-green-400">
            {formatCurrency(stats?.total_earned)}
          </span>
        </p>
      </div>

      <div className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg md:col-span-2 lg:col-span-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-steam-tertiary uppercase tracking-wider">
                Drop Streak
              </span>
              <p className="text-xs text-steam-secondary mt-0.5">
                Consecutive weeks with at least one logged drop (Wed → Wed).
              </p>
            </div>
          </div>
        </div>
        <h3 className="text-3xl font-bold text-steam-text mb-1">
          {streakWeeks} week{streakWeeks === 1 ? '' : 's'}
        </h3>
      </div>

      <div className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg md:col-span-2 lg:col-span-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
              <Dice5 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-steam-tertiary uppercase tracking-wider">
                Luck Score
              </span>
              <p className="text-xs text-steam-secondary mt-0.5">
                Based on your median drop value vs global median (period: ALL).
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-steam-tertiary tabular-nums">
            Drops: {luckDropsCount}
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-3xl font-bold text-steam-text leading-none">
              {Number.isFinite(luckScore) ? luckScore.toFixed(1) : '0.0'}
            </h3>
            <p className="text-xs text-steam-secondary mt-1">
              {luckLabel}
            </p>
          </div>
          <div className="w-40">
            <div className="h-2 rounded-full bg-steam-bg border border-steam-border overflow-hidden">
              <div
                className="h-full bg-cyan-400"
                style={{ width: `${Math.max(0, Math.min(100, luckScore))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-steam-tertiary mt-1 font-medium">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};