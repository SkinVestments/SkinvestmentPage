import test from 'node:test';
import assert from 'node:assert/strict';

// Lightweight mirrors of model helpers for CI without TS path aliases
const CATEGORY_MATCHERS = [
  { group: 'Cases', fragments: ['case', 'terminal'] },
  { group: 'Capsules', fragments: ['capsule'] },
  { group: 'Packages', fragments: ['package', 'souvenir'] },
  { group: 'Stickers', fragments: ['sticker'] },
  { group: 'Skins', fragments: ['knife', 'glove', 'skin', 'weapon'] },
];

function mapCategoryGroup(raw) {
  const lower = raw.trim().toLowerCase();
  for (const { group, fragments } of CATEGORY_MATCHERS) {
    if (fragments.some((f) => lower.includes(f))) return group;
  }
  return 'Other';
}

function formatSharePct(pct) {
  if (!Number.isFinite(pct) || pct <= 0) return '0%';
  if (pct < 0.1) return '<0.1%';
  const rounded = Math.round(pct * 10) / 10;
  if (Number.isInteger(rounded)) return `${rounded}%`;
  return `${rounded.toFixed(1)}%`;
}

function normalize(rows) {
  const merged = new Map();
  for (const row of rows) {
    const rawCategory = String(row.category ?? '').trim();
    const fullName = String(row.item_name ?? '').trim();
    const value = Number(row.total_value);
    if (!Number.isFinite(value) || value <= 0) continue;
    const key = JSON.stringify([rawCategory, fullName]);
    const prev = merged.get(key);
    if (prev) prev.value += value;
    else merged.set(key, { rawCategory, fullName, value });
  }
  return [...merged.values()];
}

test('Weapon Case maps to Cases before Skins', () => {
  assert.equal(mapCategoryGroup('Weapon Case'), 'Cases');
});

test('Sticker Capsule maps to Capsules', () => {
  assert.equal(mapCategoryGroup('Sticker Capsule'), 'Capsules');
});

test('merges duplicate category+name pairs', () => {
  const rows = normalize([
    { category: 'Skins', item_name: 'AK-47 | Redline (FT)', total_value: 10 },
    { category: 'Skins', item_name: 'AK-47 | Redline (FT)', total_value: '5' },
    { category: 'Skins', item_name: 'AK-47 | Redline (FT)', total_value: -1 },
  ]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].value, 15);
});

test('share percent formatting', () => {
  assert.equal(formatSharePct(0), '0%');
  assert.equal(formatSharePct(0.05), '<0.1%');
  assert.equal(formatSharePct(12), '12%');
  assert.equal(formatSharePct(12.34), '12.3%');
});
