export type BlogPostStatus = 'idea' | 'draft' | 'scheduled' | 'published' | 'archived';

/** Row shape from public.blog_posts (published reads via RLS). */
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body_md: string;
  status: BlogPostStatus;
  published_at: string | null;
  scheduled_for: string | null;
  feature_image_path: string | null;
  feature_image_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_path: string | null;
  og_image_path: string | null;
  tags: string[];
  author_name: string;
  created_at: string;
  updated_at: string;
};

export type BlogPostListItem = Pick<
  BlogPost,
  | 'id'
  | 'slug'
  | 'title'
  | 'excerpt'
  | 'published_at'
  | 'feature_image_path'
  | 'feature_image_alt'
  | 'tags'
  | 'author_name'
  | 'updated_at'
>;
