import { supabase } from '@/utils/supabaseClient';
import type {
  AdminTrialActivationStats,
  AdminUserPortfolio,
} from '@/types/adminPortfolio';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_RE.test(value.trim());
}

export async function adminIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc('admin_is_admin');
  if (error) {
    console.error('[admin] admin_is_admin failed', error);
    return false;
  }
  return Boolean(data);
}

export async function fetchAdminUserPortfolio(
  targetUserId: string,
): Promise<AdminUserPortfolio> {
  const id = targetUserId.trim();
  if (!isUuid(id)) {
    throw new Error('Invalid user id (UUID required)');
  }

  const { data, error } = await supabase.rpc('admin_get_user_portfolio', {
    target_user_id: id,
  });

  if (error) throw error;
  return data as AdminUserPortfolio;
}

export async function fetchAdminTrialActivationStats(): Promise<AdminTrialActivationStats> {
  const { data, error } = await supabase.rpc('admin_trial_activation_stats');
  if (error) throw error;
  return data as AdminTrialActivationStats;
}
