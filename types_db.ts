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
      questions: {
        Row: {
          created_at: string
          id: string
          question_data: Json | null
          quiz_id: string
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          question_data?: Json | null
          quiz_id: string
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          question_data?: Json | null
          quiz_id?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            referencedRelation: "quizzes"
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
          title: string | null
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          id: string
          model?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          id?: string
          model?: string | null
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
