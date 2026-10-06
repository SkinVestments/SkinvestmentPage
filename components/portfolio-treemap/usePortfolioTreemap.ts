import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptionPlan } from '@/hooks/useSubscriptionPlan';
import {
  applyIconsToPortfolio,
  buildDemoPortfolio,
  clearTreemapCache,
  fetchPortfolioTreemapRaw,
  fetchTreemapIcons,
  getCachedPortfolio,
  normalizeTreemapRpc,
  setCachedPortfolio,
} from './data';
import type { TreemapPortfolio } from './model';

export type TreemapAccess = 'checking' | 'locked' | 'allowed' | 'unavailable';

export type TreemapLoadState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'ready'; portfolio: TreemapPortfolio; isDemo: boolean }
  | { kind: 'empty' }
  | { kind: 'error'; message: string };

export function usePortfolioTreemap() {
  const { user } = useAuth();
  const { hasPro, loading: planLoading } = useSubscriptionPlan();
  const [load, setLoad] = useState<TreemapLoadState>({ kind: 'idle' });
  const requestRef = useRef(0);
  const userId = user?.id ?? null;

  const access: TreemapAccess = !userId
    ? 'unavailable'
    : planLoading
      ? 'checking'
      : hasPro
        ? 'allowed'
        : 'locked';

  const loadReal = useCallback(async () => {
    if (!userId || access !== 'allowed') return;
    const req = ++requestRef.current;

    const cached = getCachedPortfolio(userId);
    if (cached) {
      setLoad({ kind: 'ready', portfolio: cached, isDemo: false });
    } else {
      setLoad({ kind: 'loading' });
    }

    try {
      const raw = await fetchPortfolioTreemapRaw();
      if (req !== requestRef.current) return;
      const normalized = normalizeTreemapRpc(raw);
      if (normalized.status === 'empty') {
        setLoad({ kind: 'empty' });
        return;
      }
      if (normalized.status === 'contract_error') {
        setLoad({ kind: 'error', message: normalized.message });
        return;
      }

      let portfolio = normalized.portfolio;
      setCachedPortfolio(userId, portfolio);
      setLoad({ kind: 'ready', portfolio, isDemo: false });

      // Icons never block map
      const names = portfolio.categories.flatMap((c) => c.items.map((i) => i.fullName));
      void fetchTreemapIcons(names).then((icons) => {
        if (req !== requestRef.current) return;
        portfolio = applyIconsToPortfolio(portfolio, icons);
        setCachedPortfolio(userId, portfolio);
        setLoad({ kind: 'ready', portfolio, isDemo: false });
      });
    } catch (err) {
      if (req !== requestRef.current) return;
      console.error('[portfolio-treemap] fetch failed', err);
      setLoad({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Could not load portfolio map.',
      });
    }
  }, [userId, access]);

  useEffect(() => {
    requestRef.current += 1;

    if (access === 'checking') {
      setLoad({ kind: 'loading' });
      return;
    }

    if (access === 'locked') {
      clearTreemapCache();
      setLoad({ kind: 'ready', portfolio: buildDemoPortfolio(), isDemo: true });
      return;
    }

    if (access === 'unavailable') {
      clearTreemapCache();
      setLoad({ kind: 'idle' });
      return;
    }

    void loadReal();
  }, [access, userId, loadReal]);

  // Drop real data if account/plan changes mid-session
  useEffect(() => {
    if (access !== 'allowed') {
      clearTreemapCache(userId ?? undefined);
    }
  }, [access, userId]);

  const retry = useCallback(() => {
    if (access === 'allowed') void loadReal();
  }, [access, loadReal]);

  return { access, load, retry, userId };
}
