import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { usePageSeo } from '@/hooks/usePageSeo';
import { PAGE_SEO } from '@/utils/seo';
import {
  fetchPublishedBlogPosts,
  blogImagePublicUrl,
  formatBlogDate,
  blogPostPath,
} from '@/utils/blog';
import type { BlogPostListItem } from '@/types/blog';
import { AdSlot } from '@/components/ads/AdSlot';
import { BlogLoader } from '@/components/blog/BlogLoader';

function primaryTag(tags: string[] | null | undefined) {
  if (!tags?.length) return null;
  return tags[0];
}

function BlogCover({
  post,
  className = '',
  featured = false,
}: {
  post: BlogPostListItem;
  className?: string;
  featured?: boolean;
}) {
  const imageUrl = blogImagePublicUrl(post.feature_image_path);
  const tag = primaryTag(post.tags);

  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden bg-steam-elevated ${className}`}>
        <img
          src={imageUrl}
          alt={post.feature_image_alt || post.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading={featured ? 'eager' : 'lazy'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-steam-bg/50 via-transparent to-transparent opacity-80 pointer-events-none" />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background:
          'linear-gradient(145deg, color-mix(in srgb, var(--color-accent) 22%, var(--color-surface)) 0%, var(--color-surface-elevated) 48%, var(--color-background) 100%)',
      }}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-[0.08] bg-[url('/noise.svg')]" />
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-steam-accent/15 blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between gap-3">
        <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-steam-accent">
          Skinvestments
        </span>
        {tag && (
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.16em] text-steam-text/50">
            {tag}
          </span>
        )}
      </div>
    </div>
  );
}

const BlogIndex: React.FC = () => {
  usePageSeo(PAGE_SEO.blog);

  const [posts, setPosts] = useState<BlogPostListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPublishedBlogPosts();
        if (!cancelled) setPosts(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load posts');
          setPosts([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = posts?.[0] ?? null;
  const rest = posts?.slice(1) ?? [];

  return (
    <div className="min-h-screen bg-steam-bg pt-24 sm:pt-32 pb-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <header className="mb-12 sm:mb-16 border-b border-steam-border/50 pb-10">
          <p className="font-display text-steam-accent text-xs font-bold uppercase tracking-[0.28em] mb-4">
            Skinvestments Journal
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-steam-text tracking-tight leading-[1.05] max-w-xl">
              CS2 portfolio insights
            </h1>
            <p className="text-steam-secondary text-base sm:text-lg leading-relaxed max-w-md lg:text-right">
              Inventory tracking, multi-market pricing, and treating skins like an asset class.
            </p>
          </div>
        </header>

        {error && (
          <p className="text-steam-loss mb-8" role="alert">
            {error}
          </p>
        )}

        {posts === null && <BlogLoader label="Loading journal…" />}

        {posts && posts.length === 0 && !error && (
          <p className="text-steam-tertiary">No posts published yet. Check back soon.</p>
        )}

        {featured && (
          <section aria-label="Featured article" className="mb-16 sm:mb-20">
            <Link
              to={blogPostPath(featured.slug)}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 focus:outline-none focus-visible:ring-2 focus-visible:ring-steam-accent focus-visible:ring-offset-4 focus-visible:ring-offset-steam-bg"
            >
              <BlogCover
                post={featured}
                featured
                className="lg:col-span-7 aspect-[16/10] lg:aspect-auto lg:min-h-[380px]"
              />
              <div className="lg:col-span-5 flex flex-col justify-center min-w-0 border-l-0 lg:border-l-2 lg:border-steam-accent/80 lg:pl-10">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-steam-tertiary mb-4">
                  {primaryTag(featured.tags) && (
                    <span className="text-steam-accent font-semibold">{primaryTag(featured.tags)}</span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" aria-hidden />
                    <time dateTime={featured.published_at ?? undefined}>
                      {formatBlogDate(featured.published_at)}
                    </time>
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-steam-text tracking-tight leading-[1.15] mb-4 group-hover:text-steam-accent transition-colors">
                  {featured.title}
                </h2>
                <p className="text-steam-secondary text-base sm:text-lg leading-relaxed mb-8 line-clamp-4">
                  {featured.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-steam-accent">
                  Read featured
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </div>
            </Link>
          </section>
        )}

        {rest.length > 0 && (
          <section aria-label="More articles">
            <div className="flex items-baseline justify-between gap-4 mb-8 border-b border-steam-border/50 pb-4">
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.22em] text-steam-text">
                More articles
              </h2>
              <span className="text-xs text-steam-tertiary uppercase tracking-wider">
                {rest.length} {rest.length === 1 ? 'post' : 'posts'}
              </span>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 list-none p-0 m-0">
              {rest.map((post) => (
                <li key={post.id}>
                  <Link
                    to={blogPostPath(post.slug)}
                    className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-steam-accent focus-visible:ring-offset-2 focus-visible:ring-offset-steam-bg"
                  >
                    <BlogCover post={post} className="aspect-[16/10] mb-5" />
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.16em] text-steam-tertiary mb-3">
                      {primaryTag(post.tags) && (
                        <span className="text-steam-accent font-semibold">{primaryTag(post.tags)}</span>
                      )}
                      <time dateTime={post.published_at ?? undefined}>
                        {formatBlogDate(post.published_at)}
                      </time>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-steam-text tracking-tight leading-snug mb-3 group-hover:text-steam-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-steam-secondary leading-relaxed mb-5 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-steam-accent">
                      Read article
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {posts !== null && posts.length > 0 && (
          <AdSlot
            slotKey="blogIndex"
            className="mt-14 sm:mt-16"
            contentReady
            minHeight={120}
            showUpgradeHint={false}
          />
        )}
      </div>
    </div>
  );
};

export default BlogIndex;
