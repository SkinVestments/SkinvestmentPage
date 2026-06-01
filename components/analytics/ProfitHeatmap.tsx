import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '@/utils/display';
import { CalendarDays, Grid3X3 } from 'lucide-react';
import { HeatmapGridSkeleton } from './AnalyticsSkeletons';

type HeatmapUnit = 'DOW' | 'MONTH';
type HeatmapMetric = 'profit' | 'revenue' | 'trades';

interface HeatmapRow {
  time_unit: HeatmapUnit;
  unit_value: number;
  total_revenue: number;
  total_profit: number;
  trades_count: number;
}

interface HeatmapCell {
  total_revenue: number;
  total_profit: number;
  trades_count: number;
}

const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

const METRIC_OPTIONS: { id: HeatmapMetric; label: string }[] = [
  { id: 'profit', label: 'Profit' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'trades', label: 'Trades' },
];

const emptyCell = (): HeatmapCell => ({
  total_revenue: 0,
  total_profit: 0,
  trades_count: 0,
});

const getMetricValue = (cell: HeatmapCell, metric: HeatmapMetric): number => {
  if (metric === 'profit') return cell.total_profit;
  if (metric === 'revenue') return cell.total_revenue;
  return cell.trades_count;
};

const formatMetric = (value: number, metric: HeatmapMetric): string => {
  if (metric === 'trades') return String(value);
  return formatCurrency(value);
};

interface CellVisual {
  background: string;
  borderColor: string;
  intensity: number;
}

const getCellVisual = (value: number, maxAbs: number, metric: HeatmapMetric): CellVisual => {
  const neutral: CellVisual = {
    background: 'var(--color-surface-elevated)',
    borderColor: 'color-mix(in srgb, var(--color-card-border) 70%, transparent)',
    intensity: 0,
  };

  if (maxAbs <= 0 || value === 0) return neutral;

  if (metric === 'profit') {
    const t = Math.min(1, Math.abs(value) / maxAbs);
    const mix = 0.34 + t * 0.58;
    const accent = value >= 0 ? 'var(--color-profit)' : 'var(--color-loss)';
    return {
      background: `color-mix(in srgb, ${accent} ${mix * 100}%, var(--color-surface-elevated))`,
      borderColor: `color-mix(in srgb, ${accent} ${48 + t * 42}%, transparent)`,
      intensity: t,
    };
  }

  const t = Math.min(1, value / maxAbs);
  const mix = 0.3 + t * 0.62;
  const accent = metric === 'revenue' ? '#2563eb' : '#9333ea';
  return {
    background: `color-mix(in srgb, ${accent} ${mix * 100}%, var(--color-surface-elevated))`,
    borderColor: `color-mix(in srgb, ${accent} ${44 + t * 46}%, transparent)`,
    intensity: t,
  };
};

const normalizeRow = (row: Record<string, unknown>): HeatmapRow => ({
  time_unit: row.time_unit === 'MONTH' ? 'MONTH' : 'DOW',
  unit_value: Number(row.unit_value ?? 0),
  total_revenue: Number(row.total_revenue ?? 0),
  total_profit: Number(row.total_profit ?? 0),
  trades_count: Number(row.trades_count ?? 0),
});

const buildGrid = (
  rows: HeatmapRow[],
  unit: HeatmapUnit,
  slotCount: number,
): Map<number, HeatmapCell> => {
  const map = new Map<number, HeatmapCell>();
  for (let i = 1; i <= slotCount; i++) map.set(i, emptyCell());

  rows
    .filter((r) => r.time_unit === unit && r.unit_value >= 1 && r.unit_value <= slotCount)
    .forEach((r) => {
      map.set(r.unit_value, {
        total_revenue: r.total_revenue,
        total_profit: r.total_profit,
        trades_count: r.trades_count,
      });
    });

  return map;
};

interface HeatmapGridProps {
  title: string;
  labels: readonly string[];
  cells: Map<number, HeatmapCell>;
  metric: HeatmapMetric;
  columnsClass: string;
}

/** Readable label + value colors on tinted cells (no background chips). */
const getHeatmapTextColors = (
  hasData: boolean,
  metric: HeatmapMetric,
  value: number,
  intensity: number,
): { label: string; value: string } => {
  if (!hasData) {
    return { label: 'text-steam-tertiary', value: 'text-steam-tertiary' };
  }

  const hot = intensity > 0.15;

  if (metric === 'profit') {
    if (value > 0) {
      return hot
        ? { label: 'text-emerald-950 dark:text-emerald-50', value: 'text-emerald-900 dark:text-emerald-100' }
        : { label: 'text-steam-text', value: 'text-steam-profit' };
    }
    if (value < 0) {
      return hot
        ? { label: 'text-red-950 dark:text-red-50', value: 'text-red-900 dark:text-red-100' }
        : { label: 'text-steam-text', value: 'text-steam-loss' };
    }
  }

  if (hot) {
    if (metric === 'revenue') {
      return { label: 'text-blue-950 dark:text-blue-50', value: 'text-blue-900 dark:text-blue-100' };
    }
    return { label: 'text-purple-950 dark:text-purple-50', value: 'text-purple-900 dark:text-purple-100' };
  }

  return { label: 'text-steam-text', value: 'text-steam-text' };
};

