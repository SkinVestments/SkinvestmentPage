-- Embed widget layout preference for share owners (snippet defaults).

ALTER TABLE public.portfolio_shares
  ADD COLUMN IF NOT EXISTS embed_layout text NOT NULL DEFAULT 'summary';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'portfolio_shares_embed_layout_check'
  ) THEN
    ALTER TABLE public.portfolio_shares
      ADD CONSTRAINT portfolio_shares_embed_layout_check
      CHECK (embed_layout IN ('summary', 'top', 'sections'));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.update_portfolio_share_embed_layout(p_layout text)
RETURNS public.portfolio_shares
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  row public.portfolio_shares;
  layout text := lower(trim(COALESCE(p_layout, '')));
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF layout NOT IN ('summary', 'top', 'sections') THEN
    RAISE EXCEPTION 'Invalid embed layout. Use summary, top, or sections.';
  END IF;

  UPDATE public.portfolio_shares
  SET
    embed_layout = layout,
    updated_at = now()
  WHERE user_id = uid
  RETURNING * INTO row;

  IF row IS NULL THEN
    RAISE EXCEPTION 'Portfolio share not found. Enable sharing first.';
  END IF;

  RETURN row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_portfolio_share_embed_layout(text) TO authenticated;
