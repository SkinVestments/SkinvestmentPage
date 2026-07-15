# Skinvestments marketing site + web app

Vite + React SPA. Production origin: https://skinvestments.app

## Run locally

1. `npm install`
2. Copy env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, …)
3. `npm run dev`

## Blog (Supabase CMS)

1. Apply the SQL migration in the Supabase SQL editor:
   [`supabase/migrations/20260715_blog.sql`](supabase/migrations/20260715_blog.sql)
   (creates `blog_posts`, public `blog-images` bucket, RLS for published reads, 2 seed posts).
2. Manage drafts / publish in Table Editor; upload feature images to Storage → `blog-images`.
3. Public routes: `/blog`, `/blog/:slug`.

### SEO + Deploy Hook

At `npm run build`, Vite fetches published posts and writes:

- `dist/blog/{slug}/index.html` — meta / canonical / og:image shells for crawlers
- `dist/sitemap.xml` — marketing URLs + every published slug

After you set a post to **published**, trigger a **Vercel Deploy Hook** (or redeploy) so those shells and the sitemap refresh. Without a rebuild, browsers still get live content from Supabase; crawlers may keep stale meta until the next deploy.
