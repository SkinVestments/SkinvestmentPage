import React, { useCallback, useEffect, useState } from 'react';
import {
  BarChart3,
  Check,
  Copy,
  FolderKanban,
  History,
  LayoutGrid,
  Link2,
  Loader2,
  Package,
  PieChart,
  RefreshCw,
  Share2,
} from 'lucide-react';
import type { PortfolioShareRow, PortfolioShareVisibility } from '@/types/portfolioShare';
import { visibilityFromShareRow } from '@/types/portfolioShare';
import {
  disableShare,
  enableShare,
  fetchOwnShare,
  regenerateShareToken,
  shareUrl,
  updateShareVisibility,
} from '@/utils/portfolioShare';

type VisibilityKey = keyof PortfolioShareVisibility;

const SECTION_OPTIONS: Array<{
  key: VisibilityKey;
  label: string;
  hint: string;
  icon: React.ReactNode;
}> = [
  {
    key: 'show_summary',
    label: 'Summary',
    hint: 'Total value & item count',
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    key: 'show_chart',
    label: 'Value chart',
    hint: 'Portfolio performance over time',
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    key: 'show_categories',
    label: 'Categories',
    hint: 'Allocation by item type',
    icon: <PieChart className="w-4 h-4" />,
  },
  {
    key: 'show_items',
    label: 'Holdings',
    hint: 'Item grid with market prices',
    icon: <Package className="w-4 h-4" />,
  },
  {
    key: 'show_history',
    label: 'Item history',
    hint: 'BUY / SELL / DROP for held items',
    icon: <History className="w-4 h-4" />,
  },
  {
    key: 'show_collections',
    label: 'Collections',
    hint: 'Named vaults and their values',
    icon: <FolderKanban className="w-4 h-4" />,
  },
];

interface PortfolioSharePanelProps {
  /** Flat layout for use inside a modal (no outer card chrome). */
  embedded?: boolean;
}

