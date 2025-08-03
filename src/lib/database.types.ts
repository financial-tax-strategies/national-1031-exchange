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
      team_members: {
        Row: {
          id: string
          tenant_id: string | null
          slug: string
          display_order: number
          is_active: boolean
          name: string
          job_title: string | null
          works_for: string | null
          url: string | null
          image: string | null
          description: string | null
          birth_date: string | null
          nationality: string | null
          address: Json | null
          telephone: string | null
          email: string | null
          same_as: string[] | null
          knows_about: string[] | null
          alumni_of: string[] | null
          honorific_prefix: string | null
          honorific_suffix: string | null
          job_title_details: Json | null
          awards: string[] | null
          publications: string[] | null
          certifications: string[] | null
          languages_spoken: string[] | null
          years_experience: number | null
          specializations: string[] | null
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          slug: string
          display_order?: number
          is_active?: boolean
          name: string
          job_title?: string | null
          works_for?: string | null
          url?: string | null
          image?: string | null
          description?: string | null
          birth_date?: string | null
          nationality?: string | null
          address?: Json | null
          telephone?: string | null
          email?: string | null
          same_as?: string[] | null
          knows_about?: string[] | null
          alumni_of?: string[] | null
          honorific_prefix?: string | null
          honorific_suffix?: string | null
          job_title_details?: Json | null
          awards?: string[] | null
          publications?: string[] | null
          certifications?: string[] | null
          languages_spoken?: string[] | null
          years_experience?: number | null
          specializations?: string[] | null
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          slug?: string
          display_order?: number
          is_active?: boolean
          name?: string
          job_title?: string | null
          works_for?: string | null
          url?: string | null
          image?: string | null
          description?: string | null
          birth_date?: string | null
          nationality?: string | null
          address?: Json | null
          telephone?: string | null
          email?: string | null
          same_as?: string[] | null
          knows_about?: string[] | null
          alumni_of?: string[] | null
          honorific_prefix?: string | null
          honorific_suffix?: string | null
          job_title_details?: Json | null
          awards?: string[] | null
          publications?: string[] | null
          certifications?: string[] | null
          languages_spoken?: string[] | null
          years_experience?: number | null
          specializations?: string[] | null
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          tenant_id: string | null
          is_active: boolean
          is_featured: boolean
          display_order: number
          item_reviewed_type: string
          item_reviewed_name: string
          review_rating_value: number
          author_name: string
          review_body: string | null
          date_published: string
          headline: string | null
          author_email: string | null
          author_location: string | null
          author_details: Json | null
          service_type: string | null
          transaction_value_range: string | null
          property_type: string | null
          status: string
          moderation_notes: string | null
          approved_by: string | null
          approved_at: string | null
          source: string
          external_id: string | null
          external_url: string | null
          response_text: string | null
          response_date: string | null
          response_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          is_active?: boolean
          is_featured?: boolean
          display_order?: number
          item_reviewed_type?: string
          item_reviewed_name?: string
          review_rating_value: number
          author_name: string
          review_body?: string | null
          date_published?: string
          headline?: string | null
          author_email?: string | null
          author_location?: string | null
          author_details?: Json | null
          service_type?: string | null
          transaction_value_range?: string | null
          property_type?: string | null
          status?: string
          moderation_notes?: string | null
          approved_by?: string | null
          approved_at?: string | null
          source?: string
          external_id?: string | null
          external_url?: string | null
          response_text?: string | null
          response_date?: string | null
          response_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          is_active?: boolean
          is_featured?: boolean
          display_order?: number
          item_reviewed_type?: string
          item_reviewed_name?: string
          review_rating_value?: number
          author_name?: string
          review_body?: string | null
          date_published?: string
          headline?: string | null
          author_email?: string | null
          author_location?: string | null
          author_details?: Json | null
          service_type?: string | null
          transaction_value_range?: string | null
          property_type?: string | null
          status?: string
          moderation_notes?: string | null
          approved_by?: string | null
          approved_at?: string | null
          source?: string
          external_id?: string | null
          external_url?: string | null
          response_text?: string | null
          response_date?: string | null
          response_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      content_media: {
        Row: {
          id: string
          tenant_id: string | null
          entity_type: string
          entity_id: string
          media_type: string
          media_url: string
          media_title: string | null
          media_alt_text: string | null
          media_caption: string | null
          file_name: string | null
          file_size: number | null
          mime_type: string | null
          dimensions: Json | null
          duration_seconds: number | null
          is_primary: boolean
          display_order: number
          processing_status: string
          processing_error: string | null
          created_at: string
          uploaded_by: string | null
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          entity_type: string
          entity_id: string
          media_type: string
          media_url: string
          media_title?: string | null
          media_alt_text?: string | null
          media_caption?: string | null
          file_name?: string | null
          file_size?: number | null
          mime_type?: string | null
          dimensions?: Json | null
          duration_seconds?: number | null
          is_primary?: boolean
          display_order?: number
          processing_status?: string
          processing_error?: string | null
          created_at?: string
          uploaded_by?: string | null
        }
        Update: {
          id?: string
          tenant_id?: string | null
          entity_type?: string
          entity_id?: string
          media_type?: string
          media_url?: string
          media_title?: string | null
          media_alt_text?: string | null
          media_caption?: string | null
          file_name?: string | null
          file_size?: number | null
          mime_type?: string | null
          dimensions?: Json | null
          duration_seconds?: number | null
          is_primary?: boolean
          display_order?: number
          processing_status?: string
          processing_error?: string | null
          created_at?: string
          uploaded_by?: string | null
        }
      }
    }
    Views: {
      team_members_public: {
        Row: {
          id: string | null
          slug: string | null
          name: string | null
          job_title: string | null
          works_for: string | null
          url: string | null
          image: string | null
          description: string | null
          telephone: string | null
          email: string | null
          address: Json | null
          same_as: string[] | null
          knows_about: string[] | null
          alumni_of: string[] | null
          honorific_prefix: string | null
          honorific_suffix: string | null
          awards: string[] | null
          publications: string[] | null
          certifications: string[] | null
          years_experience: number | null
          specializations: string[] | null
          display_order: number | null
          primary_image_url: string | null
          primary_image_alt: string | null
        }
      }
      reviews_summary: {
        Row: {
          total_reviews: number | null
          average_rating: number | null
          five_star_count: number | null
          four_star_count: number | null
          three_star_count: number | null
          two_star_count: number | null
          one_star_count: number | null
        }
      }
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