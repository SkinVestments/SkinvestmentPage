/** Portfolio Diversity — domain model (stable keys, categories, display names). */

export const TREEMAP_CATEGORY_ORDER = [
  'Cases',
  'Capsules',
  'Packages',
  'Stickers',
  'Patches',
  'Charms',
  'Graffiti',
  'Music kits',
  'Agents',
  'Skins',
  'Collectibles',
  'Tools',
  'Other',
] as const;

export type TreemapCategoryGroup = (typeof TREEMAP_CATEGORY_ORDER)[number];

const CATEGORY_MATCHERS: Array<{ group: TreemapCategoryGroup; fragments: string[] }> = [
  { group: 'Cases', fragments: ['case', 'terminal'] },
  { group: 'Capsules', fragments: ['capsule'] },
  { group: 'Packages', fragments: ['package', 'souvenir'] },
  { group: 'Stickers', fragments: ['sticker'] },
  { group: 'Patches', fragments: ['patch'] },
  { group: 'Charms', fragments: ['charm'] },
  { group: 'Graffiti', fragments: ['graffiti'] },
  { group: 'Music kits', fragments: ['music kit', 'musickit'] },
  { group: 'Agents', fragments: ['agent', 'character'] },
  { group: 'Skins', fragments: ['knife', 'glove', 'skin', 'weapon'] },
  { group: 'Collectibles', fragments: ['pin', 'collectible', 'coin'] },
  { group: 'Tools', fragments: ['key', 'tool', 'tag', 'pass'] },
];

export const TREEMAP_CATEGORY_COLORS: Record<TreemapCategoryGroup, string> = {
  Cases: '#38bdf8',
  Capsules: '#8b5cf6',
  Packages: '#a855f7',
  Stickers: '#ec4899',
  Patches: '#f472b6',
  Charms: '#fb7185',
  Graffiti: '#06b6d4',
  'Music kits': '#14b8a6',
  Agents: '#f59e0b',
  Skins: '#3b82f6',
  Collectibles: '#eab308',
  Tools: '#64748b',
  Other: '#6b7280',
};

export interface TreemapItem {
  /** Stable identity: rawCategory + fullName */
  key: string;
  rawCategory: string;
  category: TreemapCategoryGroup;
  /** Full market hash name (image match + panel) */
  fullName: string;
  /** Short label for tiles */
  displayName: string;
  wearSuffix: string | null;
  value: number;
  portfolioPct: number;
  categoryPct: number;
  iconUrl: string | null;
  fill: string;
}

export interface TreemapCategory {
  key: string;
  name: TreemapCategoryGroup;
  value: number;
  portfolioPct: number;
  fill: string;
  items: TreemapItem[];
}

export interface TreemapPortfolio {
  totalValue: number;
  positionCount: number;
  categoryCount: number;
  categories: TreemapCategory[];
  itemsByKey: Map<string, TreemapItem>;
  categoriesByKey: Map<string, TreemapCategory>;
}

export function makeItemKey(rawCategory: string, fullName: string): string {
  return JSON.stringify([rawCategory, fullName]);
}

export function mapCategoryGroup(raw: string): TreemapCategoryGroup {
  const lower = raw.trim().toLowerCase();
  if (!lower) return 'Other';
  for (const { group, fragments } of CATEGORY_MATCHERS) {
    if (fragments.some((f) => lower.includes(f))) return group;
  }
  // Already a known display group
  const exact = TREEMAP_CATEGORY_ORDER.find((g) => g.toLowerCase() === lower);
  if (exact) return exact;
  return 'Other';
}

const WEAR_MAP: Array<{ full: string; short: string }> = [
  { full: 'Factory New', short: 'FN' },
  { full: 'Minimal Wear', short: 'MW' },
  { full: 'Field-Tested', short: 'FT' },
  { full: 'Well-Worn', short: 'WW' },
  { full: 'Battle-Scarred', short: 'BS' },
];

const PREFIX_STRIP: Array<{ category: TreemapCategoryGroup; prefix: string }> = [
  { category: 'Stickers', prefix: 'Sticker | ' },
  { category: 'Patches', prefix: 'Patch | ' },
  { category: 'Charms', prefix: 'Charm | ' },
  { category: 'Graffiti', prefix: 'Sealed Graffiti | ' },
  { category: 'Music kits', prefix: 'Music Kit | ' },
];

export function displayNameForItem(
  fullName: string,
  category: TreemapCategoryGroup,
): { displayName: string; wearSuffix: string | null } {
  let name = fullName.trim();
  for (const { category: cat, prefix } of PREFIX_STRIP) {
    if (category === cat && name.startsWith(prefix)) {
      name = name.slice(prefix.length);
      break;
    }
  }

  let wearSuffix: string | null = null;
  if (category === 'Skins') {
    for (const { full, short } of WEAR_MAP) {
      const suffix = ` (${full})`;
      if (name.endsWith(suffix)) {
        name = name.slice(0, -suffix.length);
        wearSuffix = short;
        break;
      }
    }
  }

  return { displayName: name || 'Untitled item', wearSuffix };
}

export function shadeItemFill(base: string, index: number, total: number): string {
  const n = parseInt(base.slice(1), 16);
  const step = Math.min(48, Math.floor((index / Math.max(total, 1)) * 40));
  const r = Math.max(0, ((n >> 16) & 0xff) - step);
  const g = Math.max(0, ((n >> 8) & 0xff) - step);
  const b = Math.max(0, (n & 0xff) - step);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function formatSharePct(pct: number): string {
  if (!Number.isFinite(pct) || pct <= 0) return '0%';
  if (pct < 0.1) return '<0.1%';
  const rounded = Math.round(pct * 10) / 10;
  if (Number.isInteger(rounded)) return `${rounded}%`;
  return `${rounded.toFixed(1)}%`;
}

export function categoryOrderIndex(name: TreemapCategoryGroup): number {
  const i = TREEMAP_CATEGORY_ORDER.indexOf(name);
  return i === -1 ? TREEMAP_CATEGORY_ORDER.length : i;
}
