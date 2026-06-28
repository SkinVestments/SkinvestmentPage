import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabaseClient';

interface PublisherContentReadyOptions {
  minPortfolioItems?: number;
  minTransactions?: number;
}

/**
 * AdSense safety gate: only true when user has meaningful content.
 * Helps avoid showing ads on low-value / empty dashboard states.
 */
export function usePublisherContentReady(
  options: PublisherContentReadyOptions = {},
): boolean {
  const { user } = useAuth();
  const { minPortfolioItems = 1, minTransactions = 3 } = options;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (!user) {
        if (!cancelled) setReady(false);
        return;
      }

      try {
        const [portfolioRes, transactionsRes] = await Promise.all([
          supabase
            .from('portfolio_items')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gt('quantity', 0),
          supabase
            .from('transactions')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id),
        ]);

        if (portfolioRes.error || transactionsRes.error) {
          if (!cancelled) setReady(false);
          return;
        }

        const portfolioCount = Number(portfolioRes.count ?? 0);
        const transactionsCount = Number(transactionsRes.count ?? 0);
        const hasMeaningfulContent =
          portfolioCount >= minPortfolioItems && transactionsCount >= minTransactions;

        if (!cancelled) setReady(hasMeaningfulContent);
      } catch {
        if (!cancelled) setReady(false);
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [user, minPortfolioItems, minTransactions]);

  return ready;
}

