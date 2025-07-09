import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NEUTRAL, SEMANTIC } from '@/utils/colors';
import { Material } from '@/utils/types';
import { Package, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface MaterialCardProps {
  material: Material;
  onPress: (materialId: string) => void;
}

export default function MaterialCard({ material, onPress }: MaterialCardProps) {
  const isLowStock = material.currentStock <= material.minimumStock;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isLowStock && styles.lowStockContainer
      ]}
      onPress={() => onPress(material.id)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Package size={24} color={NEUTRAL.darkGray} />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{material.name}</Text>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{material.category}</Text>
          </View>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.stockLabel}>Estoque atual:</Text>
          <Text style={[
            styles.stockValue,
            isLowStock && styles.lowStockValue
          ]}>
            {material.currentStock} {material.unit}
          </Text>
          
          {isLowStock && (
            <View style={styles.warningContainer}>
              <AlertTriangle size={16} color={SEMANTIC.warning} />
              <Text style={styles.warningText}>Estoque baixo</Text>
            </View>
          )}
        </View>
        
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${Math.min(100, (material.currentStock / material.minimumStock) * 100)}%`,
                backgroundColor: isLowStock ? SEMANTIC.warning : SEMANTIC.success
              }
            ]} 
          />
        </View>
        
        <Text style={styles.minimumStockText}>
          Estoque mínimo: {material.minimumStock} {material.unit}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: NEUTRAL.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: NEUTRAL.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lowStockContainer: {
    borderLeftWidth: 4,
    borderLeftColor: SEMANTIC.warning,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: NEUTRAL.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: NEUTRAL.black,
    flex: 1,
    marginRight: 8,
  },
  categoryContainer: {
    backgroundColor: NEUTRAL.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  category: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    color: NEUTRAL.darkGray,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stockLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: NEUTRAL.darkGray,
    marginRight: 4,
  },
  stockValue: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    color: NEUTRAL.black,
    marginRight: 8,
  },
  lowStockValue: {
    color: SEMANTIC.warning,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    color: SEMANTIC.warning,
    marginLeft: 4,
  },
  progressContainer: {
    height: 6,
    backgroundColor: NEUTRAL.lightGray,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  minimumStockText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: NEUTRAL.mediumGray,
  },
});