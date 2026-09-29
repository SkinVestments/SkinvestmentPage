import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Folder,
  History,
  Loader2,
  Package,
  Search,
  Shield,
  BarChart2,
} from 'lucide-react';
import { usePageSeo } from '@/hooks/usePageSeo';
import { ItemImage } from '@/components/ui/ItemImage';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, getRarityStyle } from '@/utils/display';
import {
  fetchAdminTrialActivationStats,
  fetchAdminUserPortfolio,
  isUuid,
} from '@/utils/adminPortfolio';
import type {
  AdminTrialActivationStats,
  AdminUserPortfolio,
} from '@/types/adminPortfolio';

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = String((err as { message?: string }).message);
    if (msg) return msg;
  }
  return fallback;
};

const fmtDate = (value?: string | null) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

const fmtNum = (value: number | null | undefined, digits = 1) => {
  if (value == null || Number.isNaN(value)) return '—';
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
  });
};

const AdminPortfolioLookup: React.FC = () => {
  usePageSeo({
    title: 'Admin · Portfolio lookup',
    description: 'Internal admin portfolio analysis',
    robots: 'noindex, nofollow',
  });

  const [userIdInput, setUserIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AdminUserPortfolio | null>(null);
  const [stats, setStats] = useState<AdminTrialActivationStats | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  const selectedCollection = useMemo(
    () =>
      (result?.collections ?? []).find((c) => c.id === selectedCollectionId) ?? null,
    [result?.collections, selectedCollectionId],
  );

  const collectionItems = useMemo(() => {
    if (!selectedCollectionId || !result?.items) return [];
    return result.items.filter((item) => item.collection_id === selectedCollectionId);
  }, [result?.items, selectedCollectionId]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = userIdInput.trim();
    setError(null);
    setResult(null);
    setSelectedCollectionId(null);

    if (!isUuid(id)) {
      setError('Enter a valid UUID (full user id). Partial search is not allowed.');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchAdminUserPortfolio(id);
      setResult(data);
      if (!data.found) {
        setError('User not found.');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Lookup failed.'));
    } finally {
      setLoading(false);
    }
  };

  const handleLoadStats = async () => {
    setStatsLoading(true);
    setError(null);
    try {
      const data = await fetchAdminTrialActivationStats();
      setStats(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load trial stats.'));
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-steam-bg text-steam-text">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/panel"
              className="p-2.5 rounded-xl border border-steam-border bg-steam-card hover:bg-steam-hover text-steam-secondary"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-steam-accent shrink-0" />
                <h1 className="text-lg font-bold truncate">Admin · Portfolio lookup</h1>
              </div>
              <p className="text-xs text-steam-tertiary mt-0.5">
                Read-only · UUID only · audited
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => void handleLookup(e)}
          className="bg-steam-card border border-steam-border rounded-2xl p-4 sm:p-5 space-y-3"
        >
          <label className="block text-xs font-bold text-steam-tertiary uppercase tracking-wider">
            User ID (UUID)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="00000000-0000-0000-0000-000000000000"
              spellCheck={false}
              autoComplete="off"
              className="theme-input flex-1 rounded-xl px-4 py-3 font-mono text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-steam-accent text-white text-sm font-bold hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Lookup
            </button>
          </div>
        </form>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-100">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {result?.found && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              <StatCard label="Nickname" value={result.nickname || '—'} />
              <StatCard label="Plan" value={result.plan_subscription || 'free'} />
              <StatCard
                label="Unique items"
                value={String(result.summary?.unique_items ?? 0)}
              />
              <StatCard
                label="Portfolio value"
                value={formatCurrency(result.summary?.portfolio_value ?? 0)}
              />
              <StatCard
                label="Collections"
                value={String(result.summary?.collection_count ?? 0)}
              />
              <StatCard
                label="Transactions"
                value={String(result.summary?.transaction_count ?? 0)}
              />
            </div>

            <div className="bg-steam-card border border-steam-border rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <MetaRow label="Registered" value={fmtDate(result.registered_at)} />
              <MetaRow label="Last activity" value={fmtDate(result.last_activity_at)} />
              <MetaRow label="First skin" value={fmtDate(result.first_skin_at)} />
              <MetaRow label="Last skin" value={fmtDate(result.last_skin_at)} />
              <MetaRow
                label="Total quantity"
                value={String(result.summary?.total_quantity ?? 0)}
              />
              <MetaRow
                label="RevenueCat app_user_id"
                value={result.revenuecat_app_user_id || '—'}
                mono
              />
              <MetaRow
                label="Entitlement"
                value={
                  result.entitlement
                    ? `${result.entitlement.status}${
                        result.entitlement.converted_to_paid ? ' · converted' : ''
                      }`
                    : 'No RC row (sync pending)'
                }
              />
            </div>

            <div className="bg-steam-card border border-steam-border rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-steam-border flex items-center gap-2 flex-wrap">
                <Folder className="w-4 h-4 text-steam-accent" />
                <h2 className="text-sm font-bold">Collections</h2>
                <span className="text-xs text-steam-tertiary">
                  {(result.collections ?? []).length} rows · click to open
                </span>
              </div>
              <div className="overflow-x-auto max-h-64 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-steam-card z-10">
                    <tr className="text-[10px] uppercase tracking-wider text-steam-tertiary border-b border-steam-border">
                      <th className="px-4 py-2 font-bold">Name</th>
                      <th className="px-4 py-2 font-bold text-right">Items</th>
                      <th className="px-4 py-2 font-bold text-right">Qty</th>
                      <th className="px-4 py-2 font-bold text-right">Value</th>
                      <th className="px-4 py-2 font-bold">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steam-border/40">
                    {(result.collections ?? []).map((col) => (
                      <tr
                        key={col.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedCollectionId(col.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedCollectionId(col.id);
                          }
                        }}
                        className="cursor-pointer transition-colors hover:bg-steam-hover/60"
                      >
                        <td className="px-4 py-2.5 font-medium">{col.name}</td>
                        <td className="px-4 py-2.5 text-right font-mono">
                          {col.unique_items}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono">
                          {col.total_quantity}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono font-bold">
                          {formatCurrency(col.total_value)}
                        </td>
                        <td className="px-4 py-2.5 text-steam-secondary text-xs">
                          {fmtDate(col.created_at)}
                        </td>
                      </tr>
                    ))}
                    {(result.collections ?? []).length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-steam-tertiary"
                        >
                          No collections
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Modal
              isOpen={Boolean(selectedCollection)}
              onClose={() => setSelectedCollectionId(null)}
              title={selectedCollection?.name || 'Collection'}
              description={
                selectedCollection
                  ? `${collectionItems.length} items · ${formatCurrency(selectedCollection.total_value)} · qty ${selectedCollection.total_quantity}`
                  : undefined
              }
              maxWidth="xl"
              footer={
                <button
                  type="button"
                  onClick={() => setSelectedCollectionId(null)}
                  className="w-full sm:w-auto sm:ml-auto px-4 py-2.5 rounded-xl border border-steam-border text-sm font-bold text-steam-secondary hover:bg-steam-hover"
                >
                  Close
                </button>
              }
            >
              <div className="-m-5 sm:-m-6 overflow-x-auto max-h-[min(60vh,28rem)] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-steam-card z-10">
                    <tr className="text-[10px] uppercase tracking-wider text-steam-tertiary border-b border-steam-border">
                      <th className="px-4 py-2.5 font-bold">Item</th>
                      <th className="px-4 py-2.5 font-bold text-right">Qty</th>
                      <th className="px-4 py-2.5 font-bold text-right">Unit</th>
                      <th className="px-4 py-2.5 font-bold text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steam-border/40">
                    {collectionItems.map((item, idx) => {
                      const rarity = getRarityStyle(item.rarity);
                      return (
                        <tr key={`${item.market_hash_name}-modal-${idx}`}>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-10 h-10 rounded-lg border ${rarity.border} bg-steam-bg flex items-center justify-center shrink-0`}
                              >
                                <ItemImage
                                  src={item.icon_url}
                                  alt=""
                                  className="max-h-8 max-w-8 object-contain"
                                  wrapperClassName="w-8 h-8"
                                />
                              </div>
                              <span className="font-medium truncate">
                                {item.market_hash_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono text-steam-secondary">
                            {formatCurrency(item.unit_price)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono font-bold">
                            {formatCurrency(item.position_value)}
                          </td>
                        </tr>
                      );
                    })}
                    {collectionItems.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-10 text-center text-steam-tertiary"
                        >
                          No items in this collection
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Modal>

            <div className="bg-steam-card border border-steam-border rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-steam-border flex items-center gap-2">
                <Package className="w-4 h-4 text-steam-accent" />
                <h2 className="text-sm font-bold">Holdings</h2>
                <span className="text-xs text-steam-tertiary">
                  {(result.items ?? []).length} rows
                </span>
              </div>
              <div className="overflow-x-auto max-h-[28rem] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-steam-card z-10">
                    <tr className="text-[10px] uppercase tracking-wider text-steam-tertiary border-b border-steam-border">
                      <th className="px-4 py-2 font-bold">Item</th>
                      <th className="px-4 py-2 font-bold">Collection</th>
                      <th className="px-4 py-2 font-bold text-right">Qty</th>
                      <th className="px-4 py-2 font-bold text-right">Unit</th>
                      <th className="px-4 py-2 font-bold text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steam-border/40">
                    {(result.items ?? []).map((item, idx) => {
                      const rarity = getRarityStyle(item.rarity);
                      return (
                        <tr key={`${item.market_hash_name}-${idx}`}>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-10 h-10 rounded-lg border ${rarity.border} bg-steam-bg flex items-center justify-center shrink-0`}
                              >
                                <ItemImage
                                  src={item.icon_url}
                                  alt=""
                                  className="max-h-8 max-w-8 object-contain"
                                  wrapperClassName="w-8 h-8"
                                />
                              </div>
                              <span className="font-medium truncate">
                                {item.market_hash_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-xs text-steam-secondary truncate max-w-[10rem]">
                            {item.collection_name || '—'}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono text-steam-secondary">
                            {formatCurrency(item.unit_price)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono font-bold">
                            {formatCurrency(item.position_value)}
                          </td>
                        </tr>
                      );
                    })}
                    {(result.items ?? []).length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-steam-tertiary"
                        >
                          No holdings
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-steam-card border border-steam-border rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-steam-border flex items-center gap-2 flex-wrap">
                <History className="w-4 h-4 text-steam-accent" />
                <h2 className="text-sm font-bold">Transaction history</h2>
                <span className="text-xs text-steam-tertiary">
                  showing {result.summary?.history_returned ?? (result.history ?? []).length}
                  {result.summary?.transaction_count != null
                    ? ` / ${result.summary.transaction_count}`
                    : ''}
                  {result.summary?.history_limit
                    ? ` (limit ${result.summary.history_limit})`
                    : ''}
                </span>
              </div>
              <div className="overflow-x-auto max-h-[28rem] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-steam-card">
                    <tr className="text-[10px] uppercase tracking-wider text-steam-tertiary border-b border-steam-border">
                      <th className="px-4 py-2 font-bold">Date</th>
                      <th className="px-4 py-2 font-bold">Type</th>
                      <th className="px-4 py-2 font-bold">Item</th>
                      <th className="px-4 py-2 font-bold">Collection</th>
                      <th className="px-4 py-2 font-bold text-right">Qty</th>
                      <th className="px-4 py-2 font-bold text-right">Price</th>
                      <th className="px-4 py-2 font-bold text-right">P/L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steam-border/40">
                    {(result.history ?? []).map((tx) => (
                      <tr key={tx.id}>
                        <td className="px-4 py-2.5 text-xs text-steam-secondary whitespace-nowrap">
                          {fmtDate(tx.transaction_date || tx.created_at)}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              tx.type === 'SELL'
                                ? 'bg-rose-500/15 text-rose-300'
                                : tx.type === 'DROP'
                                  ? 'bg-blue-500/15 text-blue-300'
                                  : 'bg-emerald-500/15 text-emerald-300'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <ItemImage
                              src={tx.icon_url}
                              alt=""
                              className="max-h-7 max-w-7 object-contain"
                              wrapperClassName="w-7 h-7 shrink-0"
                            />
                            <span className="truncate text-xs font-medium">
                              {tx.market_hash_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-steam-secondary truncate max-w-[8rem]">
                          {tx.collection_name || '—'}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono">{tx.quantity}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-steam-secondary">
                          {formatCurrency(tx.price)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs">
                          {tx.type === 'SELL' ? formatCurrency(tx.realized_profit) : '—'}
                        </td>
                      </tr>
                    ))}
                    {(result.history ?? []).length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-8 text-center text-steam-tertiary"
                        >
                          No transactions
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="bg-steam-card border border-steam-border rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-steam-accent" />
              <div>
                <h2 className="text-sm font-bold">Trial activation stats</h2>
                <p className="text-[11px] text-steam-tertiary">
                  Aggregates only · requires revenuecat_entitlements rows
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleLoadStats()}
              disabled={statsLoading}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-steam-border text-xs font-bold hover:bg-steam-hover disabled:opacity-50"
            >
              {statsLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <BarChart2 className="w-3.5 h-3.5" />
              )}
              Load aggregates
            </button>
          </div>

          {stats && !stats.available && (
            <p className="text-sm text-steam-secondary">
              {stats.hint || stats.reason || 'No trial data available yet.'}
            </p>
          )}

          {stats?.available && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TrialGroupCard
                title="Cancelled / expired trial"
                group={stats.groups.cancelled_trial}
              />
              <TrialGroupCard title="Converted" group={stats.groups.converted} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl border border-steam-border bg-steam-elevated/40 px-3 py-3">
    <p className="text-[10px] uppercase tracking-wider text-steam-tertiary font-bold">
      {label}
    </p>
    <p className="text-sm font-bold mt-1 truncate" title={value}>
      {value}
    </p>
  </div>
);

const MetaRow: React.FC<{ label: string; value: string; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => (
  <div>
    <p className="text-[10px] uppercase tracking-wider text-steam-tertiary font-bold">
      {label}
    </p>
    <p className={`text-sm mt-0.5 break-all ${mono ? 'font-mono text-xs' : ''}`}>
      {value}
    </p>
  </div>
);

const TrialGroupCard: React.FC<{
  title: string;
  group: AdminTrialActivationStats['groups']['cancelled_trial'];
}> = ({ title, group }) => (
  <div className="rounded-xl border border-steam-border bg-steam-elevated/30 p-3 space-y-2">
    <p className="text-xs font-bold text-steam-text">{title}</p>
    {!group ? (
      <p className="text-xs text-steam-tertiary">No data</p>
    ) : (
      <ul className="text-xs text-steam-secondary space-y-1">
        <li>Users: {group.user_count}</li>
        <li>Median unique items: {fmtNum(group.median_unique_items, 1)}</li>
        <li>Median portfolio value: {fmtNum(group.median_portfolio_value, 2)}</li>
        <li>Median active days in trial: {fmtNum(group.median_active_days_in_trial, 1)}</li>
        <li>Median trial length (days): {fmtNum(group.median_trial_days, 1)}</li>
      </ul>
    )}
  </div>
);

export default AdminPortfolioLookup;
