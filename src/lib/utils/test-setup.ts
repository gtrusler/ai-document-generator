import { createClientSupabaseClient } from '@/lib/supabase/client'

export const verifySetup = async (session: any) => {
  try {
    console.log('Checking session:', session)
    if (!session?.user) {
      throw new Error('No authenticated user found')
    }

    // Test database connection
    const supabase = createClientSupabaseClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      throw authError
    }

    if (!authData.user) {
      throw new Error('No user data found')
    }

    // Return auth verification result
    return {
      auth: {
        userId: authData.user.id,
        email: authData.user.email,
        role: authData.user.role
      }
    }
  } catch (error) {
    console.error('Setup verification failed:', error)
    throw error instanceof Error ? error : new Error('Setup verification failed')
  }
}
