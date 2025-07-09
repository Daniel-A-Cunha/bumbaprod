import React, { useState } from 'react';
import { useRouter } from 'expo-router';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NEUTRAL, PRIMARY_BLUE } from '@/utils/colors';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react-native';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password || (isSignUp && !name)) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
  
    setLoading(true);
    try {
      const { error } = isSignUp 
        ? await signUp(email, password, name)
        : await signIn(email, password);
  
      if (error) {
        Alert.alert('Erro', error.message);
      } else if (isSignUp) {
        Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login para continuar.');
        setIsSignUp(false);
        setName('');
        setPassword('');
      } else {
        // ✅ Redireciona para a tela principal após login com sucesso
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>BumbáProd</Text>
          <Text style={styles.subtitle}>Gestão de Alegorias</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </Text>

          {isSignUp && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Digite seu nome"
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Digite sua senha"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={NEUTRAL.mediumGray} />
                ) : (
                  <Eye size={20} color={NEUTRAL.mediumGray} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.authButton, loading && styles.authButtonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            {isSignUp ? (
              <UserPlus size={20} color={NEUTRAL.white} />
            ) : (
              <LogIn size={20} color={NEUTRAL.white} />
            )}
            <Text style={styles.authButtonText}>
              {loading ? 'Carregando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text style={styles.switchButtonText}>
              {isSignUp 
                ? 'Já tem uma conta? Faça login' 
                : 'Não tem conta? Cadastre-se'
              }
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEUTRAL.white,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 48,
    color: PRIMARY_BLUE.main,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    color: NEUTRAL.darkGray,
  },
  form: {
    backgroundColor: NEUTRAL.background,
    borderRadius: 16,
    padding: 24,
    shadowColor: NEUTRAL.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    color: NEUTRAL.black,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: NEUTRAL.darkGray,
    marginBottom: 8,
  },
  input: {
    backgroundColor: NEUTRAL.white,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: NEUTRAL.black,
    borderWidth: 1,
    borderColor: NEUTRAL.lightGray,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEUTRAL.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: NEUTRAL.lightGray,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: NEUTRAL.black,
  },
  eyeButton: {
    padding: 12,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_BLUE.main,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: NEUTRAL.white,
    marginLeft: 8,
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  switchButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: PRIMARY_BLUE.main,
  },
});