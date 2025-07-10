import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOLDEN, BRONZE, LIGHT_THEME, DARK_THEME, STATUS, SEMANTIC, SECTOR_COLORS, PRIORITY_COLORS } from '@/utils/colors';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  primary: typeof GOLDEN;
  secondary: typeof BRONZE;
  background: string;
  surface: string;
  surfaceVariant: string;
  onBackground: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  shadow: string;
  status: typeof STATUS;
  semantic: typeof SEMANTIC;
  sector: typeof SECTOR_COLORS;
  priority: typeof PRIORITY_COLORS;
}

interface ThemeContextType {
  theme: ThemeColors;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  // Determinar se o tema atual é escuro
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

  // Criar objeto de cores baseado no tema atual
  const theme: ThemeColors = {
    primary: GOLDEN,
    secondary: BRONZE,
    ...(isDark ? DARK_THEME : LIGHT_THEME),
    status: STATUS,
    semantic: SEMANTIC,
    sector: SECTOR_COLORS,
    priority: PRIORITY_COLORS,
  };

  // Carregar preferência de tema do AsyncStorage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Salvar preferência de tema
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const value = {
    theme,
    themeMode,
    isDark,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}