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
      complaints: {
        Row: {
          created_at: string
          description: string
          id: string
          priority: Database["public"]["Enums"]["complaint_priority"]
          status: Database["public"]["Enums"]["complaint_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          priority?: Database["public"]["Enums"]["complaint_priority"]
          status?: Database["public"]["Enums"]["complaint_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["complaint_priority"]
          status?: Database["public"]["Enums"]["complaint_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      fees: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          fee_type: Database["public"]["Enums"]["fee_type"]
          id: string
          mobile_number: string
          month: string
          paid_date: string | null
          payment_id: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          room_number: string | null
          status: string | null
          student_email: string
          student_id: string | null
          student_name: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date?: string | null
          fee_type: Database["public"]["Enums"]["fee_type"]
          id?: string
          mobile_number: string
          month: string
          paid_date?: string | null
          payment_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          room_number?: string | null
          status?: string | null
          student_email: string
          student_id?: string | null
          student_name: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          fee_type?: Database["public"]["Enums"]["fee_type"]
          id?: string
          mobile_number?: string
          month?: string
          paid_date?: string | null
          payment_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          room_number?: string | null
          status?: string | null
          student_email?: string
          student_id?: string | null
          student_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          created_at: string
          from_date: string
          id: string
          parent_email: string
          reason: string
          status: Database["public"]["Enums"]["leave_status"]
          student_email: string
          student_name: string
          student_room: string | null
          to_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_date: string
          id?: string
          parent_email: string
          reason: string
          status?: Database["public"]["Enums"]["leave_status"]
          student_email: string
          student_name: string
          student_room?: string | null
          to_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_date?: string
          id?: string
          parent_email?: string
          reason?: string
          status?: Database["public"]["Enums"]["leave_status"]
          student_email?: string
          student_name?: string
          student_room?: string | null
          to_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      mess_menus: {
        Row: {
          created_at: string
          date: string
          id: string
          items: string[]
          meal_type: Database["public"]["Enums"]["meal_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          items: string[]
          meal_type: Database["public"]["Enums"]["meal_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          items?: string[]
          meal_type?: Database["public"]["Enums"]["meal_type"]
          updated_at?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          capacity: number
          created_at: string
          current_occupancy: number
          floor: number
          id: string
          room_number: number
          status: Database["public"]["Enums"]["room_status"]
          updated_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          current_occupancy?: number
          floor: number
          id?: string
          room_number: number
          status?: Database["public"]["Enums"]["room_status"]
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          current_occupancy?: number
          floor?: number
          id?: string
          room_number?: number
          status?: Database["public"]["Enums"]["room_status"]
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          course: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          room_number: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          course?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          room_number?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          course?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          room_number?: string | null
          updated_at?: string
          year?: number | null
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
      complaint_priority: "low" | "medium" | "high" | "urgent"
      complaint_status: "pending" | "in_progress" | "resolved" | "closed"
      fee_type:
        | "hostel_fee"
        | "mess_fee"
        | "security_deposit"
        | "maintenance_fee"
      leave_status:
        | "pending_warden"
        | "approved_warden"
        | "rejected_warden"
        | "pending_parent"
        | "approved_parent"
        | "rejected_parent"
      meal_type: "breakfast" | "lunch" | "snacks" | "dinner"
      payment_status: "pending" | "paid" | "overdue" | "cancelled"
      room_status: "available" | "occupied" | "maintenance"
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
      complaint_priority: ["low", "medium", "high", "urgent"],
      complaint_status: ["pending", "in_progress", "resolved", "closed"],
      fee_type: [
        "hostel_fee",
        "mess_fee",
        "security_deposit",
        "maintenance_fee",
      ],
      leave_status: [
        "pending_warden",
        "approved_warden",
        "rejected_warden",
        "pending_parent",
        "approved_parent",
        "rejected_parent",
      ],
      meal_type: ["breakfast", "lunch", "snacks", "dinner"],
      payment_status: ["pending", "paid", "overdue", "cancelled"],
      room_status: ["available", "occupied", "maintenance"],
    },
  },
} as const
