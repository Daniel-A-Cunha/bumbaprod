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
          name: string
          role: 'admin' | 'manager' | 'worker'
          sector: 'design' | 'structure' | 'painting' | 'electrical' | 'finishing' | 'general'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role?: 'admin' | 'manager' | 'worker'
          sector?: 'design' | 'structure' | 'painting' | 'electrical' | 'finishing' | 'general'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: 'admin' | 'manager' | 'worker'
          sector?: 'design' | 'structure' | 'painting' | 'electrical' | 'finishing' | 'general'
          avatar_url?: string | null
          updated_at?: string
        }
      }
      allegories: {
        Row: {
          id: string
          name: string
          status: 'onTrack' | 'alert' | 'delayed'
          description: string | null
          image_url: string | null
          design_progress: number
          structure_progress: number
          painting_progress: number
          electrical_progress: number
          finishing_progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          status?: 'onTrack' | 'alert' | 'delayed'
          description?: string | null
          image_url?: string | null
          design_progress?: number
          structure_progress?: number
          painting_progress?: number
          electrical_progress?: number
          finishing_progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          status?: 'onTrack' | 'alert' | 'delayed'
          description?: string | null
          image_url?: string | null
          design_progress?: number
          structure_progress?: number
          painting_progress?: number
          electrical_progress?: number
          finishing_progress?: number
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          status: 'todo' | 'inProgress' | 'done'
          sector: 'design' | 'structure' | 'painting' | 'electrical' | 'finishing' | 'general'
          allegory_id: string
          due_date: string
          priority: 'low' | 'medium' | 'high'
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: 'todo' | 'inProgress' | 'done'
          sector: 'design' | 'structure' | 'painting' | 'electrical' | 'finishing' | 'general'
          allegory_id: string
          due_date: string
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'todo' | 'inProgress' | 'done'
          sector?: 'design' | 'structure' | 'painting' | 'electrical' | 'finishing' | 'general'
          allegory_id?: string
          due_date?: string
          priority?: 'low' | 'medium' | 'high'
          updated_at?: string
        }
      }
      task_assignments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          assigned_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          assigned_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
        }
      }
      materials: {
        Row: {
          id: string
          name: string
          category: string
          unit: string
          current_stock: number
          minimum_stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          unit: string
          current_stock: number
          minimum_stock: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          unit?: string
          current_stock?: number
          minimum_stock?: number
          updated_at?: string
        }
      }
      material_consumption: {
        Row: {
          id: string
          material_id: string
          allegory_id: string
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          material_id: string
          allegory_id: string
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          material_id?: string
          allegory_id?: string
          amount?: number
        }
      }
      alerts: {
        Row: {
          id: string
          type: 'task' | 'material' | 'bottleneck' | 'team'
          title: string
          description: string
          related_id: string | null
          severity: 'info' | 'warning' | 'critical'
          read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'task' | 'material' | 'bottleneck' | 'team'
          title: string
          description: string
          related_id?: string | null
          severity?: 'info' | 'warning' | 'critical'
          read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'task' | 'material' | 'bottleneck' | 'team'
          title?: string
          description?: string
          related_id?: string | null
          severity?: 'info' | 'warning' | 'critical'
          read?: boolean
          updated_at?: string
        }
      }
      check_ins: {
        Row: {
          id: string
          user_id: string
          allegory_id: string
          sector_id: string
          type: 'in' | 'out'
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          allegory_id: string
          sector_id: string
          type: 'in' | 'out'
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          allegory_id?: string
          sector_id?: string
          type?: 'in' | 'out'
          timestamp?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          sender_id: string
          message: string
          image_url: string | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          message: string
          image_url?: string | null
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          message?: string
          image_url?: string | null
          timestamp?: string
        }
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