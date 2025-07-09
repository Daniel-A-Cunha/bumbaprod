import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import AuthScreen from '@/components/AuthScreen';
import { NEUTRAL } from '@/utils/colors';

export default function IndexScreen() {
  const { session, loading } = useAuth();

  if (loading) {
    return <View style={styles.loading} />;
  }

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return <AuthScreen />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: NEUTRAL.white,
  },
});