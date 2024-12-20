'use client'

import { useState, useEffect } from 'react'
import { createClientSupabaseClient } from '@/lib/supabase/client'

export default function TestPage() {
  const [error, setError] = useState<string | null>(null)
  const [supabase, setSupabase] = useState<any>(null)
  const [status, setStatus] = useState<string>('initializing')
  const [logs, setLogs] = useState<string[]>(['Starting initialization...'])

  const addLog = (message: string) => {
    console.log(message) // Also log to console
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`])
  }

  useEffect(() => {
    const initSupabase = async () => {
      try {
        // Check environment variables
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        addLog(`Environment check - URL: ${url ? 'exists' : 'missing'}, Key: ${key ? 'exists' : 'missing'}`)
        
        if (!url || !key) {
          throw new Error('Missing required environment variables')
        }

        addLog('Environment variables verified')
        addLog('Creating Supabase client...')
        
        const client = createClientSupabaseClient()
        addLog('Client created')
        
        // Test the client
        addLog('Testing auth...')
        const { data: { session }, error: sessionError } = await client.auth.getSession()
        
        if (sessionError) {
          addLog(`Session error: ${sessionError.message}`)
          throw sessionError
        }
        
        addLog(`Session status: ${session ? 'Active' : 'None'}`)
        setSupabase(client)
        setStatus('ready')
        addLog('Initialization complete')
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error'
        addLog(`Error during initialization: ${message}`)
        console.error('Initialization error:', e)
        setError(`Failed to initialize: ${message}`)
        setStatus('error')
      }
    }

    initSupabase().catch(e => {
      addLog(`Unhandled error: ${e.message}`)
      setError(`Unhandled error: ${e.message}`)
      setStatus('error')
    })
  }, [])

  const handleClick = async () => {
    if (!supabase) {
      addLog('No Supabase client available')
      return
    }

    try {
      addLog('Starting sign in...')
      setStatus('signing-in')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password: 'admin123'
      })
      
      if (error) {
        addLog(`Sign in error: ${error.message}`)
        setError(error.message)
        setStatus('error')
      } else {
        addLog('Sign in successful')
        setStatus('signed-in')
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      addLog(`Error during sign in: ${message}`)
      setError(message)
      setStatus('error')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Test Page</h1>
      
      <div className="space-y-4">
        <div className="text-sm">
          Status: <span className="font-medium">{status}</span>
        </div>
        
        <button 
          onClick={handleClick}
          disabled={!supabase || status === 'signing-in'}
          className={`px-4 py-2 ${
            !supabase || status === 'signing-in'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded`}
        >
          {status === 'signing-in' ? 'Signing In...' : 'Sign In'}
        </button>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <div className="mt-8">
          <h2 className="text-lg font-medium mb-2">Debug Logs</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm h-64 overflow-auto">
            {logs.join('\n')}
          </pre>
        </div>
      </div>
    </div>
  )
}
