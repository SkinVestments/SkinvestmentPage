-- AdSense / thin-content remediation: expand seed posts + publish additional guides.
-- Apply in Supabase SQL Editor, then trigger a Vercel Deploy Hook so prerender shells + sitemap refresh.

-- ---------------------------------------------------------------------------
-- 1) Expand existing short posts
-- ---------------------------------------------------------------------------

UPDATE public.blog_posts SET
  excerpt = 'A practical system for tracking CS2 skin inventory like a portfolio: cost basis, multi-market prices, storage units, drops, and a weekly review habit that keeps numbers honest.',
  meta_title = 'How to Track CS2 Inventory Value Like an Investor | Skinvestments',
  meta_description = 'Step-by-step guide to tracking CS2 inventory value: cost basis, Steam vs Skinport vs Buff163 prices, storage units, drops, and portfolio reviews.',
  body_md = $md$
## Why inventory value is easy to misread

CS2 skins are liquid digital items, but most players still judge their inventory by a Steam Community Market total or by “what it felt like” when they bought something. That number is incomplete. Steam listings lag, fees change net proceeds, storage units hide value, and weekly drops quietly change the portfolio every Tuesday.

If you treat skins as a portfolio — even a small one — you need three numbers for every meaningful position:

1. **Cost basis** — what you paid (or the fair cost of a trade-up / craft).
2. **Mark-to-market value** — what the item is worth on the venues you would actually use.
3. **Unrealized P&L** — mark-to-market minus cost basis, before and after fees when you plan an exit.

Without those three, you are collecting skins. With them, you can answer whether the inventory is working for you.

## Start with a complete inventory map

Before optimizing prices, make sure you are measuring the whole book:

- Main Steam inventory
- Storage units (easy to forget; often hold mid-tier liquid pieces)
- Trade holds and recently acquired items that are not sellable yet
- Cases, stickers, agents, and “junk” that still has cash value at scale

Export or sync everything into one list. Skinvestments is built for this: public Steam inventory sync (no Steam password), then portfolio views that keep cost and current value side by side. If you prefer a spreadsheet first, use the same columns you would in a tracker: name, exterior, float notes, quantity, acquisition date, cost, preferred exit market, notes.

## Choose a valuation rule and stick to it

Different markets answer different questions:

- **Steam Community Market** — convenient reference for casual players; often slower after news; fees reduce net proceeds.
- **Skinport** — useful Western cash-out reference for many liquid skins.
- **Buff163** — deep liquidity for a large set of items; frequently the tightest global signal.

A workable rule for **portfolio valuation** is: pick one primary “mark” per item (usually the most liquid venue for that skin) and keep a secondary check so you notice when spreads widen. For **exit planning**, value the item on the market you will actually sell on — not the market with the prettiest screenshot.

Consistency matters more than perfection. Changing the mark every day because Buff moved 2% creates noise, not insight.

## Cost basis: the part people skip

Cost basis is where most “I’m up” stories fall apart. Record:

- Cash purchase price and marketplace fees paid on the way in
- Trade value if you swapped (use a contemporaneous mid-market estimate and note it)
- Trade-up / craft inputs (sum of inputs, not the dreamed output)
- Giveaways and drops (cost basis can be zero — still track acquisition date)

When you sell, compare **net proceeds after fees** to cost basis. Gross Steam listing price is not profit.

## Build a weekly review (20 minutes)

A light cadence beats occasional panic:

1. Sync inventory and confirm storage units are included.
2. Scan largest absolute movers (up and down).
3. Flag stagnant mid-tier items that have not moved in weeks while tying capital.
4. Log weekly drops and decide: keep, list, or bundle into a later decision.
5. Note any game update or case change that might explain volume — without assuming causality.

The goal is a decision log, not a prediction contest. “Held through Season 5 launch” is useful context later; “this must moon because Cache is in Active Duty” is not a valuation method.

## What good tracking looks like in practice

Imagine two players with the same $800 Steam total. Player A bought most pieces near the top of a hype spike and ignores fees. Player B logged cost basis, sells on Skinport when Steam is thin, and knows which storage unit holds $120 of forgotten skins. Same headline number; completely different portfolio reality.

That gap is why Skinvestments focuses on cost, multi-market context, drops, and history — not a single vanity total.

