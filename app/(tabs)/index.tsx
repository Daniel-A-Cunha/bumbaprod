import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAllegories, useTasks, useMaterials, useAlerts } from '@/hooks/useSupabaseData';
import { ClipboardList, Package, Bell, User, TrendingUp, AlertTriangle } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const { theme } = useTheme();
  const { allegories, loading: allegoriesLoading } = useAllegories();
  const { tasks, loading: tasksLoading } = useTasks();
  const { materials, loading: materialsLoading } = useMaterials();
  const { alerts, loading: alertsLoading } = useAlerts();

  // Show loading state while data is being fetched
  if (allegoriesLoading || tasksLoading || materialsLoading || alertsLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary.main} />
        <Text style={[styles.loadingText, { color: theme.onBackground }]}>Carregando dados...</Text>
      </View>
    );
  }

  // Calculate statistics from Supabase data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const pendingTasks = tasks.filter(task => task.status === 'todo').length;
  const inProgressTasks = tasks.filter(task => task.status === 'inProgress').length;
  
  const lowStockMaterials = materials.filter(
    material => material.current_stock <= material.minimum_stock
  ).length;
  
  const unreadAlerts = alerts.filter(alert => !alert.read).length;
  
  const delayedAllegories = allegories.filter(
    allegory => allegory.status === 'delayed'
  ).length;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.outline }]}>
        <Text style={[styles.title, { color: theme.primary.main }]}>BumbáProd</Text>
        <Text style={[styles.subtitle, { color: theme.onSurface }]}>Gestão de Alegorias</Text>
        {profile && (
          <Text style={[styles.welcome, { color: theme.primary.main }]}>Olá, {profile.name}!</Text>
        )}
      </View>

      <View style={[styles.statsContainer, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
        <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Resumo Geral</Text>
        
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.surfaceVariant }]}>
            <TrendingUp size={24} color={theme.semantic.success} />
            <Text style={[styles.statNumber, { color: theme.onSurface }]}>{completedTasks}</Text>
            <Text style={[styles.statLabel, { color: theme.onSurfaceVariant }]}>Tarefas Concluídas</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.surfaceVariant }]}>
            <ClipboardList size={24} color={theme.primary.main} />
            <Text style={[styles.statNumber, { color: theme.onSurface }]}>{pendingTasks}</Text>
            <Text style={[styles.statLabel, { color: theme.onSurfaceVariant }]}>Tarefas Pendentes</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.surfaceVariant }]}>
            <Package size={24} color={lowStockMaterials > 0 ? theme.semantic.warning : theme.semantic.success} />
            <Text style={[
              styles.statNumber,
              { color: theme.onSurface },
              lowStockMaterials > 0 && { color: theme.semantic.warning }
            ]}>
              {lowStockMaterials}
            </Text>
            <Text style={[styles.statLabel, { color: theme.onSurfaceVariant }]}>Materiais em Falta</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.surfaceVariant }]}>
            <AlertTriangle size={24} color={delayedAllegories > 0 ? theme.semantic.error : theme.semantic.success} />
            <Text style={[
              styles.statNumber,
              { color: theme.onSurface },
              delayedAllegories > 0 && { color: theme.semantic.error }
            ]}>
              {delayedAllegories}
            </Text>
            <Text style={[styles.statLabel, { color: theme.onSurfaceVariant }]}>Alegorias Atrasadas</Text>
          </View>
        </View>
      </View>

      <View style={[styles.buttonsContainer, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
        <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Acesso Rápido</Text>
        
        <View style={styles.buttonGrid}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.surfaceVariant, shadowColor: theme.shadow }]}
            onPress={() => router.push('/(tabs)/tasks')}
          >
            <ClipboardList size={32} color={theme.primary.main} />
            <Text style={[styles.buttonText, { color: theme.onSurface }]}>Tarefas</Text>
            {inProgressTasks > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.primary.main }]}>
                <Text style={[styles.badgeText, { color: theme.surface }]}>{inProgressTasks}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.surfaceVariant, shadowColor: theme.shadow }]}
            onPress={() => router.push('/(tabs)/materials')}
          >
            <Package size={32} color={theme.primary.main} />
            <Text style={[styles.buttonText, { color: theme.onSurface }]}>Materiais</Text>
            {lowStockMaterials > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.semantic.warning }]}>
                <Text style={[styles.badgeText, { color: theme.surface }]}>{lowStockMaterials}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.surfaceVariant, shadowColor: theme.shadow }]}
            onPress={() => router.push('/(tabs)/alerts')}
          >
            <Bell size={32} color={theme.primary.main} />
            <Text style={[styles.buttonText, { color: theme.onSurface }]}>Alertas</Text>
            {unreadAlerts > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.semantic.error }]}>
                <Text style={[styles.badgeText, { color: theme.surface }]}>{unreadAlerts}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.surfaceVariant, shadowColor: theme.shadow }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <User size={32} color={theme.primary.main} />
            <Text style={[styles.buttonText, { color: theme.onSurface }]}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Debug info to confirm Supabase connection */}
      <View style={[styles.debugContainer, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
        <Text style={[styles.debugTitle, { color: theme.onSurface }]}>Status da Conexão</Text>
        <Text style={[styles.debugText, { color: theme.onSurfaceVariant }]}>Alegorias: {allegories.length}</Text>
        <Text style={[styles.debugText, { color: theme.onSurfaceVariant }]}>Tarefas: {tasks.length}</Text>
        <Text style={[styles.debugText, { color: theme.onSurfaceVariant }]}>Materiais: {materials.length}</Text>
        <Text style={[styles.debugText, { color: theme.onSurfaceVariant }]}>Alertas: {alerts.length}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 48,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    marginBottom: 8,
  },
  welcome: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  statsContainer: {
    padding: 20,
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    textAlign: 'center',
  },
  buttonsContainer: {
    padding: 20,
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    height: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
    position: 'relative',
  },
  buttonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginTop: 8,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 12,
  },
  debugContainer: {
    padding: 20,
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  debugTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    marginBottom: 8,
  },
  debugText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    marginBottom: 4,
  },
});