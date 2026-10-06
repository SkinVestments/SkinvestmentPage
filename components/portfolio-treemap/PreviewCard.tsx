import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LayoutGrid, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/display';
import { layoutNestedTreemap } from '@/utils/treemapLayout';
import { ProAnalyticsPaywall } from '@/components/analytics/ProAnalyticsPaywall';
import { formatSharePct, type TreemapPortfolio } from './model';
import { usePortfolioTreemap } from './usePortfolioTreemap';
import type { TreemapChartNode } from '@/utils/portfolioRpc';

export const PORTFOLIO_MAP_PATH = '/analytics/portfolio-map';

function portfolioToChartNodes(portfolio: TreemapPortfolio): TreemapChartNode[] {
  return portfolio.categories.map((cat) => ({
    name: cat.name,
    size: cat.value,
    fill: cat.fill,
    children: cat.items.map((item) => ({
      name: item.displayName,
      size: item.value,
      fill: item.fill,
      category: cat.name,
    })),
  }));
}

const MiniMap: React.FC<{ portfolio: TreemapPortfolio; width: number; height: number }> = ({
  portfolio,
  width,
  height,
}) => {
  const nodes = useMemo(() => portfolioToChartNodes(portfolio), [portfolio]);
  const layout = useMemo(
    () => layoutNestedTreemap(nodes, width, height, portfolio.totalValue, { gap: 1, categoryHeader: 16 }),
    [nodes, width, height, portfolio.totalValue],
  );

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="block w-full pointer-events-none select-none"
      aria-hidden
    >
      {layout.categories.map((cell) => (
        <g key={cell.node.name}>
          <rect
            x={cell.x}
            y={cell.y}
            width={cell.width}
            height={cell.height}
            fill={cell.node.fill ?? '#6b7280'}
            fillOpacity={0.25}
            rx={3}
          />
          {cell.width >= 48 && cell.height >= 18 && (
            <>
              <rect
                x={cell.x}
                y={cell.y}
                width={cell.width}
                height={16}
                fill={cell.node.fill ?? '#6b7280'}
                fillOpacity={0.95}
                rx={3}
              />
              <text x={cell.x + 4} y={cell.y + 11} fill="#fff" fontSize={9} fontWeight={700}>
                {cell.node.name} · {formatSharePct(cell.portfolioPct)}
              </text>
            </>
          )}
        </g>
      ))}
      {layout.items.map((cell, i) => (
        <rect
          key={`${cell.node.name}-${i}`}
          x={cell.x}
          y={cell.y}
          width={Math.max(0, cell.width - 1)}
          height={Math.max(0, cell.height - 1)}
          fill={cell.node.fill ?? '#6b7280'}
          stroke="rgba(0,0,0,0.25)"
          rx={2}
        />
      ))}
    </svg>
  );
};

export const PortfolioDiversityPreviewCard: React.FC = () => {
  const { access, load } = usePortfolioTreemap();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const portfolio =
    load.kind === 'ready' ? load.portfolio : null;
  const isDemo = load.kind === 'ready' && load.isDemo;
  const locked = access === 'locked' || isDemo;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setWidth(Math.floor(el.getBoundingClientRect().width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [load.kind]);

  if (access === 'checking' || load.kind === 'loading' || load.kind === 'idle') {
    return (
      <div className="bg-steam-card p-6 rounded-2xl border border-steam-border shadow-lg min-h-[360px] flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-steam-accent" />
      </div>
    );
  }

  if (load.kind === 'error') {
    return (
      <div className="bg-steam-card p-6 rounded-2xl border border-steam-border shadow-lg min-h-[240px] flex flex-col items-center justify-center text-center gap-2">
        <p className="font-bold text-steam-text">Could not load diversity map</p>
        <p className="text-sm text-steam-secondary">{load.message}</p>
      </div>
    );
  }

  if (load.kind === 'empty' || !portfolio) {
    return (
      <div className="bg-steam-card p-6 rounded-2xl border border-steam-border shadow-lg min-h-[240px] flex flex-col items-center justify-center text-center">
        <LayoutGrid className="w-8 h-8 text-steam-tertiary mb-3" />
        <p className="text-steam-secondary font-bold">No diversity data</p>
        <p className="text-steam-tertiary text-xs mt-1 max-w-sm">
          Add items to your portfolio to see how value is spread across cases, skins, and more.
        </p>
      </div>
    );
  }

  const legend = portfolio.categories.map((c) => ({
    name: c.name,
    color: c.fill,
    pct: c.portfolioPct,
    value: c.value,
  }));

  const header = (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-steam-accent/10 text-steam-accent">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-steam-text text-lg">Portfolio diversity</h3>
        </div>
        <p className="text-xs text-steam-secondary pl-9">Zoom in and inspect every position.</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold uppercase tracking-widest text-steam-tertiary">Portfolio</p>
        <p className="text-lg font-bold font-mono text-steam-text tabular-nums">
          {formatCurrency(portfolio.totalValue)}
        </p>
      </div>
    </div>
  );

  const mapAndLegend = (
    <>
      <div
        ref={containerRef}
        className={`rounded-xl border border-steam-border/60 bg-steam-bg/60 p-2 sm:p-3 overflow-hidden ${
          locked ? 'blur-md opacity-40 select-none pointer-events-none' : ''
        }`}
      >
        {width > 0 && <MiniMap portfolio={portfolio} width={width} height={320} />}
      </div>

      <div
        className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-4 ${
          locked ? 'blur-md opacity-40 select-none pointer-events-none' : ''
        }`}
      >
        {legend.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2.5 rounded-xl border border-steam-border/50 bg-steam-elevated/30 px-3 py-2.5 min-w-0"
          >
            <span className="w-2.5 h-8 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-steam-text capitalize truncate">{item.name}</p>
              <p className="text-[10px] text-steam-tertiary font-mono tabular-nums">
                {formatSharePct(item.pct)} · {formatCurrency(item.value)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  if (locked) {
    return (
      <div className="bg-steam-card p-6 rounded-2xl border border-steam-border shadow-lg">
        {header}
        <div className="relative min-h-[280px]">
          {mapAndLegend}
          <ProAnalyticsPaywall
            from="analytics_portfolio_treemap"
            description="Unlock the interactive portfolio map — zoom every category and inspect each position."
          />
        </div>
      </div>
    );
  }

  return (
    <Link
      to={PORTFOLIO_MAP_PATH}
      className="block bg-steam-card p-6 rounded-2xl border border-steam-border shadow-lg hover:border-steam-accent/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steam-accent"
    >
      {header}
      {mapAndLegend}
      <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-steam-accent text-white px-4 py-3.5 text-sm font-bold shadow-lg theme-shadow-accent">
        Open interactive map
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
};
