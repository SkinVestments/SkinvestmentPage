// @ts-nocheck
/**
 * Steam OpenID auth + account linking.
 *
 * Link (mobile): /link?user_id=UUID
 *   → steamvestments://link-callback?steam_id=...
 *
 * Link (web): /link?user_id=UUID&platform=web&redirect_to=https://skinvestments.app/settings?tab=account
 *   → {redirect_to}?steam_link=success&steam_id=...
 *   → {redirect_to}?steam_link=error&message=...
 *
 * Deploy: supabase functions deploy steam-auth
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";
const STEAM_API_BASE = "https://api.steampowered.com";

/** Allowed web return hosts (path may vary). */
const WEB_REDIRECT_HOSTS = new Set([
  "skinvestments.app",
  "www.skinvestments.app",
  "localhost",
  "127.0.0.1",
]);

const PLAN_STEAM_LIMITS = {
  free: 1,
  pro: 3,
  pro_max: 15,
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const action = pathSegments[pathSegments.length - 1];

  try {
    if (action === "callback") {
      return await handleCallback(url);
    }
    if (action === "link") {
      return handleLink(url);
    }
    if (action === "link-callback") {
      return await handleLinkCallback(url);
    }
    return handleLogin(url);
  } catch (error) {
    console.error("Steam auth error:", error);
    return errorRedirect(String(error));
  }
});

// ============================================================
// /login — Redirect to Steam OpenID (for sign-in)
// ============================================================
function handleLogin(_requestUrl: URL): Response {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const returnTo = `${supabaseUrl}/functions/v1/steam-auth/callback`;

  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnTo,
    "openid.realm": supabaseUrl,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });

  return new Response(null, {
    status: 302,
    headers: { ...corsHeaders, Location: `${STEAM_OPENID_URL}?${params.toString()}` },
  });
}

// ============================================================
// /callback — Validate OpenID & create/find user (sign-in flow)
// ============================================================
async function handleCallback(requestUrl: URL): Promise<Response> {
  const searchParams = requestUrl.searchParams;
  const isValid = await validateOpenIdResponse(searchParams);
  if (!isValid) return errorRedirect("Invalid Steam signature");

  const claimedId = searchParams.get("openid.claimed_id") ?? "";
  const steamId = claimedId.split("/").pop();
  if (!steamId) return errorRedirect("SteamID not found");

  const steamApiKey = Deno.env.get("STEAM_API_KEY")!;
  const profile = await fetchSteamProfile(steamId, steamApiKey);

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const session = await findOrCreateUser(supabaseAdmin, steamId, profile);

  const deepLinkUrl =
    `steamvestments://login-callback?access_token=${encodeURIComponent(session.access_token)}&refresh_token=${encodeURIComponent(session.refresh_token)}`;

  return new Response(null, {
    status: 302,
    headers: { ...corsHeaders, Location: deepLinkUrl },
  });
}

// ============================================================
// /link?user_id=UUID[&platform=web&redirect_to=...]
// ============================================================
function handleLink(requestUrl: URL): Response {
  const userId = requestUrl.searchParams.get("user_id");
  if (!userId) {
    return linkErrorRedirect("Missing user_id parameter");
  }

  const platform = (requestUrl.searchParams.get("platform") || "mobile").toLowerCase();
  const redirectToRaw = requestUrl.searchParams.get("redirect_to") || "";
  const redirectTo = platform === "web" ? sanitizeWebRedirect(redirectToRaw) : "";

  if (platform === "web" && !redirectTo) {
    return linkErrorRedirect("Invalid or missing redirect_to for web");
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const returnToUrl = new URL(`${supabaseUrl}/functions/v1/steam-auth/link-callback`);
  returnToUrl.searchParams.set("user_id", userId);
  if (platform === "web") {
    returnToUrl.searchParams.set("platform", "web");
    returnToUrl.searchParams.set("redirect_to", redirectTo);
  }

  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnToUrl.toString(),
    "openid.realm": supabaseUrl,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });

  return new Response(null, {
    status: 302,
    headers: { ...corsHeaders, Location: `${STEAM_OPENID_URL}?${params.toString()}` },
  });
}