const HeatmapGrid = ({ title, labels, cells, metric, columnsClass }: HeatmapGridProps) => {
  const values = labels.map((_, i) => getMetricValue(cells.get(i + 1) ?? emptyCell(), metric));
  const maxAbs =
    metric === 'profit'
      ? Math.max(0, ...values.map((v) => Math.abs(v)))
      : Math.max(0, ...values);

  return (
    <div>
      <h4 className="text-xs font-bold text-steam-secondary uppercase tracking-wider mb-3">
        {title}
      </h4>
      <div className={`grid gap-2 ${columnsClass}`}>
        {labels.map((label, index) => {
          const cell = cells.get(index + 1) ?? emptyCell();
          const value = getMetricValue(cell, metric);
          const hasData = cell.trades_count > 0;
          const visual = getCellVisual(value, maxAbs, metric);
          const isHot = hasData && visual.intensity > 0.2;
          const textColors = getHeatmapTextColors(hasData, metric, value, visual.intensity);

          return (
            <div
              key={`${title}-${label}`}
              className={`rounded-xl p-2 sm:p-3 min-h-[72px] flex flex-col justify-between transition-colors border ${
                isHot ? 'shadow-sm' : ''
              }`}
              style={{
                background: visual.background,
                borderColor: visual.borderColor,
              }}
              title={
                hasData
                  ? `${label}: ${formatMetric(value, metric)} · ${cell.trades_count} trade${cell.trades_count === 1 ? '' : 's'}`
                  : `${label}: no sells`
              }
            >
              <span
                className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wide ${textColors.label}`}
              >
                {label}
              </span>
              <span className={`text-sm font-bold tabular-nums ${textColors.value}`}>
                {hasData ? formatMetric(value, metric) : '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ProfitHeatmap = () => {
  const { user } = useAuth();
  const [metric, setMetric] = useState<HeatmapMetric>('profit');
  const [rows, setRows] = useState<HeatmapRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchHeatmap = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase.rpc('get_profit_heatmap');
      if (error) throw error;

      const parsed = (Array.isArray(data) ? data : []).map((row) =>
        normalizeRow(row as Record<string, unknown>),
      );
      setRows(parsed);
    } catch (err) {
      console.error('Error fetching profit heatmap:', err);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Failed to load profit heatmap';
      setErrorMessage(message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHeatmap();
  }, [fetchHeatmap]);

  const dowCells = useMemo(() => buildGrid(rows, 'DOW', 7), [rows]);
  const monthCells = useMemo(() => buildGrid(rows, 'MONTH', 12), [rows]);

  const totalTrades = useMemo(
    () => rows.reduce((sum, r) => sum + r.trades_count, 0),
    [rows],
  );

  return (
    <div className="bg-steam-card p-6 rounded-2xl border border-steam-border shadow-lg h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-steam-secondary" />
          <div>
            <h3 className="font-bold text-steam-text">Profit Heatmap</h3>
            <p className="text-xs text-steam-secondary mt-0.5">
              When you sell best — by day of week and month (all-time SELLs).
            </p>
          </div>
        </div>

        <div className="flex bg-steam-bg rounded-lg p-1 border border-steam-border/50 self-start">
          {METRIC_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setMetric(opt.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                metric === opt.id
                  ? 'bg-steam-accent text-white shadow-md'
                  : 'text-steam-tertiary hover:text-steam-text'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <HeatmapGridSkeleton />
      ) : errorMessage ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[200px] gap-3">
          <p className="text-sm text-red-400 font-medium">{errorMessage}</p>
          <button
            type="button"
            onClick={fetchHeatmap}
            className="text-xs font-bold text-steam-accent hover:underline"
          >
            Retry
          </button>
        </div>
      ) : totalTrades === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[200px] gap-2">
          <CalendarDays className="w-8 h-8 text-steam-tertiary" />
          <p className="text-steam-secondary font-medium">No sell transactions yet</p>
          <p className="text-xs text-steam-tertiary">Log sells to see when you profit most.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <HeatmapGrid
            title="Day of week"
            labels={DOW_LABELS}
            cells={dowCells}
            metric={metric}
            columnsClass="grid-cols-4 sm:grid-cols-7"
          />
          <HeatmapGrid
            title="Month"
            labels={MONTH_LABELS}
            cells={monthCells}
            metric={metric}
            columnsClass="grid-cols-4 sm:grid-cols-6"
          />
        </div>
      )}
    </div>
  );
};
