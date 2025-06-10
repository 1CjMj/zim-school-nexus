export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assignments: {
        Row: {
          class_id: string
          created_at: string | null
          description: string | null
          due_date: string | null
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          points: number | null
          teacher_id: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          points?: number | null
          teacher_id: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          points?: number | null
          teacher_id?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      demo_accounts: {
        Row: {
          created_at: string
          description: string | null
          email: string
          full_name: string
          id: string
          password: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          email: string
          full_name: string
          id?: string
          password: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string
          full_name?: string
          id?: string
          password?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      fees: {
        Row: {
          amount_due: number
          amount_paid: number
          created_at: string | null
          due_date: string | null
          fee_type: string
          id: string
          outstanding_amount: number | null
          parent_id: string | null
          parent_name: string | null
          status: string
          student_id: string
          student_name: string
          updated_at: string | null
        }
        Insert: {
          amount_due?: number
          amount_paid?: number
          created_at?: string | null
          due_date?: string | null
          fee_type?: string
          id?: string
          outstanding_amount?: number | null
          parent_id?: string | null
          parent_name?: string | null
          status?: string
          student_id: string
          student_name: string
          updated_at?: string | null
        }
        Update: {
          amount_due?: number
          amount_paid?: number
          created_at?: string | null
          due_date?: string | null
          fee_type?: string
          id?: string
          outstanding_amount?: number | null
          parent_id?: string | null
          parent_name?: string | null
          status?: string
          student_id?: string
          student_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          password: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          password?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          password?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          assignment_id: string | null
          content: string | null
          created_at: string | null
          feedback: string | null
          file_name: string | null
          file_type: string | null
          file_url: string | null
          grade: number | null
          graded_at: string | null
          id: string
          status: string | null
          student_id: string
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          assignment_id?: string | null
          content?: string | null
          created_at?: string | null
          feedback?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          grade?: number | null
          graded_at?: string | null
          id?: string
          status?: string | null
          student_id: string
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          assignment_id?: string | null
          content?: string | null
          created_at?: string | null
          feedback?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          grade?: number | null
          graded_at?: string | null
          id?: string
          status?: string | null
          student_id?: string
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      user_role: "admin" | "principal" | "teacher" | "student" | "parent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "principal", "teacher", "student", "parent"],
    },
  },
} as const
