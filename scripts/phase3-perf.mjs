/**
 * Phase 3 performance helpers:
 * - Inventory scroll sample (avg frame interval while scrolling main)
 * - Lighthouse mobile on Panel, Inventory, public share
 *
 *   PHASE3_BASE_URL=http://localhost:3000
 *   PHASE3_STORAGE_STATE=./.auth/storage.json
 *   PHASE3_SHARE_PATH=/p/<token>
 *
 *   node scripts/phase3-perf.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../docs/design-refresh-phase-3');
mkdirSync(outDir, { recursive: true });

const BASE = process.env.PHASE3_BASE_URL || 'http://localhost:5173';
const storageState = process.env.PHASE3_STORAGE_STATE || undefined;
const sharePath = process.env.PHASE3_SHARE_PATH || '/p/demo';
const THEME_KEY = 'skinvestments_theme';

async function measureInventoryScroll() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState,
  });
  const page = await context.newPage();
  await page.addInitScript(
    ([key, value]) => localStorage.setItem(key, value),
    [THEME_KEY, 'dark'],
  );
  await page.goto(`${BASE}/inventory`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(800);

  const result = await page.evaluate(async () => {
    const main = document.querySelector('main') || document.scrollingElement;
    if (!main) return { error: 'no scroll root' };

    const cards = document.querySelectorAll('.inventory-grid-card');
    const candidates = document.querySelectorAll('.inventory-grid-card, tbody tr');
    let frostedRowOrCardCount = 0;
    candidates.forEach((el) => {
      const s = getComputedStyle(el);
      const bf = s.backdropFilter || s.getPropertyValue('backdrop-filter');
      if (bf && bf !== 'none') frostedRowOrCardCount += 1;
    });

    const intervals = [];
    let last = performance.now();
    let raf = 0;
    const loop = (t) => {
      intervals.push(t - last);
      last = t;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const distance = Math.min(2400, Math.max(800, main.scrollHeight - main.clientHeight));
    const steps = 24;
    for (let i = 0; i < steps; i += 1) {
      main.scrollTop = (distance * (i + 1)) / steps;
      await new Promise((r) => setTimeout(r, 16));
    }
    cancelAnimationFrame(raf);

    const avg =
      intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : null;
    return {
      cardCount: cards.length,
      frostedRowOrCardCount,
      frames: intervals.length,
      avgFrameMs: avg != null ? Number(avg.toFixed(2)) : null,
      approxFps: avg != null ? Number((1000 / avg).toFixed(1)) : null,
      scrollDistance: distance,
      href: location.href,
      title: document.title,
    };
  });

  await browser.close();
  return result;
}

function lighthouseScores(path, slug) {
  const url = `${BASE}${path}`;
  const reportPath = join(outDir, `lighthouse-${slug}.json`);
  try {
    execSync(
      `npx --yes lighthouse "${url}" --only-categories=performance --form-factor=mobile --screenEmulation.mobile --output=json --output-path="${reportPath}" --chrome-flags="--headless --no-sandbox" --quiet`,
      { stdio: 'inherit', timeout: 180000 },
    );
    const raw = JSON.parse(readFileSync(reportPath, 'utf8'));
    const perf = raw.categories?.performance?.score;
    const cls = raw.audits?.['cumulative-layout-shift']?.numericValue;
    const lcp = raw.audits?.['largest-contentful-paint']?.numericValue;
    return {
      slug,
      url,
      performance: perf != null ? Math.round(perf * 100) : null,
      cls: cls != null ? Number(cls.toFixed(3)) : null,
      lcpMs: lcp != null ? Math.round(lcp) : null,
      report: reportPath,
    };
  } catch (e) {
    return { slug, url, error: String(e?.message || e) };
  }
}

const scroll = await measureInventoryScroll();
const lighthouse = [
  lighthouseScores('/panel', 'panel'),
  lighthouseScores('/inventory', 'inventory'),
  lighthouseScores(sharePath, 'share'),
];

const summary = {
  capturedAt: new Date().toISOString(),
  base: BASE,
  storageState: Boolean(storageState),
  sharePath,
  inventoryScroll: scroll,
  lighthouse,
  notes: [
    'Phase 1 Lighthouse baselines were not checked into the repo; compare manually if you kept local numbers.',
    'Without PHASE3_STORAGE_STATE, Panel/Inventory may be Sign In redirects.',
  ],
};

const outFile = join(outDir, 'perf-summary.json');
writeFileSync(outFile, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
console.log('wrote', outFile);
