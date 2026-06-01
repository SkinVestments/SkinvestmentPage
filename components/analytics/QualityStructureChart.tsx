import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Diamond } from 'lucide-react';

const RARITY_COLORS: Record<string, string> = {
  contraband: '#EAB308',
  covert: '#EF4444',
  classified: '#EC4899',
  restricted: '#A855F7',
  'mil-spec': '#3B82F6',
  industrial: '#6B7280',
  consumer: '#4B5563',
  'base grade': '#374151',
};

/** Index 0 = bottom (widest), last = top (narrowest) */
const PYRAMID_ORDER = [
  'base grade',
  'consumer',
  'industrial',
  'mil-spec',
  'restricted',
  'classified',
  'covert',
  'contraband',
];

const TIER_COUNT = PYRAMID_ORDER.length;

interface ChartSegment {
  originalName: string;
  name: string;
  count: number;
  value: number;
  color: string;
  percentageLabel: string;
  tierIndex: number;
}

const getRarityInfo = (rarityName: string) => {
  const normalized = rarityName.toLowerCase();
  let color = RARITY_COLORS['base grade'];
  let shortName = rarityName;

  for (const key of Object.keys(RARITY_COLORS)) {
    if (normalized.includes(key)) {
      color = RARITY_COLORS[key];
      if (key === 'contraband') shortName = 'GOLD';
      else if (key === 'covert') shortName = 'RED';
      else if (key === 'classified') shortName = 'PINK';
      else if (key === 'restricted') shortName = 'PURPLE';
      else if (key === 'mil-spec') shortName = 'BLUE';
      else if (key === 'base grade') shortName = 'BASE';
      else if (key === 'consumer') shortName = 'CONS';
      else if (key === 'industrial') shortName = 'IND';
      else shortName = key.toUpperCase();
      break;
    }
  }
  return { color, shortName };
};

const pyramidSortIndex = (originalName: string) => {
  const idx = PYRAMID_ORDER.findIndex((r) => originalName.includes(r));
  return idx === -1 ? 0 : idx;
};

/** Width % of container — wider at bottom tier, narrower at top */
const tierWidthPercent = (tierIndex: number) => {
  if (TIER_COUNT <= 1) return 100;
  const t = tierIndex / (TIER_COUNT - 1);
  return 100 - t * 58;
};

