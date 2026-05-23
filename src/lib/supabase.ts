import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Null until Supabase env vars are provided — the app runs fully local until then. */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null

export const isCloudEnabled = supabase !== null

export const VAPID_PUBLIC_KEY = (import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined) ?? ''
