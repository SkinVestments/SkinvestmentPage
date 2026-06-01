export interface RarityStyle {
  border: string;
  text: string;
  shadow: string;
  hex: string;
}

const DEFAULT_RARITY: RarityStyle = {
  border: 'border-steam-border',
  text: 'text-steam-secondary',
  shadow: '',
  hex: '#9ca3af',
};

export const getRarityStyle = (rarity: string | null | undefined): RarityStyle => {
  if (!rarity) return DEFAULT_RARITY;

  const r = rarity.toLowerCase();

  if (r.includes('contraband')) {
    return { border: 'border-yellow-500', text: 'text-yellow-500', shadow: 'shadow-yellow-500/20', hex: '#eab308' };
  }
  if (r.includes('covert')) {
    return { border: 'border-red-500', text: 'text-red-500', shadow: 'shadow-red-500/20', hex: '#ef4444' };
  }
  if (r.includes('classified')) {
    return { border: 'border-pink-500', text: 'text-pink-500', shadow: 'shadow-pink-500/20', hex: '#ec4899' };
  }
  if (r.includes('restricted')) {
    return { border: 'border-purple-500', text: 'text-purple-500', shadow: 'shadow-purple-500/20', hex: '#a855f7' };
  }
  if (r.includes('mil-spec')) {
    return { border: 'border-blue-600', text: 'text-blue-500', shadow: 'shadow-blue-500/20', hex: '#3b82f6' };
  }
  if (r.includes('industrial')) {
    return { border: 'border-sky-400', text: 'text-sky-400', shadow: 'shadow-sky-400/20', hex: '#38bdf8' };
  }
  if (r.includes('consumer')) {
    return { border: 'border-steam-border', text: 'text-steam-secondary', shadow: 'shadow-steam-border/20', hex: '#9ca3af' };
  }

  return DEFAULT_RARITY;
};

export const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val ?? 0);
