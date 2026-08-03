-- Edit a single transaction with inventory balance guard.

CREATE OR REPLACE FUNCTION public.edit_transaction(
  p_transaction_id uuid,
  p_new_quantity integer,
  p_new_price numeric,
  p_new_date timestamptz,
  p_new_is_investment boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_item_id uuid;
  v_collection_id uuid;
  v_new_balance integer;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_new_quantity IS NULL OR p_new_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be greater than 0';
  END IF;

  IF p_new_price IS NULL OR p_new_price < 0 THEN
    RAISE EXCEPTION 'Price must be zero or greater';
  END IF;

  IF p_new_date IS NULL THEN
    RAISE EXCEPTION 'Transaction date is required';
  END IF;

  UPDATE public.transactions
  SET
    quantity = p_new_quantity,
    price = p_new_price,
    transaction_date = p_new_date,
    is_investment = COALESCE(p_new_is_investment, false)
  WHERE id = p_transaction_id
    AND user_id = v_user_id
  RETURNING item_id, collection_id INTO v_item_id, v_collection_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found or access denied';
  END IF;

  SELECT COALESCE(
    SUM(
      CASE
        WHEN type IN ('BUY', 'DROP') THEN quantity
        WHEN type = 'SELL' THEN -quantity
        ELSE 0
      END
    ),
    0
  )
  INTO v_new_balance
  FROM public.transactions
  WHERE item_id = v_item_id
    AND collection_id IS NOT DISTINCT FROM v_collection_id
    AND user_id = v_user_id;

  IF v_new_balance < 0 THEN
    RAISE EXCEPTION 'Cannot edit transaction: New quantity causes negative inventory balance.';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.edit_transaction(
  uuid, integer, numeric, timestamptz, boolean
) TO authenticated;
