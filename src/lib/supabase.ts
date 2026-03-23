import { createClient } from '@supabase/supabase-js'
import type { PlannerSnapshot } from '../types/planner'

export interface Database {
  public: {
    Tables: {
      planner_snapshots: {
        Row: {
          user_id: string
          snapshot: PlannerSnapshot
          updated_at: string
          created_at: string
        }
        Insert: {
          user_id: string
          snapshot: PlannerSnapshot
          updated_at?: string
          created_at?: string
        }
        Update: {
          user_id?: string
          snapshot?: PlannerSnapshot
          updated_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'planner_snapshots_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const supabaseConfigError = isSupabaseConfigured
  ? null
  : 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.'

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null
