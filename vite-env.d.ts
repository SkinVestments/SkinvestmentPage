/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_ADSENSE_CLIENT?: string
  readonly VITE_ADSENSE_SLOT?: string
  readonly VITE_ADSENSE_SLOT_PANEL?: string
  readonly VITE_ADSENSE_SLOT_INVENTORY?: string
  readonly VITE_ADSENSE_SLOT_ANALYTICS?: string
  readonly VITE_ADSENSE_SLOT_HISTORY?: string
  readonly VITE_ADSENSE_SLOT_SIDEBAR?: string
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}