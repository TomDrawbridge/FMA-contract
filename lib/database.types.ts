export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          address: string
          post_code: string
          home_phone: string | null
          mobile_phone: string
          work_phone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          address: string
          post_code: string
          home_phone?: string | null
          mobile_phone: string
          work_phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          address?: string
          post_code?: string
          home_phone?: string | null
          mobile_phone?: string
          work_phone?: string | null
          created_at?: string
        }
      }
      members: {
        Row: {
          id: string
          user_id: string
          name: string
          package: string
          sport: string
          day: string
          time: string
          date_of_birth: string
          gender: string
          sibling_attends: boolean
          has_medical_conditions: boolean
          medical_conditions_details: string | null
          has_allergies: boolean
          allergies_details: string | null
          has_injury: boolean
          injury_details: string | null
          photo_consent: boolean
          first_aid_consent: boolean
          membership_option: string
          branch_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          package: string
          sport: string
          day: string
          time: string
          date_of_birth: string
          gender: string
          sibling_attends?: boolean
          has_medical_conditions?: boolean
          medical_conditions_details?: string | null
          has_allergies?: boolean
          allergies_details?: string | null
          has_injury?: boolean
          injury_details?: string | null
          photo_consent?: boolean
          first_aid_consent?: boolean
          membership_option: string
          branch_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          package?: string
          sport?: string
          day?: string
          time?: string
          date_of_birth?: string
          gender?: string
          sibling_attends?: boolean
          has_medical_conditions?: boolean
          medical_conditions_details?: string | null
          has_allergies?: boolean
          allergies_details?: string | null
          has_injury?: string
          injury_details?: string | null
          photo_consent?: boolean
          first_aid_consent?: boolean
          membership_option?: string
          branch_id?: string | null
          created_at?: string
        }
      }
      branches: {
        Row: {
          id: string
          name: string
          address: string | null
          post_code: string | null
          phone: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          address?: string | null
          post_code?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          post_code?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
        }
      }
      emergency_contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          address: string
          post_code: string
          home_phone: string | null
          mobile_phone: string
          work_phone: string | null
          relationship: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          address: string
          post_code: string
          home_phone?: string | null
          mobile_phone: string
          work_phone?: string | null
          relationship: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          address?: string
          post_code?: string
          home_phone?: string | null
          mobile_phone?: string
          work_phone?: string | null
          relationship?: string
          created_at?: string
        }
      }
      signatures: {
        Row: {
          id: string
          user_id: string
          signature_data: string
          ip_address: string
          user_agent: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          signature_data: string
          ip_address: string
          user_agent: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          signature_data?: string
          ip_address?: string
          user_agent?: string
          created_at?: string
        }
      }
      contract_acceptances: {
        Row: {
          id: string
          user_id: string
          accepted_at: string
          contract_version: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          accepted_at: string
          contract_version: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          accepted_at?: string
          contract_version?: string
          created_at?: string
        }
      }
      email_logs: {
        Row: {
          id: string
          recipient_email: string
          recipient_name: string
          subject: string
          sent_at: string
          created_at: string
        }
        Insert: {
          id?: string
          recipient_email: string
          recipient_name: string
          subject: string
          sent_at: string
          created_at?: string
        }
        Update: {
          id?: string
          recipient_email?: string
          recipient_name?: string
          subject?: string
          sent_at?: string
          created_at?: string
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
