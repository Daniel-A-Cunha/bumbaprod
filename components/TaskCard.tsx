import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NEUTRAL, SECTOR_COLORS, PRIORITY_COLORS } from '@/utils/colors';
import { Task } from '@/utils/types';
import { CalendarClock, Users } from 'lucide-react-native';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'inProgress' | 'done';
    allegory_id: string;
    due_date: string;
    priority: 'low' | 'medium' | 'high';
    created_at: string;
    sector: 'design' | 'structure' | 'painting' | 'electrical' | 'finishing' | 'general';
  };
  onPress: (taskId: string) => void;
}

export default function TaskCard({ task, onPress }: TaskCardProps) {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Data não definida';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getSectorColor = () => {
    return NEUTRAL.darkGray; // Removendo referência ao setor que não existe
  };

  const getPriorityColor = () => {
    return PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS] || NEUTRAL.mediumGray;
  };

  const getStatusBgColor = () => {
    switch (task.status) {
      case 'todo':
        return NEUTRAL.lightGray;
      case 'inProgress':
        return '#64B5F6'; // Light blue
      case 'done':
        return '#81C784'; // Light green
      default:
        return NEUTRAL.lightGray;
    }
  };

  const getStatusText = () => {
    switch (task.status) {
      case 'todo':
        return 'A Fazer';
      case 'inProgress':
        return 'Em Execução';
      case 'done':
        return 'Concluído';
      default:
        return 'Status não definido';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(task.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor() }]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.statusTag, { backgroundColor: getStatusBgColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>
        
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{task.description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.infoItem}>
            <CalendarClock size={16} color={NEUTRAL.darkGray} />
            <Text style={styles.infoText}>{formatDate(task.due_date)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Users size={16} color={NEUTRAL.darkGray} />
            <Text style={styles.infoText}>{task.created_at?.split('T')[0]}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const STATUS_COLORS = {
  todo: NEUTRAL.lightGray,
  inProgress: '#64B5F6', // Light blue
  done: '#81C784', // Light green
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: NEUTRAL.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: NEUTRAL.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  priorityIndicator: {
    width: 8,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: NEUTRAL.darkGray,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: NEUTRAL.mediumGray,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: NEUTRAL.mediumGray,
    marginLeft: 4,
  },
});