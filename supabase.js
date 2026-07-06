import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://lcucegmqnibaqvyjjqls.supabase.co'
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-EJIAbYMDgqD2ZP4gkJbPA_LBDUj1we'

console.log("Supabase URL:", supabaseUrl);
// console.log("Supabase Key:", supabaseAnonKey); // Security: don't log the full key in production

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
