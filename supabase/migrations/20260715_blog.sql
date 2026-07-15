-- Blog CMS for Skinvestments (apply in Supabase SQL editor or via CLI)
-- After publishing a post: trigger a Vercel Deploy Hook so build regenerates
-- /blog/{slug}/index.html shells and sitemap.xml for crawlers.

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body_md text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('idea', 'draft', 'scheduled', 'published', 'archived')),
  published_at timestamptz,
  scheduled_for timestamptz,
  feature_image_path text,
  feature_image_alt text,
  meta_title text,
  meta_description text,
  canonical_path text,
  og_image_path text,
  tags text[] NOT NULL DEFAULT '{}',
  author_name text NOT NULL DEFAULT 'Skinvestments',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT blog_posts_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE INDEX IF NOT EXISTS blog_posts_status_published_at_idx
  ON public.blog_posts (status, published_at DESC NULLS LAST);

CREATE OR REPLACE FUNCTION public.set_blog_posts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS blog_posts_set_updated_at ON public.blog_posts;
CREATE TRIGGER blog_posts_set_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_blog_posts_updated_at();

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published blog posts" ON public.blog_posts;
CREATE POLICY "Public read published blog posts"
  ON public.blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published'
    AND (published_at IS NULL OR published_at <= now())
  );

-- No INSERT/UPDATE/DELETE for anon/authenticated — use service role or Dashboard.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read blog images" ON storage.objects;
CREATE POLICY "Public read blog images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'blog-images');

-- Seed: 2 English posts (no feature images — OG fallback used until you upload)
INSERT INTO public.blog_posts (
  slug,
  title,
  excerpt,
  body_md,
  status,
  published_at,
  meta_title,
  meta_description,
  tags,
  feature_image_alt
) VALUES
(
  'track-cs2-inventory-value',
  'How to Track Your CS2 Inventory Value Like an Investor',
  'Treat your Counter-Strike 2 skins as a portfolio: what to measure, which markets matter, and how Skinvestments helps.',
  $md$
## Why inventory value matters

CS2 skins are liquid digital assets. Without a clear view of **cost basis**, **current market value**, and **unrealized P&L**, you are guessing — not investing.

A solid tracker answers three questions:

1. What is my inventory worth today across Steam, Skinport, and Buff163?
2. Am I up or down versus what I paid (or trade-up cost)?
3. Which items are stagnating vs. moving with the market?

## Multi-market pricing

Steam Community Market prices often lag third-party sites. Cross-checking **Skinport** and **Buff163** gives a more realistic exit price — especially for mid-tier and high-float pieces.

## What to log

- Purchase or trade-in date and cost
- Storage unit contents (easy to forget “hidden” value)
- Weekly drops and their sell-through
- Moves between markets (Steam → third party)

## How Skinvestments helps

[Skinvestments](https://skinvestments.app/) syncs public Steam inventory data (no password), charts portfolio value over time, and aggregates multi-market pricing so you can treat skins like an asset class — on web, iOS, and Android.

Ready to see your numbers? [Open the dashboard](https://skinvestments.app/login) or explore [features](https://skinvestments.app/features).
$md$,
  'published',
  now() - interval '2 days',
  'How to Track CS2 Inventory Value | Skinvestments',
  'Learn how to track CS2 skin inventory value across Steam, Skinport, and Buff163 — cost basis, P&L, and multi-market pricing.',
  ARRAY['cs2', 'inventory', 'portfolio', 'investing'],
  'CS2 skin portfolio tracking concept'
),
(
  'steam-vs-skinport-vs-buff163',
  'Steam vs Skinport vs Buff163: Pricing for CS2 Investors',
  'A practical comparison of the three price sources Skinvestments uses — and when each one matters for your portfolio.',
  $md$
## Three markets, three realities

CS2 investors rarely look at a single price feed. Liquidity, fees, and regional demand create spreads.

### Steam Community Market

- Convenient for casual sellers
- Often the slowest to reprice after news or case drops
- Fees cut into net proceeds

### Skinport

- Strong Western liquidity for many popular skins
- Useful as a “realistic sell” reference for EU/US-facing inventory

### Buff163

- Deep Chinese-market liquidity
- Frequently the tightest bid/ask on sought-after items
- Important when your thesis depends on global demand

## Building a portfolio view

For **holdings valuation**, averaging or preferring the most liquid venue per item often beats Steam-only quotes. For **exit planning**, match the market you will actually sell on.

Skinvestments aggregates public signals from all three so your [portfolio dashboard](https://skinvestments.app/features) reflects how the market really trades — not just one listing page.

Compare plans on [Pricing](https://skinvestments.app/pricing), or [sign in](https://skinvestments.app/login) to sync your inventory.
$md$,
  'published',
  now() - interval '1 day',
  'Steam vs Skinport vs Buff163 Pricing | Skinvestments',
  'Compare Steam, Skinport, and Buff163 for CS2 skin pricing — liquidity, fees, and how to value a portfolio.',
  ARRAY['cs2', 'pricing', 'skinport', 'buff163', 'steam'],
  'Multi-market CS2 skin pricing'
)
ON CONFLICT (slug) DO NOTHING;

COMMENT ON TABLE public.blog_posts IS
  'Marketing blog. Publish → trigger Vercel Deploy Hook to refresh prerendered SEO shells + sitemap.';
