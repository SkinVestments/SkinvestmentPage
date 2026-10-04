import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader2,
  Link2,
  RefreshCw,
  Star,
  Unlink,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Package,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptionPlan } from '@/hooks/useSubscriptionPlan';
import { MANAGE_SUBSCRIPTION_SETTINGS_PATH } from '@/constants/settingsLinks';
import { getSteamAccountLimit, type SteamConnection, type SteamMatchedItem } from '@/types/steam';
import {
  canLinkMoreSteamAccounts,
  fetchAllSteamInventories,
  fetchSteamConnections,
  fetchSteamInventory,
  setMainSteamAccount,
  startSteamAccountLink,
  trackSteamEvent,
  unlinkSteamAccount,
} from '@/utils/steamAccounts';
import {
  fetchOwnedPortfolioItemIds,
  matchSteamInventoryToCatalog,
} from '@/utils/steamInventory';
import { SteamInventoryImportModal } from '@/components/dashboard/SteamInventoryImportModal';
import { AddSteamViaLinkModal } from '@/components/dashboard/AddSteamViaLinkModal';

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = String((err as { message?: string }).message);
    if (msg) return msg;
  }
  return fallback;
};

/** True when the signed-in user authenticated via Steam (main account protected). */
function isSteamLoginUser(user: { app_metadata?: Record<string, unknown>; identities?: { provider: string }[] } | null): boolean {
  if (!user) return false;
  if (user.app_metadata?.provider === 'steam') return true;
  return Boolean(user.identities?.some((i) => i.provider === 'steam'));
}

interface SteamAccountsPanelProps {
  flash?: { type: 'success' | 'error'; message: string } | null;
}