// ============================================================
// /link-callback — Validate OpenID & link Steam to existing user
// ============================================================
async function handleLinkCallback(requestUrl: URL): Promise<Response> {
  const searchParams = requestUrl.searchParams;
  const userId = searchParams.get("user_id");
  const platform = (searchParams.get("platform") || "mobile").toLowerCase();
  const redirectTo = platform === "web"
    ? sanitizeWebRedirect(searchParams.get("redirect_to") || "")
    : "";

  const fail = (msg: string) => linkErrorRedirect(msg, platform, redirectTo);

  if (!userId) {
    return fail("Missing user_id in callback");
  }
  if (platform === "web" && !redirectTo) {
    return fail("Invalid redirect_to in callback");
  }

  const isValid = await validateOpenIdResponse(searchParams);
  if (!isValid) return fail("Invalid Steam signature");

  const claimedId = searchParams.get("openid.claimed_id") ?? "";
  const steamId = claimedId.split("/").pop();
  if (!steamId) return fail("SteamID not found");

  const steamApiKey = Deno.env.get("STEAM_API_KEY")!;
  const profile = await fetchSteamProfile(steamId, steamApiKey);

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Plan limit (same as mobile UI / link_steam_account RPC)
  const { data: existingLink } = await supabaseAdmin
    .from("steam_connections")
    .select("steam_id_64")
    .eq("user_id", userId)
    .eq("steam_id_64", steamId)
    .maybeSingle();

  if (!existingLink) {
    const { data: profileRow } = await supabaseAdmin
      .from("profiles")
      .select("plan_subscription")
      .eq("id", userId)
      .maybeSingle();

    const plan = String(profileRow?.plan_subscription || "free");
    const limit = PLAN_STEAM_LIMITS[plan] ?? 1;

    const { count } = await supabaseAdmin
      .from("steam_connections")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if ((count ?? 0) >= limit) {
      return fail(`Steam accounts limit reached for current plan (${limit})`);
    }
  }

  // Upsert side account — never overwrite main profile nickname/avatar
  const { error: upsertError } = await supabaseAdmin
    .from("steam_connections")
    .upsert(
      {
        user_id: userId,
        steam_id_64: steamId,
        steam_username: profile.personaname,
        steam_avatar_url: profile.avatarfull,
        linked_at: new Date().toISOString(),
        last_profile_sync: new Date().toISOString(),
        is_main: false,
      },
      { onConflict: "user_id, steam_id_64" },
    );

  if (upsertError) {
    console.error("Failed to upsert steam_connection:", upsertError);
    return fail("Database error linking Steam account");
  }

  if (platform === "web" && redirectTo) {
    const dest = new URL(redirectTo);
    dest.searchParams.set("steam_link", "success");
    dest.searchParams.set("steam_id", steamId);
    return new Response(null, {
      status: 302,
      headers: { ...corsHeaders, Location: dest.toString() },
    });
  }

  const deepLinkUrl = `steamvestments://link-callback?steam_id=${encodeURIComponent(steamId)}`;
  return new Response(null, {
    status: 302,
    headers: { ...corsHeaders, Location: deepLinkUrl },
  });
}

// ============================================================
// Shared helpers
// ============================================================

function sanitizeWebRedirect(raw: string): string {
  if (!raw) return "";
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:" && u.protocol !== "http:") return "";
    // Allow http only on localhost
    if (u.protocol === "http:" && u.hostname !== "localhost" && u.hostname !== "127.0.0.1") {
      return "";
    }
    if (!WEB_REDIRECT_HOSTS.has(u.hostname)) return "";
    // Strip any attacker-controlled steam_link params; web app sets them after redirect
    u.searchParams.delete("steam_link");
    u.searchParams.delete("steam_id");
    u.searchParams.delete("message");
    return u.toString();
  } catch {
    return "";
  }
}

