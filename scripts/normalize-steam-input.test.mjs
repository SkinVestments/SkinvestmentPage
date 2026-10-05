/**
 * Node built-in test runner (no extra framework).
 * Keep logic in sync with utils/normalizeSteamInput.ts
 *
 *   node --test scripts/normalize-steam-input.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

function normalizeSteamInput(input) {
  const invalid = () => {
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
  let url;
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
    if (partner < 1n || partner > 4294967295n) return invalid();
    const id = 76561197960265728n + partner;
    return `https://steamcommunity.com/profiles/${id.toString()}`;
  }
  const match = /^\/(profiles|id)\/([^/]+)(?:\/inventory)?\/?$/i.exec(url.pathname);
  if (!match) return invalid();
  if (match[1].toLowerCase() === 'profiles') {
    if (!/^[0-9]{17}$/.test(match[2])) return invalid();
  } else {
    let name;
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

function ok(input, expected) {
  assert.equal(normalizeSteamInput(input), expected);
}

function bad(input) {
  assert.throws(() => normalizeSteamInput(input), { message: 'steam_url_invalid' });
}

test('profile by id and vanity', () => {
  ok(
    'https://steamcommunity.com/profiles/76561198000000001',
    'https://steamcommunity.com/profiles/76561198000000001',
  );
  ok('steamcommunity.com/id/yourname', 'https://steamcommunity.com/id/yourname');
  ok(
    'https://www.steamcommunity.com/id/yourname',
    'https://www.steamcommunity.com/id/yourname',
  );
});

test('inventory strips query/hash', () => {
  ok(
    'https://steamcommunity.com/profiles/76561198000000001/inventory/',
    'https://steamcommunity.com/profiles/76561198000000001/inventory/',
  );
  ok(
    'https://steamcommunity.com/id/yourname/inventory/#730',
    'https://steamcommunity.com/id/yourname/inventory/',
  );
});

test('bare id and vanity', () => {
  ok('76561198000000001', 'https://steamcommunity.com/profiles/76561198000000001');
  ok('yourname', 'https://steamcommunity.com/id/yourname');
  ok('/id/yourname', 'https://steamcommunity.com/id/yourname');
  ok('profiles/76561198000000001', 'https://steamcommunity.com/profiles/76561198000000001');
});

test('trade partner conversion with BigInt', () => {
  ok(
    'https://steamcommunity.com/tradeoffer/new/?partner=39734273&token=EXAMPLE',
    'https://steamcommunity.com/profiles/76561198000000001',
  );
  ok(
    'https://steamcommunity.com/tradeoffer/new/?partner=1',
    'https://steamcommunity.com/profiles/76561197960265729',
  );
  ok(
    'https://steamcommunity.com/tradeoffer/new/?partner=4294967295',
    'https://steamcommunity.com/profiles/76561202255233023',
  );
});

test('reject bad trade partners and hosts', () => {
  bad('https://steamcommunity.com/tradeoffer/new/?partner=0');
  bad('https://steamcommunity.com/tradeoffer/new/?partner=-1');
  bad('https://steamcommunity.com/tradeoffer/new/?partner=4294967296');
  bad('https://steamcommunity.com/tradeoffer/new/?partner=abc');
  bad('https://steamcommunity.com/tradeoffer/new/');
  bad('https://steamcommunity.com/tradeoffer/new/?partner=1&partner=1');
  bad('https://steamcommunity.com.evil.example/id/x');
  bad('https://evil.com/id/x');
  bad('https://user:pass@steamcommunity.com/id/x');
  bad('https://steamcommunity.com:8443/id/x');
  bad('ftp://steamcommunity.com/id/x');
  bad('https://steamcommunity.com/tradeoffer/12345');
  bad('https://steamcommunity.com/inventory/76561198000000001/730/2');
  bad('a'.repeat(2049));
});
