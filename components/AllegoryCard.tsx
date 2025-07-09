import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NEUTRAL, STATUS, SECTOR_COLORS } from '@/utils/colors';
import { Allegory } from '@/utils/types';
import { CircleAlert as AlertCircle, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, ArrowRight } from 'lucide-react-native';

interface AllegoryCardProps {
  allegory: Allegory;
  onPress: (allegoryId: string) => void;
}

export default function AllegoryCard({ allegory, onPress }: AllegoryCardProps) {
  const getStatusIcon = () => {
    switch (allegory.status) {
      case 'onTrack':
        return <CheckCircle size={24} color={STATUS.onTrack} />;
      case 'alert':
        return <AlertTriangle size={24} color={STATUS.alert} />;
      case 'delayed':
        return <AlertCircle size={24} color={STATUS.delayed} />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (allegory.status) {
      case 'onTrack':
        return 'Em dia';
      case 'alert':
        return 'Em alerta';
      case 'delayed':
        return 'Atrasado';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    return STATUS[allegory.status];
  };

  // Calculate average progress
  const progress = Object.values(allegory.progress).reduce((sum, value) => sum + value, 0) / 
                  Object.keys(allegory.progress).length;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(allegory.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: allegory.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{allegory.name}</Text>
          <View style={styles.statusContainer}>
            {getStatusIcon()}
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Progresso</Text>
          <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        
        <View style={styles.stagesContainer}>
          {Object.entries(allegory.progress).map(([stage, value]) => (
            <View key={stage} style={styles.stageItem}>
              <View style={styles.stageHeader}>
                <View 
                  style={[
                    styles.stageDot, 
                    { backgroundColor: SECTOR_COLORS[stage as keyof typeof SECTOR_COLORS] || NEUTRAL.darkGray }
                  ]} 
                />
                <Text style={styles.stageTitle}>
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </Text>
              </View>
              <View style={styles.stageProgressContainer}>
                <View 
                  style={[
                    styles.stageProgress, 
                    { 
                      width: `${value}%`,
                      backgroundColor: SECTOR_COLORS[stage as keyof typeof SECTOR_COLORS] || NEUTRAL.darkGray
                    }
                  ]} 
                />
              </View>
              <Text style={styles.stagePercentage}>{value}%</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.detailsButton} onPress={() => onPress(allegory.id)}>
          <Text style={styles.detailsButtonText}>Ver detalhes</Text>
          <ArrowRight size={16} color={NEUTRAL.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: NEUTRAL.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: NEUTRAL.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: NEUTRAL.black,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: NEUTRAL.darkGray,
  },
  progressPercentage: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: NEUTRAL.black,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: NEUTRAL.lightGray,
    borderRadius: 4,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: STATUS.onTrack,
    borderRadius: 4,
  },
  stagesContainer: {
    gap: 8,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  stageTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: NEUTRAL.darkGray,
  },
  stageProgressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: NEUTRAL.lightGray,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  stageProgress: {
    height: 4,
    borderRadius: 2,
  },
  stagePercentage: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: NEUTRAL.black,
    width: 40,
    textAlign: 'right',
  },
  footer: {
    alignItems: 'flex-end',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SECTOR_COLORS.structure,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  detailsButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: NEUTRAL.white,
    marginRight: 4,
  },
});