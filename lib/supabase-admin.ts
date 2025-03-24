import { createClient } from '@supabase/supabase-js'

// Create a Supabase client with the service role key for admin operations
// This should ONLY be used in server-side code, never in client components
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export { supabaseAdmin }
