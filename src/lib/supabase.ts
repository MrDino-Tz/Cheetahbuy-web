import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gdiwyacyrdstzmgahxvd.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_HjQZ0PXds5EtSH2HgcDVxg_IHrcuBnI'

export const supabase = createClient(supabaseUrl, supabaseKey)