## Next steps

- Read our comparison of [Steam vs Skinport vs Buff163](/blog/steam-vs-skinport-vs-buff163) pricing.
- Review [marketplace fees and ROI](/blog/cs2-skin-marketplace-fees-roi) before your next exit.
- [Sign in](/login) to sync inventory, or browse [features](/features).
$md$,
  updated_at = now()
WHERE slug = 'track-cs2-inventory-value';

UPDATE public.blog_posts SET
  excerpt = 'Steam, Skinport, and Buff163 price the same CS2 skin differently. Learn when each market matters for valuation, liquidity, fees, and realistic exit planning.',
  meta_title = 'Steam vs Skinport vs Buff163 for CS2 Investors | Skinvestments',
  meta_description = 'Compare Steam Community Market, Skinport, and Buff163 for CS2 skin pricing: liquidity, fees, spreads, and how to value a portfolio without fooling yourself.',
  body_md = $md$
## Three markets, three jobs

CS2 investors rarely live on one price feed. Liquidity, fees, regional demand, and payment rails create persistent spreads between the Steam Community Market, Skinport, and Buff163. Treating any single quote as “the price” is how people overstate holdings or undersell exits.

Use each venue for the job it is good at.

## Steam Community Market

**Strengths**

- Built into Steam; familiar to casual sellers
- Useful for items that mainly trade inside the Steam ecosystem
- Easy to check while browsing inventory

**Limits**

- Fees cut into net proceeds
- Listings can lag after patch notes, case releases, or influencer spikes
- Regional wallet and payment constraints affect who can buy

Steam is a **reference and convenience market**, not automatically the best mark-to-market for cash-oriented portfolios.

## Skinport

**Strengths**

- Strong Western cash liquidity for many popular skins
- Clear fee structure for sellers who want fiat-adjacent outcomes
- Often a better “what could I actually clear?” check than Steam for mid and high tiers

**Limits**

- Not every skin has deep Skinport depth
- Sale speed still depends on demand and your ask
- You must compare net after Skinport fees to Steam net after Steam fees

Skinport shines as a **realistic Western exit reference** when your plan is to leave Steam balance and move toward cash.

## Buff163

**Strengths**

- Deep liquidity on a wide catalog
- Frequently tight bid/ask on sought-after items
- Important when global demand (including China-facing flow) sets the tone

**Limits**

- Access, payment, and withdrawal realities differ by user and region
- Headline Buff prices are not always your executable price
- Spreads and process friction still matter

Buff is often the **global liquidity signal**. Portfolio software that ignores it can miss where the real book is trading.

## How to use the three together

### For holdings valuation

Prefer the most liquid venue for that specific item, then sanity-check the others. If Steam says $40, Skinport clears near $36 net, and Buff sits near $38 equivalent, your “true” mark depends on where you can sell — but your **dashboard should not pretend Steam alone is truth**.

### For exit planning

Work backward from the market you will use:

1. Estimate sellable price (not the highest ask you wish existed).
2. Subtract fees and friction.
3. Compare to cost basis.
4. Decide hold vs sell vs move markets.

### For spreads as information

Wide Steam–Buff or Steam–Skinport gaps can mean:

- Steam is stale
- Cash markets are soft
- The item is thin everywhere (danger zone for large size)

Spreads are data. They are not automatically a free arb for retail sellers.

## Worked thinking example (illustrative)

Suppose a rifle skin shows:

- Steam: $50 ask, slow sales history
- Skinport: recent sales around $44–46 before fees
- Buff: tight interest near a $47 equivalent

A Steam-only portfolio might show “$50.” A cash-aware portfolio might mark closer to $44–47 depending on your exit path. That 10–15% gap compounds across an inventory.

Skinvestments aggregates public signals from Steam, Skinport, and Buff163 so your [portfolio view](/features) reflects how skins actually trade — not one listing page.

## Practical checklist

- [ ] Pick a primary mark rule per item category
- [ ] Always compare **net** after fees
- [ ] Revisit marks after major updates (new cases, Active Duty changes)
- [ ] Do not average blind markets with no liquidity
- [ ] Log which market you used when you sold

## Related reading

