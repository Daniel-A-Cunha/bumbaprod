import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import { TaskStatus, TaskSector } from '@/utils/types';

// Função auxiliar para gerenciar canais de forma segura
const createChannel = (channelName: string, callback: () => void) => {
  // Verifica se já existe um canal com esse nome
  const existingChannel = supabase.channel(channelName);
  
  // Se já existe um canal, apenas retorna ele
  if (existingChannel) {
    return existingChannel;
  }
  
  // Cria um novo canal
  return supabase
    .channel(channelName)
    .on('postgres_changes', { event: '*', schema: 'public' }, callback)
    .subscribe();
};

// Define os tipos de tabela a partir da sua definição de banco de dados
type Tables = Database['public']['Tables'];

/* ------------------------------------------------------------------ */
/* ALLEGORIES                                                         */
/* ------------------------------------------------------------------ */
export function useAllegories() {
  const [allegories, setAllegories] = useState<Tables['allegories']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // useRef para armazenar a instância do canal e garantir que seja única
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchAllegories = async () => {
    try {
      const { data, error } = await supabase
        .from('allegories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllegories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllegories();

    // Usa a função auxiliar para criar o canal de forma segura
    channelRef.current = createChannel('allegories-channel', fetchAllegories);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null; // Limpa a referência para permitir nova criação se o componente remontar
      }
    };
  }, []); // Array de dependências vazio para que o efeito seja executado apenas na montagem

  return { allegories, loading, error, refetch: fetchAllegories };
}

/* ------------------------------------------------------------------ */
/* TASKS                                                              */
/* ------------------------------------------------------------------ */
export function useTasks() {
  const [tasks, setTasks] = useState<Database['public']['Tables']['tasks']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          due_date,
          created_at,
          updated_at,
          allegory_id,
          sector,
          created_by
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      if (!data) {
        throw new Error('Nenhum dado retornado do banco');
      }

      setTasks(data);
      setLoading(false); // Set loading to false here
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar tarefas');
      setLoading(false); // Set loading to false on error
    }
  };

  useEffect(() => {
    fetchTasks();

    channelRef.current = createChannel('tasks-channel', fetchTasks);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  // Create task
  const createTask = async (taskData: Omit<Database['public']['Tables']['tasks']['Insert'], 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select();

      if (error) throw error;
      setTasks(prev => [...prev, data[0]]);
      return data[0];
    } catch (err) {
      throw new Error('Erro ao criar tarefa');
    }
  };

  // Update task
  const updateTask = async (id: string, updates: Partial<Database['public']['Tables']['tasks']['Update']>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => prev.map(task => task.id === id ? data : task));
      return data;
    } catch (err) {
      throw new Error('Erro ao atualizar tarefa');
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      throw new Error('Erro ao deletar tarefa');
    }
  };

  return { 
    tasks, 
    loading, 
    error, 
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
}

/* ------------------------------------------------------------------ */
/* MATERIALS                                                          */
/* ------------------------------------------------------------------ */
export function useMaterials() {
  const [materials, setMaterials] = useState<(Tables['materials']['Row'] & {
    consumption: Tables['material_consumption']['Row'][];
  })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          material_consumption (*)
        `)
        .order('name');

      if (error) throw error;
      setMaterials(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();

    channelRef.current = createChannel('materials-channel', fetchMaterials);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  return { materials, loading, error, refetch: fetchMaterials };
}

/* ------------------------------------------------------------------ */
/* ALERTS                                                             */
/* ------------------------------------------------------------------ */
export function useAlerts() {
  const [alerts, setAlerts] = useState<Tables['alerts']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();

    channelRef.current = createChannel('alerts-channel', fetchAlerts);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  return { alerts, loading, error, refetch: fetchAlerts };
}

/* ------------------------------------------------------------------ */
/* PROFILES                                                           */
/* ------------------------------------------------------------------ */
export function useProfiles() {
  const [profiles, setProfiles] = useState<Tables['profiles']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name');

      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();

    channelRef.current = createChannel('profiles-channel', fetchProfiles);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  return { profiles, loading, error, refetch: fetchProfiles };
}