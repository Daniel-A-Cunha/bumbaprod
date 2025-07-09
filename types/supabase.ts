export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: 'todo' | 'inProgress' | 'done';
          priority: 'low' | 'medium' | 'high';
          due_date: string;
          created_at: string;
          updated_at: string;
          allegory_id: string;
          sector: 'design' | 'structure' | 'painting' | 'electrical' | 'finishing' | 'general';
          created_by: string;
        }
        Insert: {
          id?: string;
          title: string;
          description: string;
          status?: 'todo' | 'inProgress' | 'done';
          priority: 'low' | 'medium' | 'high';
          due_date: string;
          allegory_id: string;
          sector: 'design' | 'structure' | 'painting' | 'electrical' | 'finishing' | 'general';
          created_by: string;
        }
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: 'todo' | 'inProgress' | 'done';
          priority?: 'low' | 'medium' | 'high';
          due_date?: string;
          allegory_id?: string;
          sector?: 'design' | 'structure' | 'painting' | 'electrical' | 'finishing' | 'general';
          created_by?: string;
        }
      }
    }
  }
};