- [Track inventory value like an investor](/blog/track-cs2-inventory-value)
- [Marketplace fees and ROI](/blog/cs2-skin-marketplace-fees-roi)
- [When to sell after a CS2 update](/blog/when-to-sell-cs2-skins-after-updates)

Compare plans on [Pricing](/pricing), or [sign in](/login) to sync inventory.
$md$,
  updated_at = now()
WHERE slug = 'steam-vs-skinport-vs-buff163';

-- ---------------------------------------------------------------------------
-- 2) New published guides
-- ---------------------------------------------------------------------------

INSERT INTO public.blog_posts (
  slug, title, excerpt, body_md, status, published_at,
  meta_title, meta_description, tags, feature_image_alt, author_name
) VALUES
(
  'cs2-skin-marketplace-fees-roi',
  'CS2 Skin Marketplace Fees and Real ROI',
  'Gross listing price is not profit. Here is how Steam and third-party fees change ROI — with a simple worksheet you can reuse on every exit.',
  $md$
## Gross price vs net proceeds

Every CS2 seller eventually learns the same lesson: the number on a listing is not the number that lands in your wallet or Steam balance. Fees, payment rails, and sale speed all sit between “market price” and **realized ROI**.

ROI for a skin position is:

**ROI = (net proceeds − cost basis) / cost basis**

If you skip fees, you will systematically overstate wins and understate losses.

## Cost basis refresher

Include what you actually gave up:

- Purchase price + buyer-side fees (if any)
- Trade-in value you assigned at the time of the swap
- Sum of trade-up inputs
- Zero for pure drops (still track date and quantity)

Write the basis down when you acquire the item. Memory is a terrible ledger after six months.

## Steam Community Market fees (conceptual)

Steam takes a cut of marketplace transactions. Exact percentages can change and may include publisher fees depending on the game economy rules Valve publishes. For planning, always:

1. Look up the **current** fee schedule before large sales
2. Calculate net = gross sale × (1 − fee rate) using today’s rules
3. Compare that net to cost basis

Do not use last year’s mental math.

## Third-party marketplaces

Skinport and similar cash markets publish seller fees. Buff163 and other regional platforms have their own structures, withdrawal methods, and friction. For ROI:

- Start from the **expected sale price you can actually clear**
- Subtract seller fees
- Subtract withdrawal / conversion costs if you care about fiat
- Only then compare to cost basis

A Buff headline that you cannot operationally access is not your ROI.

## Worksheet: one sale

Copy this for each meaningful exit:

1. Item + exterior + quantity  
2. Cost basis (total)  
3. Chosen market  
4. Expected gross sale  
5. Fee estimate  
6. Other friction (boosts, currency conversion, time discount if you need cash fast)  
7. Net proceeds  
8. Profit / loss and ROI %  
9. Notes (why you sold: rebalance, update risk, liquidity need)

After ten sales, patterns appear: which markets pay you better net, which items always disappoint after fees, which “small wins” were noise.

## Common mistakes

- Comparing Steam asks to Buff asks without fees  
- Forgetting that trade-ups embed multiple fee-paid inputs  
- Celebrating Steam balance gains as if they were cash  
- Ignoring that slow sales have an opportunity cost

## How Skinvestments helps

The tracker is built so cost basis and mark-to-market live together. Pair that with an explicit fee check before you list. Read [Steam vs Skinport vs Buff163](/blog/steam-vs-skinport-vs-buff163) for venue context, then [sign in](/login) when you want the portfolio math in one place.
$md$,
  'published', now() - interval '12 days',
  'CS2 Skin Marketplace Fees and Real ROI | Skinvestments',
  'Calculate real CS2 skin ROI after Steam and third-party marketplace fees. A practical worksheet for cost basis and net proceeds.',
  ARRAY['cs2', 'fees', 'roi', 'investing'],
  'CS2 marketplace fees and ROI worksheet concept',
  'Skinvestments'
),
(
  'when-to-sell-cs2-skins-after-updates',
  'When to Sell CS2 Skins After Game Updates',
  'Patch days create noise. Separate attention from demand, use a decision checklist, and avoid selling (or buying) only because the timeline feels exciting.',
  $md$
## Updates create attention — not automatic edge

Major CS2 updates — new seasons, Active Duty rotations, Armory refreshes, economy tweaks — spike discussion. Prices can move. They can also chop sideways while social feeds scream.

If you manage a skin portfolio, your job on update week is not to predict the patch. It is to **decide with a rule**.

## Separate three clocks

1. **Announcement clock** — headlines and patch notes drop.  
2. **Liquidity clock** — when volume actually trades on Steam / Skinport / Buff.  
3. **Your portfolio clock** — cost basis, size, and whether you needed liquidity anyway.

Mixing them causes classic errors: selling winners too early because chat is loud, or holding losers because “the update will fix it.”

## A calm post-update checklist

Use this within 24–72 hours of a major patch:

1. Read the **official** notes (not only recap videos).  
2. List which of your holdings are directly touched (new collections, related stickers, map-tied cosmetics if relevant).  
3. Mark positions that are only loosely related (most of the inventory).  
4. Check spreads across markets — did Steam lag while Buff moved, or is everything thin?  
5. Revisit your exit plan **only** for positions that fail your pre-written rules (size, thesis broken, liquidity need).

For Season 5-style changes, we walked through the factual patch context in [CS2 Season 5: Cache, Armory, and C4](/blog/cs2-season-5-armory-cache-c4-update). Treat that as timeline documentation, not a trade signal.

## Rules that beat vibes

Write rules before the patch if you can:

- “If an item is up X% from basis and thesis was short-term hype, trim Y%.”  
- “If spreads widen and volume dies, do not add size.”  
- “No new FOMO buys in the first 24 hours unless pre-planned.”

Rules can be wrong. Improvised emotion is usually worse.

## When selling makes sense

- You needed liquidity before the update anyway  
- The update invalidates your reason for holding  
- Net after fees still meets your target  
- Position size is too large for the liquidity that remains

## When holding makes sense

- Cost basis is still attractive versus liquid marks  
- The update does not touch your thesis  
- Selling now only because chat is loud  
- You have no alternative use for the capital

## Process over prediction

Keep a short journal entry: date, update name, what you held, what you did, why. Three months later that journal is more valuable than any hot take from patch night.

Track the book in [Skinvestments](/features), and keep valuation honest with [multi-market pricing](/blog/steam-vs-skinport-vs-buff163).
$md$,
  'published', now() - interval '10 days',
  'When to Sell CS2 Skins After Updates | Skinvestments',
  'A practical checklist for selling or holding CS2 skins after Valve updates — without treating patch hype as a trading signal.',
  ARRAY['cs2', 'updates', 'selling', 'portfolio'],
  'CS2 update week portfolio decision checklist',
  'Skinvestments'
),
(
  'cs2-storage-units-hidden-inventory-value',
  'CS2 Storage Units and Hidden Inventory Value',
  'Storage units quietly hold real money. Here is how to audit them, avoid double-counting, and fold “forgotten” skins into a real portfolio total.',
  $md$
## The invisible shelf

Steam storage units solve inventory limits. They also create blind spots. Players open the main backpack, glance at a Steam Market total, and miss hundreds of dollars sitting in units they last sorted months ago.

If you care about portfolio value, **storage is not optional bookkeeping** — it is part of the book.

## Audit workflow

1. List every storage unit name and purpose (if you use labels).  
2. Sync or manually export contents the same way you handle the main inventory.  
3. Tag each item with unit location in your tracker notes.  
4. Sum unit value separately once, then roll into the portfolio total.  
5. Schedule a monthly storage review (15 minutes).

Skinvestments is designed to help you see inventory holistically when public data is available — use that as the source of truth instead of memory.

## Avoid double-counting

Common mistakes:

- Counting the same item in a spreadsheet row and again in a “approx storage” fudge factor  
- Forgetting units after a hardware / account shuffle  
- Valuing storage with Steam-only prices while the main inventory uses Buff

Pick one valuation rule and apply it everywhere. See [Steam vs Skinport vs Buff163](/blog/steam-vs-skinport-vs-buff163).

## What usually hides in storage

- Mid-tier rifles bought “for later”  
- Case stacks from weekly habits  
- Stickers and leftovers from craft projects  
- Souvenir or event items you did not want cluttering the main view

None of these are automatically good investments. They are still capital.

## Decision prompts for storage items

For each material position:

- Why did I store this?  
- Is the thesis still true?  
- Would I buy it today at mark?  
- Is it more useful sold and redeployed?

If you would not buy it today and you have no collectible reason to keep it, storage is often just delayed decision-making.

## Operational tips

- Keep a naming scheme: `Liquid`, `Tradeups`, `Long hold`, `Junk to clear`  
- After big acquisition weeks, force a storage pass before the next buy  
- When preparing a cash-out, clear storage first — buyers and you both forget what is buried

## Bottom line

A portfolio total that ignores storage units is fiction. Fold them into your [inventory tracking](/blog/track-cs2-inventory-value) habit, then manage exits with [fee-aware ROI](/blog/cs2-skin-marketplace-fees-roi).
$md$,
  'published', now() - interval '8 days',
  'CS2 Storage Units and Hidden Inventory Value | Skinvestments',
  'Audit CS2 Steam storage units so hidden skins count in your portfolio total — with a simple monthly checklist.',
  ARRAY['cs2', 'storage', 'inventory', 'portfolio'],
  'CS2 storage unit inventory audit',
  'Skinvestments'
),
(
  'cs2-skin-cost-basis-record-keeping',
  'Cost Basis and Record-Keeping for CS2 Skins',
  'Build a clean acquisition ledger for CS2 skins: dates, costs, trades, trade-ups, and drops — so P&L stops being a guess.',
  $md$
## Why records beat vibes

Ask ten players what they paid for a skin they have held a year. Many will shrug. Without cost basis, “profit” is storytelling.

You do not need corporate accounting. You need a **consistent ledger**.

## Minimum fields per lot

Treat each acquisition as a lot:

- Item name + exterior (+ float note if you care)  
- Quantity  
- Acquisition date  
- Acquisition type: buy / trade / trade-up / drop / gift  
- Cost basis in one currency you choose for reporting  
- Source market or counterparty note  
- Storage location  
- Optional thesis tag (`play skin`, `liquid hold`, `event`)

When you sell, add sale date, market, gross, fees, net.

## Trades and trade-ups

Trades: assign a fair value at the time using a liquid mark, and note it. Perfect precision is impossible; contemporaneous estimates beat rewriting history later.

Trade-ups: cost basis of the output is the sum of inputs (and any fees). Do not pretend the output’s first Steam ask was your cost.

## Drops and gifts

Drops can be basis zero. Still log them. Zero-basis sales are still taxable events in some jurisdictions — this guide is **not tax advice**; check local rules and a professional if needed. From a portfolio view, drops are free inventory that still deserves tracking.

## Cadence

- Log acquisitions the day they happen (or weekly at worst)  
- Reconcile Steam inventory vs ledger monthly  
- After big patches, freeze a snapshot for later comparison

Tools like [Skinvestments](/features) reduce the pain of syncing what you own; you still own the discipline of what you paid.

## What good records unlock

- Honest ROI after [fees](/blog/cs2-skin-marketplace-fees-roi)  
- Cleaner decisions on [update weeks](/blog/when-to-sell-cs2-skins-after-updates)  
- Less emotional attachment to positions that only feel cheap

Start simple. A complete modest ledger beats an abandoned complex one.
$md$,
  'published', now() - interval '7 days',
  'Cost Basis and Record-Keeping for CS2 Skins | Skinvestments',
  'How to log CS2 skin cost basis for buys, trades, trade-ups, and drops so portfolio P&L is based on records — not memory.',
  ARRAY['cs2', 'cost-basis', 'records', 'portfolio'],
  'CS2 skin cost basis ledger',
  'Skinvestments'
),
(
  'detect-stagnant-cs2-skins',
  'How to Spot Stagnant CS2 Skins in Your Portfolio',
  'Dead money hides in mid-tier inventory. Use liquidity, time held, and opportunity cost to find stagnant CS2 skins — and decide whether to keep, list, or recycle.',
  $md$
## Stagnation is a portfolio problem

Not every flat price chart is a failure. Some holds are intentional. Stagnation becomes a problem when capital sits in items that:

- Rarely trade  
- Have wide spreads  
- You would not buy again at today’s mark  
- Block better uses of cash or Steam balance

Skinvestments includes analytics aimed at surfacing quiet positions — the method below works even if you start manually.

## Signals of stagnation

1. **Time** — held beyond your original thesis window with no review  
2. **Volume** — thin sales on your exit markets  
3. **Spread** — large gaps between Steam and cash markets  
4. **Attention** — you avoid opening the listing because you already know it will sit  
5. **Replacement test** — you would rather have the cash in a more liquid skin or out of skins entirely

One signal is a nudge. Three together are a decision.

## A simple scoring pass

Once a month, sort holdings by value and score 1–5 on liquidity and thesis clarity. Anything valuable + low liquidity + unclear thesis goes on a “review this week” list.

Do not try to clear the entire inventory in one night. Work top-down by capital stuck.

## Actions when you find dead money

- **List** at a clearing price (after fee math)  
- **Trade** into a more liquid position if that fits your plan  
- **Keep** only with a rewritten thesis and a review date  
- **Bundle** small junk into a single clear-out session

Avoid the trap of waiting for “one more update” with no criterion for success.

## Opportunity cost

The hidden cost of stagnation is not only price drift. It is the trades you did not make and the cash-out flexibility you lost. That is why [cost basis records](/blog/cs2-skin-cost-basis-record-keeping) and [fee-aware ROI](/blog/cs2-skin-marketplace-fees-roi) matter together.

## Keep it unemotional

You are not “betraying” a skin by selling it. You are reallocating capital. Log the reason and move on.

Explore [portfolio analytics](/features) in Skinvestments, and keep valuation grounded with [multi-market context](/blog/steam-vs-skinport-vs-buff163).
$md$,
  'published', now() - interval '5 days',
  'How to Spot Stagnant CS2 Skins | Skinvestments',
  'Find stagnant CS2 skins tying up capital: liquidity signals, thesis checks, and a monthly review process for dead inventory.',
  ARRAY['cs2', 'stagnation', 'liquidity', 'portfolio'],
  'Detecting stagnant CS2 skin holdings',
  'Skinvestments'
),
(
  'cs2-float-value-portfolio-basics',
  'Float Value Basics for CS2 Portfolio Holders',
  'Float can matter a lot — or barely at all. Learn when CS2 float premiums show up, when to ignore them, and how to record float without overcomplicating your portfolio.',
  $md$
## Float is a detail until it is the trade

CS2 exteriors (Factory New through Battle-Scarred) are the headline buckets. Float is the finer number inside those buckets. For some items, especially desirable low floats or special patterns, float changes the clearing price meaningfully. For many mid-tier skins, float is a rounding error next to market choice and fees.

Portfolio holders need a rule for **when float deserves attention**.

## When float usually matters more

- Category already trades on aesthetics (Dopplers, fades, certain low-float ICs, etc.)  
- Buyers screenshot float and pattern indexes  
- The spread between “nice” and “average” float is wide on liquid markets  
- You are sizing a position large enough that a 5–10% aesthetic premium moves P&L

## When float usually matters less

- Cheap junk and bulk case fodder  
- Items you will sell into thin Steam asks regardless  
- Positions where marketplace fees dwarf float premium  
- Play skins you will never list carefully

## How to record float without bureaucracy

Add float to the ledger only when:

1. You paid a premium for it, or  
2. The item category is known to price float, or  
3. Size is material to your portfolio

Everyone else can live with exterior + notes.

## Valuation hygiene

Price the skin on the market you will use, using comps with **similar float** when float matters. Comparing your 0.00x trophy to a high-float Steam ask will mis-mark the book.

Pair float awareness with [multi-market pricing](/blog/steam-vs-skinport-vs-buff163) and [fee-aware exits](/blog/cs2-skin-marketplace-fees-roi).

## Practical workflow

- On acquisition: save float if premium paid  
- On monthly review: only re-check float comps for marked aesthetic holdings  
- On sale: list with accurate screenshots; do not assume buyers will “notice later”

## Bottom line

Float is a tool, not a personality. Use it where the market pays for it, ignore it where it does not, and keep the rest of your [inventory tracking](/blog/track-cs2-inventory-value) boring and correct.
$md$,
  'published', now() - interval '4 days',
  'CS2 Float Value Basics for Portfolios | Skinvestments',
  'When CS2 skin float premiums matter for portfolio valuation — and when exterior plus market choice matter more.',
  ARRAY['cs2', 'float', 'pricing', 'portfolio'],
  'CS2 float value for portfolio holders',
  'Skinvestments'
),
(
  'cs2-trade-up-contracts-portfolio-decisions',
  'Trade-Up Contracts as Portfolio Decisions',
  'CS2 trade-ups are not loot box entertainment when capital is at stake. Frame them as portfolio decisions: input cost, outcome distribution, and what you will do with the output.',
  $md$
## Trade-ups spend real inventory

A trade-up consumes inputs that already had mark-to-market value. Mentally treating inputs as “already owned leftovers” is how people hide losses.

Frame every contract as:

**Risking the sum of input values for a distribution of outputs.**

## Pre-trade checklist

1. Sum **today’s** liquid marks for all inputs (not what you hope Steam says).  
2. Estimate realistic output values across likely results (not only the dream skin).  
3. Subtract expected fees on the way out if you will sell.  
4. Ask whether a flat sale of inputs would be cleaner.  
5. Size the experiment so a bad outcome does not distort the whole portfolio.

## Cost basis of the output

Whatever comes out inherits the **sum of inputs** as cost basis (plus any direct fees). Log it immediately. See [cost basis record-keeping](/blog/cs2-skin-cost-basis-record-keeping).

## Common failure modes

- Using Steam asks for inputs and Buff dreams for outputs  
- Ignoring that several “okay” outcomes still lose after fees  
- Chaining trade-ups to avoid admitting a stagnant pile should be sold  
- Celebrating a win without updating the ledger

## When trade-ups can make sense

- You explicitly want a play skin and accept EV loss for utility  
- Inputs are illiquid junk with poor exit paths  
- You have modeled the distribution and sized small  
- You are documenting results to learn — not chasing losses

## When to stop

If trade-ups become a way to avoid [stagnation decisions](/blog/detect-stagnant-cs2-skins), pause. Selling inputs on a cash market may be the higher-ROI “contract.”

## Tie it back to the book

Track inputs and outputs in Skinvestments, keep venue context via [Steam / Skinport / Buff](/blog/steam-vs-skinport-vs-buff163), and review ROI with [fee math](/blog/cs2-skin-marketplace-fees-roi). The contract is optional. Honest accounting is not.
$md$,
  'published', now() - interval '3 days',
  'CS2 Trade-Up Contracts as Portfolio Decisions | Skinvestments',
  'Evaluate CS2 trade-up contracts like portfolio bets: input marks, outcome distributions, cost basis, and when selling inputs is smarter.',
  ARRAY['cs2', 'trade-up', 'portfolio', 'risk'],
  'CS2 trade-up portfolio decision framework',
  'Skinvestments'
),
(
  'reading-buff163-skinport-spreads',
  'Reading Buff163 vs Skinport Spreads',
  'Spreads between Buff163 and Skinport are information. Learn how to read them for CS2 portfolio marks without assuming easy arbitrage.',
  $md$
## A spread is a story — not a free lunch

When Buff163 and Skinport disagree, retail traders often jump to “arb.” Sometimes the gap is real inefficiency. Often it is fees, access, withdrawal friction, thin books, or stale listings wearing a costume.

For portfolio management, spreads help you **choose a mark and an exit path**. They rarely justify reckless size.

## What a wide spread can mean

- One venue has a stale ask  
- Cash demand softened on Western markets  
- Regional demand is driving Buff while Skinport buyers stepped back  
- The item is illiquid; both “prices” are opinions  
- Currency and payment differences distort screenshots

Your response should be investigation, not instant leverage.

## A practical read process

1. Check **recent sales**, not only asks.  
2. Compare similar float / condition comps.  
3. Convert to one currency and subtract fees mentally.  
4. Ask: which market can I actually use end-to-end?  
5. Mark the portfolio on the executable path; note the other as context.

Detail on venue roles sits in [Steam vs Skinport vs Buff163](/blog/steam-vs-skinport-vs-buff163).

## Portfolio rules of thumb

- If you cannot access Buff rails, do not mark your whole book as if you could cash out at Buff screenshots.  
- If Skinport depth is healthy for your item, Western cash-out planning should overweight Skinport nets.  
- If both are thin, reduce confidence in any single number and avoid adding size.

## Spreads after updates

Patch weeks exaggerate disagreements between markets. Steam may lag; cash markets may overshoot. Use the [update selling checklist](/blog/when-to-sell-cs2-skins-after-updates) and wait for sales prints when the decision is large.

## How Skinvestments fits

Aggregating public multi-market signals exists to surface these gaps early — so you see that your Steam-only total might be lonely. Pair the dashboard with fee-aware exits from [marketplace ROI](/blog/cs2-skin-marketplace-fees-roi).

Spreads educate. They do not print money by themselves.
$md$,
  'published', now() - interval '2 days',
  'Reading Buff163 vs Skinport Spreads | Skinvestments',
  'How to interpret Buff163 vs Skinport price spreads for CS2 portfolios — marks, liquidity, and why gaps are not automatic arbitrage.',
  ARRAY['cs2', 'buff163', 'skinport', 'spreads', 'pricing'],
  'Buff163 versus Skinport spread analysis',
  'Skinvestments'
),
(
  'weekly-cs2-drop-tracking-habit',
  'Build a Weekly CS2 Drop Tracking Habit',
  'Weekly drops look small until you annualize them. Here is a lightweight habit to log CS2 drops, decide keep vs sell, and fold them into portfolio value.',
  $md$
## Small weekly, real yearly

A single drop feels trivial. A year of drops is a cash-flow line in your portfolio. Players who never log drops systematically undercount income and overcount “mystery” inventory growth.

## The 10-minute Tuesday habit

Pick a fixed window after the weekly reset:

1. Claim / collect drops.  
2. Log each item with date and zero (or fair) basis.  
3. Tag: `keep`, `list`, or `decide next week`.  
4. Add value to the portfolio total with your usual mark rule.  
5. Once a month, sell or recycle the `list` pile in one batch.

Skinvestments includes drop-oriented tracking so the habit lives next to the rest of the book.

## Decision rules for drops

- **Keep** — you will use it, or it fits a written collect thesis  
- **List** — liquid enough that fees still leave meaningful net  
- **Hold short** — waiting for a known liquidity window (not infinite cope)

Avoid letting drop leftovers become [stagnant clutter](/blog/detect-stagnant-cs2-skins) in storage units.

## Accounting notes

Drops are still inventory. If you sell them, use [fee-aware ROI](/blog/cs2-skin-marketplace-fees-roi) even when basis is zero — net proceeds are still performance.

## Why this helps mentally

Logging drops separates:

- Skill / market performance on purchased skins  
- Free inventory from playtime

Both matter. Mixing them confuses whether your strategy works.

## Start this week

Create the tags, log today’s drop, and put a 10-minute recurring reminder on the calendar. Pair with [storage audits](/blog/cs2-storage-units-hidden-inventory-value) so nothing disappears into a unit named “misc.”

[Sign in](/login) when you want the habit backed by a real portfolio dashboard.
$md$,
  'published', now() - interval '1 day',
  'Weekly CS2 Drop Tracking Habit | Skinvestments',
  'Log CS2 weekly drops in 10 minutes: keep vs sell rules, portfolio valuation, and how small drops add up over a year.',
  ARRAY['cs2', 'drops', 'habits', 'portfolio'],
  'Weekly CS2 drop tracking habit',
  'Skinvestments'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  body_md = EXCLUDED.body_md,
  status = 'published',
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  tags = EXCLUDED.tags,
  feature_image_alt = EXCLUDED.feature_image_alt,
  author_name = EXCLUDED.author_name,
  updated_at = now(),
  published_at = COALESCE(public.blog_posts.published_at, EXCLUDED.published_at);

-- Ensure Season 5 post is published if it still sits as draft
UPDATE public.blog_posts
SET status = 'published',
    published_at = COALESCE(published_at, now() - interval '6 days'),
    updated_at = now()
WHERE slug = 'cs2-season-5-armory-cache-c4-update'
  AND status <> 'published';

COMMENT ON TABLE public.blog_posts IS
  'Marketing blog. After publish/content updates, trigger Vercel Deploy Hook to refresh prerendered article HTML + sitemap.';
