// @ts-nocheck
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  // apikey + x-client-info required for browser calls via supabase-js / fetch
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, apikey, x-client-info",
};

// CS2 specific constants
const CS2_APPID = 730;
const CS2_CONTEXTID = 2;

interface SteamInventoryItem {
  asset_id: string;
  class_id: string;
  instance_id: string;
  amount: number;
  name: string;
  market_hash_name: string;
  type: string;
  icon_url: string;
  tradable: boolean;
  marketable: boolean;
}

async function fetchSteamInventory(steamId64: string): Promise<SteamInventoryItem[]> {
  console.log(`\n=== Starting Steam Inventory Fetch ===`);
  console.log(`Steam ID 64: ${steamId64}`);

  try {
    // Fetch assets using public endpoint (no API key needed!)
    console.log(`[Assets] Fetching from public inventory endpoint...`);
    const assetsUrl = `https://steamcommunity.com/inventory/${steamId64}/${CS2_APPID}/${CS2_CONTEXTID}`;

    const response = await fetch(assetsUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      console.error(`[Assets] Failed: ${response.status}`);
      return [];
    }

    const inventoryData = await response.json();
    console.log(
      `[Assets] Response: assets=${inventoryData.assets?.length}, descriptions=${inventoryData.descriptions?.length}`,
    );

    if (!inventoryData.assets || inventoryData.assets.length === 0) {
      console.log(`[Assets] No assets found (inventory empty or private)`);
      return [];
    }

    // Build items from assets + descriptions
    const items: SteamInventoryItem[] = [];

    for (const asset of inventoryData.assets) {
      try {
        // Find matching description
        const description = (inventoryData.descriptions || []).find(
          (d: any) =>
            String(d.classid) === String(asset.classid) &&
            String(d.instanceid) === String(asset.instanceid),
        );

        if (!description) {
          console.warn(
            `[Items] No description for classid=${asset.classid}, instanceid=${asset.instanceid}`,
          );
          continue;
        }

        const item: SteamInventoryItem = {
          asset_id: String(asset.assetid),
          class_id: String(asset.classid),
          instance_id: String(asset.instanceid),
          amount: parseInt(asset.amount) || 1,
          name: description.market_name || description.name || "Unknown",
          market_hash_name:
            description.market_hash_name || description.name || "",
          type: description.type || "Unknown",
          icon_url: description.icon_url
            ? `https://community.cloudflare.steamstatic.com/economy/image/${CS2_APPID}/${description.icon_url}`
            : "",
          tradable: !description.tradable ? false : true,
          marketable: !description.marketable ? false : true,
        };

        items.push(item);
      } catch (error) {
        console.warn(`[Items] Failed to parse asset:`, error);
        continue;
      }
    }

    console.log(`✓ Successfully fetched ${items.length} items`);
    return items;
  } catch (error) {
    console.error(`[Fetch] Exception:`, error);
    return [];
  }
}

// ============================================================================
// Main Supabase Function Handler
// ============================================================================

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { steam_id_64 } = await req.json();

    if (!steam_id_64) {
      return new Response(
        JSON.stringify({ error: "steam_id_64 is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(`\n📦 [HANDLER] Fetching inventory for Steam ID: ${steam_id_64}`);

    const items = await fetchSteamInventory(String(steam_id_64));

    console.log(`📦 [HANDLER] Returning ${items.length} items`);

    return new Response(JSON.stringify({ items }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Function Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
