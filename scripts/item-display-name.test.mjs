import test from 'node:test';
import assert from 'node:assert/strict';

const WEAR_MAP = [
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
];

const CATEGORY_LABELS = {
  skins: 'Skins',
  stickers: 'Stickers',
  cases: 'Cases',
};

function categoryLabel(category) {
  if (!category) return 'Item';
  return CATEGORY_LABELS[category] ?? category;
}

function parseMarketHashName(marketHashName, category) {
  let raw = String(marketHashName ?? '').trim();
  if (!raw) return { title: 'Untitled item', subtitle: categoryLabel(category) };

  const prefixes = [];
  const tryPrefix = (p, keep = p) => {
    if (raw.startsWith(p)) {
      prefixes.push(keep);
      raw = raw.slice(p.length).replace(/^\s+/, '');
      return true;
    }
    return false;
  };

  tryPrefix('StatTrak™', 'StatTrak™');
  if (!prefixes.includes('StatTrak™')) tryPrefix('StatTrak', 'StatTrak™');
  tryPrefix('Souvenir', 'Souvenir');
  tryPrefix('★', '★');

  let wear = null;
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
  if (wear) return { title, subtitle: wear };
  return {
    title: star && !title.startsWith('★') ? `★ ${title}` : title,
    subtitle: categoryLabel(category),
  };
}

test('skin with wear becomes title + weapon · code', () => {
  const r = parseMarketHashName('M4A4 | Asiimov (Field-Tested)', 'skins');
  assert.equal(r.title, 'Asiimov');
  assert.equal(r.subtitle, 'M4A4 · FT');
});

test('StatTrak prefix stays on title', () => {
  const r = parseMarketHashName('StatTrak™ AK-47 | Redline (Field-Tested)', 'skins');
  assert.equal(r.title, 'StatTrak™ Redline');
  assert.equal(r.subtitle, 'AK-47 · FT');
});

test('knife star goes on weapon subtitle', () => {
  const r = parseMarketHashName('★ Karambit | Doppler (Factory New)', 'skins');
  assert.equal(r.title, 'Doppler');
  assert.equal(r.subtitle, '★ Karambit · FN');
});

test('sticker uses category subtitle', () => {
  const r = parseMarketHashName('Sticker | Team Liquid (Holo) | Stockholm 2021', 'stickers');
  assert.equal(r.title, 'Team Liquid (Holo) | Stockholm 2021');
  assert.equal(r.subtitle, 'Stickers');
});

test('case uses category subtitle', () => {
  const r = parseMarketHashName('Revolution Case', 'cases');
  assert.equal(r.title, 'Revolution Case');
  assert.equal(r.subtitle, 'Cases');
});
