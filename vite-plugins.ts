import type { Plugin } from 'vite';

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
