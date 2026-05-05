import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://cxflwigfxtnqtuanhute.supabase.co'
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_pgTseWhRQriU96AKiOMBFg_GmtMGkje'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
