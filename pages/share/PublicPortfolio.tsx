import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Calendar, Loader2, Package, PieChart as PieIcon, TrendingUp, User, Wallet } from 'lucide-react';
import { usePageSeo } from '@/hooks/usePageSeo';
import { ItemImage } from '@/components/ui/ItemImage';
import { GetAppButton } from '@/components/GetAppButton';
import { formatCurrency, getRarityStyle } from '@/utils/display';
import {
  chartAxisLineStyle,
  chartAxisTickStyle,
  chartTooltipItemStyle,
  chartTooltipStyle,
  formatChartXAxis,
  formatChartYAxis,
} from '@/utils/chartTheme';
import {
  fetchPublicPortfolio,
  fetchPublicPortfolioHistory,
  sharePath,
} from '@/utils/portfolioShare';
import type {
  PublicPortfolioHistoryItem,
  PublicPortfolioPayload,
} from '@/types/portfolioShare';
import { DEFAULT_SHARE_VISIBILITY } from '@/types/portfolioShare';

const CATEGORY_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280', '#06b6d4'];
const HISTORY_PAGE_SIZE = 15;

const PublicPortfolioPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<PublicPortfolioPayload | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<PublicPortfolioHistoryItem[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(false);

  usePageSeo({
    title: data
      ? `${data.display_name}'s Portfolio — Skinvestments`
      : 'Shared Portfolio — Skinvestments',
    description:
      'View a shared CS2 skin portfolio on Skinvestments. Track inventory value and holdings.',
    path: token ? sharePath(token) : '/p',
    robots: 'noindex, nofollow',
  });

  useEffect(() => {
    if (!token) {
      setData(null);
      setError('Missing share token.');
      return;
    }

    let cancelled = false;
    setData(undefined);
    setError(null);
    setHistoryPage(1);

    (async () => {
      try {
        const payload = await fetchPublicPortfolio(token);
        if (!cancelled) {
          setData(payload);
          if (!payload) setError('This share link is invalid or has been disabled.');
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load portfolio');
          setData(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token || !data) return;
    if (!(data.visibility ?? DEFAULT_SHARE_VISIBILITY).show_history) {
      setHistory([]);
      setHistoryTotalPages(1);
      setHistoryLoading(false);
      return;
    }

    let cancelled = false;
    setHistoryLoading(true);

    (async () => {
      try {
        const page = await fetchPublicPortfolioHistory(token, historyPage, HISTORY_PAGE_SIZE);
        if (cancelled) return;
        if (!page) {
          setHistory([]);
          setHistoryTotalPages(1);
          return;
        }
        setHistory(page.items);
        setHistoryTotalPages(Math.max(1, Math.ceil(page.total_count / page.page_size)));
      } catch {
        if (!cancelled) {
          setHistory([]);
          setHistoryTotalPages(1);
        }
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, data, historyPage]);

  const visibility = data?.visibility ?? DEFAULT_SHARE_VISIBILITY;
  const chartData = useMemo(() => data?.chart ?? [], [data]);
  const categories = useMemo(() => data?.categories ?? [], [data]);
  const collections = useMemo(() => data?.collections ?? [], [data]);

  const isPositive = useMemo(() => {
    if (chartData.length < 2) return true;
    const first = Number(chartData[0]?.portfolio_value ?? 0);
    const last = Number(chartData[chartData.length - 1]?.portfolio_value ?? 0);
    return last >= first;
  }, [chartData]);

  if (data === undefined) {
    return (
      <div className="min-h-screen bg-steam-bg pt-24 sm:pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex justify-center py-24">
          <div
            className="w-8 h-8 border-2 border-steam-accent border-t-transparent rounded-full animate-spin"
            role="status"
            aria-label="Loading"
          />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-steam-text mb-3">Share unavailable</h1>
        <p className="text-steam-secondary max-w-md mb-2">
          {error || 'This share link is invalid or has been disabled.'}
        </p>
        <p className="text-steam-tertiary text-sm max-w-md mb-8">
          Ask the owner to re-enable sharing in Settings → Privacy, or regenerate the link.
        </p>
        <Link
          to="/"
          className="bg-steam-accent hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide"
        >
          Go home
        </Link>
      </div>
    );
  }

  const { summary, items, display_name, avatar } = data;

  return (
    <div className="min-h-screen bg-steam-bg pt-24 sm:pt-32 pb-20 px-4 sm:px-6 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10">
          <div className="w-16 h-16 rounded-2xl border border-steam-border bg-steam-card overflow-hidden flex items-center justify-center shrink-0">
            {avatar ? (
              <img src={avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-7 h-7 text-steam-tertiary" aria-hidden />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-steam-accent mb-1">
              Shared portfolio
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-steam-text truncate">
              {display_name}
            </h1>
            <p className="text-sm text-steam-secondary mt-1">
              Read-only shared view curated by the owner.
            </p>
          </div>
        </header>

        {visibility.show_summary && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <SummaryCard label="Total value" value={formatCurrency(summary.total_portfolio_value)} />
            <SummaryCard label="Inventory value" value={formatCurrency(summary.inventory_value)} />
            <SummaryCard label="Items" value={String(summary.item_count)} />
          </div>
        )}

        {(visibility.show_chart || visibility.show_categories) && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-10">
          {visibility.show_chart && (
          <section className={`${visibility.show_categories ? 'lg:col-span-3' : 'lg:col-span-5'} bg-steam-card border border-steam-border rounded-2xl p-5 sm:p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-steam-secondary" />
              <h2 className="font-bold text-steam-text">Portfolio value</h2>
            </div>
            {chartData.length === 0 ? (
              <div className="h-[240px] flex items-center justify-center text-steam-tertiary text-sm">
                No chart data available yet.
              </div>
            ) : (
              <div className="h-[240px] w-full min-w-0">
                <ResponsiveContainer width="100%" height={240} minWidth={0}>
                  <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                    <defs>
                      <linearGradient id="sharePortfolioFill" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={isPositive ? 'var(--color-profit)' : 'var(--color-loss)'}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={isPositive ? 'var(--color-profit)' : 'var(--color-loss)'}
                          stopOpacity={0}
                        />
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
                      width={48}
                      tickFormatter={formatChartYAxis}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(Number(value) || 0), 'Value']}
                      labelFormatter={(label) => formatChartXAxis(String(label))}
                      contentStyle={chartTooltipStyle}
                      itemStyle={chartTooltipItemStyle}
                    />
                    <Area
                      type="monotone"
                      dataKey="portfolio_value"
                      stroke={isPositive ? 'var(--color-profit)' : 'var(--color-loss)'}
                      strokeWidth={2.5}
                      fill="url(#sharePortfolioFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>
          )}

          {visibility.show_categories && (
          <section className={`${visibility.show_chart ? 'lg:col-span-2' : 'lg:col-span-5'} bg-steam-card border border-steam-border rounded-2xl p-5 sm:p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="w-5 h-5 text-steam-secondary" />
              <h2 className="font-bold text-steam-text">Categories</h2>
            </div>
            {categories.length === 0 ? (
              <div className="h-[240px] flex items-center justify-center text-steam-tertiary text-sm text-center px-4">
                No category breakdown yet.
              </div>
            ) : (
              <>
                <div className="h-[160px] w-full relative mb-3">
                  <ResponsiveContainer width="100%" height={160} minWidth={0}>
                    <PieChart>
                      <Pie
                        data={categories}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={68}
                        paddingAngle={4}
                        stroke="none"
                      >
                        {categories.map((_, index) => (
                          <Cell
                            key={`cat-${index}`}
                            fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(Number(value) || 0)}
                        contentStyle={chartTooltipStyle}
                        itemStyle={chartTooltipItemStyle}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 max-h-28 overflow-y-auto pr-1">
                  {categories.map((cat, index) => (
                    <div key={`${cat.name}-${index}`} className="flex items-center justify-between text-sm gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                        />
                        <span className="text-steam-secondary capitalize truncate">{cat.name}</span>
                      </div>
                      <span className="font-mono text-steam-tertiary shrink-0">
                        {Number(cat.percentage).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
          )}
        </div>
        )}

        {visibility.show_items && (
        <section className="mb-10">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-steam-text">Holdings</h2>
            <span className="text-xs text-steam-tertiary font-semibold uppercase tracking-wider">
              {items.length} shown
            </span>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-steam-border bg-steam-card/50 p-10 text-center">
              <Package className="w-10 h-10 text-steam-tertiary mx-auto mb-3 opacity-60" />
              <p className="text-steam-secondary text-sm">This portfolio has no items yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {items.map((item, idx) => {
                const rarityStyle = getRarityStyle(item.rarity);
                return (
                  <div
                    key={`${item.market_hash_name}-${idx}`}
                    className="bg-steam-card border border-steam-border rounded-xl overflow-hidden flex flex-col"
                  >
                    <div
                      className={`relative h-24 sm:h-28 bg-steam-elevated border-b-2 ${rarityStyle.border} flex items-center justify-center p-3`}
                    >
                      <ItemImage
                        src={item.icon_url}
                        alt={item.market_hash_name}
                        className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.5)]"
                        wrapperClassName="relative z-10 w-full h-full min-h-[64px]"
                      />
                      {item.quantity > 1 && (
                        <span className="absolute top-2 right-2 z-20 text-[10px] font-bold bg-steam-bg/80 border border-steam-border px-1.5 py-0.5 rounded text-steam-text">
                          ×{item.quantity}
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <p className="text-xs font-bold text-steam-text line-clamp-2 leading-snug mb-1 flex-1">
                        {item.market_hash_name}
                      </p>
                      {item.type && (
                        <p className="text-[10px] text-steam-tertiary uppercase tracking-wider mb-2 truncate">
                          {item.type}
                        </p>
                      )}
                      <div className="flex justify-between items-end gap-2">
                        <div>
                          <p className="text-[10px] text-steam-tertiary uppercase tracking-widest mb-0.5">
                            Value
                          </p>
                          <p className="text-sm font-bold text-steam-text font-mono">
                            {formatCurrency(item.position_value)}
                          </p>
                        </div>
                        <p className="text-[10px] text-steam-tertiary font-mono">
                          {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        )}

        {visibility.show_collections && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-steam-secondary" />
            <h2 className="text-lg font-bold text-steam-text">Collections</h2>
            <span className="bg-steam-elevated text-steam-secondary text-xs font-bold px-2 py-0.5 rounded-full">
              {collections.length}
            </span>
          </div>
          {collections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-steam-border bg-steam-card/50 p-8 text-center text-sm text-steam-secondary">
              No collections to show.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((col) => (
                <div
                  key={String(col.id)}
                  className="bg-steam-card p-5 rounded-2xl border border-steam-border relative overflow-hidden"
                >
                  <h3 className="font-bold text-steam-text truncate pr-2">{String(col.name)}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary mt-1">
                    {Number(col.total_items_quantity ?? 0)} items
                  </p>
                  <p className="text-lg font-mono font-bold text-steam-text mt-4">
                    {formatCurrency(Number(col.total_value ?? 0))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
        )}

        {visibility.show_history && (
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-steam-secondary" />
            <h2 className="text-lg font-bold text-steam-text">Item history</h2>
          </div>

          <div className="rounded-2xl border border-steam-border bg-steam-card overflow-hidden">
            {historyLoading ? (
              <div className="p-16 flex justify-center text-steam-accent">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <div className="p-8 text-center text-sm text-steam-secondary">
                No transaction history for current holdings.
              </div>
            ) : (
              <div className="divide-y divide-steam-border/60">
                {history.map((tx) => {
                  const rarityStyle = getRarityStyle(tx.rarity);
                  const type = String(tx.type || '').toUpperCase();
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-steam-hover/40 transition-colors"
                    >
                      <div
                        className={`w-12 h-10 rounded overflow-hidden border-b-2 ${rarityStyle.border} shrink-0 bg-steam-elevated`}
                      >
                        <ItemImage
                          src={tx.icon_url}
                          alt={tx.market_hash_name}
                          className="max-w-full max-h-full object-contain"
                          wrapperClassName="w-full h-full"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-steam-text truncate">
                          {tx.market_hash_name}
                        </p>
                        <p className="text-[11px] text-steam-tertiary">
                          {formatHistoryDate(tx.transaction_date)} · qty {tx.quantity}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1 ${
                            type === 'SELL'
                              ? 'bg-red-500/10 text-red-400'
                              : type === 'DROP'
                                ? 'bg-blue-500/10 text-blue-400'
                                : 'bg-green-500/10 text-green-400'
                          }`}
                        >
                          {type || 'TX'}
                        </span>
                        <p className="text-sm font-mono font-bold text-steam-text">
                          {formatCurrency(Number(tx.price) || 0)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-steam-elevated px-4 sm:px-6 py-4 border-t border-steam-border flex justify-between items-center gap-3">
              <button
                type="button"
                disabled={historyPage === 1 || historyLoading}
                onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                className="text-steam-secondary hover:text-steam-text disabled:opacity-30 text-sm font-bold"
              >
                Previous
              </button>
              <span className="text-xs text-steam-tertiary font-bold uppercase tracking-widest">
                Page <span className="text-steam-text text-sm">{historyPage}</span> of{' '}
                {historyTotalPages}
              </span>
              <button
                type="button"
                disabled={historyPage >= historyTotalPages || historyLoading}
                onClick={() => setHistoryPage((p) => p + 1)}
                className="text-steam-secondary hover:text-steam-text disabled:opacity-30 text-sm font-bold"
              >
                Next
              </button>
            </div>
          </div>
        </section>
        )}

        <aside className="rounded-2xl border border-steam-border bg-steam-card/80 p-6 sm:p-8 text-center">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-steam-text mb-2 tracking-tight">
            Track your own CS2 portfolio
          </h2>
          <p className="text-steam-secondary text-sm sm:text-base mb-6 max-w-md mx-auto leading-relaxed">
            Skinvestments syncs Steam inventory, multi-market prices, and P&amp;L — free to start.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-steam-accent text-white font-bold uppercase tracking-wide text-sm hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              Sign in
            </Link>
            <div className="w-full sm:w-auto flex justify-center">
              <GetAppButton />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

function formatHistoryDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

const SummaryCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-steam-border bg-steam-card p-5">
    <p className="text-[11px] font-bold uppercase tracking-widest text-steam-tertiary mb-2">
      {label}
    </p>
    <p className="text-xl sm:text-2xl font-bold text-steam-text font-mono">{value}</p>
  </div>
);

export default PublicPortfolioPage;
