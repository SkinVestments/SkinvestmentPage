-- Deploy in Supabase SQL Editor (matches frontend RPC call).
-- cs2_items has no updated_at; last_price_update is null unless you add a timestamp column later.
CREATE OR REPLACE FUNCTION public.get_portfolio_item_detail(p_item_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid := auth.uid();
    v_result jsonb;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    WITH item_info AS (
        SELECT id, market_hash_name, icon_url, price
        FROM public.cs2_items
        WHERE id = p_item_id
    ),
    portfolio_agg AS (
        SELECT
            COALESCE(SUM(quantity), 0)::integer AS total_qty,
            CASE WHEN SUM(quantity) > 0 THEN SUM(quantity * buy_price) / SUM(quantity) ELSE 0 END AS avg_buy,
            COALESCE(SUM(quantity * buy_price), 0)::numeric AS total_invested
        FROM public.portfolio_items
        WHERE user_id = v_user_id AND item_id = p_item_id
    ),
    sales_agg AS (
        SELECT
            COALESCE(SUM(quantity), 0)::integer AS sold_qty,
            COALESCE(SUM(realized_profit), 0)::numeric AS total_realized_profit
        FROM public.transactions
        WHERE user_id = v_user_id AND item_id = p_item_id AND type::text = 'SELL'
    )
    SELECT jsonb_build_object(
        'item_id', i.id,
        'market_hash_name', i.market_hash_name,
        'icon_url', i.icon_url,
        'current_market_price', COALESCE(i.price, 0),
        'last_price_update', NULL,
        'owned_quantity', p.total_qty,
        'avg_buy_price', ROUND(p.avg_buy, 2),
        'total_invested', ROUND(p.total_invested, 2),
        'current_value', ROUND(p.total_qty * COALESCE(i.price, 0), 2),
        'unrealized_profit', ROUND((p.total_qty * COALESCE(i.price, 0)) - p.total_invested, 2),
        'roi_percentage', CASE
            WHEN p.total_invested > 0 THEN ROUND(
                (((p.total_qty * COALESCE(i.price, 0)) - p.total_invested) / p.total_invested) * 100, 2
            )
            ELSE 0
        END,
        'history_sold_quantity', s.sold_qty,
        'history_realized_profit', ROUND(s.total_realized_profit, 2)
    ) INTO v_result
    FROM item_info i
    CROSS JOIN portfolio_agg p
    CROSS JOIN sales_agg s;

    RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_portfolio_item_detail(uuid) TO authenticated;
