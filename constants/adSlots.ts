/** AdSense slot IDs from env — one per placement, or shared VITE_ADSENSE_SLOT for all. */
export const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT ?? '';

const SHARED_SLOT = import.meta.env.VITE_ADSENSE_SLOT ?? '';

const slot = (specific: string | undefined) => specific || SHARED_SLOT;

export const AD_SLOTS = {
  panel: slot(import.meta.env.VITE_ADSENSE_SLOT_PANEL),
  inventory: slot(import.meta.env.VITE_ADSENSE_SLOT_INVENTORY),
  analytics: slot(import.meta.env.VITE_ADSENSE_SLOT_ANALYTICS),
  history: slot(import.meta.env.VITE_ADSENSE_SLOT_HISTORY),
  sidebar: slot(import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR),
} as const;

export type AdSlotKey = keyof typeof AD_SLOTS;

export const isAdSenseConfigured = (): boolean =>
  Boolean(ADSENSE_CLIENT && SHARED_SLOT) ||
  Boolean(ADSENSE_CLIENT && Object.values(AD_SLOTS).some(Boolean));
