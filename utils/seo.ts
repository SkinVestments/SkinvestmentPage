const SITE_ORIGIN = 'https://skinvestments.app';
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/images/og-image.png`;

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  robots?: string;
  /** Absolute URL preferred; relative paths are resolved against SITE_ORIGIN. */
  ogImage?: string;
};

export const PAGE_SEO = {
  home: {
    title: 'Skinvestments | CS2 Portfolio Tracker',
    description:
      'Free CS2 portfolio tracker and CS2 skin tracker. Live inventory value, profit tracking, drops, and CS2 economy signals on web, iOS, and Android.',
    path: '/',
  },
  features: {
    title: 'Features - CS2 Inventory Tracker | Skinvestments',
    description:
      'CS2 inventory tracker and CS2 skin tracker features: inventory value, profit analytics, drops, Skinport and Buff163 pricing, stagnation alerts.',
    path: '/features',
  },
  cs2SkinTracker: {
    title: 'CS2 Skin Tracker for Traders | Skinvestments',
    description:
      'The CS2 skin tracker (and CSGO skin tracker alternative) for inventory value, cost basis, profits, drops, and multi-market prices. Free to start.',
    path: '/cs2-skin-tracker',
  },
  pricing: {
    title: 'Free CS2 Portfolio Tracker Pricing | Skinvestments',
    description:
      'Simple pricing for a free CS2 portfolio tracker. Starter is free with no card required. Pro and Pro Max add analytics and exports.',
    path: '/pricing',
  },
  faq: {
    title: 'FAQ - CS2 Portfolio Tracker | Skinvestments',
    description:
      'Frequently asked questions: is Skinvestments free, is it safe, how CS2 skin prices update, and which platforms are supported.',
    path: '/faq',
  },
  roadmap: {
    title: 'Roadmap - CS2 Portfolio Tracker | Skinvestments',
    description:
      'Skinvestments product roadmap: Steam inventory sync, multi-market pricing, mobile apps, and upcoming CS2 portfolio tracker features.',
    path: '/roadmap',
  },
  contact: {
    title: 'Contact - CS2 Portfolio Tracker | Skinvestments',
    description:
      'Contact Skinvestments support for help with the CS2 portfolio tracker, billing, privacy requests, and partnership inquiries.',
    path: '/contact',
  },
  about: {
    title: 'About | Skinvestments by KJ Labs',
    description:
      'Skinvestments is a CS2 portfolio tracker built by KJ Labs Studio. Learn who we are, why we built the product, and how we approach skin valuation.',
    path: '/about',
  },
  privacy: {
    title: 'Privacy Policy | Skinvestments CS2 Portfolio Tracker',
    description:
      'How Skinvestments collects, uses, and protects your data when you use our CS2 portfolio tracker on web and mobile.',
    path: '/privacy',
  },
  terms: {
    title: 'Terms & Conditions | Skinvestments CS2 Portfolio Tracker',
    description:
      'Terms of use for Skinvestments, the CS2 portfolio tracker for Steam skins on web, iOS, and Android.',
    path: '/terms',
  },
  blog: {
    title: 'Blog - CS2 Portfolio Insights | Skinvestments',
    description:
      'Guides on CS2 inventory tracking, multi-market pricing (Steam, Skinport, Buff163), and treating skins like an asset class.',
    path: '/blog',
  },
} as const satisfies Record<string, PageSeo>;

/** @deprecated Use PAGE_SEO.home */
export const DEFAULT_SEO = PAGE_SEO.home;

/** Public marketing pages that should be pre-rendered for crawlers at build time. */
export const PRERENDER_PAGES = Object.values(PAGE_SEO);

export function canonicalUrl(path: string) {
  return `${SITE_ORIGIN}${path === '/' ? '/' : path}`;
}

function resolveOgImage(ogImage?: string) {
  if (!ogImage) return DEFAULT_OG_IMAGE;
  if (ogImage.startsWith('http://') || ogImage.startsWith('https://')) return ogImage;
  return `${SITE_ORIGIN}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;
}

function upsertMeta(
  selector: string,
  attr: 'name' | 'property',
  key: string,
  content: string,
) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function setPageSeo({
  title,
  description,
  path = '/',
  robots = 'index, follow',
  ogImage,
}: PageSeo) {
  document.title = title;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.setAttribute('content', description);

  const titleMeta = document.querySelector('meta[name="title"]');
  if (titleMeta) titleMeta.setAttribute('content', title);

  let robotsMeta = document.querySelector('meta[name="robots"]');
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    document.head.appendChild(robotsMeta);
  }
  robotsMeta.setAttribute('content', robots);

  const url = canonicalUrl(path);
  const image = resolveOgImage(ogImage);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute('content', description);

  const twitterTitle = document.querySelector('meta[property="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', title);

  const twitterDescription = document.querySelector('meta[property="twitter:description"]');
  if (twitterDescription) twitterDescription.setAttribute('content', description);

  upsertMeta('meta[property="og:image"]', 'property', 'og:image', image);
  upsertMeta('meta[property="twitter:image"]', 'property', 'twitter:image', image);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', url);

  const twitterUrl = document.querySelector('meta[property="twitter:url"]');
  if (twitterUrl) twitterUrl.setAttribute('content', url);
}

type InjectPageSeoOptions = PageSeo & {
  /** HTML placed inside #root for crawlers that do not execute JS. */
  rootHtml?: string;
  /** Optional JSON-LD object injected as a script tag in <head>. */
  jsonLd?: Record<string, unknown>;
};

/** Inject per-route SEO tags into the built index.html shell (build-time prerender). */
export function injectPageSeoHtml(
  html: string,
  { title, description, path, robots = 'index, follow', ogImage, rootHtml, jsonLd }: InjectPageSeoOptions,
) {
  const url = canonicalUrl(path);
  const image = resolveOgImage(ogImage);

  let next = html
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<meta name="title" content="[^"]*">/,
      `<meta name="title" content="${escapeAttr(title)}">`,
    )
    .replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${escapeAttr(description)}">`,
    )
    .replace(
      /<meta name="robots" content="[^"]*" \/>/,
      `<meta name="robots" content="${escapeAttr(robots)}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*">/,
      `<meta property="og:url" content="${escapeAttr(url)}">`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*">/,
      `<meta property="og:title" content="${escapeAttr(title)}">`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*">/,
      `<meta property="og:description" content="${escapeAttr(description)}">`,
    )
    .replace(
      /<meta property="og:image" content="[^"]*">/,
      `<meta property="og:image" content="${escapeAttr(image)}">`,
    )
    .replace(
      /<meta property="twitter:url" content="[^"]*">/,
      `<meta property="twitter:url" content="${escapeAttr(url)}">`,
    )
    .replace(
      /<meta property="twitter:title" content="[^"]*">/,
      `<meta property="twitter:title" content="${escapeAttr(title)}">`,
    )
    .replace(
      /<meta property="twitter:description" content="[^"]*">/,
      `<meta property="twitter:description" content="${escapeAttr(description)}">`,
    )
    .replace(
      /<meta property="twitter:image" content="[^"]*">/,
      `<meta property="twitter:image" content="${escapeAttr(image)}">`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${escapeAttr(url)}" />`,
    );

  if (jsonLd) {
    const script = `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`;
    next = next.replace('</head>', `    ${script}\n  </head>`);
  }

  if (rootHtml) {
    next = next.replace(/<div id="root"><\/div>/, `<div id="root">${rootHtml}</div>`);
  }

  return next;
}

function escapeAttr(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export { SITE_ORIGIN, DEFAULT_OG_IMAGE };
