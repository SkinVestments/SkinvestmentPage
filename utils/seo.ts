const SITE_ORIGIN = 'https://skinvestments.app';

export const DEFAULT_SEO = {
  title: 'Skinvestments — CS2 Portfolio Tracker',
  description:
    'Free CS2 portfolio tracker for Steam skins. Track inventory value, profits, drops, and market trends on web, iOS, and Android.',
  path: '/',
} as const;

export function setPageSeo({
  title,
  description,
  path = '/',
  robots = 'index, follow',
}: {
  title: string;
  description: string;
  path?: string;
  robots?: string;
}) {
  document.title = title;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.setAttribute('content', description);

  let robotsMeta = document.querySelector('meta[name="robots"]');
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    document.head.appendChild(robotsMeta);
  }
  robotsMeta.setAttribute('content', robots);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute('content', description);

  const twitterTitle = document.querySelector('meta[property="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', title);

  const twitterDescription = document.querySelector('meta[property="twitter:description"]');
  if (twitterDescription) twitterDescription.setAttribute('content', description);

  const canonicalUrl = `${SITE_ORIGIN}${path === '/' ? '/' : path}`;
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

  const twitterUrl = document.querySelector('meta[property="twitter:url"]');
  if (twitterUrl) twitterUrl.setAttribute('content', canonicalUrl);
}
