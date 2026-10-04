import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronDown,
  ClipboardPaste,
  ExternalLink,
  Link2,
  Loader2,
  User,
  X,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { MANAGE_SUBSCRIPTION_SETTINGS_PATH } from '@/constants/settingsLinks';
import { normalizeSteamInput } from '@/utils/normalizeSteamInput';
import {
  linkPublicSteamAccount,
  resolvePublicSteamAccount,
  steamPublicErrorMessage,
  SteamPublicLinkError,
  type SteamPublicPreview,
} from '@/utils/steamLinkPublic';

type Step = 'input' | 'preview';

interface AddSteamViaLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectViaSteam: () => void;
  /** After successful link: refresh list + optional inventory sync for steam id. */
  onLinked: (result: {
    steamId64: string;
    createdConnection: boolean;
  }) => void | Promise<void>;
}

const EXAMPLES = [
  { label: 'Profile', value: '…/id/yourname' },
  { label: 'Inventory', value: '…/profiles/…/inventory' },
  { label: 'Trade', value: '…/tradeoffer/new/?partner=…' },
  { label: 'Steam ID', value: '76561198…' },
  { label: 'URL name', value: 'yourname' },
];

export const AddSteamViaLinkModal: React.FC<AddSteamViaLinkModalProps> = ({
  isOpen,
  onClose,
  onConnectViaSteam,
  onLinked,
}) => {
  const { user, session } = useAuth();
  const fieldId = useId();
  const helpId = useId();
  const errorId = useId();
  const liveId = useId();

  const [step, setStep] = useState<Step>('input');
  const [rawInput, setRawInput] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [linking, setLinking] = useState(false);
  const [rateLimitedUntil, setRateLimitedUntil] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [preview, setPreview] = useState<SteamPublicPreview | null>(null);
  const [normalizedUrl, setNormalizedUrl] = useState<string | null>(null);

  const opRef = useRef(0);
  const linkMutexRef = useRef(false);
  const sessionUserRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    opRef.current += 1;
    linkMutexRef.current = false;
    setStep('input');
    setRawInput('');
    setFieldError(null);
    setLinkError(null);
    setResolving(false);
    setLinking(false);
    setPreview(null);
    setNormalizedUrl(null);
    setHelpOpen(false);
    sessionUserRef.current = null;
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }
    sessionUserRef.current = user?.id ?? null;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [isOpen, resetForm, user?.id]);

  useEffect(() => {
    if (!isOpen) return;
    if (sessionUserRef.current && user?.id && sessionUserRef.current !== user.id) {
      resetForm();
      sessionUserRef.current = user.id;
    }
  }, [isOpen, user?.id, resetForm]);

  const rateBlocked = Date.now() < rateLimitedUntil;

  const applyRateLimit = () => {
    setRateLimitedUntil(Date.now() + 60_000);
  };

  const requestClose = () => {
    if (linking) return;
    resetForm();
    onClose();
  };

  const handlePaste = async () => {
    if (linking || resolving) return;
    try {
      const text = await navigator.clipboard.readText();
      if (typeof text === 'string') {
        setRawInput(text.slice(0, 2048));
        setFieldError(null);
        setStep('input');
        setPreview(null);
        setNormalizedUrl(null);
      }
    } catch {
      /* clipboard denied */
    }
  };

  const handleInputChange = (value: string) => {
    if (linking) return;
    setRawInput(value.slice(0, 2048));
    setFieldError(null);
    if (step === 'preview') {
      opRef.current += 1;
      setStep('input');
      setPreview(null);
      setNormalizedUrl(null);
      setLinkError(null);
    }
  };

  const handleContinue = async () => {
    if (resolving || linking || rateBlocked) return;
    const trimmed = rawInput.trim();
    if (!trimmed) {
      setFieldError(steamPublicErrorMessage('empty'));
      return;
    }

    let normalized: string;
    try {
      normalized = normalizeSteamInput(trimmed);
    } catch {
      setFieldError(steamPublicErrorMessage('steam_url_invalid'));
      return;
    }

    const op = ++opRef.current;
    setResolving(true);
    setFieldError(null);
    setLinkError(null);

    try {
      const result = await resolvePublicSteamAccount(normalized);
      if (op !== opRef.current) return;
      if (sessionUserRef.current && user?.id && sessionUserRef.current !== user.id) return;
      setNormalizedUrl(normalized);
      setPreview(result);
      setStep('preview');
    } catch (err) {
      if (op !== opRef.current) return;
      const code =
        err instanceof SteamPublicLinkError
          ? err.code
          : err instanceof Error && err.message === 'steam_url_invalid'
            ? 'steam_url_invalid'
            : 'internal_error';
      if (code === 'rate_limited') applyRateLimit();
      setFieldError(steamPublicErrorMessage(code));
      console.warn('[steam-link-public] resolve failed', code);
    } finally {
      if (op === opRef.current) setResolving(false);
    }
  };

  const handleUseDifferent = () => {
    if (linking) return;
    opRef.current += 1;
    setStep('input');
    setPreview(null);
    setNormalizedUrl(null);
    setLinkError(null);
    setFieldError(null);
    window.setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleAddInventory = async () => {
    if (linkMutexRef.current || linking || resolving || rateBlocked) return;
    if (!preview || !normalizedUrl || !session?.access_token || !user) {
      setLinkError(steamPublicErrorMessage('unauthorized'));
      return;
    }
    if (sessionUserRef.current && sessionUserRef.current !== user.id) {
      resetForm();
      return;
    }

    linkMutexRef.current = true;
    const op = opRef.current;
    setLinking(true);
    setLinkError(null);

    try {
      const result = await linkPublicSteamAccount(normalizedUrl, preview.steam_id_64);
      if (op !== opRef.current) return;
      await onLinked({
        steamId64: result.steam_id_64,
        createdConnection: result.created_connection,
      });
      resetForm();
      onClose();
    } catch (err) {
      if (op !== opRef.current) return;
      const code = err instanceof SteamPublicLinkError ? err.code : 'internal_error';
      if (code === 'rate_limited') applyRateLimit();
      if (code === 'steam_profile_changed') {
        setPreview(null);
        setNormalizedUrl(null);
        setStep('input');
        setFieldError(steamPublicErrorMessage(code));
        setLinkError(null);
      } else {
        setLinkError(steamPublicErrorMessage(code));
      }
      console.warn('[steam-link-public] link failed', code);
    } finally {
      linkMutexRef.current = false;
      if (op === opRef.current) setLinking(false);
    }
  };

  const busy = resolving || linking;
  const profileHref = preview
    ? `https://steamcommunity.com/profiles/${preview.steam_id_64}`
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={requestClose}
      title="Add Steam account"
      maxWidth="md"
      closeOnOverlayClick={!linking}
      panelClassName="border-orange-400/30 bg-steam-card shadow-[0_25px_60px_-15px_rgba(234,88,12,0.28)] overflow-hidden"
      bodyClassName="overflow-y-auto flex-1 p-5 sm:p-6 text-steam-text min-h-0 space-y-5"
      footerClassName="flex flex-col-reverse sm:flex-row gap-3 p-5 sm:p-6 border-t border-orange-500/15 shrink-0 bg-orange-500/[0.06]"
      header={
        <div className="relative shrink-0 border-b border-orange-500/20 bg-gradient-to-br from-orange-500/20 via-orange-500/5 to-transparent px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
          <button
            type="button"
            onClick={requestClose}
            disabled={linking}
            className="pressable absolute right-3 top-3 sm:right-4 sm:top-4 p-2 rounded-lg text-steam-tertiary hover:text-steam-text hover:bg-steam-hover/80 disabled:opacity-40"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-start gap-3.5 pr-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-950/40 border border-orange-300/40 flex items-center justify-center shrink-0">
              <Link2 className="w-5 h-5" aria-hidden />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange-300/90 mb-1">
                Public inventory
              </p>
              <h3 className="text-xl font-bold text-steam-text tracking-tight">
                Add your inventory
              </h3>
              <p className="text-sm text-steam-secondary mt-1 leading-snug">
                Use a public Steam profile. No Steam sign-in required.
              </p>
            </div>
          </div>
        </div>
      }
      footer={
        step === 'input' ? (
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center w-full">
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                if (busy) return;
                resetForm();
                onClose();
                onConnectViaSteam();
              }}
              className="pressable text-xs font-bold text-steam-secondary hover:text-steam-text order-2 sm:order-1 py-2"
            >
              Connect via Steam instead
            </button>
            <button
              type="button"
              disabled={busy || rateBlocked}
              onClick={() => void handleContinue()}
              className="pressable inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-orange-400 to-orange-600 hover:from-orange-300 hover:to-orange-500 text-white px-6 py-2.5 text-sm font-bold shadow-lg shadow-orange-950/30 border border-orange-300/30 disabled:opacity-50 order-1 sm:order-2"
            >
              {resolving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Continue
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end w-full">
            <button
              type="button"
              disabled={linking}
              onClick={handleUseDifferent}
              className="pressable inline-flex items-center justify-center rounded-xl border border-steam-border bg-steam-elevated/70 px-4 py-2.5 text-sm font-bold text-steam-text hover:bg-steam-hover disabled:opacity-50"
            >
              Use a different account
            </button>
            <button
              type="button"
              disabled={linking || rateBlocked}
              onClick={() => void handleAddInventory()}
              className="pressable inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-orange-400 to-orange-600 hover:from-orange-300 hover:to-orange-500 text-white px-6 py-2.5 text-sm font-bold shadow-lg shadow-orange-950/30 border border-orange-300/30 disabled:opacity-50"
            >
              {linking ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Add inventory
            </button>
          </div>
        )
      }
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only" id={liveId}>
        {fieldError || linkError || (step === 'preview' ? 'Account preview ready' : '')}
      </div>

      {step === 'input' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor={fieldId}
              className="block text-xs font-bold text-steam-tertiary uppercase tracking-wider"
            >
              Steam link or profile ID
            </label>
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-orange-400/50 to-steam-border/80 shadow-inner">
              <div className="relative rounded-[15px] bg-steam-elevated/90">
                <input
                  ref={inputRef}
                  id={fieldId}
                  type="text"
                  inputMode="text"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={2048}
                  disabled={busy}
                  value={rawInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void handleContinue();
                    }
                  }}
                  placeholder="steamcommunity.com/id/yourname"
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={fieldError ? errorId : helpId}
                  className={`w-full rounded-[15px] border-0 bg-transparent px-3.5 py-3.5 pr-[5.5rem] text-sm text-steam-text placeholder:text-steam-tertiary focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 ${
                    fieldError ? 'ring-2 ring-steam-loss/50' : ''
                  } disabled:opacity-60`}
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void handlePaste()}
                  className="pressable absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-xl border border-orange-400/30 bg-orange-500/15 px-2.5 py-1.5 text-[11px] font-bold text-orange-200 hover:bg-orange-500/25 disabled:opacity-50"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  Paste
                </button>
              </div>
            </div>

            {fieldError ? (
              <p id={errorId} role="alert" className="text-xs text-steam-loss leading-relaxed">
                {fieldError}
                {fieldError.toLowerCase().includes('plan') && (
                  <>
                    {' '}
                    <Link
                      to={MANAGE_SUBSCRIPTION_SETTINGS_PATH}
                      className="font-bold underline underline-offset-2"
                    >
                      Manage plan
                    </Link>
                  </>
                )}
              </p>
            ) : (
              <p id={helpId} className="text-xs text-steam-tertiary leading-relaxed">
                Paste a profile, inventory or trade link. Your inventory must be set to Public.
              </p>
            )}
          </div>

          <p className="text-xs font-medium text-steam-secondary">
            You&apos;ll check the account before adding it.
          </p>

          <div className="rounded-2xl border border-steam-border/60 bg-steam-bg/40 px-3.5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary mb-2.5">
              Accepted examples
            </p>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLES.map((ex) => (
                <span
                  key={ex.label}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-steam-border/70 bg-steam-elevated/70 px-2 py-1 text-[11px]"
                >
                  <span className="font-bold text-orange-300/90">{ex.label}</span>
                  <span className="font-mono text-steam-tertiary">{ex.value}</span>
                </span>
              ))}
            </div>
            <p className="mt-2.5 text-[11px] text-steam-tertiary leading-relaxed">
              Use the name in your profile URL, not your display name or Steam login.
            </p>
          </div>

          <details
            className="rounded-2xl border border-steam-border/50 bg-steam-elevated/30 open:bg-steam-elevated/45"
            open={helpOpen}
            onToggle={(e) => setHelpOpen((e.target as HTMLDetailsElement).open)}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-2.5 text-xs font-bold text-steam-secondary">
              Where do I find my profile link?
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-transform ${helpOpen ? 'rotate-180' : ''}`}
              />
            </summary>
            <p className="px-3.5 pb-3.5 text-xs text-steam-tertiary leading-relaxed">
              Open your Steam profile and copy its link using Share. In a browser, copy the address
              of your profile or inventory. For your trade link, open Inventory → Trade Offers → Who
              can send me Trade Offers? and copy your Trade URL.
            </p>
          </details>
        </div>
      )}

      {step === 'preview' && preview && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-orange-400/25 bg-gradient-to-br from-orange-500/10 via-steam-elevated/50 to-steam-card p-4 shadow-inner">
            <div className="flex items-center gap-3">
              {preview.steam_avatar_url ? (
                <img
                  src={preview.steam_avatar_url}
                  alt=""
                  className="w-14 h-14 rounded-2xl object-cover border border-orange-400/30 shrink-0 shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-steam-card border border-steam-border flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-steam-tertiary" aria-hidden />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-steam-text truncate">
                  {preview.steam_username?.trim() || 'Steam account'}
                </p>
                <p className="text-xs font-mono text-steam-tertiary mt-0.5">
                  {preview.steam_id_64}
                </p>
                {profileHref && (
                  <a
                    href={profileHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-300 hover:text-orange-200 hover:underline mt-1"
                  >
                    Open Steam profile
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="mt-3.5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-lg border border-green-500/35 bg-green-500/15 px-2.5 py-1 text-[11px] font-bold text-green-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Public inventory available
              </span>
            </div>

            <p className="mt-3.5 text-sm font-bold text-steam-text">Is this the right account?</p>
            <p className="mt-1 text-xs text-steam-secondary leading-relaxed">
              We&apos;ll read this account&apos;s public CS2 inventory. This doesn&apos;t grant access
              to trading or Steam sign-in.
            </p>
          </div>

          {linkError && (
            <p role="alert" className="text-xs text-steam-loss leading-relaxed">
              {linkError}
              {linkError.toLowerCase().includes('plan') && (
                <>
                  {' '}
                  <Link
                    to={MANAGE_SUBSCRIPTION_SETTINGS_PATH}
                    className="font-bold underline underline-offset-2"
                  >
                    Manage plan
                  </Link>
                </>
              )}
            </p>
          )}
        </div>
      )}
    </Modal>
  );
};
