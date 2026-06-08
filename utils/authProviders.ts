import type { User } from '@supabase/supabase-js';

/** User can set/change password (email provider), not OAuth-only. */
export function userHasEmailPassword(user: User | null | undefined): boolean {
  if (!user) return false;
  if (user.identities?.some((identity) => identity.provider === 'email')) return true;
  return user.app_metadata?.provider === 'email';
}

export function getPrimaryAuthProvider(user: User | null | undefined): string {
  if (!user) return 'unknown';
  const fromIdentity = user.identities?.[0]?.provider;
  if (fromIdentity) return fromIdentity;
  return (user.app_metadata?.provider as string) ?? 'unknown';
}
