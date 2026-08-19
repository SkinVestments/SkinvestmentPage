-- Diagnostic: collection counts vs plan limits
-- free/starter → 5, pro → 15, pro_max → unlimited
-- Run in Supabase SQL Editor (read-only safe).

WITH limits AS (
  SELECT
    p.id AS user_id,
    COALESCE(p.nickname, p.id::text) AS nickname,
    p.plan_subscription,
    CASE p.plan_subscription
      WHEN 'pro_max' THEN NULL
      WHEN 'pro' THEN 15
      ELSE 5
    END AS collection_limit,
    CASE p.plan_subscription
      WHEN 'pro_max' THEN NULL
      WHEN 'pro' THEN 10000
      ELSE 1000
    END AS items_per_collection_limit
  FROM public.profiles p
),
collection_stats AS (
  SELECT
    c.user_id,
    count(*)::int AS collection_count
  FROM public.collections c
  GROUP BY c.user_id
),
item_stats AS (
  SELECT
    pi.user_id,
    pi.collection_id,
    COALESCE(col.name, '(unassigned)') AS collection_name,
    COALESCE(SUM(pi.quantity), 0)::int AS item_qty
  FROM public.portfolio_items pi
  LEFT JOIN public.collections col ON col.id = pi.collection_id
  WHERE pi.quantity > 0
  GROUP BY pi.user_id, pi.collection_id, col.name
)
-- 1) Users over collection COUNT limit
SELECT
  'over_collection_count' AS issue,
  l.user_id,
  l.nickname,
  l.plan_subscription::text AS plan,
  cs.collection_count AS current_value,
  l.collection_limit AS plan_limit,
  (cs.collection_count - l.collection_limit) AS over_by
FROM limits l
JOIN collection_stats cs ON cs.user_id = l.user_id
WHERE l.collection_limit IS NOT NULL
  AND cs.collection_count > l.collection_limit

UNION ALL

-- 2) Collections over ITEM quantity limit
SELECT
  'over_collection_items' AS issue,
  l.user_id,
  l.nickname,
  l.plan_subscription::text AS plan,
  ist.item_qty AS current_value,
  l.items_per_collection_limit AS plan_limit,
  (ist.item_qty - l.items_per_collection_limit) AS over_by
FROM limits l
JOIN item_stats ist ON ist.user_id = l.user_id
WHERE l.items_per_collection_limit IS NOT NULL
  AND ist.item_qty > l.items_per_collection_limit

ORDER BY issue, over_by DESC;


-- Optional overview (all users with collections) — uncomment to run separately:
/*
SELECT
  l.nickname,
  l.plan_subscription::text AS plan,
  COALESCE(cs.collection_count, 0) AS collections,
  l.collection_limit AS max_collections,
  CASE
    WHEN l.collection_limit IS NULL THEN 'ok (unlimited)'
    WHEN COALESCE(cs.collection_count, 0) > l.collection_limit THEN 'OVER'
    ELSE 'ok'
  END AS status
FROM limits l
LEFT JOIN collection_stats cs ON cs.user_id = l.user_id
WHERE COALESCE(cs.collection_count, 0) > 0
ORDER BY
  CASE WHEN l.collection_limit IS NOT NULL AND COALESCE(cs.collection_count, 0) > l.collection_limit THEN 0 ELSE 1 END,
  collections DESC;
*/
