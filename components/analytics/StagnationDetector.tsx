import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '@/utils/display';
import { AlertCircle, Clock, Moon, TrendingUp } from 'lucide-react';
import { StagnationListSkeleton } from './AnalyticsSkeletons';
import { ItemImage } from '@/components/ui/ItemImage';

export interface StagnantItem {
  skin_id: string;
  market_hash_name: string;
  icon_url: string | null;
  folder_id: string | null;
  quantity: number;
  avg_buy_price: number;
  total_invested: number;
  current_total_value: number;
  last_activity: string;
  days_stagnant: number;
}

const THRESHOLD_OPTIONS = [
  { label: '90 days', value: 90 },
  { label: '180 days', value: 180 },
  { label: '365 days', value: 365 },
] as const;

const STEAM_ICON_CDN = 'https://community.cloudflare.steamstatic.com/economy/image/';

const resolveIconUrl = (raw: unknown): string | null => {
  if (raw == null || raw === '') return null;
  const s = String(raw).trim();
  if (!s) return null;
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  return `${STEAM_ICON_CDN}${s.replace(/^\//, '')}`;
};

const formatLastActivity = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
      new Date(iso),
    );
  } catch {
    return '—';
  }
};

export const StagnationDetector = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<StagnantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [daysThreshold, setDaysThreshold] = useState(180);

  const normalizeRow = (row: Record<string, unknown>): StagnantItem => ({
    skin_id: String(row.skin_id ?? ''),
    market_hash_name: String(row.market_hash_name ?? 'Unknown item'),
    icon_url: resolveIconUrl(row.icon_url ?? row.icon),
    folder_id: row.folder_id ? String(row.folder_id) : null,
    quantity: Number(row.quantity ?? 0),
    avg_buy_price: Number(row.avg_buy_price ?? 0),
    total_invested: Number(row.total_invested ?? 0),
    current_total_value: Number(row.current_total_value ?? 0),
    last_activity: String(row.last_activity ?? ''),
    days_stagnant: Number(row.days_stagnant ?? 0),
  });

  const fetchStagnant = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase.rpc('get_stagnant_items', {
        p_days_threshold: daysThreshold,
      });

      if (error) throw error;

      const rows = (Array.isArray(data) ? data : []).map((row) =>
        normalizeRow(row as Record<string, unknown>),
      );
      rows.sort((a, b) => b.days_stagnant - a.days_stagnant);
      setItems(rows);
    } catch (err) {
      console.error('Error fetching stagnant items:', err);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Failed to load stagnant items';

      if (message.includes('does not match function result type')) {
        setErrorMessage(
          'RPC type mismatch on last_activity: change it to timestamptz in get_stagnant_items (see supabase/fix_get_stagnant_items.sql).',
        );
      } else {
        setErrorMessage(message);
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user, daysThreshold]);

  useEffect(() => {
    fetchStagnant();
  }, [fetchStagnant]);

  const summary = useMemo(() => {
    const count = items.length;
    const tiedCapital = items.reduce((s, i) => s + Number(i.total_invested ?? 0), 0);
    const currentValue = items.reduce((s, i) => s + Number(i.current_total_value ?? 0), 0);
    const unrealized = currentValue - tiedCapital;
    return { count, tiedCapital, currentValue, unrealized };
  }, [items]);

  const handleRowClick = (item: StagnantItem) => {
    if (item.folder_id) {
      navigate(`/collection/${item.folder_id}`);
    }
  };

  return (
    <div className="bg-steam-card rounded-2xl border border-steam-border shadow-lg flex flex-col min-h-[420px] h-full">
      <div className="p-4 sm:p-6 border-b border-steam-border/50 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-steam-text text-sm sm:text-base">Stagnation Detector</h3>
              <p className="text-xs text-steam-secondary mt-1 leading-relaxed">
                Assets with no activity for {daysThreshold}+ days. Spot dead money before it drags your ROI.
              </p>
            </div>
          </div>

          <div className="flex bg-steam-elevated rounded-lg p-1 border border-steam-border shrink-0 self-start">
            {THRESHOLD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDaysThreshold(opt.value)}
                className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-md transition-colors whitespace-nowrap ${
                  daysThreshold === opt.value
                    ? 'bg-steam-card text-steam-text shadow-md border border-steam-border'
                    : 'text-steam-tertiary hover:text-steam-text'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {!loading && items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            <div className="theme-subtle rounded-xl px-3 py-2 border border-steam-border/50">
              <p className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary">Stagnant items</p>
              <p className="text-lg font-bold text-steam-text tabular-nums">{summary.count}</p>
            </div>
            <div className="theme-subtle rounded-xl px-3 py-2 border border-steam-border/50">
              <p className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary">Capital tied</p>
              <p className="text-lg font-bold text-steam-text tabular-nums">{formatCurrency(summary.tiedCapital)}</p>
            </div>
            <div className="theme-subtle rounded-xl px-3 py-2 border border-steam-border/50 col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary">Unrealized P/L</p>
              <p
                className={`text-lg font-bold tabular-nums ${
                  summary.unrealized >= 0 ? 'text-steam-profit' : 'text-steam-loss'
                }`}
              >
                {summary.unrealized >= 0 ? '+' : ''}
                {formatCurrency(summary.unrealized)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 p-4 sm:p-6 pt-0 sm:pt-0">
        {loading ? (
          <StagnationListSkeleton />
        ) : errorMessage ? (
          <div className="flex flex-col items-center justify-center text-center h-48 px-4">
            <AlertCircle className="w-10 h-10 text-steam-loss mb-3" />
            <p className="text-steam-secondary font-bold">Could not load data</p>
            <p className="text-steam-tertiary text-xs mt-2 max-w-sm leading-relaxed">{errorMessage}</p>
            <button
              type="button"
              onClick={fetchStagnant}
              className="mt-4 px-4 py-2 rounded-lg bg-steam-accent text-on-accent text-xs font-bold"
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-48 px-4">
            <TrendingUp className="w-10 h-10 text-steam-profit mb-3 opacity-80" />
            <p className="text-steam-secondary font-bold">No stagnant assets</p>
            <p className="text-steam-tertiary text-xs mt-1 max-w-xs">
              Everything in your portfolio had activity within the last {daysThreshold} days.
            </p>
          </div>
        ) : (
          <ul className="space-y-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
            {items.map((item) => {
              const invested = Number(item.total_invested ?? 0);
              const current = Number(item.current_total_value ?? 0);
              const roi = invested > 0 ? ((current - invested) / invested) * 100 : 0;
              const clickable = Boolean(item.folder_id);

              return (
                <li key={item.skin_id}>
                  <button
                    type="button"
                    onClick={() => handleRowClick(item)}
                    disabled={!clickable}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border border-steam-border/60 theme-subtle text-left transition-all ${
                      clickable
                        ? 'hover:border-steam-accent/40 hover:bg-steam-hover cursor-pointer'
                        : 'cursor-default'
                    }`}
                  >
                    <div className="relative w-14 h-11 shrink-0 theme-item-preview rounded-md flex items-center justify-center p-1 border border-steam-border/50">
                      <ItemImage
                        src={item.icon_url}
                        alt={item.market_hash_name}
                        className="max-w-full max-h-full object-contain drop-shadow-sm"
                        wrapperClassName="w-full h-full"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-steam-text truncate">{item.market_hash_name}</p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[10px] text-steam-tertiary">
                        <span>Qty {item.quantity}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {item.days_stagnant}d idle
                        </span>
                        <span>·</span>
                        <span>Last: {formatLastActivity(item.last_activity)}</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-steam-text tabular-nums">{formatCurrency(current)}</p>
                      <p
                        className={`text-[10px] font-bold tabular-nums ${
                          roi >= 0 ? 'text-steam-profit' : 'text-steam-loss'
                        }`}
                      >
                        {roi >= 0 ? '+' : ''}
                        {roi.toFixed(1)}%
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
