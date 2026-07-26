-- Replace em dashes and en dashes in published blog copy with ASCII alternatives.
UPDATE public.blog_posts
SET
  body_md = replace(replace(replace(replace(body_md,
    ' — ', ' - '),
    ' – ', ' - '),
    E'\u2014', '-'),
    E'\u2013', '-'),
  excerpt = replace(replace(replace(replace(excerpt,
    ' — ', ' - '),
    ' – ', ' - '),
    E'\u2014', '-'),
    E'\u2013', '-'),
  title = replace(replace(replace(replace(title,
    ' — ', ' | '),
    ' – ', ' - '),
    E'\u2014', '-'),
    E'\u2013', '-'),
  meta_title = NULLIF(replace(replace(replace(replace(COALESCE(meta_title, ''),
    ' — ', ' | '),
    ' – ', ' - '),
    E'\u2014', '-'),
    E'\u2013', '-'), ''),
  meta_description = NULLIF(replace(replace(replace(replace(COALESCE(meta_description, ''),
    ' — ', ' - '),
    ' – ', ' - '),
    E'\u2014', '-'),
    E'\u2013', '-'), ''),
  updated_at = now()
WHERE
  body_md ~ U&'[\2013\2014]'
  OR excerpt ~ U&'[\2013\2014]'
  OR title ~ U&'[\2013\2014]'
  OR COALESCE(meta_title, '') ~ U&'[\2013\2014]'
  OR COALESCE(meta_description, '') ~ U&'[\2013\2014]';
