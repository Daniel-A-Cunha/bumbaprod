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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEUTRAL.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: NEUTRAL.darkGray,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: NEUTRAL.red,
    textAlign: 'center',
  },
  errorDetails: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: NEUTRAL.darkGray,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  taskListContainer: {
    marginBottom: 16,
  },
  statusTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: NEUTRAL.darkGray,
    marginBottom: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: PRIMARY_BLUE.main,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: NEUTRAL.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: NEUTRAL.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  priorityPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  priorityButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: NEUTRAL.lightGray,
    marginHorizontal: 4,
  },
  prioritySelected: {
    backgroundColor: PRIMARY_BLUE.main,
    borderColor: PRIMARY_BLUE.main,
  },
  priorityText: {
    textAlign: 'center',
    color: NEUTRAL.darkGray,
    fontFamily: 'Inter_500Medium',
  },
  priorityTextSelected: {
    color: NEUTRAL.white,
  },
  sectorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 8,
  },
  sectorButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: NEUTRAL.lightGray,
    margin: 4,
  },
  sectorSelected: {
    backgroundColor: PRIMARY_BLUE.main,
    borderColor: PRIMARY_BLUE.main,
  },
  sectorText: {
    textAlign: 'center',
    color: NEUTRAL.darkGray,
    fontFamily: 'Inter_500Medium',
  },
  sectorTextSelected: {
    color: NEUTRAL.white,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: NEUTRAL.white,
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
  },
  formRow: {
    marginBottom: 16,
  },
  formLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: NEUTRAL.darkGray,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: NEUTRAL.lightGray,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  button: {
    backgroundColor: PRIMARY_BLUE.main,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: NEUTRAL.white,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
  },
});

export default function TasksScreen() {
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

      // Use the first mock allegory as a placeholder
      const defaultAllegoryId = mockAllegories.length > 0 ? mockAllegories[0].id : null;
      
      if (!defaultAllegoryId) {
        throw new Error('Nenhuma alegoria disponível para associar à tarefa');
      }
      const { error: createError } = await createTask({
        ...newTask,
        allegory_id: defaultAllegoryId,
        created_by: user.id
      });

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
      <View style={styles.container}>
        <Header title="Tarefas" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_BLUE.main} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="Tarefas" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Você precisa estar logado para acessar esta tela</Text>
        </View>
      </View>
    );
  }

  if (tasksError) {
    return (
      <View style={styles.container}>
        <Header title="Tarefas" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar tarefas</Text>
          <Text style={styles.errorDetails}>{tasksError}</Text>
        </View>
      </View>
    );
  }

  if (tasksLoading) {
    return (
      <View style={styles.container}>
        <Header title="Tarefas" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_BLUE.main} />
          <Text style={styles.loadingText}>Carregando tarefas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Tarefas" />
      
      <View style={styles.content}>
        {renderTaskList(todoTasks, 'Pendentes')}
        {renderTaskList(inProgressTasks, 'Em Progresso')}
        {renderTaskList(doneTasks, 'Concluídas')}
      </View>

      {/* Botão Flutuante para Adicionar Tarefa */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <View style={styles.addButtonTextContainer}>
          <PlusCircle size={24} color={NEUTRAL.white} />
          <Text style={styles.addButtonText}>Nova Tarefa</Text>
        </View>
      </TouchableOpacity>

      {/* Modal para Adicionar Tarefa */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ 
              fontFamily: 'Inter_700Bold', 
              fontSize: 20, 
              color: NEUTRAL.darkGray,
              marginBottom: 24 
            }}>
              Nova Tarefa
            </Text>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Título</Text>
              <TextInput
                style={styles.formInput}
                value={newTask.title}
                onChangeText={text => setNewTask(prev => ({ ...prev, title: text }))}
                placeholder="Digite o título da tarefa"
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Descrição</Text>
              <TextInput
                style={[styles.formInput, { height: 100, textAlignVertical: 'top' }]}
                value={newTask.description}
                onChangeText={text => setNewTask(prev => ({ ...prev, description: text }))}
                placeholder="Digite a descrição da tarefa"
                multiline
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Prioridade</Text>
              <View style={styles.priorityPicker}>
                <TouchableOpacity
                  style={[styles.priorityButton, newTask.priority === 'low' && styles.prioritySelected]}
                  onPress={() => setNewTask(prev => ({ ...prev, priority: 'low' }))}
                >
                  <Text style={[styles.priorityText, newTask.priority === 'low' && styles.priorityTextSelected]}>Baixa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.priorityButton, newTask.priority === 'medium' && styles.prioritySelected]}
                  onPress={() => setNewTask(prev => ({ ...prev, priority: 'medium' }))}
                >
                  <Text style={[styles.priorityText, newTask.priority === 'medium' && styles.priorityTextSelected]}>Média</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.priorityButton, newTask.priority === 'high' && styles.prioritySelected]}
                  onPress={() => setNewTask(prev => ({ ...prev, priority: 'high' }))}
                >
                  <Text style={[styles.priorityText, newTask.priority === 'high' && styles.priorityTextSelected]}>Alta</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Setor</Text>
              <View style={styles.sectorPicker}>
                {['design', 'structure', 'painting', 'electrical', 'finishing', 'general'].map(sector => (
                  <TouchableOpacity
                    key={sector}
                    style={[styles.sectorButton, newTask.sector === sector && styles.sectorSelected]}
                    onPress={() => setNewTask(prev => ({ ...prev, sector: sector as typeof newTask.sector }))}
                  >
                    <Text style={[styles.sectorText, newTask.sector === sector && styles.sectorTextSelected]}>
                      {sector.charAt(0).toUpperCase() + sector.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.button}>
              <TouchableOpacity onPress={handleCreateTask}>
                <Text style={styles.buttonText}>Criar Tarefa</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{ marginTop: 16 }}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={{ color: NEUTRAL.darkGray }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}