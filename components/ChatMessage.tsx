import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NEUTRAL, PRIMARY_BLUE } from '@/utils/colors';
import { ChatMessage as ChatMessageType } from '@/utils/types';
import { currentUser } from '@/utils/mockData';

interface ChatMessageProps {
  message: ChatMessageType;
  onImagePress?: (imageUrl: string) => void;
}

export default function ChatMessage({ message, onImagePress }: ChatMessageProps) {
  const isCurrentUser = message.senderId === currentUser.id;
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      {!isCurrentUser && (
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {message.senderName.charAt(0)}
          </Text>
        </View>
      )}
      
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessageContainer : styles.otherUserMessageContainer
      ]}>
        {!isCurrentUser && (
          <Text style={styles.senderName}>{message.senderName}</Text>
        )}
        
        <Text style={styles.messageText}>{message.message}</Text>
        
        {message.imageUrl && (
          <TouchableOpacity 
            style={styles.imageContainer} 
            onPress={() => onImagePress && onImagePress(message.imageUrl!)}
          >
            <Image
              source={{ uri: message.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        
        <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PRIMARY_BLUE.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    color: NEUTRAL.white,
  },
  messageContainer: {
    borderRadius: 16,
    padding: 12,
    maxWidth: '100%',
  },
  currentUserMessageContainer: {
    backgroundColor: PRIMARY_BLUE.main,
    borderBottomRightRadius: 4,
  },
  otherUserMessageContainer: {
    backgroundColor: NEUTRAL.lightGray,
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    color: NEUTRAL.darkGray,
    marginBottom: 4,
  },
  messageText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: NEUTRAL.black,
  },
  imageContainer: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  timestamp: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: NEUTRAL.mediumGray,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});