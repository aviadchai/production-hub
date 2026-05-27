import { createClient } from '@supabase/supabase-js'

export function db() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    // Return a client that will fail queries gracefully — site still renders
    return createClient('https://placeholder.supabase.co', 'placeholder', {
      auth: { persistSession: false },
    })
  }

  return createClient(url, key, { auth: { persistSession: false } })
}

export function isSupabaseConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export const CURRENT_USER_EMAIL = 'aviad.c@artlist.io'
export const CURRENT_USER_NAME = 'Aviad Chai'
