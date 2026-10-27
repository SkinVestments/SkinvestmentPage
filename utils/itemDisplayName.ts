/** Wear codes used across catalog / movers UI. */
const WEAR_MAP: Array<{ full: string; short: string }> = [
  { full: 'Factory New', short: 'FN' },
  { full: 'Minimal Wear', short: 'MW' },
  { full: 'Field-Tested', short: 'FT' },
  { full: 'Well-Worn', short: 'WW' },
  { full: 'Battle-Scarred', short: 'BS' },
];

const TYPE_PREFIXES = [
  'Sticker | ',
  'Patch | ',
  'Charm | ',
  'Sealed Graffiti | ',
  'Music Kit | ',
] as const;

/** RPC / filter category keys from get_market_movers. */
export const MARKET_MOVER_CATEGORIES = [
  'skins',
  'stickers',
  'cases',
  'capsules',
  'charms',
  'agents',
  'graffiti',
  'musicKits',
  'patches',
  'packages',
  'tools',
  'collectibles',
  'other',
] as const;

export type MarketMoverCategory = (typeof MARKET_MOVER_CATEGORIES)[number];

const CATEGORY_LABELS: Record<string, string> = {
  skins: 'Skins',
  stickers: 'Stickers',
  cases: 'Cases',
  capsules: 'Capsules',
  charms: 'Charms',
  agents: 'Agents',
  graffiti: 'Graffiti',
  musicKits: 'Music kits',
  patches: 'Patches',
  packages: 'Packages',
  tools: 'Tools',
  collectibles: 'Collectibles',
  other: 'Other',
};

export function categoryLabel(category: string | null | undefined): string {
  if (!category) return 'Item';
  return CATEGORY_LABELS[category] ?? category;
}

export function isMarketMoverCategory(value: string): value is MarketMoverCategory {
  return (MARKET_MOVER_CATEGORIES as readonly string[]).includes(value);
}

/**
 * Split a market hash name into a short skin title and subtitle.
 * Subtitle is "Weapon · FT" when wear exists; otherwise the category label
 * (stickers, cases, etc.).
 */
export function parseMarketHashName(
  marketHashName: string,
  category?: string | null,
): { title: string; subtitle: string } {
  let raw = String(marketHashName ?? '').trim();
  if (!raw) return { title: 'Untitled item', subtitle: categoryLabel(category) };

  const prefixes: string[] = [];
  const tryPrefix = (p: string, keep: string = p) => {
    if (raw.startsWith(p)) {
      prefixes.push(keep);
      raw = raw.slice(p.length).replace(/^\s+/, '');
      return true;
    }
    return false;
  };

  // Order: longer / trademark form first
  tryPrefix('StatTrak™', 'StatTrak™');
  if (!prefixes.includes('StatTrak™')) tryPrefix('StatTrak', 'StatTrak™');
  tryPrefix('Souvenir', 'Souvenir');
  tryPrefix('★', '★');

  let wear: string | null = null;
  for (const { full, short } of WEAR_MAP) {
    const suffix = ` (${full})`;
    if (raw.endsWith(suffix)) {
      wear = short;
      raw = raw.slice(0, -suffix.length).trim();
      break;
    }
  }

  let typeStripped = false;
  for (const tp of TYPE_PREFIXES) {
    if (raw.startsWith(tp)) {
      raw = raw.slice(tp.length);
      typeStripped = true;
      break;
    }
  }

  const star = prefixes.includes('★');
  const namePrefixes = prefixes.filter((p) => p !== '★');
  const prefixStr = namePrefixes.length ? `${namePrefixes.join(' ')} ` : '';

  const pipe = raw.indexOf(' | ');
  if (pipe !== -1 && !typeStripped) {
    const weapon = raw.slice(0, pipe).trim();
    const skin = raw.slice(pipe + 3).trim();
    const title = `${prefixStr}${skin}`.trim() || skin || raw;
    const weaponLabel = star ? `★ ${weapon}` : weapon;
    const subtitle = wear ? `${weaponLabel} · ${wear}` : weaponLabel;
    return { title, subtitle };
  }

  const title = `${prefixStr}${raw}`.trim() || String(marketHashName).trim();
  if (wear) {
    // Rare: wear present but no "Weapon | Skin" split
    return { title, subtitle: wear };
  }

  return {
    title: star && !title.startsWith('★') ? `★ ${title}` : title,
    subtitle: categoryLabel(category),
  };
}
