import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { NEUTRAL, PRIMARY_BLUE, SECTOR_COLORS, SECONDARY_RED, SEMANTIC } from '@/utils/colors';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Camera, LogOut, QrCode, Settings, User as UserIcon, CreditCard as Edit2, Save, X, Clock, MapPin } from 'lucide-react-native';

export default function ProfileScreen() {
  const { profile, signOut, updateProfile, loading, user } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: profile?.name || '',
    sector: profile?.sector || 'general',
  });
  const [notifications, setNotifications] = useState({
    taskReminders: true,
    materialAlerts: true,
    teamUpdates: false,
    systemNotifications: true,
  });

  const handleSaveProfile = async () => {
    try {
      const { error } = await updateProfile(editedProfile);
      if (error) {
        Alert.alert('Erro', 'Não foi possível atualizar o perfil');
      } else {
        setIsEditModalVisible(false);
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado');
    }
  };

  const handleSaveSettings = () => {
    console.log('Configurações salvas:', notifications);
    setIsSettingsModalVisible(false);
    Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
  };

  const handleCheckIn = () => {
    Alert.alert(
      'Check-in',
      'Funcionalidade de check-in será implementada com QR Code',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: signOut }
      ]
    );
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Header title="Perfil" showIcons={false} />
        <View style={styles.loadingContainer}>
          {loading ? (
            <>
              <ActivityIndicator size="large" color={PRIMARY_BLUE.main} />
              <Text style={styles.loadingText}>Carregando perfil...</Text>
            </>
          ) : (
            <>
              <Text style={styles.errorText}>
                Perfil não encontrado. Tente fazer logout e login novamente.
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  Alert.alert(
                    'Recarregar perfil',
                    'Deseja tentar recarregar o perfil?',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      { 
                        text: 'Tentar novamente', 
                        onPress: () => {
                          if (user) {
                            // Force profile refetch by signing out and back in
                            signOut();
                          }
                        }
                      }
                    ]
                  );
                }}
              >
                <Text style={styles.retryButtonText}>Tentar novamente</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  }

  const EditProfileModal = () => (
    <Modal
      visible={isEditModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsEditModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity
              onPress={() => setIsEditModalVisible(false)}
              style={styles.closeButton}
            >
              <X size={24} color={NEUTRAL.darkGray} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm}>
            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput
              style={styles.input}
              value={editedProfile.name}
              onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
              placeholder="Digite seu nome"
            />

            <Text style={styles.inputLabel}>Setor</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.sectorPicker}
            >
              {Object.entries(SECTOR_COLORS).map(([sector, color]) => (
                <TouchableOpacity
                  key={sector}
                  style={[
                    styles.sectorOption,
                    editedProfile.sector === sector && { backgroundColor: color }
                  ]}
                  onPress={() => setEditedProfile({ ...editedProfile, sector: sector as any })}
                >
                  <Text style={[
                    styles.sectorOptionText,
                    editedProfile.sector === sector && styles.sectorOptionTextSelected
                  ]}>
                    {sector.charAt(0).toUpperCase() + sector.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ScrollView>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
          >
            <Save size={20} color={NEUTRAL.white} />
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const SettingsModal = () => (
    <Modal
      visible={isSettingsModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsSettingsModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Configurações</Text>
            <TouchableOpacity
              onPress={() => setIsSettingsModalVisible(false)}
              style={styles.closeButton}
            >
              <X size={24} color={NEUTRAL.darkGray} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm}>
            <Text style={styles.sectionTitle}>Notificações</Text>
            
            {Object.entries(notifications).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={styles.settingItem}
                onPress={() => setNotifications({ ...notifications, [key]: !value })}
              >
                <Text style={styles.settingLabel}>
                  {key === 'taskReminders' ? 'Lembretes de Tarefas' :
                   key === 'materialAlerts' ? 'Alertas de Material' :
                   key === 'teamUpdates' ? 'Atualizações da Equipe' :
                   'Notificações do Sistema'}
                </Text>
                <View style={[styles.toggle, value && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Sobre</Text>
            <View style={styles.aboutContainer}>
              <Text style={styles.aboutText}>BumbáLog v1.0.0</Text>
              <Text style={styles.aboutText}>Sistema de Gestão de Alegorias</Text>
              <Text style={styles.aboutSubtext}>
                Desenvolvido para otimizar a produção e acompanhamento de alegorias de boi-bumbá
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveSettings}
          >
            <Save size={20} color={NEUTRAL.white} />
            <Text style={styles.saveButtonText}>Salvar Configurações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Header title="Perfil" showIcons={false} />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profile.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Camera size={16} color={NEUTRAL.white} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{profile.name}</Text>
          <View style={[styles.roleContainer, { backgroundColor: SECTOR_COLORS[profile.sector] }]}>
            <Text style={styles.roleText}>
              {profile.role === 'admin' ? 'Administrador' :
               profile.role === 'manager' ? 'Gerente' : 'Trabalhador'}
            </Text>
          </View>
          <Text style={styles.sectorText}>
            Setor: {profile.sector.charAt(0).toUpperCase() + profile.sector.slice(1)}
          </Text>

          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => {
              setEditedProfile({
                name: profile.name,
                sector: profile.sector,
              });
              setIsEditModalVisible(true);
            }}
          >
            <Edit2 size={16} color={PRIMARY_BLUE.main} />
            <Text style={styles.editProfileText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCheckIn}>
            <QrCode size={24} color={PRIMARY_BLUE.main} />
            <Text style={styles.actionButtonText}>Check-in</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Notificações', 'Funcionalidade em desenvolvimento')}
          >
            <Bell size={24} color={PRIMARY_BLUE.main} />
            <Text style={styles.actionButtonText}>Notificações</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setIsSettingsModalVisible(true)}
          >
            <Settings size={24} color={PRIMARY_BLUE.main} />
            <Text style={styles.actionButtonText}>Configurações</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Tarefas Concluídas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Projetos Ativos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>45h</Text>
              <Text style={styles.statLabel}>Horas Trabalhadas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Taxa de Presença</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={SECONDARY_RED.main} />
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>

      <EditProfileModal />
      <SettingsModal />
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
    color: NEUTRAL.mediumGray,
  },
  errorText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: SECONDARY_RED.main,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: PRIMARY_BLUE.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: NEUTRAL.white,
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: NEUTRAL.white,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL.lightGray,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: PRIMARY_BLUE.main,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: PRIMARY_BLUE.main,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: NEUTRAL.white,
  },
  userName: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    color: NEUTRAL.black,
    marginBottom: 8,
  },
  roleContainer: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  roleText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: NEUTRAL.white,
  },
  sectorText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: NEUTRAL.darkGray,
    marginBottom: 16,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: NEUTRAL.lightGray,
    borderRadius: 20,
  },
  editProfileText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: PRIMARY_BLUE.main,
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: NEUTRAL.white,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL.lightGray,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: NEUTRAL.darkGray,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: NEUTRAL.black,
    marginBottom: 16,
  },
  statsContainer: {
    padding: 16,
    backgroundColor: NEUTRAL.white,
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: NEUTRAL.lightGray,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: NEUTRAL.lightGray,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    color: PRIMARY_BLUE.main,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    color: NEUTRAL.darkGray,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: NEUTRAL.white,
    marginTop: 24,
    marginBottom: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: NEUTRAL.lightGray,
  },
  logoutButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: SECONDARY_RED.main,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: NEUTRAL.white,
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    color: NEUTRAL.black,
  },
  closeButton: {
    padding: 4,
  },
  modalForm: {
    maxHeight: 400,
  },
  inputLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: NEUTRAL.darkGray,
    marginBottom: 8,
  },
  input: {
    backgroundColor: NEUTRAL.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: NEUTRAL.black,
  },
  sectorPicker: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sectorOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: NEUTRAL.lightGray,
    marginRight: 8,
  },
  sectorOptionText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: NEUTRAL.darkGray,
  },
  sectorOptionTextSelected: {
    color: NEUTRAL.white,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL.lightGray,
  },
  settingLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: NEUTRAL.black,
    flex: 1,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: NEUTRAL.lightGray,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: PRIMARY_BLUE.main,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: NEUTRAL.white,
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  aboutContainer: {
    backgroundColor: NEUTRAL.lightGray,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  aboutText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: NEUTRAL.black,
    marginBottom: 4,
  },
  aboutSubtext: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: NEUTRAL.darkGray,
    marginTop: 8,
    lineHeight: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_BLUE.main,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: NEUTRAL.white,
    marginLeft: 8,
  },
});