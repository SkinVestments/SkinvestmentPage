/** Rarity tiers aligned with getRarityStyle() in display.ts */
export type RarityTier =
  | 'all'
  | 'contraband'
  | 'covert'
  | 'classified'
  | 'restricted'
  | 'mil-spec'
  | 'industrial'
  | 'consumer'
  | 'other';

export type PnlFilter = 'all' | 'profit' | 'loss' | 'breakeven' | 'unknown';
export type PriceSourceFilter = 'all' | 'steam' | 'buff' | 'skinport' | 'unknown';

export const STEAM_TRADE_HOLD_MS = 7 * 24 * 60 * 60 * 1000;

export const RARITY_FILTER_OPTIONS: { value: RarityTier; label: string }[] = [
  { value: 'all', label: 'All rarities' },
  { value: 'covert', label: 'Covert' },
  { value: 'classified', label: 'Classified' },
  { value: 'restricted', label: 'Restricted' },
  { value: 'mil-spec', label: 'Mil-Spec' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'consumer', label: 'Consumer Grade' },
  { value: 'contraband', label: 'Contraband' },
  { value: 'other', label: 'Other' },
];

export const normalizeRarityTier = (rarity: string | null | undefined): RarityTier => {
  if (!rarity) return 'other';
  const r = rarity.toLowerCase();
  if (r.includes('contraband')) return 'contraband';
  if (r.includes('covert')) return 'covert';
  if (r.includes('classified')) return 'classified';
  if (r.includes('restricted')) return 'restricted';
  if (r.includes('mil-spec')) return 'mil-spec';
  if (r.includes('industrial')) return 'industrial';
  if (r.includes('consumer')) return 'consumer';
  return 'other';
};

export const normalizePriceSource = (source: string | null | undefined): PriceSourceFilter => {
  if (!source) return 'unknown';
  const s = source.toLowerCase();
  if (s.includes('buff')) return 'buff';
  if (s.includes('skinport')) return 'skinport';
  if (s.includes('steam')) return 'steam';
  return 'unknown';
};

export type PnlStatus = 'profit' | 'loss' | 'breakeven' | 'unknown';

export const getPnlStatus = (
  unitPrice: number,
  buyPrice: number | null | undefined,
): { status: PnlStatus; gain: number; gainPct: number | null } => {
  const buy = Number(buyPrice ?? 0);
  if (!buy || buy <= 0) {
    return { status: 'unknown', gain: 0, gainPct: null };
  }
  const gain = unitPrice - buy;
  const gainPct = (gain / buy) * 100;
  if (Math.abs(gain) < 0.005) {
    return { status: 'breakeven', gain: 0, gainPct: 0 };
  }
  return gain > 0
    ? { status: 'profit', gain, gainPct }
    : { status: 'loss', gain, gainPct };
};

/** Trade lock: explicit column, else 7-day hold from acquired_at */
export const isItemTradeLocked = (
  acquiredAt: string | null | undefined,
  tradeLockUntil?: string | null,
): boolean => {
  if (tradeLockUntil) {
    const until = new Date(tradeLockUntil).getTime();
    if (!Number.isNaN(until)) return until > Date.now();
  }
  if (!acquiredAt) return false;
  const acquired = new Date(acquiredAt).getTime();
  if (Number.isNaN(acquired)) return false;
  return acquired + STEAM_TRADE_HOLD_MS > Date.now();
};

export const countActiveFilters = (filters: {
  rarity: RarityTier;
  pnl: PnlFilter;
  priceSource: PriceSourceFilter;
}): number => {
  let n = 0;
  if (filters.rarity !== 'all') n++;
  if (filters.pnl !== 'all') n++;
  if (filters.priceSource !== 'all') n++;
  return n;
};
