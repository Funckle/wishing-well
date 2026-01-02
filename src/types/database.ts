export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          total_points: number
          custom_wish_enabled: boolean
          gif_enabled: boolean
          custom_wish_warnings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          total_points?: number
          custom_wish_enabled?: boolean
          gif_enabled?: boolean
          custom_wish_warnings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          total_points?: number
          custom_wish_enabled?: boolean
          gif_enabled?: boolean
          custom_wish_warnings?: number
          created_at?: string
          updated_at?: string
        }
      }
      wells: {
        Row: {
          id: string
          short_code: string
          user_id: string | null
          context: string
          wish_limit: number
          wish_count: number
          is_active: boolean
          is_public: boolean
          average_rating: number | null
          expires_at: string
          created_at: string
          closed_at: string | null
          notification_email: string | null
          well_theme: string | null
          background_theme: string | null
        }
        Insert: {
          id?: string
          short_code: string
          user_id?: string | null
          context: string
          wish_limit: number
          wish_count?: number
          is_active?: boolean
          is_public?: boolean
          average_rating?: number | null
          expires_at: string
          created_at?: string
          closed_at?: string | null
          notification_email?: string | null
          well_theme?: string | null
          background_theme?: string | null
        }
        Update: {
          id?: string
          short_code?: string
          user_id?: string | null
          context?: string
          wish_limit?: number
          wish_count?: number
          is_active?: boolean
          is_public?: boolean
          average_rating?: number | null
          expires_at?: string
          created_at?: string
          closed_at?: string | null
          notification_email?: string | null
          well_theme?: string | null
          background_theme?: string | null
        }
      }
      wishes: {
        Row: {
          id: string
          well_id: string
          sender_id: string | null
          sender_ip: string | null
          sentence_starter: string
          descriptors: string[]
          outcome: string
          emojis: string[]
          custom_text: string | null
          gif_url: string | null
          rating: number | null
          is_viewed: boolean
          created_at: string
          rated_at: string | null
          coin_theme: string | null
        }
        Insert: {
          id?: string
          well_id: string
          sender_id?: string | null
          sender_ip?: string | null
          sentence_starter: string
          descriptors: string[]
          outcome: string
          emojis: string[]
          custom_text?: string | null
          gif_url?: string | null
          rating?: number | null
          is_viewed?: boolean
          created_at?: string
          rated_at?: string | null
          coin_theme?: string | null
        }
        Update: {
          id?: string
          well_id?: string
          sender_id?: string | null
          sender_ip?: string | null
          sentence_starter?: string
          descriptors?: string[]
          outcome?: string
          emojis?: string[]
          custom_text?: string | null
          gif_url?: string | null
          rating?: number | null
          is_viewed?: boolean
          created_at?: string
          rated_at?: string | null
          coin_theme?: string | null
        }
      }
      cosmetics: {
        Row: {
          id: string
          name: string
          type: 'badge' | 'avatar_frame' | 'well_frame'
          price_cents: number
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'badge' | 'avatar_frame' | 'well_frame'
          price_cents: number
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'badge' | 'avatar_frame' | 'well_frame'
          price_cents?: number
          image_url?: string
          created_at?: string
        }
      }
      user_cosmetics: {
        Row: {
          id: string
          user_id: string
          cosmetic_id: string
          is_equipped: boolean
          purchased_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cosmetic_id: string
          is_equipped?: boolean
          purchased_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cosmetic_id?: string
          is_equipped?: boolean
          purchased_at?: string
        }
      }
      rate_limits: {
        Row: {
          id: string
          ip_address: string
          wish_count: number
          window_start: string
        }
        Insert: {
          id?: string
          ip_address: string
          wish_count?: number
          window_start?: string
        }
        Update: {
          id?: string
          ip_address?: string
          wish_count?: number
          window_start?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'wish_received' | 'wish_rated'
          title: string
          message: string | null
          data: Record<string, unknown> | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'wish_received' | 'wish_rated'
          title: string
          message?: string | null
          data?: Record<string, unknown> | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'wish_received' | 'wish_rated'
          title?: string
          message?: string | null
          data?: Record<string, unknown> | null
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      leaderboard: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          total_points: number
          rank: number
        }
      }
    }
    Functions: {
      increment_wish_count: {
        Args: { well_id: string }
        Returns: void
      }
      update_well_rating: {
        Args: { well_id: string }
        Returns: void
      }
      add_points: {
        Args: { user_id: string; points: number }
        Returns: void
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Well = Database['public']['Tables']['wells']['Row']
export type Wish = Database['public']['Tables']['wishes']['Row']
export type Cosmetic = Database['public']['Tables']['cosmetics']['Row']
export type UserCosmetic = Database['public']['Tables']['user_cosmetics']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
