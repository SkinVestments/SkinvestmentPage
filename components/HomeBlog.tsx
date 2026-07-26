import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import {
  fetchPublishedBlogPosts,
  formatBlogDate,
  blogPostPath,
} from '@/utils/blog';
import type { BlogPostListItem } from '@/types/blog';

export const HomeBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPublishedBlogPosts();
        if (!cancelled) setPosts(data.slice(0, 3));
      } catch {
        if (!cancelled) setPosts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-steam-bg border-t border-steam-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-steam-text tracking-tight">
              CS2 portfolio guides
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-steam-accent hover:opacity-90"
          >
            All articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 list-none p-0 m-0">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                to={blogPostPath(post.slug)}
                className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-steam-accent focus-visible:ring-offset-2 focus-visible:ring-offset-steam-bg"
              >
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-steam-tertiary mb-3">
                  <Calendar className="w-3.5 h-3.5" aria-hidden />
                  <time dateTime={post.published_at ?? undefined}>
                    {formatBlogDate(post.published_at)}
                  </time>
                </div>
                <h3 className="font-display text-xl font-bold text-steam-text tracking-tight leading-snug mb-3 group-hover:text-steam-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-steam-secondary text-sm leading-relaxed line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-steam-accent">
                  Read
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
