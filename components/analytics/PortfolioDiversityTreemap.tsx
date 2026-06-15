import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabaseClient';
import { ChartCardSkeleton } from './AnalyticsSkeletons';
import { formatCurrency } from '@/utils/display';
import {
  normalizePortfolioTreemapData,
  type TreemapChartNode,
} from '@/utils/portfolioRpc';
import {
  condenseTreemapForDisplay,
  layoutNestedTreemap,
  treemapDisplayHeight,
  treemapGroupTotal,
  type NestedTreemapCell,
} from '@/utils/treemapLayout';

function truncateLabel(label: string, maxChars: number): string {
  if (label.length <= maxChars) return label;
  return `${label.slice(0, Math.max(1, maxChars - 1))}…`;
}

function parseHexColor(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace('#', '');
  const n = parseInt(normalized.length === 3
    ? normalized.split('').map((c) => c + c).join('')
    : normalized, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function relativeLuminance(r: number, g: number, b: number): number {
  const transform = (channel: number) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
}

function textColorsForFill(hex: string): { primary: string; muted: string } {
  const { r, g, b } = parseHexColor(hex);
  const lightBg = relativeLuminance(r, g, b) > 0.5;
  return lightBg
    ? { primary: '#0f172a', muted: 'rgba(15, 23, 42, 0.72)' }
    : { primary: '#f8fafc', muted: 'rgba(248, 250, 252, 0.82)' };
}

function cellTooltip(cell: NestedTreemapCell): string {
  const node = cell.node;
  const parts = [
    node.category ? `${node.category} · ` : '',
    node.name,
    ` — ${formatCurrency(node.size ?? 0)}`,
    ` (${cell.portfolioPct.toFixed(1)}% portfolio`,
  ];
  if (cell.categoryPct != null) {
    parts.push(`, ${cell.categoryPct.toFixed(0)}% of type`);
  }
  parts.push(')');
  if (node.isGrouped) parts.push(' — hover legend for full breakdown');
  return parts.join('');
}

interface ItemCellProps {
  cell: NestedTreemapCell;
  index: number;
}

const ItemCell: React.FC<ItemCellProps> = ({ cell, index }) => {
  const fill = cell.node.fill ?? '#6b7280';
  const textColors = textColorsForFill(fill);
  const w = Math.max(0, cell.width - 1);
  const h = Math.max(0, cell.height - 1);
  const area = w * h;

  const showRich = w >= 76 && h >= 46;
  const showName = w >= 52 && h >= 30;
  const showValue = w >= 44 && h >= 38;
  const showPct = !showName && w >= 30 && h >= 22;
  const maxChars = Math.max(4, Math.floor(w / 5.5));

  return (
    <g
      key={`${cell.node.category ?? 'item'}-${cell.node.name}-${index}`}
      className="cursor-default"
    >
      <rect
        x={cell.x}
        y={cell.y}
        width={w}
        height={h}
        fill={fill}
        stroke="rgba(0,0,0,0.28)"
        strokeWidth={1}
        rx={3}
        className="transition-[filter] hover:brightness-110"
      >
        <title>{cellTooltip(cell)}</title>
      </rect>

      {showRich ? (
        <foreignObject x={cell.x + 4} y={cell.y + 4} width={w - 8} height={h - 8}>
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            className="flex h-full flex-col justify-between overflow-hidden"
            style={{ color: textColors.primary }}
          >
            <p className="text-[10px] font-semibold leading-tight line-clamp-2 drop-shadow-sm">
              {cell.node.name}
            </p>
            <p className="text-[9px] font-mono tabular-nums" style={{ color: textColors.muted }}>
              {formatCurrency(cell.node.size ?? 0)}
              <span className="ml-1">({cell.portfolioPct.toFixed(0)}%)</span>
            </p>
          </div>
        </foreignObject>
      ) : (
        <>
          {showName && (
            <text
              x={cell.x + 5}
              y={showValue ? cell.y + 14 : cell.y + h / 2}
              fill={textColors.primary}
              fontSize={area >= 2200 ? 10 : 9}
              fontWeight={600}
              dominantBaseline={showValue ? 'auto' : 'middle'}
              paintOrder="stroke"
              stroke={textColors.primary === '#f8fafc' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.5)'}
              strokeWidth={2}
            >
              {truncateLabel(cell.node.name, maxChars)}
            </text>
          )}
          {showValue && (
            <text
              x={cell.x + 5}
              y={cell.y + h - 5}
              fill={textColors.muted}
              fontSize={9}
              fontFamily="ui-monospace, monospace"
            >
              {formatCurrency(cell.node.size ?? 0)}
            </text>
          )}
          {showPct && (
            <text
              x={cell.x + w / 2}
              y={cell.y + h / 2}
              fill={textColors.primary}
              fontSize={9}
              fontWeight={700}
              textAnchor="middle"
              dominantBaseline="middle"
              paintOrder="stroke"
              stroke={textColors.primary === '#f8fafc' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.5)'}
              strokeWidth={2}
            >
              {cell.portfolioPct.toFixed(0)}%
            </text>
          )}
        </>
      )}
    </g>
  );
};

interface TreemapSvgProps {
  data: TreemapChartNode[];
  totalValue: number;
  width: number;
  height: number;
}

const TreemapSvg: React.FC<TreemapSvgProps> = ({ data, totalValue, width, height }) => {
  const layout = useMemo(
    () => layoutNestedTreemap(data, width, height, totalValue),
    [data, totalValue, width, height],
  );

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="block w-full select-none"
      role="img"
      aria-label="Portfolio diversity treemap grouped by item type"
    >
      {layout.categories.map((cell) => {
        const fill = cell.node.fill ?? '#6b7280';
        const showLabel = cell.width >= 48 && cell.height >= 24;
        const headerText = textColorsForFill(fill);

        return (
          <g key={`cat-${cell.node.name}`}>
            <rect
              x={cell.x}
              y={cell.y}
              width={cell.width}
              height={cell.height}
              fill={fill}
              fillOpacity={0.2}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth={1}
              rx={4}
            />
            {showLabel && (
              <>
                <rect
                  x={cell.x}
                  y={cell.y}
                  width={cell.width}
                  height={18}
                  fill={fill}
                  fillOpacity={0.92}
                  rx={4}
                />
                <text
                  x={cell.x + 5}
                  y={cell.y + 13}
                  fill={headerText.primary}
                  fontSize={10}
                  fontWeight={700}
                  style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
                >
                  {truncateLabel(cell.node.name, Math.floor(cell.width / 6.5))} ·{' '}
                  {cell.portfolioPct.toFixed(0)}%
                </text>
              </>
            )}
          </g>
        );
      })}

      {layout.items.map((cell, index) => (
        <ItemCell key={`item-${index}`} cell={cell} index={index} />
      ))}
    </svg>
  );
};

export const PortfolioDiversityTreemap: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<TreemapChartNode[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const fetchTreemap = async () => {
      if (!user) return;
      try {
        const { data: raw, error } = await supabase.rpc('get_portfolio_treemap_data');
        if (error) throw error;
        setData(normalizePortfolioTreemapData(raw));
      } catch (err) {
        console.error('Error fetching portfolio treemap:', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchTreemap();
  }, [user]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => {
      const next = Math.floor(element.getBoundingClientRect().width);
      if (next > 0) setContainerWidth(next);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, [loading, data.length]);

  const rawTotal = useMemo(
    () => data.reduce((sum, group) => sum + treemapGroupTotal(group), 0),
    [data],
  );

  const { displayData, groupedItemCount, treemapHeight } = useMemo(() => {
    const condensed = condenseTreemapForDisplay(data, rawTotal);
    return {
      displayData: condensed.data,
      groupedItemCount: condensed.groupedItemCount,
      treemapHeight: treemapDisplayHeight(condensed.data),
    };
  }, [data, rawTotal]);

  const legend = useMemo(() => {
    const items = displayData.map((group) => ({
      name: group.name,
      value: treemapGroupTotal(group),
      color: group.fill ?? group.children?.[0]?.fill ?? '#6b7280',
    }));
    const total = items.reduce((sum, item) => sum + item.value, 0);
    return items.map((item) => ({
      ...item,
      pct: total > 0 ? (item.value / total) * 100 : 0,
    }));
  }, [displayData]);

  const groupingNote =
    groupedItemCount > 0 ? `${groupedItemCount} smaller items grouped within their type` : null;

  if (loading) {
    return (
      <ChartCardSkeleton height="min-h-[400px]" titleWidth="w-52">
        <div className="h-[420px] flex-1 rounded-xl bg-steam-elevated/40 border border-steam-border" />
      </ChartCardSkeleton>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-steam-card p-6 rounded-2xl border border-steam-border shadow-lg min-h-[280px] flex flex-col justify-center items-center text-center">
        <LayoutGrid className="w-8 h-8 text-steam-tertiary mb-3" />
        <p className="text-steam-secondary font-bold">No diversity data</p>
        <p className="text-steam-tertiary text-xs mt-1 max-w-sm">
          Add items to your portfolio to see how value is spread across cases, skins, and more.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-steam-card p-6 rounded-2xl border border-steam-border shadow-lg">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-steam-accent/10 text-steam-accent">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-steam-text text-lg">Portfolio Diversity</h3>
          </div>
          <p className="text-xs text-steam-tertiary pl-9">
            Treemap by item type — larger boxes hold more portfolio value.
            {groupingNote ? ` ${groupingNote}.` : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-steam-tertiary">
            Portfolio value
          </p>
          <p className="text-lg font-bold font-mono text-steam-text tabular-nums">
            {formatCurrency(rawTotal)}
          </p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="rounded-xl border border-steam-border/60 bg-steam-bg/60 p-2 sm:p-3 overflow-hidden"
      >
        {containerWidth > 0 && (
          <TreemapSvg
            data={displayData}
            totalValue={rawTotal}
            width={containerWidth}
            height={treemapHeight}
          />
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-5">
        {legend.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2.5 rounded-xl border border-steam-border/50 bg-steam-elevated/30 px-3 py-2.5 min-w-0"
          >
            <span
              className="w-2.5 h-8 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-steam-text capitalize truncate">{item.name}</p>
              <p className="text-[10px] text-steam-tertiary font-mono tabular-nums">
                {item.pct.toFixed(0)}% · {formatCurrency(item.value)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
