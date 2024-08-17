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
      Posts: {
        Row: {
          ath: number | null
          contract_creator: string | null
          created_at: string
          image_uri: string | null
          name: string | null
          post_id: string
          real_creator: string | null
          symbol: string | null
          url: string | null
          volume: number | null
        }
        Insert: {
          ath?: number | null
          contract_creator?: string | null
          created_at?: string
          image_uri?: string | null
          name?: string | null
          post_id: string
          real_creator?: string | null
          symbol?: string | null
          url?: string | null
          volume?: number | null
        }
        Update: {
          ath?: number | null
          contract_creator?: string | null
          created_at?: string
          image_uri?: string | null
          name?: string | null
          post_id?: string
          real_creator?: string | null
          symbol?: string | null
          url?: string | null
          volume?: number | null
        }
        Relationships: []
      }
      Referrals: {
        Row: {
          created_at: string
          from: string | null
          id: number
          is_accepted: boolean | null
          show: boolean | null
          to: string | null
        }
        Insert: {
          created_at?: string
          from?: string | null
          id?: number
          is_accepted?: boolean | null
          show?: boolean | null
          to?: string | null
        }
        Update: {
          created_at?: string
          from?: string | null
          id?: number
          is_accepted?: boolean | null
          show?: boolean | null
          to?: string | null
        }
        Relationships: []
      }
      Search: {
        Row: {
          content: string | null
          created_at: string
          dynamic_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          dynamic_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          dynamic_id?: string
        }
        Relationships: []
      }
      Trades: {
        Row: {
          aura: string | null
          created_at: string
          is_buy: boolean | null
          post_id: string
          shares: string | null
          trader: string | null
          usdc: string | null
        }
        Insert: {
          aura?: string | null
          created_at?: string
          is_buy?: boolean | null
          post_id: string
          shares?: string | null
          trader?: string | null
          usdc?: string | null
        }
        Update: {
          aura?: string | null
          created_at?: string
          is_buy?: boolean | null
          post_id?: string
          shares?: string | null
          trader?: string | null
          usdc?: string | null
        }
        Relationships: []
      }
      Users: {
        Row: {
          address: string | null
          created_at: string
          dynamic_id: string
          referral_code: string | null
          x_user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          dynamic_id: string
          referral_code?: string | null
          x_user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          dynamic_id?: string
          referral_code?: string | null
          x_user_id?: string | null
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
