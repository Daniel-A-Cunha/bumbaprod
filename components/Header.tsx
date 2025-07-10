import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Bell, MessageSquare, Search } from 'lucide-react-native';
import { currentUser } from '@/utils/mockData';

interface HeaderProps {
  title: string;
  showIcons?: boolean;
  onSearchPress?: () => void;
  onChatPress?: () => void;
  onNotificationPress?: () => void;
}

export default function Header({
  title,
  showIcons = true,
  onSearchPress,
  onChatPress,
  onNotificationPress,
}: HeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderBottomColor: theme.outline }]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.onSurface }]}>{title}</Text>
      </View>
      
      {showIcons && (
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
            <Search size={24} color={theme.onSurfaceVariant} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton} onPress={onChatPress}>
            <MessageSquare size={24} color={theme.onSurfaceVariant} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress}>
            <Bell size={24} color={theme.onSurfaceVariant} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.avatarContainer, { borderColor: theme.primary.light }]}>
            <Image
              source={{ uri: currentUser.avatar }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  avatarContainer: {
    marginLeft: 8,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});