export const PortfolioSharePanel: React.FC<PortfolioSharePanelProps> = ({
  embedded = false,
}) => {
  const [share, setShare] = useState<PortfolioShareRow | null>(null);
  const [visibility, setVisibility] = useState<PortfolioShareVisibility>(
    visibilityFromShareRow(null),
  );
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<'enable' | 'disable' | 'regenerate' | VisibilityKey | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const row = await fetchOwnShare();
      setShare(row);
      setVisibility(visibilityFromShareRow(row));
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Failed to load share settings.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const run = async (action: 'enable' | 'disable' | 'regenerate') => {
    setBusy(action);
    setError(null);
    setCopied(false);
    try {
      const row =
        action === 'enable'
          ? await enableShare()
          : action === 'disable'
            ? await disableShare()
            : await regenerateShareToken();
      setShare(row);
      setVisibility(visibilityFromShareRow(row));
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Action failed. Please try again.';
      setError(message);
    } finally {
      setBusy(null);
    }
  };

  const toggleSection = async (key: VisibilityKey) => {
    if (!share?.enabled) return;
    const next = !visibility[key];
    setBusy(key);
    setError(null);
    // Optimistic UI for preview
    setVisibility((prev) => ({ ...prev, [key]: next }));
    try {
      const row = await updateShareVisibility({ [key]: next });
      setShare(row);
      setVisibility(visibilityFromShareRow(row));
    } catch (err) {
      setVisibility((prev) => ({ ...prev, [key]: !next }));
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Could not update share options.';
      setError(message);
    } finally {
      setBusy(null);
    }
  };

  const enabled = Boolean(share?.enabled && share.token);
  const url = enabled && share ? shareUrl(share.token) : '';

  const copyLink = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy link. Copy it manually from the field.');
    }
  };

  return (
    <div
      className={
        embedded
          ? 'relative'
          : 'bg-steam-card border border-steam-border rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl'
      }
    >
      {!embedded && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none -mr-4">
          <Share2 className="w-64 h-64" />
        </div>
      )}

      <div className="relative z-10 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="pr-4 min-w-0">
            <h4 className="font-bold text-steam-text text-xl mb-2 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-steam-accent shrink-0" aria-hidden />
              Share portfolio link
            </h4>
            <p className="text-sm text-steam-secondary leading-relaxed max-w-lg">
              Choose what guests can see. Click sections in the preview to toggle them. Purchase
              cost basis on holdings stays private.
            </p>
          </div>

          {loading ? (
            <Loader2 className="w-6 h-6 text-steam-accent animate-spin shrink-0 mt-1" />
          ) : (
            <label className="relative inline-flex items-center cursor-pointer mt-1 shrink-0">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={enabled}
                disabled={busy !== null}
                onChange={() => void run(enabled ? 'disable' : 'enable')}
              />
              <div className="w-14 h-7 bg-steam-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-steam-card after:border-steam-border after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-steam-accent shadow-inner" />
            </label>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        {enabled && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 border-t border-steam-border/50">
            {/* Options list */}
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-3">
                What to include
              </p>
              <div className="space-y-2">
                {SECTION_OPTIONS.map((opt) => {
                  const on = visibility[opt.key];
                  const isBusy = busy === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      disabled={busy !== null}
                      onClick={() => void toggleSection(opt.key)}
                      className={`w-full text-left flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors ${
                        on
                          ? 'border-steam-accent/40 bg-steam-accent/10'
                          : 'border-steam-border bg-steam-elevated/40 hover:bg-steam-hover'
                      } disabled:opacity-60`}
                    >
                      <span
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          on ? 'bg-steam-accent/20 text-steam-accent' : 'bg-steam-card text-steam-tertiary'
                        }`}
                      >
                        {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : opt.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-steam-text">{opt.label}</span>
                        <span className="block text-xs text-steam-tertiary">{opt.hint}</span>
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                          on ? 'bg-steam-accent text-white' : 'bg-steam-card text-steam-tertiary'
                        }`}
                      >
                        {on ? 'On' : 'Off'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live preview */}
            <div className="min-w-0 lg:sticky lg:top-6 self-start">
              <p className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-3">
                Live preview — click a block to toggle
              </p>
              <div className="rounded-2xl border border-steam-border bg-steam-bg/80 p-4 space-y-3 min-h-[320px]">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-steam-card border border-steam-border" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-steam-accent">
                      Shared portfolio
                    </p>
                    <p className="text-sm font-bold text-steam-text">Your display name</p>
                  </div>
                </div>

                <PreviewBlock
                  active={visibility.show_summary}
                  label="Summary"
                  onClick={() => void toggleSection('show_summary')}
                  disabled={busy !== null}
                >
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-10 rounded-lg bg-steam-elevated/80" />
                    <div className="h-10 rounded-lg bg-steam-elevated/80" />
                    <div className="h-10 rounded-lg bg-steam-elevated/80" />
                  </div>
                </PreviewBlock>

                <div className="grid grid-cols-5 gap-2">
                  <PreviewBlock
                    className="col-span-3"
                    active={visibility.show_chart}
                    label="Chart"
                    onClick={() => void toggleSection('show_chart')}
                    disabled={busy !== null}
                  >
                    <div className="h-16 rounded-lg bg-gradient-to-t from-steam-accent/20 to-transparent border border-steam-border/40" />
                  </PreviewBlock>
                  <PreviewBlock
                    className="col-span-2"
                    active={visibility.show_categories}
                    label="Categories"
                    onClick={() => void toggleSection('show_categories')}
                    disabled={busy !== null}
                  >
                    <div className="h-16 rounded-full w-16 mx-auto border-4 border-steam-accent/30 bg-steam-elevated/50" />
                  </PreviewBlock>
                </div>

                <PreviewBlock
                  active={visibility.show_items}
                  label="Holdings"
                  onClick={() => void toggleSection('show_items')}
                  disabled={busy !== null}
                >
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square rounded-md bg-steam-elevated/80" />
                    ))}
                  </div>
                </PreviewBlock>

                <PreviewBlock
                  active={visibility.show_collections}
                  label="Collections"
                  onClick={() => void toggleSection('show_collections')}
                  disabled={busy !== null}
                >
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="h-12 rounded-lg bg-steam-elevated/80" />
                    <div className="h-12 rounded-lg bg-steam-elevated/80" />
                  </div>
                </PreviewBlock>

                <PreviewBlock
                  active={visibility.show_history}
                  label="History"
                  onClick={() => void toggleSection('show_history')}
                  disabled={busy !== null}
                >
                  <div className="space-y-1.5">
                    <div className="h-6 rounded bg-steam-elevated/80" />
                    <div className="h-6 rounded bg-steam-elevated/80" />
                  </div>
                </PreviewBlock>

                <p className="text-[10px] text-steam-tertiary pt-1 flex items-center gap-1">
                  <LayoutGrid className="w-3 h-3" />
                  Dimmed blocks are hidden from guests
                </p>
              </div>
            </div>
          </div>
        )}

        {enabled && url && (
          <div className="space-y-3 pt-2 border-t border-steam-border/50">
            <label className="block text-[11px] font-bold text-steam-tertiary uppercase tracking-widest">
              Your private link
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 min-w-0 bg-steam-elevated border border-steam-border rounded-xl px-4 py-2.5 text-sm text-steam-text font-mono"
              />
              <button
                type="button"
                onClick={() => void copyLink()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-steam-accent text-white text-sm font-bold hover:opacity-90 transition-opacity shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => void run('regenerate')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-steam-secondary hover:text-steam-accent transition-colors disabled:opacity-50"
            >
              {busy === 'regenerate' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Regenerate link
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const PreviewBlock: React.FC<{
  active: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ active, label, onClick, disabled, className = '', children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full text-left rounded-xl border p-2.5 transition-all ${className} ${
      active
        ? 'border-steam-accent/50 bg-steam-card opacity-100'
        : 'border-dashed border-steam-border/60 bg-steam-elevated/20 opacity-40'
    } disabled:cursor-not-allowed`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary">
        {label}
      </span>
      <span
        className={`text-[9px] font-bold uppercase ${active ? 'text-steam-accent' : 'text-steam-tertiary'}`}
      >
        {active ? 'Visible' : 'Hidden'}
      </span>
    </div>
    {children}
  </button>
);
