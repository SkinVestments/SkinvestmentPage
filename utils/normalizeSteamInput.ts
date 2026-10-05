/**
 * Normalize Steam profile / inventory / trade / bare ID / vanity input for steam-link-public.
 * Throws Error('steam_url_invalid') on rejection. Never log the raw input (may contain trade tokens).
 */
export function normalizeSteamInput(input: string): string {
  const invalid = (): never => {
    throw new Error('steam_url_invalid');
  };

  const value = input.trim();
  if (!value || value.length > 2048 || /[\u0000-\u0020\u007f\\]/.test(value)) {
    return invalid();
  }

  let candidate = value;
  if (/^[0-9]{17}$/.test(value)) {
    candidate = `https://steamcommunity.com/profiles/${value}`;
  } else if (/^[A-Za-z0-9_-]{2,32}$/.test(value)) {
    candidate = `https://steamcommunity.com/id/${value}`;
  } else if (/^\/?(id|profiles)\/([^/\s?#]+)\/?$/.test(value)) {
    candidate = `https://steamcommunity.com/${value.replace(/^\//, '')}`;
  } else if (/^(www\.)?steamcommunity\.com\//i.test(value)) {
    candidate = `https://${value}`;
  }

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return invalid();
  }

  if (
    !['http:', 'https:'].includes(url.protocol) ||
    !['steamcommunity.com', 'www.steamcommunity.com'].includes(url.hostname) ||
    url.username ||
    url.password ||
    url.port
  ) {
    return invalid();
  }

  if (/^\/tradeoffer\/new\/?$/i.test(url.pathname)) {
    const partners = url.searchParams.getAll('partner');
    if (partners.length !== 1 || !/^[0-9]{1,10}$/.test(partners[0])) return invalid();
    const partner = BigInt(partners[0]);
    if (partner < BigInt(1) || partner > BigInt('4294967295')) return invalid();
    const id = BigInt('76561197960265728') + partner;
    return `https://steamcommunity.com/profiles/${id.toString()}`;
  }

  const match = /^\/(profiles|id)\/([^/]+)(?:\/inventory)?\/?$/i.exec(url.pathname);
  if (!match) return invalid();

  if (match[1].toLowerCase() === 'profiles') {
    if (!/^[0-9]{17}$/.test(match[2])) return invalid();
  } else {
    let name: string;
    try {
      name = decodeURIComponent(match[2]);
    } catch {
      return invalid();
    }
    if (
      !name ||
      name.length > 100 ||
      name === '.' ||
      name === '..' ||
      /[\u0000-\u001f\u007f-\u009f/\\\s]/.test(name)
    ) {
      return invalid();
    }
  }

  url.search = '';
  url.hash = '';
  return url.toString();
}
