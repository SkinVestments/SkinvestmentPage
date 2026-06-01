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

const cellBackground = (value: number, maxAbs: number, metric: HeatmapMetric): string => {
  if (maxAbs <= 0 || value === 0) return 'var(--color-surface)';

  if (metric === 'profit') {
    const t = Math.min(1, Math.abs(value) / maxAbs);
    const alpha = 0.12 + t * 0.55;
    return value >= 0
      ? `color-mix(in srgb, var(--color-profit) ${alpha * 100}%, var(--color-surface))`
      : `color-mix(in srgb, var(--color-loss) ${alpha * 100}%, var(--color-surface))`;
  }

  const t = Math.min(1, value / maxAbs);
  const alpha = 0.1 + t * 0.5;
  const color = metric === 'revenue' ? '#3b82f6' : '#a855f7';
  return `color-mix(in srgb, ${color} ${alpha * 100}%, var(--color-surface))`;
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

const HeatmapGrid = ({ title, labels, cells, metric, columnsClass }: HeatmapGridProps) => {
  const values = labels.map((_, i) => getMetricValue(cells.get(i + 1) ?? emptyCell(), metric));
  const maxAbs =
    metric === 'profit'
      ? Math.max(0, ...values.map((v) => Math.abs(v)))
      : Math.max(0, ...values);

  return (
    <div>
      <h4 className="text-xs font-bold text-steam-tertiary uppercase tracking-wider mb-3">
        {title}
      </h4>
      <div className={`grid gap-2 ${columnsClass}`}>
        {labels.map((label, index) => {
          const cell = cells.get(index + 1) ?? emptyCell();
          const value = getMetricValue(cell, metric);
          const hasData = cell.trades_count > 0;

          return (
            <div
              key={`${title}-${label}`}
              className="rounded-xl p-2 sm:p-3 min-h-[72px] flex flex-col justify-between transition-colors"
              style={{ background: cellBackground(value, maxAbs, metric) }}
              title={
                hasData
                  ? `${label}: ${formatMetric(value, metric)} · ${cell.trades_count} trade${cell.trades_count === 1 ? '' : 's'}`
                  : `${label}: no sells`
              }
            >
              <span className="text-[10px] font-bold text-steam-tertiary uppercase">{label}</span>
              <span
                className={`text-sm font-bold tabular-nums ${
                  metric === 'profit' && value > 0
                    ? 'text-green-400'
                    : metric === 'profit' && value < 0
                      ? 'text-red-400'
                      : 'text-steam-text'
                }`}
              >
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
