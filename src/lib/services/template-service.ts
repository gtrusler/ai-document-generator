import { createClientSupabaseClient } from '@/lib/supabase/client'
import type { DocumentTemplate } from '@/types/supabase'

export class TemplateService {
  private supabase = createClientSupabaseClient()

  constructor() {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized')
    }
  }

  private async checkConnection() {
    try {
      const { data, error } = await this.supabase
        .from('document_templates')
        .select('count')
        .limit(1)
        .single()

      if (error) {
        console.error('Database connection error:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Failed to check database connection:', error)
      throw new Error('Database connection failed')
    }
  }

  async getTemplateByNameAndVersion(name: string, version?: string) {
    console.log('Getting template:', { name, version })
    try {
      await this.checkConnection()

      const query = this.supabase
        .from('document_templates')
        .select('*')
        .eq('name', name)
      
      if (version) {
        query.eq('version', version)
      } else {
        query.is('version', null)
      }

      const { data, error } = await query.single()
      
      if (error) {
        console.error('Database error:', error)
        throw error
      }
      
      if (!data) {
        throw new Error(`Template not found: ${name}`)
      }

      console.log('Found template:', data)
      return data as DocumentTemplate
    } catch (error) {
      console.error('Error getting template:', error)
      throw error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }

  async createTemplate(template: Omit<DocumentTemplate, 'id' | 'created_at' | 'updated_at'>) {
    try {
      await this.checkConnection()

      const { data, error } = await this.supabase
        .from('document_templates')
        .insert(template)
        .select()
        .single()

      if (error) throw error
      return data as DocumentTemplate
    } catch (error) {
      console.error('Error creating template:', error)
      throw error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }

  async updateTemplate(id: string, updates: Partial<DocumentTemplate>) {
    try {
      await this.checkConnection()

      const { data, error } = await this.supabase
        .from('document_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as DocumentTemplate
    } catch (error) {
      console.error('Error updating template:', error)
      throw error instanceof Error ? error : new Error('Unknown error occurred')
    }
  }

  async validateFieldCodes(template: DocumentTemplate, responses: Record<string, any>) {
    console.log('Validating template:', { 
      templateId: template.id,
      templateName: template.name,
      responses 
    })

    try {
      const missingFields: string[] = []
      const validationErrors: Record<string, string> = {}

      // Check required fields from variables
      if (template.variables) {
        Object.entries(template.variables).forEach(([field, config]) => {
          console.log('Checking field:', field, config)
          if (config.required && !responses[field]) {
            missingFields.push(field)
          }
        })
      }

      // Apply validation rules
      if (template.validation_rules) {
        Object.entries(template.validation_rules).forEach(([field, rules]) => {
          console.log('Validating field:', field, rules)
          const value = responses[field]
          
          if (value !== undefined) {
            if (rules.pattern) {
              try {
                const regex = new RegExp(rules.pattern)
                if (!regex.test(value)) {
                  validationErrors[field] = `Invalid format for ${field}`
                }
              } catch (e) {
                console.error(`Invalid regex pattern for ${field}:`, e)
                validationErrors[field] = 'Invalid validation pattern'
              }
            }

            if (rules.min !== undefined) {
              if (typeof value === 'string' && value.length < rules.min) {
                validationErrors[field] = `${field} must be at least ${rules.min} characters`
              } else if (typeof value === 'number' && value < rules.min) {
                validationErrors[field] = `${field} must be at least ${rules.min}`
              }
            }

            if (rules.max !== undefined) {
              if (typeof value === 'string' && value.length > rules.max) {
                validationErrors[field] = `${field} must be at most ${rules.max} characters`
              } else if (typeof value === 'number' && value > rules.max) {
                validationErrors[field] = `${field} must be at most ${rules.max}`
              }
            }
          }
        })
      }

      const result = {
        isValid: missingFields.length === 0 && Object.keys(validationErrors).length === 0,
        missingFields,
        validationErrors
      }
      
      console.log('Validation result:', result)
      return result
    } catch (error) {
      console.error('Error validating template:', error)
      throw error instanceof Error ? error : new Error('Validation failed')
    }
  }

  async listTemplates(category?: string) {
    console.log('Listing templates:', { category })
    try {
      await this.checkConnection()

      const query = this.supabase
        .from('document_templates')
        .select('*')
      
      if (category) {
        query.eq('category', category)
      }

      const { data, error } = await query
      
      if (error) {
        console.error('Database error:', error)
        throw error
      }
      
      console.log('Found templates:', data?.length)
      return data as DocumentTemplate[]
    } catch (error) {
      console.error('Error listing templates:', error)
      throw error instanceof Error ? error : new Error('Failed to list templates')
    }
  }
}

export const templateService = new TemplateService()
