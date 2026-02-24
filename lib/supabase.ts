import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local and in Vercel → Settings → Environment Variables.'
  )
}

// Using untyped client — our own types in lib/types.ts handle type safety
// at the query result level via explicit casting.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function createServiceClient() {
  if (!supabaseServiceKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local and Vercel Environment Variables for admin/API routes.'
    )
  }
  return createClient(supabaseUrl!, supabaseServiceKey)
}