export const SteamAccountsPanel: React.FC<SteamAccountsPanelProps> = ({ flash = null }) => {
  const { user, session } = useAuth();
  const { planId } = useSubscriptionPlan();
  const [connections, setConnections] = useState<SteamConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(
    flash,
  );

  const [importOpen, setImportOpen] = useState(false);
  const [importItems, setImportItems] = useState<SteamMatchedItem[]>([]);
  const [skippedUnknown, setSkippedUnknown] = useState(0);
  /** Two-step unlink — avoid window.confirm (often blocked / silent false). */
  const [unlinkConfirmId, setUnlinkConfirmId] = useState<string | null>(null);
  const [addViaLinkOpen, setAddViaLinkOpen] = useState(false);

  const steamLogin = isSteamLoginUser(user);
  const limit = getSteamAccountLimit(planId);
  const canLinkMore = canLinkMoreSteamAccounts(planId, connections.length);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchSteamConnections(user.id);
      setConnections(rows);
    } catch (err) {
      console.error(err);
      setError(
        getErrorMessage(err, 'Could not load linked Steam accounts. Refresh the page and try again.'),
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (flash) setBanner(flash);
  }, [flash]);

  const handleLink = () => {
    if (!user) return;
    if (!canLinkMore) {
      setBanner({
        type: 'error',
        message: `Your plan allows ${limit} Steam account${limit === 1 ? '' : 's'}. Upgrade to link more.`,
      });
      return;
    }
    try {
      startSteamAccountLink({ userId: user.id });
    } catch (err) {
      setBanner({
        type: 'error',
        message: getErrorMessage(
          err,
          'Could not open Steam login. Check your connection, then try Link Steam again.',
        ),
      });
    }
  };

  const runImportPipeline = async (
    steamIds: string[],
    opts?: { afterPublicLink?: boolean },
  ) => {
    if (!user || !session?.access_token) {
      throw new Error('Not authenticated');
    }
    const result =
      steamIds.length === 1
        ? await fetchSteamInventory(steamIds[0], session.access_token)
        : await fetchAllSteamInventories(steamIds, session.access_token);

    const assets = result.items;

    if (assets.length === 0) {
      setBanner({
        type: opts?.afterPublicLink ? 'success' : 'error',
        message: opts?.afterPublicLink
          ? 'Account added. No items to import yet - set inventory to Public and use Sync when ready.'
          : result.hint ||
            result.error ||
            'Inventory is empty or private. Set Steam inventory to Public and retry.',
      });
      return;
    }

    const owned = await fetchOwnedPortfolioItemIds(user.id);
    const { matched, skippedUnknown: skipped } = await matchSteamInventoryToCatalog(
      assets,
      owned,
    );
    trackSteamEvent('steam_sync', { accounts: steamIds.length, matched: matched.length });

    if (matched.length === 0) {
      setBanner({
        type: 'error',
        message:
          skipped > 0
            ? `No catalog matches (${skipped} Steam items unknown to Skinvestments).`
            : 'Inventory is empty or private.',
      });
      return;
    }

    setImportItems(matched);
    setSkippedUnknown(skipped);
    setImportOpen(true);
  };

  const handleSyncOne = async (steamId: string) => {
    setActionId(steamId);
    setError(null);
    try {
      await runImportPipeline([steamId]);
    } catch (err) {
      console.error(err);
      setBanner({
        type: 'error',
        message: getErrorMessage(
          err,
          'Inventory sync failed. Make sure the Steam inventory is public, then retry.',
        ),
      });
    } finally {
      setActionId(null);
    }
  };

  const handleSyncAll = async () => {
    if (connections.length === 0) return;
    setSyncingAll(true);
    setError(null);
    try {
      await runImportPipeline(connections.map((c) => c.steam_id_64));
    } catch (err) {
      console.error(err);
      setBanner({
        type: 'error',
        message: getErrorMessage(
          err,
          'Inventory sync failed. Make sure the Steam inventory is public, then retry.',
        ),
      });
    } finally {
      setSyncingAll(false);
    }
  };

  const handleSetMain = async (steamId: string) => {
    if (steamLogin) {
      setBanner({
        type: 'error',
        message: 'Steam login users cannot change the main Steam account.',
      });
      return;
    }
    setActionId(`main-${steamId}`);
    try {
      await setMainSteamAccount(steamId);
      await reload();
      setBanner({
        type: 'success',
        message: 'Main Steam account updated. New imports will use this account by default.',
      });
    } catch (err) {
      setBanner({
        type: 'error',
        message: getErrorMessage(err, 'Could not set the main Steam account. Try again.'),
      });
    } finally {
      setActionId(null);
    }
  };

  const handleUnlink = async (conn: SteamConnection) => {
    if (steamLogin && conn.is_main) {
      setBanner({
        type: 'error',
        message: 'You cannot unlink the Steam account used to sign in.',
      });
      setUnlinkConfirmId(null);
      return;
    }

    if (unlinkConfirmId !== conn.steam_id_64) {
      setUnlinkConfirmId(conn.steam_id_64);
      setBanner({
        type: 'error',
        message: `Click “Confirm unlink” to remove ${conn.steam_username || conn.steam_id_64}.`,
      });
      return;
    }

    if (!user) return;

    setActionId(`unlink-${conn.steam_id_64}`);
    try {
      await unlinkSteamAccount(conn.steam_id_64);
      const rows = await fetchSteamConnections(user.id);
      setConnections(rows);
      setUnlinkConfirmId(null);

      if (rows.some((r) => r.steam_id_64 === conn.steam_id_64)) {
        setBanner({
          type: 'error',
          message:
            'Unlink did not remove the account. Run migration 20260806_unlink_steam_account_text.sql in Supabase SQL Editor, then retry.',
        });
      } else {
        setBanner({
          type: 'success',
          message: 'Steam account unlinked. Inventory sync for that account is no longer available.',
        });
      }
    } catch (err) {
      console.error('[Steam] unlink failed', err);
      setBanner({
        type: 'error',
        message: getErrorMessage(err, 'Could not unlink this Steam account. Try again in a moment.'),
      });
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-bold text-steam-text text-base">Steam Accounts</h3>
          <p className="text-xs text-steam-tertiary mt-0.5">
            {connections.length} / {limit} linked · sync pulls inventory, then you choose what to import
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {connections.length > 0 && (
            <button
              type="button"
              disabled={syncingAll || Boolean(actionId)}
              onClick={() => void handleSyncAll()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border border-steam-border bg-steam-elevated hover:bg-steam-hover text-steam-text disabled:opacity-50"
            >
              {syncingAll ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Sync all
            </button>
          )}
          <button
            type="button"
            disabled={!canLinkMore}
            onClick={() => setAddViaLinkOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border border-orange-500/35 bg-orange-500/10 text-orange-200 hover:bg-orange-500/20 disabled:opacity-50"
          >
            <Link2 className="w-3.5 h-3.5" />
            Add via link
          </button>
          <button
            type="button"
            disabled={!canLinkMore}
            onClick={handleLink}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-steam-accent text-white hover:opacity-90 disabled:opacity-50"
          >
            <Link2 className="w-3.5 h-3.5" />
            Link Steam
          </button>
        </div>
      </div>

      {!canLinkMore && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <p className="text-sm text-amber-100">
            Steam account limit reached for your plan ({limit}).
          </p>
          <Link
            to={MANAGE_SUBSCRIPTION_SETTINGS_PATH}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-200 hover:text-white"
          >
            <Sparkles className="w-3.5 h-3.5" /> Upgrade
          </Link>
        </div>
      )}

      {banner && (
        <div
          className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm ${
            banner.type === 'success'
              ? 'border-green-500/30 bg-green-500/10 text-green-200'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-100'
          }`}
        >
          {banner.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <p className="flex-1">{banner.message}</p>
          <button
            type="button"
            className="text-xs opacity-70 hover:opacity-100"
            onClick={() => setBanner(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 text-sm text-amber-100 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8 text-steam-accent">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : connections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-steam-border bg-steam-elevated/40 p-8 text-center">
          <Package className="w-8 h-8 text-steam-tertiary mx-auto mb-3 opacity-60" />
          <p className="text-sm font-bold text-steam-secondary">No Steam accounts linked</p>
          <p className="text-xs text-steam-tertiary mt-1 max-w-sm mx-auto">
            Add via a public Steam link or Connect via Steam, sync inventory, then pick items to
            import as BUY transactions. Nothing is imported automatically.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {connections.map((conn) => {
            const busy = actionId === conn.steam_id_64 || actionId === `main-${conn.steam_id_64}` || actionId === `unlink-${conn.steam_id_64}`;
            const unlinkBlocked = steamLogin && conn.is_main;
            const confirmUnlink = unlinkConfirmId === conn.steam_id_64;
            return (
              <li
                key={conn.steam_id_64}
                className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-steam-border bg-steam-elevated/50 p-3.5"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {conn.steam_avatar_url ? (
                    <img
                      src={conn.steam_avatar_url}
                      alt=""
                      className="w-10 h-10 rounded-full border border-steam-border shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-steam-bg border border-steam-border shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-steam-text truncate flex items-center gap-1.5">
                      {conn.steam_username || 'Steam user'}
                      {conn.is_main && (
                        <span className="text-[9px] uppercase tracking-wider font-bold text-steam-accent bg-steam-accent/15 px-1.5 py-0.5 rounded">
                          Main
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-steam-tertiary font-mono truncate">
                      {conn.steam_id_64}
                      {conn.inventory_status && conn.inventory_status !== 'ACTIVE'
                        ? ` · ${conn.inventory_status}`
                        : ''}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:justify-end">
                  <button
                    type="button"
                    disabled={busy || syncingAll}
                    onClick={() => void handleSyncOne(conn.steam_id_64)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-steam-accent/15 text-steam-accent hover:bg-steam-accent/25 disabled:opacity-50"
                  >
                    {actionId === conn.steam_id_64 ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                    Sync
                  </button>
                  {!conn.is_main && (
                    <button
                      type="button"
                      disabled={busy || steamLogin}
                      onClick={() => void handleSetMain(conn.steam_id_64)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-steam-secondary hover:bg-steam-hover disabled:opacity-50"
                      title={steamLogin ? 'Unavailable for Steam login' : 'Set as main'}
                    >
                      <Star className="w-3 h-3" />
                      Main
                    </button>
                  )}
                  {confirmUnlink && !unlinkBlocked ? (
                    <>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleUnlink(conn)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 disabled:opacity-50"
                      >
                        {actionId === `unlink-${conn.steam_id_64}` ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Unlink className="w-3 h-3" />
                        )}
                        Confirm unlink
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setUnlinkConfirmId(null)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-steam-tertiary hover:bg-steam-hover disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleUnlink(conn)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"
                      title={unlinkBlocked ? 'Cannot unlink sign-in account' : 'Unlink'}
                    >
                      <Unlink className="w-3 h-3" />
                      Unlink
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {steamLogin && (
        <p className="text-[11px] text-steam-tertiary">
          Signed in with Steam — your main linked account cannot be removed.
        </p>
      )}

      <SteamInventoryImportModal
        isOpen={importOpen}
        items={importItems}
        skippedUnknown={skippedUnknown}
        onClose={() => setImportOpen(false)}
        onSuccess={() => {
          setBanner({
            type: 'success',
            message: 'Selected Steam items were imported as BUY transactions into your inventory.',
          });
          void reload();
        }}
      />

      <AddSteamViaLinkModal
        isOpen={addViaLinkOpen}
        onClose={() => setAddViaLinkOpen(false)}
        onConnectViaSteam={handleLink}
        onLinked={async ({ steamId64, createdConnection }) => {
          setBanner({
            type: 'success',
            message: createdConnection
              ? 'Inventory added'
              : 'This inventory is already added',
          });
          await reload();
          // Link succeeded even if sync fails — keep messages separate.
          try {
            await runImportPipeline([steamId64], { afterPublicLink: true });
          } catch (err) {
            console.warn('[Steam] post-link sync failed', err instanceof Error ? err.message : 'error');
            setBanner({
              type: 'error',
              message: getErrorMessage(
                err,
                'Account added, but inventory sync failed. Use Sync on the account card to retry.',
              ),
            });
          }
        }}
      />
    </div>
  );
};
