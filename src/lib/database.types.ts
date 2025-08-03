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
      leads: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          timezone: string | null
          interested_property_type: string | null
          property_state: string | null
          estimated_property_value: number | null
          estimated_gain: number | null
          potential_tax_savings: number | null
          investment_timeline: string | null
          source: string | null
          highlevel_contact_id: string | null
          status: string
          is_qualified: boolean
          lead_score: number | null
          score_factors: Json | null
          display_score: number | null
          appointment_id: string | null
          merged_into_lead_id: string | null
          email_verified: boolean
          email_verification_token: string | null
          email_verification_sent_at: string | null
          email_verified_at: string | null
          unsubscribed: boolean
          unsubscribe_token: string | null
          unsubscribed_at: string | null
          referral_partner_id: string | null
          referral_source: string | null
          referral_fee_percentage: number | null
          tenant_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          timezone?: string | null
          interested_property_type?: string | null
          property_state?: string | null
          estimated_property_value?: number | null
          estimated_gain?: number | null
          potential_tax_savings?: number | null
          investment_timeline?: string | null
          source?: string | null
          highlevel_contact_id?: string | null
          status?: string
          is_qualified?: boolean
          lead_score?: number | null
          score_factors?: Json | null
          display_score?: number | null
          appointment_id?: string | null
          merged_into_lead_id?: string | null
          email_verified?: boolean
          email_verification_token?: string | null
          email_verification_sent_at?: string | null
          email_verified_at?: string | null
          unsubscribed?: boolean
          unsubscribe_token?: string | null
          unsubscribed_at?: string | null
          referral_partner_id?: string | null
          referral_source?: string | null
          referral_fee_percentage?: number | null
          tenant_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          timezone?: string | null
          interested_property_type?: string | null
          property_state?: string | null
          estimated_property_value?: number | null
          estimated_gain?: number | null
          potential_tax_savings?: number | null
          investment_timeline?: string | null
          source?: string | null
          highlevel_contact_id?: string | null
          status?: string
          is_qualified?: boolean
          lead_score?: number | null
          score_factors?: Json | null
          display_score?: number | null
          appointment_id?: string | null
          merged_into_lead_id?: string | null
          email_verified?: boolean
          email_verification_token?: string | null
          email_verification_sent_at?: string | null
          email_verified_at?: string | null
          unsubscribed?: boolean
          unsubscribe_token?: string | null
          unsubscribed_at?: string | null
          referral_partner_id?: string | null
          referral_source?: string | null
          referral_fee_percentage?: number | null
          tenant_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: string
          is_active?: boolean
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}