export const QualityStructureChart = () => {
  const { user } = useAuth();
  const chartWrapRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<ChartSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [qualityScore, setQualityScore] = useState<{ label: string; color: string }>({
    label: 'STANDARD',
    color: 'text-steam-secondary',
  });

  useEffect(() => {
    const el = chartWrapRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setIsCompact(entry.contentRect.width < 420);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, data.length]);

  useEffect(() => {
    const fetchQualityData = async () => {
      if (!user) return;
      try {
        const { data: rawData, error } = await supabase.rpc('get_portfolio_quality_structure', {
          p_user_id: user.id,
        });

        if (error) throw error;

        if (rawData && rawData.length > 0) {
          const totalItems = rawData.reduce(
            (sum: number, item: { item_count: number }) => sum + Number(item.item_count),
            0,
          );

          const processedData: ChartSegment[] = rawData
            .map((item: { quality_name: string; item_count: number }) => {
              const count = Number(item.item_count);
              const percentage = totalItems > 0 ? (count / totalItems) * 100 : 0;
              const { color, shortName } = getRarityInfo(item.quality_name);
              const tierIndex = pyramidSortIndex(item.quality_name.toLowerCase());

              return {
                originalName: item.quality_name.toLowerCase(),
                name: shortName,
                count,
                value: percentage,
                color,
                percentageLabel: `${percentage.toFixed(0)}%`,
                tierIndex,
              };
            })
            .filter((item) => item.count > 0);

          processedData.sort((a, b) => a.tierIndex - b.tierIndex);

          setData(processedData);

          const highTierShare = processedData
            .filter((d) => ['PINK', 'RED', 'GOLD'].includes(d.name))
            .reduce((sum, d) => sum + d.value, 0);

          if (highTierShare > 25) {
            setQualityScore({ label: 'HIGH TIER', color: 'text-blue-400' });
          } else if (highTierShare > 5) {
            setQualityScore({ label: 'MID TIER', color: 'text-purple-400' });
          } else {
            setQualityScore({ label: 'STANDARD TIER', color: 'text-steam-secondary' });
          }
        }
      } catch (error) {
        console.error('Error fetching quality structure:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQualityData();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-steam-card rounded-2xl border border-steam-border shadow-lg h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-steam-tertiary w-8 h-8" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-steam-card p-6 rounded-2xl border border-steam-border shadow-lg h-[400px] flex flex-col justify-center items-center text-center">
        <Diamond className="w-8 h-8 text-steam-tertiary mb-3" />
        <p className="text-steam-secondary font-bold">No data</p>
        <p className="text-steam-tertiary text-xs mt-1">Add items to see your quality structure.</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const pyramidRows = [...data].reverse();

  return (
    <div className="bg-steam-card p-4 sm:p-6 rounded-2xl border border-steam-border shadow-lg min-h-[420px] flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Diamond className="w-5 h-5 text-blue-400 shrink-0" />
        <h3 className="font-bold text-steam-text text-sm sm:text-base">Inventory Quality Structure</h3>
      </div>
      <p className="text-xs text-steam-secondary mb-4 sm:mb-6 leading-relaxed">
        Automatic categorization by rarity. See if your portfolio is built on stable assets or speculative skins.
      </p>

      <div ref={chartWrapRef} className="flex-1 w-full min-w-0 flex flex-col items-center justify-center">
        <div
          className="w-full max-w-[280px] sm:max-w-xs mx-auto px-1"
          role="img"
          aria-label="Inventory quality pyramid, base grade at bottom to highest rarities at top"
        >
          <div className="flex flex-col items-center gap-2 sm:gap-2.5">
            {pyramidRows.map((item) => {
              const widthPct = tierWidthPercent(item.tierIndex);
              const heightPx = Math.max(36, Math.round((item.value / maxValue) * 56));
              const active = hovered === item.name;
              const narrow = widthPct < 55 || isCompact;

              return (
                <div
                  key={item.name}
                  className="flex w-full justify-center"
                  onMouseEnter={() => setHovered(item.name)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div
                    className="flex flex-col items-center justify-center rounded-lg px-2 py-1.5 font-bold text-on-accent shadow-lg transition-all duration-200"
                    style={{
                      width: `${widthPct}%`,
                      minWidth: narrow ? 64 : 72,
                      minHeight: heightPx,
                      backgroundColor: item.color,
                      boxShadow: active
                        ? `0 8px 24px ${item.color}55`
                        : '0 4px 14px rgba(0,0,0,0.25)',
                      transform: active ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    <span
                      className={`leading-tight drop-shadow-sm ${
                        narrow ? 'text-[9px]' : 'text-[10px] sm:text-xs'
                      } tracking-wide`}
                    >
                      {item.name}
                    </span>
                    <span
                      className={`tabular-nums opacity-90 ${
                        narrow ? 'text-[9px]' : 'text-[10px] sm:text-[11px]'
                      }`}
                    >
                      {item.percentageLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-5 sm:mt-4">
          <p className="text-[10px] text-steam-tertiary uppercase tracking-widest font-bold mb-1">Quality Score</p>
          <div
            className={`text-lg sm:text-xl font-bold ${qualityScore.color} flex items-center justify-center gap-2 font-display`}
          >
            {qualityScore.label}
            {qualityScore.label.includes('HIGH') && <Diamond className="w-5 h-5 fill-current" />}
          </div>
        </div>
      </div>
    </div>
  );
};
