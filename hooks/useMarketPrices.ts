import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import type { MarketPriceMap, MarketPriceRow } from '@/types/marketPrices';

const CHUNK = 2000;

function toRow(raw: Record<string, unknown>): MarketPriceRow {
  const num = (v: unknown): number | null => {
    if (v == null || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  return {
    item_id: String(raw.item_id ?? ''),
    steam_price: num(raw.steam_price),
    csmoney_price: num(raw.csmoney_price),
    csmoney_listings:
      raw.csmoney_listings == null ? null : Math.trunc(Number(raw.csmoney_listings)),
    csmoney_updated_at:
      raw.csmoney_updated_at == null ? null : String(raw.csmoney_updated_at),
    csmoney_prev_price: num(raw.csmoney_prev_price),
    csmoney_change_pct: num(raw.csmoney_change_pct),
    spread_pct: num(raw.spread_pct),
  };
}

/**
 * Fetch CS.MONEY (+ steam) market rows for inventory item ids.
 * TODO: if we add polling later, consider a brief flash when chip prices change.
 */
export function useMarketPrices(itemIds: string[]) {
  const idsKey = useMemo(() => {
    const unique = [...new Set(itemIds.filter(Boolean))];
    unique.sort();
    return unique.join(',');
  }, [itemIds]);

  const [prices, setPrices] = useState<MarketPriceMap>(() => new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idsKey) {
      setPrices(new Map());
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const ids = idsKey.split(',');

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const map: MarketPriceMap = new Map();

        for (let i = 0; i < ids.length; i += CHUNK) {
          const chunk = ids.slice(i, i + CHUNK);
          const { data, error: rpcError } = await supabase.rpc(
            'get_market_prices_for_items',
            { p_item_ids: chunk },
          );

          if (rpcError) throw rpcError;

          for (const row of data ?? []) {
            const parsed = toRow(row as Record<string, unknown>);
            if (parsed.item_id) map.set(parsed.item_id, parsed);
          }
        }

        if (!cancelled) {
          setPrices(map);
          setLoading(false);
        }
      } catch (err) {
        console.warn('[useMarketPrices] get_market_prices_for_items failed', err);
        if (!cancelled) {
          setPrices(new Map());
          setError(err instanceof Error ? err.message : 'Market prices unavailable');
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  return { prices, loading, error };
}
