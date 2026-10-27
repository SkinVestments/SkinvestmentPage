# Analytics (GA4)

Client events fire through `track()` in `lib/analytics.ts` (no-op when `gtag` is unavailable).

## Custom dimensions / event params

Register these as custom dimensions (event-scoped) in GA4 Admin → Custom definitions:

| Parameter | Type | Used by |
|---|---|---|
| `direction` | text (`gainers` \| `losers`) | `market_movers_viewed`, `market_mover_clicked` |
| `rank` | number (1-based) | `market_mover_clicked` |
| `placement` | text | `csmoney_link_clicked` |

## Market movers

| Event | Params | When |
|---|---|---|
| `market_movers_viewed` | `direction` | Discover card or full ranking loads (or direction changes) with data |
| `market_mover_clicked` | `direction`, `rank` | User opens an item from movers (hero = rank 1) |

## Other events

| Event | Params |
|---|---|
| `csmoney_link_clicked` | `placement` |
