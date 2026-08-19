export type WeeklyDropChallengeStatus = 'active' | 'completed' | 'abandoned';

export interface WeeklyDropChallengeMeta {
  id: string;
  started_at: string;
  ends_at: string;
  duration_weeks: number;
  status: WeeklyDropChallengeStatus;
  completed_at: string | null;
  current_week_index: number;
}

export interface WeeklyDropChallengeStats {
  weeks_completed: number;
  duration_weeks: number;
  current_value: number;
  highest_drop: number | null;
  lowest_drop: number | null;
  average_per_week: number;
  roi_percentage: number | null;
  drop_count: number;
  this_week_claimed: boolean;
  projected_yearly: number;
}

export interface WeeklyDropChallengeDropItem {
  id: string;
  name: string;
  icon_url: string | null;
  value: number;
  quantity: number;
  transaction_date: string;
}

export interface WeeklyDropChallengeWeek {
  week_index: number;
  week_start: string;
  claimed: boolean;
  value: number;
  drops: WeeklyDropChallengeDropItem[];
  is_current: boolean;
  is_future: boolean;
}

export interface WeeklyDropChallengeResponse {
  has_challenge: boolean;
  challenge: WeeklyDropChallengeMeta | null;
  stats: WeeklyDropChallengeStats | null;
  weeks?: WeeklyDropChallengeWeek[];
}

const toNumber = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const toNumberOrNull = (v: unknown): number | null => {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export function normalizeWeeklyDropChallenge(raw: unknown): WeeklyDropChallengeResponse {
  if (!raw || typeof raw !== 'object') {
    return { has_challenge: false, challenge: null, stats: null };
  }

  const r = raw as Record<string, unknown>;
  const has = Boolean(r.has_challenge);

  if (!has || !r.challenge) {
    return { has_challenge: false, challenge: null, stats: null };
  }

  const c = r.challenge as Record<string, unknown>;
  const s = (r.stats ?? {}) as Record<string, unknown>;
  const weeksRaw = Array.isArray(r.weeks) ? r.weeks : [];

  const status = String(c.status ?? 'active') as WeeklyDropChallengeStatus;

  return {
    has_challenge: true,
    challenge: {
      id: String(c.id),
      started_at: String(c.started_at ?? ''),
      ends_at: String(c.ends_at ?? ''),
      duration_weeks: toNumber(c.duration_weeks, 52),
      status,
      completed_at: c.completed_at == null ? null : String(c.completed_at),
      current_week_index: toNumber(c.current_week_index, 1),
    },
    stats: {
      weeks_completed: toNumber(s.weeks_completed),
      duration_weeks: toNumber(s.duration_weeks, 52),
      current_value: toNumber(s.current_value),
      highest_drop: toNumberOrNull(s.highest_drop),
      lowest_drop: toNumberOrNull(s.lowest_drop),
      average_per_week: toNumber(s.average_per_week),
      roi_percentage: toNumberOrNull(s.roi_percentage),
      drop_count: toNumber(s.drop_count),
      this_week_claimed: Boolean(s.this_week_claimed),
      projected_yearly: toNumber(s.projected_yearly),
    },
    weeks: weeksRaw.map((w) => {
      const week = w as Record<string, unknown>;
      const dropsRaw = Array.isArray(week.drops) ? week.drops : [];
      return {
        week_index: toNumber(week.week_index),
        week_start: String(week.week_start ?? ''),
        claimed: Boolean(week.claimed),
        value: toNumber(week.value),
        drops: dropsRaw.map((d) => {
          const drop = d as Record<string, unknown>;
          return {
            id: String(drop.id ?? ''),
            name: String(drop.name ?? 'Unknown'),
            icon_url: drop.icon_url == null ? null : String(drop.icon_url),
            value: toNumber(drop.value),
            quantity: toNumber(drop.quantity, 1),
            transaction_date: String(drop.transaction_date ?? ''),
          };
        }),
        is_current: Boolean(week.is_current),
        is_future: Boolean(week.is_future),
      };
    }),
  };
}
