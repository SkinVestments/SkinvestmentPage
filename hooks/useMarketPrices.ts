import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import type { MarketListing, MarketPriceMap, MarketPriceRow } from '@/types/marketPrices';

const CHUNK = 2000;

function num(v: unknown): number | null {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toListing(raw: Record<string, unknown>): MarketListing | null {
  const source = String(raw.source ?? '').trim();
  if (!source) return null;
  return {
    source,
    price: num(raw.price),
    listings: raw.listings == null ? null : Math.trunc(Number(raw.listings)),
    updated_at: raw.updated_at == null ? null : String(raw.updated_at),
    prev_price: num(raw.prev_price),
    change_pct: num(raw.change_pct),
    spread_pct: num(raw.spread_pct),
  };
}

function toRow(raw: Record<string, unknown>): MarketPriceRow {
  const marketsRaw = raw.markets;
  const markets: MarketListing[] = [];
  if (Array.isArray(marketsRaw)) {
    for (const entry of marketsRaw) {
      if (!entry || typeof entry !== 'object') continue;
      const listing = toListing(entry as Record<string, unknown>);
      if (listing) markets.push(listing);
    }
  }

  return {
    item_id: String(raw.item_id ?? ''),
    steam_price: num(raw.steam_price),
    markets,
  };
}

/** Fetch Steam + multi-market prices via get_market_prices_for_items_v2. */
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
            'get_market_prices_for_items_v2',
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
        console.warn('[useMarketPrices] get_market_prices_for_items_v2 failed', err);
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
