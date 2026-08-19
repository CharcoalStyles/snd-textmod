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
    PostgrestVersion: "12.0.2 (a4e00ff)"
  }
  public: {
    Tables: {
      mod_comments: {
        Row: {
          comment: string | null
          created_at: string
          id: number
          mod_id: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: number
          mod_id?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: number
          mod_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mod_comments_mod_id_fkey"
            columns: ["mod_id"]
            isOneToOne: false
            referencedRelation: "mods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mod_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mod_tags: {
        Row: {
          created_at: string
          id: number
          mod_id: number | null
          tag: Database["public"]["Enums"]["tags"]
        }
        Insert: {
          created_at?: string
          id?: number
          mod_id?: number | null
          tag: Database["public"]["Enums"]["tags"]
        }
        Update: {
          created_at?: string
          id?: number
          mod_id?: number | null
          tag?: Database["public"]["Enums"]["tags"]
        }
        Relationships: [
          {
            foreignKeyName: "mod_tags_mod_id_fkey"
            columns: ["mod_id"]
            isOneToOne: false
            referencedRelation: "mods"
            referencedColumns: ["id"]
          },
        ]
      }
      mod_votes: {
        Row: {
          created_at: string
          id: number
          mod_id: number | null
          upvote: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          mod_id?: number | null
          upvote?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          mod_id?: number | null
          upvote?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mod_votes_mod_id_fkey"
            columns: ["mod_id"]
            isOneToOne: false
            referencedRelation: "mods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mod_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mods: {
        Row: {
          created_at: string
          description: string | null
          id: number
          last_modified: string | null
          main_image: string | null
          mod: string | null
          name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          last_modified?: string | null
          main_image?: string | null
          mod?: string | null
          name?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          last_modified?: string | null
          main_image?: string | null
          mod?: string | null
          name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mods_rated_7days: {
        Row: {
          id: number
          total_votes: number | null
        }
        Insert: {
          id: number
          total_votes?: number | null
        }
        Update: {
          id?: number
          total_votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mods_rated_7days_duplicate_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "mods"
            referencedColumns: ["id"]
          },
        ]
      }
      mods_rated_alltime: {
        Row: {
          id: number
          total_votes: number | null
        }
        Insert: {
          id: number
          total_votes?: number | null
        }
        Update: {
          id?: number
          total_votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mods_rated_alltime_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "mods"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_mod_ownership: { Args: { mod_id_param: number }; Returns: boolean }
      search_mods: {
        Args: { keyword: string }
        Returns: {
          created_at: string
          description: string | null
          id: number
          last_modified: string | null
          main_image: string | null
          mod: string | null
          name: string | null
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "mods"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      tags:
        | "Items"
        | "Heroes"
        | "Monsters"
        | "Total Conversion"
        | "Story"
        | "Bosses"
        | "WIP"
        | "Tool"
        | "Sandbox"
        | "Mode"
        | "Spells"
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
      tags: [
        "Items",
        "Heroes",
        "Monsters",
        "Total Conversion",
        "Story",
        "Bosses",
        "WIP",
        "Tool",
        "Sandbox",
        "Mode",
        "Spells",
      ],
    },
  },
} as const
