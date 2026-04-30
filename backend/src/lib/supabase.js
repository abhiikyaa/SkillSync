import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

// Use the SERVICE ROLE key on the backend (bypasses RLS for admin operations)
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)
