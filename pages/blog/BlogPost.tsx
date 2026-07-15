import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { usePageSeo } from '@/hooks/usePageSeo';
import { MarkdownBody } from '@/components/blog/MarkdownBody';
import {
  fetchPublishedBlogPostBySlug,
  blogImagePublicUrl,
  blogOgImageUrl,
  formatBlogDate,
  blogPostPath,
} from '@/utils/blog';
import { canonicalUrl } from '@/utils/seo';
import type { BlogPost } from '@/types/blog';
import NotFound from '@/pages/NotFound';
import { AdSlot } from '@/components/ads/AdSlot';
import { BlogLoader } from '@/components/blog/BlogLoader';

function BlogPostJsonLd({ post, imageUrl }: { post: BlogPost; imageUrl: string }) {
  useEffect(() => {
    const id = 'blog-posting-jsonld';
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const path = post.canonical_path || blogPostPath(post.slug);
    const data = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.meta_description || post.excerpt,
      datePublished: post.published_at ?? undefined,
      dateModified: post.updated_at,
      author: {
        '@type': 'Organization',
        name: post.author_name || 'Skinvestments',
      },
      image: [imageUrl],
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl(path),
      },
      publisher: {
        '@type': 'Organization',
        name: 'Skinvestments',
        url: 'https://skinvestments.app/',
      },
    };

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [post, imageUrl]);

  return null;
}

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      return;
    }
    let cancelled = false;
    setPost(undefined);
    setError(null);
    (async () => {
      try {
        const data = await fetchPublishedBlogPostBySlug(slug);
        if (!cancelled) setPost(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load post');
          setPost(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const seoPath = post?.canonical_path || (slug ? blogPostPath(slug) : '/blog');
  const seoTitle =
    post?.meta_title || (post ? `${post.title} | Skinvestments` : 'Blog | Skinvestments');
  const seoDescription =
    post?.meta_description ||
    post?.excerpt ||
    'CS2 portfolio insights from Skinvestments.';
  const ogImage = post ? blogOgImageUrl(post) : undefined;

  usePageSeo({
    title: seoTitle,
    description: seoDescription,
    path: seoPath,
    ogImage,
  });

  if (post === undefined) {
    return (
      <div className="min-h-screen bg-steam-bg pt-24 sm:pt-32 pb-20 overflow-x-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <BlogLoader label="Loading article…" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <>
        {error && (
          <p className="sr-only" role="alert">
            {error}
          </p>
        )}
        <NotFound />
      </>
    );
  }

  const featureUrl = blogImagePublicUrl(post.feature_image_path);
  const jsonLdImage = blogOgImageUrl(post);

  return (
    <article className="min-h-screen bg-steam-bg pt-24 sm:pt-32 pb-20 overflow-x-hidden">
      <BlogPostJsonLd post={post} imageUrl={jsonLdImage} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-steam-tertiary hover:text-steam-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All posts
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-steam-tertiary mb-4 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden />
            <time dateTime={post.published_at ?? undefined}>
              {formatBlogDate(post.published_at)}
            </time>
            <span aria-hidden>·</span>
            <span>{post.author_name}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-steam-text tracking-tight mb-5 leading-[1.15]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-steam-secondary text-lg sm:text-xl leading-relaxed">{post.excerpt}</p>
          )}
          {post.tags?.length > 0 && (
            <p className="mt-6 text-[11px] text-steam-tertiary uppercase tracking-[0.14em]">
              {post.tags.join(' · ')}
            </p>
          )}
        </header>

        {featureUrl && (
          <figure className="mb-12 -mx-4 sm:mx-0">
            <img
              src={featureUrl}
              alt={post.feature_image_alt || post.title}
              className="w-full aspect-[16/9] object-cover sm:rounded-lg"
            />
          </figure>
        )}

        <MarkdownBody content={post.body_md} />

        <AdSlot
          slotKey="blogPost"
          className="mt-12"
          contentReady
          minHeight={120}
          showUpgradeHint={false}
        />

        <aside className="mt-16 pt-10 border-t border-steam-border/50">
          <h2 className="font-display text-2xl font-bold text-steam-text mb-3 tracking-tight">
            Track your CS2 portfolio
          </h2>
          <p className="text-steam-secondary mb-6 leading-relaxed">
            Skinvestments syncs Steam inventory, multi-market prices, and P&amp;L — free to start.
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link
              to="/login"
              className="bg-steam-accent hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-sm transition-all"
            >
              Sign in
            </Link>
            <Link
              to="/features"
              className="border border-steam-border text-steam-text hover:border-steam-accent hover:text-steam-accent px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-sm transition-colors"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="border border-steam-border text-steam-text hover:border-steam-accent hover:text-steam-accent px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-sm transition-colors"
            >
              Pricing
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
};

export default BlogPostPage;
