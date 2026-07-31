import React, { useCallback, useEffect, useState } from 'react';
import {
  BarChart3,
  Check,
  Code2,
  Copy,
  FolderKanban,
  History,
  LayoutGrid,
  Link2,
  Loader2,
  MonitorPlay,
  Package,
  PieChart,
  RefreshCw,
  Share2,
} from 'lucide-react';
import type {
  PortfolioEmbedLayout,
  PortfolioShareRow,
  PortfolioShareVisibility,
} from '@/types/portfolioShare';
import { DEFAULT_EMBED_LAYOUT, visibilityFromShareRow } from '@/types/portfolioShare';
import {
  bioShareSnippet,
  disableShare,
  embedIframeSnippet,
  embedLayoutFromShare,
  embedUrl,
  enableShare,
  fetchOwnShare,
  regenerateShareToken,
  shareUrl,
  updateShareEmbedLayout,
  updateShareVisibility,
} from '@/utils/portfolioShare';

type VisibilityKey = keyof PortfolioShareVisibility;
type BusyAction = 'enable' | 'disable' | 'regenerate' | 'embed_layout' | VisibilityKey;
type CopiedKind = 'link' | 'iframe' | 'obs' | 'bio' | null;

const EMBED_LAYOUT_OPTIONS: Array<{
  key: PortfolioEmbedLayout;
  label: string;
  hint: string;
  heightHint: string;
}> = [
  {
    key: 'summary',
    label: 'Summary',
    hint: 'Name, value, item count',
    heightHint: '180px',
  },
  {
    key: 'top',
    label: 'Top holdings',
    hint: 'Summary + top skins',
    heightHint: '320px',
  },
  {
    key: 'sections',
    label: 'Match sections',
    hint: 'Respects your visibility toggles',
    heightHint: '420px',
  },
];

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
  const [embedLayout, setEmbedLayout] = useState<PortfolioEmbedLayout>(DEFAULT_EMBED_LAYOUT);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<BusyAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<CopiedKind>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const row = await fetchOwnShare();
      setShare(row);
      setVisibility(visibilityFromShareRow(row));
      setEmbedLayout(embedLayoutFromShare(row));
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
    setCopied(null);
    try {
      const row =
        action === 'enable'
          ? await enableShare()
          : action === 'disable'
            ? await disableShare()
            : await regenerateShareToken();
      setShare(row);
      setVisibility(visibilityFromShareRow(row));
      setEmbedLayout(embedLayoutFromShare(row));
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

  const setLayout = async (layout: PortfolioEmbedLayout) => {
    if (!share?.enabled || layout === embedLayout) return;
    const prev = embedLayout;
    setBusy('embed_layout');
    setError(null);
    setEmbedLayout(layout);
    try {
      const row = await updateShareEmbedLayout(layout);
      setShare(row);
      setEmbedLayout(embedLayoutFromShare(row));
    } catch (err) {
      setEmbedLayout(prev);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Could not update embed layout.';
      setError(message);
    } finally {
      setBusy(null);
    }
  };

  const enabled = Boolean(share?.enabled && share.token);
  const url = enabled && share ? shareUrl(share.token) : '';
  const obsUrl = enabled && share ? embedUrl(share.token, embedLayout) : '';
  const iframeCode = enabled && share ? embedIframeSnippet(share.token, embedLayout) : '';
  const bioText = enabled && share ? bioShareSnippet(share.token) : '';

  const copyText = async (kind: Exclude<CopiedKind, null>, text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setError('Could not copy. Copy it manually from the field.');
    }
  };

  const copyLink = async () => {
    await copyText('link', url);
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
                Live preview - click a block to toggle
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
                {copied === 'link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === 'link' ? 'Copied' : 'Copy'}
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

        {enabled && share?.token && (
          <div className="space-y-4 pt-2 border-t border-steam-border/50">
            <div>
              <p className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-1">
                Embed &amp; stream
              </p>
              <p className="text-xs text-steam-secondary leading-relaxed">
                Use the iframe on sites that allow embeds, the OBS URL as a Browser Source, or the
                bio text for Twitch / Kick descriptions (link only — no iframe there).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {EMBED_LAYOUT_OPTIONS.map((opt) => {
                const active = embedLayout === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    disabled={busy !== null}
                    onClick={() => void setLayout(opt.key)}
                    className={`text-left rounded-xl border px-3 py-3 transition-colors disabled:opacity-60 ${
                      active
                        ? 'border-steam-accent/50 bg-steam-accent/10'
                        : 'border-steam-border bg-steam-elevated/40 hover:bg-steam-hover'
                    }`}
                  >
                    <span className="block text-sm font-bold text-steam-text">{opt.label}</span>
                    <span className="block text-[11px] text-steam-tertiary mt-0.5">{opt.hint}</span>
                    <span className="block text-[10px] text-steam-tertiary mt-1.5 uppercase tracking-wider">
                      ~{opt.heightHint}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-steam-border bg-steam-bg/60 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary mb-2">
                Widget preview
              </p>
              <EmbedLayoutSketch layout={embedLayout} />
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void copyText('iframe', iframeCode)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-steam-accent text-white text-sm font-bold hover:opacity-90 transition-opacity"
              >
                {copied === 'iframe' ? <Check className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                {copied === 'iframe' ? 'Copied iframe' : 'Copy iframe'}
              </button>
              <button
                type="button"
                onClick={() => void copyText('obs', obsUrl)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-steam-border bg-steam-card text-steam-text text-sm font-bold hover:bg-steam-hover transition-colors"
              >
                {copied === 'obs' ? (
                  <Check className="w-4 h-4 text-steam-accent" />
                ) : (
                  <MonitorPlay className="w-4 h-4 text-steam-accent" />
                )}
                {copied === 'obs' ? 'Copied OBS URL' : 'Copy OBS URL'}
              </button>
              <button
                type="button"
                onClick={() => void copyText('bio', bioText)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-steam-border bg-steam-card text-steam-text text-sm font-bold hover:bg-steam-hover transition-colors"
              >
                {copied === 'bio' ? (
                  <Check className="w-4 h-4 text-steam-accent" />
                ) : (
                  <Link2 className="w-4 h-4 text-steam-accent" />
                )}
                {copied === 'bio' ? 'Copied bio text' : 'Copy bio text'}
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-steam-tertiary uppercase tracking-widest">
                OBS / embed URL
              </label>
              <input
                type="text"
                readOnly
                value={obsUrl}
                className="w-full min-w-0 bg-steam-elevated border border-steam-border rounded-xl px-4 py-2.5 text-xs text-steam-text font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EmbedLayoutSketch: React.FC<{ layout: PortfolioEmbedLayout }> = ({ layout }) => (
  <div className="rounded-lg border border-steam-border/60 bg-steam-card p-2.5 space-y-2 max-w-[220px]">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-md bg-steam-elevated border border-steam-border" />
      <div className="space-y-1 flex-1">
        <div className="h-1.5 w-12 rounded bg-steam-accent/40" />
        <div className="h-2 w-20 rounded bg-steam-elevated" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-1.5">
      <div className="h-8 rounded-md bg-steam-elevated/80" />
      <div className="h-8 rounded-md bg-steam-elevated/80" />
    </div>
    {layout === 'top' && (
      <div className="space-y-1">
        <div className="h-5 rounded bg-steam-elevated/70" />
        <div className="h-5 rounded bg-steam-elevated/70" />
        <div className="h-5 rounded bg-steam-elevated/70" />
      </div>
    )}
    {layout === 'sections' && (
      <>
        <div className="h-10 rounded-md bg-gradient-to-t from-steam-accent/20 to-transparent border border-steam-border/40" />
        <div className="grid grid-cols-4 gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded bg-steam-elevated/80" />
          ))}
        </div>
      </>
    )}
  </div>
);

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
