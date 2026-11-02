# Analytics (GA4)

Client events fire through `track()` in `lib/analytics.ts` (no-op when `gtag` is unavailable).

## Custom dimensions / event params

Register these as custom dimensions (event-scoped) in GA4 Admin → Custom definitions:

| Parameter | Type | Used by |
|---|---|---|
| `direction` | text (`gainers` \| `losers`) | `market_movers_viewed`, `market_mover_clicked` |
| `period` | text (`7d` \| `30d` \| `90d`) | `market_movers_viewed`, `market_mover_clicked` |
| `rank` | number (1-based) | `market_mover_clicked` |
| `filters_active_count` | number | `catalog_families_viewed` |
| `family_key` | text | `catalog_family_clicked` |
| `position` | number (1-based) | `catalog_family_clicked` |
| `placement` | text | `csmoney_link_clicked` |

## Catalog families

| Event | Params | When |
|---|---|---|
| `catalog_families_viewed` | `filters_active_count` | Browse grid loads / filters change |
| `catalog_family_clicked` | `family_key`, `position` | User opens a family card |

## Market movers

| Event | Params | When |
|---|---|---|
| `market_movers_viewed` | `direction`, `period` | Discover card or full ranking loads with data |
| `market_mover_clicked` | `direction`, `period`, `rank` | User opens an item from movers (hero = rank 1) |

## Other events

| Event | Params |
|---|---|
| `csmoney_link_clicked` | `placement` |
