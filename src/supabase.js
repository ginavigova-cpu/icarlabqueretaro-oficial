import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ajvfoiwofdcxjqrfszug.supabase.co'
const supabaseAnonKey = 'sb_publishable_S0UtY5UXKZC_SSHmH4CrUg_YU3NW...' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)