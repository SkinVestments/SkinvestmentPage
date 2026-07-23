import { SITE_ORIGIN } from '@/utils/seo';
import { supabase } from '@/utils/supabaseClient';
import type {
  PortfolioShareRow,
  PortfolioShareVisibility,
  PublicPortfolioHistoryPage,
  PublicPortfolioPayload,
} from '@/types/portfolioShare';
import { DEFAULT_SHARE_VISIBILITY } from '@/types/portfolioShare';

export function sharePath(token: string) {
  return `/p/${token}`;
}

export function shareUrl(token: string) {
  return `${SITE_ORIGIN}${sharePath(token)}`;
}

const SHARE_SELECT =
  'id, user_id, token, enabled, created_at, updated_at, revoked_at, show_summary, show_chart, show_categories, show_items, show_history, show_collections';

export async function fetchOwnShare(): Promise<PortfolioShareRow | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('portfolio_shares')
    .select(SHARE_SELECT)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  return (data as PortfolioShareRow | null) ?? null;
}

export async function enableShare(): Promise<PortfolioShareRow> {
  const { data, error } = await supabase.rpc('enable_portfolio_share');
  if (error) throw error;
  return data as PortfolioShareRow;
}

export async function disableShare(): Promise<PortfolioShareRow> {
  const { data, error } = await supabase.rpc('disable_portfolio_share');
  if (error) throw error;
  return data as PortfolioShareRow;
}

export async function regenerateShareToken(): Promise<PortfolioShareRow> {
  const { data, error } = await supabase.rpc('regenerate_portfolio_share_token');
  if (error) throw error;
  return data as PortfolioShareRow;
}

export async function updateShareVisibility(
  patch: Partial<PortfolioShareVisibility>,
): Promise<PortfolioShareRow> {
  const { data, error } = await supabase.rpc('update_portfolio_share_visibility', {
    p_show_summary: patch.show_summary ?? null,
    p_show_chart: patch.show_chart ?? null,
    p_show_categories: patch.show_categories ?? null,
    p_show_items: patch.show_items ?? null,
    p_show_history: patch.show_history ?? null,
    p_show_collections: patch.show_collections ?? null,
  });
  if (error) throw error;
  return data as PortfolioShareRow;
}

export async function fetchPublicPortfolio(
  token: string,
): Promise<PublicPortfolioPayload | null> {
  const { data, error } = await supabase.rpc('get_public_portfolio', {
    p_token: token,
  });

  if (error) throw error;
  if (!data || typeof data !== 'object') return null;

  const raw = data as PublicPortfolioPayload;
  return {
    ...raw,
    items: Array.isArray(raw.items) ? raw.items : [],
    categories: Array.isArray(raw.categories) ? raw.categories : [],
    chart: Array.isArray(raw.chart) ? raw.chart : [],
    history: Array.isArray(raw.history) ? raw.history : [],
    collections: Array.isArray(raw.collections) ? raw.collections : [],
    visibility: {
      ...DEFAULT_SHARE_VISIBILITY,
      ...(raw.visibility ?? {}),
    },
    summary: {
      total_portfolio_value: Number(raw.summary?.total_portfolio_value ?? 0),
      inventory_value: Number(raw.summary?.inventory_value ?? 0),
      item_count: Number(raw.summary?.item_count ?? 0),
    },
  };
}

export async function fetchPublicPortfolioHistory(
  token: string,
  page = 1,
  pageSize = 15,
): Promise<PublicPortfolioHistoryPage | null> {
  const { data, error } = await supabase.rpc('get_public_portfolio_history', {
    p_token: token,
    p_page: page,
    p_page_size: pageSize,
  });

  if (error) throw error;
  if (!data || typeof data !== 'object') return null;

  const raw = data as PublicPortfolioHistoryPage;
  return {
    items: Array.isArray(raw.items) ? raw.items : [],
    total_count: Number(raw.total_count ?? 0),
    page: Number(raw.page ?? page),
    page_size: Number(raw.page_size ?? pageSize),
  };
}
