import { createClientSupabaseClient } from '@/lib/supabase/client'
import type { DocumentTemplate, UserResponse, DocumentGeneration } from '@/types/supabase'

export class DocumentService {
  private supabase = createClientSupabaseClient()

  async getTemplates() {
    // Check auth state
    const { data: { session }, error: authError } = await this.supabase.auth.getSession()
    console.log('Auth state:', { session, authError })

    const { data, error } = await this.supabase
      .from('document_templates')
      .select('*')
    
    console.log('Templates query:', { data, error })
    
    if (error) throw error
    return data as DocumentTemplate[]
  }

  async saveUserResponses(templateId: string, responses: Record<string, any>) {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser()
    if (authError) throw authError
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await this.supabase
      .from('user_responses')
      .insert({
        user_id: user.id,
        template_id: templateId,
        responses
      })
      .select()
      .single()

    if (error) throw error
    return data as UserResponse
  }

  async generateDocument(templateId: string, responseId: string) {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser()
    if (authError) throw authError
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await this.supabase
      .from('document_generations')
      .insert({
        user_id: user.id,
        template_id: templateId,
        response_id: responseId,
        status: 'draft'
      })
      .select()
      .single()

    if (error) throw error
    return data as DocumentGeneration
  }
}

export const documentService = new DocumentService()
