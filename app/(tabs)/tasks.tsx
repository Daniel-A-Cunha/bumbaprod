import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  StyleSheet, 
  Platform, 
  ActivityIndicator, 
  Alert
} from 'react-native';
import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import { useTasks } from '@/hooks/useSupabaseData';
import { PRIMARY_BLUE, NEUTRAL } from '@/utils/colors';
import type { Database } from '@/types/supabase';
import { CirclePlus as PlusCircle } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { mockAllegories } from '@/utils/mockData';
import { useTheme } from '@/contexts/ThemeContext';

export default function TasksScreen() {
  const { theme, isDark } = useTheme();
  const [user, setUser] = useState<any | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    status: 'todo' | 'inProgress' | 'done';
    priority: 'low' | 'medium' | 'high';
    due_date: string;
    sector: 'design' | 'structure' | 'painting' | 'electrical' | 'finishing' | 'general';
    allegory_id: string;
    created_by: string;
  }>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: new Date().toISOString(),
    sector: 'general',
    allegory_id: '',
    created_by: '',
  });

  const { 
    tasks, 
    loading: tasksLoading, 
    error: tasksError,
    createTask,
    updateTask,
    deleteTask
  } = useTasks();

  const [initialLoading, setInitialLoading] = useState(true);

  // Reset initial loading when tasks are fetched
  useEffect(() => {
    if (!tasksLoading) {
      setInitialLoading(false);
    }
  }, [tasksLoading]);

  // Auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Initial auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user);
      setLoadingUser(false);
      if (session?.user) {
        setNewTask(prev => ({ ...prev, created_by: session.user.id }));
      }
    });
  }, []);

  // Task press handler
  const handleTaskPress = useCallback((taskId: string) => {
    console.log(`Task pressed: ${taskId}`);
    // Navigate to task details
  }, []);

  // Task creation handler
  const handleCreateTask = async () => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Use a valid allegory ID from the database
      const defaultAllegoryId = '550e8400-e29b-41d4-a716-446655440001'; // Boto Encantado
      
      const taskData = {
        ...newTask,
        allegory_id: defaultAllegoryId,
        created_by: user.id
      };

      const { error: createError } = await createTask(taskData);

      if (createError) {
        throw createError;
      }

      // Fechar modal e limpar formulário
      setShowAddModal(false);
      setNewTask({
        title: '',
        description: '',
        status: 'todo' as const,
        priority: 'medium' as const,
        due_date: new Date().toISOString(),
        sector: 'general' as const,
        allegory_id: '',
        created_by: user.id,
      });
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao criar tarefa');
    }
  };

  // Task filtering
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inProgress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  // Task list renderer
  const renderTaskList = (tasks: Database['public']['Tables']['tasks']['Row'][], status: string) => {
    return (
      <View style={styles.taskListContainer}>
        <Text style={styles.statusTitle}>{status}</Text>
        <ScrollView>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={handleTaskPress}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  // Render conditions
  if (loadingUser) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Tarefas" />
        <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.primary.main} />
          <Text style={[styles.loadingText, { color: theme.onBackground }]}>Carregando...</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Tarefas" />
        <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.errorText, { color: theme.semantic.error }]}>Você precisa estar logado para acessar esta tela</Text>
        </View>
      </View>
    );
  }

  if (tasksError) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Tarefas" />
        <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.errorText, { color: theme.semantic.error }]}>Erro ao carregar tarefas</Text>
          <Text style={[styles.errorDetails, { color: theme.onSurfaceVariant }]}>tasksError}</Text>
        </View>
      </View>
    );
  }

  if (tasksLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Tarefas" />
        <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.primary.main} />
          <Text style={[styles.loadingText, { color: theme.onBackground }]}>Carregando tarefas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Tarefas" />
      
      <View style={[styles.content, { backgroundColor: theme.background }]}>
        {renderTaskList(todoTasks, 'Pendentes')}
        {renderTaskList(inProgressTasks, 'Em Progresso')}
        {renderTaskList(doneTasks, 'Concluídas')}
      </View>

      {/* Botão Flutuante para Adicionar Tarefa */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary.main }]}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <View style={styles.addButtonTextContainer}>
          <PlusCircle size={24} color={theme.surface} />
          <Text style={[styles.addButtonText, { color: theme.surface }]}>Nova</Text>
        </View>
      </TouchableOpacity>

      {/* Modal para Adicionar Tarefa */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={{ 
              fontFamily: 'Roboto-Bold', 
              fontSize: 20, 
              color: theme.onSurface,
              marginBottom: 24 
            }}>
              Nova Tarefa
            </Text>

            <View style={styles.formRow}>
              <Text style={[styles.formLabel, { color: theme.onSurface }]}>Título</Text>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: theme.surfaceVariant, 
                  borderColor: theme.outline,
                  color: theme.onSurface
                }]}
                value={newTask.title}
                onChangeText={text => setNewTask(prev => ({ ...prev, title: text }))}
                placeholder="Digite o título da tarefa"
              />
            </View>

            <View style={styles.formRow}>
              <Text style={[styles.formLabel, { color: theme.onSurface }]}>Descrição</Text>
              <TextInput
                style={[styles.formInput, { 
                  height: 100, 
                  textAlignVertical: 'top',
                  backgroundColor: theme.surfaceVariant, 
                  borderColor: theme.outline,
                  color: theme.onSurface
                }]}
                value={newTask.description}
                onChangeText={text => setNewTask(prev => ({ ...prev, description: text }))}
                placeholder="Digite a descrição da tarefa"
                multiline
              />
            </View>

            <View style={styles.formRow}>
              <Text style={[styles.formLabel, { color: theme.onSurface }]}>Prioridade</Text>
              <View style={styles.priorityPicker}>
                <TouchableOpacity
                  style={[
                    styles.priorityButton, 
                    { borderColor: theme.outline, backgroundColor: theme.surfaceVariant },
                    newTask.priority === 'low' && { backgroundColor: theme.primary.main, borderColor: theme.primary.main }
                  ]}
                  onPress={() => setNewTask(prev => ({ ...prev, priority: 'low' }))}
                >
                  <Text style={[
                    styles.priorityText, 
                    { color: theme.onSurfaceVariant },
                    newTask.priority === 'low' && { color: theme.surface }
                  ]}>Baixa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.priorityButton, 
                    { borderColor: theme.outline, backgroundColor: theme.surfaceVariant },
                    newTask.priority === 'medium' && { backgroundColor: theme.primary.main, borderColor: theme.primary.main }
                  ]}
                  onPress={() => setNewTask(prev => ({ ...prev, priority: 'medium' }))}
                >
                  <Text style={[
                    styles.priorityText, 
                    { color: theme.onSurfaceVariant },
                    newTask.priority === 'medium' && { color: theme.surface }
                  ]}>Média</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.priorityButton, 
                    { borderColor: theme.outline, backgroundColor: theme.surfaceVariant },
                    newTask.priority === 'high' && { backgroundColor: theme.primary.main, borderColor: theme.primary.main }
                  ]}
                  onPress={() => setNewTask(prev => ({ ...prev, priority: 'high' }))}
                >
                  <Text style={[
                    styles.priorityText, 
                    { color: theme.onSurfaceVariant },
                    newTask.priority === 'high' && { color: theme.surface }
                  ]}>Alta</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formRow}>
              <Text style={[styles.formLabel, { color: theme.onSurface }]}>Setor</Text>
              <View style={styles.sectorPicker}>
                {['design', 'structure', 'painting', 'electrical', 'finishing', 'general'].map(sector => (
                  <TouchableOpacity
                    key={sector}
                    style={[
                      styles.sectorButton, 
                      { borderColor: theme.outline, backgroundColor: theme.surfaceVariant },
                      newTask.sector === sector && { backgroundColor: theme.primary.main, borderColor: theme.primary.main }
                    ]}
                    onPress={() => setNewTask(prev => ({ ...prev, sector: sector as typeof newTask.sector }))}
                  >
                    <Text style={[
                      styles.sectorText, 
                      { color: theme.onSurfaceVariant },
                      newTask.sector === sector && { color: theme.surface }
                    ]}>
                      {sector.charAt(0).toUpperCase() + sector.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary.main }]}
              onPress={handleCreateTask}
            >
              <Text style={[styles.buttonText, { color: theme.surface }]}>Criar Tarefa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 16 }}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={{ color: theme.onSurfaceVariant }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );