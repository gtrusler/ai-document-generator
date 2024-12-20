export interface DocumentTemplate {
  id: string
  name: string
  description: string
  content: string
  field_codes: string[]
  version?: string
  category?: 'agreement' | 'letter' | 'legal' | 'form'
  variables?: Record<string, {
    type: string
    required: boolean
    description?: string
  }>
  validation_rules?: Record<string, {
    pattern?: string
    min?: number
    max?: number
    custom?: string
  }>
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UserResponse {
  id: string
  user_id: string
  template_id: string
  responses: Record<string, any>
  created_at: string
  updated_at: string
}

export interface DocumentGeneration {
  id: string
  user_id: string
  template_id: string
  response_id: string
  status: 'draft' | 'review' | 'approved' | 'completed'
  generated_document_url?: string
  created_at: string
  updated_at: string
}
