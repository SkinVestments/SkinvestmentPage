export const config = {
  runtime: 'edge',
};

const SITE_ORIGIN = 'https://skinvestments.app';
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/images/og-image.png`;

type PublicPortfolioLite = {
  display_name?: string;
  avatar?: string | null;
  summary?: {
    total_portfolio_value?: number;
    item_count?: number;
  };
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatUsd(value: number): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

async function fetchPublicPortfolio(token: string): Promise<PublicPortfolioLite | null> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return null;

  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/get_public_portfolio`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ p_token: token }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as PublicPortfolioLite | null;
  if (!data || typeof data !== 'object') return null;
  return data;
}

function buildHtml(opts: {
  title: string;
  description: string;
  url: string;
  image: string;
}): string {
  const { title, description, url, image } = opts;
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const u = escapeHtml(url);
  const img = escapeHtml(image);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${t}</title>
  <meta name="description" content="${d}" />
  <meta name="robots" content="noindex, nofollow" />
  <link rel="canonical" href="${u}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Skinvestments" />
  <meta property="og:title" content="${t}" />
  <meta property="og:description" content="${d}" />
  <meta property="og:url" content="${u}" />
  <meta property="og:image" content="${img}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${t}" />
  <meta name="twitter:description" content="${d}" />
  <meta name="twitter:image" content="${img}" />
  <meta http-equiv="refresh" content="0;url=${u}" />
</head>
<body>
  <p><a href="${u}">${t}</a></p>
</body>
</html>`;
}

export default async function handler(req: Request): Promise<Response> {
  const reqUrl = new URL(req.url);
  const token = (reqUrl.searchParams.get('token') || '').trim();
  const shareUrl = token ? `${SITE_ORIGIN}/p/${encodeURIComponent(token)}` : SITE_ORIGIN;

  if (!token || token.length < 16) {
    const html = buildHtml({
      title: 'Shared Portfolio | Skinvestments',
      description: 'This share link is invalid or has been disabled.',
      url: SITE_ORIGIN,
      image: DEFAULT_OG_IMAGE,
    });
    return new Response(html, {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
      },
    });
  }

  let title = 'Shared Portfolio | Skinvestments';
  let description =
    'View a shared CS2 skin portfolio on Skinvestments. Track inventory value and holdings.';
  let image = DEFAULT_OG_IMAGE;

  try {
    const payload = await fetchPublicPortfolio(token);
    if (payload) {
      const name = (payload.display_name || 'Trader').trim() || 'Trader';
      const value = Number(payload.summary?.total_portfolio_value ?? 0);
      const items = Number(payload.summary?.item_count ?? 0);
      title = `${name}'s Portfolio | Skinvestments`;
      description = `${name}'s CS2 portfolio: ${formatUsd(value)} across ${items} item${items === 1 ? '' : 's'}. View on Skinvestments.`;
      if (payload.avatar && typeof payload.avatar === 'string' && payload.avatar.startsWith('http')) {
        image = payload.avatar;
      }
    } else {
      title = 'Share unavailable | Skinvestments';
      description = 'This portfolio share link is invalid or has been disabled.';
    }
  } catch {
    // Keep generic fallback meta.
  }

  const html = buildHtml({ title, description, url: shareUrl, image });
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
