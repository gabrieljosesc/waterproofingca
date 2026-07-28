// Generated from the Supabase project schema (public schema).
// Regenerate after migrations with the Supabase MCP / CLI.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      estimate_submissions: {
        Row: {
          active_leak: boolean | null;
          address: string | null;
          basement_depth_band: string | null;
          city: string | null;
          consent: boolean;
          created_at: string;
          email: string;
          extra: Json;
          financing_interest: boolean | null;
          full_name: string;
          house_age_band: string | null;
          id: string;
          leak_location: string | null;
          linear_feet: number | null;
          location_tier: string | null;
          ownership: string | null;
          phone: string | null;
          postal_code: string | null;
          preferred_contact: string | null;
          preferred_timeframe: string | null;
          property_type: string | null;
          rebate_city: string | null;
          service_area_ok: boolean | null;
          service_requested: string | null;
          source: string;
          status: string;
          structure: string | null;
          updated_at: string;
          urgent: boolean | null;
          year_built: number | null;
        };
        Insert: {
          active_leak?: boolean | null;
          address?: string | null;
          basement_depth_band?: string | null;
          city?: string | null;
          consent?: boolean;
          created_at?: string;
          email: string;
          extra?: Json;
          financing_interest?: boolean | null;
          full_name: string;
          house_age_band?: string | null;
          id?: string;
          leak_location?: string | null;
          linear_feet?: number | null;
          location_tier?: string | null;
          ownership?: string | null;
          phone?: string | null;
          postal_code?: string | null;
          preferred_contact?: string | null;
          preferred_timeframe?: string | null;
          property_type?: string | null;
          rebate_city?: string | null;
          service_area_ok?: boolean | null;
          service_requested?: string | null;
          source?: string;
          status?: string;
          structure?: string | null;
          updated_at?: string;
          urgent?: boolean | null;
          year_built?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["estimate_submissions"]["Insert"]>;
        Relationships: [];
      };
      submission_photos: {
        Row: {
          ai_confidence: number | null;
          ai_labels: Json | null;
          bytes: number | null;
          created_at: string;
          height: number | null;
          id: string;
          photo_type: string | null;
          storage_path: string;
          submission_id: string;
          width: number | null;
        };
        Insert: {
          ai_confidence?: number | null;
          ai_labels?: Json | null;
          bytes?: number | null;
          created_at?: string;
          height?: number | null;
          id?: string;
          photo_type?: string | null;
          storage_path: string;
          submission_id: string;
          width?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["submission_photos"]["Insert"]>;
        Relationships: [];
      };
      submission_estimates: {
        Row: {
          ai_conditions: Json | null;
          ai_confidence: number | null;
          created_at: string;
          engine_input: Json | null;
          engine_output: Json | null;
          final_high: number | null;
          final_low: number | null;
          id: string;
          net_high: number | null;
          net_low: number | null;
          owner_adjustments: Json | null;
          range_high: number | null;
          range_low: number | null;
          rebate_amount: number | null;
          status: string;
          submission_id: string;
          updated_at: string;
        };
        Insert: {
          ai_conditions?: Json | null;
          ai_confidence?: number | null;
          created_at?: string;
          engine_input?: Json | null;
          engine_output?: Json | null;
          final_high?: number | null;
          final_low?: number | null;
          id?: string;
          net_high?: number | null;
          net_low?: number | null;
          owner_adjustments?: Json | null;
          range_high?: number | null;
          range_low?: number | null;
          rebate_amount?: number | null;
          status?: string;
          submission_id: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["submission_estimates"]["Insert"]>;
        Relationships: [];
      };
      quote_requests: {
        Row: {
          created_at: string;
          email: string;
          handled: boolean;
          id: string;
          message: string;
          name: string;
          phone: string | null;
          property_type: string;
          service: string | null;
          source: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          handled?: boolean;
          id?: string;
          message: string;
          name: string;
          phone?: string | null;
          property_type?: string;
          service?: string | null;
          source?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quote_requests"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
