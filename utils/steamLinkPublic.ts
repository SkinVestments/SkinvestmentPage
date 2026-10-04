import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from '@supabase/supabase-js';
import { supabase } from '@/utils/supabaseClient';

export type SteamPublicPreview = {
  steam_id_64: string;
  steam_username: string | null;
  steam_avatar_url: string | null;
  profile_url: string;
  inventory_accessible: true;
};

export type SteamPublicLinkResult = SteamPublicPreview & {
  created_connection: boolean;
};

export type SteamPublicRequest =
  | { action: 'resolve'; url: string }
  | { action: 'link'; url: string; expected_steam_id_64: string };

const KNOWN_CODES = new Set([
  'invalid_request',
  'steam_url_invalid',
  'unauthorized',
  'method_not_allowed',
  'steam_profile_not_found',
  'steam_profile_changed',
  'steam_link_limit_reached',
  'steam_inventory_inaccessible',
  'rate_limited',
  'steam_unavailable',
  'internal_error',
  'network_error',
]);

export class SteamPublicLinkError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(code);
    this.name = 'SteamPublicLinkError';
    this.code = code;
  }
}

export function steamPublicErrorMessage(code: string): string {
  switch (code) {
    case 'empty':
      return 'Paste a Steam link, trade link, ID or URL name first.';
    case 'steam_url_invalid':
      return "That doesn't look like a Steam profile, inventory or trade link. You can also use a 17-digit Steam ID or custom URL name.";
    case 'invalid_request':
      return "We couldn't check this account. Please try again.";
    case 'unauthorized':
      return 'Your session has expired. Please sign in again.';
    case 'steam_profile_not_found':
      return "We couldn't find this Steam profile. Check the link and try again.";
    case 'steam_profile_changed':
      return 'This link now points to a different account. Check it again before adding.';
    case 'steam_link_limit_reached':
      return "You've reached your plan's Steam account limit.";
    case 'steam_inventory_inaccessible':
      return "We couldn't access this inventory. Make sure it is public and try again.";
    case 'rate_limited':
      return 'Too many attempts. Please wait a minute and try again.';
    case 'steam_unavailable':
      return "Steam isn't responding right now. Please try again in a moment.";
    case 'network_error':
      return "Couldn't connect. Check your internet connection and try again.";
    default:
      return "We couldn't add this inventory. Please try again.";
  }
}

function isSteamId64(v: unknown): v is string {
  return typeof v === 'string' && /^[0-9]{17}$/.test(v);
}

function nullableString(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v !== 'string') return null;
  return v;
}

function validatePreview(data: unknown): SteamPublicPreview {
  if (!data || typeof data !== 'object') {
    throw new SteamPublicLinkError('internal_error');
  }
  const row = data as Record<string, unknown>;
  if (!isSteamId64(row.steam_id_64)) throw new SteamPublicLinkError('internal_error');
  if (row.inventory_accessible !== true) throw new SteamPublicLinkError('internal_error');
  if (typeof row.profile_url !== 'string' || !row.profile_url) {
    throw new SteamPublicLinkError('internal_error');
  }
  const username = nullableString(row.steam_username);
  const avatar = nullableString(row.steam_avatar_url);
  return {
    steam_id_64: row.steam_id_64,
    steam_username: username,
    steam_avatar_url: avatar,
    profile_url: row.profile_url,
    inventory_accessible: true,
  };
}

function validateLinkResult(data: unknown): SteamPublicLinkResult {
  const preview = validatePreview(data);
  const row = data as Record<string, unknown>;
  if (typeof row.created_connection !== 'boolean') {
    throw new SteamPublicLinkError('internal_error');
  }
  return { ...preview, created_connection: row.created_connection };
}

async function invokeSteamLinkPublic(body: SteamPublicRequest): Promise<unknown> {
  const { data, error } = await supabase.functions.invoke('steam-link-public', {
    method: 'POST',
    body,
  });

  if (error instanceof FunctionsHttpError) {
    const response = error.context as Response;
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    const fallback =
      response.status === 401
        ? 'unauthorized'
        : response.status === 429
          ? 'rate_limited'
          : 'internal_error';
    const code =
      typeof payload?.error === 'string' && KNOWN_CODES.has(payload.error)
        ? payload.error
        : fallback;
    throw new SteamPublicLinkError(code);
  }

  if (error instanceof FunctionsFetchError || error instanceof FunctionsRelayError) {
    throw new SteamPublicLinkError('network_error');
  }

  if (error) throw new SteamPublicLinkError('internal_error');
  return data;
}

export async function resolvePublicSteamAccount(
  normalizedUrl: string,
): Promise<SteamPublicPreview> {
  const data = await invokeSteamLinkPublic({ action: 'resolve', url: normalizedUrl });
  return validatePreview(data);
}

export async function linkPublicSteamAccount(
  normalizedUrl: string,
  expectedSteamId64: string,
): Promise<SteamPublicLinkResult> {
  const data = await invokeSteamLinkPublic({
    action: 'link',
    url: normalizedUrl,
    expected_steam_id_64: expectedSteamId64,
  });
  return validateLinkResult(data);
}
