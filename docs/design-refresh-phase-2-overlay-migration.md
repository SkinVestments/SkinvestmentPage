# Phase 2 / PR3 — Overlay migration

## Migrated to shared `Modal`

| Overlay | Notes |
| --- | --- |
| ChangePasswordModal | Standard title / body / actions |
| ManageSubscriptionModal | `maxWidth="xl"` (`max-w-4xl`), footer slot |
| PortfolioShareModal | Custom floating close via `header`, `maxWidth="5xl"`, `z-[999]` |
| ItemPurchaseBatches Edit / Sell | `isOpen` + batch ref so exit can finish; `z-[999]` |

Already on `Modal` (inherit animation from PR2): CreateCollectionModal, AdminPortfolioLookup modal.

## Not migrated (would force layout or behaviour changes)

| Overlay | Why |
| --- | --- |
| **QuickAddModal** | Custom 3-slot header (Close / title / Reset), BUY/SELL control outside body, two-column portfolio/search layout, and `md:pl-[17.5rem]` dashboard offset. Needs a dedicated shell or much larger Modal API. |
| **LogDropModal** | Icon header chrome, sticky multi-step body, and **no overlay-click dismiss** today. Shared Modal defaults to scrim close; forcing `closeOnOverlayClick={false}` plus a custom header is possible later, but the inner layout is still one-off heavy. |
| **SteamInventoryImportModal** | Toolbar (search + filters) between header and list, sticky import footer, `z-[999]`, no overlay-click dismiss. Same class of custom chrome as LogDrop. |

These three should get Motion enter/exit either by adopting an expanded `Modal` chrome API in a follow-up, or by extracting a thinner `ModalShell` (portal + scrim + presence only) without the default title row.
