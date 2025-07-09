import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { NEUTRAL, PRIMARY_BLUE, SEMANTIC } from '@/utils/colors';
import Header from '@/components/Header';
import MaterialCard from '@/components/MaterialCard';
import { useMaterials } from '@/hooks/useSupabaseData';
import { CirclePlus as PlusCircle, Search, Filter, TriangleAlert as AlertTriangle } from 'lucide-react-native';

export default function MaterialsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const { materials, loading, error } = useMaterials();

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Materiais" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_BLUE.main} />
          <Text style={styles.loadingText}>Carregando materiais...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title="Materiais" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar materiais: {error}</Text>
        </View>
      </View>
    );
  }
  
  const filteredMaterials = materials
    .filter(material => 
      (material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       material.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!showLowStockOnly || material.current_stock <= material.minimum_stock)
    )
    .sort((a, b) => {
      // Sort by low stock first, then alphabetically
      const aIsLow = a.current_stock <= a.minimum_stock;
      const bIsLow = b.current_stock <= b.minimum_stock;
      
      if (aIsLow && !bIsLow) return -1;
      if (!aIsLow && bIsLow) return 1;
      return a.name.localeCompare(b.name);
    });

  const lowStockCount = materials.filter(m => m.current_stock <= m.minimum_stock).length;

  const handleMaterialPress = (materialId: string) => {
    console.log(`Material pressed: ${materialId}`);
    // Navigate to material details
  };

  return (
    <View style={styles.container}>
      <Header title="Materiais" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={NEUTRAL.mediumGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar materiais..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            showLowStockOnly && styles.activeFilterButton
          ]}
          onPress={() => setShowLowStockOnly(!showLowStockOnly)}
        >
          <AlertTriangle size={16} color={showLowStockOnly ? NEUTRAL.white : SEMANTIC.warning} />
          <Text style={[
            styles.filterButtonText,
            showLowStockOnly && styles.activeFilterButtonText
          ]}>
            Estoque baixo ({lowStockCount})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sortButton}>
          <Filter size={16} color={NEUTRAL.darkGray} />
          <Text style={styles.sortButtonText}>Filtrar</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredMaterials}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MaterialCard
            material={{
              id: item.id,
              name: item.name,
              category: item.category,
              unit: item.unit,
              currentStock: item.current_stock,
              minimumStock: item.minimum_stock,
              consumption: item.consumption?.map(c => ({
                allegoryId: c.allegory_id,
                amount: c.amount
              })) || []
            }}
            onPress={handleMaterialPress}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum material encontrado</Text>
          </View>
        }
      />
      
      <TouchableOpacity style={styles.addButton}>
        <PlusCircle size={24} color={NEUTRAL.white} />
      </TouchableOpacity>
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
  searchContainer: {
    padding: 16,
    backgroundColor: NEUTRAL.white,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL.lightGray,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEUTRAL.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: NEUTRAL.black,
    marginLeft: 8,
    paddingVertical: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: NEUTRAL.white,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL.lightGray,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEUTRAL.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: SEMANTIC.warning,
  },
  filterButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: NEUTRAL.darkGray,
    marginLeft: 4,
  },
  activeFilterButtonText: {
    color: NEUTRAL.white,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEUTRAL.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  sortButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: NEUTRAL.darkGray,
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
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY_BLUE.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: NEUTRAL.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});