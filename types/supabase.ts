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
          contract_creator: string | null
          created_at: string
          name: string | null
          post_id: number
          price: number | null
          real_creator: string | null
          symbol: string | null
          url: string | null
        }
        Insert: {
          contract_creator?: string | null
          created_at?: string
          name?: string | null
          post_id: number
          price?: number | null
          real_creator?: string | null
          symbol?: string | null
          url?: string | null
        }
        Update: {
          contract_creator?: string | null
          created_at?: string
          name?: string | null
          post_id?: number
          price?: number | null
          real_creator?: string | null
          symbol?: string | null
          url?: string | null
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
          address: string | null
          content: string | null
          created_at: string
          id: number
        }
        Insert: {
          address?: string | null
          content?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          address?: string | null
          content?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      Trades: {
        Row: {
          aura_used: number | null
          created_at: string
          is_buy: boolean | null
          post_id: number
          token_amount: number | null
          trader: string | null
          usdc_amount: number | null
        }
        Insert: {
          aura_used?: number | null
          created_at?: string
          is_buy?: boolean | null
          post_id: number
          token_amount?: number | null
          trader?: string | null
          usdc_amount?: number | null
        }
        Update: {
          aura_used?: number | null
          created_at?: string
          is_buy?: boolean | null
          post_id?: number
          token_amount?: number | null
          trader?: string | null
          usdc_amount?: number | null
        }
        Relationships: []
      }
      Users: {
        Row: {
          address: string | null
          contract_creator_rewards: number | null
          created_at: string
          handle: string | null
          id: number
          name: string | null
          num_posts: number | null
          num_referrals: number | null
          num_transactions: number | null
          profile_pic: Json | null
          real_creator_rewards: number | null
          total_glayze_earned: number | null
        }
        Insert: {
          address?: string | null
          contract_creator_rewards?: number | null
          created_at?: string
          handle?: string | null
          id?: number
          name?: string | null
          num_posts?: number | null
          num_referrals?: number | null
          num_transactions?: number | null
          profile_pic?: Json | null
          real_creator_rewards?: number | null
          total_glayze_earned?: number | null
        }
        Update: {
          address?: string | null
          contract_creator_rewards?: number | null
          created_at?: string
          handle?: string | null
          id?: number
          name?: string | null
          num_posts?: number | null
          num_referrals?: number | null
          num_transactions?: number | null
          profile_pic?: Json | null
          real_creator_rewards?: number | null
          total_glayze_earned?: number | null
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
