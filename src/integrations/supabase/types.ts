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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      complaints: {
        Row: {
          ai_tags: string[] | null
          assigned_to: string | null
          attachments: string[] | null
          category: Database["public"]["Enums"]["complaint_category"]
          complaint_id: string
          created_at: string | null
          description: string
          id: string
          is_anonymous: boolean | null
          priority: Database["public"]["Enums"]["complaint_priority"] | null
          reopen_count: number | null
          resolution_date: string | null
          resolution_note: string | null
          sentiment_score: number | null
          status: Database["public"]["Enums"]["complaint_status"] | null
          student_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_tags?: string[] | null
          assigned_to?: string | null
          attachments?: string[] | null
          category: Database["public"]["Enums"]["complaint_category"]
          complaint_id: string
          created_at?: string | null
          description: string
          id?: string
          is_anonymous?: boolean | null
          priority?: Database["public"]["Enums"]["complaint_priority"] | null
          reopen_count?: number | null
          resolution_date?: string | null
          resolution_note?: string | null
          sentiment_score?: number | null
          status?: Database["public"]["Enums"]["complaint_status"] | null
          student_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_tags?: string[] | null
          assigned_to?: string | null
          attachments?: string[] | null
          category?: Database["public"]["Enums"]["complaint_category"]
          complaint_id?: string
          created_at?: string | null
          description?: string
          id?: string
          is_anonymous?: boolean | null
          priority?: Database["public"]["Enums"]["complaint_priority"] | null
          reopen_count?: number | null
          resolution_date?: string | null
          resolution_note?: string | null
          sentiment_score?: number | null
          status?: Database["public"]["Enums"]["complaint_status"] | null
          student_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          comment: string | null
          complaint_id: string
          created_at: string | null
          id: string
          rating: number | null
          satisfaction_level: string | null
          staff_id: string | null
          student_id: string
        }
        Insert: {
          comment?: string | null
          complaint_id: string
          created_at?: string | null
          id?: string
          rating?: number | null
          satisfaction_level?: string | null
          staff_id?: string | null
          student_id: string
        }
        Update: {
          comment?: string | null
          complaint_id?: string
          created_at?: string | null
          id?: string
          rating?: number | null
          satisfaction_level?: string | null
          staff_id?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          receiver_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          receiver_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          receiver_id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          badges: string[] | null
          batch: string | null
          created_at: string | null
          department: string | null
          email: string
          full_name: string
          id: string
          points: number | null
          profile_image: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          badges?: string[] | null
          batch?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          full_name: string
          id: string
          points?: number | null
          profile_image?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          badges?: string[] | null
          batch?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          points?: number | null
          profile_image?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_complaint_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "staff" | "admin"
      complaint_category:
        | "mentor"
        | "hr"
        | "facility"
        | "payment"
        | "technical"
        | "other"
      complaint_priority: "low" | "medium" | "high"
      complaint_status:
        | "new"
        | "under_review"
        | "in_progress"
        | "resolved"
        | "closed"
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
    Enums: {
      app_role: ["student", "staff", "admin"],
      complaint_category: [
        "mentor",
        "hr",
        "facility",
        "payment",
        "technical",
        "other",
      ],
      complaint_priority: ["low", "medium", "high"],
      complaint_status: [
        "new",
        "under_review",
        "in_progress",
        "resolved",
        "closed",
      ],
    },
  },
} as const
