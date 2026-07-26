/**
 * Shared SEO body copy for public marketing routes.
 * Used by React pages and build-time #root prerender shells.
 * Constraint: no em dashes in copy.
 */

export type SeoBlock = {
  heading?: string;
  paragraphs: string[];
  links?: { href: string; label: string }[];
  list?: string[];
};

export type MarketingSeoPage = {
  path: string;
  h1: string;
  lead: string;
  blocks: SeoBlock[];
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function marketingPageToRootHtml(page: MarketingSeoPage): string {
  const blocks = page.blocks
    .map((block) => {
      const h = block.heading
        ? `<h2>${escapeHtml(block.heading)}</h2>`
        : '';
      const paras = block.paragraphs
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join('');
      const list = block.list?.length
        ? `<ul>${block.list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
        : '';
      const links = block.links?.length
        ? `<p>${block.links
            .map((l) => `<a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a>`)
            .join(' · ')}</p>`
        : '';
      return `${h}${paras}${list}${links}`;
    })
    .join('');

  return `<main>
<article>
<header>
<h1>${escapeHtml(page.h1)}</h1>
<p>${escapeHtml(page.lead)}</p>
</header>
${blocks}
</article>
</main>`;
}

export const HOME_SEO: MarketingSeoPage = {
  path: '/',
  h1: 'CS2 Portfolio Tracker',
  lead:
    'Skinvestments is a free CS2 portfolio tracker and CS2 skin tracker for Steam inventories. See live inventory value, profit and loss, weekly drops, and multi-market pricing on web, iOS, and Android.',
  blocks: [
    {
      heading: 'Track CS2 inventory value without spreadsheets',
      paragraphs: [
        'Most players guess what their skins are worth from a Steam Community Market total. That number misses cost basis, fees, storage units, and cash-market prices on Skinport and Buff163. A CS2 portfolio tracker keeps cost, mark-to-market value, and unrealized P&L in one place so you can manage skins like an asset class.',
        'Skinvestments syncs public Steam inventory data. We never ask for your Steam password. You get a value snapshot of what you own, how it moved, and which pieces are stagnating.',
      ],
      links: [
        { href: '/features', label: 'Explore features' },
        { href: '/cs2-skin-tracker', label: 'CS2 skin tracker overview' },
        { href: '/pricing', label: 'Free to start pricing' },
      ],
    },
    {
      heading: 'CS2 economy tracker signals that matter',
      paragraphs: [
        'As a CS2 economy tracker, Skinvestments highlights portfolio pulse, drop history, and multi-market context instead of a single vanity total. Compare Steam, Skinport, and Buff163 so your dashboard reflects how skins actually trade.',
        'Use the web dashboard or mobile apps with the same account. Start on the free Starter plan, then upgrade if you need deeper analytics and exports.',
      ],
      list: [
        'Live inventory value and portfolio history',
        'Profit tracking against cost basis',
        'Weekly drop logging',
        'Web, iOS, and Android',
      ],
      links: [
        { href: '/blog', label: 'Read portfolio guides' },
        { href: '/faq', label: 'FAQ' },
      ],
    },
  ],
};

export const FEATURES_SEO: MarketingSeoPage = {
  path: '/features',
  h1: 'Everything you can track',
  lead:
    'Skinvestments is a CS2 inventory tracker and CS2 skin tracker built for portfolio clarity: inventory value, price history context, drops, Skinport and Buff163 pricing signals, and alerts for stagnant holdings.',
  blocks: [
    {
      heading: 'CS2 inventory tracker essentials',
      paragraphs: [
        'Sync public Steam inventory, including storage-aware workflows, so your CS2 portfolio is complete. Log buy prices, review quantity lots, and see unrealized performance without exporting to Excel every week.',
        'Portfolio Pulse and analytics views turn raw inventory into a CS2 economy tracker: movers, allocation, and drop performance over time.',
      ],
      list: [
        'Inventory value across your tracked items',
        'Cost basis and profit views',
        'Weekly drop tracking',
        'Multi-market pricing context (Steam, Skinport, Buff163)',
        'Stagnation-oriented analytics on higher plans',
      ],
      links: [
        { href: '/cs2-skin-tracker', label: 'Why traders use a CS2 skin tracker' },
        { href: '/pricing', label: 'Compare plans' },
        { href: '/blog', label: 'Guides' },
      ],
    },
    {
      heading: 'Built for web and mobile',
      paragraphs: [
        'Use the same Skinvestments account on the web dashboard, iOS, and Android. Track between matches on mobile, then deep-dive analytics on desktop. Read-only Steam inventory access keeps the workflow safer than tools that ask for trade credentials.',
      ],
      links: [
        { href: '/faq', label: 'Safety FAQ' },
        { href: '/about', label: 'About Skinvestments' },
      ],
    },
  ],
};

export const PRICING_SEO: MarketingSeoPage = {
  path: '/pricing',
  h1: 'Simple, free to start',
  lead:
    'Skinvestments is a free CS2 portfolio tracker on the Starter plan. No card required to begin. Upgrade to Pro or Pro Max when you want deeper analytics, exports, and an ad-light web experience.',
  blocks: [
    {
      heading: 'What you get on free',
      paragraphs: [
        'Starter covers the core CS2 skin tracker loop: sync inventory, see portfolio value, and manage collections on web and mobile. Ads may appear in the free web dashboard to keep the tier free.',
        'Paid plans unlock advanced analytics, data export options, and priority support on Pro Max. One subscription applies across mobile and web when billed through our system.',
      ],
      links: [
        { href: '/features', label: 'See what you can track' },
        { href: '/faq', label: 'Billing FAQ' },
        { href: '/cs2-skin-tracker', label: 'CS2 skin tracker page' },
      ],
    },
    {
      heading: 'Who each plan is for',
      paragraphs: [
        'Choose Starter if you want a free CS2 portfolio tracker for personal inventory. Choose Pro if you trade more actively and need richer analytics. Choose Pro Max if you want the fullest exports and priority help.',
        'Cancel or change plans from Settings. Payments are handled securely. For plan questions, contact support from the Contact page.',
      ],
      links: [
        { href: '/contact', label: 'Contact support' },
        { href: '/login', label: 'Sign in to upgrade' },
      ],
    },
  ],
};

export const FAQ_SEO: MarketingSeoPage = {
  path: '/faq',
  h1: 'Frequently asked questions',
  lead:
    'Answers about Skinvestments as a CS2 portfolio tracker: is it free, is it safe, how prices update, and which platforms are supported.',
  blocks: [
    {
      heading: 'Is Skinvestments free?',
      paragraphs: [
        'Yes. Starter is a free CS2 portfolio tracker tier. Pro and Pro Max are optional upgrades for advanced analytics and exports. You can start without entering a card.',
      ],
      links: [{ href: '/pricing', label: 'View pricing' }],
    },
    {
      heading: 'Is it safe to use with Steam?',
      paragraphs: [
        'We use public Steam inventory data and never ask for your Steam password, Steam Guard codes, or trade URLs for selling. Skinvestments cannot move items on your account.',
      ],
      links: [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/about', label: 'About us' },
      ],
    },
    {
      heading: 'How do prices update?',
      paragraphs: [
        'We aggregate public pricing signals from Steam Community Market, Skinport, and Buff163. Refresh intervals depend on plan and provider load. Treat values as estimates, not guaranteed live trade quotes.',
      ],
      links: [
        { href: '/features', label: 'Features' },
        { href: '/cs2-skin-tracker', label: 'CS2 skin tracker' },
      ],
    },
    {
      heading: 'Which platforms are supported?',
      paragraphs: [
        'Web dashboard, iOS, and Android share one account. Sync inventory once and review it wherever you play.',
      ],
      links: [{ href: '/contact', label: 'Contact' }],
    },
  ],
};

export const CS2_SKIN_TRACKER_SEO: MarketingSeoPage = {
  path: '/cs2-skin-tracker',
  h1: 'The CS2 skin tracker for serious traders',
  lead:
    'Looking for a CS2 skin tracker or CSGO skin tracker that goes beyond a Steam Market total? Skinvestments tracks inventory value, cost basis, profits, drops, and multi-market prices for traders who treat skins like a portfolio.',
  blocks: [
    {
      heading: 'What this CS2 skin tracker covers',
      paragraphs: [
        'Skinvestments connects to public Steam inventory data and builds a portfolio view: what you own, what you paid, and what it is worth across Steam, Skinport, and Buff163 context. That is the difference between a casual inventory glance and a CS2 skin tracker built for decisions.',
        'Whether you still search for a CSGO skin tracker from older habits or you specifically want a CS2 skin tracker in 2026, the workflow is the same: sync, log costs, review P&L, and clear stagnant pieces.',
      ],
      list: [
        'Inventory value snapshots',
        'Profit tracking vs cost basis',
        'Drop logging and history',
        'Multi-market pricing context',
        'Web plus iOS and Android',
      ],
      links: [
        { href: '/features', label: 'Full feature list' },
        { href: '/pricing', label: 'Start free' },
      ],
    },
    {
      heading: 'How it differs from spreadsheets and login-only clones',
      paragraphs: [
        'Spreadsheets go stale the moment Skinport or Buff moves. Thin clone sites often focus on login walls without portfolio discipline. Skinvestments focuses on readable portfolio metrics, safety (no Steam password), and guides that teach fee-aware exits.',
        'Compare plans, read the blog, or jump straight into the free tracker.',
      ],
      links: [
        { href: '/blog', label: 'CS2 portfolio blog' },
        { href: '/pricing', label: 'Pricing' },
      ],
    },
  ],
};

export const ABOUT_SEO: MarketingSeoPage = {
  path: '/about',
  h1: 'About Skinvestments',
  lead:
    'Skinvestments is a CS2 portfolio tracker built by KJ Labs Studio for players who want honest inventory value, cost basis, and multi-market context.',
  blocks: [
    {
      paragraphs: [
        'We build focused tools for digital item portfolios. Skinvestments started because Steam inventory screens show items, not performance. Our approach favors public data sync, clear P&L, and educational guides over hype.',
      ],
      links: [
        { href: '/features', label: 'Features' },
        { href: '/contact', label: 'Contact' },
        { href: '/blog', label: 'Blog' },
      ],
    },
  ],
};

export const ROADMAP_SEO: MarketingSeoPage = {
  path: '/roadmap',
  h1: 'Product roadmap',
  lead:
    'What shipped and what is next for the Skinvestments CS2 portfolio tracker: inventory sync, multi-market pricing, mobile apps, and deeper analytics.',
  blocks: [
    {
      paragraphs: [
        'We ship in public milestones so traders know what the CS2 skin tracker can do today versus what is still in progress. Check this page after major releases, and read the blog for market and update context.',
      ],
      links: [
        { href: '/features', label: 'Features available now' },
        { href: '/blog', label: 'Blog' },
        { href: '/contact', label: 'Suggest a feature' },
      ],
    },
  ],
};

export const CONTACT_SEO: MarketingSeoPage = {
  path: '/contact',
  h1: 'Contact Skinvestments',
  lead:
    'Email support for the CS2 portfolio tracker: account help, billing, privacy requests, and partnerships. We typically reply within a few hours on business days.',
  blocks: [
    {
      paragraphs: [
        'Write to kjlabs.studio@gmail.com with your account email and a short description of the issue. Never send Steam passwords. For product background, see About and FAQ.',
      ],
      links: [
        { href: '/about', label: 'About' },
        { href: '/faq', label: 'FAQ' },
        { href: '/privacy', label: 'Privacy' },
      ],
    },
  ],
};

export const PRIVACY_SEO: MarketingSeoPage = {
  path: '/privacy',
  h1: 'Privacy Policy',
  lead:
    'How Skinvestments collects and protects data when you use our CS2 portfolio tracker on web and mobile. Full policy text is on this page in the live app.',
  blocks: [
    {
      paragraphs: [
        'We collect account data needed to run the service, public Steam inventory you choose to sync, and technical logs for security. Advertising and analytics cookies on the free web experience are described in the full policy.',
      ],
      links: [
        { href: '/terms', label: 'Terms' },
        { href: '/contact', label: 'Privacy requests' },
      ],
    },
  ],
};

export const TERMS_SEO: MarketingSeoPage = {
  path: '/terms',
  h1: 'Terms and Conditions',
  lead:
    'Terms of use for Skinvestments, the CS2 portfolio tracker for Steam skins on web, iOS, and Android. Full legal text is on this page in the live app.',
  blocks: [
    {
      paragraphs: [
        'By using Skinvestments you agree to acceptable use of the service, account responsibilities, and the limits of market valuations. Skinvestments is not affiliated with Valve.',
      ],
      links: [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/contact', label: 'Contact' },
      ],
    },
  ],
};

/** All marketing bodies keyed by path for the prerender plugin. */
export const MARKETING_SEO_BY_PATH: Record<string, MarketingSeoPage> = {
  '/': HOME_SEO,
  '/features': FEATURES_SEO,
  '/pricing': PRICING_SEO,
  '/faq': FAQ_SEO,
  '/cs2-skin-tracker': CS2_SKIN_TRACKER_SEO,
  '/about': ABOUT_SEO,
  '/roadmap': ROADMAP_SEO,
  '/contact': CONTACT_SEO,
  '/privacy': PRIVACY_SEO,
  '/terms': TERMS_SEO,
};
