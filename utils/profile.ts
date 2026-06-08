import { supabase } from '@/utils/supabaseClient';
import type { UpdateOwnProfileParams, UserProfile } from '@/types/profile';

export async function fetchOwnProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, nickname, steam_profile_url, avatar, notify_accept')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as UserProfile | null;
}

/** RPC update_own_profile — NULL params keep existing DB values (COALESCE). */
export async function updateOwnProfile(
  patch: UpdateOwnProfileParams,
): Promise<UserProfile> {
  const { data, error } = await supabase.rpc('update_own_profile', {
    p_nickname: patch.nickname !== undefined ? patch.nickname : null,
    p_steam_profile_url:
      patch.steam_profile_url !== undefined ? patch.steam_profile_url : null,
    p_avatar: patch.avatar !== undefined ? patch.avatar : null,
    p_notify_accept:
      patch.notify_accept !== undefined ? patch.notify_accept : null,
  });

  if (error) throw error;
  return data as UserProfile;
}

export function getProfileDisplayName(
  profile: UserProfile | null,
  email?: string | null,
): string {
  if (profile?.nickname?.trim()) return profile.nickname.trim();
  if (email) return email.split('@')[0] ?? 'Trader';
  return 'Trader';
}

export function getSteamProfileLabel(url: string | null | undefined): string {
  if (!url?.trim()) return 'Not linked';
  try {
    const parsed = new URL(url.trim());
    const path = parsed.pathname.replace(/\/$/, '');
    const segment = path.split('/').filter(Boolean).pop();
    return segment ? `@${segment}` : 'Linked';
  } catch {
    return 'Linked';
  }
}
