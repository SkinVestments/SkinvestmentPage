import { useCallback, useEffect, useState } from 'react';
import type { UpdateOwnProfileParams, UserProfile } from '@/types/profile';
import { fetchOwnProfile, updateOwnProfile } from '@/utils/profile';

export function useOwnProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const row = await fetchOwnProfile(userId);
      setProfile(row);
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Failed to load profile';
      setError(message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const saveProfile = useCallback(
    async (patch: UpdateOwnProfileParams) => {
      setSaving(true);
      setError(null);
      try {
        const updated = await updateOwnProfile(patch);
        setProfile(updated);
        return updated;
      } catch (err) {
        const message =
          err && typeof err === 'object' && 'message' in err
            ? String((err as { message?: string }).message)
            : 'Failed to save profile';
        setError(message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return { profile, loading, saving, error, saveProfile, reload: load, setError };
}
