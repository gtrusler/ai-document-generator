import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Environment check:', {
  hasUrl: !!supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  hasServiceKey: !!supabaseServiceRoleKey,
  url: supabaseUrl,
  anonKey: supabaseAnonKey?.slice(0, 8) + '...',
})

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

if (!supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
}

export const createServerSupabaseClient = () => {
  try {
    console.log('Creating server Supabase client...')
    const client = createClient<Database>(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    console.log('Server Supabase client created')
    return client
  } catch (error) {
    console.error('Failed to create server Supabase client:', error)
    throw error
  }
}

export const createClientSupabaseClient = () => {
  try {
    console.log('Creating Supabase client...')
    
    // Create the client
    const client = createClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          debug: true,
          storageKey: 'supabase.auth.token',
          storage: typeof window !== 'undefined' ? window.localStorage : undefined
        }
      }
    )

    // Test the client
    console.log('Testing client auth...', client.auth)
    
    return client
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    throw error
  }
}