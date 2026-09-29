import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  DollarSign,
  Activity,
  Wallet,
  Flame,
  Dice5,
  AlertCircle,
} from 'lucide-react';
import { SummaryCardsSkeleton } from './AnalyticsSkeletons';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const { data: currentData, error: currentError } = await supabase.rpc(
        'get_portfolio_current_values',
        { period_text: 'ALL' },
      );
      if (currentError) throw currentError;

      const { data: statsData, error: statsError } = await supabase.rpc('get_portfolio_stats', {
        p_user_id: user.id,
      });
      if (statsError) throw statsError;

      const { data: dropsData, error: dropsError } = await supabase.rpc(
        'get_user_drops_analytics',
      );
      if (dropsError) throw dropsError;

      const { data: luckData, error: luckError } = await supabase.rpc('get_user_luck_score', {
        period_text: 'ALL',
      });
      if (luckError) throw luckError;

      const current = normalizePortfolioCurrentValues(currentData);
      if (!current) throw new Error('Could not read portfolio values');
      setData(current);

      const portfolioStats = normalizePortfolioStats(statsData);
      if (!portfolioStats) throw new Error('Could not read portfolio stats');
      setStats(portfolioStats);

      setDropsAnalytics({
        current_streak: Number(
          (dropsData as { current_streak?: number } | null)?.current_streak ?? 0,
        ),
      });

      const r = (luckData ?? {}) as Record<string, unknown>;
      setLuck({
        luck_score: Number(r.luck_score ?? 0),
        label: String(r.label ?? 'Average'),
        drops_count: Number(r.drops_count ?? 0),
        user_median_drop_value:
          r.user_median_drop_value == null ? undefined : Number(r.user_median_drop_value),
        global_median_drop_value:
          r.global_median_drop_value == null ? undefined : Number(r.global_median_drop_value),
      });
    } catch (error) {
      console.error('Error fetching summary:', error);
      setData(null);
      setStats(null);
      setDropsAnalytics(null);
      setLuck(null);
      setErrorMessage('Could not load summary stats.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <SummaryCardsSkeleton />;
  }

  if (errorMessage) {
    return (
      <div className="mb-8 rounded-2xl theme-alert-error p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-steam-loss shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-steam-text">Summary unavailable</p>
            <p className="text-xs text-steam-secondary mt-1">{errorMessage}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void fetchStats()}
          className="shrink-0 text-xs font-bold text-steam-accent hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const streakWeeks = dropsAnalytics?.current_streak ?? 0;
  const luckScore = luck?.luck_score ?? 0;
  const luckLabel = luck?.label ?? '-';
  const luckDropsCount = luck?.drops_count ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="dashboard-card p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-steam-accent/10 rounded-xl text-steam-accent">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="dashboard-label">
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

      <div className="dashboard-card p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-green-500/10 rounded-xl text-steam-profit">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="dashboard-label">
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

      <div className="dashboard-card p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-steam-elevated rounded-xl text-steam-secondary">
            <DollarSign className="w-6 h-6" />
          </div>
          <span className="dashboard-label">
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

      <div className="dashboard-card p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-steam-warning/10 rounded-xl text-steam-warning">
            <Activity className="w-6 h-6" />
          </div>
          <span className="dashboard-label">
            Transactions
          </span>
        </div>
        <h3 className="text-2xl font-bold text-steam-text mb-1">
          {stats?.total_transactions || 0}
        </h3>
        <p className="text-xs text-steam-secondary">
          Total Earned:{' '}
          <span className="text-steam-profit">
            {formatCurrency(stats?.total_earned)}
          </span>
        </p>
      </div>

      <div className="dashboard-card p-5 md:col-span-1 lg:col-span-2">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-steam-accent/10 rounded-xl text-steam-accent">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="dashboard-label">
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

      <div className="dashboard-card p-5 md:col-span-1 lg:col-span-2">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-3 bg-steam-profit/10 rounded-xl text-steam-profit shrink-0">
              <Dice5 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="dashboard-label">
                Luck Score
              </span>
              <p className="text-xs text-steam-secondary mt-0.5">
                Based on your median drop value vs global median (period: ALL).
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-steam-tertiary tabular-nums shrink-0 ml-2">
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
          <div className="w-28 sm:w-40 shrink-0">
            <div className="h-2 rounded-full bg-steam-bg overflow-hidden theme-progress-track">
              <div
                className="h-full bg-steam-profit"
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