async function validateOpenIdResponse(params: URLSearchParams): Promise<boolean> {
  const vParams = new URLSearchParams();
  for (const [key, value] of params) {
    if (key.startsWith("openid.")) {
      vParams.set(key, value);
    }
  }
  vParams.set("openid.mode", "check_authentication");
  const resp = await fetch(STEAM_OPENID_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: vParams.toString(),
  });
  const text = await resp.text();
  return text.includes("is_valid:true");
}

async function fetchSteamProfile(steamId: string, apiKey: string) {
  const url =
    `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data.response.players[0];
}

async function findOrCreateUser(supabaseAdmin: any, steamId: string, profile: any) {
  const { data: existing } = await supabaseAdmin
    .from("steam_connections")
    .select("user_id")
    .eq("steam_id_64", steamId)
    .limit(1)
    .maybeSingle();

  let userId: string;
  const userEmail = `steam_${steamId}@steamvestments.app`;

  if (existing) {
    userId = existing.user_id;
    await supabaseAdmin.from("profiles").update({
      nickname: profile.personaname,
      avatar: profile.avatarfull,
    }).eq("id", userId);

    await supabaseAdmin.from("steam_connections").update({
      steam_username: profile.personaname,
      steam_avatar_url: profile.avatarfull,
      last_profile_sync: new Date().toISOString(),
    }).eq("user_id", userId).eq("steam_id_64", steamId);
  } else {
    const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userEmail,
      email_confirm: true,
      user_metadata: {
        display_name: profile.personaname,
        avatar_url: profile.avatarfull,
        provider: "steam",
      },
    });

    if (authError) throw authError;
    userId = newUser.user.id;

    const { error: profileError } = await supabaseAdmin.from("profiles").update({
      nickname: profile.personaname,
      avatar: profile.avatarfull,
      plan_subscription: "free",
      settings: {},
    }).eq("id", userId);

    if (profileError) console.error("Profile Update Error:", profileError);

    const { error: insertError } = await supabaseAdmin.from("steam_connections").insert({
      user_id: userId,
      steam_id_64: steamId,
      steam_username: profile.personaname,
      steam_avatar_url: profile.avatarfull,
      is_main: true,
      linked_at: new Date().toISOString(),
      last_profile_sync: new Date().toISOString(),
    });

    if (insertError) console.error("Steam Connection Insert Error:", insertError);

    const { data: existingCollection } = await supabaseAdmin
      .from("collections")
      .select("id")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (!existingCollection) {
      await supabaseAdmin.from("collections").insert({
        user_id: userId,
        name: "Main Vault",
      });
    }
  }

  const { data: session, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: userEmail,
  });

  if (linkError || !session) {
    console.error("Link generation error:", linkError);
    throw new Error("Failed to generate login token");
  }

  const { data: finalSession, error: otpError } = await supabaseAdmin.auth.verifyOtp({
    token_hash: session.properties.hashed_token,
    type: "magiclink",
  });

  if (otpError || !finalSession?.session) {
    console.error("OTP verification error:", otpError);
    throw new Error("Failed to verify login token");
  }

  return finalSession.session;
}

function errorRedirect(msg: string): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: `steamvestments://login-callback?error=${encodeURIComponent(msg)}`,
    },
  });
}

function linkErrorRedirect(
  msg: string,
  platform = "mobile",
  redirectTo = "",
): Response {
  if (platform === "web" && redirectTo) {
    try {
      const dest = new URL(redirectTo);
      dest.searchParams.set("steam_link", "error");
      dest.searchParams.set("message", msg);
      return new Response(null, {
        status: 302,
        headers: { ...corsHeaders, Location: dest.toString() },
      });
    } catch {
      /* fall through to deep link */
    }
  }

  return new Response(null, {
    status: 302,
    headers: {
      ...corsHeaders,
      Location: `steamvestments://link-callback?error=${encodeURIComponent(msg)}`,
    },
  });
}
