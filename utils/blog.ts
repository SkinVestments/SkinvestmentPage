import { supabase } from '@/utils/supabaseClient';
import type { BlogPost, BlogPostListItem } from '@/types/blog';

const BLOG_IMAGES_BUCKET = 'blog-images';

const LIST_SELECT =
  'id, slug, title, excerpt, published_at, feature_image_path, feature_image_alt, tags, author_name, updated_at';

const DETAIL_SELECT =
  'id, slug, title, excerpt, body_md, status, published_at, scheduled_for, feature_image_path, feature_image_alt, meta_title, meta_description, canonical_path, og_image_path, tags, author_name, created_at, updated_at';

/** Public URL for a path stored in the blog-images bucket. */
export function blogImagePublicUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const { data } = supabase.storage.from(BLOG_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl || null;
}

/** Prefer dedicated OG path, then feature image, else site default OG. */
export function blogOgImageUrl(post: {
  og_image_path?: string | null;
  feature_image_path?: string | null;
}): string {
  return (
    blogImagePublicUrl(post.og_image_path) ||
    blogImagePublicUrl(post.feature_image_path) ||
    'https://skinvestments.app/images/og-image.png'
  );
}

export async function fetchPublishedBlogPosts(): Promise<BlogPostListItem[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(LIST_SELECT)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as BlogPostListItem[];
}

export async function fetchPublishedBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(DETAIL_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  return (data as BlogPost | null) ?? null;
}

export function blogPostPath(slug: string) {
  return `/blog/${slug}`;
}

export function formatBlogDate(iso: string | null | undefined) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
