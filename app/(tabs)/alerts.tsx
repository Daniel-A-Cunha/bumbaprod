import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { NEUTRAL, PRIMARY_BLUE, SEMANTIC } from '@/utils/colors';
import Header from '@/components/Header';
import AlertCard from '@/components/AlertCard';
import { useAlerts } from '@/hooks/useSupabaseData';
import { CheckCheck } from 'lucide-react-native';

export default function AlertsScreen() {
  const [filterType, setFilterType] = useState<string | null>(null);
  const { alerts, loading, error } = useAlerts();
  
  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Alertas" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_BLUE.main} />
          <Text style={styles.loadingText}>Carregando alertas...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title="Alertas" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar alertas: {error}</Text>
        </View>
      </View>
    );
  }
  
  const filteredAlerts = filterType
    ? alerts.filter(alert => alert.type === filterType)
    : alerts;
    
  const unreadCount = alerts.filter(alert => !alert.read).length;

  const handleAlertPress = (alertId: string) => {
    console.log(`Alert pressed: ${alertId}`);
    // Navigate to alert details or mark as read
  };

  const handleMarkAllRead = () => {
    console.log('Mark all as read');
    // Mark all alerts as read
  };

  return (
    <View style={styles.container}>
      <Header title="Alertas" />
      
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === null && styles.activeFilterButton
            ]}
            onPress={() => setFilterType(null)}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === null && styles.activeFilterButtonText
            ]}>
              Todos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'task' && styles.activeFilterButton
            ]}
            onPress={() => setFilterType('task')}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === 'task' && styles.activeFilterButtonText
            ]}>
              Tarefas
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'material' && styles.activeFilterButton
            ]}
            onPress={() => setFilterType('material')}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === 'material' && styles.activeFilterButtonText
            ]}>
              Materiais
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'bottleneck' && styles.activeFilterButton
            ]}
            onPress={() => setFilterType('bottleneck')}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === 'bottleneck' && styles.activeFilterButtonText
            ]}>
              Gargalos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'team' && styles.activeFilterButton
            ]}
            onPress={() => setFilterType('team')}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === 'team' && styles.activeFilterButtonText
            ]}>
              Equipes
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <View style={styles.headerContainer}>
        <View style={styles.unreadContainer}>
          <Text style={styles.unreadText}>
            {unreadCount} não {unreadCount === 1 ? 'lido' : 'lidos'}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.markAllReadButton} onPress={handleMarkAllRead}>
          <CheckCheck size={16} color={PRIMARY_BLUE.main} />
          <Text style={styles.markAllReadText}>Marcar todos como lidos</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredAlerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlertCard
            alert={{
              id: item.id,
              type: item.type,
              title: item.title,
              description: item.description,
              relatedId: item.related_id || '',
              createdAt: item.created_at,
              read: item.read,
              severity: item.severity
            }}
            onPress={handleAlertPress}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum alerta encontrado</Text>
          </View>
        }
      />
    </View>
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
  },
  loadingText: {
    fontFamily: 'Roboto-Medium',
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
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: SEMANTIC.error,
    textAlign: 'center',
  },
  filterContainer: {
    backgroundColor: NEUTRAL.white,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL.lightGray,
    paddingVertical: 8,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: NEUTRAL.lightGray,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: PRIMARY_BLUE.main,
  },
  filterButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: NEUTRAL.darkGray,
  },
  activeFilterButtonText: {
    color: NEUTRAL.white,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  unreadContainer: {
    backgroundColor: PRIMARY_BLUE.light,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  unreadText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: NEUTRAL.white,
  },
  markAllReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllReadText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: PRIMARY_BLUE.main,
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: NEUTRAL.mediumGray,
  },
});