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
      customers: {
        Row: {
          created_at: string
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          created_at?: string
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          id: string
          message: string
          quiz_id: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          quiz_id: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          quiz_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_quiz_id_fkey"
            columns: ["quiz_id"]
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          }
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          created_at: string
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string
          id: string
          message_id: string | null
          question_data: Json | null
          topic_id: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message_id?: string | null
          question_data?: Json | null
          topic_id?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string | null
          question_data?: Json | null
          topic_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_message_id_fkey"
            columns: ["message_id"]
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            referencedRelation: "topics"
            referencedColumns: ["id"]
          }
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          creator_id: string | null
          id: string
          model: string | null
          quiz_order: Json[] | null
          selected_topic: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          id: string
          model?: string | null
          quiz_order?: Json[] | null
          selected_topic?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          id?: string
          model?: string | null
          quiz_order?: Json[] | null
          selected_topic?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      topics: {
        Row: {
          created_at: string
          id: string
          quiz_id: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          id: string
          quiz_id?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          quiz_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_quiz_id_fkey"
            columns: ["quiz_id"]
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          created_at: string
          full_name: string | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          created_at?: string
          full_name?: string | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          created_at?: string
          full_name?: string | null
          id?: string
          payment_method?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_quiz_and_topic: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
