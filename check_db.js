import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cxflwigfxtnqtuanhute.supabase.co'
const supabaseAnonKey = 'sb_publishable_pgTseWhRQriU96AKiOMBFg_GmtMGkje'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkData() {
  console.log("--- Social Links ---")
  const { data: social, error: e1 } = await supabase.from('social_links').select('*')
  if (e1) console.error(e1)
  else console.table(social)

  console.log("\n--- Site Settings ---")
  const { data: settings, error: e2 } = await supabase.from('site_settings').select('*')
  if (e2) console.error(e2)
  else console.table(settings)
  console.log("\n--- Services ---")
  const { data: services } = await supabase.from('services').select('*')
  console.table(services)
}

checkData()
