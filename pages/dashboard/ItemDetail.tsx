import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  DollarSign,
  History,
  Loader2,
  Package,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/display';
import { ItemImage } from '@/components/ui/ItemImage';
import {
  ItemPurchaseBatches,
  type PurchaseBatch,
} from '@/components/item/ItemPurchaseBatches';
import {
  normalizePortfolioItemDetail,
  type PortfolioItemDetail,
} from '@/utils/portfolioRpc';
import {
  chartAxisLineStyle,
  chartAxisTickStyle,
  chartTooltipItemStyle,
  chartTooltipStyle,
  formatChartXAxis,
  formatChartYAxis,
} from '@/utils/chartTheme';

const formatDateTime = (iso: string | null) => {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return '—';
  }
};

const ItemDetail = () => {
  const PERIOD_OPTIONS = ['7D', '1M', '3M', '6M', '1Y', 'ALL'] as const;
  const { itemId } = useParams<{ itemId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as { from?: string; collectionId?: string } | null) ?? null;
  const backTo = navState?.from ?? '/inventory';
  const filterCollectionId = navState?.collectionId;

  const [detail, setDetail] = useState<PortfolioItemDetail | null>(null);
  const [batches, setBatches] = useState<PurchaseBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<(typeof PERIOD_OPTIONS)[number]>('1M');
  const [chartData, setChartData] = useState<Array<{ chart_date: string; price: number }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchBatches = useCallback(async () => {
    if (!user || !itemId) return;
    setBatchesLoading(true);
    try {
      let txQuery = supabase
        .from('transactions')
        .select('id, type, quantity, price, transaction_date')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .in('type', ['BUY', 'DROP'])
        .order('transaction_date', { ascending: false });

      if (filterCollectionId) {
        txQuery = txQuery.eq('collection_id', filterCollectionId);
      }

      const { data: txData, error: txError } = await txQuery;

      if (txError) throw txError;

      if (txData && txData.length > 0) {
        setBatches(
          txData.map((row) => ({
            id: String(row.id),
            type: row.type === 'DROP' ? 'DROP' : 'BUY',
            quantity: Number(row.quantity ?? 0),
            unitPrice: Number(row.price ?? 0),
            date: String(row.transaction_date ?? ''),
          })),
        );
        return;
      }

      let holdQuery = supabase
        .from('portfolio_items')
        .select('id, quantity, buy_price, acquired_at')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .gt('quantity', 0)
        .order('acquired_at', { ascending: false });

      if (filterCollectionId) {
        holdQuery = holdQuery.eq('folder_id', filterCollectionId);
      }

      const { data: holdings, error: holdError } = await holdQuery;

      if (holdError) throw holdError;

      setBatches(
        (holdings ?? []).map((row) => ({
          id: String(row.id),
          type: 'BUY' as const,
          quantity: Number(row.quantity ?? 0),
          unitPrice: Number(row.buy_price ?? 0),
          date: String(row.acquired_at ?? ''),
        })),
      );
    } catch (err) {
      console.error('Error fetching purchase batches:', err);
      setBatches([]);
    } finally {
      setBatchesLoading(false);
    }
  }, [user, itemId, filterCollectionId]);

  const fetchDetail = useCallback(async () => {
    if (!itemId) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase.rpc('get_portfolio_item_detail', {
        p_item_id: itemId,
      });
      if (error) throw error;

      const parsed = normalizePortfolioItemDetail(data);
      if (!parsed?.item_id) {
        setErrorMessage('Item not found in your portfolio.');
        setDetail(null);
        return;
      }
      setDetail(parsed);
    } catch (err) {
      console.error('Error fetching item detail:', err);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Failed to load item details.';
      setErrorMessage(message);
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  const fetchItemChart = useCallback(async () => {
    if (!itemId) return;
    setChartLoading(true);
    try {
      const attempts: Array<Record<string, string>> = [
        { input_item_id: itemId, period_text: chartPeriod },
        { itemID: itemId, period: chartPeriod },
        { p_item_id: itemId, p_period: chartPeriod },
        { item_id: itemId, period: chartPeriod },
      ];

      let rpcData: unknown = null;
      let lastError: unknown = null;

      for (const args of attempts) {
        const { data, error } = await supabase.rpc('get_chart_data', args);
        if (!error) {
          rpcData = data;
          lastError = null;
          break;
        }
        lastError = error;
      }

      if (lastError) throw lastError;

      const rawRows = Array.isArray(rpcData)
        ? rpcData
        : rpcData && typeof rpcData === 'object' && 'data' in rpcData
          ? ((rpcData as { data?: unknown[] }).data ?? [])
          : [];

      const normalized = (rawRows as Array<Record<string, unknown>>)
        .map((row) => {
          const dateCandidate =
            row.chart_date ?? row.date ?? row.timestamp ?? row.price_updated_at ?? row.updated_at;
          const priceCandidate =
            row.price ?? row.value ?? row.market_price ?? row.avg_price ?? row.close ?? row.y;

          const parsedPrice = Number(priceCandidate ?? 0);
          const parsedDate = String(dateCandidate ?? '');
          if (!parsedDate || !Number.isFinite(parsedPrice)) return null;

          return {
            chart_date: parsedDate,
            price: parsedPrice,
          };
        })
        .filter((r): r is { chart_date: string; price: number } => Boolean(r));

      setChartData(normalized);
    } catch (err) {
      console.error('Error fetching item chart:', err);
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  }, [itemId, chartPeriod]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  useEffect(() => {
    fetchItemChart();
  }, [fetchItemChart]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-steam-accent" />
      </div>
    );
  }

  if (errorMessage || !detail) {
    return (
      <div className="text-steam-text animate-fade-in pb-10 max-w-lg mx-auto text-center pt-16">
        <AlertCircle className="w-12 h-12 text-steam-loss mx-auto mb-4" />
        <h1 className="text-xl font-bold mb-2">Could not load item</h1>
        <p className="text-steam-secondary text-sm mb-6">{errorMessage ?? 'Unknown error'}</p>
        <button
          type="button"
          onClick={() => navigate(backTo)}
          className="px-4 py-2 rounded-xl bg-steam-accent text-on-accent text-sm font-bold"
        >
          Go back
        </button>
      </div>
    );
  }

  const isPositiveRoi = detail.roi_percentage >= 0;
  const isPositiveUnrealized = detail.unrealized_profit >= 0;
  const unitMarket = detail.current_market_price;

  return (
    <div className="text-steam-text animate-fade-in pb-10 min-w-0 overflow-x-hidden">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={() => navigate(backTo)}
            className="p-2 bg-steam-card rounded-xl border border-steam-border hover:bg-steam-hover transition-colors shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-steam-secondary" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-steam-text mb-1 line-clamp-2">
              {detail.market_hash_name}
            </h1>
            <p className="text-steam-secondary text-sm">Portfolio item overview</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-steam-card rounded-2xl border border-steam-border shadow-lg p-6 flex flex-col items-center">
          <div className="w-full max-w-[220px] aspect-[4/3] theme-item-preview rounded-xl border border-steam-border flex items-center justify-center p-4 mb-4">
            <ItemImage
              src={detail.icon_url}
              alt={detail.market_hash_name}
              className="max-w-full max-h-full object-contain drop-shadow-lg"
              wrapperClassName="w-full h-full min-h-[100px]"
            />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-steam-tertiary mb-1">
            Market price
          </p>
          <p className="text-2xl font-bold font-mono text-steam-text">{formatCurrency(unitMarket)}</p>
          {detail.last_price_update && (
            <p className="text-xs text-steam-tertiary mt-2">
              Updated {formatDateTime(detail.last_price_update)}
            </p>
          )}
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg">
            <div className="flex items-center gap-2 text-steam-tertiary mb-2">
              <Package className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Owned</span>
            </div>
            <p className="text-2xl font-bold tabular-nums">{detail.owned_quantity}</p>
            <p className="text-xs text-steam-secondary mt-1">
              Avg buy {formatCurrency(detail.avg_buy_price)}
            </p>
          </div>

          <div className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg">
            <div className="flex items-center gap-2 text-steam-tertiary mb-2">
              <Wallet className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Current value</span>
            </div>
            <p className="text-2xl font-bold font-mono tabular-nums">{formatCurrency(detail.current_value)}</p>
            <p className="text-xs text-steam-secondary mt-1">
              Invested {formatCurrency(detail.total_invested)}
            </p>
          </div>

          <div className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg">
            <div className="flex items-center gap-2 text-steam-tertiary mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Unrealized P/L</span>
            </div>
            <p
              className={`text-2xl font-bold font-mono tabular-nums ${
                isPositiveUnrealized ? 'text-steam-profit' : 'text-steam-loss'
              }`}
            >
              {isPositiveUnrealized ? '+' : ''}
              {formatCurrency(detail.unrealized_profit)}
            </p>
            <div
              className={`flex items-center gap-1 text-sm font-bold mt-1 ${
                isPositiveRoi ? 'text-steam-profit' : 'text-steam-loss'
              }`}
            >
              {isPositiveRoi ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {isPositiveRoi ? '+' : ''}
              {detail.roi_percentage.toFixed(2)}% ROI
            </div>
          </div>

          <div className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg">
            <div className="flex items-center gap-2 text-steam-tertiary mb-2">
              <History className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Sell history</span>
            </div>
            <p className="text-2xl font-bold tabular-nums">{detail.history_sold_quantity} sold</p>
            <p
              className={`text-sm font-bold font-mono mt-1 tabular-nums ${
                detail.history_realized_profit >= 0 ? 'text-steam-profit' : 'text-steam-loss'
              }`}
            >
              {detail.history_realized_profit >= 0 ? '+' : ''}
              {formatCurrency(detail.history_realized_profit)} realized
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-steam-card rounded-2xl border border-steam-border shadow-lg overflow-hidden mb-6">
          <div className="p-5 border-b border-steam-border bg-steam-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-steam-secondary">Price chart</h2>
            <div className="flex bg-steam-bg rounded-lg p-1 border border-steam-border/50">
              {PERIOD_OPTIONS.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setChartPeriod(period)}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded transition-colors ${
                    chartPeriod === period
                      ? 'bg-steam-accent text-white shadow-md'
                      : 'text-steam-tertiary hover:text-steam-text'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-5 h-[300px] relative">
            {chartLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-steam-accent animate-spin" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-steam-tertiary text-sm">
                No chart data for selected period.
              </div>
            ) : null}

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 10, left: 8, bottom: 8 }}>
                <CartesianGrid stroke="var(--color-card-border)" strokeOpacity={0.25} vertical={false} />
                <XAxis
                  dataKey="chart_date"
                  tick={chartAxisTickStyle}
                  axisLine={chartAxisLineStyle}
                  tickLine={false}
                  tickFormatter={formatChartXAxis}
                  minTickGap={24}
                />
                <YAxis
                  tick={chartAxisTickStyle}
                  axisLine={chartAxisLineStyle}
                  tickLine={false}
                  tickFormatter={formatChartYAxis}
                  width={52}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(Number(value ?? 0)), 'Price']}
                  labelFormatter={(label) => `Date: ${formatChartXAxis(String(label))}`}
                  contentStyle={chartTooltipStyle}
                  itemStyle={chartTooltipItemStyle}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="var(--color-accent)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <ItemPurchaseBatches
          batches={batches}
          loading={batchesLoading}
          scopeLabel={filterCollectionId ? 'this collection' : 'all collections'}
        />
      </div>

      <div className="bg-steam-card rounded-2xl border border-steam-border shadow-lg overflow-hidden">
        <div className="p-5 border-b border-steam-border bg-steam-elevated">
          <h2 className="text-sm font-bold uppercase tracking-wider text-steam-secondary">Summary</h2>
        </div>
        <dl className="divide-y divide-steam-border/50">
          {[
            ['Market hash name', detail.market_hash_name],
            ['Quantity owned', String(detail.owned_quantity)],
            ['Unit market price', formatCurrency(unitMarket)],
            ['Total invested', formatCurrency(detail.total_invested)],
            ['Current value', formatCurrency(detail.current_value)],
            [
              'Unrealized profit',
              `${detail.unrealized_profit >= 0 ? '+' : ''}${formatCurrency(detail.unrealized_profit)}`,
            ],
            ['ROI', `${detail.roi_percentage >= 0 ? '+' : ''}${detail.roi_percentage.toFixed(2)}%`],
            ['Units sold (all time)', String(detail.history_sold_quantity)],
            [
              'Realized profit (all time)',
              `${detail.history_realized_profit >= 0 ? '+' : ''}${formatCurrency(detail.history_realized_profit)}`,
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-5 py-3.5 text-sm"
            >
              <dt className="text-steam-tertiary font-medium">{label}</dt>
              <dd className="font-bold text-steam-text text-right break-all">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default ItemDetail;
