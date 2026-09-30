import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../docs/design-refresh-phase-1/screenshots');
mkdirSync(outDir, { recursive: true });

const BASE = process.env.PHASE1_BASE_URL || 'http://localhost:5173';
const THEME_KEY = 'skinvestments_theme';

const viewports = [
  { name: '390', width: 390, height: 844 },
  { name: '1440', width: 1440, height: 900 },
];
const themes = ['dark', 'light'];
const routes = [
  { path: '/panel', slug: 'panel' },
  { path: '/history', slug: 'history' },
  { path: '/inventory', slug: 'inventory' },
];

const browser = await chromium.launch();
for (const theme of themes) {
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.addInitScript(
      ([key, value]) => {
        localStorage.setItem(key, value);
      },
      [THEME_KEY, theme],
    );

    for (const route of routes) {
      await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(600);
      const file = join(outDir, `after-${route.slug}-${vp.name}-${theme}.png`);
      await page.screenshot({ path: file, fullPage: false });
      console.log('wrote', file);
    }
    await context.close();
  }
}
await browser.close();
console.log('done');
