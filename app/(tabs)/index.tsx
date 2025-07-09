import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { NEUTRAL, PRIMARY_BLUE, SEMANTIC } from '@/utils/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useAllegories, useTasks, useMaterials, useAlerts } from '@/hooks/useSupabaseData';
import { ClipboardList, Package, Bell, User, TrendingUp, AlertTriangle } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const { allegories, loading: allegoriesLoading } = useAllegories();
  const { tasks, loading: tasksLoading } = useTasks();
  const { materials, loading: materialsLoading } = useMaterials();
  const { alerts, loading: alertsLoading } = useAlerts();

  // Show loading state while data is being fetched
  if (allegoriesLoading || tasksLoading || materialsLoading || alertsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_BLUE.main} />
        <Text style={styles.loadingText}>Carregando dados...</Text>
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BumbáProd</Text>
        <Text style={styles.subtitle}>Gestão de Alegorias</Text>
        {profile && (
          <Text style={styles.welcome}>Olá, {profile.name}!</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Resumo Geral</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color={SEMANTIC.success} />
            <Text style={styles.statNumber}>{completedTasks}</Text>
            <Text style={styles.statLabel}>Tarefas Concluídas</Text>
          </View>
          
          <View style={styles.statCard}>
            <ClipboardList size={24} color={PRIMARY_BLUE.main} />
            <Text style={styles.statNumber}>{pendingTasks}</Text>
            <Text style={styles.statLabel}>Tarefas Pendentes</Text>
          </View>
          
          <View style={styles.statCard}>
            <Package size={24} color={lowStockMaterials > 0 ? SEMANTIC.warning : SEMANTIC.success} />
            <Text style={[
              styles.statNumber,
              lowStockMaterials > 0 && { color: SEMANTIC.warning }
            ]}>
              {lowStockMaterials}
            </Text>
            <Text style={styles.statLabel}>Materiais em Falta</Text>
          </View>
          
          <View style={styles.statCard}>
            <AlertTriangle size={24} color={delayedAllegories > 0 ? SEMANTIC.error : SEMANTIC.success} />
            <Text style={[
              styles.statNumber,
              delayedAllegories > 0 && { color: SEMANTIC.error }
            ]}>
              {delayedAllegories}
            </Text>
            <Text style={styles.statLabel}>Alegorias Atrasadas</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        
        <View style={styles.buttonGrid}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(tabs)/tasks')}
          >
            <ClipboardList size={32} color={PRIMARY_BLUE.main} />
            <Text style={styles.buttonText}>Tarefas</Text>
            {inProgressTasks > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{inProgressTasks}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(tabs)/materials')}
          >
            <Package size={32} color={PRIMARY_BLUE.main} />
            <Text style={styles.buttonText}>Materiais</Text>
            {lowStockMaterials > 0 && (
              <View style={[styles.badge, { backgroundColor: SEMANTIC.warning }]}>
                <Text style={styles.badgeText}>{lowStockMaterials}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(tabs)/alerts')}
          >
            <Bell size={32} color={PRIMARY_BLUE.main} />
            <Text style={styles.buttonText}>Alertas</Text>
            {unreadAlerts > 0 && (
              <View style={[styles.badge, { backgroundColor: SEMANTIC.error }]}>
                <Text style={styles.badgeText}>{unreadAlerts}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <User size={32} color={PRIMARY_BLUE.main} />
            <Text style={styles.buttonText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Debug info to confirm Supabase connection */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>Status da Conexão</Text>
        <Text style={styles.debugText}>Alegorias: {allegories.length}</Text>
        <Text style={styles.debugText}>Tarefas: {tasks.length}</Text>
        <Text style={styles.debugText}>Materiais: {materials.length}</Text>
        <Text style={styles.debugText}>Alertas: {alerts.length}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEUTRAL.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NEUTRAL.background,
  },
  loadingText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: NEUTRAL.darkGray,
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    backgroundColor: NEUTRAL.white,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL.lightGray,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 48,
    color: PRIMARY_BLUE.main,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    color: NEUTRAL.darkGray,
    marginBottom: 8,
  },
  welcome: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: PRIMARY_BLUE.main,
  },
  statsContainer: {
    padding: 20,
    backgroundColor: NEUTRAL.white,
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: NEUTRAL.lightGray,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    color: NEUTRAL.black,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: NEUTRAL.lightGray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    color: NEUTRAL.black,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    color: NEUTRAL.darkGray,
    textAlign: 'center',
  },
  buttonsContainer: {
    padding: 20,
    backgroundColor: NEUTRAL.white,
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: NEUTRAL.lightGray,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    height: 120,
    backgroundColor: NEUTRAL.background,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: NEUTRAL.black,
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
    color: NEUTRAL.darkGray,
    marginTop: 8,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: PRIMARY_BLUE.main,
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
    color: NEUTRAL.white,
  },
  debugContainer: {
    padding: 20,
    backgroundColor: NEUTRAL.white,
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: NEUTRAL.lightGray,
  },
  debugTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: NEUTRAL.black,
    marginBottom: 8,
  },
  debugText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: NEUTRAL.darkGray,
    marginBottom: 4,
  },
});