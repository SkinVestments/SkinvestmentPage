import fs from 'fs';
import path from 'path';
import { loadEnv, type Plugin } from 'vite';
import {
  canonicalUrl,
  injectPageSeoHtml,
  PRERENDER_PAGES,
  SITE_ORIGIN,
  type PageSeo,
} from './utils/seo';

const CACHEABLE = /\.(woff2|woff|ttf|svg|png|webp|jpe?g|gif|ico|css|js)(\?.*)?$/i;

type BlogPostSeoRow = {
  slug: string;
  title: string;
  excerpt: string;
  meta_title: string | null;
  meta_description: string | null;
  feature_image_path: string | null;
  og_image_path: string | null;
  published_at: string | null;
  updated_at: string;
  canonical_path: string | null;
};

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

function blogStoragePublicUrl(supabaseUrl: string, objectPath: string | null | undefined) {
  if (!objectPath) return undefined;
  return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/blog-images/${objectPath}`;
}

async function fetchPublishedBlogPostsForBuild(mode: string): Promise<BlogPostSeoRow[]> {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const anonKey = env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    console.warn(
      '[prerender] Skipping blog shells: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set',
    );
    return [];
  }

  const query =
    'slug,title,excerpt,meta_title,meta_description,feature_image_path,og_image_path,published_at,updated_at,canonical_path';
  const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/blog_posts?status=eq.published&select=${query}&order=published_at.desc.nullslast`;

  try {
    const res = await fetch(url, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      console.warn(`[prerender] Blog fetch failed: ${res.status} ${await res.text()}`);
      return [];
    }
    return (await res.json()) as BlogPostSeoRow[];
  } catch (err) {
    console.warn('[prerender] Blog fetch error:', err);
    return [];
  }
}

function blogPostToPageSeo(post: BlogPostSeoRow, supabaseUrl: string): PageSeo {
  const postPath = post.canonical_path || `/blog/${post.slug}`;
  return {
    title: post.meta_title || `${post.title} | Skinvestments`,
    description: post.meta_description || post.excerpt,
    path: postPath,
    ogImage:
      blogStoragePublicUrl(supabaseUrl, post.og_image_path) ||
      blogStoragePublicUrl(supabaseUrl, post.feature_image_path),
  };
}

function formatSitemapLastmod(iso: string | null | undefined) {
  if (!iso) return new Date().toISOString().slice(0, 10);
  return iso.slice(0, 10);
}

function buildSitemapXml(
  marketing: { path: string; lastmod: string; changefreq: string; priority: string }[],
  posts: BlogPostSeoRow[],
) {
  const urls = [
    ...marketing.map(
      (p) => `  <url>
    <loc>${canonicalUrl(p.path)}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
    ),
    ...posts.map((post) => {
      const loc = canonicalUrl(post.canonical_path || `/blog/${post.slug}`);
      const lastmod = formatSitemapLastmod(post.updated_at || post.published_at);
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

/** Static HTML shells per public route so crawlers get correct canonical/title without JS. */
export function prerenderPublicPagesPlugin(): Plugin {
  let buildMode = 'production';

  return {
    name: 'prerender-public-pages',
    apply: 'build',
    configResolved(config) {
      buildMode = config.mode;
    },
    closeBundle: {
      order: 'post',
      async handler() {
        const distDir = path.resolve('dist');
        const indexPath = path.join(distDir, 'index.html');
        if (!fs.existsSync(indexPath)) return;

        const template = fs.readFileSync(indexPath, 'utf-8');
        const env = { ...loadEnv(buildMode, process.cwd(), ''), ...process.env };
        const supabaseUrl = env.VITE_SUPABASE_URL || '';

        for (const page of PRERENDER_PAGES) {
          if (page.path === '/') continue;

          const html = injectPageSeoHtml(template, page);
          const routeDir = path.join(distDir, page.path.slice(1));
          fs.mkdirSync(routeDir, { recursive: true });
          fs.writeFileSync(path.join(routeDir, 'index.html'), html);
        }

        const posts = await fetchPublishedBlogPostsForBuild(buildMode);
        for (const post of posts) {
          const pageSeo = blogPostToPageSeo(post, supabaseUrl);
          const html = injectPageSeoHtml(template, pageSeo);
          const routeDir = path.join(distDir, 'blog', post.slug);
          fs.mkdirSync(routeDir, { recursive: true });
          fs.writeFileSync(path.join(routeDir, 'index.html'), html);
        }

        if (posts.length) {
          console.log(`[prerender] Wrote ${posts.length} blog post shell(s)`);
        }

        const today = new Date().toISOString().slice(0, 10);
        const sitemap = buildSitemapXml(
          [
            { path: '/', lastmod: today, changefreq: 'weekly', priority: '1.0' },
            { path: '/features', lastmod: today, changefreq: 'monthly', priority: '0.9' },
            { path: '/pricing', lastmod: today, changefreq: 'monthly', priority: '0.8' },
            { path: '/blog', lastmod: today, changefreq: 'weekly', priority: '0.85' },
            { path: '/faq', lastmod: today, changefreq: 'monthly', priority: '0.7' },
            { path: '/roadmap', lastmod: today, changefreq: 'monthly', priority: '0.6' },
            { path: '/contact', lastmod: today, changefreq: 'yearly', priority: '0.5' },
            { path: '/privacy', lastmod: today, changefreq: 'yearly', priority: '0.3' },
            { path: '/terms', lastmod: today, changefreq: 'yearly', priority: '0.3' },
          ],
          posts,
        );
        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
        console.log(`[prerender] Sitemap written (${SITE_ORIGIN}/sitemap.xml)`);
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
