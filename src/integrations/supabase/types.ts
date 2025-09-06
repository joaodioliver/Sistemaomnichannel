export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string
          doctor_name: string
          duration_minutes: number
          id: string
          notes: string | null
          patient_id: string
          reminder_sent: boolean
          scheduled_date: string
          scheduled_time: string
          specialty: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          doctor_name: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          patient_id: string
          reminder_sent?: boolean
          scheduled_date: string
          scheduled_time: string
          specialty: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          doctor_name?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          patient_id?: string
          reminder_sent?: boolean
          scheduled_date?: string
          scheduled_time?: string
          specialty?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      attendants: {
        Row: {
          created_at: string
          department: string | null
          employee_id: string | null
          id: string
          is_online: boolean
          last_activity: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          employee_id?: string | null
          id?: string
          is_online?: boolean
          last_activity?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          employee_id?: string | null
          id?: string
          is_online?: boolean
          last_activity?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          attendant_id: string | null
          channel: string
          closed_at: string | null
          created_at: string
          feedback: string | null
          id: string
          last_message_at: string
          patient_id: string
          priority: number
          rating: number | null
          started_at: string
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          attendant_id?: string | null
          channel: string
          closed_at?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          last_message_at?: string
          patient_id: string
          priority?: number
          rating?: number | null
          started_at?: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          attendant_id?: string | null
          channel?: string
          closed_at?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          last_message_at?: string
          patient_id?: string
          priority?: number
          rating?: number | null
          started_at?: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          file_url: string | null
          id: string
          message_type: string
          read_at: string | null
          sender_id: string
          status: string
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          file_url?: string | null
          id?: string
          message_type?: string
          read_at?: string | null
          sender_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          file_url?: string | null
          id?: string
          message_type?: string
          read_at?: string | null
          sender_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          birth_date: string | null
          cpf: string | null
          created_at: string
          emergency_contact: string | null
          id: string
          medical_history: string | null
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          emergency_contact?: string | null
          id?: string
          medical_history?: string | null
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          emergency_contact?: string | null
          id?: string
          medical_history?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          attendant_id: string
          avg_response_time_seconds: number
          conversations_handled: number
          created_at: string
          customer_satisfaction_avg: number
          date: string
          id: string
          messages_sent: number
          updated_at: string
        }
        Insert: {
          attendant_id: string
          avg_response_time_seconds?: number
          conversations_handled?: number
          created_at?: string
          customer_satisfaction_avg?: number
          date: string
          id?: string
          messages_sent?: number
          updated_at?: string
        }
        Update: {
          attendant_id?: string
          avg_response_time_seconds?: number
          conversations_handled?: number
          created_at?: string
          customer_satisfaction_avg?: number
          date?: string
          id?: string
          messages_sent?: number
          updated_at?: string
        }
        Relationships: []
      }
      quick_replies: {
        Row: {
          attendant_id: string
          content: string
          created_at: string
          id: string
          is_global: boolean
          title: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          attendant_id: string
          content: string
          created_at?: string
          id?: string
          is_global?: boolean
          title: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          attendant_id?: string
          content?: string
          created_at?: string
          id?: string
          is_global?: boolean
          title?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          is_active: boolean
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
