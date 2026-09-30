/**
 * Synthetic 500-card Inventory scroll sample (before/after content-visibility).
 * Loads built CSS from dist/ so tokens match production.
 *
 *   npm run build && node scripts/phase3-inventory-scroll-harness.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'docs/design-refresh-phase-3');
mkdirSync(outDir, { recursive: true });

const cssName = readdirSync(join(root, 'dist/assets')).find((f) => f.endsWith('.css'));
if (!cssName) throw new Error('Run npm run build first (dist CSS missing).');
const css = readFileSync(join(root, 'dist/assets', cssName), 'utf8');

function pageHtml(withContainment) {
  const cardClass = withContainment
    ? 'dashboard-card inventory-grid-card'
    : 'dashboard-card';
  return `<!doctype html>
<html class="dark" data-theme="dark">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>${css}</style>
<style>
  body { margin: 0; background: var(--color-background, #0b0f14); color: var(--color-text-primary, #fff); }
  main { height: 100vh; overflow: auto; padding: 16px; }
  .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .thumb { height: 9rem; background: #111827; border-bottom: 3px solid #334155; }
  .meta { padding: 12px; }
</style>
</head>
<body>
<main>
  <div class="grid" id="grid"></div>
</main>
<script>
  const grid = document.getElementById('grid');
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 500; i++) {
    const el = document.createElement('div');
    el.className = ${JSON.stringify(cardClass)};
    el.innerHTML = '<div class="thumb"></div><div class="meta"><div style="height:2.5rem;font-weight:700;font-size:12px">Item ' + i + ' Example Skin Name</div><div class="num" style="font-weight:700">$12.34</div></div>';
    frag.appendChild(el);
  }
  grid.appendChild(frag);

  window.__scrollSample = async () => {
    const main = document.querySelector('main');
    const intervals = [];
    let last = performance.now();
    let raf = 0;
    const loop = (t) => { intervals.push(t - last); last = t; raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const distance = Math.min(4000, main.scrollHeight - main.clientHeight);
    const steps = 40;
    for (let i = 0; i < steps; i++) {
      main.scrollTop = (distance * (i + 1)) / steps;
      await new Promise((r) => setTimeout(r, 16));
    }
    cancelAnimationFrame(raf);
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    let frosted = 0;
    document.querySelectorAll('.dashboard-card').forEach((el) => {
      const bf = getComputedStyle(el).backdropFilter;
      if (bf && bf !== 'none') frosted += 1;
    });
    return {
      withContainment: ${withContainment ? 'true' : 'false'},
      cards: document.querySelectorAll('.dashboard-card').length,
      frostedCards: frosted,
      avgFrameMs: Number(avg.toFixed(2)),
      approxFps: Number((1000 / avg).toFixed(1)),
      scrollDistance: distance,
    };
  };
</script>
</body>
</html>`;
}

function serveHtml(html) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, url: `http://127.0.0.1:${port}/` });
    });
  });
}

async function sample(withContainment) {
  const { server, url } = await serveHtml(pageHtml(withContainment));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(200);
  const result = await page.evaluate(() => window.__scrollSample());
  await browser.close();
  server.close();
  return result;
}

const before = await sample(false);
const after = await sample(true);
const summary = {
  capturedAt: new Date().toISOString(),
  scenario: '500 synthetic inventory grid cards @ 390x844',
  beforeContentVisibility: before,
  afterContentVisibility: after,
  confirmation: {
    frostedCardsBefore: before.frostedCards,
    frostedCardsAfter: after.frostedCards,
    note: 'Both must be 0 (no backdrop-filter on cards).',
  },
};

const outFile = join(outDir, 'inventory-scroll-500.json');
writeFileSync(outFile, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
console.log('wrote', outFile);
