import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Package,
  Loader2,
  CheckCircle,
  Flame,
  Trophy,
  Play,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabaseClient';
import { formatCurrency } from '@/utils/display';
import { useWeeklyReset } from '@/utils/utils';
import { LogDropModal } from '@/components/dashboard/LogDropModal';
import { ItemImage } from '@/components/ui/ItemImage';
import {
  normalizeWeeklyDropChallenge,
  type WeeklyDropChallengeResponse,
  type WeeklyDropChallengeWeek,
} from '@/types/weeklyDropChallenge';

const TOOLTIP_WIDTH = 280;
const TOOLTIP_GAP = 10;
const VIEWPORT_PAD = 12;

const formatRoi = (roi: number | null | undefined): string => {
  if (roi == null) return '∞';
  const sign = roi > 0 ? '+' : '';
  return `${sign}${roi.toFixed(1)}%`;
};

const formatWeekDate = (isoDate: string): string => {
  if (!isoDate) return '';
  const d = new Date(isoDate.includes('T') ? isoDate : `${isoDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const StatRow = ({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) => (
  <div className="flex items-baseline justify-between gap-4 py-3 border-b border-steam-border/40 last:border-0">
    <span className="text-steam-secondary text-sm font-medium">{label}</span>
    <span
      className={`font-mono text-right tabular-nums ${
        emphasize ? 'text-steam-accent text-lg font-bold' : 'text-steam-text text-base font-semibold'
      }`}
    >
      {value}
    </span>
  </div>
);

const WeekDropsList = ({ week }: { week: WeeklyDropChallengeWeek }) => {
  if (!week.claimed || week.drops.length === 0) {
    return (
      <p className="text-sm text-steam-secondary">
        {week.is_future
          ? "This week hasn't started yet."
          : week.is_current
            ? 'No drop logged for this week yet.'
            : 'Missed — no drop logged.'}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {week.drops.map((drop) => (
        <li
          key={drop.id || `${drop.name}-${drop.transaction_date}`}
          className="flex items-center gap-3 rounded-xl bg-steam-elevated/60 border border-steam-border/50 px-3 py-2"
        >
          <ItemImage
            src={drop.icon_url}
            alt={drop.name}
            wrapperClassName="w-10 h-10 rounded-lg shrink-0 bg-steam-bg"
            className="max-w-[85%] max-h-[85%] object-contain"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-steam-text truncate">{drop.name}</p>
            {drop.quantity > 1 && (
              <p className="text-[10px] text-steam-tertiary">×{drop.quantity}</p>
            )}
          </div>
          <span className="font-mono text-sm font-semibold text-steam-accent tabular-nums shrink-0">
            {formatCurrency(drop.value)}
          </span>
        </li>
      ))}
    </ul>
  );
};

type HoverState = {
  week: WeeklyDropChallengeWeek;
  rect: DOMRect;
};

const WeekHoverPortal = ({
  hover,
  onClose,
}: {
  hover: HoverState | null;
  onClose: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!hover) {
      setPos(null);
      return;
    }

    const measure = () => {
      const { rect } = hover;
      const cardH = cardRef.current?.offsetHeight ?? 160;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      left = Math.max(VIEWPORT_PAD, Math.min(left, vw - TOOLTIP_WIDTH - VIEWPORT_PAD));

      const spaceBelow = vh - rect.bottom - TOOLTIP_GAP;
      const spaceAbove = rect.top - TOOLTIP_GAP;
      const placeBelow = spaceBelow >= cardH || spaceBelow >= spaceAbove;

      let top = placeBelow ? rect.bottom + TOOLTIP_GAP : rect.top - TOOLTIP_GAP - cardH;
      top = Math.max(VIEWPORT_PAD, Math.min(top, vh - cardH - VIEWPORT_PAD));

      setPos({ top, left });
    };

    measure();
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [hover]);

  useEffect(() => {
    if (!hover) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hover, onClose]);

  if (!hover || typeof document === 'undefined') return null;

  const { week } = hover;

  return createPortal(
    <div
      ref={cardRef}
      role="tooltip"
      className="pointer-events-none fixed z-[9999] hidden md:block"
      style={{
        width: TOOLTIP_WIDTH,
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        visibility: pos ? 'visible' : 'hidden',
      }}
    >
      <div className="rounded-xl border border-steam-border bg-steam-card/95 backdrop-blur-md shadow-2xl p-3.5 text-left">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary">
            Week {week.week_index}
          </span>
          <span className="font-mono text-sm font-bold text-steam-accent tabular-nums">
            {week.claimed ? formatCurrency(week.value) : '—'}
          </span>
        </div>

        {week.claimed && week.drops.length > 0 ? (
          <ul className="space-y-2">
            {week.drops.slice(0, 5).map((drop) => (
              <li key={drop.id || drop.name} className="flex items-start gap-2.5 min-w-0">
                <ItemImage
                  src={drop.icon_url}
                  alt=""
                  wrapperClassName="w-8 h-8 rounded-md shrink-0 bg-steam-bg mt-0.5"
                  className="max-w-full max-h-full object-contain"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-steam-text leading-snug break-words">{drop.name}</p>
                </div>
                <span className="font-mono text-[11px] text-steam-secondary tabular-nums shrink-0 pt-0.5">
                  {formatCurrency(drop.value)}
                </span>
              </li>
            ))}
            {week.drops.length > 5 && (
              <li className="text-[10px] text-steam-tertiary pl-10">
                +{week.drops.length - 5} more
              </li>
            )}
          </ul>
        ) : (
          <p className="text-xs text-steam-secondary">
            {week.is_future ? 'Upcoming' : week.is_current ? 'Not logged yet' : 'Missed'}
          </p>
        )}

        <p className="text-[10px] text-steam-tertiary mt-3 pt-2 border-t border-steam-border/50">
          Click for details
        </p>
      </div>
    </div>,
    document.body,
  );
};

const WeeklyDropChallengePage = () => {
  const { user } = useAuth();
  const resetTime = useWeeklyReset();
  const [data, setData] = useState<WeeklyDropChallengeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<WeeklyDropChallengeWeek | null>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const hoverClearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHoverSoon = useCallback(() => {
    if (hoverClearTimer.current) clearTimeout(hoverClearTimer.current);
    hoverClearTimer.current = setTimeout(() => setHover(null), 80);
  }, []);

  const showHover = useCallback((week: WeeklyDropChallengeWeek, el: HTMLElement) => {
    if (hoverClearTimer.current) clearTimeout(hoverClearTimer.current);
    setHover({ week, rect: el.getBoundingClientRect() });
  }, []);

  useEffect(() => {
    return () => {
      if (hoverClearTimer.current) clearTimeout(hoverClearTimer.current);
    };
  }, []);

  const fetchChallenge = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      const { data: raw, error: rpcError } = await supabase.rpc('get_weekly_drop_challenge');
      if (rpcError) throw rpcError;
      const normalized = normalizeWeeklyDropChallenge(raw);
      setData(normalized);
      setSelectedWeek((prev) => {
        if (!prev) return null;
        return normalized.weeks?.find((w) => w.week_index === prev.week_index) ?? null;
      });
    } catch (err) {
      console.error('Error fetching weekly drop challenge:', err);
      setError('Could not load challenge. Apply the SQL migration if this is a new feature.');
      setData({ has_challenge: false, challenge: null, stats: null });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    void fetchChallenge();
  }, [fetchChallenge]);

  const handleStart = async () => {
    if (!user) return;
    setActionLoading(true);
    setError(null);
    try {
      const { data: raw, error: rpcError } = await supabase.rpc('start_weekly_drop_challenge', {
        p_duration_weeks: 52,
      });
      if (rpcError) throw rpcError;
      const result = raw as { success?: boolean; message?: string };
      if (result && result.success === false) {
        throw new Error(result.message || 'Could not start challenge');
      }
      await fetchChallenge();
    } catch (err) {
      console.error('Error starting challenge:', err);
      setError(err instanceof Error ? err.message : 'Failed to start challenge');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAbandon = async () => {
    if (!user) return;
    if (!window.confirm('Abandon this challenge? Your drop history stays — only the challenge resets.')) {
      return;
    }
    setActionLoading(true);
    try {
      const { error: rpcError } = await supabase.rpc('abandon_weekly_drop_challenge');
      if (rpcError) throw rpcError;
      setSelectedWeek(null);
      setHover(null);
      await fetchChallenge();
    } catch (err) {
      console.error('Error abandoning challenge:', err);
      setError('Failed to abandon challenge');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-steam-accent">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const active = data?.has_challenge && data.challenge?.status === 'active';
  const completed = data?.has_challenge && data.challenge?.status === 'completed';
  const stats = data?.stats;
  const showStats = (active || completed) && Boolean(stats);
  const weeks = data?.weeks ?? [];
  const progressPct =
    stats && stats.duration_weeks > 0
      ? Math.min(100, (stats.weeks_completed / stats.duration_weeks) * 100)
      : 0;

  return (
    <div className="text-steam-text animate-fade-in pb-10 min-w-0 overflow-x-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-steam-accent mb-2">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">52-week run</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-steam-text mb-1">
            Weekly Drop Challenge
          </h1>
          <p className="text-steam-secondary max-w-xl">
            Log your CS2 weekly drops for a full year. Track value, luck, and consistency — one week at a
            time.
          </p>
        </div>

        {active && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsDropModalOpen(true)}
              className="bg-steam-accent hover:opacity-90 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg theme-shadow-accent"
            >
              <CheckCircle className="w-4 h-4" />
              {stats?.this_week_claimed ? 'Log another drop' : 'Log this week'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {!active && (
        <div className="bg-steam-card rounded-2xl border border-steam-border shadow-xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-steam-accent/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-lg">
            <div className="p-3 bg-steam-accent/15 rounded-xl text-steam-accent w-fit mb-4 border border-steam-accent/20">
              <Trophy className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-steam-text mb-2">
              {completed
                ? 'Challenge complete — start another?'
                : 'Start your year of weekly drops'}
            </h2>
            <p className="text-steam-secondary text-sm mb-6 leading-relaxed">
              Every Wednesday reset is a new slot. Claim and log your drop, build a 52-week record, and see
              how much free inventory value you stack over a year.
            </p>
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => void handleStart()}
              className="bg-steam-accent hover:opacity-90 disabled:opacity-60 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all inline-flex items-center gap-2 shadow-lg theme-shadow-accent"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Start 52-week challenge
            </button>
          </div>
        </div>
      )}

      {showStats && stats && data?.challenge && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-steam-card rounded-2xl border border-steam-border shadow-xl p-6 sm:p-8">
              <div className="flex items-center gap-2 text-steam-accent mb-6">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                  <Package className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs uppercase tracking-widest">Weekly Drop Challenge</span>
              </div>

              <div className="space-y-0">
                <StatRow
                  label="Weeks completed:"
                  value={`${stats.weeks_completed} / ${stats.duration_weeks}`}
                  emphasize
                />
                <StatRow label="Current value:" value={formatCurrency(stats.current_value)} />
                <StatRow
                  label="Highest drop:"
                  value={
                    stats.highest_drop == null ? '—' : formatCurrency(stats.highest_drop)
                  }
                />
                <StatRow
                  label="Lowest drop:"
                  value={stats.lowest_drop == null ? '—' : formatCurrency(stats.lowest_drop)}
                />
                <StatRow label="Average/week:" value={formatCurrency(stats.average_per_week)} />
                <StatRow label="ROI:" value={formatRoi(stats.roi_percentage)} />
              </div>

              <div className="mt-6 pt-4 border-t border-steam-border/50">
                <div className="flex justify-between text-xs text-steam-tertiary mb-2">
                  <span>Progress</span>
                  <span>{progressPct.toFixed(0)}%</span>
                </div>
                <div className="h-2 rounded-full bg-steam-elevated overflow-hidden">
                  <div
                    className="h-full rounded-full bg-steam-accent transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="text-xs text-steam-tertiary mt-3">
                  {completed ? (
                    <>Completed · {stats.weeks_completed} weeks logged</>
                  ) : (
                    <>
                      Week {data.challenge.current_week_index} of {stats.duration_weeks}
                      {stats.this_week_claimed ? ' · this week logged' : ' · awaiting this week'}
                      {' · '}reset in {resetTime || '…'}
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-steam-card rounded-2xl border border-steam-border p-5 flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-steam-tertiary mb-2">
                  Projected yearly
                </p>
                <p className="text-3xl font-bold text-steam-text font-mono tabular-nums">
                  {formatCurrency(stats.projected_yearly)}
                </p>
                <p className="text-xs text-steam-secondary mt-2">
                  Based on your average so far × 52 weeks
                </p>
              </div>
              <div className="bg-steam-card rounded-2xl border border-steam-border p-5 flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-steam-tertiary mb-2">
                  Items logged
                </p>
                <p className="text-3xl font-bold text-steam-text font-mono tabular-nums">
                  {stats.drop_count}
                </p>
                <p className="text-xs text-steam-secondary mt-2">
                  Cases, skins & graffiti counted in this challenge
                </p>
              </div>
              {active && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => void handleAbandon()}
                  className="text-steam-tertiary hover:text-red-400 text-xs font-medium transition-colors self-start px-1"
                >
                  Abandon challenge
                </button>
              )}
            </div>
          </div>

          <div className="bg-steam-card rounded-2xl border border-steam-border shadow-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="font-bold text-lg text-steam-text">Year map</h2>
                <p className="text-xs text-steam-tertiary mt-0.5">
                  Hover for a preview · click a week for full drops
                </p>
              </div>
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-bold text-steam-tertiary">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-steam-accent" /> Claimed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/40 border border-rose-500/50" />{' '}
                  Missed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-steam-elevated/40 border border-dashed border-steam-border" />{' '}
                  Upcoming
                </span>
              </div>
            </div>

            <div className="grid grid-cols-8 sm:grid-cols-[repeat(13,minmax(0,1fr))] gap-1.5 sm:gap-2">
              {weeks.map((w) => {
                const isSelected = selectedWeek?.week_index === w.week_index;
                const isHovered = hover?.week.week_index === w.week_index;
                let cell =
                  'bg-rose-500/15 border border-rose-500/40 text-rose-300 hover:bg-rose-500/25 hover:border-rose-400/60';
                if (w.is_future) {
                  cell =
                    'bg-steam-elevated/30 border border-dashed border-steam-border/60 text-steam-tertiary/60 hover:border-steam-border';
                } else if (w.claimed) {
                  cell =
                    'bg-steam-accent/20 border border-steam-accent/50 text-steam-accent hover:bg-steam-accent/30';
                }
                if (w.is_current) {
                  cell += ' ring-2 ring-steam-accent ring-offset-1 ring-offset-steam-card';
                }
                if (isSelected || isHovered) {
                  cell += ' outline outline-2 outline-offset-1 outline-steam-text';
                }

                return (
                  <button
                    key={w.week_index}
                    type="button"
                    onClick={() => {
                      setHover(null);
                      setSelectedWeek((prev) =>
                        prev?.week_index === w.week_index ? null : w,
                      );
                    }}
                    onMouseEnter={(e) => showHover(w, e.currentTarget)}
                    onMouseLeave={clearHoverSoon}
                    onFocus={(e) => showHover(w, e.currentTarget)}
                    onBlur={clearHoverSoon}
                    aria-pressed={isSelected}
                    aria-label={`Week ${w.week_index}${w.claimed ? `, ${formatCurrency(w.value)}` : ''}`}
                    className={`aspect-square w-full rounded-md flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold cursor-pointer transition-colors ${cell}`}
                  >
                    {w.week_index}
                  </button>
                );
              })}
            </div>

            <WeekHoverPortal hover={hover} onClose={() => setHover(null)} />

            {selectedWeek && (
              <div className="mt-6 pt-5 border-t border-steam-border/50 animate-fade-in">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-bold text-steam-text">
                      Week {selectedWeek.week_index}
                      {selectedWeek.is_current && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider font-bold text-steam-accent">
                          Current
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-steam-tertiary mt-0.5">
                      Week of {formatWeekDate(selectedWeek.week_start)}
                      {selectedWeek.claimed && (
                        <> · Total {formatCurrency(selectedWeek.value)}</>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedWeek(null)}
                    className="p-1.5 rounded-lg text-steam-tertiary hover:text-steam-text hover:bg-steam-hover transition-colors"
                    aria-label="Close week details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <WeekDropsList week={selectedWeek} />
                {active && selectedWeek.is_current && !selectedWeek.claimed && (
                  <button
                    type="button"
                    onClick={() => setIsDropModalOpen(true)}
                    className="mt-4 bg-steam-accent hover:opacity-90 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all inline-flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Log this week
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      <LogDropModal
        isOpen={isDropModalOpen}
        onClose={() => setIsDropModalOpen(false)}
        onSuccess={() => {
          void fetchChallenge();
        }}
      />
    </div>
  );
};

export default WeeklyDropChallengePage;
