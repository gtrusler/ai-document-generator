export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          billing_address: Json | null
          payment_method: Json | null
          stripe_customer_id: string | null
          subscription_status: string | null
          subscription_id: string | null
          subscription_price_id: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          payment_method?: Json | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_id?: string | null
          subscription_price_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          payment_method?: Json | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_id?: string | null
          subscription_price_id?: string | null
        }
      }
      document_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          content: string
          field_codes: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          content: string
          field_codes?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          content?: string
          field_codes?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_responses: {
        Row: {
          id: string
          user_id: string
          template_id: string
          responses: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          responses: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          responses?: Json
          created_at?: string
          updated_at?: string
        }
      }
      document_generations: {
        Row: {
          id: string
          user_id: string
          template_id: string
          response_id: string
          status: 'draft' | 'review' | 'approved' | 'completed'
          generated_document_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          response_id: string
          status: 'draft' | 'review' | 'approved' | 'completed'
          generated_document_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          response_id?: string
          status?: 'draft' | 'review' | 'approved' | 'completed'
          generated_document_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}