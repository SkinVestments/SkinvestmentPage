import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: false,
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Convert blog markdown to HTML for static crawlable shells (build-time only). */
export function markdownToPrerenderHtml(markdown: string): string {
  const raw = marked.parse(markdown, { async: false }) as string;
  // CMS content is trusted, but strip script/style tags as a hard floor.
  return raw
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
}

export type BlogPrerenderPayload = {
  title: string;
  excerpt: string;
  bodyHtml: string;
  publishedAt: string | null;
  authorName: string;
  featureImageUrl?: string;
  featureImageAlt?: string;
  tags: string[];
  canonicalPath: string;
};

/** Full article markup placed inside #root so non-JS crawlers see the post body. */
export function buildBlogPrerenderArticle(payload: BlogPrerenderPayload): string {
  const date = payload.publishedAt
    ? `<time datetime="${escapeHtml(payload.publishedAt)}">${escapeHtml(
        new Date(payload.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      )}</time>`
    : '';

  const tags =
    payload.tags.length > 0
      ? `<p>${escapeHtml(payload.tags.join(' · '))}</p>`
      : '';

  const figure = payload.featureImageUrl
    ? `<figure><img src="${escapeHtml(payload.featureImageUrl)}" alt="${escapeHtml(
        payload.featureImageAlt || payload.title,
      )}" /></figure>`
    : '';

  return `<article>
<header>
<p><a href="/blog">All posts</a></p>
${date ? `<p>${date} · ${escapeHtml(payload.authorName)}</p>` : `<p>${escapeHtml(payload.authorName)}</p>`}
<h1>${escapeHtml(payload.title)}</h1>
${payload.excerpt ? `<p>${escapeHtml(payload.excerpt)}</p>` : ''}
${tags}
</header>
${figure}
${payload.bodyHtml}
<aside>
<h2>Track your CS2 portfolio</h2>
<p>Skinvestments syncs Steam inventory, multi-market prices, and P&amp;L — free to start.</p>
<p><a href="/login">Sign in</a> · <a href="/features">Features</a> · <a href="/pricing">Pricing</a></p>
</aside>
</article>`;
}

export function buildBlogPostingJsonLd(payload: BlogPrerenderPayload, imageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: payload.title,
    description: payload.excerpt,
    datePublished: payload.publishedAt ?? undefined,
    author: {
      '@type': 'Organization',
      name: payload.authorName || 'Skinvestments',
    },
    image: [imageUrl],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://skinvestments.app${payload.canonicalPath}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Skinvestments',
      url: 'https://skinvestments.app/',
    },
  };
}
