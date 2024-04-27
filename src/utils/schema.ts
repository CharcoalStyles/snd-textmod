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
          mod: string | null
          name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          mod?: string | null
          name?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
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
          username: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          username?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
