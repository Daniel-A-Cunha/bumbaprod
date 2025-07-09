import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NEUTRAL, SEMANTIC } from '@/utils/colors';
import { Alert as AlertType } from '@/utils/types';
import { CircleAlert as AlertCircle, Clock, Package, Users, Zap } from 'lucide-react-native';

interface AlertCardProps {
  alert: AlertType;
  onPress: (alertId: string) => void;
}

export default function AlertCard({ alert, onPress }: AlertCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getAlertIcon = () => {
    switch (alert.type) {
      case 'task':
        return <Clock size={20} color={getAlertColor()} />;
      case 'material':
        return <Package size={20} color={getAlertColor()} />;
      case 'bottleneck':
        return <Zap size={20} color={getAlertColor()} />;
      case 'team':
        return <Users size={20} color={getAlertColor()} />;
      default:
        return <AlertCircle size={20} color={getAlertColor()} />;
    }
  };

  const getAlertColor = () => {
    switch (alert.severity) {
      case 'info':
        return SEMANTIC.info;
      case 'warning':
        return SEMANTIC.warning;
      case 'critical':
        return SEMANTIC.error;
      default:
        return SEMANTIC.info;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !alert.read && styles.unreadContainer
      ]}
      onPress={() => onPress(alert.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: getAlertColor() }]}>
        {getAlertIcon()}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{alert.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{alert.description}</Text>
        <Text style={styles.timestamp}>{formatDate(alert.createdAt)}</Text>
      </View>
      
      {!alert.read && <View style={styles.unreadIndicator} />}
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
  unreadContainer: {
    backgroundColor: 'rgba(30, 136, 229, 0.05)', // Light blue background
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: NEUTRAL.black,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: NEUTRAL.darkGray,
    marginBottom: 8,
  },
  timestamp: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: NEUTRAL.mediumGray,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SEMANTIC.info,
    marginLeft: 8,
    alignSelf: 'center',
  },
});