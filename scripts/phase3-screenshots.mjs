/**
 * Phase 3 chrome screenshots (390 / 1440, dark / light), including scrolled frost.
 *
 * Auth: set PHASE3_STORAGE_STATE to a Playwright storageState JSON from a logged-in session
 * so /panel and /inventory render. Without it, dashboard routes redirect to Sign In.
 *
 *   PHASE3_BASE_URL=http://localhost:3000 node scripts/phase3-screenshots.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../docs/design-refresh-phase-3/screenshots');
mkdirSync(outDir, { recursive: true });

const BASE = process.env.PHASE3_BASE_URL || 'http://localhost:5173';
const THEME_KEY = 'skinvestments_theme';
const storageState = process.env.PHASE3_STORAGE_STATE || undefined;
const sharePath = process.env.PHASE3_SHARE_PATH || '/p/demo';

const viewports = [
  { name: '390', width: 390, height: 844 },
  { name: '1440', width: 1440, height: 900 },
];
const themes = ['dark', 'light'];

const browser = await chromium.launch();
for (const theme of themes) {
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      storageState,
    });
    const page = await context.newPage();
    await page.addInitScript(
      ([key, value]) => {
        localStorage.setItem(key, value);
      },
      [THEME_KEY, theme],
    );

    const shots = [
      { path: '/panel', slug: 'panel', scroll: false },
      { path: '/panel', slug: 'panel-scrolled', scroll: true },
      { path: '/inventory', slug: 'inventory', scroll: false },
      { path: '/inventory', slug: 'inventory-scrolled', scroll: true },
      { path: '/settings', slug: 'settings', scroll: false },
      { path: sharePath, slug: 'share', scroll: false },
    ];

    for (const shot of shots) {
      await page.goto(`${BASE}${shot.path}`, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(700);
      if (shot.scroll) {
        await page.evaluate(() => {
          const main = document.querySelector('main');
          if (main && main.scrollHeight > main.clientHeight + 40) {
            main.scrollTop = Math.min(320, main.scrollHeight - main.clientHeight);
          } else {
            window.scrollBy(0, 320);
          }
        });
        await page.waitForTimeout(400);
      }
      const file = join(outDir, `after-${shot.slug}-${vp.name}-${theme}.png`);
      await page.screenshot({ path: file, fullPage: false });
      console.log('wrote', file);
    }
    await context.close();
  }
}
await browser.close();
console.log('done');
