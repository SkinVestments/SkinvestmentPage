-- Remove competitor alternative links from published blog copy.
UPDATE public.blog_posts
SET
  body_md = regexp_replace(
    body_md,
    E'- \\[SkinProfit alternative\\]\\(/skinprofit-alternative\\)[[:space:]]*\\n?',
    '',
    'g'
  ),
  updated_at = now()
WHERE body_md LIKE '%skinprofit-alternative%';

UPDATE public.blog_posts
SET
  body_md = regexp_replace(
    body_md,
    E'- \\[SkinsHunter alternative\\]\\(/skinshunter-alternative\\)[[:space:]]*\\n?',
    '',
    'g'
  ),
  updated_at = now()
WHERE body_md LIKE '%skinshunter-alternative%';
