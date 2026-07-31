import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from 'recharts';
import { ExternalLink, Loader2, Package, User } from 'lucide-react';
import { usePageSeo } from '@/hooks/usePageSeo';
import { ItemImage } from '@/components/ui/ItemImage';
import { formatCurrency, getRarityStyle } from '@/utils/display';
import { fetchPublicPortfolio, sharePath, shareUrl } from '@/utils/portfolioShare';
import type { PublicPortfolioPayload } from '@/types/portfolioShare';
import {
  DEFAULT_SHARE_VISIBILITY,
  parseEmbedLayout,
} from '@/types/portfolioShare';

const CATEGORY_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];
const TOP_HOLDINGS = 5;

const EmbedPortfolioPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const layout = parseEmbedLayout(searchParams.get('layout'));
  const [data, setData] = useState<PublicPortfolioPayload | null | undefined>(undefined);

  usePageSeo({
    title: data
      ? `${data.display_name}'s Portfolio Embed | Skinvestments`
      : 'Portfolio Embed | Skinvestments',
    description: 'Embedded CS2 portfolio widget from Skinvestments.',
    path: token ? `/embed/${token}` : '/embed',
    robots: 'noindex, nofollow',
  });

  useEffect(() => {
    if (!token) {
      setData(null);
      return;
    }
    let cancelled = false;
    setData(undefined);
    (async () => {
      try {
        const payload = await fetchPublicPortfolio(token);
        if (!cancelled) setData(payload);
      } catch {
        if (!cancelled) setData(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const visibility = data?.visibility ?? DEFAULT_SHARE_VISIBILITY;
  const topItems = useMemo(() => {
    const items = [...(data?.items ?? [])];
    items.sort((a, b) => Number(b.position_value) - Number(a.position_value));
    return items.slice(0, TOP_HOLDINGS);
  }, [data?.items]);

  const chartData = data?.chart ?? [];
  const categories = data?.categories ?? [];
  const isPositive = useMemo(() => {
    if (chartData.length < 2) return true;
    const first = Number(chartData[0]?.portfolio_value ?? 0);
    const last = Number(chartData[chartData.length - 1]?.portfolio_value ?? 0);
    return last >= first;
  }, [chartData]);

  if (data === undefined) {
    return (
      <Shell>
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-steam-accent animate-spin" aria-label="Loading" />
        </div>
      </Shell>
    );
  }

  if (!data || !token) {
    return (
      <Shell>
        <div className="text-center py-8 px-2">
          <p className="text-sm font-bold text-steam-text mb-1">Share unavailable</p>
          <p className="text-xs text-steam-tertiary">This embed link is invalid or disabled.</p>
        </div>
      </Shell>
    );
  }

  const portfolioHref = shareUrl(token);
  const { summary, display_name, avatar } = data;

  return (
    <Shell>
      <a
        href={portfolioHref}
        target="_blank"
        rel="noopener noreferrer"
        className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-steam-accent rounded-2xl"
      >
        <Header displayName={display_name} avatar={avatar} />

        {(layout === 'summary' || layout === 'top' || (layout === 'sections' && visibility.show_summary)) && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Stat label="Value" value={formatCurrency(summary.total_portfolio_value)} />
            <Stat label="Items" value={String(summary.item_count)} />
          </div>
        )}

        {layout === 'top' && (
          <div className="mt-3 space-y-1.5">
            {topItems.length === 0 ? (
              <p className="text-[11px] text-steam-tertiary py-2">No holdings to show.</p>
            ) : (
              topItems.map((item) => (
                <div
                  key={`${item.market_hash_name}-${item.position_value}`}
                  className="flex items-center gap-2 rounded-lg bg-steam-elevated/50 border border-steam-border/40 px-2 py-1.5"
                >
                  <ItemImage
                    src={item.icon_url}
                    alt=""
                    wrapperClassName={`w-8 h-8 rounded-md shrink-0 bg-steam-elevated border ${getRarityStyle(item.rarity).border}`}
                    className="max-w-[90%] max-h-[90%] object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-steam-text truncate">
                      {item.market_hash_name}
                    </p>
                    <p className="text-[10px] text-steam-tertiary">×{item.quantity}</p>
                  </div>
                  <p className="text-[11px] font-bold text-steam-text shrink-0">
                    {formatCurrency(item.position_value)}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {layout === 'sections' && (
          <div className="mt-3 space-y-2">
            {visibility.show_chart && chartData.length > 0 && (
              <div className="h-16 rounded-xl border border-steam-border/50 bg-steam-elevated/30 px-1 py-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="embedChart" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={isPositive ? 'var(--color-profit)' : 'var(--color-loss)'}
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor={isPositive ? 'var(--color-profit)' : 'var(--color-loss)'}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="portfolio_value"
                      stroke={isPositive ? 'var(--color-profit)' : 'var(--color-loss)'}
                      fill="url(#embedChart)"
                      strokeWidth={1.5}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {visibility.show_categories && categories.length > 0 && (
              <div className="flex items-center gap-3 rounded-xl border border-steam-border/50 bg-steam-elevated/30 p-2">
                <div className="w-14 h-14 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categories}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={14}
                        outerRadius={24}
                        strokeWidth={0}
                        isAnimationActive={false}
                      >
                        {categories.map((_, i) => (
                          <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  {categories.slice(0, 3).map((c) => (
                    <p key={c.name} className="text-[10px] text-steam-secondary truncate">
                      <span className="font-bold text-steam-text">{c.name}</span>{' '}
                      {Number(c.percentage).toFixed(0)}%
                    </p>
                  ))}
                </div>
              </div>
            )}

            {visibility.show_items && (
              <div className="grid grid-cols-4 gap-1.5">
                {topItems.slice(0, 4).map((item) => (
                  <div
                    key={`grid-${item.market_hash_name}`}
                    className={`aspect-square rounded-lg border bg-steam-elevated flex items-center justify-center ${getRarityStyle(item.rarity).border}`}
                  >
                    <ItemImage
                      src={item.icon_url}
                      alt=""
                      className="max-w-[80%] max-h-[80%] object-contain"
                    />
                  </div>
                ))}
                {topItems.length === 0 && (
                  <div className="col-span-4 flex items-center gap-1.5 text-[11px] text-steam-tertiary py-2">
                    <Package className="w-3.5 h-3.5" /> No items
                  </div>
                )}
              </div>
            )}

            {visibility.show_collections && (data.collections?.length ?? 0) > 0 && (
              <div className="space-y-1">
                {(data.collections ?? []).slice(0, 2).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-lg bg-steam-elevated/40 px-2 py-1.5 text-[11px]"
                  >
                    <span className="font-semibold text-steam-text truncate">{c.name}</span>
                    <span className="text-steam-secondary shrink-0 ml-2">
                      {formatCurrency(Number(c.total_value ?? 0))}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {visibility.show_history && (data.history?.length ?? 0) > 0 && (
              <div className="space-y-1">
                {(data.history ?? []).slice(0, 2).map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between rounded-lg bg-steam-elevated/40 px-2 py-1.5 text-[11px]"
                  >
                    <span className="text-steam-text font-semibold uppercase">{h.type}</span>
                    <span className="text-steam-secondary truncate ml-2">{h.market_hash_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-3 pt-2 border-t border-steam-border/40 flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary">
            Skinvestments
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-steam-accent group-hover:underline">
            Open portfolio <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </a>

      {/* Keep a real SPA link for accessibility when not in iframe */}
      <Link to={sharePath(token)} className="sr-only">
        Full shared portfolio
      </Link>
    </Shell>
  );
};

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-steam-bg text-steam-text p-2 sm:p-3 flex items-stretch justify-center">
    <div className="w-full max-w-[380px] bg-steam-card border border-steam-border rounded-2xl shadow-xl p-3 sm:p-4 self-start">
      {children}
    </div>
  </div>
);

const Header: React.FC<{ displayName: string; avatar: string | null }> = ({
  displayName,
  avatar,
}) => (
  <div className="flex items-center gap-2.5">
    {avatar ? (
      <img
        src={avatar}
        alt=""
        className="w-9 h-9 rounded-xl object-cover border border-steam-border shrink-0"
      />
    ) : (
      <div className="w-9 h-9 rounded-xl bg-steam-elevated border border-steam-border flex items-center justify-center shrink-0">
        <User className="w-4 h-4 text-steam-tertiary" />
      </div>
    )}
    <div className="min-w-0">
      <p className="text-[9px] font-bold uppercase tracking-widest text-steam-accent">
        Shared portfolio
      </p>
      <p className="text-sm font-bold text-steam-text truncate">{displayName}</p>
    </div>
  </div>
);

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl bg-steam-elevated/60 border border-steam-border/50 px-2.5 py-2">
    <p className="text-[9px] font-bold uppercase tracking-wider text-steam-tertiary mb-0.5">
      {label}
    </p>
    <p className="text-sm font-bold text-steam-text truncate">{value}</p>
  </div>
);

export default EmbedPortfolioPage;

