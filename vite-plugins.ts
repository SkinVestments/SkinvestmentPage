import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import { injectPageSeoHtml, PRERENDER_PAGES } from './utils/seo';

const CACHEABLE = /\.(woff2|woff|ttf|svg|png|webp|jpe?g|gif|ico|css|js)(\?.*)?$/i;

/** Dev + preview: Cache-Control for static assets. Production VPS: use deploy/nginx-cache.conf */
export function cacheHeadersPlugin(): Plugin {
  const middleware = (
    req: { url?: string },
    res: { setHeader: (k: string, v: string) => void },
    next: () => void,
  ) => {
    if (req.url && CACHEABLE.test(req.url.split('?')[0] ?? '')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    next();
  };

  return {
    name: 'cache-headers',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

/** Optional meta tag from AdSense → Sites → Verify → HTML tag method */
export function googleSiteVerificationPlugin(): Plugin {
  return {
    name: 'google-site-verification',
    transformIndexHtml(html) {
      const token = process.env.VITE_GOOGLE_SITE_VERIFICATION;
      if (!token) return html;
      const tag = `<meta name="google-site-verification" content="${token}" />`;
      if (html.includes('google-site-verification')) return html;
      return html.replace('</head>', `    ${tag}\n  </head>`);
    },
  };
}

/** Static HTML shells per public route so crawlers get correct canonical/title without JS. */
export function prerenderPublicPagesPlugin(): Plugin {
  return {
    name: 'prerender-public-pages',
    apply: 'build',
    closeBundle: {
      order: 'post',
      handler() {
        const distDir = path.resolve('dist');
        const indexPath = path.join(distDir, 'index.html');
        if (!fs.existsSync(indexPath)) return;

        const template = fs.readFileSync(indexPath, 'utf-8');

        for (const page of PRERENDER_PAGES) {
          if (page.path === '/') continue;

          const html = injectPageSeoHtml(template, page);
          const routeDir = path.join(distDir, page.path.slice(1));
          fs.mkdirSync(routeDir, { recursive: true });
          fs.writeFileSync(path.join(routeDir, 'index.html'), html);
        }
      },
    },
  };
}

/** Replace blocking stylesheet links with preload + onload (hashed paths from Vite build). */
export function asyncCssPlugin(): Plugin {
  return {
    name: 'async-css',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
        (_, href: string) =>
          `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">` +
          `<noscript><link rel="stylesheet" href="${href}"></noscript>`,
      );
    },
  };
}
