# Web monthly pricing (Oct 2026)

Source dump: attachment pack + `data/web-monthly-prices.json` (192 countries, Android-first rule).

## Status

| Item | State |
|---|---|
| Display prices (Pricing page / plan modal) | Updated from dump (locale → country → currency) |
| Default list price | PLN **19.99** Pro / **24.99** Pro Max monthly |
| RevenueCat Web Billing products | **Not created** — proposal `owner_approved=false` |
| Checkout links (`pay.rev.cat/...`) | Still point at existing packages; charged amount is RC product price |

## Next steps (outside this repo or after owner OK)

1. Set `owner_approved=true` and activation date on the proposal.
2. Create RevenueCat Web Billing products / offerings per bucket (or multi-currency products) from `web-price-proposal.NOT-DEPLOYED.json`.
3. Wire `buildRevenueCatCheckoutUrl` (or Web SDK) to the correct offering / currency for the user’s country.
4. Pro Max web trial: 14 days, qualification “Didn't have any subscription yet”.
5. Keep mobile `default` offering untouched.

Yearly and lifetime are **not** in this dump; keep existing PLN display until a separate decision.
