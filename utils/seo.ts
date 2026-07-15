const SITE_ORIGIN = 'https://skinvestments.app';

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  robots?: string;
};

export const PAGE_SEO = {
  home: {
    title: 'Skinvestments — CS2 Portfolio Tracker',
    description:
      'Free CS2 portfolio tracker for Steam skins. Track inventory value, profits, drops, and market trends on web, iOS, and Android.',
    path: '/',
  },
  features: {
    title: 'Features — CS2 Portfolio Tracker | Skinvestments',
    description:
      'CS2 portfolio tracker features: inventory sync, profit analytics, drop tracking, stagnation alerts, and multi-market pricing.',
    path: '/features',
  },
  pricing: {
    title: 'Pricing — CS2 Portfolio Tracker | Skinvestments',
    description:
      'Plans for the Skinvestments CS2 portfolio tracker. Free Starter, Pro, and Pro Max — web dashboard and mobile apps.',
    path: '/pricing',
  },
  faq: {
    title: 'FAQ — CS2 Portfolio Tracker | Skinvestments',
    description:
      'Answers about Skinvestments CS2 portfolio tracker: Steam safety, pricing, subscriptions, exports, and the web dashboard.',
    path: '/faq',
  },
  roadmap: {
    title: 'Roadmap — CS2 Portfolio Tracker | Skinvestments',
    description:
      'Skinvestments product roadmap: Steam inventory sync, multi-market pricing, mobile apps, and upcoming CS2 portfolio tracker features.',
    path: '/roadmap',
  },
  contact: {
    title: 'Contact — CS2 Portfolio Tracker | Skinvestments',
    description:
      'Contact Skinvestments support for help with the CS2 portfolio tracker, billing, privacy requests, and partnership inquiries.',
    path: '/contact',
  },
  privacy: {
    title: 'Privacy Policy — Skinvestments CS2 Portfolio Tracker',
    description:
      'How Skinvestments collects, uses, and protects your data when you use our CS2 portfolio tracker on web and mobile.',
    path: '/privacy',
  },
  terms: {
    title: 'Terms & Conditions — Skinvestments CS2 Portfolio Tracker',
    description:
      'Terms of use for Skinvestments, the CS2 portfolio tracker for Steam skins on web, iOS, and Android.',
    path: '/terms',
  },
} as const satisfies Record<string, PageSeo>;

/** @deprecated Use PAGE_SEO.home */
export const DEFAULT_SEO = PAGE_SEO.home;

/** Public marketing pages that should be pre-rendered for crawlers at build time. */
export const PRERENDER_PAGES = Object.values(PAGE_SEO);

export function canonicalUrl(path: string) {
  return `${SITE_ORIGIN}${path === '/' ? '/' : path}`;
}

export function setPageSeo({
  title,
  description,
  path = '/',
  robots = 'index, follow',
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

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute('content', description);

  const twitterTitle = document.querySelector('meta[property="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', title);

  const twitterDescription = document.querySelector('meta[property="twitter:description"]');
  if (twitterDescription) twitterDescription.setAttribute('content', description);

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

/** Inject per-route SEO tags into the built index.html shell (build-time prerender). */
export function injectPageSeoHtml(html: string, { title, description, path, robots = 'index, follow' }: PageSeo) {
  const url = canonicalUrl(path);

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="title" content="[^"]*">/,
      `<meta name="title" content="${title}">`,
    )
    .replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${description}">`,
    )
    .replace(
      /<meta name="robots" content="[^"]*" \/>/,
      `<meta name="robots" content="${robots}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*">/,
      `<meta property="og:url" content="${url}">`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*">/,
      `<meta property="og:title" content="${title}">`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*">/,
      `<meta property="og:description" content="${description}">`,
    )
    .replace(
      /<meta property="twitter:url" content="[^"]*">/,
      `<meta property="twitter:url" content="${url}">`,
    )
    .replace(
      /<meta property="twitter:title" content="[^"]*">/,
      `<meta property="twitter:title" content="${title}">`,
    )
    .replace(
      /<meta property="twitter:description" content="[^"]*">/,
      `<meta property="twitter:description" content="${description}">`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${url}" />`,
    );
}
