import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NEUTRAL, PRIMARY_BLUE } from '@/utils/colors';
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
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {showIcons && (
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
            <Search size={24} color={NEUTRAL.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton} onPress={onChatPress}>
            <MessageSquare size={24} color={NEUTRAL.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress}>
            <Bell size={24} color={NEUTRAL.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.avatarContainer}>
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
    backgroundColor: NEUTRAL.white,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL.lightGray,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    color: NEUTRAL.black,
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
    borderColor: PRIMARY_BLUE.light,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});